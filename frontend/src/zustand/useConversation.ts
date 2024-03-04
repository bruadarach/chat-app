import { create } from "zustand";
import { ConversationProps, MessageProps } from "../utils/types";

interface ConversationState {
  selectedConversation: ConversationProps | null;
  setSelectedConversation: (conversation: ConversationProps | null) => void;
  messages: MessageProps[];
  setMessages: (messages: MessageProps[]) => void;
}

const useConversation = create<ConversationState>((set) => ({
  selectedConversation: null,
  setSelectedConversation: (selectedConversation) =>
    set({ selectedConversation }),
  messages: [],
  setMessages: (messages) => set({ messages }),
}));

export default useConversation;
