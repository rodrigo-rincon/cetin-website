import { ref, onMounted, onUnmounted } from 'vue';

interface LazyImageOptions {
  threshold?: number;
  rootMargin?: string;
  placeholder?: string;
}

/**
 * Composable para lazy loading de imágenes
 * Usa IntersectionObserver para cargar imágenes cuando entran al viewport
 */
export function useLazyImage(options: LazyImageOptions = {}) {
  const {
    threshold = 0.1,
    rootMargin = '50px',
    placeholder = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"%3E%3Crect fill="%23f3f4f6" width="400" height="300"/%3E%3C/svg%3E'
  } = options;

  const imageRef = ref<HTMLImageElement | null>(null);
  const isLoaded = ref(false);
  const isInView = ref(false);
  const hasError = ref(false);
  
  let observer: IntersectionObserver | null = null;

  const loadImage = (img: HTMLImageElement, src: string) => {
    const tempImg = new Image();
    
    tempImg.onload = () => {
      img.src = src;
      isLoaded.value = true;
      img.classList.add('lazy-loaded');
    };
    
    tempImg.onerror = () => {
      hasError.value = true;
      img.classList.add('lazy-error');
    };
    
    tempImg.src = src;
  };

  onMounted(() => {
    if (!imageRef.value) return;
    
    const img = imageRef.value;
    const dataSrc = img.dataset.src;
    
    if (!dataSrc) return;
    
    // Establecer placeholder
    if (!img.src || img.src === window.location.href) {
      img.src = placeholder;
    }
    
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            isInView.value = true;
            loadImage(img, dataSrc);
            observer?.unobserve(img);
          }
        });
      },
      { threshold, rootMargin }
    );
    
    observer.observe(img);
  });

  onUnmounted(() => {
    observer?.disconnect();
  });

  return {
    imageRef,
    isLoaded,
    isInView,
    hasError
  };
}

/**
 * Directiva para lazy loading de imágenes
 * Uso: <img v-lazy-img data-src="/path/to/image.jpg" />
 */
export const vLazyImg = {
  mounted(el: HTMLImageElement, binding: { value?: LazyImageOptions }) {
    const options = binding.value || {};
    const threshold = options.threshold || 0.1;
    const rootMargin = options.rootMargin || '50px';
    const placeholder = options.placeholder || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"%3E%3Crect fill="%23f3f4f6" width="400" height="300"/%3E%3C/svg%3E';
    
    const dataSrc = el.dataset.src;
    if (!dataSrc) return;
    
    // Establecer placeholder y estilos iniciales
    el.src = placeholder;
    el.classList.add('lazy-image');
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const tempImg = new Image();
            
            tempImg.onload = () => {
              el.src = dataSrc;
              el.classList.remove('lazy-image');
              el.classList.add('lazy-loaded');
            };
            
            tempImg.onerror = () => {
              el.classList.add('lazy-error');
            };
            
            tempImg.src = dataSrc;
            observer.unobserve(el);
          }
        });
      },
      { threshold, rootMargin }
    );
    
    observer.observe(el);
  }
};
