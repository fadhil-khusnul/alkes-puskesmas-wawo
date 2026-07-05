import { supabase } from "../lib/supabaseClient";
import { devGetUsers, devCreateUser, devUpdateUser, devDeleteUser } from "../app/actions";

const isDev = process.env.NEXT_PUBLIC_APP_ENV === "development";

export type UserRole = "admin" | "staf";

export type User = {
  id: string;
  nama: string;
  email: string;
  role: UserRole;
  created_at?: string;
  password?: string;
};

export const getUsers = async (): Promise<User[]> => {
  if (isDev) {
    const data = await devGetUsers();
    return data.map((u) => ({
      ...u,
      created_at: u.created_at.toISOString(),
    })) as User[];
  }

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data as User[];
};

export const createUser = async (
  user: Omit<User, "id" | "created_at"> & { password?: string },
): Promise<User> => {
  if (isDev) {
    const data = await devCreateUser(user);
    return {
      ...data,
      created_at: data.created_at.toISOString(),
    } as User;
  }

  // Try to create an auth user first. Since we are on client side, this will sign in the new user.
  // To avoid disrupting the current admin's session, a proper implementation would use an Edge Function 
  // with service_role key. For this demo, we will attempt signUp.
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: user.email,
    password: user.password || 'Password123!', // Default password for new users
    options: {
      data: {
        nama: user.nama,
        role: user.role,
      }
    }
  });

  if (authError) {
    if (authError.message.includes('User already registered')) {
      throw new Error("Email sudah terdaftar. Gunakan email lain.");
    }
    console.error("Supabase auth insert error:", authError);
    throw new Error(authError.message);
  }

  // The database trigger will automatically insert into the users table.
  // We can just fetch the newly created user from the users table.
  if (authData.user) {
    const { data, error } = await supabase
      .from("users")
      .select()
      .eq("id", authData.user.id)
      .single();
    
    if (error) {
      console.error("Supabase user fetch error:", error);
      // Fallback
      return { id: authData.user.id, ...user };
    }
    return data as User;
  }

  throw new Error("Gagal membuat pengguna");
};

export const updateUser = async (
  id: string,
  updates: Partial<User> & { password?: string },
): Promise<User> => {
  if (isDev) {
    const data = await devUpdateUser(id, updates);
    return {
      ...data,
      created_at: data.created_at.toISOString(),
    } as User;
  }

  // Supabase auth passwords cannot be updated directly from standard client SDK for another user,
  // but we strip it here so we don't trigger public database schema errors.
  const { password, ...supabaseUpdates } = updates;

  const { data, error } = await supabase
    .from("users")
    .update({ ...supabaseUpdates })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Supabase user update error:", error);
    throw new Error(error.message || "Failed to update user");
  }
  return data as User;
};

export const deleteUser = async (id: string): Promise<void> => {
  if (isDev) {
    await devDeleteUser(id);
    return;
  }

  const { error } = await supabase.from("users").delete().eq("id", id);

  if (error) throw error;
};

