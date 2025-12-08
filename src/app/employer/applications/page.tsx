"use client";

import { useState, useEffect } from "react";
import { getEmployerApplications } from "@/lib/actions/employer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ApplicationFilters } from "@/components/application-filters";
import Link from "next/link";
import { Building2, Calendar, User, ArrowLeft, Download } from "lucide-react";

interface Application {
    id: string;
    status: string;
    phone: string | null;
    coverLetter: string | null;
    notes: string | null;
    resumeUrl: string | null;
    appliedAt: Date;
    user: {
        id: string;
        name: string | null;
        email: string | null;
    };
    job: {
        id: string;
        title: string;
        category: {
            name: string;
        } | null;
    };
}

export default function EmployerApplicationsPage() {
    const [applications, setApplications] = useState<Application[]>([]);
    const [allApplications, setAllApplications] = useState<Application[]>([]);
    const [jobs, setJobs] = useState<Array<{ id: string; title: string }>>([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        search: "",
        status: "ALL",
        jobId: "ALL",
        dateFrom: "",
        dateTo: "",
    });

    useEffect(() => {
        loadApplications();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [filters, allApplications]);

    async function loadApplications() {
        try {
            const data = await getEmployerApplications();
            setAllApplications(data);
            setApplications(data);

            // Extract unique jobs
            const uniqueJobs = Array.from(
                new Map(data.map((app) => [app.job.id, { id: app.job.id, title: app.job.title }])).values()
            );
            setJobs(uniqueJobs);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    function applyFilters() {
        let filtered = [...allApplications];

        // Search filter
        if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            filtered = filtered.filter(
                (app) =>
                    app.user.name?.toLowerCase().includes(searchLower) ||
                    app.user.email?.toLowerCase().includes(searchLower)
            );
        }

        // Status filter
        if (filters.status !== "ALL") {
            filtered = filtered.filter((app) => app.status === filters.status);
        }

        // Job filter
        if (filters.jobId !== "ALL") {
            filtered = filtered.filter((app) => app.job.id === filters.jobId);
        }

        // Date range filter
        if (filters.dateFrom) {
            const fromDate = new Date(filters.dateFrom);
            filtered = filtered.filter((app) => new Date(app.appliedAt) >= fromDate);
        }
        if (filters.dateTo) {
            const toDate = new Date(filters.dateTo);
            toDate.setHours(23, 59, 59, 999); // End of day
            filtered = filtered.filter((app) => new Date(app.appliedAt) <= toDate);
        }

        setApplications(filtered);
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case "PENDING":
                return "default";
            case "REVIEWED":
                return "secondary";
            case "SHORTLISTED":
                return "outline";
            case "REJECTED":
                return "destructive";
            case "HIRED":
                return "default";
            default:
                return "default";
        }
    };

    if (loading) {
        return (
            <main className="container mx-auto py-10 px-4">
                <p>Loading applications...</p>
            </main>
        );
    }

    return (
        <main className="container mx-auto py-10 px-4">
            <Link href="/employer/dashboard" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6">
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back to Dashboard
            </Link>

            <div className="mb-8">
                <h1 className="text-4xl font-bold mb-2">Applications</h1>
                <p className="text-muted-foreground">
                    Manage candidate applications for your job postings
                </p>
            </div>

            {allApplications.length === 0 ? (
                <Card>
                    <CardContent className="py-20 text-center">
                        <h3 className="text-xl font-semibold mb-2">No applications yet</h3>
                        <p className="text-muted-foreground mb-6">
                            Applications will appear here once candidates apply to your jobs.
                        </p>
                        <Button asChild>
                            <Link href="/employer/jobs/new">Post a Job</Link>
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-6">
                    {/* Filters */}
                    <Card>
                        <CardContent className="pt-6">
                            <ApplicationFilters jobs={jobs} onFilterChange={setFilters} />
                        </CardContent>
                    </Card>

                    {/* Results Count */}
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                            Showing <span className="font-medium">{applications.length}</span> of{" "}
                            <span className="font-medium">{allApplications.length}</span> applications
                        </p>
                    </div>

                    {/* Applications List */}
                    {applications.length === 0 ? (
                        <Card>
                            <CardContent className="py-12 text-center">
                                <p className="text-muted-foreground">No applications match your filters</p>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid gap-6">
                            {applications.map((application) => (
                                <Card key={application.id}>
                                    <CardHeader>
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <CardTitle className="text-xl mb-1">
                                                    {application.user.name || "Anonymous"}
                                                </CardTitle>
                                                <CardDescription className="flex items-center gap-4 flex-wrap">
                                                    <span className="flex items-center gap-1">
                                                        <Building2 className="w-4 h-4" />
                                                        {application.job.title}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Calendar className="w-4 h-4" />
                                                        Applied {new Date(application.appliedAt).toLocaleDateString()}
                                                    </span>
                                                </CardDescription>
                                            </div>
                                            <Badge variant={getStatusColor(application.status) as any}>
                                                {application.status}
                                            </Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <User className="w-4 h-4" />
                                                {application.user.email}
                                                {application.phone && ` • ${application.phone}`}
                                            </div>

                                            {application.coverLetter && (
                                                <div>
                                                    <p className="text-sm font-medium mb-1">Cover Letter:</p>
                                                    <p className="text-sm text-muted-foreground line-clamp-3">
                                                        {application.coverLetter}
                                                    </p>
                                                </div>
                                            )}

                                            {application.notes && (
                                                <div className="bg-muted p-3 rounded">
                                                    <p className="text-sm font-medium mb-1">Internal Notes:</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {application.notes}
                                                    </p>
                                                </div>
                                            )}

                                            <div className="flex gap-2 flex-wrap">
                                                <Button variant="default" size="sm" asChild>
                                                    <Link href={`/employer/applications/${application.id}`}>
                                                        View Details
                                                    </Link>
                                                </Button>
                                                {application.resumeUrl && (
                                                    <Button variant="outline" size="sm" asChild>
                                                        <Link href={`/employer/applications/${application.id}/resume`} target="_blank">
                                                            <Download className="w-4 h-4 mr-1" />
                                                            Resume
                                                        </Link>
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </main>
    );
}
