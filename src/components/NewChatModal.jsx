import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const CORNERS = [
  { x: -900, y: -500 },
  { x: 900, y: -500 },
  { x: -900, y: 500 },
  { x: 900, y: 500 },
];

export default function NewChatModal({ open, onClose, onCreate }) {
  const spawn = useMemo(() => CORNERS[Math.floor(Math.random() * CORNERS.length)], [open]);
  const [name, setName] = useState("");
  const [emoji, setEmoji] = useState("🙂");

  if (!open) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <motion.div
          initial={{ x: spawn.x, y: spawn.y, opacity: 0, scale: 0.4, rotate: -25 }}
          animate={{ x: 0, y: 0, opacity: 1, scale: 1, rotate: 0 }}
          exit={{ x: spawn.x * 0.6, y: spawn.y * 0.6, opacity: 0, scale: 0.5 }}
          transition={{ duration: 1.9, ease: [0.16, 0.6, 0.15, 1] }}
          className="w-[360px] rounded-xl bg-wa-panel2 p-6 shadow-2xl"
        >
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-medium text-wa-text">New chat</h2>
            <button onClick={onClose} className="text-wa-dim hover:text-wa-text">
              <X size={18} />
            </button>
          </div>
          <p className="mb-3 text-xs text-wa-dim">
            (This dialog took its time getting here. It always does.)
          </p>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Contact name"
            className="mb-3 w-full rounded-md bg-wa-panel3 px-3 py-2 text-sm text-wa-text outline-none placeholder:text-wa-dim"
          />
          <div className="mb-4 flex gap-2">
            {["🙂", "🦄", "🐢", "👾", "🌊", "🎸"].map((e) => (
              <button
                key={e}
                onClick={() => setEmoji(e)}
                className={`rounded-md px-2 py-1 text-lg ${
                  emoji === e ? "bg-wa-teal/30 ring-1 ring-wa-teal" : "bg-wa-panel3"
                }`}
              >
                {e}
              </button>
            ))}
          </div>
          <button
            disabled={!name.trim()}
            onClick={() => {
              onCreate(name.trim(), emoji);
              setName("");
            }}
            className="w-full rounded-md bg-wa-teal py-2 text-sm font-medium text-wa-panel disabled:opacity-40"
          >
            Start chat
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
