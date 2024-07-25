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
import socket from './socket'

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
    }

    const handleLogout = () => {
      user.value = null
      socket.disconnect()
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