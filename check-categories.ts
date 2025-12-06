import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const categories = await prisma.category.findMany()
    console.log('Categories in database:', categories)
    console.log('Total categories:', categories.length)
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
