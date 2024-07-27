<template>
  <nav class="navigation-bar">
    <button @click="handleLogout">Logout</button>
    <h1 class="title">Chapp</h1>
    <div class="menu-container">
      <button @click="toggleMenu" class="menu-button">
        <span class="dot"></span>
        <span class="dot"></span>
        <span class="dot"></span>
      </button>
      <div v-if="menuOpen" class="menu-dropdown">
        <button @click="showChangePassword = true">Change Password</button>
        <button @click="showColorPicker = true">Change Color</button>
        <button @click="confirmDeleteChat">Delete Chat</button>
      </div>
    </div>

    <ChangePassword
      v-if="showChangePassword"
      :username="username"
      @close="showChangePassword = false"
    />

    <div v-if="showColorPicker" class="color-picker-modal">
      <div class="color-picker-content">
        <h2>Change Color</h2>
        <input type="color" v-model="newColor" />
        <div class="color-picker-actions">
          <button @click="changeColor">Apply</button>
          <button @click="showColorPicker = false">Cancel</button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import { ref } from "vue";
import ChangePassword from "./ChangePassword.vue";
import socket from "../socket";

export default {
  name: "NavigationBar",
  components: {
    ChangePassword,
  },
  props: {
    username: {
      type: String,
      required: true,
    },
  },
  emits: ["logout", "delete-chat", "color-changed"],
  setup(props, { emit }) {
    const menuOpen = ref(false);
    const showChangePassword = ref(false);
    const showColorPicker = ref(false);
    const newColor = ref("#000000");

    const toggleMenu = () => {
      menuOpen.value = !menuOpen.value;
    };

    const handleLogout = () => {
      emit("logout");
    };

    const confirmDeleteChat = () => {
      if (confirm("Are you sure you want to delete the chat?")) {
        emit("delete-chat");
      }
    };

    const changeColor = () => {
      emit("color-changed", newColor.value);
      socket.emit("changeColor", newColor.value);
      showColorPicker.value = false;
    };

    return {
      menuOpen,
      showChangePassword,
      showColorPicker,
      newColor,
      toggleMenu,
      handleLogout,
      confirmDeleteChat,
      changeColor,
    };
  },
};
</script>

<style scoped>
.navigation-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background-color: #2196F3;
  color: white;
}

.title {
  margin: 0;
  font-size: 1.5em;
}

.menu-container {
  position: relative;
}

.menu-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 5px;
}

.dot {
  display: block;
  width: 4px;
  height: 4px;
  background-color: white;
  border-radius: 50%;
  margin: 3px 0;
}

.menu-dropdown {
  position: absolute;
  right: 0;
  top: 100%;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  z-index: 1001;
}

.menu-dropdown button {
  display: block;
  width: 100%;
  padding: 10px;
  text-align: left;
  background: none;
  border: none;
  cursor: pointer;
  color: black
}

.menu-dropdown button:hover {
  background-color: #f5f5f5;
}

.color-picker-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.color-picker-content {
  background-color: white;
  padding: 20px;
  border-radius: 4px;
}

.color-picker-actions {
  margin-top: 10px;
  display: flex;
  justify-content: flex-end;
}

.color-picker-actions button {
  margin-left: 10px;
}
</style>