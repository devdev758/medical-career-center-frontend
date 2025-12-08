"use client";

import { useState, useEffect } from "react";
import { getSkills, addSkill, deleteSkill } from "@/lib/actions/profile";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { ArrowLeft, X, Plus } from "lucide-react";

export default function SkillsPage() {
    const [skills, setSkills] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [adding, setAdding] = useState(false);

    useEffect(() => {
        loadSkills();
    }, []);

    async function loadSkills() {
        try {
            const data = await getSkills();
            setSkills(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    async function handleAddSkill(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setAdding(true);

        const formData = new FormData(e.currentTarget);

        try {
            await addSkill({
                name: formData.get("name") as string,
                level: formData.get("level") as string || undefined,
                yearsOfExperience: formData.get("years") ? parseInt(formData.get("years") as string) : undefined,
            });

            await loadSkills();
            (e.target as HTMLFormElement).reset();
        } catch (error) {
            console.error(error);
            alert("Failed to add skill");
        } finally {
            setAdding(false);
        }
    }

    async function handleDeleteSkill(id: string) {
        if (!confirm("Remove this skill?")) return;

        try {
            await deleteSkill(id);
            await loadSkills();
        } catch (error) {
            console.error(error);
            alert("Failed to delete skill");
        }
    }

    return (
        <main className="container mx-auto py-10 px-4 max-w-3xl">
            <Link href="/dashboard/profile" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6">
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back to Profile
            </Link>

            <div className="mb-8">
                <h1 className="text-4xl font-bold mb-2">Manage Skills</h1>
                <p className="text-muted-foreground">
                    Add skills that showcase your expertise
                </p>
            </div>

            <Card className="mb-6">
                <CardHeader>
                    <CardTitle>Add New Skill</CardTitle>
                    <CardDescription>
                        Add skills relevant to your profession
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleAddSkill} className="space-y-4">
                        <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-2 col-span-2">
                                <Label htmlFor="name">Skill Name *</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    placeholder="e.g., Patient Care"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="years">Years</Label>
                                <Input
                                    id="years"
                                    name="years"
                                    type="number"
                                    min="0"
                                    placeholder="0"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="level">Proficiency Level</Label>
                            <Select name="level">
                                <SelectTrigger>
                                    <SelectValue placeholder="Select level" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="BEGINNER">Beginner</SelectItem>
                                    <SelectItem value="INTERMEDIATE">Intermediate</SelectItem>
                                    <SelectItem value="ADVANCED">Advanced</SelectItem>
                                    <SelectItem value="EXPERT">Expert</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <Button type="submit" disabled={adding}>
                            <Plus className="w-4 h-4 mr-2" />
                            {adding ? "Adding..." : "Add Skill"}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Your Skills ({skills.length})</CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <p className="text-sm text-muted-foreground">Loading...</p>
                    ) : skills.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                            {skills.map((skill) => (
                                <Badge key={skill.id} variant="outline" className="text-sm py-2 px-3">
                                    <span>
                                        {skill.name}
                                        {skill.level && ` • ${skill.level}`}
                                        {skill.yearsOfExperience && ` • ${skill.yearsOfExperience}y`}
                                    </span>
                                    <button
                                        onClick={() => handleDeleteSkill(skill.id)}
                                        className="ml-2 hover:text-destructive"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </Badge>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-muted-foreground">No skills added yet</p>
                    )}
                </CardContent>
            </Card>
        </main>
    );
}
