"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/src/lib/supabase/server";
import { createAdminClient } from "@/src/lib/supabase/admin";
import { notifyAdminNewProfile } from "@/src/lib/email";
import { geocodeAddress } from "@/src/lib/geocode";

export type ActionState = {
  error?: string;
  success?: boolean;
};

export async function signIn(
  _: ActionState,
  formData: FormData
): Promise<ActionState> {
  const email = (formData.get("email") as string).trim().toLowerCase();
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email ou mot de passe incorrect." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: "Email ou mot de passe incorrect." };
  }

  redirect("/");
}

const TEL_RE = /^(?:\+33|0033|0)[1-9]\d{8}$/;
const SIRET_RE = /^\d{14}$/;
const RNA_RE = /^W\d{9}$/i;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function signUp(
  _: ActionState,
  formData: FormData
): Promise<ActionState> {
  const role = formData.get("role") as string;
  if (role !== "commercant" && role !== "association") {
    return { error: "Rôle invalide." };
  }

  const email = (formData.get("email") as string).trim().toLowerCase();
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;
  const nom = (formData.get("nom") as string).trim().slice(0, 100);
  const nameEntreprise = (formData.get("name_entreprise") as string).trim().slice(0, 200);

  if (!EMAIL_RE.test(email)) {
    return { error: "Adresse email invalide." };
  }

  if (password !== confirmPassword) {
    return { error: "Les mots de passe ne correspondent pas." };
  }

  if (password.length < 8) {
    return { error: "Le mot de passe doit contenir au moins 8 caractères." };
  }

  if (password.length > 128) {
    return { error: "Le mot de passe ne peut pas dépasser 128 caractères." };
  }

  const tel = (formData.get("tel") as string).replace(/[\s.\-()]/g, "");
  if (!TEL_RE.test(tel)) {
    return { error: "Numéro de téléphone invalide (ex : 06 12 34 56 78)." };
  }

  let siret = "";
  let rna = "";

  if (role === "commercant") {
    siret = (formData.get("siret") as string).replace(/\s/g, "");
    if (!SIRET_RE.test(siret)) {
      return { error: "Le SIRET doit contenir exactement 14 chiffres." };
    }
  } else {
    rna = (formData.get("rna") as string).trim().toUpperCase();
    if (!RNA_RE.test(rna)) {
      return { error: "Le numéro RNA doit commencer par W suivi de 9 chiffres (ex : W751000000)." };
    }
  }

  const admin = createAdminClient();

  const { data: authData, error: authError } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (authError || !authData.user) {
    return { error: "Erreur lors de la création du compte. Réessayez." };
  }

  const authId = authData.user.id;

  const { data: userRow, error: userError } = await admin
    .from("user")
    .insert({ email, nom, auth_id: authId })
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
      tel,
      email,
      siret,
      name_entreprise: nameEntreprise,
      adresse: (formData.get("adresse") as string).trim().slice(0, 300),
      code_postal: (formData.get("code_postal") as string).trim().slice(0, 10) || null,
      type_activity: (formData.get("type_activity") as string).trim().slice(0, 100),
      forme_juridique: (formData.get("forme_juridique") as string).trim().slice(0, 100),
      is_validated: false,
    });

    if (comError) {
      await admin.auth.admin.deleteUser(authId);
      await admin.from("user").delete().eq("id_user", idUser);
      if (comError.code === "23505") {
        return { error: "Un compte avec ces informations existe déjà." };
      }
      return { error: "Erreur lors de la création du profil. Réessayez." };
    }
  } else {
    const assoAdresse = (formData.get("adresse") as string).trim().slice(0, 300);
    const { data: insertedAsso, error: assoError } = await admin
      .from("association")
      .insert({
        id_user: idUser,
        tel,
        email,
        rna,
        name_entreprise: nameEntreprise,
        adresse: assoAdresse,
        code_postal: (formData.get("code_postal") as string).trim().slice(0, 10) || null,
        type_asso: (formData.get("type_asso") as string).trim().slice(0, 100),
        is_validated: false,
      })
      .select("id_association")
      .single();

    if (assoError || !insertedAsso) {
      await admin.auth.admin.deleteUser(authId);
      await admin.from("user").delete().eq("id_user", idUser);
      if (assoError?.code === "23505") {
        return { error: "Un compte avec ces informations existe déjà." };
      }
      return { error: "Erreur lors de la création du profil. Réessayez." };
    }

    const acceptGeolocation = formData.get("accept_geolocation") === "on";
    if (acceptGeolocation) {
      const coords = await geocodeAddress(assoAdresse);
      if (coords) {
        await admin
          .from("association")
          .update({ lat: coords.lat, lng: coords.lng })
          .eq("id_association", insertedAsso.id_association);
      }
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

  const { data: userRow } = await admin
    .from("user")
    .select("id_user")
    .eq("auth_id", user.id)
    .maybeSingle();

  if (adminRow) {
    await admin.from("administrateur").delete().eq("id_admin", adminRow.id_admin);
  }

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

  await admin.auth.admin.deleteUser(user.id);
  redirect("/login");
}
