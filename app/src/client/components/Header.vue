<!-- components/Header.vue -->
<template>
  <v-app-bar app color="primary" dark>
    <v-toolbar-title>Welcome, {{ user.name }}</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-btn @click="$emit('change-password')" text>
      Change Password
    </v-btn>
    <v-btn @click="$emit('logout')" text>
      Logout
    </v-btn>
  </v-app-bar>
</template>

<script>
export default {
  name: 'Header',
  props: ['user'],
  emits: ['logout', 'change-password']
}
</script>