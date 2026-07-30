import { CheckCircle2, Loader2, Mic } from "lucide-react";
import { useMicTest } from "../hooks/useMicTest";
import { useEffect } from "react";

export default function MicTestStep({ onComplete, disabled }) {
  const { micTesting, micOk, heardText, startListening } = useMicTest();

  // Parent ko batao jab mic verify ho jaye
  if (micOk) onComplete?.();

  return (
    <div className="flex items-start gap-3 py-3">
      <div className="mt-0.5">
        {micOk ? (
          <CheckCircle2 size={20} className="text-[#22c55e]" />
        ) : micTesting ? (
          <Loader2 size={20} className="animate-spin text-[#d90000]" />
        ) : (
          <Mic size={18} className="text-[rgba(234,236,240,0.6)]" />
        )}
      </div>
      <div className="flex-1">
        <p className="font-medium text-[#eaecf0]">Testing microphone</p>
        {!micOk && (
          <>
            <p className="mt-1 text-sm text-[#f59e0b]">
              Please say - "I am ready to start the interview."
            </p>
            <button
              type="button"
              onClick={startListening}
              disabled={micTesting || disabled}
              className="mt-3 rounded-xl bg-[#eaecf0] px-4 py-2 text-sm font-semibold text-[#030712] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              {micTesting ? "Listening..." : "Speak now"}
            </button>
            {heardText && !micOk && (
              <p className="mt-2 text-xs text-[rgba(234,236,240,0.5)]">
                Heard: "{heardText}" — try again
              </p>
            )}
          </>
        )}
        {micOk && (
          <p className="mt-1 text-sm text-[#22c55e]">Microphone working correctly</p>
        )}
      </div>
    </div>
  );
}