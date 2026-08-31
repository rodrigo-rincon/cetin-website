// Contenido editable del sitio web CETIN
export interface HeroContent {
  badge: string;
  title: string;
  titleHighlight: string;
  subtitle: string;
  ctaPrimary: string;
  ctaSecondary: string;
}

// Videos Section
export interface VideoItem {
  id: string;
  title: string;
  description: string;
  youtubeUrl: string;
}

export interface VideosSectionContent {
  title: string;
  subtitle: string;
  videos: VideoItem[];
}

// Stats/Statistics
export interface StatsContent {
  bebesAtendidos: string;
  bebesAtendidosLabel: string;
  citasAgendadas: string;
  citasAgendadasLabel: string;
  tamicesEspecializados: string;
  tamicesEspecializadosLabel: string;
  confiabilidad: string;
  confiabilidadLabel: string;
}

export interface ServiceItem {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
}

export interface InfoSectionContent {
  badge: string;
  title: string;
  titleHighlight: string;
  description: string;
  services: ServiceItem[];
}

// Labor Altruista
export interface LaborAltruistaContent {
  badge: string;
  title: string;
  titleHighlight: string;
  description1: string;
  description2: string;
  videoUrl: string;
  videoCaption: string;
}

// Sucursales Próximamente
export interface ProximamentContent {
  badge: string;
  title: string;
  titleHighlight: string;
  subtitle: string;
  backgroundImage: string;
}

export interface Sucursal {
  id: string;
  name: string;
  city: string;
  phone: string;
  plus: string;
  refKey: 'CDMX' | 'SAN_ANDRES_CHOLULA' | 'CUAUTITLAN_IZCALLI' | 'EMILIANO_ZAPATA';
}

export interface ContactContent {
  title: string;
  subtitle: string;
  email: string;
  whatsapp: string;
}

export interface FooterContent {
  copyright: string;
  socialLinks: {
    facebook?: string;
    instagram?: string;
    whatsapp?: string;
  };
}

export interface SiteContent {
  hero: HeroContent;
  videosSection: VideosSectionContent;
  stats: StatsContent;
  infoSection: InfoSectionContent;
  laborAltruista: LaborAltruistaContent;
  proximamente: ProximamentContent;
  sucursales: Sucursal[];
  contact: ContactContent;
  footer: FooterContent;
}

export const defaultContent: SiteContent = {
  hero: {
    badge: 'Centro de Tamizaje Infantil',
    title: 'Cuidamos la salud de',
    titleHighlight: 'tu bebé',
    subtitle: 'Primer centro especializado en los 5 tamices del recién nacido. Resultados confiables avalados por subespecialistas.',
    ctaPrimary: 'Agendar Cita',
    ctaSecondary: 'Ver Servicios',
  },
  videosSection: {
    title: 'Realizar los tamices es el primer paso para el cuidado de tu bebé',
    subtitle: 'En CETIN, nos aseguramos de que tu pequeño esté siempre sano y feliz.',
    videos: [
      {
        id: 'video-1',
        title: 'CETIN en la comunidad - Oriental',
        description: 'Llevando salud y bienestar a las comunidades que más lo necesitan.',
        youtubeUrl: 'https://www.youtube.com/embed/3DTLMranvUk',
      },
      {
        id: 'video-2',
        title: 'Conoce nuestros servicios',
        description: 'Cada tamiz es una oportunidad para detectar a tiempo y cuidar mejor.',
        youtubeUrl: 'https://www.youtube.com/embed/3DTLMranvUk',
      },
      {
        id: 'video-3',
        title: 'Instalaciones CETIN',
        description: 'Un espacio pensado para la comodidad de tu bebé y tu tranquilidad.',
        youtubeUrl: 'https://www.youtube.com/embed/3DTLMranvUk',
      },
      {
        id: 'video-4',
        title: 'Testimonios de padres',
        description: 'La confianza de las familias es nuestro mayor reconocimiento.',
        youtubeUrl: 'https://www.youtube.com/embed/3DTLMranvUk',
      },
    ],
  },
  stats: {
    bebesAtendidos: '+10,000',
    bebesAtendidosLabel: 'Bebés atendidos',
    citasAgendadas: '+10,000',
    citasAgendadasLabel: 'Citas agendadas',
    tamicesEspecializados: '5',
    tamicesEspecializadosLabel: 'Tamices especializados',
    confiabilidad: '100%',
    confiabilidadLabel: 'Confiabilidad',
  },
  infoSection: {
    badge: 'Nuestros Servicios',
    title: 'Los 5 tamices esenciales para tu',
    titleHighlight: 'recién nacido',
    description: 'CETIN es un espacio especializado, diseñado para la realización de los cinco tamices del recién nacido, bajo los más altos estándares de calidad. Nuestro trabajo se distingue por el amor, la capacitación continua, la constancia y el profesionalismo que caracterizan a cada integrante del equipo. Contamos con el respaldo y la validación de médicos pediatras subespecialistas en cada área del tamiz, quienes avalan e interpretan nuestros resultados.',
    services: [
      {
        id: 'metabolico',
        name: 'Tamiz Metabólico',
        description: 'Detecta más de 80 enfermedades metabólicas hereditarias mediante el análisis de una pequeña muestra de sangre del talón.',
        icon: 'Meta.png',
        color: 'pink',
      },
      {
        id: 'auditivo',
        name: 'Tamiz Auditivo',
        description: 'Evaluación de la audición del recién nacido mediante emisiones otoacústicas y potenciales evocados.',
        icon: 'Auditivo.png',
        color: 'yellow',
      },
      {
        id: 'cardiaco',
        name: 'Tamiz Cardíaco',
        description: 'Detección temprana de cardiopatías congénitas críticas mediante oximetría de pulso.',
        icon: 'Cardio.png',
        color: 'coral',
      },
      {
        id: 'visual',
        name: 'Tamiz Visual',
        description: 'Exploración oftalmológica para detectar alteraciones visuales congénitas como cataratas o glaucoma.',
        icon: 'Visual.png',
        color: 'turquoise',
      },
      {
        id: 'cadera',
        name: 'Tamiz de Cadera',
        description: 'Evaluación de displasia del desarrollo de la cadera para prevenir problemas de movilidad.',
        icon: 'Cadera.png',
        color: 'lime',
      },
    ],
  },
  laborAltruista: {
    badge: 'Labor Altruista',
    title: 'Nos llena de felicidad ir',
    titleHighlight: 'más allá',
    description1: 'Realizamos jornadas gratuitas de salud llevando consulta pediátrica y tamices sin costo a comunidades que no cuentan con este tipo de apoyo.',
    description2: 'Cada acción nace del compromiso, la empatía y el amor por ayudar, con un solo propósito: cuidar a quienes más lo necesitan.',
    videoUrl: 'https://www.youtube.com/embed/3DTLMranvUk',
    videoCaption: 'Aún no sabemos cuál será nuestro próximo destino, pero tenemos la certeza de que ahí estaremos, listos para ayudar.',
  },
  proximamente: {
    badge: 'Próximamente',
    title: 'Crecemos para estar cada vez más',
    titleHighlight: 'cerca de ti',
    subtitle: 'Una nueva sucursal está por llegar.',
    backgroundImage: '/src/assets/images/cetin_ciudad_de_mexico.jpg',
  },
  sucursales: [
    {
      id: 'puebla',
      name: 'CETIN Puebla',
      city: 'San Andrés Cholula, Puebla',
      phone: '221 191 1419',
      plus: '2QH8+43',
      refKey: 'SAN_ANDRES_CHOLULA',
    },
    {
      id: 'roma-sur',
      name: 'CETIN Roma Sur',
      city: 'Ciudad de México',
      phone: '55 3459 9088',
      plus: 'CR4M+G3',
      refKey: 'CDMX',
    },
    {
      id: 'lindavista',
      name: 'CETIN Lindavista',
      city: 'Ciudad de México',
      phone: '55 3459 9088',
      plus: 'FVRF+72',
      refKey: 'CDMX',
    },
    {
      id: 'los-reyes',
      name: 'CETIN Los Reyes',
      city: 'Emiliano Zapata, Edo. de México',
      phone: '55 1833 4557',
      plus: '923C+XF',
      refKey: 'EMILIANO_ZAPATA',
    },
    {
      id: 'cuautitlan',
      name: 'CETIN Cuautitlán',
      city: 'Cuautitlán Izcalli, Edo. de México',
      phone: '55 7223 2421',
      plus: 'MQ3R+PQ',
      refKey: 'CUAUTITLAN_IZCALLI',
    },
  ],
  contact: {
    title: 'Contáctanos',
    subtitle: 'Estamos para ayudarte en el cuidado de tu bebé',
    email: 'contacto@cetin.mx',
    whatsapp: '5534599088',
  },
  footer: {
    copyright: '© 2024 CETIN - Centro de Tamizaje Infantil. Todos los derechos reservados.',
    socialLinks: {
      facebook: 'https://facebook.com/cetinmx',
      instagram: 'https://instagram.com/cetinmx',
      whatsapp: 'https://wa.me/5534599088',
    },
  },
};
