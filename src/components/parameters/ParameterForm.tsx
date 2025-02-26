
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, X } from "lucide-react";
import { Parameter, Tweak } from "@/types/parameters";

interface ParameterFormProps {
  isEdit?: boolean;
  param: Omit<Parameter, "id"> | Parameter;
  setParam: (value: any) => void;
  onCancel: () => void;
  onSubmit: () => void;
}

export function ParameterForm({ isEdit = false, param, setParam, onCancel, onSubmit }: ParameterFormProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Parameter Name</Label>
        <Input
          id="name"
          value={param.name}
          onChange={e => setParam({ ...param, name: e.target.value })}
          placeholder="e.g., Writing Style"
        />
      </div>
      <div className="space-y-2">
        <Label>Tweaks</Label>
        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
          {param.tweaks.map((tweak, index) => (
            <div key={index} className="space-y-2 p-4 border rounded-lg relative">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-2 top-2"
                onClick={() => {
                  const newTweaks = param.tweaks.filter((_, i) => i !== index);
                  setParam({
                    ...param,
                    tweaks: newTweaks.length ? newTweaks : [{ title: "", content: "" }],
                  });
                }}
              >
                <X className="h-4 w-4" />
              </Button>
              <div>
                <Label>Title (Visible to Users)</Label>
                <Input
                  value={tweak.title}
                  onChange={e => {
                    const newTweaks = [...param.tweaks];
                    newTweaks[index] = { ...tweak, title: e.target.value };
                    setParam({ ...param, tweaks: newTweaks });
                  }}
                  placeholder="e.g., Professional"
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Content (Added to Prompt)</Label>
                <Textarea
                  value={tweak.content}
                  onChange={e => {
                    const newTweaks = [...param.tweaks];
                    newTweaks[index] = { ...tweak, content: e.target.value };
                    setParam({ ...param, tweaks: newTweaks });
                  }}
                  placeholder="e.g., Maintain a formal and business-appropriate tone"
                  className="mt-1"
                />
              </div>
            </div>
          ))}
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="mt-2"
          onClick={() => setParam({
            ...param,
            tweaks: [...param.tweaks, { title: "", content: "" }],
          })}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Tweak
        </Button>
      </div>
      <div className="flex justify-end gap-3 pt-4">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={onSubmit}>
          {isEdit ? "Update Parameter" : "Add Parameter"}
        </Button>
      </div>
    </div>
  );
}
