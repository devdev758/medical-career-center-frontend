"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function getEmployerApplications(jobId?: string) {
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

    const applications = await prisma.application.findMany({
        where: {
            job: {
                companyId: user.company.id,
                ...(jobId ? { id: jobId } : {}),
            },
        },
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
