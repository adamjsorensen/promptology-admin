
export type Tweak = {
  title: string;
  content: string;
};

export type Parameter = {
  id: number;
  name: string;
  tweaks: Tweak[];
};

export type PromptParameter = {
  parameterId: number;
  enabledTweaks: string[]; // Stores the titles of enabled tweaks
};

export type Prompt = {
  id: number;
  name: string;
  description: string;
  basePrompt: string;
  parameters: PromptParameter[];
};
