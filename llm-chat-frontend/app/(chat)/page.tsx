"use client";

import { MessageSquare } from "lucide-react";

export default function ChatIndexPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 text-muted-foreground">
      <MessageSquare className="h-12 w-12" />
      <p className="text-lg">Select or start a conversation</p>
    </div>
  );
}
