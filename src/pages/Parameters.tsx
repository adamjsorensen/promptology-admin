
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus } from "lucide-react";

const SAMPLE_PARAMETERS = [
  {
    id: 1,
    name: "Target Audience",
    tweaks: ["Head of Marketing", "CEO", "Sales Manager"],
  },
  {
    id: 2,
    name: "Tone",
    tweaks: ["Professional", "Casual", "Urgent"],
  },
];

export default function Parameters() {
  return (
    <div className="animate-fadeIn">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Parameters</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage parameters and their tweaks
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Add Parameter
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {SAMPLE_PARAMETERS.map((parameter) => (
          <Card key={parameter.id} className="hover:shadow-sm transition-shadow">
            <CardHeader>
              <CardTitle>{parameter.name}</CardTitle>
              <CardDescription>
                {parameter.tweaks.length} available tweaks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {parameter.tweaks.map((tweak) => (
                  <span
                    key={tweak}
                    className="px-2 py-1 bg-accent rounded text-sm"
                  >
                    {tweak}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
