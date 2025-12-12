import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function cleanupDuplicates() {
  console.log("🧹 Nettoyage des doublons avant migration...\n");

  try {
    // ============================================
    // 1. NETTOYER LES DOUBLONS DANS User.email
    // ============================================
    console.log("📧 Vérification des emails en doublon...");

    const duplicateEmails = await prisma.$queryRaw<
      Array<{ email: string; count: bigint }>
    >`
      SELECT email, COUNT(*) as count
      FROM "User"
      GROUP BY email
      HAVING COUNT(*) > 1
    `;

    if (duplicateEmails.length > 0) {
      console.log(`⚠️  Trouvé ${duplicateEmails.length} emails en doublon`);

      for (const { email } of duplicateEmails) {
        // Garder le premier utilisateur, supprimer les autres
        const users = await prisma.user.findMany({
          where: { email },
          orderBy: { createdAt: "asc" },
        });

        console.log(`   - Email "${email}" : ${users.length} occurrences`);

        // Supprimer tous sauf le premier
        for (let i = 1; i < users.length; i++) {
          await prisma.user.delete({
            where: { id: users[i].id },
          });
          console.log(`     ✓ Supprimé user ${users[i].id}`);
        }
      }
      console.log("✅ Emails nettoyés\n");
    } else {
      console.log("✅ Aucun doublon d'email\n");
    }

    // ============================================
    // 2. NETTOYER LES DOUBLONS DANS PropertyType.code
    // ============================================
    console.log("🏠 Vérification des codes PropertyType en doublon...");

    const duplicateTypeCodes = await prisma.$queryRaw<
      Array<{ code: string; count: bigint }>
    >`
      SELECT code, COUNT(*) as count
      FROM "PropertyType"
      WHERE code IS NOT NULL
      GROUP BY code
      HAVING COUNT(*) > 1
    `;

    if (duplicateTypeCodes.length > 0) {
      console.log(
        `⚠️  Trouvé ${duplicateTypeCodes.length} codes PropertyType en doublon`
      );

      for (const { code } of duplicateTypeCodes) {
        const types = await prisma.propertyType.findMany({
          where: { code },
          include: {
            properties: true,
            translations: true,
          },
        });

        console.log(`   - Code "${code}" : ${types.length} occurrences`);

        // Garder le premier, réassigner les propriétés des autres
        const keepType = types[0];

        for (let i = 1; i < types.length; i++) {
          const duplicateType = types[i];

          // Réassigner les propriétés
          if (duplicateType.properties.length > 0) {
            await prisma.property.updateMany({
              where: { typeId: duplicateType.id },
              data: { typeId: keepType.id },
            });
            console.log(
              `     ✓ ${duplicateType.properties.length} propriétés réassignées`
            );
          }

          // Supprimer le type en doublon
          await prisma.propertyType.delete({
            where: { id: duplicateType.id },
          });
          console.log(`     ✓ Supprimé PropertyType ${duplicateType.id}`);
        }
      }
      console.log("✅ PropertyType nettoyé\n");
    } else {
      console.log("✅ Aucun doublon de code PropertyType\n");
    }

    // ============================================
    // 3. NETTOYER LES PropertyType SANS CODE
    // ============================================
    console.log("🔍 Vérification des PropertyType sans code...");

    const typesWithoutCode = await prisma.propertyType.findMany({
      where: {
        OR: [{ code: undefined }, { code: "" }],
      },
      include: {
        translations: true,
      },
    });

    if (typesWithoutCode.length > 0) {
      console.log(
        `⚠️  Trouvé ${typesWithoutCode.length} PropertyType sans code`
      );

      for (const type of typesWithoutCode) {
        // Générer un code unique basé sur la traduction ou l'ID
        const translation = type.translations[0]?.value || `type_${type.id}`;
        const code = translation
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "") // Retirer les accents
          .replace(/[^a-z0-9]+/g, "_")
          .replace(/^_|_$/g, "");

        await prisma.propertyType.update({
          where: { id: type.id },
          data: { code },
        });

        console.log(`   - PropertyType ${type.id} : code généré "${code}"`);
      }
      console.log("✅ Codes générés\n");
    } else {
      console.log("✅ Tous les PropertyType ont un code\n");
    }

    // ============================================
    // 4. NETTOYER LES DOUBLONS DANS PropertyStatus.code
    // ============================================
    console.log("📊 Vérification des codes PropertyStatus en doublon...");

    const duplicateStatusCodes = await prisma.$queryRaw<
      Array<{ code: string; count: bigint }>
    >`
      SELECT code, COUNT(*) as count
      FROM "PropertyStatus"
      WHERE code IS NOT NULL
      GROUP BY code
      HAVING COUNT(*) > 1
    `;

    if (duplicateStatusCodes.length > 0) {
      console.log(
        `⚠️  Trouvé ${duplicateStatusCodes.length} codes PropertyStatus en doublon`
      );

      for (const { code } of duplicateStatusCodes) {
        const statuses = await prisma.propertyStatus.findMany({
          where: { code },
          include: {
            properties: true,
            translations: true,
          },
        });

        console.log(`   - Code "${code}" : ${statuses.length} occurrences`);

        const keepStatus = statuses[0];

        for (let i = 1; i < statuses.length; i++) {
          const duplicateStatus = statuses[i];

          if (duplicateStatus.properties.length > 0) {
            await prisma.property.updateMany({
              where: { statusId: duplicateStatus.id },
              data: { statusId: keepStatus.id },
            });
            console.log(
              `     ✓ ${duplicateStatus.properties.length} propriétés réassignées`
            );
          }

          await prisma.propertyStatus.delete({
            where: { id: duplicateStatus.id },
          });
          console.log(`     ✓ Supprimé PropertyStatus ${duplicateStatus.id}`);
        }
      }
      console.log("✅ PropertyStatus nettoyé\n");
    } else {
      console.log("✅ Aucun doublon de code PropertyStatus\n");
    }

    // ============================================
    // 5. NETTOYER LES PropertyStatus SANS CODE
    // ============================================
    console.log("🔍 Vérification des PropertyStatus sans code...");

    const statusesWithoutCode = await prisma.propertyStatus.findMany({
      where: {
        OR: [{ code: undefined }, { code: "" }],
      },
      include: {
        translations: true,
      },
    });

    if (statusesWithoutCode.length > 0) {
      console.log(
        `⚠️  Trouvé ${statusesWithoutCode.length} PropertyStatus sans code`
      );

      for (const status of statusesWithoutCode) {
        const translation =
          status.translations[0]?.value || `status_${status.id}`;
        const code = translation
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/[^a-z0-9]+/g, "_")
          .replace(/^_|_$/g, "");

        await prisma.propertyStatus.update({
          where: { id: status.id },
          data: { code },
        });

        console.log(`   - PropertyStatus ${status.id} : code généré "${code}"`);
      }
      console.log("✅ Codes générés\n");
    } else {
      console.log("✅ Tous les PropertyStatus ont un code\n");
    }

    // ============================================
    // 6. NETTOYER LES DOUBLONS DANS Subscriptions.paymentID
    // ============================================
    console.log("💳 Vérification des paymentID en doublon...");

    const duplicatePaymentIDs = await prisma.$queryRaw<
      Array<{ paymentID: string; count: bigint }>
    >`
      SELECT "paymentID", COUNT(*) as count
      FROM "Subscriptions"
      GROUP BY "paymentID"
      HAVING COUNT(*) > 1
    `;

    if (duplicatePaymentIDs.length > 0) {
      console.log(
        `⚠️  Trouvé ${duplicatePaymentIDs.length} paymentID en doublon`
      );

      for (const { paymentID } of duplicatePaymentIDs) {
        const subscriptions = await prisma.subscriptions.findMany({
          where: { paymentID },
          orderBy: { createdAt: "asc" },
        });

        console.log(
          `   - PaymentID "${paymentID}" : ${subscriptions.length} occurrences`
        );

        // Garder la première souscription
        for (let i = 1; i < subscriptions.length; i++) {
          // Générer un nouveau paymentID unique
          const newPaymentID = `${paymentID}_${i}_${Date.now()}`;

          await prisma.subscriptions.update({
            where: { id: subscriptions[i].id },
            data: { paymentID: newPaymentID },
          });

          console.log(`     ✓ PaymentID modifié en "${newPaymentID}"`);
        }
      }
      console.log("✅ PaymentID nettoyés\n");
    } else {
      console.log("✅ Aucun doublon de paymentID\n");
    }

    // ============================================
    // RÉSUMÉ
    // ============================================
    console.log("✨ Nettoyage terminé avec succès !");
    console.log("\n🚀 Vous pouvez maintenant exécuter :");
    console.log("   npx prisma migrate dev --name improved_schema\n");
  } catch (error) {
    console.error("❌ Erreur lors du nettoyage :", error);
    throw error;
  }
}

cleanupDuplicates()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
