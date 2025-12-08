import { getSavedJobs } from "@/lib/actions/saved-jobs";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Building2, MapPin, Clock, DollarSign, ArrowLeft } from "lucide-react";
import { BookmarkButton } from "@/components/bookmark-button";

export default async function SavedJobsPage() {
    const session = await auth();

    if (!session?.user) {
        redirect("/login?callbackUrl=/dashboard/saved-jobs");
    }

    const savedJobs = await getSavedJobs();

    return (
        <main className="container mx-auto py-10 px-4">
            <Link href="/dashboard" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6">
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back to Dashboard
            </Link>

            <div className="mb-8">
                <h1 className="text-4xl font-bold mb-2">Saved Jobs</h1>
                <p className="text-muted-foreground">
                    Jobs you've bookmarked for later.
                </p>
            </div>

            {savedJobs.length === 0 ? (
                <Card>
                    <CardContent className="py-20 text-center">
                        <h3 className="text-xl font-semibold mb-2">No saved jobs yet</h3>
                        <p className="text-muted-foreground mb-6">
                            Start browsing jobs and click the bookmark icon to save them here.
                        </p>
                        <Button asChild>
                            <Link href="/jobs">Browse Jobs</Link>
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-6">
                    {savedJobs.map((job) => (
                        <Card key={job.id} className="hover:shadow-md transition-shadow">
                            <CardHeader>
                                <div className="flex justify-between items-start gap-4">
                                    <div className="flex-1">
                                        <CardTitle className="text-xl mb-1">
                                            <Link href={`/jobs/${job.slug}`} className="hover:underline">
                                                {job.title}
                                            </Link>
                                        </CardTitle>
                                        <CardDescription className="flex items-center gap-2">
                                            <Building2 className="w-4 h-4" />
                                            {job.company?.name || job.companyName || "Confidential"}
                                        </CardDescription>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="flex flex-col gap-2">
                                            <Badge variant={job.remote ? "secondary" : "outline"}>
                                                {job.type.replace("_", " ")}
                                            </Badge>
                                            {job.category && (
                                                <Badge variant="default">
                                                    {job.category.icon} {job.category.name}
                                                </Badge>
                                            )}
                                        </div>
                                        <BookmarkButton jobId={job.id} initialSaved={true} isLoggedIn={true} />
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="flex gap-4 text-sm text-muted-foreground mb-4 flex-wrap">
                                    <div className="flex items-center gap-1">
                                        <MapPin className="w-4 h-4" />
                                        {job.location || "Remote"}
                                    </div>
                                    {job.salary && (
                                        <div className="flex items-center gap-1">
                                            <DollarSign className="w-4 h-4" />
                                            {job.salary}
                                        </div>
                                    )}
                                    <div className="flex items-center gap-1">
                                        <Clock className="w-4 h-4" />
                                        {new Date(job.createdAt).toLocaleDateString()}
                                    </div>
                                    <Badge variant="outline" className="text-xs">
                                        {job.experienceLevel.replace("_", " ")}
                                    </Badge>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button asChild>
                                    <Link href={`/jobs/${job.slug}`}>View Details</Link>
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
        </main>
    );
}
