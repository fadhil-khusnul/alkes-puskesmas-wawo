"use server";

import { prisma } from "../lib/prisma";
import { cookies } from "next/headers";
import crypto from "crypto";

function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password + "wawo-salt-key-123!").digest("hex");
}

// Authentication Actions (Development Mode only)
export async function devLogin(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || user.password !== hashPassword(password)) {
    throw new Error("Invalid login credentials");
  }
  
  // Set a simple cookie for dev session
  const cookieStore = await cookies();
  cookieStore.set("dev_session", user.id, { path: "/", maxAge: 86400 });
  
  return { user };
}

export async function devRegister(email: string, password: string, nama: string) {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw new Error("User already registered");
  }
  
  const user = await prisma.user.create({
    data: {
      email,
      password: hashPassword(password),
      nama: nama || email.split('@')[0],
      role: 'admin',
    }
  });
  
  return { user };
}

export async function devLogout() {
  const cookieStore = await cookies();
  cookieStore.delete("dev_session");
}

export async function devGetUser() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("dev_session")?.value;
  if (!userId) return { data: { user: null } };
  
  const user = await prisma.user.findUnique({ where: { id: userId } });
  return { data: { user } };
}

// Data Actions (Development Mode only)
export async function devGetAlatMedis() {
  const alat = await prisma.alatMedis.findMany({
    orderBy: { created_at: 'desc' }
  });
  return alat;
}

export async function devCreateAlatMedis(data: any) {
  const { data: { user } } = await devGetUser();
  const input_by = user?.id;
  
  const alat = await prisma.alatMedis.create({
    data: {
      ...data,
      input_by
    }
  });
  return alat;
}

export async function devUpdateAlatMedis(id: string, updates: any) {
  const alat = await prisma.alatMedis.update({
    where: { id },
    data: updates
  });
  return alat;
}

export async function devDeleteAlatMedis(id: string) {
  await prisma.alatMedis.delete({ where: { id } });
}

export async function devGetDashboardStats() {
  const totalAlat = await prisma.alatMedis.count();
  const stokMenipis = await prisma.alatMedis.count({
    where: {
      OR: [
        { status: 'Habis' },
        { jumlah: { lt: 50 } }
      ]
    }
  });
  const totalPengguna = await prisma.user.count();
  
  const allAlat = await prisma.alatMedis.findMany({
    select: { jenis_alat: true, jumlah: true }
  });
  
  const chartDataMap: Record<string, number> = {};
  allAlat.forEach((alat) => {
    if (alat.jenis_alat) {
      chartDataMap[alat.jenis_alat] = (chartDataMap[alat.jenis_alat] || 0) + (alat.jumlah || 0);
    }
  });

  const chartData = Object.entries(chartDataMap).map(([name, jumlah]) => ({
    name,
    jumlah,
  }));

  return {
    totalAlat,
    stokMenipis,
    totalPengguna,
    efisiensi: 94.2,
    chartData,
  };
}

export async function devGetUsers() {
  const users = await prisma.user.findMany({
    orderBy: { created_at: 'desc' },
    select: { id: true, nama: true, email: true, role: true, created_at: true }
  });
  return users;
}

export async function devCreateUser(user: any) {
  const existing = await prisma.user.findUnique({ where: { email: user.email } });
  if (existing) {
    throw new Error("Email sudah terdaftar. Gunakan email lain.");
  }
  
  const created = await prisma.user.create({
    data: {
      ...user,
      password: hashPassword(user.password || 'Password123!'),
    }
  });
  return created;
}

export async function devUpdateUser(id: string, updates: any) {
  const dataToUpdate = { ...updates };
  if (dataToUpdate.password) {
    dataToUpdate.password = hashPassword(dataToUpdate.password);
  }
  
  const user = await prisma.user.update({
    where: { id },
    data: dataToUpdate
  });
  return user;
}

export async function devDeleteUser(id: string) {
  await prisma.user.delete({ where: { id } });
}

export async function getLandingSettings() {
  const settings = await prisma.landingSetting.findMany();
  const result: Record<string, string> = {};
  for (const s of settings) {
    result[s.key] = s.value;
  }
  return result;
}

export async function updateLandingSettings(updates: Record<string, string>) {
  for (const [key, value] of Object.entries(updates)) {
    await prisma.landingSetting.upsert({
      where: { key },
      update: { value },
      create: { key, value }
    });
  }
  return { success: true };
}
