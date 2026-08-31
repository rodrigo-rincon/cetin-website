import { createWebHistory, createRouter } from 'vue-router';

import HomeView from '../views/home.vue';
import AdminView from '../views/admin.vue';
import LoginView from '../views/login.vue';

const routes = [
	{ path: '/', component: HomeView },
	{ path: '/admin', component: AdminView },
	{ path: '/login', component: LoginView },
];

const router = createRouter({
	history: createWebHistory(),
	routes,
});

router.beforeEach((_to, _from, next) => {
  const token = localStorage.getItem('cetin_jwt_token');
  const role = localStorage.getItem('cetin_user_role');
  if (_to.path === '/admin' && (!token || role !== 'superadmin')) {
    next('/login');
  } else {
    next();
  }
});

export default router;
