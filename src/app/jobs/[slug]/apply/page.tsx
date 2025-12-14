import { getJob } from "@/lib/actions/jobs";
import { checkIfApplied } from "@/lib/actions/applications";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ApplyForm } from "@/components/jobs/ApplyForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function ApplyPage({ params }: { params: { slug: string } }) {
    const session = await auth();

    if (!session?.user?.id) {
        redirect(`/login?callbackUrl=/jobs/${params.slug}/apply`);
    }

    const job = await getJob(params.slug);

    if (!job) {
        redirect("/jobs");
    }

    const hasApplied = await checkIfApplied(job.id);

    if (hasApplied) {
        redirect(`/jobs/${params.slug}`);
    }

    // Fetch user's resumes
    const resumes = await prisma.resume.findMany({
        where: { userId: session.user.id },
        orderBy: [
            { isPrimary: 'desc' },
            { updatedAt: 'desc' }
        ],
        select: {
            id: true,
            name: true,
            isPrimary: true,
            pdfGeneratedAt: true,
        }
    });

    return (
        <main className="container mx-auto py-10 px-4 max-w-2xl">
            <Link href={`/jobs/${params.slug}`} className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6">
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back to Job
            </Link>

            <Card>
                <CardHeader>
                    <CardTitle>Apply for {job.title}</CardTitle>
                    <CardDescription>
                        at {job.company?.name || job.companyName || "Confidential"}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ApplyForm
                        jobId={job.id}
                        jobSlug={params.slug}
                        userEmail={session.user.email || ""}
                        resumes={resumes}
                    />
                </CardContent>
            </Card>
        </main>
    );
}
