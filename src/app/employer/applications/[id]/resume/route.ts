import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            include: { company: true },
        });

        if (user?.role !== "EMPLOYER" || !user.company) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const application = await prisma.application.findUnique({
            where: { id: params.id },
            include: { job: true, user: true },
        });

        if (!application || application.job.companyId !== user.company.id) {
            return NextResponse.json({ error: "Not found" }, { status: 404 });
        }

        if (!application.resumeUrl) {
            return NextResponse.json({ error: "No resume available" }, { status: 404 });
        }

        // Decode base64 resume
        const base64Data = application.resumeUrl.split(",")[1];
        const buffer = Buffer.from(base64Data, "base64");

        const candidateName = application.user.name?.replace(/\s+/g, "_") || "candidate";
        const filename = `${candidateName}_resume.pdf`;

        return new NextResponse(buffer, {
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": `attachment; filename="${filename}"`,
            },
        });
    } catch (error) {
        console.error("Resume download error:", error);
        return NextResponse.json({ error: "Failed to download resume" }, { status: 500 });
    }
}
