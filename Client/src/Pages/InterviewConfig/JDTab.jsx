export default function JDTab({
  jobTitle,
  onJobTitleChange,
  jobDescription,
  onJobDescriptionChange,
}) {
  return (
    <div className="space-y-4">

      {/* Job Title */}
      <div>
        <label className="mb-2 block text-sm font-medium text-[#eaecf0]">
          Job Title
        </label>

        <input
          type="text"
          value={jobTitle}
          onChange={(e) => onJobTitleChange(e.target.value)}
          placeholder="e.g. Backend Developer"
          maxLength={100}
          required
          className="w-full rounded-xl border border-[rgba(255,255,255,0.10)] bg-[#030712]/60 px-4 py-3 text-white placeholder:text-[rgba(234,236,240,0.4)] outline-none transition focus:border-[#d90000]"
        />
      </div>

      {/* Job Description */}
      <div>
        <label className="mb-2 block text-sm font-medium text-[#eaecf0]">
          Job Description
        </label>

        <textarea
          value={jobDescription}
          onChange={(e) =>
            onJobDescriptionChange(e.target.value)
          }
          rows={5}
          maxLength={10000}
          required
          placeholder="Paste the job description here..."
          className="w-full resize-none rounded-xl border border-[rgba(255,255,255,0.10)] bg-[#030712]/60 px-4 py-3 text-white placeholder:text-[rgba(234,236,240,0.4)] outline-none transition focus:border-[#d90000]"
        />

        <div className="mt-1 text-right text-xs text-[rgba(234,236,240,0.4)]">
          {jobDescription.length}/10000
        </div>
      </div>

    </div>
  );
}