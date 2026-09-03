import { MessagesSquare, Phone, CircleDot, Radio, Users2, Settings, Image } from "lucide-react";

const RAIL_ITEMS = [
  { id: "chats", icon: MessagesSquare, badge: 20 },
  { id: "calls", icon: Phone },
  { id: "status", icon: CircleDot },
  { id: "channels", icon: Radio },
  { id: "communities", icon: Users2 },
];

export default function IconRail({ active, onSelect }) {
  return (
    <div className="w-14 bg-[#111b21] flex flex-col items-center justify-between py-3 h-full border-r border-[#222d34]">
      <div className="flex flex-col items-center gap-1">
        {RAIL_ITEMS.map(({ id, icon: Icon, badge }) => (
          <button
            key={id}
            onClick={() => onSelect(id)}
            className={`relative w-10 h-10 flex items-center justify-center rounded-lg transition-colors ${
              active === id ? "bg-[#2a3942] text-[#00a884]" : "text-[#aebac1] hover:bg-[#202c33]"
            }`}
          >
            <Icon size={22} strokeWidth={1.8} />
            {badge && (
              <span className="absolute -top-1 -right-1 bg-[#00a884] text-white text-[10px] leading-none px-1.5 py-0.5 rounded-full">
                {badge}
              </span>
            )}
          </button>
        ))}
        <button
          onClick={() => onSelect("settings")}
          className={`w-10 h-10 flex items-center justify-center rounded-lg mt-2 ${
            active === "settings" ? "bg-[#2a3942] text-[#a084ff]" : "text-[#aebac1] hover:bg-[#202c33]"
          }`}
        >
          <Settings size={22} strokeWidth={1.8} />
        </button>
      </div>

      <div className="flex flex-col items-center gap-3">
        <button className="w-9 h-9 flex items-center justify-center rounded-lg text-[#aebac1] hover:bg-[#202c33]">
          <Image size={20} strokeWidth={1.8} />
        </button>
        <img
          src="https://i.pravatar.cc/40"
          alt="me"
          className="w-8 h-8 rounded-full object-cover border border-[#374045] cursor-pointer"
          onClick={() => onSelect("settings")}
        />
      </div>
    </div>
  );
}