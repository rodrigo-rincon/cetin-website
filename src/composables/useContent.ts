import { ref, readonly } from 'vue';
import { defaultContent, type SiteContent } from '../data/content';
import { API_CONFIG } from '../config/api';

const STORAGE_KEY = 'cetin_site_content';
const JWT_TOKEN_KEY = 'cetin_jwt_token';

// Estado global reactivo
const content = ref<SiteContent>(loadContent());
let isSyncing = false;

function loadContent(): SiteContent {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Merge con defaultContent para asegurar que tenemos todas las propiedades
      return deepMerge(defaultContent, parsed);
    }
  } catch (error) {
    console.error('Error loading content from localStorage:', error);
  }
  return { ...defaultContent };
}

function deepMerge<T extends Record<string, any>>(target: T, source: Partial<T>): T {
  const result = { ...target };
  for (const key in source) {
    if (source[key] !== undefined) {
      if (
        typeof source[key] === 'object' &&
        source[key] !== null &&
        !Array.isArray(source[key])
      ) {
        result[key] = deepMerge(target[key], source[key] as any);
      } else {
        result[key] = source[key] as any;
      }
    }
  }
  return result;
}

// Sincronización con backend
async function syncSectionToBackend(section: keyof SiteContent, data: any): Promise<void> {
  const token = localStorage.getItem(JWT_TOKEN_KEY);
  if (!token) {
    console.warn('No JWT token available for backend sync');
    return;
  }

  try {
    isSyncing = true;
    const endpoint = API_CONFIG.endpoints.content.updateSection(String(section));
    const response = await fetch(`${API_CONFIG.baseUrl}${endpoint}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      console.error(`Failed to sync ${String(section)} to backend:`, response.statusText);
    } else {
      console.log(`✓ Synced ${String(section)} to backend`);
    }
  } catch (error) {
    console.error(`Error syncing ${String(section)} to backend:`, error);
  } finally {
    isSyncing = false;
  }
}

// Cargar contenido del backend (opcional, para administradores)
async function loadFromBackend(): Promise<void> {
  try {
    const endpoint = API_CONFIG.endpoints.content.getAll;
    const response = await fetch(`${API_CONFIG.baseUrl}${endpoint}`);
    if (response.ok) {
      const backendContent = await response.json();
      const merged = deepMerge(defaultContent, backendContent);
      content.value = merged;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
      console.log('✓ Content loaded from backend');
    }
  } catch (error) {
    console.error('Error loading from backend:', error);
  }
}

function saveContent(newContent: SiteContent): void {
  try {
    // Siempre guardar en localStorage primero (offline-first)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newContent));
    content.value = newContent;
    
    // Intentar sincronizar todas las secciones con el backend
    if (localStorage.getItem(JWT_TOKEN_KEY)) {
      Object.entries(newContent).forEach(([section, data]) => {
        syncSectionToBackend(section as keyof SiteContent, data);
      });
    }
  } catch (error) {
    console.error('Error saving content:', error);
  }
}

function resetContent(): void {
  localStorage.removeItem(STORAGE_KEY);
  content.value = { ...defaultContent };
}

function updateSection<K extends keyof SiteContent>(
  section: K,
  data: Partial<SiteContent[K]>
): void {
  const newContent = {
    ...content.value,
    [section]: {
      ...content.value[section],
      ...data,
    },
  };
  saveContent(newContent);
}

function updateHero(data: Partial<SiteContent['hero']>): void {
  updateSection('hero', data);
}

function updateInfoSection(data: Partial<SiteContent['infoSection']>): void {
  updateSection('infoSection', data);
}

function updateContact(data: Partial<SiteContent['contact']>): void {
  updateSection('contact', data);
}

function updateFooter(data: Partial<SiteContent['footer']>): void {
  updateSection('footer', data);
}

function updateSucursales(sucursales: SiteContent['sucursales']): void {
  const newContent = {
    ...content.value,
    sucursales,
  };
  saveContent(newContent);
}

function addSucursal(sucursal: SiteContent['sucursales'][0]): void {
  const newContent = {
    ...content.value,
    sucursales: [...content.value.sucursales, sucursal],
  };
  saveContent(newContent);
}

function removeSucursal(id: string): void {
  const newContent = {
    ...content.value,
    sucursales: content.value.sucursales.filter((s) => s.id !== id),
  };
  saveContent(newContent);
}

function updateService(
  serviceId: string,
  data: Partial<SiteContent['infoSection']['services'][0]>
): void {
  const newServices = content.value.infoSection.services.map((service) =>
    service.id === serviceId ? { ...service, ...data } : service
  );
  updateInfoSection({ services: newServices });
}

function addService(service: SiteContent['infoSection']['services'][0]): void {
  const newServices = [...content.value.infoSection.services, service];
  updateInfoSection({ services: newServices });
}

function removeService(serviceId: string): void {
  const newServices = content.value.infoSection.services.filter(
    (s) => s.id !== serviceId
  );
  updateInfoSection({ services: newServices });
}

// Videos Section
function updateVideosSection(data: Partial<SiteContent['videosSection']>): void {
  updateSection('videosSection', data);
}

function updateVideo(
  videoId: string,
  data: Partial<SiteContent['videosSection']['videos'][0]>
): void {
  const newVideos = content.value.videosSection.videos.map((video) =>
    video.id === videoId ? { ...video, ...data } : video
  );
  updateVideosSection({ videos: newVideos });
}

function addVideo(video: SiteContent['videosSection']['videos'][0]): void {
  const newVideos = [...content.value.videosSection.videos, video];
  updateVideosSection({ videos: newVideos });
}

function removeVideo(videoId: string): void {
  const newVideos = content.value.videosSection.videos.filter(
    (v) => v.id !== videoId
  );
  updateVideosSection({ videos: newVideos });
}

// Stats
function updateStats(data: Partial<SiteContent['stats']>): void {
  updateSection('stats', data);
}

// Labor Altruista
function updateLaborAltruista(data: Partial<SiteContent['laborAltruista']>): void {
  updateSection('laborAltruista', data);
}

// Próximamente
function updateProximamente(data: Partial<SiteContent['proximamente']>): void {
  updateSection('proximamente', data);
}

export function useContent() {
  return {
    content: readonly(content),
    saveContent,
    resetContent,
    updateHero,
    updateInfoSection,
    updateContact,
    updateFooter,
    updateSucursales,
    addSucursal,
    removeSucursal,
    updateService,
    addService,
    removeService,
    updateVideosSection,
    updateVideo,
    addVideo,
    removeVideo,
    updateStats,
    updateLaborAltruista,
    updateProximamente,
    // Nuevas funciones para backend
    setJWTToken: (token: string) => localStorage.setItem(JWT_TOKEN_KEY, token),
    getJWTToken: () => localStorage.getItem(JWT_TOKEN_KEY),
    clearJWTToken: () => localStorage.removeItem(JWT_TOKEN_KEY),
    loadFromBackend,
    isSyncing: readonly(ref(isSyncing)),
  };
}

// Para uso directo del contenido sin funciones de edición
export function useReadonlyContent() {
  return {
    content: readonly(content),
  };
}
