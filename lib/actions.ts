// src/lib/actions.ts
'use server';

import { sql } from "@vercel/postgres";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { User } from "@/types/user";

/* REGISTER */
export async function registerAction(formData: FormData) {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  try {
    await sql`
      INSERT INTO users (username, password)
      VALUES (${username}, ${password})
    `;
    return { success: true };
  } catch (err) {
    return { error: "Username đã tồn tại" };
  }
}

/* LOGIN */
export async function loginAction(formData: FormData) {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  const { rows } = await sql`
    SELECT * FROM users 
    WHERE username = ${username} 
      AND password = ${password}
  `;

  if (rows.length === 0) {
    return { error: "Sai username/password" };
  }

  // Lấy cookieStore đúng cách
  const cookieStore = await cookies();
  cookieStore.set("session", username, {
    httpOnly: true,
    path: "/",
  });

  return { success: true };
}

/* LOGOUT */
export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("session");

  redirect("/login"); // chuyển về trang login
}

//test database
export async function getUsersAction() {
  try {
    const result = await sql`SELECT * FROM users ORDER BY id ASC;`;
    return result.rows as User[];
  } catch (err) {
    console.error("Fetch users error:", err);
    return [];
  }
}

export async function updateUserAction(id: number, data: { username: string }) {
  try {
    await sql`
      UPDATE users
      SET username = ${data.username}
      WHERE id = ${id};
    `;
    return { success: true };
  } catch (e) {
    return { error: "Cannot update user" };
  }
}

export async function deleteUserAction(id: number) {
  try {
    await sql`
      DELETE FROM users WHERE id = ${id};
    `;
    return { success: true };
  } catch (e) {
    return { error: "Cannot delete user" };
  }
}