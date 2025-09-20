import { useState, useRef, useEffect, type ReactNode } from "react";
import { NavLink } from "react-router-dom";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "motion/react";
import { cn } from "@/lib/utils";

type NavItem = {
  name: string;
  link: string;
  icon?: ReactNode;
};

export const FloatingNav = ({
  navItems,
  className,
  holdMs = 1000,
  isLogin,
  loginPath,
  onLogout,
}: {
  navItems: NavItem[];
  className?: string;
  holdMs?: number;
  isLogin: boolean;
  loginPath: string;
  onLogout?: () => void;
  isDark: boolean;
  onThemeToggle?: () => void;
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
          "flex top-5 inset-x-0 mx-auto max-w-fit z-[5000] px-6 items-center bExpenses bExpenses-transparent dark:bExpenses-white/[0.2] rounded-full dark:bg-black bg-white shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] space-x-4",
          className
        )}
      >
        {/* Nav items */}
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.link}
            className={({ isActive }) =>
              cn(
                "p-2 rounded-sm text-neutral-600 hover:text-neutral-500 dark:text-neutral-50 dark:hover:text-neutral-300 flex items-center space-x-1",
                isActive && "font-bold" // bold active nav item
              )
            }
            style={({ isActive }) => ({
              textDecoration: isActive ? "underline" : "none",
            })}
          >
            {item.icon && <span>{item.icon}</span>}
            <span className="text-sm">{item.name}</span>
          </NavLink>
        ))}

        {/* Login / Logout (no bold effect) */}
        {isLogin ? (
          <NavLink
            to={loginPath}
            className={({ isActive }) =>
              cn(
                "p-2 rounded-sm text-neutral-600 hover:text-neutral-500 dark:text-neutral-50 dark:hover:text-neutral-300 flex items-center space-x-1",
                isActive && "font-bold " // bold active nav item
              )
            }
            style={({ isActive }) => ({
              textDecoration: isActive ? "underline" : "none",
            })}
          >
            <span className="text-sm">Login</span>
          </NavLink>
        ) : (
          <NavLink
            to=""
            onClick={onLogout}
            className="p-2 rounded-sm text-neutral-600 hover:text-neutral-500 dark:text-neutral-50 dark:hover:text-neutral-300 flex items-center space-x-1"
            style={{ textDecoration: "none" }}
          >
            <span className="text-sm">Logout</span>
          </NavLink>
        )}

        {/* Theme toggle */}
        {/* <button
          onClick={onThemeToggle}
          className="rounded-sm"
          aria-label="Toggle theme"
        >
          {isDark ? (
            <img src="./pics/day.svg" className="w-5 h-5" />
          ) : (
            <img src="./pics/night.svg" className="w-5 h-5" />
          )}
        </button> */}
      </motion.div>
    </AnimatePresence>
  );
};
