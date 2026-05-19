"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/src/lib/supabase/server";
import { createAdminClient } from "@/src/lib/supabase/admin";
import { notifyAdminNewProfile } from "@/src/lib/email";

export type ActionState = {
  error?: string;
  success?: boolean;
};

export async function signIn(
  _: ActionState,
  formData: FormData
): Promise<ActionState> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: "Email ou mot de passe incorrect." };
  }

  redirect("/");
}

export async function signUp(
  _: ActionState,
  formData: FormData
): Promise<ActionState> {
  const role = formData.get("role") as "commercant" | "association";
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;
  const nom = formData.get("nom") as string;
  const nameEntreprise = formData.get("name_entreprise") as string;

  if (password !== confirmPassword) {
    return { error: "Les mots de passe ne correspondent pas." };
  }

  if (password.length < 8) {
    return { error: "Le mot de passe doit contenir au moins 8 caractères." };
  }

  const admin = createAdminClient();

  const { data: authData, error: authError } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (authError || !authData.user) {
    if (authError?.message?.includes("already been registered")) {
      return { error: "Cette adresse email est déjà utilisée." };
    }
    return { error: "Erreur lors de la création du compte. Réessayez." };
  }

  const authId = authData.user.id;

  const { data: userRow, error: userError } = await admin
    .from("user")
    .insert({ email, mot_de_passe: "supabase_managed", nom, auth_id: authId })
    .select("id_user")
    .single();

  if (userError || !userRow) {
    await admin.auth.admin.deleteUser(authId);
    return { error: "Erreur lors de la création du profil utilisateur." };
  }

  const idUser = userRow.id_user;

  if (role === "commercant") {
    const { error: comError } = await admin.from("commercant").insert({
      id_user: idUser,
      tel: formData.get("tel") as string,
      email,
      mot_de_passe: "supabase_managed",
      siret: formData.get("siret") as string,
      name_entreprise: nameEntreprise,
      adresse: formData.get("adresse") as string,
      type_activity: formData.get("type_activity") as string,
      forme_juridique: formData.get("forme_juridique") as string,
      is_validated: false,
    });

    if (comError) {
      await admin.auth.admin.deleteUser(authId);
      await admin.from("user").delete().eq("id_user", idUser);
      return { error: "Erreur lors de la création du profil. Réessayez." };
    }
  } else {
    const { error: assoError } = await admin.from("association").insert({
      id_user: idUser,
      tel: formData.get("tel") as string,
      email,
      mot_de_passe: "supabase_managed",
      rna: formData.get("rna") as string,
      name_entreprise: nameEntreprise,
      adresse: formData.get("adresse") as string,
      type_asso: formData.get("type_asso") as string,
      rayon_action: parseInt(formData.get("rayon_action") as string, 10),
      is_validated: false,
    });

    if (assoError) {
      await admin.auth.admin.deleteUser(authId);
      await admin.from("user").delete().eq("id_user", idUser);
      return { error: "Erreur lors de la création du profil. Réessayez." };
    }
  }

  try {
    await notifyAdminNewProfile({ nom, email, role, nameEntreprise });
  } catch {
    // Ne pas bloquer l'inscription si l'email échoue
  }

  const supabase = await createClient();
  await supabase.auth.signInWithPassword({ email, password });

  redirect("/");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export async function deleteAccount() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const admin = createAdminClient();

  const { data: adminRow } = await supabase
    .from("administrateur")
    .select("id_admin")
    .maybeSingle();

  if (adminRow) {
    await admin.from("administrateur").delete().eq("id_admin", adminRow.id_admin);
  } else {
    const { data: userRow } = await admin
      .from("user")
      .select("id_user")
      .eq("auth_id", user.id)
      .maybeSingle();

    if (userRow) {
      await admin.from("commercant").delete().eq("id_user", userRow.id_user);
      await admin.from("association").delete().eq("id_user", userRow.id_user);
      await admin.from("user").delete().eq("id_user", userRow.id_user);
    }

    const { data: files } = await admin.storage.from("user-documents").list(user.id);
    if (files?.length) {
      await admin.storage
        .from("user-documents")
        .remove(files.map((f) => `${user.id}/${f.name}`));
    }
  }

  await admin.auth.admin.deleteUser(user.id);
  redirect("/login");
}
