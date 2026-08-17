import { Plus, X } from "lucide-react";
import { TOPIC_SUGGESTIONS } from "./constant";
import DifficultySelector from "./DifficultySelector";

export default function TopicsTab({
  selectedTopics,
  onToggleTopic,
  customTopic,
  onCustomTopicChange,
  onAddCustomTopic,
  selectedDifficulty,
  onSelectDifficulty,
}) {
  const customTopics = selectedTopics.filter(
    (topic) => !TOPIC_SUGGESTIONS.includes(topic)
  );

  const handleTopicKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onAddCustomTopic();
    }
  };

  return (
    <div className="space-y-5">

      {/* Suggested Topics */}
      <div>
        <label className="mb-2 block text-sm font-medium text-[#eaecf0]">
          Choose Topics
        </label>

        <div className="flex flex-wrap gap-2">
          {TOPIC_SUGGESTIONS.map((topic) => {
            const isSelected = selectedTopics.includes(topic);

            return (
              <button
                key={topic}
                type="button"
                onClick={() => onToggleTopic(topic)}
                className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-all ${
                  isSelected
                    ? "border-[#d90000] bg-[#d90000]/20 text-white"
                    : "border-[rgba(255,255,255,0.10)] bg-white/5 text-[rgba(234,236,240,0.7)] hover:bg-white/10"
                }`}
              >
                {topic}
              </button>
            );
          })}
        </div>
      </div>

      {/* Custom Topic */}
      <div>
        <label className="mb-2 block text-sm font-medium text-[#eaecf0]">
          Add your own topic
        </label>

        <div className="flex gap-2">
          <input
            type="text"
            value={customTopic}
            onChange={(e) => onCustomTopicChange(e.target.value)}
            onKeyDown={handleTopicKeyDown}
            placeholder="e.g. Kubernetes"
            className="flex-1 rounded-xl border border-[rgba(255,255,255,0.10)] bg-[#030712]/60 px-4 py-2.5 text-white placeholder:text-[rgba(234,236,240,0.4)] outline-none transition focus:border-[#d90000]"
          />

          <button
            type="button"
            onClick={onAddCustomTopic}
            className="flex items-center justify-center rounded-xl bg-[#eaecf0] px-4 text-[#030712] transition hover:bg-white"
          >
            <Plus size={18} />
          </button>
        </div>

        {/* Custom Topics */}
        {customTopics.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {customTopics.map((topic) => (
              <span
                key={topic}
                className="flex items-center gap-1.5 rounded-full border border-[#6366f1]/40 bg-[#6366f1]/10 px-3 py-1 text-sm text-[#eaecf0]"
              >
                {topic}

                <button
                  type="button"
                  onClick={() => onToggleTopic(topic)}
                  className="text-[rgba(234,236,240,0.5)] transition hover:text-white"
                  aria-label={`Remove ${topic}`}
                >
                  <X size={14} />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Difficulty */}
      <DifficultySelector
        selected={selectedDifficulty}
        onSelect={onSelectDifficulty}
      />
    </div>
  );
}