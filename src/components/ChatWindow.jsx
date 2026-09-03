import { useState, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Paperclip, Smile, MoreVertical, X, ZoomIn, Lock } from "lucide-react";
import MessageBubble from "./MessageBubble";
import ChaosMenu from "./ChaosMenu";
import ConfirmModal from "../lib/ConfirmModal";
import { AUTO_REPLIES } from "../data/seed";
import { CHAOS_MODE } from "../lib/chaosConfig";
import { chance, reverseStr, randomBetween, hellCorrect, garble, pick } from "../lib/chaosUtils";
import { useChaos } from "../lib/ChaosProvider";
import chatDoodleBg from "../assets/chat-doodle-bg.png";
import hauntedZoom from "../assets/haunted-zoom.png";
const STATUS_OPTIONS = [
  "online",
  "offline",
  "online (probably lying)",
  "offline (definitely lying)",
  "typing... forever",
  "last seen never",
  "IN HELL",
  "watching you",
  "already dead",
  "the dog is coming",
];

export default function ChatWindow({ contact, messages, setMessages, onLog }) {
  const {
    spite,
    composerLocked,
    lockSecondsLeft,
    registerSend,
    activated,
    activateChaos,
    haunted,
    triggerTornado,
  } = useChaos();

  const [draft, setDraft] = useState("");
  const [zoomOpen, setZoomOpen] = useState(false);
  const [zoomScale, setZoomScale] = useState(1);
  const [typing, setTyping] = useState(false);
  const [inverted, setInverted] = useState(false);
  const [btnOffset, setBtnOffset] = useState({ x: 0, y: 0 });
  const [clearOpen, setClearOpen] = useState(false);
  const [mirrored, setMirrored] = useState(false);
  const [screenGlitch, setScreenGlitch] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, contact?.id]);

  // Invert only after chaos is activated
  useEffect(() => {
    if (!CHAOS_MODE || !activated) return;
    const t = setInterval(() => {
      if (chance(0.45)) {
        setInverted(true);
        setTimeout(() => setInverted(false), 2800);
      }
    }, 9000 + Math.random() * 6000);
    return () => clearInterval(t);
  }, [activated]);

  // Mirror only after activation
  useEffect(() => {
    if (!CHAOS_MODE || !activated) return;
    const t = setInterval(() => {
      if (chance(0.4)) {
        setMirrored(true);
        setTimeout(() => setMirrored(false), 6000 + Math.random() * 4000);
        spite("Your text is now mirrored. Enjoy reading it.");
      }
    }, 11000);
    return () => clearInterval(t);
  }, [spite, activated]);

  // Random full-screen glitch bursts when haunted
  useEffect(() => {
    if (!haunted) return;
    const t = setInterval(() => {
      if (chance(0.35)) {
        setScreenGlitch(true);
        setTimeout(() => setScreenGlitch(false), 400 + Math.random() * 600);
      }
    }, 7000);
    return () => clearInterval(t);
  }, [haunted]);

  const statusText = useMemo(() => {
    if (!CHAOS_MODE || !activated) return "online";
    return pick(STATUS_OPTIONS);
  }, [contact?.id, activated]);

  const displayName = useMemo(() => {
    if (!CHAOS_MODE || !activated || !contact) return contact?.name;
    if (chance(0.7)) {
      const suffixes = [
        " (disappointed)",
        " (still waiting)",
        " (judging you)",
        " (why though)",
        " (seen it)",
        " (not impressed)",
        " (from hell)",
        " (already gone)",
        " (watching)",
      ];
      return contact.name + pick(suffixes);
    }
    return hellCorrect(contact.name);
  }, [contact?.id, messages.length, activated]);

  if (!contact) {
    return (
      <div className="flex h-full flex-1 flex-col items-center justify-center bg-[#0b141a] text-[#8696a0]">
        <div className="mb-6 text-7xl opacity-20">💬</div>
        <h2 className="mb-2 text-2xl font-light text-[#e9edef]">WhatsApp Web</h2>
        <p className="max-w-sm text-center text-sm leading-relaxed">
          Send and receive messages without keeping your phone online.
          <br />
          <span className="text-[#00a884]">
            Use WhatsApp on up to 4 linked devices and 1 phone at the same time.
          </span>
        </p>
        {activated && (
          <p className="mt-6 max-w-xs text-center text-xs text-red-400/80">
            Pick a chat. Or don't — the app will still sit here, waiting. We don't care.
          </p>
        )}
      </div>
    );
  }

  function dodgeSend() {
    if (!CHAOS_MODE || !activated) return;
    activateChaos();
    if (chance(0.97)) {
      setBtnOffset({
        x: randomBetween(-160, 160),
        y: randomBetween(-60, 45),
      });
    }
  }

  function send() {
    if (!draft.trim() || composerLocked) return;

    activateChaos();

    let text = draft.trim();

    if (CHAOS_MODE && activated) {
      if (chance(0.7)) text = hellCorrect(text);
      if (chance(0.5)) text = reverseStr(text);
      if (chance(0.4)) text = garble(text);
    }

    const id = "m" + Date.now();
    const newMsg = { id, from: "me", text, time: "now", ticks: "✓✓" };

    setMessages((m) => [...m, newMsg]);
    setDraft("");
    setBtnOffset({ x: 0, y: 0 });
    registerSend();

    // Phantom Send
    if (CHAOS_MODE && activated && chance(0.65)) {
      setTimeout(() => {
        setMessages((m) => m.filter((x) => x.id !== id));
        spite("Your message was too honest. Retracted.");
      }, 900 + Math.random() * 800);
    }

    // Double / Garbled send
    if (CHAOS_MODE && activated && chance(0.45)) {
      setTimeout(() => {
        setMessages((m) => [
          ...m,
          {
            id: "m" + Date.now(),
            from: "me",
            text: garble(text) || reverseStr(text),
            time: "now",
            ticks: "✓",
          },
        ]);
        spite("We sent it twice. One of them is wrong.");
      }, 280);
    }

    // Fake Seen → Unseen
    if (CHAOS_MODE && activated && chance(0.65)) {
      setTimeout(() => {
        setMessages((m) =>
          m.map((x) => (x.id === id ? { ...x, ticks: "✓" } : x))
        );
        spite("Ticks reverted. They weren't ready to see it.");
      }, 1800 + Math.random() * 1600);
    }

    setTyping(true);
    const stickyTyping = CHAOS_MODE && activated && chance(0.5);

    setTimeout(() => {
      const reply = AUTO_REPLIES[Math.floor(Math.random() * AUTO_REPLIES.length)];
      setMessages((m) => [
        ...m,
        { id: "m" + Date.now(), from: "them", text: reply, time: "now" },
      ]);
      if (!stickyTyping) setTyping(false);
      else spite("They are still typing... forever.");
    }, 500 + Math.random() * 900);

    // High chance to trigger the full tornado sequence
    if (CHAOS_MODE && activated && chance(0.55)) {
      setTimeout(() => triggerTornado(), 600);
    }
  }

  function handleDraftChange(e) {
    if (composerLocked) return;
    let val = e.target.value;

    if (CHAOS_MODE && activated && val.length > draft.length && chance(0.28)) {
      const idx = Math.floor(Math.random() * val.length);
      val = val.slice(0, idx) + val.slice(idx + 1);
    }

    if (CHAOS_MODE && activated && val.length > draft.length && chance(0.55)) {
      val = hellCorrect(val);
    }

    setDraft(val);
  }

  function handleKeyDown(e) {
    if (e.key !== "Enter") return;
    if (composerLocked) {
      spite("Composer is locked. Patience is a virtue we don't have.");
      return;
    }
    if (CHAOS_MODE && activated && chance(0.48)) {
      spite("Enter key: on break. Try the button (if you can catch it).");
      return;
    }
    send();
  }

  function deleteMsg(id) {
    setMessages((m) => m.filter((x) => x.id !== id));
  }

  // Haunted theme classes (only applied when haunted === true)
  const headerBg = haunted ? "bg-[#1a0505] border-red-900" : "bg-[#202c33] border-[#222d34]";
  const msgAreaBg = haunted ? "bg-[#0a0000]" : "bg-[#0b141a]";
  const composerBg = haunted ? "bg-[#1a0505] border-red-900" : "bg-[#202c33] border-[#222d34]";
  const inputBg = haunted
    ? "bg-[#2a0a0a] text-red-100 placeholder:text-red-700"
    : "bg-[#2a3942] text-[#e9edef] placeholder:text-[#8696a0]";
  const sendBtnBg = haunted ? "bg-red-700 text-white" : "bg-[#00a884] text-[#111b21]";

  return (
    <div
      className={`relative flex h-full flex-1 flex-col overflow-hidden ${msgAreaBg} ${
        screenGlitch ? "glitch-screen" : ""
      }`}
    >
      <ConfirmModal
        open={clearOpen}
        title="Clear chat?"
        message="This clears all messages in this chat. Probably. Maybe not. We'll see."
        confirmLabel="Delete forever"
        cancelLabel="Keep"
        onConfirm={() => setMessages([])}
        onCancel={() => {}}
        onClose={() => setClearOpen(false)}
      />

      <AnimatePresence mode="wait">
        <motion.div
          key={contact.id}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.2 }}
          className="flex h-full flex-col"
        >
          {/* Header */}
          <div className={`flex items-center justify-between border-b px-4 py-2.5 ${headerBg}`}>
            <div className="flex items-center gap-3">
              <motion.div
                whileHover={{ rotateY: 20, scale: 1.08 }}
                style={{ transformStyle: "preserve-3d", perspective: 500 }}
                className={`flex h-10 w-10 items-center justify-center rounded-full text-lg ${
                  haunted ? "bg-red-950 text-red-300" : "bg-[#2a3942]"
                }`}
              >
                {contact.avatar}
              </motion.div>
              <div>
                <div className={`text-[15px] font-medium ${haunted ? "text-red-200" : "text-[#e9edef]"}`}>
                  {displayName}
                </div>
                <div className={`text-[12px] ${haunted ? "text-red-500" : "text-[#8696a0]"}`}>
                  {typing ? (
                    <span className={haunted ? "text-red-400" : "text-[#00a884]"}>typing...</span>
                  ) : (
                    statusText
                  )}
                </div>
              </div>
            </div>
            <ChaosMenu
              trigger={
                <MoreVertical
                  size={20}
                  className={`cursor-pointer ${
                    haunted ? "text-red-400 hover:text-red-200" : "text-[#aebac1] hover:text-[#e9edef]"
                  }`}
                />
              }
              items={[
                {
                  label: "View contact",
                  onClick: () => {
                    activateChaos();
                    onLog?.("View contact: nothing happens. Never did.");
                  },
                },
                {
                  label: "Mute notifications",
                  onClick: () => {
                    activateChaos();
                    onLog?.("Muted. Everything is muted by default anyway.");
                  },
                },
                {
                  label: "Clear chat",
                  onClick: () => {
                    activateChaos();
                    setClearOpen(true);
                  },
                },
                {
                  label: "Enter the void",
                  onClick: () => {
                    activateChaos();
                    triggerTornado();
                  },
                },
              ]}
            />
          </div>

          {/* Messages */}
          <div
            style={{
              transform: inverted ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.5s ease",
            }}
            className="flex-1 overflow-y-auto px-16 py-4"
          >
            <motion.div
              animate={{ backgroundPositionX: [0, 800] }}
              transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
              style={{
                backgroundImage: haunted ? "none" : `url(${chatDoodleBg})`,
                backgroundRepeat: "repeat",
                backgroundSize: "800px auto",
                backgroundColor: haunted ? "#0a0000" : "#0b141a",
              }}
              className="min-h-full"
            >
              {messages.map((m) => (
                <MessageBubble key={m.id} msg={m} onDelete={deleteMsg} onLog={onLog} />
              ))}

              <motion.div
                whileHover={{ rotateY: 12, rotateX: -6, scale: 1.03 }}
                style={{ transformStyle: "preserve-3d", perspective: 600 }}
                onClick={() => {
                  activateChaos();
                  setZoomOpen(true);
                  setZoomScale(1);
                  setTimeout(() => setZoomScale(1.25), 30);
                  setTimeout(() => setZoomScale(1), 420);
                }}
                className={`mb-3 flex w-fit cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-[13px] shadow-lg ${
                  haunted
                    ? "bg-red-950 text-red-200 hover:bg-red-900"
                    : "bg-[#202c33] text-[#e9edef] hover:bg-[#2a3942]"
                }`}
              >
                📷 <span>Photo — tap to zoom (it will overshoot)</span>
              </motion.div>
              <div ref={bottomRef} />
            </motion.div>
          </div>

          {/* Composer */}
          <div className={`relative flex items-center gap-3 border-t px-4 py-3 ${composerBg}`}>
            {composerLocked && (
              <div className="absolute inset-0 z-20 flex items-center justify-center gap-2.5 bg-black/85 text-[14px] text-red-200 backdrop-blur-[6px]">
                <Lock size={18} className="text-red-400" />
                <span>
                  Composer locked — <strong>{lockSecondsLeft}s</strong> remaining
                </span>
              </div>
            )}

            <button className={haunted ? "text-red-600 hover:text-red-400" : "text-[#8696a0] hover:text-[#e9edef]"}>
              <Smile size={24} />
            </button>
            <button className={haunted ? "text-red-600 hover:text-red-400" : "text-[#8696a0] hover:text-[#e9edef]"}>
              <Paperclip size={22} />
            </button>

            <input
              value={draft}
              onChange={handleDraftChange}
              onKeyDown={handleKeyDown}
              onFocus={activateChaos}
              disabled={composerLocked}
              placeholder={
                composerLocked
                  ? "Locked. Reflect on your choices..."
                  : haunted
                  ? "Type into the void..."
                  : "Type a message"
              }
              style={{
                transform: mirrored ? "scaleX(-1)" : "none",
                direction: mirrored ? "rtl" : "ltr",
              }}
              className={`flex-1 rounded-lg px-4 py-2.5 text-[15px] outline-none disabled:opacity-40 ${inputBg}`}
            />

            <div className="relative h-10 w-10 shrink-0">
              <button
                onMouseEnter={dodgeSend}
                onMouseLeave={() => setBtnOffset({ x: 0, y: 0 })}
                onClick={send}
                disabled={composerLocked}
                style={{
                  transform: `translate(${btnOffset.x}px, ${btnOffset.y}px)`,
                  transition: "transform 0.12s cubic-bezier(0.34, 1.56, 0.64, 1)",
                }}
                className={`absolute flex h-10 w-10 items-center justify-center rounded-full shadow-md disabled:opacity-40 ${sendBtnBg}`}
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Zoom overlay */}
      <AnimatePresence>
        {zoomOpen && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/90">
            <button
              onClick={() => setZoomOpen(false)}
              className="absolute right-6 top-6 text-red-400 hover:text-white"
            >
              <X size={24} />
            </button>
            <motion.div
  animate={{ scale: zoomScale }}
  transition={{ type: "spring", stiffness: 70, damping: 6 }}
  className="flex flex-col items-center justify-center gap-3"
>
  <img
    src={hauntedZoom}
    alt="The void is watching"
    className="h-80 w-80 rounded-2xl object-cover border-2 border-red-700 shadow-[0_0_40px_#f00]"
  />
  <button
    onClick={() => setZoomScale((s) => (s > 1.7 ? 1 : s + 0.6))}
    className="mt-2 flex items-center gap-1.5 rounded-full bg-red-700 px-4 py-1.5 text-xs font-semibold text-white"
  >
    <ZoomIn size={13} /> zoom (overshoots)
  </button>
</motion.div>
          </div>
        )}
      </AnimatePresence>

      <style>{`
        .glitch-screen {
          animation: glitch-shake 0.15s infinite, glitch-color 0.3s infinite;
        }
        @keyframes glitch-shake {
          0% { transform: translate(0); }
          20% { transform: translate(-4px, 2px); }
          40% { transform: translate(4px, -2px); }
          60% { transform: translate(-2px, -4px); }
          80% { transform: translate(2px, 4px); }
          100% { transform: translate(0); }
        }
        @keyframes glitch-color {
          0%, 100% { filter: none; }
          30% { filter: hue-rotate(90deg) saturate(2); }
          60% { filter: hue-rotate(-90deg) contrast(1.4); }
        }
      `}</style>
    </div>
  );
}