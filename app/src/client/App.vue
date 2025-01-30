<template>
  <v-app>
    <NavigationBar 
      v-if="user"
      :username="user.name"
      @logout="handleLogout"
      @delete-chat="handleDeleteChat"
      @color-changed="handleColorChange"
    />
    <v-main>
      <Login v-if="!user" @login="handleLogin" />
      <ChatContainer v-else :user="user" ref="chatContainer" />
    </v-main>
  </v-app>
</template>

<script>
import { ref } from 'vue'
import NavigationBar from './components/NavigationBar.vue'
import Login from './components/Login.vue'
import ChatContainer from './components/ChatContainer.vue'
import { getSocket, initializeSocket, disconnectSocket } from './services/socket'

export default {
  name: 'App',
  components: {
    NavigationBar,
    Login,
    ChatContainer
  },
  setup() {
    const user = ref(null)
    const chatContainer = ref(null)

    const handleLogin = (userData) => {
      user.value = userData
      try {
        const socket = initializeSocket(userData.name, userData.password)
        socket.on('connect_error', (error) => {
          console.error('Socket connection error:', error)
          // If there's an auth error, log the user out
          if (error.message.includes('Invalid username or password')) {
            handleLogout()
          }
        })
      } catch (error) {
        console.error('Failed to initialize socket:', error)
        handleLogout()
      }
    }

    const handleLogout = () => {
      user.value = null
      disconnectSocket()
    }

    const handleDeleteChat = () => {
      chatContainer.value.deleteChat()
    }

    const handleColorChange = (newColor) => {
      if (user.value) {
        user.value.color = newColor
      }
    }

    return {
      user,
      chatContainer,
      handleLogin,
      handleLogout,
      handleDeleteChat,
      handleColorChange
    }
  }
}
</script>