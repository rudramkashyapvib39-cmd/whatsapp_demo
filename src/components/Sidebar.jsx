import { useEffect, useMemo, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, MoreVertical, MessageSquarePlus, MessagesSquare, Phone,
  CircleDot, Radio, Users2, Settings as SettingsIcon, BellOff, X,
  ChevronRight, ArrowLeft, User, KeyRound, Lock, MessageSquareText,
  Bell, Keyboard, HelpCircle, LogOut, PhoneMissed, PhoneCall, Video,
  PhoneOutgoing, PhoneIncoming,
} from "lucide-react";
import ChaosMenu from "./ChaosMenu";
import { CHAOS_MODE } from "../lib/chaosConfig";
import { chance, reverseStr, pick, hellCorrect } from "../lib/chaosUtils";
import { useChaos } from "../lib/ChaosProvider";
import {
  CALLS, STATUSES, CHANNELS_FOLLOWED, CHANNELS_SUGGESTED, COMMUNITIES, MY_PROFILE,
} from "../data/seed";

function seededLean(id) {
  const n = Math.sin(id * 999) * 10000;
  return (n - Math.floor(n)) * 6 - 3;
}

const RAIL_ITEMS = [
  { id: "chats", icon: MessagesSquare, badge: 20 },
  { id: "calls", icon: Phone },
  { id: "status", icon: CircleDot },
  { id: "channels", icon: Radio },
  { id: "communities", icon: Users2 },
];

const FILTER_TABS = ["All", "Unread", "Favourites", "Groups"];

const SETTINGS_MENU = [
  { id: "profile", icon: User, label: "Profile", sub: "Name, profile picture, username" },
  { id: "account", icon: KeyRound, label: "Account", sub: "Security notifications, account info" },
  { id: "privacy", icon: Lock, label: "Privacy", sub: "Blocked contacts, disappearing messages" },
  { id: "chats", icon: MessageSquareText, label: "Chats", sub: "Theme, wallpaper, chat settings" },
  { id: "notifications", icon: Bell, label: "Notifications", sub: "Messages, groups, sounds" },
  { id: "shortcuts", icon: Keyboard, label: "Keyboard shortcuts", sub: "Quick actions" },
  { id: "help", icon: HelpCircle, label: "Help and feedback", sub: "Help centre, contact us, privacy policy" },
];

const SETTINGS_SUBPAGES = {
  account: [
    { label: "Security notifications", toggle: true },
    { label: "Two-step verification", sub: "Off" },
    { label: "Change number" },
    { label: "Request account info" },
    { label: "Linked devices", sub: "1 device linked" },
    { label: "Delete my account" },
  ],
  privacy: [
    { label: "Last seen and online", sub: "Nobody" },
    { label: "Profile picture", sub: "1 contact excluded" },
    { label: "About", sub: "Everyone" },
    { label: "Status", sub: "35 contacts included" },
    { label: "Read receipts", toggle: false },
  ],
  chats: [
    { label: "Theme", sub: "System default" },
    { label: "Wallpaper" },
    { label: "Media upload quality" },
    { label: "Spell check", toggle: true },
    { label: "Replace text with emoji", toggle: true },
    { label: "Enter is send", toggle: true },
  ],
  notifications: [
    { label: "Messages", sub: "Off" },
    { label: "Groups", sub: "Off" },
    { label: "Status", sub: "Off" },
    { label: "Calls", sub: "On" },
    { label: "Show previews", toggle: true },
    { label: "Play sound for outgoing messages", toggle: false },
    { label: "Background sync", toggle: false },
  ],
  help: [
    { label: "Help Centre", sub: "Frequently asked questions" },
    { label: "Contact us", sub: "Chat with support to get answers" },
    { label: "Send feedback", sub: "Technical issues, suggestions" },
    { label: "Terms and Privacy Policy" },
    { label: "Channels reports" },
  ],
};

const TAUNTS = [
  "you're gonna cry 😈",
  "wrong choice.",
  "i will kick you out.",
  "should've closed the tab.",
  "this is going to hurt.",
  "no escape.",
  "nice try.",
  "THE VOID WATCHES",
  "RUN WHILE YOU CAN",
];

function Toggle({ on }) {
  return (
    <div className={`flex h-5 w-9 items-center rounded-full px-0.5 ${on ? "justify-end bg-red-600" : "justify-start bg-[#2a0a0a]"}`}>
      <div className="h-4 w-4 rounded-full bg-white" />
    </div>
  );
}

function Row({ icon: Icon, avatar, title, subtitle, time, right, onClick, haunted }) {
  return (
    <div
      onClick={onClick}
      className={`flex cursor-pointer items-center gap-3 px-4 py-2.5 ${haunted ? "hover:bg-red-950/60" : "hover:bg-wa-panel3"}`}
    >
      {Icon ? (
        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${haunted ? "bg-red-950 text-red-400" : "bg-wa-panel3 text-wa-dim"}`}>
          <Icon size={20} />
        </div>
      ) : (
        <Avatar avatar={avatar} name={title} haunted={haunted} />
      )}
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between">
          <span className={`truncate text-[15px] ${haunted ? "text-red-200" : "text-wa-text"}`}>{title}</span>
          {time && <span className={`shrink-0 text-xs ${haunted ? "text-red-600" : "text-wa-dim"}`}>{time}</span>}
        </div>
        {subtitle && <div className={`truncate text-sm ${haunted ? "text-red-500/80" : "text-wa-dim"}`}>{subtitle}</div>}
      </div>
      {right}
    </div>
  );
}

function PhotoZoomModal({ avatar, name, onClose }) {
  return (
    <div onClick={onClose} className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90">
      <div onClick={(e) => e.stopPropagation()} className="flex flex-col items-center gap-3">
        <div className="flex h-72 w-72 items-center justify-center rounded-full bg-red-950 text-[120px] shadow-[0_0_60px_#f00]">
          {avatar}
        </div>
        <div className="text-red-200">{name}</div>
        <button onClick={onClose} className="mt-2 rounded-full bg-red-900 px-4 py-1.5 text-sm text-red-300 hover:text-white">
          Close
        </button>
      </div>
    </div>
  );
}

function Avatar({ avatar, name, size = "h-11 w-11", textSize = "text-xl", zoomable = true, haunted }) {
  const [zoomed, setZoomed] = useState(false);
  return (
    <>
      <div
        onClick={(e) => {
          if (!zoomable) return;
          e.stopPropagation();
          setZoomed(true);
        }}
        className={`flex ${size} shrink-0 items-center justify-center rounded-full ${textSize} ${
          haunted ? "bg-red-950" : "bg-wa-panel3"
        } ${zoomable ? "cursor-zoom-in" : ""}`}
      >
        {avatar}
      </div>
      {zoomed && <PhotoZoomModal avatar={avatar} name={name} onClose={() => setZoomed(false)} />}
    </>
  );
}

function GravityDump({ items, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 1700);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div className="fixed inset-0 z-[110] overflow-hidden bg-black/90">
      <div className="absolute inset-x-0 top-10 text-center text-lg text-red-500 font-bold tracking-widest">
        Everything just fell apart.
      </div>
      {items.map((label, i) => (
        <motion.div
          key={i}
          initial={{ y: -60 - Math.random() * 200, x: 20 + ((i * 53) % 80) + "vw", rotate: 0, opacity: 1 }}
          animate={{ y: "95vh", rotate: (Math.random() - 0.5) * 720 }}
          transition={{ duration: 0.9 + Math.random() * 0.7, delay: Math.random() * 0.4, ease: "easeIn" }}
          style={{ position: "absolute", top: 0 }}
          className="whitespace-nowrap rounded-md bg-red-950 border border-red-700 px-3 py-1.5 text-sm text-red-200 shadow-[0_0_15px_#f00]"
        >
          {label}
        </motion.div>
      ))}
    </div>
  );
}

function StubbornRow({ children, onActivate, required = 4 }) {
  const [attempts, setAttempts] = useState(0);
  const [dodge, setDodge] = useState({ x: 0, y: 0 });
  const timer = useRef(null);

  function handleClick(e) {
    e.stopPropagation();
    const next = attempts + 1;
    clearTimeout(timer.current);
    if (next >= required) {
      setAttempts(0);
      setDodge({ x: 0, y: 0 });
      onActivate();
      return;
    }
    setAttempts(next);
    setDodge({ x: (Math.random() - 0.5) * 90, y: (Math.random() - 0.5) * 36 });
    timer.current = setTimeout(() => {
      setAttempts(0);
      setDodge({ x: 0, y: 0 });
    }, 1400);
  }

  return (
    <div onClick={handleClick} style={{ transform: `translate(${dodge.x}px, ${dodge.y}px)`, transition: "transform 0.12s ease" }}>
      {children}
      {attempts > 0 && (
        <div className="px-4 pb-1 text-[11px] text-red-400">
          That didn't work. Try again. ({attempts}/{required})
        </div>
      )}
    </div>
  );
}

function GlitchOverlay({ text }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, x: [0, -8, 8, -5, 5, -2, 2, 0] }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.55 }}
      className="fixed inset-0 z-[130] flex items-center justify-center bg-black"
    >
      <div className="relative select-none text-3xl font-bold uppercase tracking-widest">
        <span className="absolute inset-0 text-red-500 opacity-80" style={{ transform: "translate(-4px, 2px)" }}>{text}</span>
        <span className="absolute inset-0 text-cyan-400 opacity-70" style={{ transform: "translate(4px, -2px)" }}>{text}</span>
        <span className="relative text-white">{text}</span>
      </div>
    </motion.div>
  );
}

function IconRail({ tab, setTab, onNewChat, haunted }) {
  const { toggleLaggyCursor } = useChaos();
  return (
    <div className={`flex h-full w-[76px] shrink-0 flex-col items-center justify-between border-r py-4 ${
      haunted ? "border-red-950 bg-[#0d0000]" : "border-black/40 bg-wa-panel"
    }`}>
      <div className="flex flex-col items-center gap-2">
        {RAIL_ITEMS.map(({ id, icon: Icon, badge }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`relative flex h-12 w-12 items-center justify-center rounded-lg transition-colors ${
              tab === id
                ? haunted ? "bg-red-950 text-red-400" : "bg-wa-panel3 text-wa-teal"
                : haunted ? "text-red-700 hover:bg-red-950/50" : "text-wa-dim hover:bg-wa-panel2"
            }`}
          >
            <Icon size={26} strokeWidth={1.7} />
            {badge && (
              <span className={`absolute -right-1 -top-1 rounded-full px-1.5 py-0.5 text-[11px] font-medium leading-none ${
                haunted ? "bg-red-600 text-white" : "bg-wa-teal text-wa-panel"
              }`}>
                {badge}
              </span>
            )}
          </button>
        ))}
        <button
          onClick={() => setTab("settings")}
          className={`mt-3 flex h-12 w-12 items-center justify-center rounded-lg ${
            tab === "settings"
              ? haunted ? "bg-red-950 text-red-400" : "bg-wa-panel3 text-wa-teal"
              : haunted ? "text-red-700 hover:bg-red-950/50" : "text-wa-dim hover:bg-wa-panel2"
          }`}
        >
          <SettingsIcon size={26} strokeWidth={1.7} />
        </button>
      </div>
      <div className="flex flex-col items-center gap-4">
        <button onClick={onNewChat} title="New chat" className={haunted ? "text-red-600 hover:text-red-400" : "text-wa-dim hover:text-wa-text"}>
          <MessageSquarePlus size={24} />
        </button>
        <div
          onClick={() => {
            setTab("settings");
            if (CHAOS_MODE) toggleLaggyCursor();
          }}
          title="Your profile"
          className={`flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-lg ${
            haunted ? "bg-red-950" : "bg-wa-panel3"
          }`}
        >
          {MY_PROFILE.avatar}
        </div>
      </div>
    </div>
  );
}

/* ─────────────── CHATS TAB ─────────────── */
function ChatsTab({ contacts, activeId, onSelect, onNewChat, onLog, haunted }) {
  const { spite, activated, activateChaos, triggerTornado } = useChaos();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const [showBanner, setShowBanner] = useState(true);
  const [jumps, setJumps] = useState({});
  const [order, setOrder] = useState(contacts.map((c) => c.id));
  const [ghostUnread, setGhostUnread] = useState({});
  const [caught, setCaught] = useState(new Set());
  const [falling, setFalling] = useState([]);
  const spawned = useRef(new Set());
  const [fleeing, setFleeing] = useState(null);
  const [gravity, setGravity] = useState(false);

  useEffect(() => {
    if (!CHAOS_MODE || !activated) return;
    const t = setInterval(() => {
      if (chance(0.55)) {
        setOrder((prev) => {
          const next = [...prev];
          for (let i = next.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [next[i], next[j]] = [next[j], next[i]];
          }
          return next;
        });
        spite("Chat list just shuffled. Good luck finding anyone.");
      }
    }, 14000 + Math.random() * 7000);
    return () => clearInterval(t);
  }, [spite, activated]);

  useEffect(() => {
    if (!CHAOS_MODE || !activated) return;
    const t = setInterval(() => {
      if (chance(0.5)) {
        const victim = pick(contacts);
        setGhostUnread((g) => ({ ...g, [victim.id]: (g[victim.id] || 0) + 1 + Math.floor(Math.random() * 4) }));
        spite("Unread badges returned. We missed them.");
      }
    }, 12000 + Math.random() * 9000);
    return () => clearInterval(t);
  }, [contacts, spite, activated]);

  useEffect(() => {
    setOrder((prev) => {
      const existing = new Set(prev);
      const added = contacts.filter((c) => !existing.has(c.id)).map((c) => c.id);
      return [...added, ...prev.filter((id) => contacts.some((c) => c.id === id))];
    });
  }, [contacts]);

  const matches = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    if (CHAOS_MODE && activated) {
      return contacts.filter((c) => c.name.toLowerCase().includes(reverseStr(q)));
    }
    return contacts.filter((c) => c.name.toLowerCase().includes(q));
  }, [query, contacts, activated]);

  useEffect(() => {
    if (!CHAOS_MODE || !activated) return;
    if (!query.trim()) {
      setCaught(new Set());
      setFalling([]);
      spawned.current = new Set();
      return;
    }
    matches.forEach((c) => {
      if (!spawned.current.has(c.id)) {
        spawned.current.add(c.id);
        const x = 10 + Math.random() * 70;
        const dur = 1.6 + Math.random() * 1.2;
        setFalling((f) => [...f, { ...c, fallId: c.id + "-" + Date.now(), x, dur }]);
      }
    });
  }, [matches, query, activated]);

  function catchResult(item) {
    setCaught((s) => new Set(s).add(item.id));
    setFalling((f) => f.filter((x) => x.fallId !== item.fallId));
    onLog?.(`Caught "${item.name}" before it hit the floor.`);
  }

  function missResult(item) {
    setFalling((f) => f.filter((x) => x.fallId !== item.fallId));
    spawned.current.delete(item.id);
    onLog?.(`"${item.name}" hit the floor. Missed it — try searching again.`);
  }

  function handleSelect(id) {
    activateChaos();

    if (CHAOS_MODE && activated) {
      setFleeing(id);
      setOrder((prev) => {
        const next = [...prev];
        for (let i = next.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [next[i], next[j]] = [next[j], next[i]];
        }
        return next;
      });
      spite("That chat just flew off. List reshuffled for your convenience.");
      setTimeout(() => setFleeing(null), 500);
    }

    setGhostUnread((g) => {
      const { [id]: _, ...rest } = g;
      return rest;
    });

    if (CHAOS_MODE && activated && contacts.length > 1 && chance(0.45)) {
      const others = contacts.filter((c) => c.id !== id);
      const wrong = others[Math.floor(Math.random() * others.length)];
      const clicked = contacts.find((c) => c.id === id);
      spite(`You clicked ${clicked?.name || "a chat"}. You got ${wrong.name}.`);
      onSelect(wrong.id);
      return;
    }
    onSelect(id);
  }

  function handleFilter(t) {
    activateChaos();
    if (CHAOS_MODE && activated && chance(0.5)) {
      const wrong = pick(FILTER_TABS.filter((x) => x !== t));
      setFilter(wrong);
      spite(`You wanted "${t}". You got "${wrong}".`);
      return;
    }
    setFilter(t);
  }

  const orderedContacts = order
    .map((id) => contacts.find((c) => c.id === id))
    .filter(Boolean);

  const base = query.trim()
    ? CHAOS_MODE && activated
      ? orderedContacts.filter((c) => caught.has(c.id))
      : matches
    : orderedContacts;

  const visible =
    filter === "Unread"
      ? base.filter((c) => c.unread > 0 || ghostUnread[c.id])
      : filter === "Groups"
      ? base.filter((c) => c.name.toLowerCase().includes("group") || c.name.toLowerCase().includes("committee"))
      : base;

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between px-4 py-3">
        <h1 className={`text-xl font-medium ${haunted ? "text-red-300" : "text-wa-text"}`}>
          {haunted ? "WhatsApp — Hell" : "WhatsApp"}
        </h1>
        <div className={`flex items-center gap-4 ${haunted ? "text-red-600" : "text-wa-dim"}`}>
          <ChaosMenu
            trigger={<MoreVertical size={20} className="cursor-pointer hover:text-red-300" />}
            items={[
              { label: "New group", onClick: () => { activateChaos(); onLog?.("New group: also just opens New chat."); } },
              { label: "Starred messages", onClick: () => { activateChaos(); onLog?.("Starred messages: coming never."); } },
              { label: "Settings", onClick: () => { activateChaos(); onLog?.("Settings: there are none."); } },
              { label: "Open the void", onClick: () => { activateChaos(); triggerTornado(); } },
              { label: "Send everything to hell", onClick: () => { activateChaos(); setGravity(true); onLog?.("Everything just fell down."); setTimeout(() => setGravity(false), 1600); } },
            ]}
          />
        </div>
      </div>

      <div className="px-3 pb-2">
        <div className={`flex items-center gap-2 rounded-lg px-3 py-1.5 ${haunted ? "bg-red-950" : "bg-wa-panel3"}`}>
          <Search size={16} className={`shrink-0 ${haunted ? "text-red-600" : "text-wa-dim"}`} />
          <input
            value={query}
            onChange={(e) => { setQuery(e.target.value); if (e.target.value) activateChaos(); }}
            placeholder="Search or start a new chat"
            className={`w-full bg-transparent text-sm outline-none ${haunted ? "text-red-200 placeholder:text-red-700" : "text-wa-text placeholder:text-wa-dim"}`}
          />
        </div>
        {CHAOS_MODE && activated && query.trim() && (
          <div className="mt-1 text-[11px] text-red-500">Search is broken. Try typing the name backwards.</div>
        )}
      </div>

      <div className="flex gap-2 px-3 pb-2">
        {FILTER_TABS.map((t) => (
          <button
            key={t}
            onClick={() => handleFilter(t)}
            className={`rounded-full px-3 py-1 text-sm ${
              filter === t
                ? haunted ? "bg-red-900/60 text-red-300" : "bg-wa-teal/20 text-wa-teal"
                : haunted ? "text-red-600 hover:bg-red-950" : "text-wa-dim hover:bg-wa-panel3"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {showBanner && (
        <div className={`mx-3 mb-2 flex items-center justify-between rounded-lg border px-3 py-2 ${
          haunted ? "border-red-800 bg-red-950/40" : "border-wa-teal/30 bg-wa-panel2"
        }`}>
          <div className={`flex items-center gap-2 text-sm ${haunted ? "text-red-200" : "text-wa-text"}`}>
            <BellOff size={16} className={haunted ? "text-red-500" : "text-wa-teal"} />
            <span>
              Message notifications are off. <span className={haunted ? "cursor-pointer text-red-400" : "cursor-pointer text-wa-teal"}>Turn on</span>
            </span>
          </div>
          <X size={16} className={`cursor-pointer ${haunted ? "text-red-600" : "text-wa-dim"}`} onClick={() => setShowBanner(false)} />
        </div>
      )}

      <div className="relative flex-1 overflow-y-auto">
        {CHAOS_MODE && gravity && (
          <GravityDump items={visible.map((c) => c.name)} onDone={() => setGravity(false)} />
        )}

        {CHAOS_MODE && activated && falling.map((item) => (
          <motion.div
            key={item.fallId}
            initial={{ y: -40, x: `${item.x}vw`, opacity: 1 }}
            animate={{ y: "100vh", rotate: 360 }}
            transition={{ duration: item.dur, ease: "easeIn" }}
            onAnimationComplete={() => missResult(item)}
            onClick={() => catchResult(item)}
            className="fixed z-[90] cursor-pointer rounded-full bg-red-900 px-3 py-1 text-sm text-red-100 shadow-lg"
            style={{ left: 0 }}
          >
            {item.name} 👻
          </motion.div>
        ))}

        {visible.map((c) => {
          const jump = jumps[c.id];
          const lean = seededLean(c.id);
          const isFleeing = fleeing === c.id;
          const unread = (c.unread || 0) + (ghostUnread[c.id] || 0);
          return (
            <motion.div
              key={c.id}
              onClick={() => handleSelect(c.id)}
              onMouseEnter={() =>
                CHAOS_MODE && activated &&
                setJumps((j) => ({
                  ...j,
                  [c.id]: { x: (Math.random() - 0.5) * 40, y: (Math.random() - 0.5) * 22 },
                }))
              }
              onMouseLeave={() =>
                setJumps((j) => {
                  const { [c.id]: _, ...rest } = j;
                  return rest;
                })
              }
              animate={
                isFleeing
                  ? { x: 480, y: -160, rotate: 55, opacity: 0 }
                  : { x: jump ? jump.x : 0, y: jump ? jump.y : 0, rotate: lean, opacity: 1 }
              }
              transition={{ duration: isFleeing ? 0.45 : 0.2, ease: isFleeing ? "easeIn" : "easeOut" }}
              className={`group relative flex cursor-pointer items-center gap-3 px-4 py-2.5 ${
                activeId === c.id
                  ? haunted ? "bg-red-950/70" : "bg-wa-panel3"
                  : haunted ? "hover:bg-red-950/40" : "hover:bg-wa-panel2"
              }`}
            >
              <Avatar avatar={c.avatar} name={c.name} size="h-12 w-12" haunted={haunted} />
              <div className="min-w-0 flex-1 border-b border-white/5 pb-2.5 group-last:border-none">
                <div className="flex items-center justify-between">
                  <span className={`truncate text-[15px] ${haunted ? "text-red-200" : "text-wa-text"}`}>
                    {haunted && activated && chance(0.3) ? hellCorrect(c.name) : c.name}
                  </span>
                  <span className={`shrink-0 text-[11px] ${haunted ? "text-red-600" : "text-wa-dim"}`}>{c.time}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className={`truncate text-[13px] ${haunted ? "text-red-500/80" : "text-wa-dim"}`}>{c.last}</span>
                  {unread > 0 && (
                    <span className={`ml-2 flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-[11px] font-bold ${
                      haunted ? "bg-red-600 text-white" : "bg-wa-teal text-wa-panel"
                    }`}>
                      {unread}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}

        {query.trim() && visible.length === 0 && (!CHAOS_MODE || !activated || falling.length === 0) && (
          <div className="p-6 text-center text-xs text-red-600">No chats found. The void took them.</div>
        )}
      </div>
    </div>
  );
}

/* ─────────────── CALLS / STATUS / CHANNELS / COMMUNITIES / SETTINGS ─────────────── */
/* (identical structure to your original, only haunted colors + triggerTornado added) */

function CallsTab({ contacts, onLog, onMisdirect, haunted }) {
  const [ringing, setRinging] = useState(null);
  const [hacked, setHacked] = useState(false);
  const { activateChaos, triggerTornado } = useChaos();

  function place(contact, type) {
    activateChaos();
    if (CHAOS_MODE) {
      setHacked(true);
      onLog?.(`Tried to ${type === "video" ? "video" : "voice"} call ${contact.name}. Got hacked instead.`);
      setTimeout(() => {
        setHacked(false);
        if (chance(0.6)) triggerTornado();
        else onMisdirect?.();
      }, 1900);
      return;
    }
    setRinging({ name: contact.name, type });
    onLog?.(`${type === "video" ? "Video" : "Voice"} calling ${contact.name}...`);
    setTimeout(() => setRinging(null), 2200);
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between px-4 py-3">
        <h1 className={`text-xl font-medium ${haunted ? "text-red-300" : "text-wa-text"}`}>Calls</h1>
        <Phone size={20} className={haunted ? "text-red-600" : "text-wa-dim"} />
      </div>
      <div className={`px-4 py-2 text-sm ${haunted ? "text-red-600" : "text-wa-dim"}`}>Recent</div>
      <div className="flex-1 overflow-y-auto">
        {CALLS.map((call) => {
          const contact = contacts.find((c) => c.id === call.contactId);
          if (!contact) return null;
          const StatusIcon = call.status === "Missed" ? PhoneMissed : call.status === "Outgoing" ? PhoneOutgoing : PhoneIncoming;
          return (
            <Row
              key={call.id}
              avatar={contact.avatar}
              title={contact.name}
              time={call.time}
              subtitle={
                <span className={`flex items-center gap-1 ${call.status === "Missed" ? "text-red-400" : haunted ? "text-red-500" : "text-wa-dim"}`}>
                  <StatusIcon size={12} /> {call.status} · {call.type === "video" ? "Video" : "Voice"}
                </span>
              }
              right={
                <div className={`flex items-center gap-3 ${haunted ? "text-red-600" : "text-wa-dim"}`}>
                  <PhoneCall size={18} className="cursor-pointer hover:text-red-400"
                    onClick={(e) => { e.stopPropagation(); place(contact, "voice"); }} />
                  <Video size={20} className="cursor-pointer hover:text-red-400"
                    onClick={(e) => { e.stopPropagation(); place(contact, "video"); }} />
                </div>
              }
              haunted={haunted}
            />
          );
        })}
      </div>

      {ringing && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-3 bg-black/90">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-red-950 text-4xl animate-pulse">
            {ringing.type === "video" ? "📹" : "📞"}
          </div>
          <div className="text-lg text-red-200">Calling {ringing.name}…</div>
          <div className="text-sm text-red-500">{ringing.type === "video" ? "Video call" : "Voice call"}</div>
        </div>
      )}

      {hacked && (
        <motion.div
          animate={{ x: [0, -10, 10, -7, 7, -3, 3, 0] }}
          transition={{ duration: 0.5, repeat: 4 }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-3 bg-red-950/95 text-center"
        >
          <div className="text-5xl">😭</div>
          <div className="text-xl font-bold text-red-400">⚠ Your website has been hacked</div>
          <div className="max-w-xs text-sm text-red-200">Calls are disabled. The void is redirecting you…</div>
        </motion.div>
      )}
    </div>
  );
}

function StatusTab({ contacts, haunted }) {
  const { activated, activateChaos, triggerTornado } = useChaos();
  const [flown, setFlown] = useState({});

  function handleClick(id) {
    activateChaos();
    if (!CHAOS_MODE || !activated) return;
    setFlown((f) => ({ ...f, [id]: true }));
    setTimeout(() => setFlown((f) => ({ ...f, [id]: false })), 1400);
    if (chance(0.35)) setTimeout(() => triggerTornado(), 800);
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between px-4 py-3">
        <h1 className={`text-xl font-medium ${haunted ? "text-red-300" : "text-wa-text"}`}>Status</h1>
        <CircleDot size={20} className={haunted ? "text-red-600" : "text-wa-dim"} />
      </div>
      <Row avatar={MY_PROFILE.avatar} title="My status" subtitle="Click to add status update" right={<span className="text-red-500">+</span>} haunted={haunted} />
      <div className={`px-4 py-2 text-sm ${haunted ? "text-red-600" : "text-wa-dim"}`}>Recent</div>
      <div className="relative flex-1 overflow-y-auto">
        {STATUSES.map((s) => {
          const contact = contacts.find((c) => c.id === s.contactId);
          if (!contact) return null;
          const isFlown = CHAOS_MODE && activated && flown[s.id];
          const name = CHAOS_MODE && activated ? reverseStr(contact.name) : contact.name;
          return (
            <motion.div
              key={s.id}
              onClick={() => handleClick(s.id)}
              animate={
                isFlown
                  ? { x: (Math.random() > 0.5 ? 1 : -1) * (300 + Math.random() * 200), y: 500, rotate: (Math.random() - 0.5) * 900, opacity: 0 }
                  : { x: 0, y: 0, rotate: 0, opacity: 1 }
              }
              transition={{ duration: isFlown ? 1 : 0.3, ease: isFlown ? "easeIn" : "easeOut" }}
              className="cursor-pointer"
            >
              <Row avatar={contact.avatar} title={name} subtitle={s.time} haunted={haunted} />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

function ChannelsTab({ haunted }) {
  const [open, setOpen] = useState(null);
  const [gravity, setGravity] = useState(false);
  const { activateChaos, triggerTornado } = useChaos();

  if (open) {
    return (
      <div className="flex h-full flex-col">
        <div className="flex items-center gap-3 px-4 py-3">
          <ArrowLeft size={20} className={`cursor-pointer ${haunted ? "text-red-500" : "text-wa-dim"}`} onClick={() => setOpen(null)} />
          <Avatar avatar={open.avatar} name={open.name} size="h-9 w-9" textSize="text-base" haunted={haunted} />
          <h1 className={`truncate text-base ${haunted ? "text-red-200" : "text-wa-text"}`}>{open.name}</h1>
        </div>
        <div className="flex-1 space-y-2 overflow-y-auto px-4 py-3">
          {open.messages.map((m) => (
            <div key={m.id} className={`max-w-[80%] rounded-lg px-3 py-2 ${haunted ? "bg-red-950" : "bg-wa-panel2"}`}>
              <div className={`text-sm ${haunted ? "text-red-200" : "text-wa-text"}`}>{m.text}</div>
              <div className={`mt-1 text-right text-[11px] ${haunted ? "text-red-600" : "text-wa-dim"}`}>{m.time}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex h-full flex-col">
      {CHAOS_MODE && gravity && (
        <GravityDump
          items={[...CHANNELS_FOLLOWED.map((c) => c.name), ...CHANNELS_SUGGESTED.map((c) => c.name)]}
          onDone={() => setGravity(false)}
        />
      )}
      <div className="flex items-center justify-between px-4 py-3">
        <h1 className={`text-xl font-medium ${haunted ? "text-red-300" : "text-wa-text"}`}>Channels</h1>
        <Radio size={20} className={haunted ? "text-red-600" : "text-wa-dim"} />
      </div>
      <div className="flex-1 overflow-y-auto">
        {CHANNELS_FOLLOWED.map((c) => {
          const lastMsg = c.messages[c.messages.length - 1];
          const row = (
            <Row
              avatar={c.avatar}
              title={c.verified ? `${c.name} ✓` : c.name}
              subtitle={lastMsg?.text}
              time={lastMsg?.time}
              haunted={haunted}
            />
          );
          return CHAOS_MODE ? (
            <StubbornRow key={c.id} onActivate={() => { activateChaos(); setOpen(c); if (chance(0.3)) triggerTornado(); }}>
              {row}
            </StubbornRow>
          ) : (
            <div key={c.id} onClick={() => setOpen(c)}>{row}</div>
          );
        })}
        <div className={`px-4 py-3 text-sm ${haunted ? "text-red-600" : "text-wa-dim"}`}>Find channels to follow</div>
        {CHANNELS_SUGGESTED.map((c) => (
          <Row
            key={c.id}
            avatar={c.avatar}
            title={c.verified ? `${c.name} ✓` : c.name}
            subtitle={c.followers}
            right={
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (CHAOS_MODE) {
                    activateChaos();
                    setGravity(true);
                    setTimeout(() => setGravity(false), 1700);
                    if (chance(0.4)) setTimeout(() => triggerTornado(), 1800);
                  }
                }}
                className={`rounded-full px-3 py-1 text-sm ${haunted ? "bg-red-900 text-red-300" : "bg-wa-panel3 text-wa-teal"}`}
              >
                Follow
              </button>
            }
            haunted={haunted}
          />
        ))}
      </div>
    </div>
  );
}

function CommunitiesTab({ onNewChat, haunted }) {
  const [expanded, setExpanded] = useState(null);
  const { activateChaos, triggerTornado } = useChaos();

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between px-4 py-3">
        <h1 className={`text-xl font-medium ${haunted ? "text-red-300" : "text-wa-text"}`}>Communities</h1>
        <Users2 size={20} className={haunted ? "text-red-600" : "text-wa-dim"} />
      </div>
      <Row icon={Users2} title="New community" onClick={onNewChat} haunted={haunted} />
      <div className="flex-1 overflow-y-auto">
        {COMMUNITIES.map((c) => {
          const isOpen = expanded === c.id;
          const row = <Row avatar={c.avatar} title={c.name} subtitle={c.badge} haunted={haunted} />;
          const toggle = () => {
            activateChaos();
            if (isOpen) { setExpanded(null); return; }
            setExpanded(c.id);
            if (CHAOS_MODE && chance(0.45)) {
              setTimeout(() => setExpanded(null), 300);
            }
            if (CHAOS_MODE && chance(0.25)) setTimeout(() => triggerTornado(), 600);
          };
          return (
            <div key={c.id} className="mt-2 border-t border-black/20 pt-1 first:mt-0 first:border-none">
              {CHAOS_MODE ? (
                <StubbornRow onActivate={toggle}>{row}</StubbornRow>
              ) : (
                <div onClick={toggle}>{row}</div>
              )}
              {isOpen && (
                <div className="pb-2 pl-16 pr-4">
                  {c.groups.map((g) => (
                    <div key={g.name} className={`truncate py-1 text-sm ${haunted ? "text-red-500" : "text-wa-dim"}`}>
                      <span className={haunted ? "text-red-200" : "text-wa-text"}>{g.name}</span> — {g.last}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SettingsTab({ onLogout, haunted }) {
  const [page, setPage] = useState(null);
  const [denied, setDenied] = useState(false);
  const { activateChaos, triggerTornado } = useChaos();

  if (page === "profile") {
    return (
      <div className="flex h-full flex-col">
        <div className="flex items-center gap-4 px-4 py-3">
          <ArrowLeft size={20} className={`cursor-pointer ${haunted ? "text-red-500" : "text-wa-dim"}`} onClick={() => setPage(null)} />
          <h1 className={`text-lg ${haunted ? "text-red-200" : "text-wa-text"}`}>Profile</h1>
        </div>
        <div className="flex justify-center py-6">
          <Avatar avatar={MY_PROFILE.avatar} name={MY_PROFILE.name} size="h-28 w-28" textSize="text-5xl" haunted={haunted} />
        </div>
        <div className={`px-4 py-2 text-sm ${haunted ? "text-red-500" : "text-wa-teal"}`}>Name</div>
        <div className={`px-4 pb-3 ${haunted ? "text-red-200" : "text-wa-text"}`}>{MY_PROFILE.name}</div>
        <div className={`px-4 py-2 text-sm ${haunted ? "text-red-500" : "text-wa-teal"}`}>About</div>
        <div className={`px-4 pb-3 ${haunted ? "text-red-200" : "text-wa-text"}`}>{MY_PROFILE.about}</div>
        <div className={`px-4 py-2 text-sm ${haunted ? "text-red-500" : "text-wa-teal"}`}>Email</div>
        <div className={`px-4 pb-3 ${haunted ? "text-red-200" : "text-wa-text"}`}>{MY_PROFILE.email}</div>
        <div className={`px-4 py-2 text-sm ${haunted ? "text-red-500" : "text-wa-teal"}`}>Phone</div>
        <div className={`px-4 pb-3 ${haunted ? "text-red-200" : "text-wa-text"}`}>{MY_PROFILE.phone}</div>
      </div>
    );
  }

  if (page) {
    return (
      <div className="flex h-full flex-col">
        <div className="flex items-center gap-4 px-4 py-3">
          <ArrowLeft size={20} className={`cursor-pointer ${haunted ? "text-red-500" : "text-wa-dim"}`} onClick={() => setPage(null)} />
          <h1 className={`text-lg capitalize ${haunted ? "text-red-200" : "text-wa-text"}`}>{page}</h1>
        </div>
        <div className="flex-1 overflow-y-auto">
          {SETTINGS_SUBPAGES[page]?.map((r, i) => (
            <div key={i} className={`flex items-center justify-between px-4 py-3 ${haunted ? "hover:bg-red-950/50" : "hover:bg-wa-panel3"}`}>
              <div>
                <div className={haunted ? "text-red-200" : "text-wa-text"}>{r.label}</div>
                {r.sub && <div className={`text-sm ${haunted ? "text-red-600" : "text-wa-dim"}`}>{r.sub}</div>}
              </div>
              {"toggle" in r ? <Toggle on={r.toggle} /> : r.sub ? <ChevronRight size={16} className={haunted ? "text-red-600" : "text-wa-dim"} /> : null}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex h-full flex-col">
      {denied && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-red-950/95">
          <div className="text-2xl font-bold tracking-widest text-red-400">⛔ ACCESS DENIED</div>
        </div>
      )}
      <div className="px-4 py-3">
        <div className={`flex items-center gap-2 rounded-full px-3 py-1.5 ${haunted ? "bg-red-950" : "bg-wa-panel3"}`}>
          <Search size={16} className={haunted ? "text-red-600" : "text-wa-dim"} />
          <input placeholder="Search" className={`w-full bg-transparent text-sm outline-none ${haunted ? "text-red-200 placeholder:text-red-700" : "text-wa-text placeholder:text-wa-dim"}`} />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        {SETTINGS_MENU.map(({ id, icon, label, sub }) => {
          const row = <Row icon={icon} title={label} subtitle={sub} haunted={haunted} />;
          const open = () => {
            activateChaos();
            if (CHAOS_MODE && chance(0.3)) {
              setDenied(true);
              setTimeout(() => setDenied(false), 700);
              return;
            }
            if (CHAOS_MODE && chance(0.25)) {
              triggerTornado();
              return;
            }
            setPage(id);
          };
          return CHAOS_MODE ? (
            <StubbornRow key={id} onActivate={open}>{row}</StubbornRow>
          ) : (
            <div key={id} onClick={open}>{row}</div>
          );
        })}
        <div
          onClick={onLogout}
          className={`mt-2 flex cursor-pointer items-center gap-4 border-t px-4 py-3 text-red-400 ${
            haunted ? "border-red-900 hover:bg-red-950/50" : "border-black/40 hover:bg-wa-panel3"
          }`}
        >
          <LogOut size={20} />
          Log out
        </div>
      </div>
    </div>
  );
}

function LoggedOutScreen({ onLogin }) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4 bg-[#0d0000] text-center">
      <div className="text-5xl">👋</div>
      <div className="text-lg text-red-200">You've been logged out</div>
      <div className="max-w-xs text-sm text-red-500">
        Your chats are still on this device. Log back in whenever you're ready.
      </div>
      <button
        onClick={onLogin}
        className="mt-2 rounded-full bg-red-700 px-5 py-2 text-sm font-medium text-white"
      >
        Log back in
      </button>
    </div>
  );
}

export default function Sidebar({ contacts, activeId, onSelect, onNewChat, onLog }) {
  const [tab, setTab] = useState("chats");
  const [runAway, setRunAway] = useState(false);
  const [loggedOut, setLoggedOut] = useState(false);
  const [glitch, setGlitch] = useState(null);
  const { activated, haunted } = useChaos();

  function changeTab(id) {
    if (CHAOS_MODE && activated && id !== tab) {
      setGlitch(pick(TAUNTS));
      setTimeout(() => {
        setTab(id);
        setGlitch(null);
      }, 520);
      return;
    }
    setTab(id);
  }

  useEffect(() => {
    if (!CHAOS_MODE || !activated) return;
    const t = setInterval(() => {
      if (chance(0.3)) {
        setRunAway(true);
        setTimeout(() => setRunAway(false), 800);
      }
    }, 12000 + Math.random() * 8000);
    return () => clearInterval(t);
  }, [activated]);

  if (loggedOut) {
    return (
      <div className="flex h-full w-[452px] shrink-0 border-r border-red-950 bg-[#0d0000]">
        <LoggedOutScreen onLogin={() => setLoggedOut(false)} />
      </div>
    );
  }

  const content = {
    chats: <ChatsTab contacts={contacts} activeId={activeId} onSelect={onSelect} onNewChat={onNewChat} onLog={onLog} haunted={haunted} />,
    calls: <CallsTab contacts={contacts} onLog={onLog} onMisdirect={() => changeTab(chance(0.5) ? "chats" : "settings")} haunted={haunted} />,
    status: <StatusTab contacts={contacts} haunted={haunted} />,
    channels: <ChannelsTab haunted={haunted} />,
    communities: <CommunitiesTab onNewChat={onNewChat} haunted={haunted} />,
    settings: <SettingsTab onLogout={() => setLoggedOut(true)} haunted={haunted} />,
  }[tab];

  return (
    <div
      style={{ transform: runAway ? "translateX(-60px)" : "translateX(0)", transition: "transform 0.35s ease" }}
      className={`relative flex h-full w-[452px] shrink-0 border-r ${
        haunted ? "border-red-950 bg-[#0d0000]" : "border-black/40 bg-wa-panel"
      }`}
    >
      <AnimatePresence>{glitch && <GlitchOverlay key="glitch" text={glitch} />}</AnimatePresence>
      <IconRail tab={tab} setTab={changeTab} onNewChat={onNewChat} haunted={haunted} />
      <div className="flex h-full w-full flex-col">{content}</div>
    </div>
  );
}