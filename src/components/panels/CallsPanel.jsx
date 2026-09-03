import { Phone, Grid3x3, PhoneCall, Video, Link2, PhoneMissed } from "lucide-react";

const RECENT = [
  { name: "Sristi", status: "Missed", time: "Yesterday" },
  { name: "Ayushi", status: "Missed", time: "Monday" },
  { name: "AMMA", status: "Outgoing", time: "Sunday" },
  { name: "Sakshi Dixit", status: "Missed", time: "Friday" },
];

export default function CallsPanel() {
  return (
    <div className="flex h-full w-full">
      <div className="w-full max-w-xs bg-[#111b21] text-white flex flex-col border-r border-[#222d34]">
        <div className="flex items-center justify-between px-4 py-3">
          <h1 className="text-xl font-medium">Calls</h1>
          <div className="flex gap-4 text-[#aebac1]">
            <Grid3x3 size={20} className="cursor-pointer" />
            <Phone size={20} className="cursor-pointer" />
          </div>
        </div>
        <div className="text-[#8696a0] text-sm px-4 py-2">Favourites</div>
        <div className="flex items-center gap-3 px-4 py-2 hover:bg-[#202c33] cursor-pointer">
          <div className="w-11 h-11 rounded-full bg-[#00a884] flex items-center justify-center text-black">+</div>
          <span>Add favourite</span>
        </div>
        <div className="text-[#8696a0] text-sm px-4 py-2">Recent</div>
        {RECENT.map((c, i) => (
          <div key={i} className="flex items-center gap-3 px-4 py-2 hover:bg-[#202c33] cursor-pointer">
            <img src={`https://i.pravatar.cc/44?img=${i + 50}`} className="w-11 h-11 rounded-full" />
            <div className="flex-1">
              <div>{c.name}</div>
              <div className={`text-sm flex items-center gap-1 ${c.status === "Missed" ? "text-red-400" : "text-[#8696a0]"}`}>
                {c.status === "Missed" && <PhoneMissed size={12} />} {c.status}
              </div>
            </div>
            <span className="text-xs text-[#8696a0]">{c.time}</span>
          </div>
        ))}
      </div>

      <div className="flex-1 bg-[#0b141a] flex flex-col items-center justify-center text-center px-8">
        <Video size={64} className="text-[#3b4a54] mb-4" />
        <h2 className="text-2xl text-[#e9edef] mb-2">Voice and video calling</h2>
        <p className="text-[#8696a0] max-w-sm text-sm mb-6">Share your screen, react with emoji and more, with up to 32 people.</p>
        <div className="flex gap-6">
          <div className="flex flex-col items-center gap-1 text-sm text-[#aebac1]">
            <div className="w-11 h-11 rounded-full bg-[#202c33] flex items-center justify-center"><Video size={18} /></div>
            Start call
          </div>
          <div className="flex flex-col items-center gap-1 text-sm text-[#aebac1]">
            <div className="w-11 h-11 rounded-full bg-[#202c33] flex items-center justify-center"><Link2 size={18} /></div>
            New call link
          </div>
          <div className="flex flex-col items-center gap-1 text-sm text-[#aebac1]">
            <div className="w-11 h-11 rounded-full bg-[#202c33] flex items-center justify-center"><Grid3x3 size={18} /></div>
            Call a number
          </div>
        </div>
      </div>
    </div>
  );
}