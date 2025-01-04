// import { createClient } from "@supabase/supabase-js";

// export async function uploadImages(images: File[]) {
//   const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
//   const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

//   const supabase = createClient(supabaseUrl, supabaseKey);

//   const data = await Promise.all(
//     images.map((file) =>
//       supabase.storage
//         .from("propertyImages")
//         .upload(`${file.name}_${Date.now()}`, file)
//     )
//   );

//   const urls = data.map(
//     (item) =>
//       supabase.storage
//         .from("propertyImages")
//         .getPublicUrl(item.data?.path ?? "").data.publicUrl
//   );

//   return urls;
// }

// export async function uploadAvatar(image: File) {
//   const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
//   const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

//   const supabase = createClient(supabaseUrl, supabaseKey);

//   const data = await supabase.storage
//     .from("avatars")
//     .upload(`${image.name}_${Date.now()}`, image);

//   console.log({ data });

//   const urlData = await supabase.storage
//     .from("avatars")
//     .getPublicUrl(data.data?.path!);

//   return urlData.data.publicUrl;
// }

// JhnRavelo supprime les fichiers quand une annonce est supprimé

// import { createClient } from "@supabase/supabase-js";

// export async function uploadImages(images: File[]) {
//   const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
//   const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

//   const supabase = createClient(supabaseUrl, supabaseKey);

//   const data = await Promise.all(
//     images.map((file) =>
//       supabase.storage
//         .from("propertyImages")
//         .upload(
//           `${file.name.split(".").at(-2)}_${Date.now()}.${file.name
//             .split(".")
//             .at(-1)}`,
//           file
//         )
//     )
//   );

//   const urls = data.map(
//     (item) =>
//       supabase.storage
//         .from("propertyImages")
//         .getPublicUrl(item.data?.path ?? "").data.publicUrl
//   );

//   return urls;
// }

// export async function removeImages(images: string[]) {
//   if (!images || images.length == 0) return;

//   const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
//   const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

//   const supabase = createClient(supabaseUrl, supabaseKey);

//   const { data, error } = await supabase.storage
//     .from("propertyImages")
//     .remove(images);

//   if (error) {
//     console.error("Erreur lors de la suppression du fichier :", error.message);
//     return;
//   }

//   data.map((item) => console.log("Fichier supprimé avec succès:", item.name));
// }

// export async function uploadAvatar(image: File) {
//   const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
//   const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

//   const supabase = createClient(supabaseUrl, supabaseKey);

//   const data = await supabase.storage
//     .from("avatars")
//     .upload(`${image.name}_${Date.now()}`, image);

//   console.log({ data });

//   const urlData = await supabase.storage
//     .from("avatars")
//     .getPublicUrl(data.data?.path!);

//   return urlData.data.publicUrl;
// }

// end ---------------------------------------

// Cedrico : convertir image en webp et limitez la taille du fichier à 2Mo

// "use server";
// import { createClient } from "@supabase/supabase-js";
// import sharp from "sharp";

// export async function uploadImages(images: File[]) {
//   const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
//   const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

//   const supabase = createClient(supabaseUrl, supabaseKey);

//   const data = await Promise.all(
//     images.map((file) =>
//       supabase.storage
//         .from("propertyImages")
//         .upload(
//           `${file.name.split(".").at(-2)}_${Date.now()}.${file.name
//             .split(".")
//             .at(-1)}`,
//           file
//         )
//     )
//   );

//   const urls = data.map(
//     (item) =>
//       supabase.storage
//         .from("propertyImages")
//         .getPublicUrl(item.data?.path ?? "").data.publicUrl
//   );

//   return urls;
// }

// export async function uploadImagesToWebp(
//   base64Image: string,
//   name: string,
//   storage: "propertyImages" | "avatars"
// ) {
//   const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
//   const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

//   const supabase = createClient(supabaseUrl, supabaseKey);

//   const buffer = Buffer.from(base64Image, "base64");
//   const webpBuffer = await sharp(buffer).webp().toBuffer();
//   const data = await supabase.storage
//     .from(storage)
//     .upload(`${name.split(".").at(-2)}_${Date.now()}.webp`, webpBuffer);

//   return supabase.storage.from(storage).getPublicUrl(data?.data?.path ?? "")
//     .data.publicUrl;
// }

// export async function removeImages(
//   images: string[],
//   storage: "propertyImages" | "avatars"
// ) {
//   if (!images || images.length == 0) return;

//   const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
//   const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

//   const supabase = createClient(supabaseUrl, supabaseKey);

//   const { data, error } = await supabase.storage.from(storage).remove(images);

//   if (error) {
//     console.error("Erreur lors de la suppression du fichier :", error.message);
//     return;
//   }

//   data.map((item) => console.log("Fichier supprimé avec succès:", item.name));
// }

// export async function uploadAvatar(image: File) {
//   const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
//   const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

//   const supabase = createClient(supabaseUrl, supabaseKey);

//   const data = await supabase.storage
//     .from("avatars")
//     .upload(`${image.name}_${Date.now()}`, image);

//   console.log({ data });

//   const urlData = await supabase.storage
//     .from("avatars")
//     .getPublicUrl(data.data?.path!);

//   return urlData.data.publicUrl;
// }
// end-----------------------------
// Cedrico 10/12/2024

// import { createClient } from "@supabase/supabase-js";

// export async function uploadImages(images: File[]) {
//   const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
//   const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

//   const supabase = createClient(supabaseUrl, supabaseKey);

//   const data = await Promise.all(
//     images.map((file) =>
//       supabase.storage
//         .from("propertyImages")
//         .upload(`${file.name}_${Date.now()}`, file)
//     )
//   );

//   const urls = data.map(
//     (item) =>
//       supabase.storage
//         .from("propertyImages")
//         .getPublicUrl(item.data?.path ?? "").data.publicUrl
//   );

//   return urls;
// }

// export async function uploadAvatar(image: File) {
//   const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
//   const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

//   const supabase = createClient(supabaseUrl, supabaseKey);

//   const data = await supabase.storage
//     .from("avatars")
//     .upload(`${image.name}_${Date.now()}`, image);

//   console.log({ data });

//   const urlData = await supabase.storage
//     .from("avatars")
//     .getPublicUrl(data.data?.path!);

//   return urlData.data.publicUrl;
// }

// JhnRavelo supprime les fichiers quand une annonce est supprimé

// import { createClient } from "@supabase/supabase-js";

// export async function uploadImages(images: File[]) {
//   const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
//   const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

//   const supabase = createClient(supabaseUrl, supabaseKey);

//   const data = await Promise.all(
//     images.map((file) =>
//       supabase.storage
//         .from("propertyImages")
//         .upload(
//           `${file.name.split(".").at(-2)}_${Date.now()}.${file.name
//             .split(".")
//             .at(-1)}`,
//           file
//         )
//     )
//   );

//   const urls = data.map(
//     (item) =>
//       supabase.storage
//         .from("propertyImages")
//         .getPublicUrl(item.data?.path ?? "").data.publicUrl
//   );

//   return urls;
// }

// export async function removeImages(images: string[]) {
//   if (!images || images.length == 0) return;

//   const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
//   const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

//   const supabase = createClient(supabaseUrl, supabaseKey);

//   const { data, error } = await supabase.storage
//     .from("propertyImages")
//     .remove(images);

//   if (error) {
//     console.error("Erreur lors de la suppression du fichier :", error.message);
//     return;
//   }

//   data.map((item) => console.log("Fichier supprimé avec succès:", item.name));
// }

// export async function uploadAvatar(image: File) {
//   const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
//   const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

//   const supabase = createClient(supabaseUrl, supabaseKey);

//   const data = await supabase.storage
//     .from("avatars")
//     .upload(`${image.name}_${Date.now()}`, image);

//   console.log({ data });

//   const urlData = await supabase.storage
//     .from("avatars")
//     .getPublicUrl(data.data?.path!);

//   return urlData.data.publicUrl;
// }

// end ---------------------------------------

// Cedrico : convertir image en webp et limitez la taille du fichier à 2Mo

"use server";
import { createClient } from "@supabase/supabase-js";
import sharp from "sharp";

// export async function uploadImages(images: File[]) {
//   const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
//   const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

//   const supabase = createClient(supabaseUrl, supabaseKey);

//   const data = await Promise.all(
//     images.map((file) =>
//       supabase.storage
//         .from("propertyImages")
//         .upload(
//           `${file.name.split(".").at(-2)}_${Date.now()}.${file.name
//             .split(".")
//             .at(-1)}`,
//           file
//         )
//     )
//   );

//   const urls = data.map(
//     (item) =>
//       supabase.storage
//         .from("propertyImages")
//         .getPublicUrl(item.data?.path ?? "").data.publicUrl
//   );

//   return urls;
// }

export async function uploadImages(images: File[]) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false, //utile pour éviter le stockage local des informations d'authentification.
    },
  });

  const urls: string[] = [];

  try {
    for (const image of images) {
      // Validation du type MIME
      if (!["image/jpg", "image/jpeg", "image/webp"].includes(image.type)) {
        console.warn("Type de fichier non supporté :", image.type);
        continue;
      }
      const timestamp = Date.now();
      const fileName = `${
        image.name.split(".").at(-2) || "image"
      }_${timestamp}`;
      const fileExt = image.name.split(".").at(-1)?.toLowerCase() || "jpg"; // "jpg" par défaut

      const fullPath = `${fileName}.${fileExt}`;

      // Upload avec les bons headers
      const { data, error } = await supabase.storage
        .from("propertyImages")
        .upload(fullPath, image, {
          cacheControl: "3600",
          upsert: false,
          contentType: image.type, // Ajout explicite du type MIME
        });

      if (error) {
        console.error("Erreur upload:", error);
        continue;
      }

      // Récupération de l'URL avec options CORS
      if (data?.path) {
        const { data: publicUrlData } = supabase.storage
          .from("propertyImages")
          .getPublicUrl(data.path, {
            download: false, // Ne pas forcer le téléchargement
            transform: {
              quality: 75, // Optimisation optionnelle de la qualité
            },
          });

        if (publicUrlData?.publicUrl) {
          urls.push(publicUrlData.publicUrl);
          console.log("URL générée:", publicUrlData.publicUrl);
        }
      }
    }

    return urls;
  } catch (error) {
    console.error("Erreur générale:", error);
    throw error;
  }
}

export async function uploadImagesToWebp(
  base64Image: string,
  name: string,
  storage: "propertyImages" | "avatars"
) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  const supabase = createClient(supabaseUrl, supabaseKey);

  const buffer = Buffer.from(base64Image, "base64");
  const webpBuffer = await sharp(buffer).webp().toBuffer();
  const data = await supabase.storage
    .from(storage)
    .upload(`${name.split(".").at(-2)}_${Date.now()}.webp`, webpBuffer);

  return supabase.storage.from(storage).getPublicUrl(data?.data?.path ?? "")
    .data.publicUrl;
}

export async function removeImages(
  images: string[],
  storage: "propertyImages" | "avatars"
) {
  if (!images || images.length == 0) return;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  const supabase = createClient(supabaseUrl, supabaseKey);

  const { data, error } = await supabase.storage.from(storage).remove(images);

  if (error) {
    console.error("Erreur lors de la suppression du fichier :", error.message);
    return;
  }

  data.map((item) => console.log("Fichier supprimé avec succès:", item.name));
}

export async function checkFileExists(
  storage: "propertyImages" | "avatars",
  name: string
) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  const supabase = createClient(supabaseUrl, supabaseKey);
  const { data, error } = await supabase.storage.from(storage).download(name);

  if (error) return false;

  return true;
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
