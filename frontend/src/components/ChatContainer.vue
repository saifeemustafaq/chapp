<template>
  <v-container fluid class="pa-0">
    <v-card class="chat-container" height="calc(100vh - 64px)">
      <v-card-text class="chat-messages" ref="chatMessagesContainer">
        <MessageItem
          v-for="(message, index) in messages"
          :key="index"
          :message="message"
          :isCurrentUser="message.user === user.name"
        />
      </v-card-text>
      <v-card-actions class="chat-input">
        <v-textarea
          v-model="newMessage"
          label="Type a message"
          rows="1"
          auto-grow
          outlined
          dense
          hide-details
          @keydown.enter.prevent="sendMessage"
          @keydown.shift.enter.prevent="newMessage += '\n'"
        ></v-textarea>
        <v-btn color="primary" @click="sendMessage" :disabled="!newMessage.trim()">Send</v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import socket from '../socket'
import MessageItem from './MessageItem.vue'

export default {
  name: 'ChatContainer',
  components: {
    MessageItem
  },
  props: {
    user: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const messages = ref([])
    const newMessage = ref('')
    const chatMessagesContainer = ref(null)

    const scrollToBottom = () => {
      if (chatMessagesContainer.value) {
        chatMessagesContainer.value.scrollTop = chatMessagesContainer.value.scrollHeight
      }
    }

    const sendMessage = () => {
      if (newMessage.value.trim()) {
        console.log('Sending message:', newMessage.value);
        socket.emit('sendMessage', newMessage.value.trim())
        newMessage.value = ''
      }
    }

    const deleteChat = () => {
      console.log('Deleting chat');
      socket.emit('deleteChat')
    }

    onMounted(() => {
      console.log('Chat component mounted');
      socket.on('chatHistory', (history) => {
        console.log('Received chat history:', history);
        messages.value = history
        scrollToBottom()
      })

      socket.on('newMessage', (message) => {
        console.log('Received new message:', message);
        messages.value.push(message)
        scrollToBottom()
      })

      socket.on('chatDeleted', () => {
        console.log('Chat deleted');
        messages.value = []
      })

      socket.on('userColorChanged', ({ username, newColor }) => {
        console.log('User color changed:', username, newColor);
        messages.value = messages.value.map(msg => 
          msg.user === username ? { ...msg, color: newColor } : msg
        )
      })
    })

    onUnmounted(() => {
      console.log('Chat component unmounted');
      socket.off('chatHistory')
      socket.off('newMessage')
      socket.off('chatDeleted')
      socket.off('userColorChanged')
    })

    watch(messages, scrollToBottom)

    return {
      messages,
      newMessage,
      sendMessage,
      deleteChat,
      chatMessagesContainer
    }
  }
}
</script>

<style scoped>
.chat-container {
  display: flex;
  flex-direction: column;
}

.chat-messages {
  flex-grow: 1;
  overflow-y: auto;
  padding: 16px;
}

.chat-input {
  padding: 16px;
  display: flex;
  align-items: flex-end;
}

.chat-input .v-textarea {
  flex-grow: 1;
  margin-right: 16px;
}
</style>