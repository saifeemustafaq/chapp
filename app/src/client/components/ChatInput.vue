<template>
    <v-card-actions>
      <v-textarea
        v-model="newMessage"
        label="Type a message"
        rows="1"
        auto-grow
        outlined
        dense
        hide-details
        @keydown.enter.prevent="handleEnter"
        @keydown.shift.enter.prevent="handleShiftEnter"
      ></v-textarea>
      <v-btn color="primary" @click="sendMessage" :disabled="!newMessage.trim()">Send</v-btn>
    </v-card-actions>
  </template>
  
  <script>
  import { ref } from 'vue'
  
  export default {
    name: 'ChatInput',
    emits: ['send-message'],
    setup(props, { emit }) {
      const newMessage = ref('')
  
      const sendMessage = () => {
        if (newMessage.value.trim()) {
          emit('send-message', newMessage.value.trim())
          newMessage.value = ''
        }
      }
  
      const handleEnter = (event) => {
        if (!event.shiftKey) {
          sendMessage()
        }
      }
  
      const handleShiftEnter = (event) => {
        newMessage.value += '\n'
      }
  
      return {
        newMessage,
        sendMessage,
        handleEnter,
        handleShiftEnter
      }
    }
  }
  </script>
  
  <style scoped>
  .v-textarea >>> textarea {
    resize: none;
  }
  </style>