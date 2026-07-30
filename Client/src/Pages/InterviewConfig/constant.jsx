import { FileText, Upload, ListTree } from "lucide-react";

export const TABS = [
  { id: "jd", label: "Job Description", icon: FileText },
  { id: "resume", label: "Resume", icon: Upload },
  { id: "topics", label: "Select Topics", icon: ListTree },
];

export const TOPIC_SUGGESTIONS = [
  "React", "Node.js", "JavaScript", "System Design",
  "DSA", "MongoDB", "Python", "SQL", "DevOps", "TypeScript",
];

export const DIFFICULTY_LEVELS = [
  { label: "Easy", value: "easy" },
  { label: "Medium", value: "medium" },
  { label: "Hard", value: "hard" },
];