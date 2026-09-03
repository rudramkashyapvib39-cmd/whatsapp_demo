import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// A menu that opens normally, but every item free-falls from above the trigger
// and thuds into its slot with a bit of bounce-back overshoot, staggered.
export default function ChaosMenu({ trigger, items, align = "right" }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function onDoc(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <div onClick={() => setOpen((o) => !o)}>{trigger}</div>
      <AnimatePresence>
        {open && (
          <div
            className={`absolute z-40 mt-1 w-56 overflow-hidden rounded-lg bg-wa-panel3 shadow-2xl ring-1 ring-black/40 ${
              align === "right" ? "right-0" : "left-0"
            }`}
          >
            {items.map((it, i) => (
              <motion.button
                key={it.label}
                initial={{ y: -220 - i * 20, opacity: 0, rotate: -8 }}
                animate={{ y: 0, opacity: 1, rotate: 0 }}
                exit={{ y: 260, opacity: 0, rotate: 10, transition: { duration: 0.25 } }}
                transition={{
                  type: "spring",
                  stiffness: 260,
                  damping: 12,
                  mass: 1,
                  delay: i * 0.09,
                }}
                onClick={() => {
                  it.onClick?.();
                  setOpen(false);
                }}
                className="block w-full px-4 py-2.5 text-left text-sm text-wa-text hover:bg-white/5"
              >
                {it.label}
              </motion.button>
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
