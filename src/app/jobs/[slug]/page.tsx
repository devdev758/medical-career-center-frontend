import { getJob } from "@/lib/actions/jobs";
import { checkIfApplied } from "@/lib/actions/applications";
import { auth } from "@/auth";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Building2, DollarSign, Globe, ArrowLeft, CheckCircle } from "lucide-react";

export default async function JobPage({ params }: { params: { slug: string } }) {
    const job = await getJob(params.slug);

    if (!job) {
        notFound();
    }

    const session = await auth();
    const hasApplied = session?.user ? await checkIfApplied(job.id) : false;

    return (
        <main className="container mx-auto py-10 px-4 max-w-4xl">
            <Button asChild variant="ghost" className="mb-6 pl-0 hover:pl-0 hover:bg-transparent">
                <Link href="/jobs" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Jobs
                </Link>
            </Button>

            <div className="grid gap-8 md:grid-cols-[1fr_300px]">
                <div>
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold mb-4">{job.title}</h1>
                        <div className="flex flex-wrap gap-4 text-muted-foreground mb-4">
                            <div className="flex items-center gap-1">
                                <Building2 className="w-4 h-4" />
                                {job.company.name}
                            </div>
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
                        </div>
                        <div className="flex gap-2 flex-wrap">
                            <Badge variant={job.remote ? "secondary" : "outline"}>
                                {job.type.replace("_", " ")}
                            </Badge>
                            {job.category && (
                                <Badge variant="default">
                                    {job.category.icon} {job.category.name}
                                </Badge>
                            )}
                            <Badge variant="outline">
                                {job.experienceLevel.replace("_", " ")}
                            </Badge>
                        </div>
                    </div>

                    <div className="prose max-w-none dark:prose-invert">
                        <h3 className="text-xl font-semibold mb-4">Job Description</h3>
                        <div className="whitespace-pre-wrap">{job.description}</div>
                    </div>
                </div>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Apply Now</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {!session?.user ? (
                                <>
                                    <Button className="w-full" size="lg" asChild>
                                        <Link href={`/login?callbackUrl=/jobs/${params.slug}/apply`}>
                                            Sign in to Apply
                                        </Link>
                                    </Button>
                                    <p className="text-xs text-center text-muted-foreground mt-4">
                                        You must be signed in to apply for jobs.
                                    </p>
                                </>
                            ) : hasApplied ? (
                                <>
                                    <Button className="w-full" size="lg" disabled variant="outline">
                                        <CheckCircle className="w-4 h-4 mr-2" />
                                        Already Applied
                                    </Button>
                                    <p className="text-xs text-center text-muted-foreground mt-4">
                                        You have already applied for this job.
                                    </p>
                                    <Button variant="ghost" size="sm" className="w-full mt-2" asChild>
                                        <Link href="/dashboard/applications">
                                            View My Applications
                                        </Link>
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Button className="w-full" size="lg" asChild>
                                        <Link href={`/jobs/${params.slug}/apply`}>
                                            Apply for this Job
                                        </Link>
                                    </Button>
                                    <p className="text-xs text-center text-muted-foreground mt-4">
                                        Submit your application with resume and cover letter.
                                    </p>
                                </>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">About the Company</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {job.company.logo && (
                                <img
                                    src={job.company.logo}
                                    alt={job.company.name}
                                    className="w-16 h-16 object-contain rounded-md border bg-white p-1"
                                />
                            )}
                            <div>
                                <h4 className="font-semibold">{job.company.name}</h4>
                                {job.company.website && (
                                    <a
                                        href={job.company.website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm text-blue-600 hover:underline flex items-center gap-1 mt-1"
                                    >
                                        <Globe className="w-3 h-3" />
                                        Visit Website
                                    </a>
                                )}
                            </div>
                            {job.company.description && (
                                <p className="text-sm text-muted-foreground">
                                    {job.company.description}
                                </p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </main>
    );
}
