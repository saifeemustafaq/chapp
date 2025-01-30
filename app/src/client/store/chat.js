import { defineStore } from 'pinia';
import { socket } from '../services/socket';

export const useChatStore = defineStore('chat', {
  state: () => ({
    messages: [],
    activeChat: null,
    chats: [],
    loading: false,
    error: null
  }),

  getters: {
    sortedMessages: (state) => {
      return [...state.messages].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    },
    activeMessages: (state) => {
      return state.messages.filter(msg => msg.chatId === state.activeChat?.id);
    }
  },

  actions: {
    setActiveChat(chat) {
      this.activeChat = chat;
    },

    addMessage(message) {
      this.messages.push(message);
    },

    async sendMessage(content) {
      if (!this.activeChat) return;
      
      try {
        socket.emit('message', {
          content,
          chatId: this.activeChat.id,
          timestamp: new Date().toISOString()
        });
      } catch (err) {
        this.error = 'Failed to send message';
        throw err;
      }
    },

    async loadMessages(chatId) {
      this.loading = true;
      try {
        const response = await fetch(`/api/chats/${chatId}/messages`);
        const messages = await response.json();
        this.messages = messages;
      } catch (err) {
        this.error = 'Failed to load messages';
        throw err;
      } finally {
        this.loading = false;
      }
    },

    // Socket event handlers
    onNewMessage(message) {
      this.addMessage(message);
    },

    // Initialize socket listeners
    initializeSocketListeners() {
      socket.on('message', this.onNewMessage);
    }
  }
}); 