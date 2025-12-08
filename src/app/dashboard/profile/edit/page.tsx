import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { getProfile, updateProfile } from "@/lib/actions/profile";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function EditProfilePage() {
    const session = await auth();

    if (!session?.user) {
        redirect("/login?callbackUrl=/dashboard/profile/edit");
    }

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { role: true },
    });

    if (user?.role === "EMPLOYER") {
        redirect("/employer/company");
    }

    const profile = await getProfile().catch(() => null);

    async function handleSubmit(formData: FormData) {
        "use server";

        const jobTypes = formData.getAll("jobTypes") as string[];

        await updateProfile({
            headline: formData.get("headline") as string,
            bio: formData.get("bio") as string,
            phone: formData.get("phone") as string,
            location: formData.get("location") as string,
            website: formData.get("website") as string,
            linkedIn: formData.get("linkedIn") as string,
            jobTypes,
            desiredSalary: formData.get("desiredSalary") as string,
            willingToRelocate: formData.get("willingToRelocate") === "on",
            isPublic: formData.get("isPublic") === "on",
        });

        redirect("/dashboard/profile");
    }

    return (
        <main className="container mx-auto py-10 px-4 max-w-3xl">
            <Link href="/dashboard/profile" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6">
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back to Profile
            </Link>

            <div className="mb-8">
                <h1 className="text-4xl font-bold mb-2">Edit Profile</h1>
                <p className="text-muted-foreground">
                    Update your professional information
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                    <CardDescription>
                        Tell employers about yourself
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="headline">Professional Headline</Label>
                            <Input
                                id="headline"
                                name="headline"
                                placeholder="e.g., Registered Nurse with 5 years of ICU experience"
                                defaultValue={profile?.headline || ""}
                            />
                            <p className="text-xs text-muted-foreground">
                                A brief, compelling summary of your professional identity
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="bio">Bio</Label>
                            <Textarea
                                id="bio"
                                name="bio"
                                placeholder="Tell us about your background, experience, and career goals..."
                                rows={6}
                                defaultValue={profile?.bio || ""}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone Number</Label>
                                <Input
                                    id="phone"
                                    name="phone"
                                    type="tel"
                                    placeholder="+1 (555) 123-4567"
                                    defaultValue={profile?.phone || ""}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="location">Location</Label>
                                <Input
                                    id="location"
                                    name="location"
                                    placeholder="City, State"
                                    defaultValue={profile?.location || ""}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="website">Website</Label>
                                <Input
                                    id="website"
                                    name="website"
                                    type="url"
                                    placeholder="https://yourwebsite.com"
                                    defaultValue={profile?.website || ""}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="linkedIn">LinkedIn Profile</Label>
                                <Input
                                    id="linkedIn"
                                    name="linkedIn"
                                    type="url"
                                    placeholder="https://linkedin.com/in/yourprofile"
                                    defaultValue={profile?.linkedIn || ""}
                                />
                            </div>
                        </div>

                        <div className="border-t pt-6 space-y-4">
                            <h3 className="font-semibold">Job Preferences</h3>

                            <div className="space-y-2">
                                <Label>Preferred Job Types</Label>
                                <div className="space-y-2">
                                    {["FULL_TIME", "PART_TIME", "CONTRACT", "INTERNSHIP"].map((type) => (
                                        <div key={type} className="flex items-center space-x-2">
                                            <Checkbox
                                                id={type}
                                                name="jobTypes"
                                                value={type}
                                                defaultChecked={profile?.jobTypes?.includes(type)}
                                            />
                                            <label htmlFor={type} className="text-sm">
                                                {type.replace("_", " ")}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="desiredSalary">Desired Salary Range</Label>
                                <Input
                                    id="desiredSalary"
                                    name="desiredSalary"
                                    placeholder="e.g., $60,000 - $80,000"
                                    defaultValue={profile?.desiredSalary || ""}
                                />
                            </div>

                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="willingToRelocate"
                                    name="willingToRelocate"
                                    defaultChecked={profile?.willingToRelocate}
                                />
                                <label htmlFor="willingToRelocate" className="text-sm">
                                    Willing to relocate
                                </label>
                            </div>

                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="isPublic"
                                    name="isPublic"
                                    defaultChecked={profile?.isPublic}
                                />
                                <label htmlFor="isPublic" className="text-sm">
                                    Make my profile public (visible to employers)
                                </label>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <Button type="submit">Save Changes</Button>
                            <Button type="button" variant="outline" asChild>
                                <Link href="/dashboard/profile">Cancel</Link>
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </main>
    );
}
