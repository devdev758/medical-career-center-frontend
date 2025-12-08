import { searchJobs } from "@/lib/actions/jobs";
import { getCategories } from "@/lib/actions/categories";
import { checkIfSaved } from "@/lib/actions/saved-jobs";
import { auth } from "@/auth";
import Link from "next/link";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Building2, Clock, DollarSign } from "lucide-react";
import { JobSearch } from "@/components/job-search";
import { BookmarkButton } from "@/components/bookmark-button";

export default async function JobsPage({
    searchParams,
}: {
    searchParams: { [key: string]: string | undefined };
}) {
    const categories = await getCategories();
    const session = await auth();

    const filters = {
        keyword: searchParams.q,
        location: searchParams.location,
        categoryId: searchParams.category === "all" ? undefined : searchParams.category,
        experienceLevel: searchParams.level === "all" ? undefined : searchParams.level,
        jobType: searchParams.type === "all" ? undefined : searchParams.type,
        remote: searchParams.remote === "true" ? true : undefined,
    };

    const jobs = await searchJobs(filters);

    // Check saved status for all jobs
    const jobsWithSavedStatus = await Promise.all(
        jobs.map(async (job) => ({
            ...job,
            isSaved: await checkIfSaved(job.id),
        }))
    );

    return (
        <main className="container mx-auto py-10 px-4">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-4xl font-bold mb-2">Medical Jobs</h1>
                    <p className="text-muted-foreground">
                        Find your next career opportunity in healthcare.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6">
                {/* Search Sidebar */}
                <aside>
                    <JobSearch categories={categories} />
                </aside>

                {/* Job Listings */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                            {jobs.length} {jobs.length === 1 ? "job" : "jobs"} found
                        </p>
                    </div>

                    {jobs.length === 0 ? (
                        <div className="text-center py-20 bg-muted rounded-lg">
                            <h3 className="text-xl font-semibold">No jobs found</h3>
                            <p className="text-muted-foreground">
                                Try adjusting your search filters.
                            </p>
                        </div>
                    ) : (
                        <div className="grid gap-6">
                            {jobsWithSavedStatus.map((job) => (
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
                                                <BookmarkButton
                                                    jobId={job.id}
                                                    initialSaved={job.isSaved}
                                                    isLoggedIn={!!session?.user}
                                                />
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
                </div>
            </div>
        </main>
    );
}
