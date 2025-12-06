import { createJob } from "@/lib/actions/jobs";
import { getCategories } from "@/lib/actions/categories";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { redirect } from "next/navigation";

export const revalidate = 0; // Disable caching for this page

export default async function PostJobPage() {
    const categories = await getCategories();

    console.log('Fetched categories:', categories.length, categories);

    async function handleSubmit(formData: FormData) {
        "use server";
        await createJob(formData);
        redirect("/jobs");
    }

    return (
        <div className="container mx-auto py-10 px-4 max-w-2xl">
            <Card>
                <CardHeader>
                    <CardTitle>Post a New Job</CardTitle>
                </CardHeader>
                <CardContent>
                    <form action={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="title">Job Title</Label>
                            <Input id="title" name="title" required placeholder="e.g. Registered Nurse" />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="companyName">Company Name</Label>
                            <Input id="companyName" name="companyName" required placeholder="e.g. City Hospital" />
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
                                <Label htmlFor="experienceLevel">Experience Level</Label>
                                <Select name="experienceLevel" defaultValue="MID">
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select level" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="ENTRY">Entry Level</SelectItem>
                                        <SelectItem value="MID">Mid Level</SelectItem>
                                        <SelectItem value="SENIOR">Senior Level</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="location">Location</Label>
                            <Input id="location" name="location" placeholder="e.g. New York, NY" />
                        </div>

                        <div className="flex items-center space-x-2">
                            <Checkbox id="remote" name="remote" />
                            <Label htmlFor="remote">Remote Position</Label>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="type">Job Type</Label>
                            <Select name="type" defaultValue="FULL_TIME">
                                <SelectTrigger>
                                    <SelectValue placeholder="Select type" />
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
                            <Label htmlFor="salary">Salary Range</Label>
                            <Input id="salary" name="salary" placeholder="e.g. $80,000 - $100,000" />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Job Description</Label>
                            <Textarea
                                id="description"
                                name="description"
                                required
                                className="min-h-[200px]"
                                placeholder="Describe the role, responsibilities, and requirements..."
                            />
                        </div>

                        <Button type="submit" className="w-full">Post Job</Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
