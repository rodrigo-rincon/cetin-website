# CETIN Website

Sitio web público del Centro de Tamizaje Infantil (CETIN). Presenta los servicios de tamizaje neonatal, información institucional, testimonios, sucursales y medios de contacto.

## Funcionalidad

- Página de inicio responsive con modo claro y oscuro.
- Catálogo de tamices y contenido institucional.
- Videos informativos con carga diferida.
- Testimonios y estadísticas.
- Directorio y mapa interactivo de sucursales.
- Formulario de solicitud de cita por WhatsApp.
- Panel administrativo para actualizar el contenido público.

## Solicitudes por WhatsApp

Los botones **Agendar cita** abren un formulario público compacto con nombre de contacto, paciente opcional, sucursal y servicio. La fecha y el horario se coordinan con el equipo por WhatsApp.

El formulario no almacena información ni realiza llamadas al backend. Genera un mensaje prellenado y abre WhatsApp usando `contact.whatsapp`, configurado en `src/data/content.ts` y modificable desde el administrador de contenido.

Al continuar, el formulario se oculta y muestra un aviso para completar el envío en WhatsApp. El contenedor se cierra automáticamente después de 8 segundos; el sitio no puede verificar si el usuario envió el mensaje.

La solicitud no representa una cita confirmada; la disponibilidad debe validarse directamente con el personal de CETIN.

## Tecnologías

- Vue 3 y TypeScript.
- Vite.
- Vue Router.
- Tailwind CSS.
- MapLibre GL.
- VeeValidate y Yup.

## Instalación

```bash
npm install
```

## Desarrollo

```bash
npm run dev
```

## Compilación

```bash
npm run build
```

El contenido inicial se define en `src/data/content.ts`. No se deben incluir datos clínicos, credenciales ni información sensible dentro del repositorio.
