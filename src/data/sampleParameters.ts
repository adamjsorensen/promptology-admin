
import { Parameter } from "@/types/parameters";

export const SAMPLE_PARAMETERS: Parameter[] = [
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
