import { useState } from "react";
import {
  Search, User, KeyRound, Lock, MessageSquareText, Bell, Keyboard,
  HelpCircle, LogOut, ChevronRight, ArrowLeft,
} from "lucide-react";

const MENU = [
  { id: "profile", icon: User, label: "Profile", sub: "Name, profile picture, username" },
  { id: "account", icon: KeyRound, label: "Account", sub: "Security notifications, account info" },
  { id: "privacy", icon: Lock, label: "Privacy", sub: "Blocked contacts, disappearing messages" },
  { id: "chats", icon: MessageSquareText, label: "Chats", sub: "Theme, wallpaper, chat settings" },
  { id: "notifications", icon: Bell, label: "Notifications", sub: "Messages, groups, sounds" },
  { id: "shortcuts", icon: Keyboard, label: "Keyboard shortcuts", sub: "Quick actions" },
  { id: "help", icon: HelpCircle, label: "Help and feedback", sub: "Help centre, contact us, privacy policy" },
];

function Toggle({ on }) {
  return (
    <div className={`w-9 h-5 rounded-full flex items-center px-0.5 ${on ? "bg-[#00a884] justify-end" : "bg-[#4a5761] justify-start"}`}>
      <div className="w-4 h-4 bg-white rounded-full" />
    </div>
  );
}

function SubPage({ id, onBack }) {
  const rows = {
    account: [
      { label: "Security notifications" },
      { label: "Request account info" },
      { label: "How to delete my account" },
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
      { label: "Media auto-download" },
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

  return (
    <div className="w-full max-w-xs bg-[#111b21] text-white flex flex-col border-r border-[#222d34] h-full">
      <div className="flex items-center gap-4 px-4 py-3">
        <ArrowLeft size={20} className="cursor-pointer" onClick={onBack} />
        <h1 className="text-lg capitalize">{id}</h1>
      </div>
      <div className="flex-1 overflow-y-auto">
        {(rows[id] || []).map((r, i) => (
          <div key={i} className="flex items-center justify-between px-4 py-3 hover:bg-[#202c33] cursor-pointer">
            <div>
              <div>{r.label}</div>
              {r.sub && <div className="text-sm text-[#8696a0]">{r.sub}</div>}
            </div>
            {"toggle" in r ? <Toggle on={r.toggle} /> : !r.sub ? null : <ChevronRight size={16} className="text-[#8696a0]" />}
          </div>
        ))}
      </div>
    </div>
  );
}

function ProfilePage({ onBack }) {
  return (
    <div className="w-full max-w-xs bg-[#111b21] text-white flex flex-col border-r border-[#222d34] h-full">
      <div className="flex items-center gap-4 px-4 py-3">
        <ArrowLeft size={20} className="cursor-pointer" onClick={onBack} />
        <h1 className="text-lg">Edit profile</h1>
      </div>
      <div className="flex justify-center py-6">
        <img src="https://i.pravatar.cc/120?img=8" className="w-28 h-28 rounded-full object-cover" />
      </div>
      <div className="px-4 py-2 text-sm text-[#00a884]">About</div>
      <div className="px-4 pb-3 flex justify-between items-center">
        <span>What's happening?</span>
      </div>
      <div className="px-4 py-2 text-sm text-[#00a884]">Name</div>
      <div className="px-4 pb-3">~</div>
      <div className="px-4 py-2 text-sm text-[#00a884]">Phone</div>
      <div className="px-4 pb-3">+91 xxxxxxxxxx</div>
    </div>
  );
}

export default function SettingsPanel() {
  const [open, setOpen] = useState(null);

  if (open === "profile") return <ProfilePage onBack={() => setOpen(null)} />;
  if (open) return <SubPage id={open} onBack={() => setOpen(null)} />;

  return (
    <div className="w-full max-w-xs bg-[#111b21] text-white flex flex-col border-r border-[#222d34] h-full">
      <div className="px-4 py-3">
        <div className="flex items-center gap-2 bg-[#202c33] rounded-full px-3 py-1.5 mb-3">
          <Search size={16} className="text-[#aebac1]" />
          <input placeholder="Search" className="bg-transparent outline-none text-sm w-full placeholder:text-[#8696a0]" />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        {MENU.map(({ id, icon: Icon, label, sub }) => (
          <div key={id} onClick={() => setOpen(id)} className="flex items-center gap-4 px-4 py-3 hover:bg-[#202c33] cursor-pointer">
            <Icon size={20} className="text-[#aebac1]" />
            <div>
              <div>{label}</div>
              <div className="text-sm text-[#8696a0]">{sub}</div>
            </div>
          </div>
        ))}
        <div className="flex items-center gap-4 px-4 py-3 hover:bg-[#202c33] cursor-pointer text-red-400 border-t border-[#222d34] mt-2">
          <LogOut size={20} />
          Log out
        </div>
      </div>
    </div>
  );
}