import { useState, useRef, useEffect } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "motion/react";
import { cn } from "@/lib/utils";

export const FloatingTextBar = ({
  text,
  className,
  holdMs = 1000,
}: {
  text: string;
  className?: string;
  holdMs?: number;
}) => {
  const { scrollY } = useScroll();
  const [visible, setVisible] = useState(true);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const armHideTimer = (ms: number) => {
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => {
      setVisible(false);
      hideTimer.current = null;
    }, ms);
  };

  useEffect(() => {
    return () => {
      if (hideTimer.current) clearTimeout(hideTimer.current);
    };
  }, []);

  useMotionValueEvent(scrollY, "change", () => {
    const curr = scrollY.get();
    const prev = scrollY.getPrevious() ?? curr;
    const delta = curr - prev;
    const DIR_THRESH = 1;

    if (curr < 50) {
      if (hideTimer.current) {
        clearTimeout(hideTimer.current);
        hideTimer.current = null;
      }
      if (!visible) setVisible(true);
      return;
    }

    if (delta < -DIR_THRESH) {
      if (!visible) setVisible(true);
      armHideTimer(holdMs);
    }
  });

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 1, y: -100 }}
        animate={{ y: visible ? 0 : -100, opacity: visible ? 1 : 0 }}
        transition={{ duration: 0.2 }}
        className={cn(
          "flex top-20 inset-x-0 mx-auto max-w-fit z-[5000] px-6  items-center rounded shadow-md  !bg-yellow-100 text-neutral-700 dark:text-neutral-50",
          className
        )}
      >
        <p
          className="font-extrabold text-xl text-zinc-950 pt-4"
          style={{ fontFamily: "Yatra One, cursive" }}
        >
          {text}
        </p>
      </motion.div>
    </AnimatePresence>
  );
};
