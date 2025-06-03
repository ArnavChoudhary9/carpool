'use client';

import { signOutAction } from "@/app/actions";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import Link from "next/link";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return isMobile;
}

export interface AuthButtonProps {
  user: { email: string } | null;
  profileData: { user_id: string; full_name: string } | null;
}

export default function AuthButton({ user, profileData }: AuthButtonProps) {
  const isMobile = useIsMobile();
  const [menuOpen, setMenuOpen] = useState(false);

  // Menu icon animation
  const MenuIcon = ({ open }: { open: boolean }) => (
    <button
      aria-label={open ? "Close menu" : "Open menu"}
      className="relative w-8 h-8 flex flex-col justify-center items-center z-50"
      onClick={() => setMenuOpen((v) => !v)}
    >
      <motion.span
        animate={{
          rotate: open ? 45 : 0,
          y: open ? 6 : 0,
        }}
        className="block w-6 h-0.5 bg-foreground mb-1 rounded origin-center"
      />
      <motion.span
        animate={{ opacity: open ? 0 : 1 }}
        className="block w-6 h-0.5 bg-foreground mb-1 rounded origin-center"
      />
      <motion.span
        animate={{
          rotate: open ? -45 : 0,
          y: open ? -6 : 0,
        }}
        className="block w-6 h-0.5 bg-foreground rounded origin-center"
      />
    </button>
  );

  // Overlay menu for mobile
  const MobileMenu = () => (
    <AnimatePresence>
      {menuOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 z-40 flex flex-col items-center justify-center"
          onClick={() => setMenuOpen(false)}
        >
          <motion.div
            initial={{ y: -40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -40, opacity: 0 }}
            className="bg-background rounded-lg shadow-lg p-6 flex flex-col gap-4 min-w-[70vw] max-w-xs items-center"
            onClick={e => e.stopPropagation()}
          >
            {user ? (
              <>
                <Button asChild size="sm" variant={"outline"}>
                  <Link href="/user/profile" onClick={() => setMenuOpen(false)}>
                    Profile
                  </Link>
                </Button>
                <form
                  action={signOutAction}
                  onSubmit={() => setMenuOpen(false)}
                >
                  <Button type="submit" variant={"destructive"}>
                    Sign out
                  </Button>
                </form>
              </>
            ) : (
              <>
                <Button asChild size="sm" variant={"outline"}>
                  <Link href="/sign-in" onClick={() => setMenuOpen(false)}>
                    Sign in
                  </Link>
                </Button>
                <Button asChild size="sm" variant={"default"}>
                  <Link href="/sign-up" onClick={() => setMenuOpen(false)}>
                    Sign up
                  </Link>
                </Button>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  if (!hasEnvVars) {
    return (
      <div className="flex gap-4 items-center">
        <div>
          <Badge
            variant={"default"}
            className="font-normal pointer-events-none"
          >
            Please update .env.local file with anon key and url
          </Badge>
        </div>
      </div>
    );
  }

  if (isMobile) {
    return (
      <>
        <MenuIcon open={menuOpen} />
        <MobileMenu />
      </>
    );
  }

  // Desktop: show normal buttons
  return user ? (
    <div className="flex items-center gap-4">
      <Button asChild size="sm" variant={"outline"}>
        <Link href="/user/profile">Hey, {profileData?.full_name ?? user.email}!</Link>
      </Button>
      <form action={signOutAction}>
        <Button type="submit" variant={"outline"}>
          Sign out
        </Button>
      </form>
    </div>
  ) : (
    <div className="flex gap-2">
      <Button asChild size="sm" variant={"outline"}>
        <Link href="/sign-in">Sign in</Link>
      </Button>
      <Button asChild size="sm" variant={"default"}>
        <Link href="/sign-up">Sign up</Link>
      </Button>
    </div>
  );
}
