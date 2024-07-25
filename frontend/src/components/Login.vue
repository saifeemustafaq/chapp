<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" sm="8" md="6">
        <v-card class="elevation-12">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>Login</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-form @submit.prevent="handleSubmit">
              <v-text-field
                v-model="username"
                label="Username"
                required
              ></v-text-field>
              <v-text-field
                v-model="password"
                label="Password"
                type="password"
                required
              ></v-text-field>
              <v-btn type="submit" color="primary" block class="mt-4">
                Sign In
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { ref } from 'vue'
import axios from 'axios'
import socket from '../socket'

export default {
  name: 'Login',
  emits: ['login'],
  setup(props, { emit }) {
    const username = ref('')
    const password = ref('')

    const handleSubmit = async () => {
      console.log('Login attempt for:', username.value);
      try {
        const response = await axios.post('http://localhost:3000/login', {
          username: username.value,
          password: password.value
        })
        console.log('Login response:', response.data);
        
        if (response.data.success) {
          console.log('Login successful, connecting socket');
          socket.auth = { username: username.value, password: password.value }
          socket.connect()
          
          console.log('Emitting login event');
          emit('login', { name: username.value, color: response.data.color })
        }
      } catch (error) {
        console.error('Login error:', error.response ? error.response.data : error);
        alert('Invalid username or password');
      }
    }

    return {
      username,
      password,
      handleSubmit
    }
  }
}
</script>