import { getJobs } from "@/lib/actions/jobs";
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

export default async function JobsPage() {
    const jobs = await getJobs();

    return (
        <main className="container mx-auto py-10 px-4">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-4xl font-bold mb-2">Medical Jobs</h1>
                    <p className="text-muted-foreground">
                        Find your next career opportunity in healthcare.
                    </p>
                </div>
                {/* TODO: Add Post Job button for Admins */}
            </div>

            <div className="grid gap-6">
                {jobs.length === 0 ? (
                    <div className="text-center py-20 bg-muted rounded-lg">
                        <h3 className="text-xl font-semibold">No jobs found</h3>
                        <p className="text-muted-foreground">Check back later for new opportunities.</p>
                    </div>
                ) : (
                    jobs.map((job) => (
                        <Card key={job.id} className="hover:shadow-md transition-shadow">
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle className="text-xl mb-1">
                                            <Link href={`/jobs/${job.slug}`} className="hover:underline">
                                                {job.title}
                                            </Link>
                                        </CardTitle>
                                        <CardDescription className="flex items-center gap-2">
                                            <Building2 className="w-4 h-4" />
                                            {job.company.name}
                                        </CardDescription>
                                    </div>
                                    <Badge variant={job.remote ? "secondary" : "outline"}>
                                        {job.type.replace("_", " ")}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="flex gap-4 text-sm text-muted-foreground mb-4">
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
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button asChild>
                                    <Link href={`/jobs/${job.slug}`}>View Details</Link>
                                </Button>
                            </CardFooter>
                        </Card>
                    ))
                )}
            </div>
        </main>
    );
}
