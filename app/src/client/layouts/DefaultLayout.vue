<template>
  <div class="layout">
    <header class="header">
      <nav class="nav">
        <router-link to="/" class="nav-brand">Chapp</router-link>
        <div class="nav-links">
          <template v-if="isAuthenticated">
            <router-link to="/chat" class="nav-link">Chat</router-link>
            <button @click="logout" class="nav-link">Logout</button>
          </template>
          <template v-else>
            <router-link to="/login" class="nav-link">Login</router-link>
            <router-link to="/register" class="nav-link">Register</router-link>
          </template>
        </div>
      </nav>
    </header>

    <main class="main">
      <router-view></router-view>
    </main>

    <footer class="footer">
      <p>&copy; 2024 Chapp. All rights reserved.</p>
    </footer>
  </div>
</template>

<script setup>
import { useAuthStore } from '../store/auth';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';

const router = useRouter();
const authStore = useAuthStore();
const { isAuthenticated } = storeToRefs(authStore);

const logout = () => {
  authStore.logout();
  router.push('/login');
};
</script>

<style scoped>
.layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  background-color: #2c3e50;
  padding: 1rem;
  color: white;
}

.nav {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-brand {
  font-size: 1.5rem;
  font-weight: bold;
  color: white;
  text-decoration: none;
}

.nav-links {
  display: flex;
  gap: 1rem;
}

.nav-link {
  color: white;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.nav-link:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

button.nav-link {
  background: none;
  border: none;
  cursor: pointer;
  font: inherit;
}

.main {
  flex: 1;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.footer {
  background-color: #2c3e50;
  color: white;
  padding: 1rem;
  text-align: center;
}

@media (max-width: 768px) {
  .nav {
    flex-direction: column;
    gap: 1rem;
  }

  .nav-links {
    width: 100%;
    justify-content: center;
  }

  .main {
    padding: 1rem;
  }
}
</style> 