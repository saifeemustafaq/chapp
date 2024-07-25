<template>
  <v-dialog v-model="dialog" max-width="500px">
    <v-card>
      <v-card-title>Change Password</v-card-title>
      <v-card-text>
        <v-form @submit.prevent="changePassword">
          <v-text-field
            v-model="currentPassword"
            label="Current Password"
            type="password"
            required
          ></v-text-field>
          <v-text-field
            v-model="newPassword"
            label="New Password"
            type="password"
            required
          ></v-text-field>
          <v-text-field
            v-model="confirmPassword"
            label="Confirm New Password"
            type="password"
            required
          ></v-text-field>
          <v-btn type="submit" color="primary" block class="mt-4">
            Change Password
          </v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { ref } from 'vue'
import axios from 'axios'

export default {
  name: 'ChangePassword',
  props: ['username'],
  emits: ['close'],
  setup(props, { emit }) {
    const dialog = ref(true)
    const currentPassword = ref('')
    const newPassword = ref('')
    const confirmPassword = ref('')

    const changePassword = async () => {
      console.log('Password change attempt for:', props.username);
      if (newPassword.value !== confirmPassword.value) {
        console.log('New passwords do not match');
        alert('New passwords do not match');
        return;
      }
      
      try {
        const response = await axios.post('http://localhost:3000/change-password', {
          username: props.username,
          currentPassword: currentPassword.value,
          newPassword: newPassword.value
        });
        console.log('Password change response:', response.data);
        
        if (response.data.success) {
          console.log('Password changed successfully');
          alert('Password changed successfully');
          emit('close');
        }
      } catch (error) {
        console.error('Password change error:', error.response ? error.response.data : error);
        alert('Failed to change password: ' + (error.response ? error.response.data.message : 'Unknown error'));
      }
    }

    return {
      dialog,
      currentPassword,
      newPassword,
      confirmPassword,
      changePassword
    }
  }
}
</script>