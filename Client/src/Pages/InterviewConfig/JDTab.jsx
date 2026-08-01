export default function JDTab({ jobTitle, onJobTitleChange, jobDescription, onJobDescriptionChange }) {
  return (
    <div className="space-y-4">
      <div>
        <label className="mb-2 block text-sm font-medium text-[#eaecf0]">
          Job Title
        </label>
        <input
          type="text"
          value={jobTitle}
          onChange={(e) => onJobTitleChange(e.target.value)}
          placeholder="e.g. Backend Developer"
          className="w-full rounded-xl border border-[rgba(255,255,255,0.10)] bg-[#030712]/60 px-4 py-3 text-white placeholder:text-[rgba(234,236,240,0.4)] outline-none transition focus:border-[#d90000]"
        />
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-[#eaecf0]">
          Job Description
        </label>
        <textarea
          value={jobDescription}
          onChange={(e) => onJobDescriptionChange(e.target.value)}
          rows={5}
          placeholder="Paste the job description here..."
          className="w-full resize-none rounded-xl border border-[rgba(255,255,255,0.10)] bg-[#030712]/60 px-4 py-3 text-white placeholder:text-[rgba(234,236,240,0.4)] outline-none transition focus:border-[#d90000]"
        />
      </div>
    </div>
  );
}