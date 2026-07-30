import { Upload } from "lucide-react";
import DifficultySelector from "./DifficultySelector";

export default function ResumeTab({ selectedDifficulty, onSelectDifficulty }) {
  return (
    <div className="space-y-5">
      <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[rgba(255,255,255,0.15)] bg-[#030712]/40 px-6 py-10 text-center transition hover:border-[#d90000]/50">
        <Upload size={28} className="mb-3 text-[rgba(234,236,240,0.5)]" />
        <p className="text-sm font-medium text-[#eaecf0]">
          Click to upload or drag & drop
        </p>
        <p className="mt-1 text-xs text-[rgba(234,236,240,0.5)]">
          PDF or DOCX (max 5MB)
        </p>
      </div>

      <DifficultySelector selected={selectedDifficulty} onSelect={onSelectDifficulty} />
    </div>
  );
}