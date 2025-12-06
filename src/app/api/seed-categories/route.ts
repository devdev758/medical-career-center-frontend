import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const categories = [
            { name: 'Nursing', slug: 'nursing', icon: '🩺' },
            { name: 'Physician', slug: 'physician', icon: '👨‍⚕️' },
            { name: 'Allied Health', slug: 'allied-health', icon: '🏥' },
            { name: 'Dental', slug: 'dental', icon: '🦷' },
            { name: 'Mental Health', slug: 'mental-health', icon: '🧠' },
            { name: 'Administration', slug: 'administration', icon: '💼' },
            { name: 'Technology', slug: 'technology', icon: '💻' },
        ];

        const results = [];

        for (const category of categories) {
            const existing = await prisma.category.findUnique({
                where: { slug: category.slug },
            });

            if (!existing) {
                const created = await prisma.category.create({
                    data: category,
                });
                results.push({ action: 'created', category: created });
            } else {
                results.push({ action: 'exists', category: existing });
            }
        }

        return NextResponse.json({
            success: true,
            message: 'Categories seeded successfully',
            results
        });
    } catch (error) {
        console.error('Failed to seed categories:', error);
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}
