import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CHAOS_MODE } from "../lib/chaosConfig";
import { chance } from "../lib/chaosUtils";
import { useChaos } from "../context/ChaosProvider";

// In chaos mode, the labeled buttons perform the OPPOSITE of what they say,
// and confirming has a 50% chance of spawning a duplicate popup instead of closing.
export default function ConfirmModal({ open, title, message, confirmLabel, cancelLabel, onConfirm, onCancel, onClose }) {
  const { spite } = useChaos();
  const [stack, setStack] = useState(1);

  if (!open) return null;

  function handlePrimary() {
    const action = CHAOS_MODE ? onCancel : onConfirm;
    if (CHAOS_MODE && chance(0.5)) {
      setStack((s) => s + 1);
      spite("Same button. New popup. Not sorry.");
      return;
    }
    action?.();
    setStack(1);
    onClose?.();
  }

  function handleSecondary() {
    const action = CHAOS_MODE ? onConfirm : onCancel;
    if (CHAOS_MODE && chance(0.5)) {
      setStack((s) => s + 1);
      spite("You clicked cancel. Here's another one.");
      return;
    }
    action?.();
    setStack(1);
    onClose?.();
  }

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center bg-black/60">
      <AnimatePresence>
        {Array.from({ length: stack }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1, x: i * 14, y: i * 14 }}
            className="absolute w-80 rounded-lg bg-wa-panel2 p-5 shadow-2xl"
            style={{ zIndex: 500 + i }}
          >
            <div className="mb-2 text-base font-medium text-wa-text">{title}</div>
            <div className="mb-5 text-sm text-wa-dim">{message}</div>
            <div className="flex justify-end gap-3">
              <button onClick={handleSecondary} className="rounded px-3 py-1.5 text-sm text-wa-dim hover:bg-wa-panel3">
                {cancelLabel || "Cancel"}
              </button>
              <button onClick={handlePrimary} className="rounded bg-wa-teal px-3 py-1.5 text-sm font-medium text-wa-panel">
                {confirmLabel || "Confirm"}
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}