import { Radio, Plus, Search } from "lucide-react";

const FOLLOWED = [
  { name: "Royal Challengers Bengaluru", msg: "not going to relax when the player is HOFF. 🥰❤️", time: "Yesterday" },
  { name: "Grow With Garima M.", msg: 'The channel "Grow With Garima M." was created', time: "13/3/2026" },
];

const SUGGESTED = [
  { name: "WhatsApp", followers: "23.4Cr followers", verified: true },
  { name: "Actor Vijay", followers: "84K followers" },
  { name: "News - Dainik Bhaskar Hindi - India, Ra...", followers: "80.1L followers", verified: true },
  { name: "SAD SONG 🎵 SAD SONG 🎵 LOVE SONG 🎵...", followers: "9L followers" },
  { name: "Vijay Official Fan Page", followers: "8L followers" },
];

export default function ChannelsPanel() {
  return (
    <div className="flex h-full w-full">
      <div className="w-full max-w-xs bg-[#111b21] text-white flex flex-col border-r border-[#222d34]">
        <div className="flex items-center justify-between px-4 py-3">
          <h1 className="text-xl font-medium">Channels</h1>
          <Plus size={20} className="text-[#aebac1] cursor-pointer" />
        </div>
        <div className="mx-4 mb-2 flex items-center gap-2 bg-[#202c33] rounded-lg px-3 py-1.5">
          <Search size={16} className="text-[#aebac1]" />
          <input placeholder="Search" className="bg-transparent outline-none text-sm w-full placeholder:text-[#8696a0]" />
        </div>

        {FOLLOWED.map((c, i) => (
          <div key={i} className="flex items-center gap-3 px-4 py-2 hover:bg-[#202c33] cursor-pointer">
            <img src={`https://i.pravatar.cc/44?img=${i + 30}`} className="w-11 h-11 rounded-full" />
            <div className="min-w-0 flex-1">
              <div className="flex justify-between">
                <span className="truncate">{c.name}</span>
                <span className="text-xs text-[#8696a0]">{c.time}</span>
              </div>
              <div className="text-sm text-[#8696a0] truncate">{c.msg}</div>
            </div>
          </div>
        ))}

        <div className="text-[#8696a0] text-sm px-4 py-3">Find channels to follow</div>
        {SUGGESTED.map((c, i) => (
          <div key={i} className="flex items-center gap-3 px-4 py-2 hover:bg-[#202c33]">
            <img src={`https://i.pravatar.cc/44?img=${i + 40}`} className="w-11 h-11 rounded-full" />
            <div className="flex-1 min-w-0">
              <div className="truncate flex items-center gap-1">
                {c.name} {c.verified && <span className="text-[#00a884]">✓</span>}
              </div>
              <div className="text-sm text-[#8696a0]">{c.followers}</div>
            </div>
            <button className="bg-[#2a3942] text-[#00a884] text-sm px-3 py-1 rounded-full">Follow</button>
          </div>
        ))}
      </div>

      <div className="flex-1 bg-[#0b141a] flex flex-col items-center justify-center text-center px-8">
        <Radio size={64} className="text-[#3b4a54] mb-4" />
        <h2 className="text-2xl text-[#e9edef] mb-2">Discover channels</h2>
        <p className="text-[#8696a0] max-w-sm text-sm">
          Entertainment, sports, news, lifestyle, people and more. Follow the channels that interest you.
        </p>
      </div>
    </div>
  );
}