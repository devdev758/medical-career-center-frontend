"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

interface SearchFilters {
    keyword?: string;
    location?: string;
    categoryId?: string;
    experienceLevel?: string;
    jobType?: string;
    remote?: boolean;
}

export async function searchJobs(filters: SearchFilters = {}) {
    try {
        const where: any = {};

        // Keyword search (title, description, company name)
        if (filters.keyword) {
            where.OR = [
                { title: { contains: filters.keyword, mode: 'insensitive' } },
                { description: { contains: filters.keyword, mode: 'insensitive' } },
                { company: { name: { contains: filters.keyword, mode: 'insensitive' } } },
            ];
        }

        // Location filter
        if (filters.location) {
            where.location = { contains: filters.location, mode: 'insensitive' };
        }

        // Category filter
        if (filters.categoryId) {
            where.categoryId = filters.categoryId;
        }

        // Experience level filter
        if (filters.experienceLevel) {
            where.experienceLevel = filters.experienceLevel;
        }

        // Job type filter
        if (filters.jobType) {
            where.type = filters.jobType;
        }

        // Remote filter
        if (filters.remote !== undefined) {
            where.remote = filters.remote;
        }

        const jobs = await prisma.job.findMany({
            where,
            include: {
                company: true,
                category: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        return jobs;
    } catch (error) {
        console.error("Failed to search jobs:", error);
        return [];
    }
}

export async function getJobs() {
    return searchJobs();
}

export async function getJob(slug: string) {
    try {
        const job = await prisma.job.findUnique({
            where: { slug },
            include: {
                company: true,
                category: true,
            },
        });
        return job;
    } catch (error) {
        console.error("Failed to fetch job:", error);
        return null;
    }
}

export async function createJob(formData: FormData) {
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const location = formData.get("location") as string;
    const salary = formData.get("salary") as string;
    const type = formData.get("type") as string;
    const remote = formData.get("remote") === "on";
    const companyName = formData.get("companyName") as string;
    const categoryId = formData.get("categoryId") as string;
    const experienceLevel = formData.get("experienceLevel") as string;

    // Simple slug generation
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-" + Date.now();
    const companySlug = companyName.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-" + Date.now();

    try {
        // Create company first (or find existing - simplified for now)
        const company = await prisma.company.create({
            data: {
                name: companyName,
                slug: companySlug,
            },
        });

        await prisma.job.create({
            data: {
                title,
                slug,
                description,
                location,
                salary,
                type,
                remote,
                experienceLevel,
                companyId: company.id,
                categoryId: categoryId || null,
            },
        });

        revalidatePath("/jobs");
    } catch (error) {
        console.error("Failed to create job:", error);
        throw error;
    }
}
