export type ButtonCategory = "gaming" | "humour" | "film" | "meme" | "musique" | "sfx" | "autre";

export interface SoundButton {
  title: string;
  description?: string;
  video?: string;
  keywords?: string[];
  category?: ButtonCategory;
  type?: "data" | "user";
  fullPath?: string;
  fav?: boolean;
  videoUrl?: string;
  _paused?: boolean;
}

