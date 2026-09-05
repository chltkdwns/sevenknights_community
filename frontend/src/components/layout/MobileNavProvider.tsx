"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { usePathname } from "next/navigation";

type MobileNavContextValue = {
  open: boolean;
  openNav: () => void;
  closeNav: () => void;
  toggleNav: () => void;
};

const MobileNavContext = createContext<MobileNavContextValue | null>(null);

/** 모바일 좌측 Drawer 열림 상태. 인증·API와 무관하며 Header와 Sidebar만 공유한다. */
export function MobileNavProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const closeNav = useCallback(() => setOpen(false), []);
  const openNav = useCallback(() => setOpen(true), []);
  const toggleNav = useCallback(() => setOpen((value) => !value), []);

  // 라우트가 바뀌면 이전 페이지의 Drawer가 열린 채로 남지 않게 한다.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 768px)");
    const onViewportChange = () => {
      if (media.matches) {
        setOpen(false);
      }
    };
    media.addEventListener("change", onViewportChange);
    return () => media.removeEventListener("change", onViewportChange);
  }, []);

  useEffect(() => {
    if (!open) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const value = useMemo(
    () => ({ open, openNav, closeNav, toggleNav }),
    [open, openNav, closeNav, toggleNav]
  );

  return <MobileNavContext.Provider value={value}>{children}</MobileNavContext.Provider>;
}

export function useMobileNav() {
  const context = useContext(MobileNavContext);
  if (!context) {
    throw new Error("useMobileNav는 MobileNavProvider 안에서만 사용할 수 있습니다.");
  }
  return context;
}
