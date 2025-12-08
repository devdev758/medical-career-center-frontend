import { getUserApplications } from "@/lib/actions/applications";
import { getSavedJobs } from "@/lib/actions/saved-jobs";
import { logout } from "@/lib/actions/auth";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Briefcase, Bookmark, FileText, User, LogOut, Search } from "lucide-react";

export default async function DashboardPage() {
    const session = await auth();

    if (!session?.user) {
        redirect("/login?callbackUrl=/dashboard");
    }

    // Check if user is an employer and redirect to employer dashboard
    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { role: true },
    });

    if (user?.role === "EMPLOYER") {
        redirect("/employer/dashboard");
    }

    const [applications, savedJobs] = await Promise.all([
        getUserApplications(),
        getSavedJobs(),
    ]);

    const pendingApplications = applications.filter(app => app.status === "PENDING").length;
    const reviewedApplications = applications.filter(app => app.status === "REVIEWED").length;

    return (
        <main className="container mx-auto py-10 px-4">
            <div className="mb-8 flex justify-between items-start">
                <div>
                    <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
                    <p className="text-muted-foreground">
                        Welcome back, {session.user.name || session.user.email}!
                    </p>
                </div>
                <form action={logout}>
                    <Button variant="outline" type="submit">
                        <LogOut className="w-4 h-4 mr-2" />
                        Logout
                    </Button>
                </form>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md://grid-cols-3 gap-6 mb-8">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
                        <Briefcase className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{applications.length}</div>
                        <p className="text-xs text-muted-foreground">
                            {pendingApplications} pending, {reviewedApplications} reviewed
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Saved Jobs</CardTitle>
                        <Bookmark className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{savedJobs.length}</div>
                        <p className="text-xs text-muted-foreground">
                            Jobs bookmarked for later
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Profile</CardTitle>
                        <User className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">Active</div>
                        <p className="text-xs text-muted-foreground">
                            {session.user.email}
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="hover:shadow-md transition-shadow">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Briefcase className="w-5 h-5" />
                            <CardTitle>My Applications</CardTitle>
                        </div>
                        <CardDescription>
                            View and manage your job applications
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <p className="text-sm text-muted-foreground">
                                You have {applications.length} application{applications.length !== 1 ? 's' : ''} submitted
                            </p>
                            <Button asChild className="w-full">
                                <Link href="/dashboard/applications">
                                    View Applications
                                </Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Bookmark className="w-5 h-5" />
                            <CardTitle>Saved Jobs</CardTitle>
                        </div>
                        <CardDescription>
                            Access your bookmarked job listings
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <p className="text-sm text-muted-foreground">
                                You have {savedJobs.length} job{savedJobs.length !== 1 ? 's' : ''} saved
                            </p>
                            <Button asChild className="w-full">
                                <Link href="/dashboard/saved-jobs">
                                    View Saved Jobs
                                </Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Search className="w-5 h-5" />
                            <CardTitle>Browse Jobs</CardTitle>
                        </div>
                        <CardDescription>
                            Search and discover new opportunities
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <p className="text-sm text-muted-foreground">
                                Explore medical career opportunities
                            </p>
                            <Button asChild className="w-full" variant="outline">
                                <Link href="/jobs">
                                    Browse All Jobs
                                </Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <User className="w-5 h-5" />
                            <CardTitle>Account Settings</CardTitle>
                        </div>
                        <CardDescription>
                            Manage your profile and preferences
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <p className="text-sm text-muted-foreground">
                                Update your information and settings
                            </p>
                            <Button asChild className="w-full" variant="outline">
                                <Link href="/dashboard/profile">
                                    Edit Profile
                                </Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Activity */}
            {applications.length > 0 && (
                <div className="mt-8">
                    <h2 className="text-2xl font-bold mb-4">Recent Applications</h2>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="space-y-4">
                                {applications.slice(0, 3).map((app) => (
                                    <div key={app.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                                        <div>
                                            <p className="font-medium">{app.job.title}</p>
                                            <p className="text-sm text-muted-foreground">{app.job.company?.name || app.job.companyName || "Confidential"}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-medium">{app.status}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {new Date(app.appliedAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {applications.length > 3 && (
                                <Button asChild variant="ghost" className="w-full mt-4">
                                    <Link href="/dashboard/applications">
                                        View All Applications →
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
