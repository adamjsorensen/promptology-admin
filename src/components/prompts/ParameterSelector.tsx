
import { Parameter, PromptParameter } from "@/types/parameters";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";

interface ParameterSelectorProps {
  availableParameters: Parameter[];
  selectedParameters: PromptParameter[];
  onChange: (parameters: PromptParameter[]) => void;
}

export function ParameterSelector({
  availableParameters,
  selectedParameters,
  onChange,
}: ParameterSelectorProps) {
  const handleToggleParameter = (parameter: Parameter) => {
    const isSelected = selectedParameters.some(
      (p) => p.parameterId === parameter.id
    );

    if (isSelected) {
      onChange(
        selectedParameters.filter((p) => p.parameterId !== parameter.id)
      );
    } else {
      onChange([
        ...selectedParameters,
        {
          parameterId: parameter.id,
          enabledTweaks: parameter.tweaks.map((t) => t.title),
        },
      ]);
    }
  };

  const handleToggleTweak = (parameterId: number, tweakTitle: string) => {
    onChange(
      selectedParameters.map((param) => {
        if (param.parameterId === parameterId) {
          const hasTitle = param.enabledTweaks.includes(tweakTitle);
          return {
            ...param,
            enabledTweaks: hasTitle
              ? param.enabledTweaks.filter((t) => t !== tweakTitle)
              : [...param.enabledTweaks, tweakTitle],
          };
        }
        return param;
      })
    );
  };

  const getParameter = (id: number) => 
    availableParameters.find((p) => p.id === id);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {availableParameters.map((parameter) => (
          <Button
            key={parameter.id}
            variant={
              selectedParameters.some((p) => p.parameterId === parameter.id)
                ? "default"
                : "outline"
            }
            size="sm"
            onClick={() => handleToggleParameter(parameter)}
          >
            {parameter.name}
          </Button>
        ))}
      </div>

      {selectedParameters.length > 0 && (
        <Accordion type="multiple" className="w-full">
          {selectedParameters.map((param) => {
            const parameter = getParameter(param.parameterId);
            if (!parameter) return null;

            return (
              <AccordionItem key={param.parameterId} value={param.parameterId.toString()}>
                <div className="flex items-center justify-between">
                  <AccordionTrigger className="flex-1">
                    {parameter.name}
                  </AccordionTrigger>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="mr-4"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleParameter(parameter);
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <AccordionContent>
                  <div className="space-y-2 p-2">
                    {parameter.tweaks.map((tweak) => (
                      <div key={tweak.title} className="flex items-center space-x-2">
                        <Checkbox
                          id={`${param.parameterId}-${tweak.title}`}
                          checked={param.enabledTweaks.includes(tweak.title)}
                          onCheckedChange={() =>
                            handleToggleTweak(param.parameterId, tweak.title)
                          }
                        />
                        <label
                          htmlFor={`${param.parameterId}-${tweak.title}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {tweak.title}
                        </label>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      )}
    </div>
  );
}
