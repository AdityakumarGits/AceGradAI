import { Upload, FileText, X } from "lucide-react";
import DifficultySelector from "./DifficultySelector";

export default function ResumeTab({
  selectedDifficulty,
  onSelectDifficulty,
  resumeFile,
  onResumeFileChange,
}) {
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (file.type !== "application/pdf") {
      onResumeFileChange(null);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      onResumeFileChange(null);
      return;
    }

    onResumeFileChange(file);
  };

  const removeFile = () => {
    onResumeFileChange(null);
  };

  return (
    <div className="space-y-5">
      <label
        htmlFor="resume-upload"
        className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[rgba(255,255,255,0.15)] bg-[#030712]/40 px-6 py-10 text-center transition hover:border-[#d90000]/50"
      >
        <Upload
          size={28}
          className="mb-3 text-[rgba(234,236,240,0.5)]"
        />

        <p className="text-sm font-medium text-[#eaecf0]">
          Click to upload
        </p>

        <p className="mt-1 text-xs text-[rgba(234,236,240,0.5)]">
          PDF only (max 5MB)
        </p>

        <input
          id="resume-upload"
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          className="hidden"
        />
      </label>

      {resumeFile && (
        <div className="flex items-center justify-between rounded-xl border border-[#6366f1]/30 bg-[#6366f1]/10 px-4 py-3">
          <div className="flex min-w-0 items-center gap-3">
            <FileText
              size={20}
              className="shrink-0 text-[#6366f1]"
            />

            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-[#eaecf0]">
                {resumeFile.name}
              </p>

              <p className="text-xs text-[rgba(234,236,240,0.5)]">
                {(resumeFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={removeFile}
            className="rounded-lg p-1.5 text-[rgba(234,236,240,0.5)] transition hover:bg-white/10 hover:text-white"
          >
            <X size={16} />
          </button>
        </div>
      )}

      <DifficultySelector
        selected={selectedDifficulty}
        onSelect={onSelectDifficulty}
      />
    </div>
  );
}