"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function getProfile() {
    const session = await auth();

    if (!session?.user?.id) {
        throw new Error("Unauthorized");
    }

    const profile = await prisma.profile.findUnique({
        where: { userId: session.user.id },
    });

    return profile;
}

export async function updateProfile(data: any) {
    const session = await auth();

    if (!session?.user?.id) {
        throw new Error("Unauthorized");
    }

    const profile = await prisma.profile.upsert({
        where: { userId: session.user.id },
        update: data,
        create: {
            userId: session.user.id,
            ...data,
        },
    });

    await calculateProfileCompletion(session.user.id);
    revalidatePath("/dashboard/profile");

    return profile;
}

export async function calculateProfileCompletion(userId: string) {
    let completion = 0;

    const profile = await prisma.profile.findUnique({
        where: { userId },
    });

    // Personal info (15%)
    if (profile?.firstName && profile?.lastName && profile?.phone) {
        completion += 15;
    }

    // Professional info (15%)
    if (profile?.headline && profile?.bio) {
        completion += 15;
    }

    // Work experience (20%)
    const workExperience = await prisma.workExperience.count({
        where: { userId },
    });
    if (workExperience > 0) completion += 20;

    // Education (20%)
    const education = await prisma.education.count({
        where: { userId },
    });
    if (education > 0) completion += 20;

    // Skills (15%)
    const skills = await prisma.skill.count({
        where: { userId },
    });
    if (skills >= 3) completion += 15;

    // Certifications (10%)
    const certifications = await prisma.certification.count({
        where: { userId },
    });
    if (certifications > 0) completion += 10;

    // Resume (5%)
    if (profile?.resumeUrl) completion += 5;

    await prisma.profile.update({
        where: { userId },
        data: { profileComplete: completion },
    });

    return completion;
}

export async function getWorkExperience() {
    const session = await auth();

    if (!session?.user?.id) {
        throw new Error("Unauthorized");
    }

    const experiences = await prisma.workExperience.findMany({
        where: { userId: session.user.id },
        orderBy: [
            { isCurrent: "desc" },
            { startDate: "desc" },
        ],
    });

    return experiences;
}

export async function createWorkExperience(data: {
    title: string;
    company: string;
    location?: string;
    startDate: Date;
    endDate?: Date;
    isCurrent: boolean;
    description?: string;
}) {
    const session = await auth();

    if (!session?.user?.id) {
        throw new Error("Unauthorized");
    }

    const experience = await prisma.workExperience.create({
        data: {
            userId: session.user.id,
            ...data,
        },
    });

    await calculateProfileCompletion(session.user.id);
    revalidatePath("/dashboard/profile");

    return experience;
}

export async function deleteWorkExperience(id: string) {
    const session = await auth();

    if (!session?.user?.id) {
        throw new Error("Unauthorized");
    }

    await prisma.workExperience.delete({
        where: { id, userId: session.user.id },
    });

    await calculateProfileCompletion(session.user.id);
    revalidatePath("/dashboard/profile");
}

export async function getEducation() {
    const session = await auth();

    if (!session?.user?.id) {
        throw new Error("Unauthorized");
    }

    const education = await prisma.education.findMany({
        where: { userId: session.user.id },
        orderBy: [
            { isCurrent: "desc" },
            { startDate: "desc" },
        ],
    });

    return education;
}

export async function createEducation(data: {
    institution: string;
    degree: string;
    fieldOfStudy?: string;
    startDate: Date;
    endDate?: Date;
    isCurrent: boolean;
    grade?: string;
    description?: string;
}) {
    const session = await auth();

    if (!session?.user?.id) {
        throw new Error("Unauthorized");
    }

    const education = await prisma.education.create({
        data: {
            userId: session.user.id,
            ...data,
        },
    });

    await calculateProfileCompletion(session.user.id);
    revalidatePath("/dashboard/profile");

    return education;
}

export async function deleteEducation(id: string) {
    const session = await auth();

    if (!session?.user?.id) {
        throw new Error("Unauthorized");
    }

    await prisma.education.delete({
        where: { id, userId: session.user.id },
    });

    await calculateProfileCompletion(session.user.id);
    revalidatePath("/dashboard/profile");
}

export async function getSkills() {
    const session = await auth();

    if (!session?.user?.id) {
        throw new Error("Unauthorized");
    }

    const skills = await prisma.skill.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: "desc" },
    });

    return skills;
}

export async function addSkill(data: {
    name: string;
    level?: string;
    yearsOfExperience?: number;
}) {
    const session = await auth();

    if (!session?.user?.id) {
        throw new Error("Unauthorized");
    }

    const skill = await prisma.skill.create({
        data: {
            userId: session.user.id,
            ...data,
        },
    });

    await calculateProfileCompletion(session.user.id);
    revalidatePath("/dashboard/profile");

    return skill;
}

export async function deleteSkill(id: string) {
    const session = await auth();

    if (!session?.user?.id) {
        throw new Error("Unauthorized");
    }

    await prisma.skill.delete({
        where: { id, userId: session.user.id },
    });

    await calculateProfileCompletion(session.user.id);
    revalidatePath("/dashboard/profile");
}

export async function getCertifications() {
    const session = await auth();

    if (!session?.user?.id) {
        throw new Error("Unauthorized");
    }

    const certifications = await prisma.certification.findMany({
        where: { userId: session.user.id },
        orderBy: { issueDate: "desc" },
    });

    return certifications;
}

export async function createCertification(data: {
    name: string;
    issuingOrg: string;
    issueDate: Date;
    expiryDate?: Date;
    credentialId?: string;
    credentialUrl?: string;
}) {
    const session = await auth();

    if (!session?.user?.id) {
        throw new Error("Unauthorized");
    }

    const certification = await prisma.certification.create({
        data: {
            userId: session.user.id,
            ...data,
        },
    });

    await calculateProfileCompletion(session.user.id);
    revalidatePath("/dashboard/profile");

    return certification;
}

export async function deleteCertification(id: string) {
    const session = await auth();

    if (!session?.user?.id) {
        throw new Error("Unauthorized");
    }

    await prisma.certification.delete({
        where: { id, userId: session.user.id },
    });

    await calculateProfileCompletion(session.user.id);
    revalidatePath("/dashboard/profile");
}
