import { createRouter, createWebHistory } from 'vue-router';

// Lazy-loaded route components
const Home = () => import('../views/Home.vue');
const Chat = () => import('../views/Chat.vue');
const Login = () => import('../views/Login.vue');
const Register = () => import('../views/Register.vue');

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
    meta: { requiresAuth: false }
  },
  {
    path: '/chat',
    name: 'chat',
    component: Chat,
    meta: { requiresAuth: true }
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta: { requiresAuth: false }
  },
  {
    path: '/register',
    name: 'register',
    component: Register,
    meta: { requiresAuth: false }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// Navigation guard for auth protected routes
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('token'); // We'll implement proper auth state management later
  
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login');
  } else {
    next();
  }
});

export default router; 