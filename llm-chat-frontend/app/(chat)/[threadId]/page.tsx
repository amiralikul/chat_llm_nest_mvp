"use client";

import { useEffect, useState, use } from "react";
import { api } from "@/lib/api";
import { Message } from "@/lib/types";
import { MessageList } from "@/components/message-list";
import { ChatInput } from "@/components/chat-input";

export default function ThreadPage({
  params,
}: {
  params: Promise<{ threadId: string }>;
}) {
  const { threadId } = use(params);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    setLoading(true);
    api
      .getMessages(threadId)
      .then(setMessages)
      .finally(() => setLoading(false));
  }, [threadId]);

  const handleSend = async (content: string) => {
    setSending(true);
    try {
      const { userMessage, assistantMessage } = await api.sendMessage(
        threadId,
        content,
      );
      setMessages((prev) => [...prev, userMessage, assistantMessage]);
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center text-muted-foreground">
        Loading messages...
      </div>
    );
  }

  return (
    <>
      <MessageList messages={messages} />
      <ChatInput onSend={handleSend} disabled={sending} />
    </>
  );
}
