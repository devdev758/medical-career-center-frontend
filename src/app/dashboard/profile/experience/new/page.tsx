"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createWorkExperience } from "@/lib/actions/profile";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function AddExperiencePage() {
    const router = useRouter();
    const [isCurrent, setIsCurrent] = useState(false);
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);

        try {
            await createWorkExperience({
                title: formData.get("title") as string,
                company: formData.get("company") as string,
                location: formData.get("location") as string || undefined,
                startDate: new Date(formData.get("startDate") as string),
                endDate: isCurrent ? undefined : new Date(formData.get("endDate") as string),
                isCurrent,
                description: formData.get("description") as string || undefined,
            });

            router.push("/dashboard/profile");
        } catch (error) {
            console.error(error);
            alert("Failed to add experience");
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="container mx-auto py-10 px-4 max-w-3xl">
            <Link href="/dashboard/profile" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6">
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back to Profile
            </Link>

            <div className="mb-8">
                <h1 className="text-4xl font-bold mb-2">Add Work Experience</h1>
                <p className="text-muted-foreground">
                    Add your professional experience
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Work Experience Details</CardTitle>
                    <CardDescription>
                        Tell employers about your work history
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="title">Job Title *</Label>
                            <Input
                                id="title"
                                name="title"
                                placeholder="e.g., Registered Nurse"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="company">Company *</Label>
                            <Input
                                id="company"
                                name="company"
                                placeholder="e.g., City General Hospital"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="location">Location</Label>
                            <Input
                                id="location"
                                name="location"
                                placeholder="e.g., New York, NY"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="startDate">Start Date *</Label>
                                <Input
                                    id="startDate"
                                    name="startDate"
                                    type="month"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="endDate">End Date {!isCurrent && "*"}</Label>
                                <Input
                                    id="endDate"
                                    name="endDate"
                                    type="month"
                                    disabled={isCurrent}
                                    required={!isCurrent}
                                />
                            </div>
                        </div>

                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="isCurrent"
                                checked={isCurrent}
                                onCheckedChange={(checked) => setIsCurrent(checked as boolean)}
                            />
                            <label htmlFor="isCurrent" className="text-sm">
                                I currently work here
                            </label>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                name="description"
                                placeholder="Describe your responsibilities and achievements..."
                                rows={6}
                            />
                        </div>

                        <div className="flex gap-4">
                            <Button type="submit" disabled={loading}>
                                {loading ? "Saving..." : "Save Experience"}
                            </Button>
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
