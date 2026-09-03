export function reverseStr(s) {
  return s.split("").reverse().join("");
}

export function chance(p) {
  return Math.random() < p;
}

export function randomBetween(min, max) {
  return min + Math.random() * (max - min);
}

export function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Hell auto-correct dictionary
const HELL_MAP = {
  yes: "no",
  yeah: "nah",
  ok: "nope",
  okay: "absolutely not",
  love: "loathe",
  like: "dislike",
  good: "terrible",
  great: "awful",
  nice: "horrible",
  meeting: "meating",
  project: "porject",
  please: "whatever",
  thanks: "whatever",
  thank: "whatever",
  hi: "bye",
  hello: "goodbye",
  hey: "leave me alone",
  free: "busy",
  sure: "never",
  fine: "not fine",
  happy: "miserable",
  coming: "not coming",
  soon: "never",
  later: "never",
};

export function hellCorrect(text) {
  if (!text) return text;
  return text
    .split(/\b/)
    .map((word) => {
      const lower = word.toLowerCase();
      if (HELL_MAP[lower] && chance(0.55)) {
        const replacement = HELL_MAP[lower];
        if (word[0] === word[0].toUpperCase()) {
          return replacement.charAt(0).toUpperCase() + replacement.slice(1);
        }
        return replacement;
      }
      return word;
    })
    .join("");
}

export function garble(text) {
  if (text.length < 4) return text;
  const chars = text.split("");
  const i = Math.floor(Math.random() * (chars.length - 1));
  chars.splice(i, 0, pick(["!", "?", "#", "*", "~", "…"]));
  return chars.join("");
}