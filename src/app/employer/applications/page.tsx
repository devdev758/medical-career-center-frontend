import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getEmployerApplications } from "@/lib/actions/employer";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Building2, Calendar, User, ArrowLeft, Download } from "lucide-react";

export default async function EmployerApplicationsPage() {
    const session = await auth();

    if (!session?.user) {
        redirect("/login?callbackUrl=/employer/applications");
    }

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        include: { company: true },
    });

    if (user?.role !== "EMPLOYER" || !user.company) {
        redirect("/dashboard");
    }

    const applications = await getEmployerApplications();

    const getStatusColor = (status: string) => {
        switch (status) {
            case "PENDING":
                return "default";
            case "REVIEWED":
                return "secondary";
            case "SHORTLISTED":
                return "outline";
            case "REJECTED":
                return "destructive";
            case "HIRED":
                return "default";
            default:
                return "default";
        }
    };

    return (
        <main className="container mx-auto py-10 px-4">
            <Link href="/employer/dashboard" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6">
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back to Dashboard
            </Link>

            <div className="mb-8">
                <h1 className="text-4xl font-bold mb-2">Applications</h1>
                <p className="text-muted-foreground">
                    Manage candidate applications for your job postings
                </p>
            </div>

            {applications.length === 0 ? (
                <Card>
                    <CardContent className="py-20 text-center">
                        <h3 className="text-xl font-semibold mb-2">No applications yet</h3>
                        <p className="text-muted-foreground mb-6">
                            Applications will appear here once candidates apply to your jobs.
                        </p>
                        <Button asChild>
                            <Link href="/employer/jobs/new">Post a Job</Link>
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-6">
                    {applications.map((application) => (
                        <Card key={application.id}>
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <CardTitle className="text-xl mb-1">
                                            {application.user.name || "Anonymous"}
                                        </CardTitle>
                                        <CardDescription className="flex items-center gap-4 flex-wrap">
                                            <span className="flex items-center gap-1">
                                                <Building2 className="w-4 h-4" />
                                                {application.job.title}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Calendar className="w-4 h-4" />
                                                Applied {new Date(application.appliedAt).toLocaleDateString()}
                                            </span>
                                        </CardDescription>
                                    </div>
                                    <Badge variant={getStatusColor(application.status)}>
                                        {application.status}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <User className="w-4 h-4" />
                                        {application.user.email}
                                        {application.phone && ` • ${application.phone}`}
                                    </div>

                                    {application.coverLetter && (
                                        <div>
                                            <p className="text-sm font-medium mb-1">Cover Letter:</p>
                                            <p className="text-sm text-muted-foreground line-clamp-3">
                                                {application.coverLetter}
                                            </p>
                                        </div>
                                    )}

                                    {application.notes && (
                                        <div className="bg-muted p-3 rounded">
                                            <p className="text-sm font-medium mb-1">Internal Notes:</p>
                                            <p className="text-sm text-muted-foreground">
                                                {application.notes}
                                            </p>
                                        </div>
                                    )}

                                    <div className="flex gap-2 flex-wrap">
                                        <Button variant="default" size="sm" asChild>
                                            <Link href={`/employer/applications/${application.id}`}>
                                                View Details
                                            </Link>
                                        </Button>
                                        {application.resumeUrl && (
                                            <Button variant="outline" size="sm" asChild>
                                                <Link href={`/employer/applications/${application.id}/resume`} target="_blank">
                                                    <Download className="w-4 h-4 mr-1" />
                                                    Resume
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
