import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getCategories } from "@/lib/actions/categories";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function PostJobPage() {
    const session = await auth();

    if (!session?.user) {
        redirect("/login?callbackUrl=/employer/jobs/new");
    }

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        include: { company: true },
    });

    if (user?.role !== "EMPLOYER" || !user.company) {
        redirect("/dashboard");
    }

    const categories = await getCategories();

    async function handleSubmit(formData: FormData) {
        "use server";

        const title = formData.get("title") as string;
        const description = formData.get("description") as string;
        const location = formData.get("location") as string;
        const type = formData.get("type") as string;
        const salary = formData.get("salary") as string;
        const remote = formData.get("remote") === "true";
        const experienceLevel = formData.get("experienceLevel") as string;
        const categoryId = formData.get("categoryId") as string;

        const slug = title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "");

        const existingJob = await prisma.job.findUnique({ where: { slug } });
        const finalSlug = existingJob
            ? `${slug}-${Math.random().toString(36).substring(7)}`
            : slug;

        await prisma.job.create({
            data: {
                title,
                slug: finalSlug,
                description,
                location: location || null,
                type,
                salary: salary || null,
                remote,
                experienceLevel,
                categoryId: categoryId || null,
                companyId: user!.company!.id,
            },
        });

        redirect("/employer/jobs");
    }

    return (
        <main className="container mx-auto py-10 px-4 max-w-3xl">
            <Link href="/employer/jobs" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6">
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back to Jobs
            </Link>

            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">Post a New Job</CardTitle>
                    <CardDescription>
                        Create a job posting to attract qualified candidates
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="title">Job Title *</Label>
                            <Input
                                id="title"
                                name="title"
                                placeholder="e.g. Registered Nurse"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Job Description *</Label>
                            <Textarea
                                id="description"
                                name="description"
                                placeholder="Describe the role, responsibilities, and requirements..."
                                rows={10}
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="categoryId">Category</Label>
                                <Select name="categoryId">
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map((category) => (
                                            <SelectItem key={category.id} value={category.id}>
                                                {category.icon} {category.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="experienceLevel">Experience Level *</Label>
                                <Select name="experienceLevel" defaultValue="MID" required>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="ENTRY">Entry Level</SelectItem>
                                        <SelectItem value="MID">Mid Level</SelectItem>
                                        <SelectItem value="SENIOR">Senior Level</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="type">Job Type *</Label>
                                <Select name="type" defaultValue="FULL_TIME" required>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="FULL_TIME">Full Time</SelectItem>
                                        <SelectItem value="PART_TIME">Part Time</SelectItem>
                                        <SelectItem value="CONTRACT">Contract</SelectItem>
                                        <SelectItem value="INTERNSHIP">Internship</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="remote">Work Location *</Label>
                                <Select name="remote" defaultValue="false" required>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="false">On-site</SelectItem>
                                        <SelectItem value="true">Remote</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="location">Location</Label>
                                <Input
                                    id="location"
                                    name="location"
                                    placeholder="e.g. New York, NY"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="salary">Salary Range</Label>
                                <Input
                                    id="salary"
                                    name="salary"
                                    placeholder="e.g. $60,000 - $80,000"
                                />
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <Button type="submit">Post Job</Button>
                            <Button type="button" variant="outline" asChild>
                                <Link href="/employer/jobs">Cancel</Link>
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </main>
    );
}
