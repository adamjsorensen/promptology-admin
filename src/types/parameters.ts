
export type Tweak = {
  title: string;
  content: string;
};

export type Parameter = {
  id: number;
  name: string;
  tweaks: Tweak[];
};
