import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
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

export default async function CompanyProfilePage() {
    const session = await auth();

    if (!session?.user) {
        redirect("/login?callbackUrl=/employer/company");
    }

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        include: { company: true },
    });

    if (user?.role !== "EMPLOYER" || !user.company) {
        redirect("/dashboard");
    }

    async function updateCompany(formData: FormData) {
        "use server";

        const name = formData.get("name") as string;
        const website = formData.get("website") as string;
        const description = formData.get("description") as string;
        const location = formData.get("location") as string;
        const industry = formData.get("industry") as string;
        const size = formData.get("size") as string;
        const founded = formData.get("founded") as string;

        if (!user?.company?.id) return;

        await prisma.company.update({
            where: { id: user.company.id },
            data: {
                name,
                website: website || null,
                description: description || null,
                location: location || null,
                industry: industry || null,
                size: size || null,
                founded: founded || null,
            },
        });

        revalidatePath("/employer/company");
        revalidatePath("/employer/dashboard");
    }

    return (
        <main className="container mx-auto py-10 px-4 max-w-3xl">
            <Link href="/employer/dashboard" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6">
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back to Dashboard
            </Link>

            <div className="mb-8">
                <h1 className="text-4xl font-bold mb-2">Company Profile</h1>
                <p className="text-muted-foreground">
                    Update your company information
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Company Information</CardTitle>
                    <CardDescription>
                        This information will be visible to job seekers
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={updateCompany} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="name">Company Name *</Label>
                            <Input
                                id="name"
                                name="name"
                                defaultValue={user.company.name}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="website">Website</Label>
                            <Input
                                id="website"
                                name="website"
                                type="url"
                                placeholder="https://company.com"
                                defaultValue={user.company.website || ""}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">About Company</Label>
                            <Textarea
                                id="description"
                                name="description"
                                placeholder="Tell job seekers about your organization..."
                                rows={6}
                                defaultValue={user.company.description || ""}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="location">Location</Label>
                                <Input
                                    id="location"
                                    name="location"
                                    placeholder="e.g. New York, NY"
                                    defaultValue={user.company.location || ""}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="industry">Industry</Label>
                                <Input
                                    id="industry"
                                    name="industry"
                                    placeholder="e.g. Healthcare"
                                    defaultValue={user.company.industry || ""}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="size">Company Size</Label>
                                <Select name="size" defaultValue={user.company.size || ""}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select size" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1-10">1-10 employees</SelectItem>
                                        <SelectItem value="11-50">11-50 employees</SelectItem>
                                        <SelectItem value="51-200">51-200 employees</SelectItem>
                                        <SelectItem value="201-500">201-500 employees</SelectItem>
                                        <SelectItem value="500+">500+ employees</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="founded">Founded Year</Label>
                                <Input
                                    id="founded"
                                    name="founded"
                                    placeholder="e.g. 2010"
                                    defaultValue={user.company.founded || ""}
                                />
                            </div>
                        </div>

                        <Button type="submit">Save Changes</Button>
                    </form>
                </CardContent>
            </Card>
        </main>
    );
}
