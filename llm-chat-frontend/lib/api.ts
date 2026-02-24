import { User, Thread, Message } from "./types";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json", ...options?.headers },
    ...options,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message ?? `Request failed: ${res.status}`);
  }

  return res.json();
}

export const api = {
  // Auth
  signup: (email: string, password: string) =>
    request<{ user: User }>("/auth/signup", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  signin: (email: string, password: string) =>
    request<{ user: User }>("/auth/signin", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  logout: () =>
    request<{ ok: boolean }>("/auth/logout", { method: "POST" }),

  me: () => request<{ user: User }>("/auth/me"),

  // Threads
  getThreads: () => request<Thread[]>("/threads"),

  createThread: (title?: string) =>
    request<Thread>("/threads", {
      method: "POST",
      body: JSON.stringify({ title: title ?? "New Chat" }),
    }),

  deleteThread: (id: string) =>
    request<Thread>(`/threads/${id}`, { method: "DELETE" }),

  // Messages
  getMessages: (threadId: string) =>
    request<Message[]>(`/threads/${threadId}/messages`),

  sendMessage: (threadId: string, content: string) =>
    request<{ userMessage: Message; assistantMessage: Message }>(
      `/threads/${threadId}/messages`,
      { method: "POST", body: JSON.stringify({ content }) },
    ),
};
