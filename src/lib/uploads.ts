import "server-only";
import { slugify } from "@/lib/slug";
import { cloudinary } from "@/lib/cloudinary";

const EXTENSIONES_PERMITIDAS = new Set(["jpg", "jpeg", "png", "webp", "svg", "gif"]);

/**
 * Sube el archivo a Cloudinary (carpeta = public_id prefix, ej.
 * "productos/uploads"). Antes escribía a disco local, pero eso no persiste
 * en un deploy serverless (Vercel) — el filesystem ahí es efímero y se
 * resetea en cada deploy.
 */
export async function guardarArchivoSubido(
  file: File,
  carpeta: string,
): Promise<{ path?: string; error?: string }> {
  if (file.size === 0) {
    return { error: "No se seleccionó ningún archivo" };
  }

  const extension = file.name.split(".").pop()?.toLowerCase() ?? "";
  if (!EXTENSIONES_PERMITIDAS.has(extension)) {
    return { error: "Formato no permitido. Usá JPG, PNG, WEBP, GIF o SVG." };
  }
  if (file.size > 5 * 1024 * 1024) {
    return { error: "La imagen no puede superar los 5MB." };
  }

  const nombreArchivo = `${slugify(file.name.replace(/\.[^.]+$/, ""))}-${Date.now()}`;
  const bytes = Buffer.from(await file.arrayBuffer());

  try {
    const resultado = await new Promise<{ secure_url: string }>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: carpeta, public_id: nombreArchivo, resource_type: "image" },
        (error, result) => {
          if (error || !result) reject(error ?? new Error("Cloudinary no devolvió resultado"));
          else resolve(result);
        },
      );
      stream.end(bytes);
    });
    return { path: resultado.secure_url };
  } catch {
    return { error: "No se pudo subir la imagen. Probá de nuevo." };
  }
}
