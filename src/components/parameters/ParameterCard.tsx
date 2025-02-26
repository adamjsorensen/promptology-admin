
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Parameter } from "@/types/parameters";
import { Pencil, Trash2 } from "lucide-react";

interface ParameterCardProps {
  parameter: Parameter;
  onEdit: (parameter: Parameter) => void;
  onDelete: (id: number) => void;
}

export function ParameterCard({ parameter, onEdit, onDelete }: ParameterCardProps) {
  return (
    <Card className="hover:shadow-sm transition-shadow">
      <CardHeader>
        <CardTitle className="flex justify-between items-start">
          <span>{parameter.name}</span>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(parameter)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(parameter.id)}
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
  );
}
