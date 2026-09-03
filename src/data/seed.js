
export const CONTACTS = [
  { id: 1, name: "Priya (Mom)", avatar: "🧕", last: "call me when free", time: "10:42", unread: 2 },
  { id: 2, name: "Rudra 🔥", avatar: "🧑‍💻", last: "pushed the fix, check it", time: "09:58", unread: 0 },
  { id: 3, name: "Hackathon Squad", avatar: "🚀", last: "Arjun: demo in 20 mins???", time: "Yesterday", unread: 5 },
  { id: 4, name: "Landlord", avatar: "🏠", last: "rent reminder", time: "Yesterday", unread: 0 },
  { id: 5, name: "Ananya", avatar: "🎧", last: "sent a voice message", time: "Mon", unread: 1 },
  { id: 6, name: "DISCOM Mentor", avatar: "⚡", last: "great progress on the theft model", time: "Mon", unread: 0 },
  { id: 7, name: "Campus Placement Cell", avatar: "🎓", last: "reminder: submit resume", time: "Sun", unread: 0 },
  { id: 8, name: "Vikram", avatar: "🏏", last: "match tonight?", time: "Sun", unread: 0 },
];
 
export const INITIAL_MESSAGES = {
  1: [
    { id: "m1", from: "them", text: "Beta khana khaya?", time: "10:40" },
    { id: "m2", from: "them", text: "call me when free", time: "10:42" },
  ],
  2: [
    { id: "m1", from: "them", text: "the queue was flaky at 3am lol", time: "09:40" },
    { id: "m2", from: "them", text: "pushed the fix, check it", time: "09:58" },
  ],
  3: [
    { id: "m1", from: "them", text: "Arjun: demo in 20 mins???", time: "Yesterday" },
    { id: "m2", from: "them", text: "Sara: still setting up the projector", time: "Yesterday" },
  ],
  4: [{ id: "m1", from: "them", text: "rent reminder — 5th of every month", time: "Yesterday" }],
  5: [{ id: "m1", from: "them", text: "🎤 voice message · 0:14", time: "Mon" }],
  6: [{ id: "m1", from: "them", text: "great progress on the theft model", time: "Mon" }],
  7: [{ id: "m1", from: "them", text: "reminder: submit resume by Friday", time: "Sun" }],
  8: [{ id: "m1", from: "them", text: "match tonight?", time: "Sun" }],
};
 
export const AUTO_REPLIES = [
  "ok noted 👍",
  "lol true",
  "wait actually let me check",
  "😂😂😂",
  "sending in a sec",
  "brb, meeting",
  "yeah that works for me",
];
 
// Your own profile — shown in Settings > Profile
export const MY_PROFILE = {
  name: "Rudra",
  avatar: "🐸",
  email: "rudram.kashyap.vi.b.39@gmail.com",
  about: "Building things that break on purpose.",
  phone: "+91 63839 07016",
};
 
// Recent calls — references CONTACTS by id so avatars/names stay in sync.
// type: "voice" | "video", status: "Missed" | "Outgoing" | "Incoming"
export const CALLS = [
  { id: 101, contactId: 8, type: "voice", status: "Outgoing", time: "Yesterday" },
  { id: 102, contactId: 3, type: "video", status: "Missed", time: "Yesterday" },
  { id: 103, contactId: 1, type: "voice", status: "Incoming", time: "Monday" },
  { id: 104, contactId: 6, type: "video", status: "Outgoing", time: "Sunday" },
  { id: 105, contactId: 5, type: "voice", status: "Missed", time: "Friday" },
];
 
// Statuses — image is a placeholder path; drop real files into src/assets/status/
// and point `image` at them (see naming convention discussed with Claude).
export const STATUSES = [
  { id: 1, contactId: 2, image: null, time: "Today at 10:37" },
  { id: 2, contactId: 5, image: null, time: "Today at 10:29" },
  { id: 3, contactId: 8, image: null, time: "Today at 09:51" },
  { id: 4, contactId: 1, image: null, time: "Today at 09:14" },
];
 
export const CHANNELS_FOLLOWED = [
  {
    id: 1,
    name: "Royal Challengers Bengaluru",
    avatar: "🏏",
    verified: true,
    messages: [
      { id: "c1", text: "Squad announced for the next match! 🔥", time: "Yesterday" },
      { id: "c2", text: "not going to relax when the player is HOFF 🥰❤️", time: "Yesterday" },
    ],
  },
  {
    id: 2,
    name: "Grow With Garima M.",
    avatar: "🌱",
    verified: false,
    messages: [{ id: "c1", text: "The channel was created", time: "13/3/2026" }],
  },
];
 
export const CHANNELS_SUGGESTED = [
  { id: 3, name: "WhatsApp", avatar: "💬", followers: "23.4Cr followers", verified: true },
  { id: 4, name: "Actor Vijay", avatar: "🎬", followers: "84K followers" },
  { id: 5, name: "News - Dainik Bhaskar Hindi", avatar: "📰", followers: "80.1L followers", verified: true },
];
 
export const COMMUNITIES = [
  {
    id: 1,
    name: "MIC 26-27",
    avatar: "🌀",
    badge: "New",
    groups: [
      { name: "Announcements", last: "samyaksrijan: To get ID cards..." },
      { name: "General", last: "priya: anyone free at 5?" },
    ],
  },
  {
    id: 2,
    name: "S&F'30",
    avatar: "🧑‍🤝‍🧑",
    groups: [
      { name: "Announcements", last: "Orientation schedule pinned" },
      { name: "Doubts", last: "arjun: is the assignment out yet" },
    ],
  },
  {
    id: 3,
    name: "Hostel Block C",
    avatar: "🏢",
    groups: [
      { name: "Announcements", last: "Water supply back at 6pm" },
      { name: "Mess Feedback", last: "vikram: paneer today was good ngl" },
    ],
  },
  {
    id: 4,
    name: "DISCOM Hackathon Team",
    avatar: "⚡",
    groups: [
      { name: "Announcements", last: "Demo slot moved to 3pm" },
      { name: "Backend", last: "rudra: pushed the fix, check it" },
    ],
  },
];
 
