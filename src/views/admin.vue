<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useContent } from '../composables/useContent';
import { useRouter } from 'vue-router';

const router = useRouter();
const { 
  content, 
  updateHero, 
  updateVideosSection,
  updateVideo,
  addVideo,
  removeVideo,
  updateStats,
  updateInfoSection, 
  updateService,
  addService,
  removeService,
  updateLaborAltruista,
  updateProximamente,
  updateSucursales,
  addSucursal,
  removeSucursal,
  updateContact, 
  updateFooter, 
  resetContent 
} = useContent();

// Tabs
const activeTab = ref<'hero' | 'videos' | 'stats' | 'services' | 'altruista' | 'proximamente' | 'sucursales' | 'contact' | 'footer'>('hero');

// Hero Form
const heroForm = reactive({
  badge: '',
  title: '',
  titleHighlight: '',
  subtitle: '',
  ctaPrimary: '',
  ctaSecondary: '',
});

// Videos Form
const videosHeaderForm = reactive({
  title: '',
  subtitle: '',
});

// Stats Form
const statsForm = reactive({
  bebesAtendidos: '',
  bebesAtendidosLabel: '',
  citasAgendadas: '',
  citasAgendadasLabel: '',
  tamicesEspecializados: '',
  tamicesEspecializadosLabel: '',
  confiabilidad: '',
  confiabilidadLabel: '',
});

// Info Section Form
const infoForm = reactive({
  badge: '',
  title: '',
  titleHighlight: '',
  description: '',
});

// Labor Altruista Form
const altruistaForm = reactive({
  badge: '',
  title: '',
  titleHighlight: '',
  description1: '',
  description2: '',
  videoUrl: '',
  videoCaption: '',
});

// Proximamente Form
const proximamenteForm = reactive({
  badge: '',
  title: '',
  titleHighlight: '',
  subtitle: '',
  backgroundImage: '',
});

// Contact Form
const contactForm = reactive({
  title: '',
  subtitle: '',
  email: '',
  whatsapp: '',
});

// Footer Form
const footerForm = reactive({
  copyright: '',
  facebook: '',
  instagram: '',
  whatsapp: '',
});

// Load initial data
const loadFormData = () => {
  // Hero
  heroForm.badge = content.value.hero.badge;
  heroForm.title = content.value.hero.title;
  heroForm.titleHighlight = content.value.hero.titleHighlight;
  heroForm.subtitle = content.value.hero.subtitle;
  heroForm.ctaPrimary = content.value.hero.ctaPrimary;
  heroForm.ctaSecondary = content.value.hero.ctaSecondary;

  // Videos
  videosHeaderForm.title = content.value.videosSection.title;
  videosHeaderForm.subtitle = content.value.videosSection.subtitle;

  // Stats
  statsForm.bebesAtendidos = content.value.stats.bebesAtendidos;
  statsForm.bebesAtendidosLabel = content.value.stats.bebesAtendidosLabel;
  statsForm.citasAgendadas = content.value.stats.citasAgendadas;
  statsForm.citasAgendadasLabel = content.value.stats.citasAgendadasLabel;
  statsForm.tamicesEspecializados = content.value.stats.tamicesEspecializados;
  statsForm.tamicesEspecializadosLabel = content.value.stats.tamicesEspecializadosLabel;
  statsForm.confiabilidad = content.value.stats.confiabilidad;
  statsForm.confiabilidadLabel = content.value.stats.confiabilidadLabel;

  // Info Section
  infoForm.badge = content.value.infoSection.badge;
  infoForm.title = content.value.infoSection.title;
  infoForm.titleHighlight = content.value.infoSection.titleHighlight;
  infoForm.description = content.value.infoSection.description;

  // Labor Altruista
  altruistaForm.badge = content.value.laborAltruista.badge;
  altruistaForm.title = content.value.laborAltruista.title;
  altruistaForm.titleHighlight = content.value.laborAltruista.titleHighlight;
  altruistaForm.description1 = content.value.laborAltruista.description1;
  altruistaForm.description2 = content.value.laborAltruista.description2;
  altruistaForm.videoUrl = content.value.laborAltruista.videoUrl;
  altruistaForm.videoCaption = content.value.laborAltruista.videoCaption;

  // Proximamente
  proximamenteForm.badge = content.value.proximamente.badge;
  proximamenteForm.title = content.value.proximamente.title;
  proximamenteForm.titleHighlight = content.value.proximamente.titleHighlight;
  proximamenteForm.subtitle = content.value.proximamente.subtitle;
  proximamenteForm.backgroundImage = content.value.proximamente.backgroundImage;

  // Contact
  contactForm.title = content.value.contact.title;
  contactForm.subtitle = content.value.contact.subtitle;
  contactForm.email = content.value.contact.email;
  contactForm.whatsapp = content.value.contact.whatsapp;

  // Footer
  footerForm.copyright = content.value.footer.copyright;
  footerForm.facebook = content.value.footer.socialLinks.facebook || '';
  footerForm.instagram = content.value.footer.socialLinks.instagram || '';
  footerForm.whatsapp = content.value.footer.socialLinks.whatsapp || '';
};

onMounted(() => {
  loadFormData();
});

// Notification
const notification = ref('');
const showNotification = (message: string) => {
  notification.value = message;
  setTimeout(() => {
    notification.value = '';
  }, 3000);
};

// Save functions
const saveHero = () => {
  updateHero({ ...heroForm });
  showNotification('Sección Hero guardada');
};

const saveVideosHeader = () => {
  updateVideosSection({
    title: videosHeaderForm.title,
    subtitle: videosHeaderForm.subtitle,
  });
  showNotification('Encabezado de Videos guardado');
};

const saveStats = () => {
  updateStats({ ...statsForm });
  showNotification('Estadísticas guardadas');
};

const saveInfoSection = () => {
  updateInfoSection({
    badge: infoForm.badge,
    title: infoForm.title,
    titleHighlight: infoForm.titleHighlight,
    description: infoForm.description,
  });
  showNotification('Sección de Servicios guardada');
};

const saveLaborAltruista = () => {
  updateLaborAltruista({ ...altruistaForm });
  showNotification('Labor Altruista guardada');
};

const saveProximamente = () => {
  updateProximamente({ ...proximamenteForm });
  showNotification('Sección Próximamente guardada');
};

const saveContact = () => {
  updateContact({ ...contactForm });
  showNotification('Información de Contacto guardada');
};

const saveFooter = () => {
  updateFooter({
    copyright: footerForm.copyright,
    socialLinks: {
      facebook: footerForm.facebook || undefined,
      instagram: footerForm.instagram || undefined,
      whatsapp: footerForm.whatsapp || undefined,
    },
  });
  showNotification('Footer guardado');
};

// Videos editing
const editingVideo = ref<string | null>(null);
const videoForm = reactive({
  title: '',
  description: '',
  youtubeUrl: '',
});

const startEditVideo = (videoId: string) => {
  const video = content.value.videosSection.videos.find(v => v.id === videoId);
  if (video) {
    videoForm.title = video.title;
    videoForm.description = video.description;
    videoForm.youtubeUrl = video.youtubeUrl;
    editingVideo.value = videoId;
  }
};

const saveVideoEdit = () => {
  if (editingVideo.value) {
    updateVideo(editingVideo.value, { ...videoForm });
    editingVideo.value = null;
    showNotification('Video actualizado');
  }
};

const cancelEditVideo = () => {
  editingVideo.value = null;
};

const handleAddVideo = () => {
  const newId = `video-${Date.now()}`;
  addVideo({
    id: newId,
    title: 'Nuevo Video',
    description: 'Descripción del video',
    youtubeUrl: 'https://www.youtube.com/embed/VIDEO_ID',
  });
  showNotification('Video agregado');
};

const handleRemoveVideo = (videoId: string) => {
  if (confirm('¿Estás seguro de eliminar este video?')) {
    removeVideo(videoId);
    showNotification('Video eliminado');
  }
};

// Services editing
const editingService = ref<string | null>(null);
const serviceForm = reactive({
  name: '',
  description: '',
});

const startEditService = (serviceId: string) => {
  const service = content.value.infoSection.services.find(s => s.id === serviceId);
  if (service) {
    serviceForm.name = service.name;
    serviceForm.description = service.description;
    editingService.value = serviceId;
  }
};

const saveServiceEdit = () => {
  if (editingService.value) {
    updateService(editingService.value, { ...serviceForm });
    editingService.value = null;
    showNotification('Servicio actualizado');
  }
};

const cancelEditService = () => {
  editingService.value = null;
};

const handleAddService = () => {
  const newId = `service-${Date.now()}`;
  addService({
    id: newId,
    name: 'Nuevo Servicio',
    description: 'Descripción del servicio',
    icon: 'Meta.png',
    color: 'pink',
  });
  showNotification('Servicio agregado');
};

const handleRemoveService = (serviceId: string) => {
  if (confirm('¿Estás seguro de eliminar este servicio?')) {
    removeService(serviceId);
    showNotification('Servicio eliminado');
  }
};

// Sucursales editing
const editingSucursal = ref<string | null>(null);
const sucursalForm = reactive({
  name: '',
  city: '',
  phone: '',
  plus: '',
  refKey: 'CDMX' as 'CDMX' | 'SAN_ANDRES_CHOLULA' | 'CUAUTITLAN_IZCALLI' | 'EMILIANO_ZAPATA',
});

const startEditSucursal = (sucursalId: string) => {
  const sucursal = content.value.sucursales.find(s => s.id === sucursalId);
  if (sucursal) {
    sucursalForm.name = sucursal.name;
    sucursalForm.city = sucursal.city;
    sucursalForm.phone = sucursal.phone;
    sucursalForm.plus = sucursal.plus;
    sucursalForm.refKey = sucursal.refKey;
    editingSucursal.value = sucursalId;
  }
};

const saveSucursalEdit = () => {
  if (editingSucursal.value) {
    const updated = content.value.sucursales.map(s => 
      s.id === editingSucursal.value ? { ...s, ...sucursalForm } : s
    );
    updateSucursales(updated);
    editingSucursal.value = null;
    showNotification('Sucursal actualizada');
  }
};

const cancelEditSucursal = () => {
  editingSucursal.value = null;
};

const handleAddSucursal = () => {
  const newId = `sucursal-${Date.now()}`;
  addSucursal({
    id: newId,
    name: 'Nueva Sucursal',
    city: 'Ciudad',
    phone: '55 0000 0000',
    plus: 'XXXX+XX',
    refKey: 'CDMX',
  });
  showNotification('Sucursal agregada');
};

const handleRemoveSucursal = (sucursalId: string) => {
  if (confirm('¿Estás seguro de eliminar esta sucursal?')) {
    removeSucursal(sucursalId);
    showNotification('Sucursal eliminada');
  }
};

// Reset
const handleReset = () => {
  if (confirm('¿Estás seguro de que quieres restaurar todo el contenido a los valores por defecto?')) {
    resetContent();
    loadFormData();
    showNotification('Contenido restaurado');
  }
};

const goToHome = () => {
  router.push('/');
};

const tabs = [
  { id: 'hero', label: 'Hero' },
  { id: 'videos', label: 'Videos' },
  { id: 'stats', label: 'Estadísticas' },
  { id: 'services', label: 'Servicios' },
  { id: 'altruista', label: 'Labor Altruista' },
  { id: 'proximamente', label: 'Próximamente' },
  { id: 'sucursales', label: 'Sucursales' },
  { id: 'contact', label: 'Contacto' },
  { id: 'footer', label: 'Footer' },
];
</script>

<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Header -->
    <header class="bg-[#0f2a5c] text-white shadow-lg sticky top-0 z-40">
      <div class="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div class="flex items-center gap-4">
          <button 
            @click="goToHome"
            class="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <h1 class="text-2xl font-bold">Gestor de Contenido</h1>
        </div>
        <button 
          @click="handleReset"
          class="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg transition-colors text-sm font-medium"
        >
          Restaurar Todo
        </button>
      </div>
    </header>

    <!-- Notification -->
    <Transition
      enter-active-class="transition-all duration-300"
      enter-from-class="opacity-0 -translate-y-4"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-300"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-4"
    >
      <div 
        v-if="notification"
        class="fixed top-20 right-6 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
        {{ notification }}
      </div>
    </Transition>

    <div class="max-w-7xl mx-auto px-6 py-8">
      <!-- Tabs -->
      <div class="flex flex-wrap gap-2 mb-8 bg-white rounded-xl p-2 shadow-sm">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id as any"
          :class="[
            'px-4 py-2 rounded-lg font-medium transition-all text-sm',
            activeTab === tab.id 
              ? 'bg-pink-500 text-white shadow-md' 
              : 'text-gray-600 hover:bg-gray-100'
          ]"
        >
          {{ tab.label }}
        </button>
      </div>

      <!-- Hero Tab -->
      <div v-show="activeTab === 'hero'" class="bg-white rounded-2xl shadow-sm p-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-6">Sección Hero (Inicio)</h2>
        
        <div class="grid gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Badge/Etiqueta</label>
            <input v-model="heroForm.badge" type="text" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent" />
          </div>

          <div class="grid md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Título Principal</label>
              <input v-model="heroForm.title" type="text" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Texto Destacado (rosa)</label>
              <input v-model="heroForm.titleHighlight" type="text" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent" />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Subtítulo</label>
            <textarea v-model="heroForm.subtitle" rows="3" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none"></textarea>
          </div>

          <div class="grid md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Botón Principal</label>
              <input v-model="heroForm.ctaPrimary" type="text" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Botón Secundario</label>
              <input v-model="heroForm.ctaSecondary" type="text" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent" />
            </div>
          </div>

          <div class="flex justify-end pt-4">
            <button @click="saveHero" class="px-8 py-3 bg-pink-500 hover:bg-pink-600 text-white font-semibold rounded-xl transition-all hover:shadow-lg">
              Guardar Cambios
            </button>
          </div>
        </div>
      </div>

      <!-- Videos Tab -->
      <div v-show="activeTab === 'videos'" class="space-y-6">
        <div class="bg-white rounded-2xl shadow-sm p-8">
          <h2 class="text-2xl font-bold text-gray-800 mb-6">Encabezado de Sección de Videos</h2>
          
          <div class="grid gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Título</label>
              <input v-model="videosHeaderForm.title" type="text" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Subtítulo</label>
              <input v-model="videosHeaderForm.subtitle" type="text" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent" />
            </div>
            <div class="flex justify-end">
              <button @click="saveVideosHeader" class="px-8 py-3 bg-pink-500 hover:bg-pink-600 text-white font-semibold rounded-xl transition-all hover:shadow-lg">
                Guardar Encabezado
              </button>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-2xl shadow-sm p-8">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-2xl font-bold text-gray-800">Videos</h2>
            <button @click="handleAddVideo" class="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors flex items-center gap-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              Agregar Video
            </button>
          </div>
          
          <div class="grid gap-4">
            <div v-for="video in content.videosSection.videos" :key="video.id" class="border border-gray-200 rounded-xl p-6 hover:border-pink-300 transition-colors">
              <div v-if="editingVideo === video.id" class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Título</label>
                  <input v-model="videoForm.title" type="text" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
                  <textarea v-model="videoForm.description" rows="2" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none"></textarea>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">URL de YouTube (embed)</label>
                  <input v-model="videoForm.youtubeUrl" type="text" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent" placeholder="https://www.youtube.com/embed/VIDEO_ID" />
                </div>
                <div class="flex gap-3 justify-end">
                  <button @click="cancelEditVideo" class="px-5 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors">Cancelar</button>
                  <button @click="saveVideoEdit" class="px-5 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors">Guardar</button>
                </div>
              </div>
              <div v-else class="flex items-start justify-between">
                <div>
                  <h3 class="font-semibold text-gray-800">{{ video.title }}</h3>
                  <p class="text-gray-500 text-sm mt-1">{{ video.description }}</p>
                  <p class="text-gray-400 text-xs mt-2 font-mono">{{ video.youtubeUrl }}</p>
                </div>
                <div class="flex gap-2">
                  <button @click="startEditVideo(video.id)" class="p-2 text-gray-400 hover:text-pink-500 hover:bg-pink-50 rounded-lg transition-colors">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button @click="handleRemoveVideo(video.id)" class="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Stats Tab -->
      <div v-show="activeTab === 'stats'" class="bg-white rounded-2xl shadow-sm p-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-6">Estadísticas</h2>
        
        <div class="grid gap-6">
          <div class="grid md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Bebés Atendidos (número)</label>
              <input v-model="statsForm.bebesAtendidos" type="text" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent" placeholder="+10,000" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Etiqueta Bebés Atendidos</label>
              <input v-model="statsForm.bebesAtendidosLabel" type="text" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent" />
            </div>
          </div>

          <div class="grid md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Citas Agendadas (número)</label>
              <input v-model="statsForm.citasAgendadas" type="text" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent" placeholder="+10,000" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Etiqueta Citas Agendadas</label>
              <input v-model="statsForm.citasAgendadasLabel" type="text" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent" />
            </div>
          </div>

          <div class="grid md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Tamices Especializados (número)</label>
              <input v-model="statsForm.tamicesEspecializados" type="text" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent" placeholder="5" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Etiqueta Tamices</label>
              <input v-model="statsForm.tamicesEspecializadosLabel" type="text" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent" />
            </div>
          </div>

          <div class="grid md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Confiabilidad (número)</label>
              <input v-model="statsForm.confiabilidad" type="text" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent" placeholder="100%" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Etiqueta Confiabilidad</label>
              <input v-model="statsForm.confiabilidadLabel" type="text" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent" />
            </div>
          </div>

          <div class="flex justify-end pt-4">
            <button @click="saveStats" class="px-8 py-3 bg-pink-500 hover:bg-pink-600 text-white font-semibold rounded-xl transition-all hover:shadow-lg">
              Guardar Estadísticas
            </button>
          </div>
        </div>
      </div>

      <!-- Services Tab -->
      <div v-show="activeTab === 'services'" class="space-y-6">
        <div class="bg-white rounded-2xl shadow-sm p-8">
          <h2 class="text-2xl font-bold text-gray-800 mb-6">Encabezado de Servicios</h2>
          
          <div class="grid gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Badge/Etiqueta</label>
              <input v-model="infoForm.badge" type="text" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent" />
            </div>
            <div class="grid md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Título</label>
                <input v-model="infoForm.title" type="text" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Texto Destacado</label>
                <input v-model="infoForm.titleHighlight" type="text" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent" />
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
              <textarea v-model="infoForm.description" rows="4" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none"></textarea>
            </div>
            <div class="flex justify-end">
              <button @click="saveInfoSection" class="px-8 py-3 bg-pink-500 hover:bg-pink-600 text-white font-semibold rounded-xl transition-all hover:shadow-lg">
                Guardar Encabezado
              </button>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-2xl shadow-sm p-8">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-2xl font-bold text-gray-800">Servicios (Tamices)</h2>
            <button @click="handleAddService" class="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors flex items-center gap-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              Agregar Servicio
            </button>
          </div>
          
          <div class="grid gap-4">
            <div v-for="service in content.infoSection.services" :key="service.id" class="border border-gray-200 rounded-xl p-6 hover:border-pink-300 transition-colors">
              <div v-if="editingService === service.id" class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
                  <input v-model="serviceForm.name" type="text" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
                  <textarea v-model="serviceForm.description" rows="3" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none"></textarea>
                </div>
                <div class="flex gap-3 justify-end">
                  <button @click="cancelEditService" class="px-5 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors">Cancelar</button>
                  <button @click="saveServiceEdit" class="px-5 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors">Guardar</button>
                </div>
              </div>
              <div v-else class="flex items-start justify-between">
                <div class="flex items-start gap-4">
                  <img :src="`/src/assets/images/card-icons/${service.icon}`" :alt="service.name" class="w-12 h-12 object-contain" />
                  <div>
                    <h3 class="font-semibold text-gray-800">{{ service.name }}</h3>
                    <p class="text-gray-500 text-sm mt-1">{{ service.description }}</p>
                  </div>
                </div>
                <div class="flex gap-2">
                  <button @click="startEditService(service.id)" class="p-2 text-gray-400 hover:text-pink-500 hover:bg-pink-50 rounded-lg transition-colors">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button @click="handleRemoveService(service.id)" class="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Labor Altruista Tab -->
      <div v-show="activeTab === 'altruista'" class="bg-white rounded-2xl shadow-sm p-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-6">Labor Altruista</h2>
        
        <div class="grid gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Badge/Etiqueta</label>
            <input v-model="altruistaForm.badge" type="text" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent" />
          </div>
          
          <div class="grid md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Título</label>
              <input v-model="altruistaForm.title" type="text" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Texto Destacado</label>
              <input v-model="altruistaForm.titleHighlight" type="text" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent" />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Descripción 1</label>
            <textarea v-model="altruistaForm.description1" rows="3" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none"></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Descripción 2</label>
            <textarea v-model="altruistaForm.description2" rows="3" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none"></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">URL del Video (embed)</label>
            <input v-model="altruistaForm.videoUrl" type="text" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent" placeholder="https://www.youtube.com/embed/VIDEO_ID" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Caption del Video</label>
            <textarea v-model="altruistaForm.videoCaption" rows="2" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none"></textarea>
          </div>

          <div class="flex justify-end pt-4">
            <button @click="saveLaborAltruista" class="px-8 py-3 bg-pink-500 hover:bg-pink-600 text-white font-semibold rounded-xl transition-all hover:shadow-lg">
              Guardar Cambios
            </button>
          </div>
        </div>
      </div>

      <!-- Proximamente Tab -->
      <div v-show="activeTab === 'proximamente'" class="bg-white rounded-2xl shadow-sm p-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-6">Sección Próximamente</h2>
        
        <div class="grid gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Badge/Etiqueta</label>
            <input v-model="proximamenteForm.badge" type="text" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent" />
          </div>
          
          <div class="grid md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Título</label>
              <input v-model="proximamenteForm.title" type="text" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Texto Destacado</label>
              <input v-model="proximamenteForm.titleHighlight" type="text" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent" />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Subtítulo</label>
            <input v-model="proximamenteForm.subtitle" type="text" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Imagen de Fondo (ruta)</label>
            <input v-model="proximamenteForm.backgroundImage" type="text" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent" placeholder="/src/assets/images/..." />
            <p class="text-xs text-gray-500 mt-1">Ejemplo: /src/assets/images/cetin_ciudad_de_mexico.jpg</p>
          </div>

          <div class="flex justify-end pt-4">
            <button @click="saveProximamente" class="px-8 py-3 bg-pink-500 hover:bg-pink-600 text-white font-semibold rounded-xl transition-all hover:shadow-lg">
              Guardar Cambios
            </button>
          </div>
        </div>
      </div>

      <!-- Sucursales Tab -->
      <div v-show="activeTab === 'sucursales'" class="bg-white rounded-2xl shadow-sm p-8">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-bold text-gray-800">Sucursales</h2>
          <button @click="handleAddSucursal" class="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors flex items-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Agregar Sucursal
          </button>
        </div>
        
        <div class="grid gap-4">
          <div v-for="sucursal in content.sucursales" :key="sucursal.id" class="border border-gray-200 rounded-xl p-6 hover:border-pink-300 transition-colors">
            <div v-if="editingSucursal === sucursal.id" class="space-y-4">
              <div class="grid md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
                  <input v-model="sucursalForm.name" type="text" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Ciudad</label>
                  <input v-model="sucursalForm.city" type="text" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent" />
                </div>
              </div>
              <div class="grid md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Teléfono</label>
                  <input v-model="sucursalForm.phone" type="text" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Plus Code</label>
                  <input v-model="sucursalForm.plus" type="text" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent" />
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Referencia de Ubicación</label>
                <select v-model="sucursalForm.refKey" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent">
                  <option value="CDMX">Ciudad de México</option>
                  <option value="SAN_ANDRES_CHOLULA">San Andrés Cholula, Puebla</option>
                  <option value="CUAUTITLAN_IZCALLI">Cuautitlán Izcalli</option>
                  <option value="EMILIANO_ZAPATA">Emiliano Zapata</option>
                </select>
              </div>
              <div class="flex gap-3 justify-end">
                <button @click="cancelEditSucursal" class="px-5 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors">Cancelar</button>
                <button @click="saveSucursalEdit" class="px-5 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors">Guardar</button>
              </div>
            </div>
            <div v-else class="flex items-start justify-between">
              <div>
                <h3 class="font-semibold text-gray-800">{{ sucursal.name }}</h3>
                <p class="text-gray-500 text-sm mt-1">{{ sucursal.city }}</p>
                <p class="text-pink-500 text-sm mt-1">{{ sucursal.phone }}</p>
              </div>
              <div class="flex gap-2">
                <button @click="startEditSucursal(sucursal.id)" class="p-2 text-gray-400 hover:text-pink-500 hover:bg-pink-50 rounded-lg transition-colors">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button @click="handleRemoveSucursal(sucursal.id)" class="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Contact Tab -->
      <div v-show="activeTab === 'contact'" class="bg-white rounded-2xl shadow-sm p-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-6">Información de Contacto</h2>
        
        <div class="grid gap-6">
          <div class="grid md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Título</label>
              <input v-model="contactForm.title" type="text" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Subtítulo</label>
              <input v-model="contactForm.subtitle" type="text" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent" />
            </div>
          </div>

          <div class="grid md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input v-model="contactForm.email" type="email" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">WhatsApp (número)</label>
              <input v-model="contactForm.whatsapp" type="text" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent" />
            </div>
          </div>

          <div class="flex justify-end pt-4">
            <button @click="saveContact" class="px-8 py-3 bg-pink-500 hover:bg-pink-600 text-white font-semibold rounded-xl transition-all hover:shadow-lg">
              Guardar Cambios
            </button>
          </div>
        </div>
      </div>

      <!-- Footer Tab -->
      <div v-show="activeTab === 'footer'" class="bg-white rounded-2xl shadow-sm p-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-6">Footer</h2>
        
        <div class="grid gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Copyright</label>
            <input v-model="footerForm.copyright" type="text" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent" />
          </div>

          <div>
            <h3 class="text-lg font-semibold text-gray-700 mb-4">Redes Sociales</h3>
            <div class="grid md:grid-cols-3 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Facebook URL</label>
                <input v-model="footerForm.facebook" type="url" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Instagram URL</label>
                <input v-model="footerForm.instagram" type="url" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">WhatsApp URL</label>
                <input v-model="footerForm.whatsapp" type="url" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent" />
              </div>
            </div>
          </div>

          <div class="flex justify-end pt-4">
            <button @click="saveFooter" class="px-8 py-3 bg-pink-500 hover:bg-pink-600 text-white font-semibold rounded-xl transition-all hover:shadow-lg">
              Guardar Cambios
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
