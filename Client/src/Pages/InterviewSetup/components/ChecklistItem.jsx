import { CheckCircle2, Loader2 } from "lucide-react";

export default function ChecklistItem({ icon, label, status }) {
  return (
    <div className="flex items-center gap-3 border-b border-[rgba(255,255,255,0.06)] py-3">
      {status === true ? (
        <CheckCircle2 size={20} className="text-[#22c55e]" />
      ) : status === false ? (
        <span className="text-[#f59e0b]">{icon}</span>
      ) : (
        <Loader2 size={18} className="animate-spin text-[rgba(234,236,240,0.6)]" />
      )}
      <span className="text-[#eaecf0]">{label}</span>
    </div>
  );
}