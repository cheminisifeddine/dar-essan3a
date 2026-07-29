import { cookies } from "next/headers";
import { getSettings } from "./db";

const SESSION_COOKIE = "admin_session";
const SESSION_DURATION_SECONDS = 7 * 24 * 60 * 60; // 7 days

function bufferToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return bufferToHex(hash);
}

export async function verifyPassword(password: string): Promise<boolean> {
  const envPass = process.env.ADMIN_PASSWORD || "ChangeMeStrong123";
  return (await hashPassword(password)) === (await hashPassword(envPass));
}

export function generateToken(): string {
  return crypto.randomUUID();
}

export function setAdminSession(token: string): void {
  const expires = new Date(Date.now() + SESSION_DURATION_SECONDS * 1000);
  cookies().set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/admin",
    expires,
  });
}

export function clearAdminSession(): void {
  cookies().delete(SESSION_COOKIE);
}

export function getAdminSessionToken(): string | undefined {
  return cookies().get(SESSION_COOKIE)?.value;
}

export async function isAdminSessionValid(): Promise<boolean> {
  const token = getAdminSessionToken();
  if (!token) return false;
  const db = (process.env as any).DB as any;
  if (!db) return false;
  const row = await db.prepare("SELECT * FROM admin_sessions WHERE token = ? AND expires_at > ?").bind(token, Math.floor(Date.now() / 1000)).first();
  return !!row;
}

export async function createAdminSession(token: string): Promise<void> {
  const db = (process.env as any).DB as any;
  if (!db) return;
  await db
    .prepare("INSERT INTO admin_sessions (token, expires_at) VALUES (?, ?)")
    .bind(token, Math.floor(Date.now() / 1000) + SESSION_DURATION_SECONDS)
    .run();
}

export async function deleteAdminSession(token: string): Promise<void> {
  const db = (process.env as any).DB as any;
  if (!db) return;
  await db.prepare("DELETE FROM admin_sessions WHERE token = ?").bind(token).run();
}

export async function requireAdmin(request: Request): Promise<{ authenticated: boolean; token?: string }> {
  const token = getAdminSessionToken();
  if (!token) return { authenticated: false };
  const valid = await isAdminSessionValid();
  if (!valid) {
    clearAdminSession();
    return { authenticated: false };
  }
  return { authenticated: true, token };
}

export async function getStoreSettings(): Promise<Record<string, string>> {
  try {
    return await getSettings();
  } catch {
    return {};
  }
}

export async function getStoreFeeSettings(): Promise<{ homeDeliveryFee: number; stopDeskFee: number; freeShippingThreshold: number; whatsapp: string }> {
  const settings = await getStoreSettings();
  return {
    homeDeliveryFee: Number(settings.home_delivery_fee || 500),
    stopDeskFee: Number(settings.stopdesk_fee || 350),
    freeShippingThreshold: Number(settings.free_shipping_threshold || 6000),
    whatsapp: settings.whatsapp_number || "213558522110",
  };
}
