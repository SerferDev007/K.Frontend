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
  userName,
}: {
  navItems: NavItem[];
  className?: string;
  holdMs?: number;
  isLogin: boolean;
  loginPath: string;
  onLogout?: () => void;
  userName?: string;
}) => {
  const { scrollY } = useScroll();
  const [visible, setVisible] = useState(true);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // dropdown state
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  // close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
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
          "flex top-5 inset-x-0 mx-auto max-w-fit z-[5000] px-6 items-center !bg-yellow-100  rounded-full shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] space-x-4",
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
                "p-2 rounded-sm text-neutral-600 hover:text-neutral-500 dark:text-neutral-50 dark:hover:text-neutral-300 flex items-center space-x-1 no-underline",
                isActive && "font-bold bg-yellow-400 text-black rounded-md"
              )
            }
            style={{ textDecoration: "none" }}
          >
            {item.icon && <span>{item.icon}</span>}
            <span className="text-sm">{item.name}</span>
          </NavLink>
        ))}

        {/* Login / User Dropdown */}
        <div className="relative">
          {!isLogin ? (
            <NavLink
              to={loginPath}
              className={({ isActive }) =>
                cn(
                  "p-2 rounded-sm text-neutral-600 hover:text-neutral-500 dark:text-neutral-50 dark:hover:text-neutral-300 flex items-center space-x-1 no-underline",
                  isActive && "font-bold bg-yellow-400 text-black rounded-md"
                )
              }
              style={{ textDecoration: "none" }}
            >
              <span className="text-sm">Login</span>
            </NavLink>
          ) : (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className=" !text-blue-600 font-bold flex items-center space-x-1"
              >
                <span className="!text-lg">{userName ?? "User"} ▾</span>
              </button>

              {isOpen && (
                <div className="absolute mt-2 w-44 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-md shadow-lg z-50">
                  <NavLink
                    to="/profile"
                    className={({ isActive }) =>
                      cn(
                        "px-4 py-2 rounded-sm text-neutral-600 hover:text-neutral-500 dark:text-neutral-50 dark:hover:text-neutral-300 flex items-center space-x-1 no-underline",
                        isActive &&
                          "font-bold bg-yellow-400 text-black rounded-md"
                      )
                    }
                    style={{ textDecoration: "none" }}
                    onClick={() => setIsOpen(false)}
                  >
                    Profile
                  </NavLink>
                  <button
                    onClick={() => {
                      onLogout?.();
                      setIsOpen(false);
                    }}
                    className="w-full text-left block px-4 py-2 text-sm text-red-600 font-bold"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
