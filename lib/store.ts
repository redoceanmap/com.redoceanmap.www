import { create } from "zustand";
import type { Area } from "./mockApi";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000";

export type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  recommendations?: Area[];
};

type ChatState = {
  messages: Message[];
  recommendations: Area[];
  isLoading: boolean;
  sendMessage: (prompt: string) => Promise<void>;
  reset: () => void;
};

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  recommendations: [],
  isLoading: false,
  sendMessage: async (prompt) => {
    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: prompt,
    };
    set((s) => ({ messages: [...s.messages, userMsg], isLoading: true }));

    try {
      const res = await fetch(`${API_BASE}/chat/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      if (!res.ok) throw new Error("AI 응답 오류");

      const data: { text: string; recommendations: Area[] } = await res.json();

      const aiMsg: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: data.text,
        recommendations: data.recommendations,
      };
      set((s) => ({
        messages: [...s.messages, aiMsg],
        recommendations: data.recommendations,
        isLoading: false,
      }));
    } catch {
      const errMsg: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: "죄송해요, 일시적인 오류가 발생했어요. 잠시 후 다시 시도해주세요.",
      };
      set((s) => ({ messages: [...s.messages, errMsg], isLoading: false }));
    }
  },
  reset: () => set({ messages: [], recommendations: [], isLoading: false }),
}));
