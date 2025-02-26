
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Parameter } from "@/types/parameters";
import { SAMPLE_PARAMETERS } from "@/data/sampleParameters";
import { ParameterForm } from "@/components/parameters/ParameterForm";
import { ParameterCard } from "@/components/parameters/ParameterCard";

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
          <DialogContent className="max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Parameter</DialogTitle>
              <DialogDescription>
                Create a new parameter with custom tweaks
              </DialogDescription>
            </DialogHeader>
            <ParameterForm
              param={newParameter}
              setParam={setNewParameter}
              onCancel={() => {
                setIsAddOpen(false);
                setNewParameter({ name: "", tweaks: [{ title: "", content: "" }] });
              }}
              onSubmit={handleAddParameter}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {parameters.map((parameter) => (
          <ParameterCard
            key={parameter.id}
            parameter={parameter}
            onEdit={(param) => {
              setEditingParameter(param);
              setIsEditOpen(true);
            }}
            onDelete={handleDeleteParameter}
          />
        ))}

        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent className="max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Parameter</DialogTitle>
              <DialogDescription>
                Modify parameter details and tweaks
              </DialogDescription>
            </DialogHeader>
            {editingParameter && (
              <ParameterForm
                isEdit
                param={editingParameter}
                setParam={setEditingParameter}
                onCancel={() => {
                  setIsEditOpen(false);
                  setEditingParameter(null);
                }}
                onSubmit={handleEditParameter}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
