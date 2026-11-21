<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue';
import { useContent } from '../composables/useContent';
import { useRouter } from 'vue-router';
import { useAuth } from '../composables/useAuth';
import cetinLogo from '../assets/images/cetin_logo.png';
import type { VideoItem } from '../data/content';
import { API_CONFIG } from '../config/api';

const router = useRouter();
const { logout } = useAuth();
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

type AdminSection = 'hero' | 'videos' | 'stats' | 'services' | 'altruista' | 'proximamente' | 'sucursales' | 'contact' | 'footer';

// Navigation
const activeTab = ref<AdminSection>('hero');

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
  active: true,
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
  active: true,
  badge: '',
  title: '',
  titleHighlight: '',
  subtitle: '',
  backgroundImage: '',
  backgroundImageKey: '',
});
const originalProximamenteImageKey = ref('');
const uploadingProximamenteImage = ref(false);
const isDraggingProximamenteImage = ref(false);

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
  altruistaForm.active = content.value.laborAltruista.active;
  altruistaForm.badge = content.value.laborAltruista.badge;
  altruistaForm.title = content.value.laborAltruista.title;
  altruistaForm.titleHighlight = content.value.laborAltruista.titleHighlight;
  altruistaForm.description1 = content.value.laborAltruista.description1;
  altruistaForm.description2 = content.value.laborAltruista.description2;
  altruistaForm.videoUrl = content.value.laborAltruista.videoUrl;
  altruistaForm.videoCaption = content.value.laborAltruista.videoCaption;

  // Proximamente
  proximamenteForm.active = content.value.proximamente.active;
  proximamenteForm.badge = content.value.proximamente.badge;
  proximamenteForm.title = content.value.proximamente.title;
  proximamenteForm.titleHighlight = content.value.proximamente.titleHighlight;
  proximamenteForm.subtitle = content.value.proximamente.subtitle;
  proximamenteForm.backgroundImage = content.value.proximamente.backgroundImage;
  proximamenteForm.backgroundImageKey = content.value.proximamente.backgroundImageKey || '';
  originalProximamenteImageKey.value = content.value.proximamente.backgroundImageKey || '';

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
const saveStatus = ref('Sin cambios guardados en esta sesión');
const savedAt = ref('');
const showNotification = (message: string) => {
  notification.value = message;
  saveStatus.value = message;
  savedAt.value = new Intl.DateTimeFormat('es-MX', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date());
  setTimeout(() => {
    notification.value = '';
  }, 3000);
};

// Confirmation modal
const confirmation = reactive({
  open: false,
  title: '',
  message: '',
  confirmLabel: 'Eliminar',
  action: null as (() => void) | null,
});

const requestConfirmation = (
  title: string,
  message: string,
  action: () => void,
  confirmLabel = 'Eliminar',
) => {
  confirmation.title = title;
  confirmation.message = message;
  confirmation.confirmLabel = confirmLabel;
  confirmation.action = action;
  confirmation.open = true;
};

const closeConfirmation = () => {
  confirmation.open = false;
  confirmation.action = null;
};

const confirmAction = () => {
  const action = confirmation.action;
  closeConfirmation();
  action?.();
};

const handleConfirmationKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && confirmation.open) closeConfirmation();
};

onMounted(() => document.addEventListener('keydown', handleConfirmationKeydown));
onUnmounted(() => document.removeEventListener('keydown', handleConfirmationKeydown));

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

const uploadProximamenteImage = async (event: Event) => {
  const file = event instanceof DragEvent
    ? event.dataTransfer?.files?.[0]
    : (event.target as HTMLInputElement).files?.[0];
  isDraggingProximamenteImage.value = false;
  if (!file) return;
  if (!['image/jpeg', 'image/png', 'image/webp', 'image/avif'].includes(file.type) || file.size > 5 * 1024 * 1024) {
    showNotification('Usa una imagen JPG, PNG, WebP o AVIF de máximo 5 MB.');
    return;
  }
  try {
    uploadingProximamenteImage.value = true;
    const token = localStorage.getItem('cetin_jwt_token');
    const signedResponse = await fetch(`${API_CONFIG.contentBaseUrl}${API_CONFIG.endpoints.media.createUploadUrl}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ scope: 'upcoming', fileName: file.name, contentType: file.type }),
    });
    if (!signedResponse.ok) throw new Error('No se pudo autorizar la carga');
    const { uploadUrl, publicUrl, key } = await signedResponse.json();
    const uploadResponse = await fetch(uploadUrl, { method: 'PUT', headers: { 'Content-Type': file.type }, body: file });
    if (!uploadResponse.ok) throw new Error('No se pudo subir la imagen');
    proximamenteForm.backgroundImage = publicUrl;
    proximamenteForm.backgroundImageKey = key;
    showNotification('Imagen cargada. Guarda los cambios para aplicarla.');
  } catch (error) {
    console.error(error);
    showNotification('No fue posible cargar la imagen');
  } finally {
    uploadingProximamenteImage.value = false;
    if (event.target instanceof HTMLInputElement) event.target.value = '';
  }
};

const saveProximamente = async () => {
  const previousKey = originalProximamenteImageKey.value;
  updateProximamente({ ...proximamenteForm });
  if (previousKey && previousKey !== proximamenteForm.backgroundImageKey) {
    try { await removeMediaObject(previousKey); } catch (error) { console.error(error); }
  }
  originalProximamenteImageKey.value = proximamenteForm.backgroundImageKey;
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
const draggedVideoId = ref<string | null>(null);
const dragOverVideoId = ref<string | null>(null);
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
  const video = content.value.videosSection.videos.find(item => item.id === videoId);
  requestConfirmation(
    'Eliminar video',
    `¿Deseas eliminar “${video?.title || 'este video'}”? Esta acción no se puede deshacer.`,
    () => {
    removeVideo(videoId);
    showNotification('Video eliminado');
    },
  );
};

const persistVideoOrder = (videos: VideoItem[]) => {
  updateVideosSection({ videos });
  showNotification('Orden de videos actualizado');
};

const moveVideo = (videoId: string, direction: -1 | 1) => {
  const videos = [...content.value.videosSection.videos];
  const currentIndex = videos.findIndex(video => video.id === videoId);
  const targetIndex = currentIndex + direction;
  if (currentIndex < 0 || targetIndex < 0 || targetIndex >= videos.length) return;
  const [video] = videos.splice(currentIndex, 1);
  videos.splice(targetIndex, 0, video);
  persistVideoOrder(videos);
};

const handleVideoDragStart = (event: DragEvent, videoId: string) => {
  draggedVideoId.value = videoId;
  event.dataTransfer?.setData('text/plain', videoId);
  if (event.dataTransfer) event.dataTransfer.effectAllowed = 'move';
};

const handleVideoDragOver = (videoId: string) => {
  if (draggedVideoId.value && draggedVideoId.value !== videoId) {
    dragOverVideoId.value = videoId;
  }
};

const handleVideoDrop = (targetVideoId: string) => {
  const sourceVideoId = draggedVideoId.value;
  if (!sourceVideoId || sourceVideoId === targetVideoId) {
    handleVideoDragEnd();
    return;
  }

  const videos = [...content.value.videosSection.videos];
  const sourceIndex = videos.findIndex(video => video.id === sourceVideoId);
  const targetIndex = videos.findIndex(video => video.id === targetVideoId);
  if (sourceIndex >= 0 && targetIndex >= 0) {
    const [video] = videos.splice(sourceIndex, 1);
    videos.splice(targetIndex, 0, video);
    persistVideoOrder(videos);
  }
  handleVideoDragEnd();
};

const handleVideoDragEnd = () => {
  draggedVideoId.value = null;
  dragOverVideoId.value = null;
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
  const service = content.value.infoSection.services.find(item => item.id === serviceId);
  requestConfirmation(
    'Eliminar servicio',
    `¿Deseas eliminar “${service?.name || 'este servicio'}”? Esta acción no se puede deshacer.`,
    () => {
    removeService(serviceId);
    showNotification('Servicio eliminado');
    },
  );
};

// Sucursales editing
const editingSucursal = ref<string | null>(null);
const originalSucursalImageKey = ref('');
const uploadingSucursalImage = ref(false);
const isDraggingSucursalImage = ref(false);
const sucursalForm = reactive({
  name: '',
  image: '',
  imageKey: '',
  city: '',
  address: '',
  phone: '',
  email: '',
  facebook: '',
  mapsUrl: '',
  latitude: 19.4326,
  longitude: -99.1332,
  plus: '',
  refKey: 'CDMX' as 'CDMX' | 'SAN_ANDRES_CHOLULA' | 'CUAUTITLAN_IZCALLI' | 'EMILIANO_ZAPATA',
});

const startEditSucursal = (sucursalId: string) => {
  const sucursal = content.value.sucursales.find(s => s.id === sucursalId);
  if (sucursal) {
    sucursalForm.name = sucursal.name;
    sucursalForm.image = sucursal.image || '';
    sucursalForm.imageKey = sucursal.imageKey || '';
    originalSucursalImageKey.value = sucursal.imageKey || '';
    sucursalForm.city = sucursal.city;
    sucursalForm.address = sucursal.address || '';
    sucursalForm.phone = sucursal.phone;
    sucursalForm.email = sucursal.email || '';
    sucursalForm.facebook = sucursal.facebook || '';
    sucursalForm.mapsUrl = sucursal.mapsUrl || '';
    sucursalForm.latitude = sucursal.latitude;
    sucursalForm.longitude = sucursal.longitude;
    sucursalForm.plus = sucursal.plus;
    sucursalForm.refKey = sucursal.refKey;
    editingSucursal.value = sucursalId;
  }
};

const removeMediaObject = async (key: string) => {
  if (!key) return;
  const token = localStorage.getItem('cetin_jwt_token');
  const response = await fetch(`${API_CONFIG.contentBaseUrl}${API_CONFIG.endpoints.media.remove}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ key }),
  });
  if (!response.ok) throw new Error('No se pudo eliminar la imagen de S3');
};

const uploadSucursalCover = async (event: Event) => {
  const file = event instanceof DragEvent
    ? event.dataTransfer?.files?.[0]
    : (event.target as HTMLInputElement).files?.[0];
  isDraggingSucursalImage.value = false;
  if (!file || !editingSucursal.value) return;
  if (!['image/jpeg', 'image/png', 'image/webp', 'image/avif'].includes(file.type)) {
    showNotification('Formato no permitido. Usa JPG, PNG, WebP o AVIF.');
    return;
  }
  if (file.size > 5 * 1024 * 1024) {
    showNotification('La imagen no debe superar 5 MB.');
    return;
  }

  try {
    uploadingSucursalImage.value = true;
    const token = localStorage.getItem('cetin_jwt_token');
    const signedResponse = await fetch(`${API_CONFIG.contentBaseUrl}${API_CONFIG.endpoints.media.createUploadUrl}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ branchId: editingSucursal.value, fileName: file.name, contentType: file.type }),
    });
    if (!signedResponse.ok) throw new Error('No se pudo autorizar la carga');
    const { uploadUrl, publicUrl, key } = await signedResponse.json();
    const uploadResponse = await fetch(uploadUrl, { method: 'PUT', headers: { 'Content-Type': file.type }, body: file });
    if (!uploadResponse.ok) throw new Error('No se pudo subir la imagen');
    sucursalForm.image = publicUrl;
    sucursalForm.imageKey = key;
    showNotification('Portada cargada. Guarda los cambios para aplicarla.');
  } catch (error) {
    console.error(error);
    showNotification('No fue posible cargar la portada');
  } finally {
    uploadingSucursalImage.value = false;
    if (event.target instanceof HTMLInputElement) event.target.value = '';
  }
};

const saveSucursalEdit = async () => {
  if (editingSucursal.value) {
    const previousKey = originalSucursalImageKey.value;
    const updated = content.value.sucursales.map(s => 
      s.id === editingSucursal.value ? { ...s, ...sucursalForm } : s
    );
    updateSucursales(updated);
    if (previousKey && previousKey !== sucursalForm.imageKey) {
      try { await removeMediaObject(previousKey); } catch (error) { console.error(error); }
    }
    editingSucursal.value = null;
    showNotification('Sucursal actualizada');
  }
};

const cancelEditSucursal = async () => {
  if (sucursalForm.imageKey && sucursalForm.imageKey !== originalSucursalImageKey.value) {
    try { await removeMediaObject(sucursalForm.imageKey); } catch (error) { console.error(error); }
  }
  editingSucursal.value = null;
};

const handleAddSucursal = () => {
  const newId = `sucursal-${Date.now()}`;
  addSucursal({
    id: newId,
    name: 'Nueva Sucursal',
    image: '',
    imageKey: '',
    city: 'Ciudad',
    address: 'Dirección completa',
    phone: '55 0000 0000',
    email: 'sucursal@cetin.mx',
    facebook: '',
    mapsUrl: '',
    latitude: 19.4326,
    longitude: -99.1332,
    plus: 'XXXX+XX',
    refKey: 'CDMX',
  });
  showNotification('Sucursal agregada');
};

const handleRemoveSucursal = (sucursalId: string) => {
  const sucursal = content.value.sucursales.find(item => item.id === sucursalId);
  requestConfirmation(
    'Eliminar sucursal',
    `¿Deseas eliminar “${sucursal?.name || 'esta sucursal'}”? Esta acción no se puede deshacer.`,
    async () => {
      if (sucursal?.imageKey) {
        try { await removeMediaObject(sucursal.imageKey); } catch (error) { console.error(error); }
      }
      removeSucursal(sucursalId);
      showNotification('Sucursal eliminada');
    },
  );
};

// Reset
const handleReset = () => {
  requestConfirmation(
    'Restaurar contenido',
    'Se reemplazará toda la información del gestor por los valores predeterminados. Esta acción no se puede deshacer.',
    () => {
    resetContent();
    loadFormData();
    showNotification('Contenido restaurado');
    },
    'Restaurar todo',
  );
};

const handleLogout = () => {
  logout();
  router.replace('/login');
};

interface NavigationGroup {
  label: string;
  items: Array<{ id: AdminSection; label: string; description: string }>;
}

const navigationGroups: NavigationGroup[] = [
  {
    label: 'PÁGINA PRINCIPAL',
    items: [
      { id: 'hero', label: 'Portada', description: 'Mensaje principal y llamados a la acción.' },
      { id: 'videos', label: 'Videos', description: 'Encabezado y cápsulas informativas.' },
      { id: 'stats', label: 'Estadísticas', description: 'Cifras visibles en la página.' },
    ],
  },
  {
    label: 'CONTENIDO',
    items: [
      { id: 'services', label: 'Servicios', description: 'Tamices, textos y tarjetas de servicio.' },
      { id: 'altruista', label: 'Labor altruista', description: 'Visibilidad, texto y video de la iniciativa.' },
      { id: 'proximamente', label: 'Próximamente', description: 'Anuncio de apertura y su imagen de fondo.' },
    ],
  },
  {
    label: 'INFORMACIÓN INSTITUCIONAL',
    items: [
      { id: 'sucursales', label: 'Sucursales', description: 'Datos de contacto, ubicación y portada.' },
      { id: 'contact', label: 'Contacto', description: 'Canales de atención del sitio.' },
      { id: 'footer', label: 'Pie de página', description: 'Redes sociales y aviso de copyright.' },
    ],
  },
];

const activeSection = computed(() =>
  navigationGroups.flatMap(group => group.items).find(item => item.id === activeTab.value)
  ?? navigationGroups[0].items[0],
);

const openPublicSite = () => window.open('/', '_blank', 'noopener');
</script>

<template>
  <div class="admin-page min-h-screen bg-gray-100">
    <!-- Header -->
    <header class="sticky top-0 z-40 border-b border-white/10 bg-[#0f2a5c] text-white shadow-lg">
      <div class="mx-auto flex max-w-[1440px] items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <div class="flex min-w-0 items-center gap-3">
          <img
            :src="cetinLogo"
            alt="CETIN"
            class="h-10 w-10 shrink-0 rounded-lg bg-white object-contain p-1 sm:h-11 sm:w-11"
          />
          <div class="min-w-0">
            <p class="text-[10px] font-semibold tracking-[0.16em] text-white/60">ADMINISTRACIÓN WEB</p>
            <h1 class="truncate text-lg font-bold sm:text-xl">Gestor de contenido</h1>
          </div>
        </div>
        <div class="flex shrink-0 items-center gap-2">
          <button
            type="button"
            @click="openPublicSite"
            class="hidden items-center gap-2 rounded-lg bg-white px-3 py-2 text-sm font-semibold text-[#0f2a5c] transition hover:bg-slate-100 sm:inline-flex"
          >
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 3h6m0 0v6m0-6L10 14m-2 7H5a2 2 0 01-2-2V6a2 2 0 012-2h7" /></svg>
            Ver sitio
          </button>
          <button
            type="button"
            @click="handleReset"
            class="hidden rounded-lg px-3 py-2 text-sm font-medium text-white/80 transition hover:bg-white/10 hover:text-white lg:inline-flex"
          >
            Restaurar contenido
          </button>
          <button
            type="button"
            @click="handleLogout"
            class="inline-flex items-center gap-2 rounded-lg border border-white/25 px-3 py-2 text-sm font-medium transition hover:bg-white/10"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1" />
            </svg>
            <span class="hidden sm:inline">Cerrar sesión</span>
          </button>
        </div>
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

    <div class="mx-auto max-w-[1440px] px-4 py-6 sm:px-6 lg:py-8">
      <section class="mb-6 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white px-5 py-5 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <p class="text-xs font-bold uppercase tracking-[0.14em] text-pink-600">Contenido público</p>
          <h2 class="mt-1 text-xl font-bold text-slate-900 sm:text-2xl">Edita el sitio de forma ordenada</h2>
          <p class="mt-1 text-sm text-slate-500">Selecciona una sección, realiza los ajustes y guarda únicamente ese bloque.</p>
        </div>
        <div class="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3 ring-1 ring-slate-100">
          <span class="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" /></svg>
          </span>
          <div>
            <p class="text-sm font-semibold text-slate-700">{{ saveStatus }}</p>
            <p class="text-xs text-slate-500">{{ savedAt ? `Última acción: ${savedAt}` : 'Los cambios se guardan por sección.' }}</p>
          </div>
        </div>
      </section>

      <div class="grid items-start gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
        <aside class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:sticky lg:top-24">
          <div class="border-b border-slate-100 px-5 py-4">
            <p class="text-sm font-bold text-slate-800">Secciones del sitio</p>
            <p class="mt-1 text-xs leading-5 text-slate-500">Organizadas según dónde aparecen en la página pública.</p>
          </div>
          <nav class="max-h-[calc(100vh-9rem)] overflow-y-auto p-3" aria-label="Secciones administrables">
            <div v-for="group in navigationGroups" :key="group.label" class="mb-5 last:mb-0">
              <p class="px-2 pb-2 text-[10px] font-bold tracking-[0.14em] text-slate-400">{{ group.label }}</p>
              <button
                v-for="tab in group.items"
                :key="tab.id"
                type="button"
                @click="activeTab = tab.id"
                :class="[
                  'mb-1 flex w-full items-start gap-3 rounded-xl px-3 py-3 text-left transition',
                  activeTab === tab.id ? 'bg-[#0f2a5c] text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900',
                ]"
              >
                <span :class="['mt-1 h-2 w-2 shrink-0 rounded-full', activeTab === tab.id ? 'bg-pink-400' : 'bg-slate-300']"></span>
                <span class="min-w-0">
                  <span class="block text-sm font-semibold">{{ tab.label }}</span>
                  <span :class="['mt-0.5 block text-xs leading-4', activeTab === tab.id ? 'text-white/70' : 'text-slate-400']">{{ tab.description }}</span>
                </span>
              </button>
            </div>
          </nav>
          <div class="border-t border-slate-100 p-3">
            <button type="button" @click="handleReset" class="w-full rounded-lg px-3 py-2 text-left text-xs font-semibold text-slate-500 transition hover:bg-red-50 hover:text-red-600">Restaurar contenido predeterminado</button>
          </div>
        </aside>

        <main class="min-w-0">
          <div class="mb-4 flex items-start gap-3 px-1">
            <span class="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-pink-500"></span>
            <div>
              <p class="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">Editando ahora</p>
              <h2 class="text-lg font-bold text-slate-900">{{ activeSection.label }}</h2>
              <p class="text-sm text-slate-500">{{ activeSection.description }}</p>
            </div>
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

          <p class="text-sm text-gray-500 mb-4">
            Arrastra los videos para definir el orden en que aparecerán en la página.
          </p>
          
          <div class="grid gap-4">
            <div
              v-for="(video, videoIndex) in content.videosSection.videos"
              :key="video.id"
              :draggable="editingVideo !== video.id"
              class="border rounded-xl p-6 transition-all"
              :class="[
                dragOverVideoId === video.id ? 'border-pink-500 ring-2 ring-pink-100' : 'border-gray-200 hover:border-pink-300',
                draggedVideoId === video.id ? 'opacity-40' : 'opacity-100',
                editingVideo === video.id ? '' : 'cursor-grab active:cursor-grabbing',
              ]"
              @dragstart="handleVideoDragStart($event, video.id)"
              @dragover.prevent="handleVideoDragOver(video.id)"
              @drop.prevent="handleVideoDrop(video.id)"
              @dragend="handleVideoDragEnd"
            >
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
                <div class="flex items-start gap-4 min-w-0">
                  <div class="flex flex-col items-center gap-1 text-gray-400 shrink-0" title="Arrastrar para ordenar">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9h8M8 15h8" />
                    </svg>
                    <span class="text-xs font-semibold">{{ videoIndex + 1 }}</span>
                  </div>
                  <div class="min-w-0">
                    <h3 class="font-semibold text-gray-800">{{ video.title }}</h3>
                    <p class="text-gray-500 text-sm mt-1">{{ video.description }}</p>
                    <p class="text-gray-400 text-xs mt-2 font-mono break-all">{{ video.youtubeUrl }}</p>
                  </div>
                </div>
                <div class="flex gap-1 sm:gap-2 shrink-0 ml-3">
                  <button
                    @click="moveVideo(video.id, -1)"
                    :disabled="videoIndex === 0"
                    class="p-2 text-gray-400 hover:text-pink-500 hover:bg-pink-50 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    aria-label="Mover video hacia arriba"
                    title="Mover arriba"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" /></svg>
                  </button>
                  <button
                    @click="moveVideo(video.id, 1)"
                    :disabled="videoIndex === content.videosSection.videos.length - 1"
                    class="p-2 text-gray-400 hover:text-pink-500 hover:bg-pink-50 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    aria-label="Mover video hacia abajo"
                    title="Mover abajo"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
                  </button>
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
          <div class="flex flex-col gap-4 rounded-xl border border-gray-200 bg-gray-50 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p class="font-semibold text-gray-800">Visibilidad de la sección</p>
              <p class="mt-1 text-sm text-gray-500">Puedes ocultarla de la página pública sin perder el texto ni el video configurados.</p>
            </div>
            <label class="flex cursor-pointer items-center gap-3">
              <input v-model="altruistaForm.active" type="checkbox" class="peer sr-only" />
              <span class="relative h-7 w-12 rounded-full bg-gray-300 transition-colors after:absolute after:left-1 after:top-1 after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow-sm after:transition-transform peer-checked:bg-green-500 peer-checked:after:translate-x-5"></span>
              <span class="min-w-16 text-sm font-semibold" :class="altruistaForm.active ? 'text-green-700' : 'text-gray-500'">
                {{ altruistaForm.active ? 'Visible' : 'Oculta' }}
              </span>
            </label>
          </div>
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
          <div class="flex flex-col gap-4 rounded-xl border border-gray-200 bg-gray-50 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p class="font-semibold text-gray-800">Visibilidad de la sección</p>
              <p class="mt-1 text-sm text-gray-500">Al desactivarla, la sección se oculta de la página pública sin borrar su información.</p>
            </div>
            <label class="flex cursor-pointer items-center gap-3">
              <input v-model="proximamenteForm.active" type="checkbox" class="peer sr-only" />
              <span class="relative h-7 w-12 rounded-full bg-gray-300 transition-colors after:absolute after:left-1 after:top-1 after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow-sm after:transition-transform peer-checked:bg-green-500 peer-checked:after:translate-x-5"></span>
              <span class="min-w-16 text-sm font-semibold" :class="proximamenteForm.active ? 'text-green-700' : 'text-gray-500'">
                {{ proximamenteForm.active ? 'Activa' : 'Inactiva' }}
              </span>
            </label>
          </div>

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
            <label class="block text-sm font-medium text-gray-700 mb-2">Imagen de fondo</label>
            <div class="relative">
              <label
                class="group relative flex min-h-64 w-full cursor-pointer overflow-hidden rounded-2xl border-2 border-dashed transition-all duration-200"
                :class="isDraggingProximamenteImage ? 'border-pink-500 bg-pink-50 ring-4 ring-pink-100' : 'border-slate-300 bg-slate-50 hover:border-pink-400'"
                @dragenter.prevent="isDraggingProximamenteImage = true"
                @dragover.prevent="isDraggingProximamenteImage = true"
                @dragleave.prevent="isDraggingProximamenteImage = false"
                @drop.prevent="uploadProximamenteImage"
              >
                <input type="file" accept="image/jpeg,image/png,image/webp,image/avif" class="sr-only" :disabled="uploadingProximamenteImage" @change="uploadProximamenteImage" />
                <img v-if="proximamenteForm.backgroundImage" :src="proximamenteForm.backgroundImage" alt="Vista previa de la sección Próximamente" class="absolute inset-0 h-full w-full object-cover" />
                <div v-if="proximamenteForm.backgroundImage" class="absolute inset-0 bg-slate-950/45 transition group-hover:bg-slate-950/55"></div>
                <div class="relative z-10 m-auto flex flex-col items-center px-6 py-8 text-center" :class="proximamenteForm.backgroundImage ? 'text-white' : 'text-slate-600'">
                  <div class="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white/95 text-pink-500 shadow-md">
                    <svg v-if="!uploadingProximamenteImage" class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.6-4.6a2 2 0 012.8 0L16 16m-2-2l1.6-1.6a2 2 0 012.8 0L20 14M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    <svg v-else class="h-6 w-6 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden="true"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" /><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" /></svg>
                  </div>
                  <p class="font-semibold">{{ uploadingProximamenteImage ? 'Subiendo imagen…' : proximamenteForm.backgroundImage ? 'Cambiar imagen de fondo' : 'Arrastra una imagen aquí' }}</p>
                  <p class="mt-1 text-xs" :class="proximamenteForm.backgroundImage ? 'text-white/80' : 'text-slate-500'">Haz clic para seleccionar · JPG, PNG, WebP o AVIF</p>
                  <span class="mt-3 rounded-full bg-white/90 px-3 py-1 text-[11px] font-medium text-slate-600">1920 × 1080 px recomendado · máx. 5 MB</span>
                </div>
              </label>
              <button v-if="proximamenteForm.backgroundImageKey" type="button" class="absolute right-3 top-3 z-20 rounded-full bg-white/95 px-3 py-2 text-xs font-semibold text-red-600 shadow-lg hover:bg-red-50" @click="proximamenteForm.backgroundImage = ''; proximamenteForm.backgroundImageKey = ''">Eliminar</button>
            </div>
            <p class="mt-2 text-xs text-slate-500">Mantén el punto de interés al centro; la imagen se adapta y puede recortarse en pantallas estrechas.</p>
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
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Imagen de portada</label>
                <div class="relative">
                  <label
                    class="group relative flex min-h-52 w-full cursor-pointer overflow-hidden rounded-2xl border-2 border-dashed transition-all duration-200"
                    :class="isDraggingSucursalImage ? 'border-pink-500 bg-pink-50 ring-4 ring-pink-100' : 'border-slate-300 bg-slate-50 hover:border-pink-400 hover:bg-pink-50/40'"
                    @dragenter.prevent="isDraggingSucursalImage = true"
                    @dragover.prevent="isDraggingSucursalImage = true"
                    @dragleave.prevent="isDraggingSucursalImage = false"
                    @drop.prevent="uploadSucursalCover"
                  >
                    <input type="file" accept="image/jpeg,image/png,image/webp,image/avif" class="sr-only" :disabled="uploadingSucursalImage" @change="uploadSucursalCover" />

                    <img v-if="sucursalForm.image" :src="sucursalForm.image" alt="Vista previa de la portada" class="absolute inset-0 h-full w-full object-cover" />
                    <div v-if="sucursalForm.image" class="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/10 to-transparent transition group-hover:from-slate-950/85"></div>

                    <div class="relative z-10 m-auto flex flex-col items-center px-6 py-8 text-center" :class="sucursalForm.image ? 'mt-auto text-white' : 'text-slate-600'">
                      <div class="mb-3 flex h-12 w-12 items-center justify-center rounded-full shadow-sm" :class="sucursalForm.image ? 'bg-white/20 backdrop-blur-sm' : 'bg-white text-pink-500 ring-1 ring-slate-200'">
                        <svg v-if="!uploadingSucursalImage" class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.6-4.6a2 2 0 012.8 0L16 16m-2-2l1.6-1.6a2 2 0 012.8 0L20 14m-6-6h.01M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <svg v-else class="h-6 w-6 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                        </svg>
                      </div>
                      <p class="font-semibold">{{ uploadingSucursalImage ? 'Subiendo portada…' : sucursalForm.image ? 'Cambiar imagen' : 'Arrastra una imagen aquí' }}</p>
                      <p class="mt-1 text-xs" :class="sucursalForm.image ? 'text-white/80' : 'text-slate-500'">{{ sucursalForm.image ? 'Haz clic o suelta otra imagen para reemplazarla' : 'o haz clic para seleccionar un archivo' }}</p>
                      <div class="mt-3 flex flex-wrap justify-center gap-2">
                        <span class="rounded-full px-3 py-1 text-[11px] font-medium" :class="sucursalForm.image ? 'bg-white/15 text-white' : 'bg-white text-slate-500 ring-1 ring-slate-200'">1600 × 1200 px · proporción 4:3</span>
                        <span class="rounded-full px-3 py-1 text-[11px] font-medium" :class="sucursalForm.image ? 'bg-white/15 text-white' : 'bg-white text-slate-500 ring-1 ring-slate-200'">JPG, PNG, WebP o AVIF · máx. 5 MB</span>
                      </div>
                    </div>
                  </label>
                  <button v-if="sucursalForm.imageKey" type="button" class="absolute right-3 top-3 z-20 rounded-full bg-white/95 px-3 py-2 text-xs font-semibold text-red-600 shadow-lg transition hover:bg-red-50" @click="sucursalForm.image = ''; sucursalForm.imageKey = ''">Eliminar</button>
                </div>
                <p class="mt-2 flex items-center gap-1.5 text-xs text-slate-500">
                  <span class="h-1.5 w-1.5 rounded-full bg-green-500"></span>
                  La portada se almacena de forma segura en S3 al seleccionarla.
                </p>
                <p class="mt-1 text-xs text-slate-500">Mantén la fachada o elemento principal en el centro y evita incluir texto en la imagen, ya que los bordes pueden recortarse según el tamaño de pantalla.</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Dirección completa</label>
                <textarea v-model="sucursalForm.address" rows="2" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"></textarea>
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
                <label class="block text-sm font-medium text-gray-700 mb-2">Enlace de Google Maps</label>
                <input v-model="sucursalForm.mapsUrl" type="url" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent" placeholder="https://www.google.com/maps/..." />
              </div>
              <div class="grid md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Latitud</label>
                  <input v-model.number="sucursalForm.latitude" type="number" step="any" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Longitud</label>
                  <input v-model.number="sucursalForm.longitude" type="number" step="any" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent" />
                </div>
              </div>
              <div class="grid md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Correo electrónico</label>
                  <input v-model="sucursalForm.email" type="email" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent" placeholder="sucursal@cetin.mx" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Facebook</label>
                  <input v-model="sucursalForm.facebook" type="url" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent" placeholder="https://facebook.com/..." />
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
            <div v-else class="grid gap-5 lg:grid-cols-[160px_minmax(0,1fr)_auto]">
              <div class="h-32 overflow-hidden rounded-xl bg-gradient-to-br from-slate-100 to-slate-200">
                <img v-if="sucursal.image" :src="sucursal.image" :alt="`Portada de ${sucursal.name}`" class="h-full w-full object-cover" />
                <div v-else class="flex h-full items-center justify-center px-4 text-center text-xs font-medium text-slate-500">Portada predeterminada</div>
              </div>
              <div class="min-w-0">
                <div class="flex flex-wrap items-center gap-2">
                  <h3 class="text-lg font-semibold text-gray-800">{{ sucursal.name }}</h3>
                  <span class="rounded-full bg-pink-50 px-2.5 py-1 text-xs font-medium text-pink-600">{{ sucursal.city || 'Ciudad pendiente' }}</span>
                </div>
                <p class="mt-2 text-sm leading-6 text-gray-600">{{ sucursal.address || 'Dirección pendiente' }}</p>
                <div class="mt-4 grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2 xl:grid-cols-3">
                  <p><span class="font-medium text-gray-500">Teléfono:</span> <span class="text-gray-800">{{ sucursal.phone || 'Pendiente' }}</span></p>
                  <p class="truncate"><span class="font-medium text-gray-500">Correo:</span> <span class="text-gray-800">{{ sucursal.email || 'Pendiente' }}</span></p>
                  <p><span class="font-medium text-gray-500">Facebook:</span> <span class="text-gray-800">{{ sucursal.facebook ? 'Configurado' : 'Pendiente' }}</span></p>
                  <p><span class="font-medium text-gray-500">Google Maps:</span> <span class="text-gray-800">{{ sucursal.mapsUrl ? 'Configurado' : 'Pendiente' }}</span></p>
                  <p><span class="font-medium text-gray-500">Coordenadas:</span> <span class="text-gray-800">{{ sucursal.latitude }}, {{ sucursal.longitude }}</span></p>
                  <p><span class="font-medium text-gray-500">Plus Code:</span> <span class="text-gray-800">{{ sucursal.plus || 'Pendiente' }}</span></p>
                </div>
              </div>
              <div class="flex shrink-0 self-start items-start gap-2 lg:justify-self-end">
                <button @click="startEditSucursal(sucursal.id)" class="inline-flex h-10 w-10 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-pink-50 hover:text-pink-500" aria-label="Editar sucursal">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button @click="handleRemoveSucursal(sucursal.id)" class="inline-flex h-10 w-10 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500" aria-label="Eliminar sucursal">
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
        </main>
      </div>
    </div>

    <Teleport to="body">
      <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="confirmation.open"
          class="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm"
          role="presentation"
          @click.self="closeConfirmation"
        >
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="confirmation-title"
            aria-describedby="confirmation-description"
            class="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/5"
          >
            <div class="p-6 sm:p-7">
              <div class="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600 ring-8 ring-red-50/60">
                <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                </svg>
              </div>
              <h2 id="confirmation-title" class="text-xl font-bold text-slate-900">{{ confirmation.title }}</h2>
              <p id="confirmation-description" class="mt-2 text-sm leading-6 text-slate-600">{{ confirmation.message }}</p>
            </div>
            <div class="flex flex-col-reverse gap-3 border-t border-slate-100 bg-slate-50 px-6 py-4 sm:flex-row sm:justify-end">
              <button
                type="button"
                class="rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
                @click="closeConfirmation"
              >
                Cancelar
              </button>
              <button
                type="button"
                class="rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                @click="confirmAction"
              >
                {{ confirmation.confirmLabel }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.admin-page {
	font-family: 'Satoshi', system-ui, sans-serif;
	letter-spacing: -0.01em;
}

.admin-page h1,
.admin-page h2,
.admin-page h3 {
	font-family: 'General Sans', 'Satoshi', system-ui, sans-serif;
	letter-spacing: -0.03em;
}

.admin-page button,
.admin-page input,
.admin-page textarea,
.admin-page select {
	font-family: inherit;
}

.admin-page .font-mono {
	font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
	letter-spacing: 0;
}

.admin-page input:not([type='checkbox']),
.admin-page textarea,
.admin-page select {
	background-color: #ffffff;
	color: #1f2937;
	color-scheme: light;
}

.admin-page input:not([type='checkbox']):-webkit-autofill,
.admin-page input:not([type='checkbox']):-webkit-autofill:hover,
.admin-page input:not([type='checkbox']):-webkit-autofill:focus,
.admin-page textarea:-webkit-autofill,
.admin-page select:-webkit-autofill {
	-webkit-text-fill-color: #1f2937;
	-webkit-box-shadow: 0 0 0 1000px #ffffff inset;
	box-shadow: 0 0 0 1000px #ffffff inset;
	caret-color: #1f2937;
	transition: background-color 9999s ease-out 0s;
}
</style>
