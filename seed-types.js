import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedPropertyTypesAndStatuses() {
    const propertyTypes = [
        { value: 'Maison' },
        { value: 'Appartement' },
        { value: 'Studio' },
        { value: 'Terrain' },
        { value: 'Local commercial' },
        { value: 'Bureau' },
        { value: 'Villa' },
        { value: 'Duplex' },
    ];

    const propertyStatuses = [
        { value: 'Vente' },
        { value: 'Location' },
        { value: 'Location saisonnière' },
    ];

    console.log('🌱 Seeding property types...');

    // Seed PropertyType
    for (const type of propertyTypes) {
        await prisma.propertyType.upsert({
            where: { value: type.value },
            update: {},
            create: type,
        });
    }

    console.log('✅ Property types seeded');

    console.log('🌱 Seeding property statuses...');

    // Seed PropertyStatus
    for (const status of propertyStatuses) {
        await prisma.propertyStatus.upsert({
            where: { value: status.value },
            update: {},
            create: status,
        });
    }

    console.log('✅ Property statuses seeded');
    console.log('🎉 Database seeding completed!');
}

seedPropertyTypesAndStatuses()
    .catch((e) => {
        console.error('❌ Error seeding database:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
