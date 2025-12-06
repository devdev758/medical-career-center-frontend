import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Plus, Edit, Trash2 } from "lucide-react";

export default async function EmployerJobsPage() {
    const session = await auth();

    if (!session?.user) {
        redirect("/login?callbackUrl=/employer/jobs");
    }

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        include: { company: true },
    });

    if (user?.role !== "EMPLOYER" || !user.company) {
        redirect("/dashboard");
    }

    const jobs = await prisma.job.findMany({
        where: { companyId: user.company.id },
        include: {
            category: true,
            _count: {
                select: { applications: true },
            },
        },
        orderBy: { createdAt: "desc" },
    });

    return (
        <main className="container mx-auto py-10 px-4">
            <Link href="/employer/dashboard" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6">
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back to Dashboard
            </Link>

            <div className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-4xl font-bold mb-2">My Jobs</h1>
                    <p className="text-muted-foreground">
                        Manage your job postings
                    </p>
                </div>
                <Button asChild>
                    <Link href="/employer/jobs/new">
                        <Plus className="w-4 h-4 mr-2" />
                        Post New Job
                    </Link>
                </Button>
            </div>

            {jobs.length === 0 ? (
                <Card>
                    <CardContent className="py-20 text-center">
                        <h3 className="text-xl font-semibold mb-2">No jobs posted yet</h3>
                        <p className="text-muted-foreground mb-6">
                            Create your first job posting to start receiving applications.
                        </p>
                        <Button asChild>
                            <Link href="/employer/jobs/new">
                                <Plus className="w-4 h-4 mr-2" />
                                Post a Job
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-6">
                    {jobs.map((job) => (
                        <Card key={job.id}>
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <CardTitle className="text-xl mb-1">{job.title}</CardTitle>
                                        <CardDescription>
                                            {job.location || "Remote"} • {job.type.replace("_", " ")}
                                        </CardDescription>
                                    </div>
                                    <div className="flex gap-2">
                                        {job.category && (
                                            <Badge variant="outline">
                                                {job.category.icon} {job.category.name}
                                            </Badge>
                                        )}
                                        <Badge variant={job.remote ? "secondary" : "outline"}>
                                            {job.remote ? "Remote" : "On-site"}
                                        </Badge>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex gap-4 text-sm text-muted-foreground">
                                        <span>{job._count.applications} applications</span>
                                        <span>•</span>
                                        <span>Posted {new Date(job.createdAt).toLocaleDateString()}</span>
                                        {job.salary && (
                                            <>
                                                <span>•</span>
                                                <span>{job.salary}</span>
                                            </>
                                        )}
                                    </div>

                                    <div className="flex gap-2">
                                        <Button variant="outline" size="sm" asChild>
                                            <Link href={`/jobs/${job.slug}`}>
                                                View Listing
                                            </Link>
                                        </Button>
                                        <Button variant="outline" size="sm" asChild>
                                            <Link href={`/employer/jobs/${job.id}/edit`}>
                                                <Edit className="w-4 h-4 mr-1" />
                                                Edit
                                            </Link>
                                        </Button>
                                        {job._count.applications > 0 && (
                                            <Button variant="outline" size="sm" asChild>
                                                <Link href={`/employer/applications?job=${job.id}`}>
                                                    View Applications ({job._count.applications})
                                                </Link>
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </main>
    );
}
