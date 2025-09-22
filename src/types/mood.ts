export type MoodType = "bad" | "neutral" | "good";

export interface Todo {
  id: string;
  text: string;
  done: boolean;
}

export interface DayData {
  date: string; // YYYY-MM-DD format
  mood?: MoodType;
  description?: string;
  todos: Todo[];
}

export const MOOD_ICONS = {
  bad: "❌",
  neutral: "😐",
  good: "✅",
} as const;

export const MOOD_COLORS = {
  bad: "mood-bad-light",
  neutral: "mood-neutral-light", 
  good: "mood-good-light",
} as const;