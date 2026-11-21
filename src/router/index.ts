import { createWebHistory, createRouter } from 'vue-router';

import HomeView from '../views/home.vue';
import AdminView from '../views/admin.vue';
import LoginView from '../views/login.vue';
import LegalView from '../views/legal.vue';

const routes = [
	{ path: '/', component: HomeView },
	{ path: '/admin', component: AdminView },
	{ path: '/login', component: LoginView },
	{ path: '/aviso-de-privacidad', component: LegalView, meta: { legalDocument: 'privacy', title: 'Aviso de privacidad | CETIN' } },
	{ path: '/terminos-y-condiciones', component: LegalView, meta: { legalDocument: 'terms', title: 'Términos y condiciones | CETIN' } },
	{ path: '/politica-de-cookies', component: LegalView, meta: { legalDocument: 'cookies', title: 'Cookies y tecnologías | CETIN' } },
];

const router = createRouter({
	history: createWebHistory(),
	routes,
});

router.beforeEach((_to, _from, next) => {
	document.title = typeof _to.meta.title === 'string'
		? _to.meta.title
		: 'CETIN México | Centro de Tamizaje Infantil - 5 Tamices para Recién Nacidos';
  const token = localStorage.getItem('cetin_jwt_token');
  const role = localStorage.getItem('cetin_user_role');
  if (_to.path === '/admin' && (!token || role !== 'superadmin')) {
    next('/login');
  } else {
    next();
  }
});

export default router;
