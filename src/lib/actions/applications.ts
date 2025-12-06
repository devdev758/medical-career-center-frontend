"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function applyForJob(jobId: string, formData: FormData) {
    const session = await auth();

    if (!session?.user?.id) {
        throw new Error("You must be logged in to apply for jobs");
    }

    const phone = formData.get("phone") as string;
    const coverLetter = formData.get("coverLetter") as string;
    const resumeFile = formData.get("resume") as File;

    // Check if already applied
    const existingApplication = await prisma.application.findUnique({
        where: {
            jobId_userId: {
                jobId,
                userId: session.user.id,
            },
        },
    });

    if (existingApplication) {
        throw new Error("You have already applied for this job");
    }

    // Convert resume to base64
    let resumeData = null;
    if (resumeFile && resumeFile.size > 0) {
        const bytes = await resumeFile.arrayBuffer();
        const buffer = Buffer.from(bytes);
        resumeData = `data:${resumeFile.type};base64,${buffer.toString("base64")}`;
    }

    // Create application
    await prisma.application.create({
        data: {
            jobId,
            userId: session.user.id,
            phone,
            coverLetter,
            resumeUrl: resumeData,
            status: "PENDING",
        },
    });

    revalidatePath(`/jobs/${jobId}`);
    revalidatePath("/dashboard/applications");
}

export async function getUserApplications() {
    const session = await auth();

    if (!session?.user?.id) {
        return [];
    }

    const applications = await prisma.application.findMany({
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
            appliedAt: "desc",
        },
    });

    return applications;
}

export async function checkIfApplied(jobId: string) {
    const session = await auth();

    if (!session?.user?.id) {
        return false;
    }

    const application = await prisma.application.findUnique({
        where: {
            jobId_userId: {
                jobId,
                userId: session.user.id,
            },
        },
    });

    return !!application;
}

export async function withdrawApplication(applicationId: string) {
    const session = await auth();

    if (!session?.user?.id) {
        throw new Error("You must be logged in");
    }

    // Verify the application belongs to the user
    const application = await prisma.application.findUnique({
        where: { id: applicationId },
    });

    if (!application || application.userId !== session.user.id) {
        throw new Error("Application not found");
    }

    if (application.status !== "PENDING") {
        throw new Error("Can only withdraw pending applications");
    }

    await prisma.application.delete({
        where: { id: applicationId },
    });

    revalidatePath("/dashboard/applications");
}
