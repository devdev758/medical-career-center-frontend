"use client";

import { useFormState, useFormStatus } from "react-dom";
import { useSearchParams } from "next/navigation";
import { authenticate } from "@/lib/actions";
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
import Link from "next/link";

function LoginButton() {
    const { pending } = useFormStatus();
    return (
        <Button className="w-full" aria-disabled={pending}>
            {pending ? "Logging in..." : "Log in"}
        </Button>
    );
}

export default function LoginPage() {
    const [errorMessage, dispatch] = useFormState(authenticate, undefined);
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

    async function handleSubmit(formData: FormData) {
        // Add callback URL to form data
        formData.append("callbackUrl", callbackUrl);
        return dispatch(formData);
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle className="text-2xl">Login</CardTitle>
                    <CardDescription>
                        Enter your email below to login to your account.
                    </CardDescription>
                </CardHeader>
                <form action={handleSubmit}>
                    <CardContent className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="m@example.com"
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" name="password" type="password" required />
                        </div>
                        {errorMessage && (
                            <div className="text-red-500 text-sm">{errorMessage}</div>
                        )}
                    </CardContent>
                    <CardFooter>
                        <div className="w-full space-y-4">
                            <LoginButton />
                            <p className="text-sm text-center text-muted-foreground">
                                Don't have an account?{" "}
                                <Link href="/register" className="text-primary hover:underline">
                                    Sign up
                                </Link>
                            </p>
                        </div>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
