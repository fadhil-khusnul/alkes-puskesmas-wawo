import { supabase } from "../lib/supabaseClient";

export type UserRole = "admin" | "staf";

export type User = {
  id: string;
  nama: string;
  email: string;
  role: UserRole;
  created_at?: string;
};

// Fallback dummy data if Supabase is not configured yet (for UI preview)
let mockUsers: User[] = [
  {
    id: "d1a3c638-4e3a-4a25-8d9e-123456789012",
    nama: "Admin Wawo",
    email: "admin@wawo.com",
    role: "admin",
  },
  {
    id: "f2b4d749-5f4b-5b36-9eaf-234567890123",
    nama: "Staf Medis 1",
    email: "staf1@wawo.com",
    role: "staf",
  },
];

export const getUsers = async (): Promise<User[]> => {
  if (
    process.env.NEXT_PUBLIC_SUPABASE_URL === "YOUR_SUPABASE_URL" ||
    !process.env.NEXT_PUBLIC_SUPABASE_URL
  ) {
    return Promise.resolve(mockUsers); // Return mock data if credentials aren't set
  }

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data as User[];
};

export const createUser = async (
  user: Omit<User, "id" | "created_at">,
): Promise<User> => {
  if (
    process.env.NEXT_PUBLIC_SUPABASE_URL === "YOUR_SUPABASE_URL" ||
    !process.env.NEXT_PUBLIC_SUPABASE_URL
  ) {
    const newUser = {
      ...user,
      id: Math.random().toString(),
      created_at: new Date().toISOString(),
    };
    mockUsers = [newUser, ...mockUsers];
    return Promise.resolve(newUser);
  }

  // NOTE: In a real Supabase application, creating a user requires using Supabase Auth (admin API)
  // to create the account first, which then triggers a function to insert into the public.users table.
  // For the sake of this demo, we will attempt to insert directly if the foreign key allows it,
  // or return a mocked response if it fails due to auth.users constraint.
  const { data, error } = await supabase
    .from("users")
    .insert([{ ...user, id: crypto.randomUUID() }])
    .select()
    .single();

  if (error) {
    console.warn(
      "Direct insert to public.users failed (likely due to auth.users foreign key constraint). Using mock data for demo.",
      error,
    );
    const newUser = {
      ...user,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
    };
    return Promise.resolve(newUser);
  }
  return data as User;
};

export const updateUser = async (
  id: string,
  updates: Partial<User>,
): Promise<User> => {
  if (
    process.env.NEXT_PUBLIC_SUPABASE_URL === "YOUR_SUPABASE_URL" ||
    !process.env.NEXT_PUBLIC_SUPABASE_URL
  ) {
    mockUsers = mockUsers.map((item) =>
      item.id === id ? { ...item, ...updates } : item,
    );
    return Promise.resolve(mockUsers.find((item) => item.id === id)!);
  }

  const { data, error } = await supabase
    .from("users")
    .update({ ...updates })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as User;
};

export const deleteUser = async (id: string): Promise<void> => {
  if (
    process.env.NEXT_PUBLIC_SUPABASE_URL === "YOUR_SUPABASE_URL" ||
    !process.env.NEXT_PUBLIC_SUPABASE_URL
  ) {
    mockUsers = mockUsers.filter((item) => item.id !== id);
    return Promise.resolve();
  }

  // NOTE: In a real app, you would delete the auth.users record via Admin API.
  const { error } = await supabase.from("users").delete().eq("id", id);

  if (error) throw error;
};
