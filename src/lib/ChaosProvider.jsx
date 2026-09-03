import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CHAOS_MODE } from "./chaosConfig";
import { chance, pick } from "./chaosUtils";

const ChaosContext = createContext(null);

export function useChaos() {
  const ctx = useContext(ChaosContext);
  if (!ctx) throw new Error("useChaos must be used inside ChaosProvider");
  return ctx;
}

const HAUNTED_TAUNTS = [
  "YOU CANNOT LEAVE",
  "THE VOID WATCHES",
  "YOUR SOUL IS NEXT",
  "NO ESCAPE",
  "HELL WELCOMES YOU",
  "WE SEE EVERYTHING",
  "RUN... IF YOU CAN",
  "THE DOG IS ALREADY HERE",
  "GLASS WILL BREAK",
  "CONTINUE... OR SUFFER",
];

/* ── cinematic overlays ── */

function GlitchButton({ children, onClick, danger }) {
  return (
    <motion.button
      whileHover={{ scale: 1.12, x: [0, -3, 3, 0] }}
      whileTap={{ scale: 0.92 }}
      onClick={onClick}
      className={`relative px-10 py-4 text-2xl font-black tracking-widest uppercase border-2 ${
        danger
          ? "border-red-600 text-red-400 bg-red-950/80"
          : "border-cyan-400 text-cyan-300 bg-cyan-950/60"
      }`}
      style={{
        textShadow: danger
          ? "0 0 12px #f00, 0 0 24px #f00"
          : "0 0 12px #0ff, 0 0 24px #0ff",
      }}
    >
      {children}
    </motion.button>
  );
}

function TornadoOverlay({ onChoice }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-black overflow-hidden"
    >
      {Array.from({ length: 40 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full bg-red-600"
          style={{ left: "50%", top: "50%" }}
          animate={{
            x: [0, (Math.random() - 0.5) * 1200, (Math.random() - 0.5) * 1600],
            y: [0, (Math.random() - 0.5) * 800, (Math.random() - 0.5) * 1000],
            scale: [1, 2.5, 0],
            opacity: [1, 0.8, 0],
            rotate: [0, 720],
          }}
          transition={{ duration: 1.8 + Math.random(), delay: Math.random() * 0.6, ease: "easeIn" }}
        />
      ))}
      {["CHAT", "SIDEBAR", "MESSAGES", "SETTINGS", "CALLS", "STATUS"].map((label, i) => (
        <motion.div
          key={label}
          initial={{ opacity: 1, scale: 1, x: (i - 2.5) * 120, y: 80 }}
          animate={{ opacity: 0, scale: 0.1, x: 0, y: 0, rotate: (Math.random() - 0.5) * 720 }}
          transition={{ duration: 1.4, delay: 0.2 + i * 0.08, ease: "easeIn" }}
          className="absolute text-red-400 font-bold text-xl tracking-widest"
        >
          {label}
        </motion.div>
      ))}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: [0, 1.4, 1], opacity: 1 }}
        transition={{ delay: 1.6, duration: 0.6 }}
        className="relative z-10 text-center"
      >
        <div className="text-4xl md:text-6xl font-black uppercase tracking-[0.3em] text-red-500 mb-8">
          THE VOID OPENS
        </div>
        <div className="flex gap-8 justify-center">
          <GlitchButton onClick={() => onChoice("run")}>RUN</GlitchButton>
          <GlitchButton onClick={() => onChoice("continue")} danger>CONTINUE</GlitchButton>
        </div>
      </motion.div>
    </motion.div>
  );
}

function GhostChaseOverlay({ onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 5200);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[210] bg-black flex flex-col items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_#1a0000_0%,_#000_70%)]" />
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-red-950 to-transparent opacity-80" />
      <motion.div className="absolute text-7xl"
        initial={{ x: "-20vw", y: "30vh" }}
        animate={{ x: "110vw", y: ["30vh", "28vh", "32vh", "30vh"] }}
        transition={{ duration: 3.8, ease: "linear" }}>🐕</motion.div>
      <motion.div className="absolute text-8xl filter drop-shadow-[0_0_20px_#f00]"
        initial={{ x: "-40vw", y: "25vh", opacity: 0.7 }}
        animate={{ x: "90vw", y: ["25vh", "22vh", "28vh", "25vh"], opacity: [0.6, 1, 0.7] }}
        transition={{ duration: 4.2, ease: "linear", delay: 0.3 }}>👻</motion.div>
      {Array.from({ length: 25 }).map((_, i) => (
        <motion.div key={i} className="absolute w-1 bg-red-700 rounded-full"
          style={{ left: `${Math.random() * 100}%`, height: `${20 + Math.random() * 40}px` }}
          initial={{ y: -50, opacity: 0.8 }} animate={{ y: "110vh" }}
          transition={{ duration: 1.5 + Math.random(), repeat: Infinity, delay: Math.random() * 2, ease: "linear" }} />
      ))}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3.5 }}
        className="relative z-10 text-3xl font-bold text-red-400 tracking-widest mt-40">
        YOU RAN... BUT THE DOG DIDN'T
      </motion.div>
    </motion.div>
  );
}

function GravityCollapseOverlay({ onEscape }) {
  const items = ["Sidebar", "Chat List", "Messages", "Composer", "Header", "Calls", "Status", "Channels", "Communities", "Settings", "Avatar", "Search", "Filters", "Unread Badges", "Send Button"];
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[210] bg-black/90 overflow-hidden">
      <div className="absolute top-10 left-0 right-0 text-center text-2xl text-red-500 font-bold tracking-widest">EVERYTHING FALLS</div>
      {items.map((label, i) => (
        <motion.div key={label}
          initial={{ y: -80 - Math.random() * 100, x: `${10 + (i * 6) % 80}vw`, rotate: 0, opacity: 1 }}
          animate={{ y: "110vh", rotate: (Math.random() - 0.5) * 900, opacity: [1, 1, 0.4] }}
          transition={{ duration: 1.8 + Math.random() * 1.2, delay: Math.random() * 0.8, ease: "easeIn" }}
          className="absolute top-0 whitespace-nowrap rounded-md bg-red-950 border border-red-700 px-4 py-2 text-red-200 shadow-[0_0_20px_#f00]">
          {label}
        </motion.div>
      ))}
      <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2.8 }}
        className="absolute bottom-24 left-0 right-0 flex justify-center">
        <GlitchButton onClick={onEscape}>ESCAPE?</GlitchButton>
      </motion.div>
    </motion.div>
  );
}

function DevilShootOverlay({ onDone }) {
  const [phase, setPhase] = useState("appear");
  useEffect(() => {
    const t1 = setTimeout(() => setPhase("aim"), 1200);
    const t2 = setTimeout(() => setPhase("shoot"), 2200);
    const t3 = setTimeout(() => setPhase("shatter"), 2800);
    const t4 = setTimeout(onDone, 5200);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, [onDone]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[220] bg-black flex items-center justify-center overflow-hidden">
      {phase !== "shatter" && (
        <motion.div initial={{ scale: 0.3, y: 100, opacity: 0 }}
          animate={{ scale: phase === "aim" ? 1.1 : 1, y: 0, opacity: 1, x: phase === "aim" ? [0, -8, 8, -4, 0] : 0 }}
          transition={{ duration: 0.8 }} className="text-center">
          <div className="text-[120px] leading-none filter drop-shadow-[0_0_40px_#f00]">😈</div>
          <div className="text-5xl mt-2">🔫</div>
          <div className="mt-6 text-3xl font-black text-red-500 tracking-[0.4em]">
            {phase === "appear" && "NO ESCAPE"}
            {phase === "aim" && "SAY GOODBYE"}
            {phase === "shoot" && "BANG"}
          </div>
        </motion.div>
      )}
      {phase === "shoot" && (
        <motion.div initial={{ scale: 0, opacity: 1 }} animate={{ scale: 8, opacity: 0 }}
          transition={{ duration: 0.4 }} className="absolute w-32 h-32 rounded-full bg-yellow-300" />
      )}
      {phase === "shatter" && Array.from({ length: 28 }).map((_, i) => {
        const angle = (i / 28) * Math.PI * 2;
        const dist = 200 + Math.random() * 600;
        return (
          <motion.div key={i}
            initial={{ x: 0, y: 0, opacity: 1, rotate: 0 }}
            animate={{ x: Math.cos(angle) * dist, y: Math.sin(angle) * dist + 200, opacity: 0, rotate: Math.random() * 720 }}
            transition={{ duration: 1.4 + Math.random() * 0.6, ease: "easeOut" }}
            className="absolute w-16 h-20 bg-gradient-to-br from-white/40 to-cyan-200/20 border border-white/30 backdrop-blur-sm"
            style={{ clipPath: `polygon(${Math.random() * 30}% 0%, 100% ${Math.random() * 40}%, ${70 + Math.random() * 30}% 100%, 0% ${60 + Math.random() * 40}%)` }}
          />
        );
      })}
      {phase === "shatter" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
          className="absolute text-4xl font-black text-white tracking-widest">REALITY RESTORED</motion.div>
      )}
    </motion.div>
  );
}

function SpiteToast({ text }) {
  return (
    <motion.div initial={{ opacity: 0, y: 30, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20 }}
      className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[150] px-6 py-3 rounded-lg bg-red-950 border border-red-600 text-red-200 shadow-[0_0_30px_#f00] font-medium tracking-wide">
      {text}
    </motion.div>
  );
}

/* ── Provider ── */

export function ChaosProvider({ children }) {
  const [activated, setActivated] = useState(false);
  const [haunted, setHaunted] = useState(false);
  const [sequence, setSequence] = useState(null); // null | "tornado" | "ghost" | "gravity" | "devil"
  const [toasts, setToasts] = useState([]);
  const [laggyCursor, setLaggyCursor] = useState(false);
  const [composerLocked, setComposerLocked] = useState(false);
  const [lockSecondsLeft, setLockSecondsLeft] = useState(0);
  const sendCount = useRef(0);

  const activateChaos = useCallback(() => {
    if (!activated) setActivated(true);
    if (!haunted && CHAOS_MODE) {
      setHaunted(true);
      document.documentElement.classList.add("haunted");
    }
  }, [activated, haunted]);

  const spite = useCallback((msg) => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, text: msg }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200);
  }, []);

  const toggleLaggyCursor = useCallback(() => {
    setLaggyCursor((v) => !v);
    spite(laggyCursor ? "Cursor lag disabled. For now." : "Cursor lag engaged. Good luck.");
  }, [laggyCursor, spite]);

  const registerSend = useCallback(() => {
    sendCount.current += 1;
    if (CHAOS_MODE && sendCount.current >= 2 && chance(0.7)) {
      setSequence("tornado");
    } else if (CHAOS_MODE && chance(0.12)) {
      setComposerLocked(true);
      setLockSecondsLeft(8);
      spite("Composer locked by the void.");
    }
  }, [spite]);

  useEffect(() => {
    if (!composerLocked) return;
    if (lockSecondsLeft <= 0) { setComposerLocked(false); return; }
    const t = setTimeout(() => setLockSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [composerLocked, lockSecondsLeft]);

  useEffect(() => {
    if (!activated || !CHAOS_MODE) return;
    const t = setInterval(() => {
      if (chance(0.28)) spite(pick(HAUNTED_TAUNTS));
    }, 16000 + Math.random() * 10000);
    return () => clearInterval(t);
  }, [activated, spite]);

  useEffect(() => {
    if (!laggyCursor) return;
    const el = document.createElement("div");
    el.id = "laggy-cursor-ring";
    el.style.cssText = "position:fixed;width:28px;height:28px;border:2px solid #f00;border-radius:50%;pointer-events:none;z-index:9999;transition:transform 0.18s ease-out;box-shadow:0 0 12px #f00;";
    document.body.appendChild(el);
    const move = (e) => { el.style.transform = `translate(${e.clientX - 14}px, ${e.clientY - 14}px)`; };
    window.addEventListener("mousemove", move);
    return () => { window.removeEventListener("mousemove", move); el.remove(); };
  }, [laggyCursor]);

  const handleTornadoChoice = (choice) => {
    setSequence(choice === "run" ? "ghost" : "gravity");
  };

  const endSequence = () => {
    setSequence(null);
    setHaunted(false);
    document.documentElement.classList.remove("haunted");
    sendCount.current = 0;
    spite("The nightmare ends... for now.");
  };

  const value = {
    activated,
    activateChaos,
    haunted,
    setHaunted,
    spite,
    toggleLaggyCursor,
    composerLocked,
    lockSecondsLeft,
    registerSend,
    triggerTornado: () => setSequence("tornado"),
  };

  return (
    <ChaosContext.Provider value={value}>
      <div className={haunted ? "haunted-root" : ""}>{children}</div>
      <AnimatePresence>
        {toasts.map((t) => <SpiteToast key={t.id} text={t.text} />)}
      </AnimatePresence>
      <AnimatePresence>
        {sequence === "tornado" && <TornadoOverlay onChoice={handleTornadoChoice} />}
        {sequence === "ghost" && <GhostChaseOverlay onDone={endSequence} />}
        {sequence === "gravity" && <GravityCollapseOverlay onEscape={() => setSequence("devil")} />}
        {sequence === "devil" && <DevilShootOverlay onDone={endSequence} />}
      </AnimatePresence>
    </ChaosContext.Provider>
  );
}