import { createApp } from 'vue';
import './style.css';
import App from './layout/main.vue';
import router from './router';

// Directivas de animación scroll
import { vScrollReveal, vFadeUp, vFadeIn, vSlideLeft, vSlideRight, vScaleUp } from './directives/scrollReveal';
import { vGsapReveal } from './directives/gsapMotion';
// Directiva lazy loading
import { vLazyImg } from './composables/useLazyImage';
import { useContent } from './composables/useContent';

const app = createApp(App);

// Registrar directivas globalmente
app.directive('scroll-reveal', vScrollReveal);
app.directive('fade-up', vFadeUp);
app.directive('fade-in', vFadeIn);
app.directive('slide-left', vSlideLeft);
app.directive('slide-right', vSlideRight);
app.directive('scale-up', vScaleUp);
app.directive('gsap-reveal', vGsapReveal);
app.directive('lazy-img', vLazyImg);

app.use(router).mount('#app');

// Aurora is the source of truth; bundled defaults remain as an offline fallback.
void useContent().loadFromBackend();

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
