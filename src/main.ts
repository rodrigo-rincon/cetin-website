import { createApp } from 'vue';
import './style.css';
import App from './layout/main.vue';
import router from './router';

// Directivas de animación scroll
import { vScrollReveal, vFadeUp, vFadeIn, vSlideLeft, vSlideRight, vScaleUp } from './directives/scrollReveal';
// Directiva lazy loading
import { vLazyImg } from './composables/useLazyImage';

const app = createApp(App);

// Registrar directivas globalmente
app.directive('scroll-reveal', vScrollReveal);
app.directive('fade-up', vFadeUp);
app.directive('fade-in', vFadeIn);
app.directive('slide-left', vSlideLeft);
app.directive('slide-right', vSlideRight);
app.directive('scale-up', vScaleUp);
app.directive('lazy-img', vLazyImg);

app.use(router).mount('#app');

// Registrar Service Worker para PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('SW registrado:', registration.scope);
      })
      .catch(error => {
        console.log('SW error:', error);
      });
  });
}
