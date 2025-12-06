import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, email, password, companyName, companyWebsite, companyDescription } = body;

        if (!name || !email || !password || !companyName) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json(
                { error: "User with this email already exists" },
                { status: 400 }
            );
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create company slug from name
        const slug = companyName
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "");

        // Check if company slug exists, if so add random suffix
        const existingCompany = await prisma.company.findUnique({
            where: { slug },
        });

        const finalSlug = existingCompany
            ? `${slug}-${Math.random().toString(36).substring(7)}`
            : slug;

        // Create company and user in a transaction
        const result = await prisma.$transaction(async (tx) => {
            const company = await tx.company.create({
                data: {
                    name: companyName,
                    slug: finalSlug,
                    website: companyWebsite || null,
                    description: companyDescription || null,
                },
            });

            const user = await tx.user.create({
                data: {
                    name,
                    email,
                    password: hashedPassword,
                    role: "EMPLOYER",
                    companyId: company.id,
                },
            });

            return { user, company };
        });

        return NextResponse.json(
            {
                message: "Employer account created successfully",
                userId: result.user.id,
                companyId: result.company.id,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Employer registration error:", error);
        return NextResponse.json(
            { error: "Failed to create account" },
            { status: 500 }
        );
    }
}
