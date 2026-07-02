"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Plus, MessageSquare, MapPin, Bookmark, Zap } from "lucide-react";
import Wordmark from "./Wordmark";
import EmailModal from "./EmailModal";
import { useUIStore } from "@/lib/uiStore";
import { clearStoredToken } from "@/lib/tokenStorage";

const navItems = [
  { icon: Plus, label: "새로 물어보기", href: "/" },
  { icon: MessageSquare, label: "지난 대화", href: "/" },
  { icon: MapPin, label: "지도", href: "/map" },
  { icon: Bookmark, label: "찜한 곳", href: "/" },
];

export default function TopNav() {
  const pathname = usePathname();
  const openAuth = useUIStore((s) => s.openAuth);
  const user = useUIStore((s) => s.user);
  const logoutStore = useUIStore((s) => s.logout);
  const logout = () => { clearStoredToken(); logoutStore(); };
  const [emailOpen, setEmailOpen] = useState(false);

  if (pathname?.startsWith("/admin")) return null;

  return (
    <header className="h-14 flex items-center px-6 gap-8">
      <Wordmark />

      <nav className="hidden sm:flex items-center gap-1">
        {navItems.map(({ icon: Icon, label, href }) => (
          <Link
            key={label}
            href={href}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-foreground/80 hover:bg-black/5 hover:text-foreground transition-colors"
          >
            <Icon size={15} strokeWidth={1.75} className="text-brand" />
            {label}
          </Link>
        ))}
        <button
          type="button"
          onClick={() => setEmailOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-foreground/80 hover:bg-black/5 hover:text-foreground transition-colors"
        >
          <Zap size={15} strokeWidth={1.75} className="text-brand" />
          자동화
        </button>
      </nav>

      <EmailModal open={emailOpen} onClose={() => setEmailOpen(false)} />

      <div className="ml-auto flex items-center gap-2">
        {user ? (
          <>
            <span className="text-sm text-foreground/80">{user.name}님</span>
            <button
              type="button"
              onClick={logout}
              className="text-sm font-medium text-foreground-muted hover:text-foreground px-3 py-1.5 rounded-full hover:bg-black/5 transition-colors"
            >
              로그아웃
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={() => openAuth("login")}
            className="text-sm font-medium bg-brand text-white px-4 py-1.5 rounded-full hover:bg-brand-deep transition-colors"
          >
            로그인
          </button>
        )}
      </div>
    </header>
  );
}
