<script setup lang="ts">
import { ref, nextTick, onMounted } from 'vue';

interface Message {
  id: number;
  text: string;
  isBot: boolean;
  options?: QuickOption[];
}

interface QuickOption {
  label: string;
  value: string;
}

// Respuestas predefinidas del chatbot
const botResponses: Record<string, { text: string; options?: QuickOption[] }> = {
  saludo: {
    text: '¡Hola! 👋 Soy el asistente virtual de CETIN. ¿En qué puedo ayudarte hoy?',
    options: [
      { label: '📋 Servicios', value: 'servicios' },
      { label: '📅 Agendar cita', value: 'cita' },
      { label: '📍 Ubicación', value: 'ubicacion' },
      { label: '💰 Precios', value: 'precios' },
    ],
  },
  servicios: {
    text: 'En CETIN ofrecemos diversos servicios de diagnóstico y tamizaje. ¿Qué te gustaría saber?',
    options: [
      { label: 'Tamiz neonatal', value: 'tamiz' },
      { label: 'Pruebas genéticas', value: 'geneticas' },
      { label: 'Otros servicios', value: 'otros' },
      { label: '← Menú principal', value: 'menu' },
    ],
  },
  tamiz: {
    text: 'El tamiz neonatal es una prueba que se realiza a los recién nacidos para detectar enfermedades metabólicas de forma temprana. Es rápido, seguro y puede salvar vidas. ¿Te gustaría agendar una cita?',
    options: [
      { label: '📅 Sí, agendar', value: 'cita' },
      { label: '← Volver', value: 'servicios' },
    ],
  },
  geneticas: {
    text: 'Realizamos pruebas genéticas avanzadas para detección de diversas condiciones. Contamos con tecnología de punta y personal especializado.',
    options: [
      { label: '📅 Agendar cita', value: 'cita' },
      { label: '📞 Contactar', value: 'contacto' },
      { label: '← Volver', value: 'servicios' },
    ],
  },
  otros: {
    text: 'También ofrecemos consultas especializadas, asesoría genética y programas de seguimiento. ¿Necesitas más información?',
    options: [
      { label: '📅 Agendar cita', value: 'cita' },
      { label: '📞 Contactar', value: 'contacto' },
      { label: '← Volver', value: 'servicios' },
    ],
  },
  cita: {
    text: '¡Perfecto! Para agendar tu cita puedes:\n\n📱 WhatsApp: 52 222 399 4072\n📞 Teléfono: (222) 399 4072\n\nO si prefieres, puedes contactarnos directamente por WhatsApp haciendo clic en el botón amarillo.',
    options: [
      { label: '📱 Ir a WhatsApp', value: 'whatsapp' },
      { label: '← Menú principal', value: 'menu' },
    ],
  },
  ubicacion: {
    text: '📍 Nos encontramos en Puebla, México. Contamos con instalaciones modernas y accesibles.\n\n¿Te gustaría conocer más sobre cómo llegar?',
    options: [
      { label: '📅 Agendar cita', value: 'cita' },
      { label: '← Menú principal', value: 'menu' },
    ],
  },
  precios: {
    text: 'Los precios varían según el tipo de estudio que necesites. Te recomiendo contactarnos para darte información personalizada y las opciones de pago disponibles.',
    options: [
      { label: '📞 Contactar', value: 'contacto' },
      { label: '📅 Agendar cita', value: 'cita' },
      { label: '← Menú principal', value: 'menu' },
    ],
  },
  contacto: {
    text: 'Puedes contactarnos por:\n\n📱 WhatsApp: 52 222 399 4072\n📞 Teléfono: (222) 399 4072\n📧 Email: contacto@cetin.mx\n\nEstamos aquí para ayudarte.',
    options: [
      { label: '📱 Ir a WhatsApp', value: 'whatsapp' },
      { label: '← Menú principal', value: 'menu' },
    ],
  },
  menu: {
    text: '¿En qué más puedo ayudarte?',
    options: [
      { label: '📋 Servicios', value: 'servicios' },
      { label: '📅 Agendar cita', value: 'cita' },
      { label: '📍 Ubicación', value: 'ubicacion' },
      { label: '💰 Precios', value: 'precios' },
    ],
  },
  default: {
    text: 'Gracias por tu mensaje. Para atenderte mejor, te recomiendo elegir una de las siguientes opciones o contactarnos directamente por WhatsApp.',
    options: [
      { label: '📋 Servicios', value: 'servicios' },
      { label: '📅 Agendar cita', value: 'cita' },
      { label: '📞 Contactar', value: 'contacto' },
    ],
  },
};

const isOpen = ref(false);
const isVisible = ref(false);
const messages = ref<Message[]>([]);
const inputText = ref('');
const messagesContainer = ref<HTMLElement | null>(null);
const isTyping = ref(false);
let messageId = 0;

const whatsappNumber = '522223994072';
const whatsappMessage = '¡Hola! Me gustaría obtener más información.';
const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

onMounted(() => {
  setTimeout(() => {
    isVisible.value = true;
  }, 3000);
});

const toggleChat = () => {
  isOpen.value = !isOpen.value;
  if (isOpen.value && messages.value.length === 0) {
    addBotMessage('saludo');
  }
};

const scrollToBottom = async () => {
  await nextTick();
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  }
};

const addBotMessage = async (key: string) => {
  isTyping.value = true;
  await scrollToBottom();
  
  // Simular tiempo de escritura
  await new Promise(resolve => setTimeout(resolve, 800));
  
  isTyping.value = false;
  const response = botResponses[key] || botResponses.default;
  
  messages.value.push({
    id: ++messageId,
    text: response.text,
    isBot: true,
    options: response.options,
  });
  
  await scrollToBottom();
};

const handleOptionClick = (value: string) => {
  if (value === 'whatsapp') {
    window.open(whatsappUrl, '_blank');
    return;
  }
  
  // Agregar mensaje del usuario
  const option = messages.value
    .flatMap(m => m.options || [])
    .find(o => o.value === value);
  
  if (option) {
    messages.value.push({
      id: ++messageId,
      text: option.label.replace(/^[^\w]*/, '').trim(),
      isBot: false,
    });
  }
  
  addBotMessage(value);
};

const sendMessage = () => {
  if (!inputText.value.trim()) return;
  
  messages.value.push({
    id: ++messageId,
    text: inputText.value,
    isBot: false,
  });
  
  inputText.value = '';
  
  // Buscar respuesta basada en palabras clave
  const text = inputText.value.toLowerCase();
  let responseKey = 'default';
  
  if (text.includes('cita') || text.includes('agendar')) {
    responseKey = 'cita';
  } else if (text.includes('servicio') || text.includes('tamiz')) {
    responseKey = 'servicios';
  } else if (text.includes('precio') || text.includes('costo')) {
    responseKey = 'precios';
  } else if (text.includes('ubicacion') || text.includes('donde') || text.includes('direccion')) {
    responseKey = 'ubicacion';
  } else if (text.includes('contacto') || text.includes('telefono') || text.includes('whatsapp')) {
    responseKey = 'contacto';
  }
  
  addBotMessage(responseKey);
};

const handleKeyPress = (e: KeyboardEvent) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
};
</script>

<template>
  <div class="fixed bottom-6 right-6 z-50">
    <!-- Chat Window -->
    <transition name="chat-window">
      <div 
        v-if="isOpen"
        class="absolute bottom-20 right-0 w-[350px] sm:w-[380px] bg-white dark:bg-slate-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-100 dark:border-slate-700"
      >
        <!-- Header -->
        <div class="bg-gradient-to-r from-primary to-primary-dark p-4 text-white">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <div>
              <h3 class="font-semibold text-lg">Asistente CETIN</h3>
              <p class="text-xs text-white/80">Respuesta inmediata</p>
            </div>
          </div>
        </div>

        <!-- Messages -->
        <div 
          ref="messagesContainer"
          class="h-[320px] overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-slate-900"
        >
          <div 
            v-for="message in messages" 
            :key="message.id"
            :class="[
              'max-w-[85%] animate-fade-in',
              message.isBot ? 'mr-auto' : 'ml-auto'
            ]"
          >
            <div 
              :class="[
                'rounded-2xl px-4 py-3 text-sm',
                message.isBot 
                  ? 'bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-200 shadow-sm border border-gray-100 dark:border-slate-700' 
                  : 'bg-primary text-white'
              ]"
            >
              <p class="whitespace-pre-line">{{ message.text }}</p>
            </div>
            
            <!-- Quick Options -->
            <div v-if="message.isBot && message.options" class="mt-2 flex flex-wrap gap-2">
              <button
                v-for="option in message.options"
                :key="option.value"
                @click="handleOptionClick(option.value)"
                class="text-xs bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-200 px-3 py-2 rounded-xl border border-gray-200 dark:border-slate-600 hover:bg-primary hover:text-white hover:border-primary transition-all duration-200 shadow-sm"
              >
                {{ option.label }}
              </button>
            </div>
          </div>

          <!-- Typing Indicator -->
          <div v-if="isTyping" class="flex items-center gap-2 text-gray-400">
            <div class="flex gap-1">
              <span class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0ms"></span>
              <span class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 150ms"></span>
              <span class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 300ms"></span>
            </div>
            <span class="text-xs">Escribiendo...</span>
          </div>
        </div>

        <!-- Input -->
        <div class="p-4 border-t border-gray-100 dark:border-slate-700 bg-white dark:bg-slate-800">
          <div class="flex gap-2">
            <input
              v-model="inputText"
              @keypress="handleKeyPress"
              type="text"
              placeholder="Escribe un mensaje..."
              class="flex-1 px-4 py-2.5 bg-gray-100 dark:bg-slate-700 rounded-xl text-sm text-gray-700 dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <button
              @click="sendMessage"
              class="w-10 h-10 bg-primary hover:bg-primary-dark text-white rounded-xl flex items-center justify-center transition-colors duration-200"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Toggle Button -->
    <button
      v-show="isVisible"
      @click="toggleChat"
      class="relative w-14 h-14 rounded-full shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl overflow-hidden chatbot-pulse"
      :class="isOpen ? 'bg-gray-200 dark:bg-slate-700' : 'bg-primary hover:bg-primary-dark'"
    >
      <!-- Pulse ring -->
      <div 
        v-if="!isOpen"
        class="absolute inset-0 rounded-full bg-primary animate-ping opacity-20"
      ></div>
      
      <!-- Soft glow ring -->
      <div 
        v-if="!isOpen"
        class="absolute -inset-1 rounded-full bg-gradient-to-r from-primary-light to-primary opacity-40 blur-sm animate-pulse"
      ></div>

      <!-- Icon -->
      <div class="relative z-10 flex items-center justify-center w-full h-full">
        <svg 
          v-if="!isOpen"
          class="w-7 h-7 text-white" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        <svg 
          v-else
          class="w-6 h-6 text-gray-600 dark:text-gray-300" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </div>

      <!-- Notification Badge -->
      <span 
        v-if="!isOpen && messages.length === 0"
        class="absolute -top-1 -right-1 w-5 h-5 bg-accent-yellow text-title text-xs font-bold rounded-full flex items-center justify-center animate-bounce"
      >
        1
      </span>
    </button>
  </div>
</template>

<style scoped>
.chat-window-enter-active,
.chat-window-leave-active {
  transition: all 0.3s ease;
}

.chat-window-enter-from,
.chat-window-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}

.animate-fade-in {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Chatbot button breathing effect */
.chatbot-pulse {
  animation: chatbotBreathe 2.5s ease-in-out infinite;
}

@keyframes chatbotBreathe {
  0%, 100% {
    box-shadow: 0 4px 15px rgba(233, 30, 140, 0.4);
    transform: scale(1);
  }
  50% {
    box-shadow: 0 6px 25px rgba(233, 30, 140, 0.6);
    transform: scale(1.03);
  }
}

.chatbot-pulse:hover {
  animation: none;
}

/* Custom scrollbar */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: transparent;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #e5e7eb;
  border-radius: 3px;
}

.dark .overflow-y-auto::-webkit-scrollbar-thumb {
  background: #475569;
}
</style>
