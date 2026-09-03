import { useState, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Reply, Pin } from "lucide-react";
import ConfirmModal from "../lib/ConfirmModal";
import { CHAOS_MODE } from "../lib/chaosConfig";

const PARTICLES = Array.from({ length: 14 }, (_, i) => i);

export default function MessageBubble({ msg, onDelete, onLog }) {
  const mine = msg.from === "me";
  const [dragReady, setDragReady] = useState(false);
  const [pinned, setPinned] = useState(false);
  const [exploding, setExploding] = useState(false);
  const [gone, setGone] = useState(false);
  const [orbitOpen, setOrbitOpen] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [reply, setReply] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const undoTimer = useRef(null);

  const particleVecs = useMemo(
    () =>
      PARTICLES.map(() => {
        const angle = Math.random() * Math.PI * 2;
        const dist = 40 + Math.random() * 90;
        return { x: Math.cos(angle) * dist, y: Math.sin(angle) * dist, r: (Math.random() - 0.5) * 400 };
      }),
    [exploding]
  );

  function requestDelete() {
    if (CHAOS_MODE) {
      setConfirmOpen(true);
      return;
    }
    doExplode();
  }

  function doExplode() {
    setExploding(true);
    onLog?.("Message deleted — exploding into particles. There's a window to regret this.");
    undoTimer.current = setTimeout(() => {
      setGone(true);
      onDelete?.(msg.id);
    }, 3200);
  }

  function doKeep() {
    onLog?.("Kept. The button said 'Delete forever'. It lied.");
  }

  function undo() {
    clearTimeout(undoTimer.current);
    setExploding(false);
    onLog?.("Undo caught it — particles are reforming.");
  }

  if (gone) return null;

  return (
    <div className={`mb-2 flex ${mine ? "justify-end" : "justify-start"}`}>
      <ConfirmModal
        open={confirmOpen}
        title="Delete message?"
        message="This deletes the message. Or keeps it. The button will decide, not the label."
        confirmLabel="Delete forever"
        cancelLabel="Keep"
        onConfirm={doExplode}
        onCancel={doKeep}
        onClose={() => setConfirmOpen(false)}
      />

      <div className="relative">
        <motion.div
          drag={dragReady ? "x" : false}
          dragConstraints={{ left: -60, right: 60 }}
          dragElastic={0.6}
          dragTransition={{ power: 0.5, timeConstant: 420, bounceStiffness: 120 }}
          onPointerDown={() => {
            // slight delay before the drag "wakes up" — heavy block, not instant
            setTimeout(() => setDragReady(true), 160);
          }}
          onPointerUp={() => setDragReady(false)}
          onDragEnd={(e, info) => {
            if (Math.abs(info.offset.x) > 45) {
              setPinned((p) => !p);
              onLog?.(pinned ? "Unpinned." : "Pinned. That's what dragging a message does here.");
            }
          }}
          animate={
            exploding
              ? "explode"
              : { opacity: 1, scale: 1 }
          }
          variants={{
            explode: { opacity: 0, transition: { duration: 0.1 } },
          }}
          whileDrag={{ scale: 1.03, boxShadow: "0 8px 20px rgba(0,0,0,.4)" }}
          className={`group max-w-[340px] cursor-grab select-none rounded-lg px-3 py-2 text-sm leading-snug shadow active:cursor-grabbing ${
            mine ? "bg-wa-bubble text-wa-text" : "bg-wa-bubbleIn text-wa-text"
          } ${pinned ? "ring-1 ring-yellow-400/70" : ""}`}
        >
          {pinned && <Pin size={11} className="mb-1 inline text-yellow-400" />}
          <div>{msg.text}</div>
          <div className="mt-1 flex items-center justify-between gap-3">
            <span className="text-[10px] text-wa-dim">{msg.time}</span>
            <span className="hidden gap-2 group-hover:flex">
              <button onClick={() => setOrbitOpen((o) => !o)} className="text-wa-dim hover:text-wa-text">
                <Reply size={12} />
              </button>
              <button onClick={requestDelete} className="text-wa-dim hover:text-red-400">
                <Trash2 size={12} />
              </button>
            </span>
          </div>
        </motion.div>

        {/* explosion particles */}
        <AnimatePresence>
          {exploding && (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              {particleVecs.map((v, i) => (
                <motion.span
                  key={i}
                  initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                  animate={{ x: v.x, y: v.y, opacity: 0, rotate: v.r, scale: 0.3 }}
                  transition={{ duration: 3.0, ease: "easeOut" }}
                  className={`absolute h-1.5 w-1.5 rounded-full ${mine ? "bg-wa-bubble" : "bg-wa-bubbleIn"}`}
                />
              ))}
              <motion.button
                initial={{ opacity: 0, y: 0 }}
                animate={{ opacity: 1, y: 26 }}
                onClick={undo}
                className="pointer-events-auto absolute rounded-full bg-wa-teal px-3 py-1 text-[10px] font-bold text-wa-panel shadow-lg"
              >
                UNDO
              </motion.button>
            </div>
          )}
        </AnimatePresence>

        {/* reply thread orbiting the parent bubble like a moon */}
        <AnimatePresence>
          {orbitOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{
                opacity: 1,
                scale: 1,
                x: [0, 70, 0, -70, 0],
                y: [-70, 0, 70, 0, -70],
              }}
              exit={{ opacity: 0, scale: 0.4 }}
              transition={{
                x: { duration: 6, repeat: Infinity, ease: "linear" },
                y: { duration: 6, repeat: Infinity, ease: "linear" },
                opacity: { duration: 0.3 },
              }}
              className="absolute top-1/2 z-20 w-52 -translate-y-1/2 rounded-lg bg-wa-panel3 p-2 shadow-2xl ring-1 ring-wa-teal/40"
              style={{ [mine ? "right" : "left"]: "100%" }}
            >
              <div className="mb-1 text-[10px] text-wa-dim">reply thread (orbiting — click to dock)</div>
              {reply ? (
                <div className="rounded bg-wa-bubble px-2 py-1 text-xs">{reply}</div>
              ) : (
                <div className="flex gap-1">
                  <input
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="orbit a reply..."
                    className="w-full rounded bg-wa-panel px-2 py-1 text-xs outline-none"
                  />
                  <button
                    onClick={() => {
                      setReply(replyText);
                      onLog?.("Reply launched into orbit around the original message.");
                    }}
                    className="rounded bg-wa-teal px-2 text-xs font-bold text-wa-panel"
                  >
                    Go
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}