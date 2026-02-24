"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { User, Thread } from "@/lib/types";
import { Sidebar } from "@/components/sidebar";

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [threads, setThreads] = useState<Thread[]>([]);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    api
      .me()
      .then((data) => {
        setUser(data.user);
        setAuthChecked(true);
      })
      .catch(() => {
        router.push("/login");
      });
  }, [router]);

  useEffect(() => {
    if (!user) return;
    api.getThreads().then(setThreads);
  }, [user]);

  const refreshThreads = () => {
    api.getThreads().then(setThreads);
  };

  const handleLogout = async () => {
    await api.logout();
    router.push("/login");
  };

  if (!authChecked) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      <Sidebar
        threads={threads}
        onLogout={handleLogout}
        onThreadCreated={refreshThreads}
        onThreadDeleted={refreshThreads}
      />
      <main className="flex flex-1 flex-col">{children}</main>
    </div>
  );
}
