
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2 } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Parameter, PromptParameter, Prompt } from "@/types/parameters";
import { ParameterSelector } from "@/components/prompts/ParameterSelector";
import { SAMPLE_PARAMETERS } from "@/data/sampleParameters";

const SAMPLE_PROMPTS = [
  {
    id: 1,
    name: "Sales Email",
    description: "Generate persuasive sales emails",
    basePrompt: "Write a persuasive sales email that convinces the reader to learn more about our product.",
    parameters: [
      {
        parameterId: 1,
        enabledTweaks: ["Head of Marketing", "CEO"],
      },
      {
        parameterId: 2,
        enabledTweaks: ["Professional", "Urgent"],
      },
    ],
  },
  {
    id: 2,
    name: "Blog Post",
    description: "Create engaging blog content",
    basePrompt: "Write an informative blog post that educates and engages the reader.",
    parameters: [
      {
        parameterId: 2,
        enabledTweaks: ["Casual"],
      },
    ],
  },
];

export default function Index() {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [prompts, setPrompts] = useState(SAMPLE_PROMPTS);
  const [newPrompt, setNewPrompt] = useState<Omit<Prompt, 'id'>>({
    name: "",
    description: "",
    basePrompt: "",
    parameters: [],
  });
  const [editingPrompt, setEditingPrompt] = useState<Prompt | null>(null);
  const [availableParameters] = useState<Parameter[]>(SAMPLE_PARAMETERS);

  const getParameterCount = (parameters: PromptParameter[]) => {
    return parameters.reduce((acc, param) => acc + param.enabledTweaks.length, 0);
  };

  const getParameterSummary = (parameters: PromptParameter[]) => {
    return parameters.map(param => {
      const parameter = availableParameters.find(p => p.id === param.parameterId);
      if (!parameter) return '';
      return `${parameter.name} (${param.enabledTweaks.length} tweaks)`;
    }).join(', ');
  };

  const handleCreatePrompt = () => {
    if (newPrompt.name.trim() === "") {
      toast.error("Prompt name cannot be empty");
      return;
    }

    if (newPrompt.description.trim() === "") {
      toast.error("Prompt description cannot be empty");
      return;
    }

    if (newPrompt.basePrompt.trim() === "") {
      toast.error("Base prompt cannot be empty");
      return;
    }

    const prompt: Prompt = {
      id: Date.now(),
      name: newPrompt.name.trim(),
      description: newPrompt.description.trim(),
      basePrompt: newPrompt.basePrompt.trim(),
      parameters: newPrompt.parameters,
    };

    setPrompts([...prompts, prompt]);
    setNewPrompt({ name: "", description: "", basePrompt: "", parameters: [] });
    setIsOpen(false);
    toast.success("Prompt created successfully");
  };

  const handleEditPrompt = () => {
    if (!editingPrompt) return;

    if (editingPrompt.name.trim() === "") {
      toast.error("Prompt name cannot be empty");
      return;
    }

    if (editingPrompt.description.trim() === "") {
      toast.error("Prompt description cannot be empty");
      return;
    }

    if (editingPrompt.basePrompt.trim() === "") {
      toast.error("Base prompt cannot be empty");
      return;
    }

    setPrompts(prompts.map(prompt =>
      prompt.id === editingPrompt.id ? editingPrompt : prompt
    ));
    setEditingPrompt(null);
    setIsEditOpen(false);
    toast.success("Prompt updated successfully");
  };

  const handleDeletePrompt = (id: number) => {
    setPrompts(prompts.filter((prompt) => prompt.id !== id));
    toast.success("Prompt deleted successfully");
  };

  return (
    <div className="animate-fadeIn">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Prompts</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your content generation prompts
          </p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Add Prompt
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Prompt</DialogTitle>
              <DialogDescription>
                Create a new prompt for content generation
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input 
                  id="name" 
                  placeholder="e.g., Sales Email"
                  value={newPrompt.name}
                  onChange={(e) => setNewPrompt({ ...newPrompt, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe what this prompt does..."
                  value={newPrompt.description}
                  onChange={(e) => setNewPrompt({ ...newPrompt, description: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="basePrompt">Base Prompt</Label>
                <Textarea
                  id="basePrompt"
                  placeholder="Enter the base prompt that will be enhanced with parameters..."
                  value={newPrompt.basePrompt}
                  onChange={(e) => setNewPrompt({ ...newPrompt, basePrompt: e.target.value })}
                  className="min-h-[100px]"
                />
              </div>
              <div className="space-y-2">
                <Label>Parameters</Label>
                <ParameterSelector
                  availableParameters={availableParameters}
                  selectedParameters={newPrompt.parameters}
                  onChange={(parameters) =>
                    setNewPrompt({ ...newPrompt, parameters })
                  }
                />
              </div>
              <div className="flex justify-end gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setIsOpen(false);
                    setNewPrompt({ name: "", description: "", basePrompt: "", parameters: [] });
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={handleCreatePrompt}>Create Prompt</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Parameters</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {prompts.map((prompt) => (
              <TableRow key={prompt.id}>
                <TableCell className="font-medium">{prompt.name}</TableCell>
                <TableCell>{prompt.description}</TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <span className="font-medium">
                      {getParameterCount(prompt.parameters)} tweaks enabled
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {getParameterSummary(prompt.parameters)}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button 
                      size="icon" 
                      variant="ghost"
                      onClick={() => {
                        setEditingPrompt(prompt);
                        setIsEditOpen(true);
                      }}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button 
                      size="icon" 
                      variant="ghost"
                      onClick={() => handleDeletePrompt(prompt.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Prompt</DialogTitle>
            <DialogDescription>
              Modify prompt details and parameters
            </DialogDescription>
          </DialogHeader>
          {editingPrompt && (
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Name</Label>
                <Input 
                  id="edit-name" 
                  value={editingPrompt.name}
                  onChange={(e) => setEditingPrompt({ 
                    ...editingPrompt, 
                    name: e.target.value 
                  })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={editingPrompt.description}
                  onChange={(e) => setEditingPrompt({ 
                    ...editingPrompt, 
                    description: e.target.value 
                  })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-basePrompt">Base Prompt</Label>
                <Textarea
                  id="edit-basePrompt"
                  value={editingPrompt.basePrompt}
                  onChange={(e) => setEditingPrompt({ 
                    ...editingPrompt, 
                    basePrompt: e.target.value 
                  })}
                  className="min-h-[100px]"
                />
              </div>
              <div className="space-y-2">
                <Label>Parameters</Label>
                <ParameterSelector
                  availableParameters={availableParameters}
                  selectedParameters={editingPrompt.parameters}
                  onChange={(parameters) =>
                    setEditingPrompt({ ...editingPrompt, parameters })
                  }
                />
              </div>
              <div className="flex justify-end gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setIsEditOpen(false);
                    setEditingPrompt(null);
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={handleEditPrompt}>Update Prompt</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
