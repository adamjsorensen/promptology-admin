
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { toast } from "sonner";

type Tweak = {
  title: string;
  content: string;
};

type Parameter = {
  id: number;
  name: string;
  tweaks: Tweak[];
};

const SAMPLE_PARAMETERS: Parameter[] = [
  {
    id: 1,
    name: "Target Audience",
    tweaks: [
      { title: "Head of Marketing", content: "You are writing to a Head of Marketing who values data-driven insights and strategic thinking." },
      { title: "CEO", content: "You are writing to a CEO who focuses on high-level business impact and ROI." },
      { title: "Sales Manager", content: "You are writing to a Sales Manager who cares about pipeline growth and team performance." },
    ],
  },
  {
    id: 2,
    name: "Tone",
    tweaks: [
      { title: "Professional", content: "Maintain a formal and business-appropriate tone throughout the content." },
      { title: "Casual", content: "Use a friendly and conversational tone, as if speaking to a colleague." },
      { title: "Urgent", content: "Emphasize immediacy and critical timing in the message." },
    ],
  },
];

export default function Parameters() {
  const [parameters, setParameters] = useState<Parameter[]>(SAMPLE_PARAMETERS);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingParameter, setEditingParameter] = useState<Parameter | null>(null);
  const [newParameter, setNewParameter] = useState<Omit<Parameter, "id">>({
    name: "",
    tweaks: [{ title: "", content: "" }],
  });

  const handleAddParameter = () => {
    if (newParameter.name.trim() === "") {
      toast.error("Parameter name cannot be empty");
      return;
    }

    const validTweaks = newParameter.tweaks.filter(
      tweak => tweak.title.trim() !== "" && tweak.content.trim() !== ""
    );
    if (validTweaks.length === 0) {
      toast.error("At least one complete tweak is required");
      return;
    }

    setParameters([
      ...parameters,
      {
        id: Date.now(),
        name: newParameter.name,
        tweaks: validTweaks,
      },
    ]);
    setNewParameter({ name: "", tweaks: [{ title: "", content: "" }] });
    setIsAddOpen(false);
    toast.success("Parameter added successfully");
  };

  const handleEditParameter = () => {
    if (!editingParameter) return;
    
    if (editingParameter.name.trim() === "") {
      toast.error("Parameter name cannot be empty");
      return;
    }

    const validTweaks = editingParameter.tweaks.filter(
      tweak => tweak.title.trim() !== "" && tweak.content.trim() !== ""
    );
    if (validTweaks.length === 0) {
      toast.error("At least one complete tweak is required");
      return;
    }

    setParameters(parameters.map(param =>
      param.id === editingParameter.id
        ? { ...editingParameter, tweaks: validTweaks }
        : param
    ));
    setIsEditOpen(false);
    setEditingParameter(null);
    toast.success("Parameter updated successfully");
  };

  const handleDeleteParameter = (id: number) => {
    setParameters(parameters.filter(param => param.id !== id));
    toast.success("Parameter deleted successfully");
  };

  const ParameterForm = ({ isEdit = false }: { isEdit?: boolean }) => {
    const param = isEdit ? editingParameter : newParameter;
    const setParam = isEdit
      ? setEditingParameter as (value: Parameter | null) => void
      : setNewParameter;

    if (!param || !setParam) return null;

    return (
      <div className="space-y-4 pt-4">
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
          <div className="space-y-4">
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
                  <Input
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
          <Button
            variant="outline"
            onClick={() => {
              if (isEdit) {
                setIsEditOpen(false);
                setEditingParameter(null);
              } else {
                setIsAddOpen(false);
                setNewParameter({ name: "", tweaks: [{ title: "", content: "" }] });
              }
            }}
          >
            Cancel
          </Button>
          <Button onClick={isEdit ? handleEditParameter : handleAddParameter}>
            {isEdit ? "Update Parameter" : "Add Parameter"}
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="animate-fadeIn">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Parameters</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage parameters and their tweaks
          </p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Add Parameter
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Parameter</DialogTitle>
              <DialogDescription>
                Create a new parameter with custom tweaks
              </DialogDescription>
            </DialogHeader>
            <ParameterForm />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {parameters.map((parameter) => (
          <Card key={parameter.id} className="hover:shadow-sm transition-shadow">
            <CardHeader>
              <CardTitle className="flex justify-between items-start">
                <span>{parameter.name}</span>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setEditingParameter(parameter);
                      setIsEditOpen(true);
                    }}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteParameter(parameter.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardTitle>
              <CardDescription>
                {parameter.tweaks.length} available tweaks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {parameter.tweaks.map((tweak) => (
                  <span
                    key={tweak.title}
                    className="px-2 py-1 bg-accent rounded text-sm"
                    title={tweak.content}
                  >
                    {tweak.title}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}

        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Parameter</DialogTitle>
              <DialogDescription>
                Modify parameter details and tweaks
              </DialogDescription>
            </DialogHeader>
            <ParameterForm isEdit />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
