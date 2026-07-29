/**
 * URLs de Cloudinary para los assets estáticos del sitio (logo, banners,
 * videos del hero, camisetas de la pantalla de carga, placeholder de
 * producto). Se subieron una sola vez con scripts/migrar-assets-cloudinary.ts
 * — si hay que reemplazar alguno, subí el archivo nuevo a Cloudinary con el
 * mismo public_id (overwrite) o actualizá la URL acá.
 */

export const LOGO_URL = "https://res.cloudinary.com/g22yoyre/image/upload/v1785278084/brand/logo.png";

export const BANNER_MOBILE_URL =
  "https://res.cloudinary.com/g22yoyre/image/upload/v1785278085/banners/no-encontras-tu-camiseta.png";
export const BANNER_DESKTOP_URL =
  "https://res.cloudinary.com/g22yoyre/image/upload/v1785278086/banners/no-encontras-tu-camiseta-desktop.png";

export const HERO_VIDEO_DESKTOP_URL =
  "https://res.cloudinary.com/g22yoyre/video/upload/v1785278095/hero/hero-desktop.mp4";
// c_crop recorta las barras negras que el archivo fuente trae incrustadas
// en los píxeles (el video real es vertical 608x1080, pero está exportado
// dentro de un lienzo horizontal 1920x1080 con relleno negro a los costados;
// medido con precisión de píxel contra el frame real antes de fijar estos
// valores — no es un ajuste al azar).
export const HERO_VIDEO_MOBILE_URL =
  "https://res.cloudinary.com/g22yoyre/video/upload/c_crop,w_608,h_1080,x_656,y_0/v1785278101/hero/hero-mobile.mp4";

export const PLACEHOLDER_PRODUCTO_URL =
  "https://res.cloudinary.com/g22yoyre/image/upload/v1785278103/productos/placeholder.svg";

export const CUIDADOS_DEFAULT_URL =
  "https://res.cloudinary.com/g22yoyre/image/upload/v1785278086/guias/cuidados.png";

export const LOADING_JERSEY_URLS: string[] = [
  "https://res.cloudinary.com/g22yoyre/image/upload/v1785278106/loading/jersey-01.png",
  "https://res.cloudinary.com/g22yoyre/image/upload/v1785278107/loading/jersey-02.png",
  "https://res.cloudinary.com/g22yoyre/image/upload/v1785278108/loading/jersey-03.png",
  "https://res.cloudinary.com/g22yoyre/image/upload/v1785278109/loading/jersey-04.png",
  "https://res.cloudinary.com/g22yoyre/image/upload/v1785278110/loading/jersey-05.png",
  "https://res.cloudinary.com/g22yoyre/image/upload/v1785278111/loading/jersey-06.png",
  "https://res.cloudinary.com/g22yoyre/image/upload/v1785278112/loading/jersey-07.png",
  "https://res.cloudinary.com/g22yoyre/image/upload/v1785278112/loading/jersey-08.png",
  "https://res.cloudinary.com/g22yoyre/image/upload/v1785278113/loading/jersey-09.png",
  "https://res.cloudinary.com/g22yoyre/image/upload/v1785278114/loading/jersey-10.png",
  "https://res.cloudinary.com/g22yoyre/image/upload/v1785278114/loading/jersey-11.png",
  "https://res.cloudinary.com/g22yoyre/image/upload/v1785278115/loading/jersey-12.png",
  "https://res.cloudinary.com/g22yoyre/image/upload/v1785278116/loading/jersey-13.png",
  "https://res.cloudinary.com/g22yoyre/image/upload/v1785278116/loading/jersey-14.png",
  "https://res.cloudinary.com/g22yoyre/image/upload/v1785278117/loading/jersey-15.png",
  "https://res.cloudinary.com/g22yoyre/image/upload/v1785278118/loading/jersey-16.png",
  "https://res.cloudinary.com/g22yoyre/image/upload/v1785278118/loading/jersey-17.png",
];

export const GUIA_TALLES_FAN_URL =
  "https://res.cloudinary.com/g22yoyre/image/upload/v1785278088/guias/talles-fan.png";
export const GUIA_TALLES_PLAYER_URL =
  "https://res.cloudinary.com/g22yoyre/image/upload/v1785278088/guias/talles-player.jpg";
export const GUIA_TALLES_RETRO_URL =
  "https://res.cloudinary.com/g22yoyre/image/upload/v1785278089/guias/talles-retro.jpg";
export const GUIA_TALLES_SHORTS_FAN_URL =
  "https://res.cloudinary.com/g22yoyre/image/upload/v1785278090/guias/talles-shorts-fan.png";
export const GUIA_TALLES_SHORTS_PLAYER_URL =
  "https://res.cloudinary.com/g22yoyre/image/upload/v1785278090/guias/talles-shorts-player.jpg";
