<template>
    <v-card-text class="flex-grow-1 overflow-y-auto" ref="chatContainer">
      <MessageItem 
        v-for="(message, index) in messages" 
        :key="index" 
        :message="message"
        :isCurrentUser="message.user === currentUser.name"
      />
    </v-card-text>
  </template>
  
  <script>
  import { ref, watch } from 'vue'
  import MessageItem from './MessageItem.vue'
  
  export default {
    name: 'MessageList',
    components: {
      MessageItem
    },
    props: ['messages', 'currentUser'],
    setup(props) {
      const chatContainer = ref(null)
  
      const scrollToBottom = () => {
        if (chatContainer.value) {
          chatContainer.value.scrollTop = chatContainer.value.scrollHeight
        }
      }
  
      watch(() => props.messages, scrollToBottom, { deep: true })
  
      return {
        chatContainer
      }
    }
  }
  </script>