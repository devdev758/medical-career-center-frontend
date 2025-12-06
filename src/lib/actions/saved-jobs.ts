"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function saveJob(jobId: string) {
    const session = await auth();

    if (!session?.user?.id) {
        throw new Error("You must be logged in to save jobs");
    }

    // Check if already saved
    const existing = await prisma.savedJob.findUnique({
        where: {
            userId_jobId: {
                userId: session.user.id,
                jobId,
            },
        },
    });

    if (existing) {
        return; // Already saved
    }

    await prisma.savedJob.create({
        data: {
            userId: session.user.id,
            jobId,
        },
    });

    revalidatePath("/jobs");
    revalidatePath("/dashboard/saved-jobs");
}

export async function unsaveJob(jobId: string) {
    const session = await auth();

    if (!session?.user?.id) {
        throw new Error("You must be logged in");
    }

    await prisma.savedJob.delete({
        where: {
            userId_jobId: {
                userId: session.user.id,
                jobId,
            },
        },
    });

    revalidatePath("/jobs");
    revalidatePath("/dashboard/saved-jobs");
}

export async function getSavedJobs() {
    const session = await auth();

    if (!session?.user?.id) {
        return [];
    }

    const savedJobs = await prisma.savedJob.findMany({
        where: {
            userId: session.user.id,
        },
        include: {
            job: {
                include: {
                    company: true,
                    category: true,
                },
            },
        },
        orderBy: {
            savedAt: "desc",
        },
    });

    return savedJobs.map(saved => saved.job);
}

export async function checkIfSaved(jobId: string) {
    const session = await auth();

    if (!session?.user?.id) {
        return false;
    }

    const saved = await prisma.savedJob.findUnique({
        where: {
            userId_jobId: {
                userId: session.user.id,
                jobId,
            },
        },
    });

    return !!saved;
}
