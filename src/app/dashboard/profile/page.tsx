import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function ProfilePage() {
    const session = await auth();

    if (!session?.user) {
        redirect("/login?callbackUrl=/dashboard/profile");
    }

    return (
        <main className="container mx-auto py-10 px-4 max-w-2xl">
            <div className="mb-8">
                <h1 className="text-4xl font-bold mb-2">Profile Settings</h1>
                <p className="text-muted-foreground">
                    Manage your account information
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Account Information</CardTitle>
                    <CardDescription>
                        Your profile details
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">Name</p>
                        <p className="text-lg">{session.user.name || "Not set"}</p>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">Email</p>
                        <p className="text-lg">{session.user.email}</p>
                    </div>

                    <div className="pt-4 border-t">
                        <p className="text-sm text-muted-foreground mb-4">
                            Profile editing features coming soon! You'll be able to update your name,
                            add a bio, upload a profile picture, and manage your resume.
                        </p>
                        <Button asChild variant="outline">
                            <Link href="/dashboard">
                                Back to Dashboard
                            </Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </main>
    );
}
