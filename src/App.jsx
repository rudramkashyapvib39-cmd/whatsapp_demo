import { useState, useCallback, useEffect, useRef } from "react";
import Sidebar from "./components/Sidebar";
import ChatWindow from "./components/ChatWindow";
import NewChatModal from "./components/NewChatModal";
import { ChaosProvider } from "./lib/ChaosProvider";
import { CHAOS_MODE } from "./lib/chaosConfig";
import { CONTACTS, INITIAL_MESSAGES } from "./data/seed";

import Scene3D from "./components/Scene3D";
import LoginCard from "./components/LoginCard";
import HauntedScene3D from "./components/HauntedScene3D";
import HauntedMessage from "./components/HauntedMessage";
import HauntedLoginCard from "./components/HauntedLoginCard";
import GlitchOverlay from "./components/GlitchOverlay";
import WelcomeOverlay from "./components/WelcomeOverlay";
import "./app.css";
import "./haunted.css";

const BREAK_DURATION_MS = 900;
const GLITCH_DURATION_MS = 1000;

// Haunted intro timing — skull kicks human -> falls into hell -> hell flash -> message -> login
const KICK_MS = 1500;
const FALL_MS = 1300;
const HELL_MS = 900;
const MESSAGE_MS = 2400;

export default function App() {
  const [phase, setPhase] = useState("idle");
  const [breakSignal, setBreakSignal] = useState(0);
  const [showWelcome, setShowWelcome] = useState(false);
  // "kick" | "fall" | "hell" | "message" | "login" — skipped straight to "login" when chaos is off
  const [hauntedStage, setHauntedStage] = useState(CHAOS_MODE ? "kick" : "login");
  const timers = useRef([]);
  const hauntedTimers = useRef([]);

  const [contacts, setContacts] = useState(CONTACTS);
  const [messagesByChat, setMessagesByChat] = useState(INITIAL_MESSAGES);
  const [activeId, setActiveId] = useState(CONTACTS[0].id);
  const [newChatOpen, setNewChatOpen] = useState(false);
  const [logs, setLogs] = useState([
    "WhatsApp Chaos loaded. Every feature works. None of it behaves.",
  ]);

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  useEffect(() => {
    if (!CHAOS_MODE) return;
    hauntedTimers.current.push(setTimeout(() => setHauntedStage("fall"), KICK_MS));
    hauntedTimers.current.push(setTimeout(() => setHauntedStage("hell"), KICK_MS + FALL_MS));
    hauntedTimers.current.push(
      setTimeout(() => setHauntedStage("message"), KICK_MS + FALL_MS + HELL_MS)
    );
    hauntedTimers.current.push(
      setTimeout(() => setHauntedStage("login"), KICK_MS + FALL_MS + HELL_MS + MESSAGE_MS)
    );
    return () => hauntedTimers.current.forEach(clearTimeout);
  }, []);

  const handleLogin = useCallback(() => {
    if (phase !== "idle") return;
    setPhase("breaking");
    setBreakSignal((n) => n + 1);

    timers.current.push(
      setTimeout(() => {
        setPhase("glitching");
      }, BREAK_DURATION_MS)
    );

    timers.current.push(
      setTimeout(() => {
        setPhase("dashboard");
        setShowWelcome(true);
      }, BREAK_DURATION_MS + GLITCH_DURATION_MS)
    );
  }, [phase]);

  const dismissWelcome = useCallback(() => setShowWelcome(false), []);

  useEffect(() => clearTimers, []);

  const activeContact = contacts.find((c) => c.id === activeId) || null;
  const messages = messagesByChat[activeId] || [];

  function setMessages(updater) {
    setMessagesByChat((prev) => ({
      ...prev,
      [activeId]: typeof updater === "function" ? updater(prev[activeId] || []) : updater,
    }));
  }

  function log(msg) {
    setLogs((l) => [msg, ...l].slice(0, 6));
  }

  function createChat(name, emoji) {
    const id = Math.max(...contacts.map((c) => c.id)) + 1;
    const newContact = { id, name, avatar: emoji, last: "chat created", time: "now", unread: 0 };
    setContacts((c) => [newContact, ...c]);
    setMessagesByChat((m) => ({ ...m, [id]: [] }));
    setActiveId(id);
    setNewChatOpen(false);
    log(`New chat with "${name}" arrived. Eventually.`);
  }

  if (phase === "dashboard") {
    return (
      <ChaosProvider>
        <div className="flex h-screen w-screen overflow-hidden bg-wa-bg relative">
          <Sidebar
            contacts={contacts}
            activeId={activeId}
            onSelect={setActiveId}
            onNewChat={() => setNewChatOpen(true)}
            onLog={log}
          />
          <ChatWindow
            contact={activeContact}
            messages={messages}
            setMessages={setMessages}
            onLog={log}
          />

          <NewChatModal open={newChatOpen} onClose={() => setNewChatOpen(false)} onCreate={createChat} />

          <div className="pointer-events-none fixed bottom-2 left-[462px] z-40 max-w-md font-mono text-[10px] text-wa-dim/80">
            {logs.map((l, i) => (
              <div key={i} style={{ opacity: 1 - i * 0.15 }}>
                chaos.log › {l}
              </div>
            ))}
          </div>

          {showWelcome && <WelcomeOverlay onDismiss={dismissWelcome} />}
        </div>
      </ChaosProvider>
    );
  }

  // --- haunted intro: skull kicks human into hell, then a glitchy "can't escape" beat ---
  if (CHAOS_MODE && hauntedStage !== "login") {
    return (
      <div key="haunted-intro" className="app-root haunted-intro-root">
        <HauntedScene3D stage={hauntedStage} />
        {hauntedStage === "message" && <HauntedMessage />}
      </div>
    );
  }

  const screenShakeClass =
    phase === "breaking"
      ? " app-root--shake-hard"
      : phase === "glitching"
      ? " app-root--shake-violent"
      : "";

  return (
    <div key="login-screen" className={`app-root${screenShakeClass}`}>
      <div className="brand-mark">WhatsApp Web</div>

      <Scene3D phase={phase} breakSignal={breakSignal} />

      <div className="login-layer">
        {CHAOS_MODE ? (
          <HauntedLoginCard onLogin={handleLogin} />
        ) : (
          <LoginCard onLogin={handleLogin} disabled={phase !== "idle"} />
        )}
      </div>

      {phase === "glitching" && <GlitchOverlay />}
    </div>
  );
}