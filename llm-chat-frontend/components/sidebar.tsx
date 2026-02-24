"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Plus, Trash2, LogOut } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Thread } from "@/lib/types";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";

interface SidebarProps {
  threads: Thread[];
  onLogout: () => void;
  onThreadCreated: () => void;
  onThreadDeleted: () => void;
}

export function Sidebar({
  threads,
  onLogout,
  onThreadCreated,
  onThreadDeleted,
}: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleNewChat = async () => {
    try {
      const thread = await api.createThread();
      onThreadCreated();
      router.push(`/${thread.id}`);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to create thread",
      );
    }
  };

  const handleDelete = async (e: React.MouseEvent, threadId: string) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await api.deleteThread(threadId);
      onThreadDeleted();
      if (pathname === `/${threadId}`) {
        router.push("/");
      }
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to delete thread",
      );
    }
  };

  return (
    <div className="flex h-full w-64 flex-col border-r bg-muted/30">
      <div className="p-3">
        <Button
          variant="outline"
          className="w-full justify-start gap-2"
          onClick={handleNewChat}
        >
          <Plus className="h-4 w-4" />
          New Chat
        </Button>
      </div>

      <ScrollArea className="flex-1 px-3">
        <div className="space-y-1">
          {threads.map((thread) => {
            const isActive = pathname === `/${thread.id}`;
            return (
              <Link
                key={thread.id}
                href={`/${thread.id}`}
                className={cn(
                  "group flex items-center justify-between rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent",
                  isActive && "bg-accent",
                )}
              >
                <span className="truncate">{thread.title}</span>
                <button
                  onClick={(e) => handleDelete(e, thread.id)}
                  className="hidden shrink-0 text-muted-foreground hover:text-destructive group-hover:inline-flex"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </Link>
            );
          })}
        </div>
      </ScrollArea>

      <div className="border-t p-3">
        <Button
          variant="ghost"
          className="w-full justify-start gap-2 text-muted-foreground"
          onClick={onLogout}
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  );
}
