const DIFFICULTY_LEVELS = [
  {
    value: "fresher",
    label: "Easy",
  },
  {
    value: "junior",
    label: "Medium",
  },
  {
    value: "senior",
    label: "Hard",
  },
];

export default function DifficultySelector({ selected, onSelect }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-[#eaecf0]">
        Difficulty Level
      </label>

      <div className="grid grid-cols-3 gap-3">
        {DIFFICULTY_LEVELS.map((level) => (
          <button
            key={level.value}
            type="button"
            onClick={() => onSelect(level.value)}
            className={`rounded-xl border px-4 py-3 text-sm font-semibold transition-all ${
              selected === level.value
                ? "border-[#d90000] bg-gradient-to-r from-[#d90000]/20 to-[#6366f1]/20 text-white"
                : "border-[rgba(255,255,255,0.10)] bg-white/5 text-[rgba(234,236,240,0.7)] hover:bg-white/10"
            }`}
          >
            {level.label}
          </button>
        ))}
      </div>
    </div>
  );
}