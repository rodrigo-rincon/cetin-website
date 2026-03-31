import type { Directive } from 'vue';

interface ScrollRevealOptions {
  threshold?: number;
  rootMargin?: string;
  delay?: number;
}

export const vScrollReveal: Directive<HTMLElement, ScrollRevealOptions> = {
  mounted(el, binding) {
    const options = binding.value || {};
    const threshold = options.threshold || 0.1;
    const rootMargin = options.rootMargin || '0px';
    const delay = options.delay || 0;

    // Añadir clases iniciales para ocultar el elemento
    el.classList.add('scroll-reveal');
    el.style.transitionDelay = `${delay}ms`;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            el.classList.add('scroll-reveal-visible');
            observer.unobserve(el);
          }
        });
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(el);
  },
};

// Variantes de animación
export const vFadeUp: Directive<HTMLElement, ScrollRevealOptions> = {
  mounted(el, binding) {
    const delay = binding.value?.delay || 0;
    el.classList.add('fade-up');
    el.style.transitionDelay = `${delay}ms`;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            el.classList.add('fade-up-visible');
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    observer.observe(el);
  },
};

export const vFadeIn: Directive<HTMLElement, ScrollRevealOptions> = {
  mounted(el, binding) {
    const delay = binding.value?.delay || 0;
    el.classList.add('fade-in');
    el.style.transitionDelay = `${delay}ms`;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            el.classList.add('fade-in-visible');
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
  },
};

export const vSlideLeft: Directive<HTMLElement, ScrollRevealOptions> = {
  mounted(el, binding) {
    const delay = binding.value?.delay || 0;
    el.classList.add('slide-left');
    el.style.transitionDelay = `${delay}ms`;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            el.classList.add('slide-left-visible');
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    observer.observe(el);
  },
};

export const vSlideRight: Directive<HTMLElement, ScrollRevealOptions> = {
  mounted(el, binding) {
    const delay = binding.value?.delay || 0;
    el.classList.add('slide-right');
    el.style.transitionDelay = `${delay}ms`;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            el.classList.add('slide-right-visible');
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    observer.observe(el);
  },
};

export const vScaleUp: Directive<HTMLElement, ScrollRevealOptions> = {
  mounted(el, binding) {
    const delay = binding.value?.delay || 0;
    el.classList.add('scale-up');
    el.style.transitionDelay = `${delay}ms`;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            el.classList.add('scale-up-visible');
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
  },
};
