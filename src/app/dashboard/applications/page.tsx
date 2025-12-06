import { getUserApplications, withdrawApplication } from "@/lib/actions/applications";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Building2, MapPin, Calendar, ArrowLeft } from "lucide-react";

export default async function ApplicationsPage() {
    const session = await auth();

    if (!session?.user) {
        redirect("/login?callbackUrl=/dashboard/applications");
    }

    const applications = await getUserApplications();

    async function handleWithdraw(applicationId: string) {
        "use server";
        await withdrawApplication(applicationId);
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case "PENDING":
                return "default";
            case "REVIEWED":
                return "secondary";
            case "REJECTED":
                return "destructive";
            case "HIRED":
                return "outline";
            default:
                return "default";
        }
    };

    return (
        <main className="container mx-auto py-10 px-4">
            <div className="mb-8">
                <h1 className="text-4xl font-bold mb-2">My Applications</h1>
                <p className="text-muted-foreground">
                    Track your job applications and their status.
                </p>
            </div>

            {applications.length === 0 ? (
                <Card>
                    <CardContent className="py-20 text-center">
                        <h3 className="text-xl font-semibold mb-2">No applications yet</h3>
                        <p className="text-muted-foreground mb-6">
                            Start applying for jobs to see them here.
                        </p>
                        <Button asChild>
                            <Link href="/jobs">Browse Jobs</Link>
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
                                            <Link href={`/jobs/${application.job.slug}`} className="hover:underline">
                                                {application.job.title}
                                            </Link>
                                        </CardTitle>
                                        <CardDescription className="flex items-center gap-2">
                                            <Building2 className="w-4 h-4" />
                                            {application.job.company.name}
                                        </CardDescription>
                                    </div>
                                    <Badge variant={getStatusColor(application.status)}>
                                        {application.status}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="flex gap-4 text-sm text-muted-foreground mb-4 flex-wrap">
                                    <div className="flex items-center gap-1">
                                        <MapPin className="w-4 h-4" />
                                        {application.job.location || "Remote"}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Calendar className="w-4 h-4" />
                                        Applied {new Date(application.appliedAt).toLocaleDateString()}
                                    </div>
                                    {application.job.category && (
                                        <Badge variant="outline" className="text-xs">
                                            {application.job.category.icon} {application.job.category.name}
                                        </Badge>
                                    )}
                                </div>

                                {application.coverLetter && (
                                    <div className="mb-4">
                                        <p className="text-sm font-medium mb-1">Cover Letter:</p>
                                        <p className="text-sm text-muted-foreground line-clamp-2">
                                            {application.coverLetter}
                                        </p>
                                    </div>
                                )}

                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm" asChild>
                                        <Link href={`/jobs/${application.job.slug}`}>View Job</Link>
                                    </Button>
                                    {application.status === "PENDING" && (
                                        <form action={handleWithdraw.bind(null, application.id)}>
                                            <Button variant="ghost" size="sm" type="submit">
                                                Withdraw
                                            </Button>
                                        </form>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </main>
    );
}
