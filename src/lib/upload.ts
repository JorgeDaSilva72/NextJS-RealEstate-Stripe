"use server";
import { createClient } from "@supabase/supabase-js";
import sharp from "sharp";

export async function uploadImages(images: File[]) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  const supabase = createClient(supabaseUrl, supabaseKey);

  const data = await Promise.all(
    images.map((file) =>
      supabase.storage
        .from("propertyImages")
        .upload(`${file.name.split(".").at(-2)}_${Date.now()}.${file.name.split(".").at(-1)}`, file)
    )
  );

  const urls = data.map(
    (item) =>
      supabase.storage
        .from("propertyImages")
        .getPublicUrl(item.data?.path ?? "").data.publicUrl
  );

  return urls;
}

export async function uploadImagesToWebp(base64Image: string, name: string, storage: "propertyImages" | "avatars") {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  const supabase = createClient(supabaseUrl, supabaseKey);

  const buffer = Buffer.from(base64Image, "base64");
  const webpBuffer = await sharp(buffer)
    .webp()
    .toBuffer();
  const data = await supabase.storage
    .from(storage)
    .upload(`${name.split(".").at(-2)}_${Date.now()}.webp`, webpBuffer)

  return supabase.storage
    .from(storage)
    .getPublicUrl(data?.data?.path ?? "").data.publicUrl
}

export async function removeImages(images: string[], storage: "propertyImages" | "avatars") {
  if (!images || images.length == 0) return;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  const supabase = createClient(supabaseUrl, supabaseKey);

  const { data, error } = await supabase.storage
    .from(storage)
    .remove(images);

  if (error) {
    console.error('Erreur lors de la suppression du fichier :', error.message);
    return;
  }

  data.map(item => console.log('Fichier supprimé avec succès:', item.name))
}

export async function uploadAvatar(image: File) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  const supabase = createClient(supabaseUrl, supabaseKey);

  const data = await supabase.storage
    .from("avatars")
    .upload(`${image.name}_${Date.now()}`, image);

  console.log({ data });

  const urlData = await supabase.storage
    .from("avatars")
    .getPublicUrl(data.data?.path!);

  return urlData.data.publicUrl;
}
