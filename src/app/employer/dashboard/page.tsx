import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Briefcase, Users, Clock, CheckCircle, Plus } from "lucide-react";

export default async function EmployerDashboardPage() {
    const session = await auth();

    if (!session?.user) {
        redirect("/login?callbackUrl=/employer/dashboard");
    }

    // Check if user is an employer
    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        include: { company: true },
    });

    if (user?.role !== "EMPLOYER" || !user.company) {
        redirect("/dashboard");
    }

    // Get stats
    const [jobs, applications] = await Promise.all([
        prisma.job.findMany({
            where: { companyId: user.company.id },
            include: {
                _count: {
                    select: { applications: true },
                },
            },
        }),
        prisma.application.findMany({
            where: {
                job: {
                    companyId: user.company.id,
                },
            },
        }),
    ]);

    const activeJobs = jobs.length;
    const totalApplications = applications.length;
    const pendingApplications = applications.filter(app => app.status === "PENDING").length;
    const hiredCandidates = applications.filter(app => app.status === "HIRED").length;

    return (
        <main className="container mx-auto py-10 px-4">
            <div className="mb-8">
                <h1 className="text-4xl font-bold mb-2">Employer Dashboard</h1>
                <p className="text-muted-foreground">
                    Welcome back, {user.company.name}!
                </p>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
                        <Briefcase className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{activeJobs}</div>
                        <p className="text-xs text-muted-foreground">
                            Job postings
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalApplications}</div>
                        <p className="text-xs text-muted-foreground">
                            All time
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{pendingApplications}</div>
                        <p className="text-xs text-muted-foreground">
                            Need attention
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Hired</CardTitle>
                        <CheckCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{hiredCandidates}</div>
                        <p className="text-xs text-muted-foreground">
                            Successful hires
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <Card className="hover:shadow-md transition-shadow">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Plus className="w-5 h-5" />
                            <CardTitle>Post a New Job</CardTitle>
                        </div>
                        <CardDescription>
                            Create a new job posting to attract candidates
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button asChild className="w-full">
                            <Link href="/employer/jobs/new">
                                <Plus className="w-4 h-4 mr-2" />
                                Post Job
                            </Link>
                        </Button>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Briefcase className="w-5 h-5" />
                            <CardTitle>Manage Jobs</CardTitle>
                        </div>
                        <CardDescription>
                            View and edit your job postings
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button asChild className="w-full" variant="outline">
                            <Link href="/employer/jobs">
                                View All Jobs
                            </Link>
                        </Button>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Users className="w-5 h-5" />
                            <CardTitle>Review Applications</CardTitle>
                        </div>
                        <CardDescription>
                            Manage candidate applications
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <p className="text-sm text-muted-foreground">
                                {pendingApplications} application{pendingApplications !== 1 ? 's' : ''} pending review
                            </p>
                            <Button asChild className="w-full" variant="outline">
                                <Link href="/employer/applications">
                                    View Applications
                                </Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Briefcase className="w-5 h-5" />
                            <CardTitle>Company Profile</CardTitle>
                        </div>
                        <CardDescription>
                            Update your company information
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button asChild className="w-full" variant="outline">
                            <Link href="/employer/company">
                                Edit Profile
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Jobs */}
            {jobs.length > 0 && (
                <div>
                    <h2 className="text-2xl font-bold mb-4">Recent Job Postings</h2>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="space-y-4">
                                {jobs.slice(0, 5).map((job) => (
                                    <div key={job.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                                        <div>
                                            <p className="font-medium">{job.title}</p>
                                            <p className="text-sm text-muted-foreground">{job.location || "Remote"}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-medium">{job._count.applications} applications</p>
                                            <p className="text-xs text-muted-foreground">
                                                {new Date(job.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {jobs.length > 5 && (
                                <Button asChild variant="ghost" className="w-full mt-4">
                                    <Link href="/employer/jobs">
                                        View All Jobs →
                                    </Link>
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                </div>
            )}
        </main>
    );
}
