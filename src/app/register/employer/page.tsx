"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";

export default function EmployerRegisterPage() {
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        setError("");

        const formData = new FormData(e.currentTarget);
        const data = {
            name: formData.get("name"),
            email: formData.get("email"),
            password: formData.get("password"),
            companyName: formData.get("companyName"),
            companyWebsite: formData.get("companyWebsite"),
            companyDescription: formData.get("companyDescription"),
            role: "EMPLOYER",
        };

        try {
            const response = await fetch("/api/register/employer", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || "Registration failed");
            }

            router.push("/login?message=Registration successful! Please log in.");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 py-10">
            <Card className="w-full max-w-2xl">
                <CardHeader>
                    <CardTitle className="text-2xl">Employer Registration</CardTitle>
                    <CardDescription>
                        Create an account to post jobs and manage applications
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="grid gap-6">
                        <div className="space-y-4">
                            <h3 className="font-semibold">Your Information</h3>
                            <div className="grid gap-2">
                                <Label htmlFor="name">Full Name</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    type="text"
                                    placeholder="John Doe"
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="john@hospital.com"
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    minLength={6}
                                    required
                                />
                            </div>
                        </div>

                        <div className="border-t pt-4 space-y-4">
                            <h3 className="font-semibold">Company Information</h3>
                            <div className="grid gap-2">
                                <Label htmlFor="companyName">Company/Hospital Name</Label>
                                <Input
                                    id="companyName"
                                    name="companyName"
                                    type="text"
                                    placeholder="City General Hospital"
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="companyWebsite">Website (Optional)</Label>
                                <Input
                                    id="companyWebsite"
                                    name="companyWebsite"
                                    type="url"
                                    placeholder="https://hospital.com"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="companyDescription">
                                    Company Description (Optional)
                                </Label>
                                <Textarea
                                    id="companyDescription"
                                    name="companyDescription"
                                    placeholder="Tell us about your organization..."
                                    rows={4}
                                />
                            </div>
                        </div>

                        {error && <div className="text-red-500 text-sm">{error}</div>}
                    </CardContent>
                    <CardFooter>
                        <div className="w-full space-y-4">
                            <Button className="w-full" disabled={loading}>
                                {loading ? "Creating Account..." : "Create Employer Account"}
                            </Button>
                            <p className="text-sm text-center text-muted-foreground">
                                Already have an account?{" "}
                                <Link href="/login" className="text-primary hover:underline">
                                    Log in
                                </Link>
                            </p>
                            <p className="text-sm text-center text-muted-foreground">
                                Looking for a job?{" "}
                                <Link href="/register" className="text-primary hover:underline">
                                    Register as Job Seeker
                                </Link>
                            </p>
                        </div>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
