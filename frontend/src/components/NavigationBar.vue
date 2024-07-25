<template>
    <v-app-bar app color="primary" dark>
      <v-btn text @click="handleLogout"> Logout </v-btn>
  
      <v-spacer></v-spacer>
  
      <v-toolbar-title class="text-center">Chapp</v-toolbar-title>
  
      <v-spacer></v-spacer>
  
      <v-menu v-model="menuOpen" offset-y>
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon v-bind="attrs" v-on="on">
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item @click="showChangePassword = true">
            <v-list-item-title>Change Password</v-list-item-title>
          </v-list-item>
          <v-divider></v-divider>
          <v-list-item @click="showColorPicker = true">
            <v-list-item-title>Change Color</v-list-item-title>
          </v-list-item>
          <v-divider></v-divider>
          <v-list-item @click="confirmDeleteChat">
            <v-list-item-title>Delete Chat</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
  
      <ChangePassword
        v-if="showChangePassword"
        :username="username"
        @close="showChangePassword = false"
      />
  
      <v-dialog v-model="showColorPicker" max-width="300px">
        <v-card>
          <v-card-title>Change Color</v-card-title>
          <v-card-text>
            <v-color-picker v-model="newColor" hide-inputs></v-color-picker>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" text @click="changeColor">Apply</v-btn>
            <v-btn color="grey darken-1" text @click="showColorPicker = false"
              >Cancel</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-app-bar>
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
      const newColor = ref("");
  
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
        handleLogout,
        confirmDeleteChat,
        changeColor,
      };
    },
  };
  </script>