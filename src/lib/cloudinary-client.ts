const EXTENSIONES_PERMITIDAS = new Set(["jpg", "jpeg", "png", "webp", "gif"]);
const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

/**
 * Sube el archivo directo del navegador a Cloudinary (upload preset
 * "unsigned"), sin pasar por una server action. Antes el archivo viajaba
 * navegador -> función serverless de Vercel -> Cloudinary; ese doble salto
 * lo hacía bastante más lento, sobre todo en conexiones de celular.
 */
export async function subirImagenDirecto(
  file: File,
  preset: string,
): Promise<{ path?: string; error?: string }> {
  if (file.size === 0) {
    return { error: "No se seleccionó ningún archivo" };
  }

  const extension = file.name.split(".").pop()?.toLowerCase() ?? "";
  if (!EXTENSIONES_PERMITIDAS.has(extension)) {
    return { error: "Formato no permitido. Usá JPG, PNG, WEBP o GIF." };
  }
  if (file.size > 5 * 1024 * 1024) {
    return { error: "La imagen no puede superar los 5MB." };
  }

  const formData = new FormData();
  formData.set("file", file);
  formData.set("upload_preset", preset);

  try {
    const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    if (!res.ok) {
      return { error: data?.error?.message ?? "No se pudo subir la imagen." };
    }
    return { path: data.secure_url as string };
  } catch {
    return { error: "No se pudo subir la imagen. Revisá tu conexión y probá de nuevo." };
  }
}
