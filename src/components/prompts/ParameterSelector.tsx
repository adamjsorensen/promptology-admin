
import { Parameter, PromptParameter } from "@/types/parameters";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, X, Search } from "lucide-react";
import { useState } from "react";

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
  const [searchQuery, setSearchQuery] = useState("");

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

  const filteredParameters = availableParameters.filter(
    (parameter) =>
      parameter.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      parameter.tweaks.some((tweak) =>
        tweak.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  const selectedIds = selectedParameters.map((p) => p.parameterId);
  const unselectedParameters = filteredParameters.filter(
    (p) => !selectedIds.includes(p.id)
  );

  return (
    <div className="space-y-4">
      {/* Search Box */}
      <div className="relative">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search parameters..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Available Parameters */}
      {unselectedParameters.length > 0 && (
        <div className="rounded-md border p-4 bg-muted/50">
          <h4 className="text-sm font-medium mb-2">Available Parameters</h4>
          <div className="flex flex-wrap gap-2">
            {unselectedParameters.map((parameter) => (
              <Button
                key={parameter.id}
                variant="outline"
                size="sm"
                onClick={() => handleToggleParameter(parameter)}
                className="gap-1.5"
              >
                <Plus className="h-3.5 w-3.5" />
                {parameter.name}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Selected Parameters */}
      {selectedParameters.length > 0 && (
        <div className="rounded-md border">
          <div className="p-4 border-b bg-muted/50">
            <h4 className="text-sm font-medium">Selected Parameters</h4>
          </div>
          <Accordion type="multiple" className="w-full">
            {selectedParameters.map((param) => {
              const parameter = getParameter(param.parameterId);
              if (!parameter) return null;

              const enabledCount = param.enabledTweaks.length;
              const totalCount = parameter.tweaks.length;

              return (
                <AccordionItem key={param.parameterId} value={param.parameterId.toString()}>
                  <div className="flex items-center justify-between">
                    <AccordionTrigger className="flex-1">
                      <div className="flex items-center gap-2">
                        <span>{parameter.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {enabledCount}/{totalCount} tweaks enabled
                        </span>
                      </div>
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
                    <div className="space-y-2 p-4">
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
        </div>
      )}
    </div>
  );
}
