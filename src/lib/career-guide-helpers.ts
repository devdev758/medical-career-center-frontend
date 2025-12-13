import { prisma } from '@/lib/prisma';

export interface CareerGuideData {
    professionSlug: string;
    professionName: string;
    overview: string;
    keyStats: {
        jobGrowth: string;
        medianSalary: string;
        jobOpenings: string;
        totalEmployed: string;
    };
    rolesDescription: string;
    dailyTasks: string[];
    specializations: Array<{ name: string; description: string }>;
    workEnvironments: string[];
    salaryOverview: string;
    nationalAverage?: string;
    topPayingStates: Array<{ state: string; salary: string }>;
    entryLevelRange?: string;
    experiencedRange?: string;
    benefits: string[];
    educationPath: string;
    requiredDegrees: Array<{ degree: string; description: string }>;
    certifications: Array<{ name: string; issuer: string; description: string }>;
    timeline?: string;
    accreditedPrograms?: string;
    technicalSkills: string[];
    softSkills: string[];
    technologies: string[];
    growthRate?: string;
    projections: string;
    emergingSpecializations: string[];
    careerLadder: Array<{ level: string; title: string; description: string }>;
    schoolsOverview: string;
    topSchools: Array<{ name: string; location: string; programType: string }>;
    programTypes: Array<{ type: string; description: string }>;
    financialAid?: string;
    licensingOverview: string;
    stateRequirements: Record<string, { required: boolean; details: string }>;
    examInfo: Array<{ examName: string; description: string }>;
    renewalProcess?: string;
    jobMarketOverview: string;
    featuredEmployers: string[];
    interviewTips: string;
    resumeKeywords: string[];
    portfolioTips?: string;
    metaTitle?: string;
    metaDescription?: string;
}

export async function createCareerGuide(data: CareerGuideData) {
    return await prisma.careerGuide.create({
        data: {
            professionSlug: data.professionSlug,
            professionName: data.professionName,
            overview: data.overview,
            keyStats: data.keyStats,
            rolesDescription: data.rolesDescription,
            dailyTasks: data.dailyTasks,
            specializations: data.specializations,
            workEnvironments: data.workEnvironments,
            salaryOverview: data.salaryOverview,
            nationalAverage: data.nationalAverage,
            topPayingStates: data.topPayingStates,
            entryLevelRange: data.entryLevelRange,
            experiencedRange: data.experiencedRange,
            benefits: data.benefits,
            educationPath: data.educationPath,
            requiredDegrees: data.requiredDegrees,
            certifications: data.certifications,
            timeline: data.timeline,
            accreditedPrograms: data.accreditedPrograms,
            technicalSkills: data.technicalSkills,
            softSkills: data.softSkills,
            technologies: data.technologies,
            growthRate: data.growthRate,
            projections: data.projections,
            emergingSpecializations: data.emergingSpecializations,
            careerLadder: data.careerLadder,
            schoolsOverview: data.schoolsOverview,
            topSchools: data.topSchools,
            programTypes: data.programTypes,
            financialAid: data.financialAid,
            licensingOverview: data.licensingOverview,
            stateRequirements: data.stateRequirements,
            examInfo: data.examInfo,
            renewalProcess: data.renewalProcess,
            jobMarketOverview: data.jobMarketOverview,
            featuredEmployers: data.featuredEmployers,
            interviewTips: data.interviewTips,
            resumeKeywords: data.resumeKeywords,
            portfolioTips: data.portfolioTips,
            metaTitle: data.metaTitle,
            metaDescription: data.metaDescription,
            slug: `how-to-become-${data.professionSlug}`,
            published: false,
        },
    });
}

export async function getCareerGuide(professionSlug: string) {
    return await prisma.careerGuide.findUnique({
        where: { professionSlug },
    });
}

export async function getAllCareerGuides() {
    return await prisma.careerGuide.findMany({
        where: { published: true },
        orderBy: { professionName: 'asc' },
    });
}

export async function updateCareerGuide(professionSlug: string, data: Partial<CareerGuideData>) {
    return await prisma.careerGuide.update({
        where: { professionSlug },
        data: {
            ...data,
            updatedAt: new Date(),
        },
    });
}

export async function publishCareerGuide(professionSlug: string) {
    return await prisma.careerGuide.update({
        where: { professionSlug },
        data: { published: true },
    });
}
