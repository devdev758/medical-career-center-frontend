"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function getEmployerApplications(filters?: {
    search?: string;
    status?: string;
    jobId?: string;
    dateFrom?: string;
    dateTo?: string;
}) {
    const session = await auth();

    if (!session?.user?.id) {
        throw new Error("Unauthorized");
    }

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        include: { company: true },
    });

    if (user?.role !== "EMPLOYER" || !user.company) {
        throw new Error("Unauthorized");
    }

    // Build dynamic where clause
    const where: any = {
        job: {
            companyId: user.company.id,
            ...(filters?.jobId ? { id: filters.jobId } : {}),
        },
    };

    // Add status filter
    if (filters?.status && filters.status !== "ALL") {
        where.status = filters.status;
    }

    // Add date range filter
    if (filters?.dateFrom || filters?.dateTo) {
        where.appliedAt = {};
        if (filters.dateFrom) {
            where.appliedAt.gte = new Date(filters.dateFrom);
        }
        if (filters.dateTo) {
            where.appliedAt.lte = new Date(filters.dateTo);
        }
    }

    // Add search filter (candidate name or email)
    if (filters?.search) {
        where.user = {
            OR: [
                { name: { contains: filters.search, mode: "insensitive" } },
                { email: { contains: filters.search, mode: "insensitive" } },
            ],
        };
    }

    const applications = await prisma.application.findMany({
        where,
        include: {
            job: {
                include: {
                    category: true,
                },
            },
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
        },
        orderBy: {
            appliedAt: "desc",
        },
    });

    return applications;
}

export async function updateApplicationStatus(applicationId: string, status: string) {
    const session = await auth();

    if (!session?.user?.id) {
        throw new Error("Unauthorized");
    }

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        include: { company: true },
    });

    if (user?.role !== "EMPLOYER" || !user.company) {
        throw new Error("Unauthorized");
    }

    // Verify the application belongs to this employer's company
    const application = await prisma.application.findUnique({
        where: { id: applicationId },
        include: { job: true },
    });

    if (!application || application.job.companyId !== user.company.id) {
        throw new Error("Unauthorized");
    }

    await prisma.application.update({
        where: { id: applicationId },
        data: { status },
    });

    revalidatePath("/employer/applications");
    revalidatePath("/employer/dashboard");
}

export async function addApplicationNote(applicationId: string, notes: string) {
    const session = await auth();

    if (!session?.user?.id) {
        throw new Error("Unauthorized");
    }

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        include: { company: true },
    });

    if (user?.role !== "EMPLOYER" || !user.company) {
        throw new Error("Unauthorized");
    }

    // Verify the application belongs to this employer's company
    const application = await prisma.application.findUnique({
        where: { id: applicationId },
        include: { job: true },
    });

    if (!application || application.job.companyId !== user.company.id) {
        throw new Error("Unauthorized");
    }

    await prisma.application.update({
        where: { id: applicationId },
        data: { notes },
    });

    revalidatePath("/employer/applications");
}

export async function downloadResume(applicationId: string) {
    const session = await auth();

    if (!session?.user?.id) {
        throw new Error("Unauthorized");
    }

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        include: { company: true },
    });

    if (user?.role !== "EMPLOYER" || !user.company) {
        throw new Error("Unauthorized");
    }

    const application = await prisma.application.findUnique({
        where: { id: applicationId },
        include: { job: true, user: true },
    });

    if (!application || application.job.companyId !== user.company.id) {
        throw new Error("Unauthorized");
    }

    return {
        resumeUrl: application.resumeUrl,
        candidateName: application.user.name || "candidate",
    };
}
