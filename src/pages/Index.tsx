
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

type Prompt = {
  id: number;
  name: string;
  description: string;
  parameters: number;
};

const SAMPLE_PROMPTS: Prompt[] = [
  {
    id: 1,
    name: "Sales Email",
    description: "Generate persuasive sales emails",
    parameters: 3,
  },
  {
    id: 2,
    name: "Blog Post",
    description: "Create engaging blog content",
    parameters: 5,
  },
];

export default function Index() {
  const [isOpen, setIsOpen] = useState(false);
  const [prompts, setPrompts] = useState<Prompt[]>(SAMPLE_PROMPTS);
  const [newPrompt, setNewPrompt] = useState({
    name: "",
    description: "",
  });

  const handleCreatePrompt = () => {
    if (newPrompt.name.trim() === "") {
      toast.error("Prompt name cannot be empty");
      return;
    }

    if (newPrompt.description.trim() === "") {
      toast.error("Prompt description cannot be empty");
      return;
    }

    const prompt: Prompt = {
      id: Date.now(),
      name: newPrompt.name.trim(),
      description: newPrompt.description.trim(),
      parameters: 0,
    };

    setPrompts([...prompts, prompt]);
    setNewPrompt({ name: "", description: "" });
    setIsOpen(false);
    toast.success("Prompt created successfully");
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
              <div className="flex justify-end gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setIsOpen(false);
                    setNewPrompt({ name: "", description: "" });
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
                <TableCell>{prompt.parameters}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button size="icon" variant="ghost">
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
    </div>
  );
}
