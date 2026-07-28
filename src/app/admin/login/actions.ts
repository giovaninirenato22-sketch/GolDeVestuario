"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { SESSION_COOKIE, crearTokenSesion } from "@/lib/auth/session";

export async function login(formData: FormData) {
  const password = String(formData.get("password") ?? "");
  const from = String(formData.get("from") ?? "/admin/productos");
  const hash = process.env.ADMIN_PASSWORD_HASH;

  const valido = hash ? await bcrypt.compare(password, hash) : false;

  if (!valido) {
    redirect(`/admin/login?error=1&from=${encodeURIComponent(from)}`);
  }

  const jar = await cookies();
  jar.set(SESSION_COOKIE, crearTokenSesion(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  redirect(from.startsWith("/admin") ? from : "/admin/productos");
}

export async function logout() {
  const jar = await cookies();
  jar.delete(SESSION_COOKIE);
  redirect("/admin/login");
}
