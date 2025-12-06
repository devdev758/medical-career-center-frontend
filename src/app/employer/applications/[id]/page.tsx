import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { updateApplicationStatus, addApplicationNote } from "@/lib/actions/employer";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { ArrowLeft, Download, Mail, Phone } from "lucide-react";

export default async function ApplicationDetailsPage({
    params,
}: {
    params: { id: string };
}) {
    const session = await auth();

    if (!session?.user) {
        redirect("/login?callbackUrl=/employer/applications");
    }

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        include: { company: true },
    });

    if (user?.role !== "EMPLOYER" || !user.company) {
        redirect("/dashboard");
    }

    const application = await prisma.application.findUnique({
        where: { id: params.id },
        include: {
            job: {
                include: {
                    category: true,
                    company: true,
                },
            },
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    createdAt: true,
                },
            },
        },
    });

    if (!application || application.job.companyId !== user.company.id) {
        redirect("/employer/applications");
    }

    async function handleStatusChange(formData: FormData) {
        "use server";
        const status = formData.get("status") as string;
        await updateApplicationStatus(params.id, status);
    }

    async function handleAddNote(formData: FormData) {
        "use server";
        const notes = formData.get("notes") as string;
        await addApplicationNote(params.id, notes);
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case "PENDING": return "default";
            case "REVIEWED": return "secondary";
            case "SHORTLISTED": return "outline";
            case "REJECTED": return "destructive";
            case "HIRED": return "default";
            default: return "default";
        }
    };

    return (
        <main className="container mx-auto py-10 px-4 max-w-4xl">
            <Link href="/employer/applications" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6">
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back to Applications
            </Link>

            <div className="mb-8">
                <h1 className="text-4xl font-bold mb-2">Application Details</h1>
                <p className="text-muted-foreground">
                    Review and manage this application
                </p>
            </div>

            <div className="grid gap-6">
                {/* Candidate Information */}
                <Card>
                    <CardHeader>
                        <div className="flex justify-between items-start">
                            <div>
                                <CardTitle className="text-2xl">{application.user.name || "Anonymous"}</CardTitle>
                                <CardDescription>
                                    Applied for {application.job.title}
                                </CardDescription>
                            </div>
                            <Badge variant={getStatusColor(application.status)}>
                                {application.status}
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Email</p>
                                <div className="flex items-center gap-2">
                                    <Mail className="w-4 h-4" />
                                    <a href={`mailto:${application.user.email}`} className="text-sm hover:underline">
                                        {application.user.email}
                                    </a>
                                </div>
                            </div>
                            {application.phone && (
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Phone</p>
                                    <div className="flex items-center gap-2">
                                        <Phone className="w-4 h-4" />
                                        <a href={`tel:${application.phone}`} className="text-sm hover:underline">
                                            {application.phone}
                                        </a>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Applied On</p>
                            <p className="text-sm">{new Date(application.appliedAt).toLocaleDateString()}</p>
                        </div>

                        {application.resumeUrl && (
                            <div>
                                <Button asChild>
                                    <Link href={`/employer/applications/${application.id}/resume`} target="_blank">
                                        <Download className="w-4 h-4 mr-2" />
                                        Download Resume
                                    </Link>
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Cover Letter */}
                {application.coverLetter && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Cover Letter</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm whitespace-pre-wrap">{application.coverLetter}</p>
                        </CardContent>
                    </Card>
                )}

                {/* Status Management */}
                <Card>
                    <CardHeader>
                        <CardTitle>Change Status</CardTitle>
                        <CardDescription>Update the application status</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form action={handleStatusChange} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="status">Status</Label>
                                <Select name="status" defaultValue={application.status}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="PENDING">Pending</SelectItem>
                                        <SelectItem value="REVIEWED">Reviewed</SelectItem>
                                        <SelectItem value="SHORTLISTED">Shortlisted</SelectItem>
                                        <SelectItem value="REJECTED">Rejected</SelectItem>
                                        <SelectItem value="HIRED">Hired</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <Button type="submit">Update Status</Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Internal Notes */}
                <Card>
                    <CardHeader>
                        <CardTitle>Internal Notes</CardTitle>
                        <CardDescription>Add notes about this candidate (not visible to applicant)</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form action={handleAddNote} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="notes">Notes</Label>
                                <Textarea
                                    id="notes"
                                    name="notes"
                                    defaultValue={application.notes || ""}
                                    placeholder="Add your notes here..."
                                    rows={6}
                                />
                            </div>
                            <Button type="submit">Save Notes</Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </main>
    );
}
