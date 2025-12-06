import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const categories = [
        { name: 'Nursing', slug: 'nursing', icon: '🩺' },
        { name: 'Physician', slug: 'physician', icon: '👨‍⚕️' },
        { name: 'Allied Health', slug: 'allied-health', icon: '🏥' },
        { name: 'Dental', slug: 'dental', icon: '🦷' },
        { name: 'Mental Health', slug: 'mental-health', icon: '🧠' },
        { name: 'Administration', slug: 'administration', icon: '💼' },
        { name: 'Technology', slug: 'technology', icon: '💻' },
    ]

    console.log('Seeding categories...')

    for (const category of categories) {
        await prisma.category.upsert({
            where: { slug: category.slug },
            update: {},
            create: category,
        })
        console.log(`✓ Created category: ${category.name}`)
    }

    console.log('Seeding completed!')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
