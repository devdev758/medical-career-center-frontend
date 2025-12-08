import { getJob } from "@/lib/actions/jobs";
import { checkIfApplied, applyForJob } from "@/lib/actions/applications";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function ApplyPage({ params }: { params: { slug: string } }) {
    const session = await auth();

    if (!session?.user) {
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

    async function handleApply(formData: FormData) {
        "use server";
        await applyForJob(job!.id, formData);
        redirect("/dashboard/applications");
    }

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
                    <form action={handleApply} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={session.user.email || ""}
                                disabled
                                className="bg-muted"
                            />
                            <p className="text-xs text-muted-foreground">
                                This is your account email and cannot be changed.
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number *</Label>
                            <Input
                                id="phone"
                                name="phone"
                                type="tel"
                                required
                                placeholder="(555) 123-4567"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="resume">Resume (PDF or DOC) *</Label>
                            <Input
                                id="resume"
                                name="resume"
                                type="file"
                                accept=".pdf,.doc,.docx"
                                required
                            />
                            <p className="text-xs text-muted-foreground">
                                Maximum file size: 5MB
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="coverLetter">Cover Letter (Optional)</Label>
                            <Textarea
                                id="coverLetter"
                                name="coverLetter"
                                className="min-h-[200px]"
                                placeholder="Tell us why you're a great fit for this position..."
                            />
                        </div>

                        <div className="flex gap-4">
                            <Button type="submit" className="flex-1">
                                Submit Application
                            </Button>
                            <Button type="button" variant="outline" asChild>
                                <Link href={`/jobs/${params.slug}`}>Cancel</Link>
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </main>
    );
}
