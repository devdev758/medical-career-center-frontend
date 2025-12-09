'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Building2, MapPin, DollarSign, Clock } from 'lucide-react';
import { JobFilterSidebar, type JobFiltersState } from './JobFilterSidebar';

interface Job {
    id: string;
    title: string;
    companyName: string | null;
    location: string;
    salary: string | null;
    type: string;
    remote: boolean;
    description: string;
    createdAt: Date;
}

interface JobListingsWithFiltersProps {
    jobs: Job[];
    profession: string;
}

function formatDate(date: Date): string {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
}

function extractSalaryNumber(salaryString: string | null): number {
    if (!salaryString) return 0;
    // Extract first number from salary string like "$50,000 - $75,000"
    const match = salaryString.match(/\$?([\d,]+)/);
    if (match) {
        return parseInt(match[1].replace(/,/g, ''));
    }
    return 0;
}

export function JobListingsWithFilters({ jobs, profession }: JobListingsWithFiltersProps) {
    const [filters, setFilters] = useState<JobFiltersState>({
        sortBy: 'relevance',
        datePosted: 'any',
        salaryMin: 0,
        salaryMax: 200000,
        remote: [],
        location: [],
        company: [],
        employmentType: [],
        hours: []
    });

    // Extract unique locations and companies
    const availableLocations = useMemo(() => {
        const locations = new Set(jobs.map(j => j.location).filter(Boolean));
        return Array.from(locations).sort();
    }, [jobs]);

    const availableCompanies = useMemo(() => {
        const companies = new Set(jobs.map(j => j.companyName).filter(Boolean) as string[]);
        return Array.from(companies).sort();
    }, [jobs]);

    // Filter and sort jobs
    const filteredJobs = useMemo(() => {
        let filtered = [...jobs];

        // Date filter
        if (filters.datePosted !== 'any') {
            const now = new Date();
            const cutoffDays = filters.datePosted === '24h' ? 1 : filters.datePosted === '7d' ? 7 : 30;
            filtered = filtered.filter(job => {
                const diffDays = Math.ceil((now.getTime() - job.createdAt.getTime()) / (1000 * 60 * 60 * 24));
                return diffDays <= cutoffDays;
            });
        }

        // Salary filter
        filtered = filtered.filter(job => {
            const salary = extractSalaryNumber(job.salary);
            return salary === 0 || (salary >= filters.salaryMin && salary <= filters.salaryMax);
        });

        // Remote filter
        if (filters.remote.length > 0) {
            filtered = filtered.filter(job => {
                if (filters.remote.includes('yes') && job.remote) return true;
                if (filters.remote.includes('no') && !job.remote) return true;
                return false;
            });
        }

        // Location filter
        if (filters.location.length > 0) {
            filtered = filtered.filter(job =>
                filters.location.some(loc => job.location.includes(loc))
            );
        }

        // Company filter
        if (filters.company.length > 0) {
            filtered = filtered.filter(job =>
                job.companyName && filters.company.includes(job.companyName)
            );
        }

        // Employment type filter
        if (filters.employmentType.length > 0) {
            filtered = filtered.filter(job => filters.employmentType.includes(job.type));
        }

        // Sort
        if (filters.sortBy === 'date') {
            filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        } else if (filters.sortBy === 'salary') {
            filtered.sort((a, b) => extractSalaryNumber(b.salary) - extractSalaryNumber(a.salary));
        }

        return filtered;
    }, [jobs, filters]);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Filter Sidebar */}
            <div className="lg:col-span-1">
                <JobFilterSidebar
                    onFilterChange={setFilters}
                    availableLocations={availableLocations}
                    availableCompanies={availableCompanies}
                />
            </div>

            {/* Job Listings */}
            <div className="lg:col-span-3">
                <div className="mb-4 flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                        Showing {filteredJobs.length} of {jobs.length} jobs
                    </p>
                </div>

                {filteredJobs.length === 0 ? (
                    <Card>
                        <CardContent className="p-12 text-center">
                            <p className="text-xl text-muted-foreground mb-4">
                                No jobs match your filters
                            </p>
                            <p className="text-sm text-muted-foreground mb-6">
                                Try adjusting your filters to see more results
                            </p>
                            <Button variant="outline" onClick={() => setFilters({
                                sortBy: 'relevance',
                                datePosted: 'any',
                                salaryMin: 0,
                                salaryMax: 200000,
                                remote: [],
                                location: [],
                                company: [],
                                employmentType: [],
                                hours: []
                            })}>
                                Clear Filters
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-6">
                        {filteredJobs.map((job) => (
                            <Card key={job.id} className="hover:shadow-lg transition-shadow">
                                <CardHeader>
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1">
                                            <CardTitle className="text-2xl mb-2">
                                                {job.title}
                                            </CardTitle>
                                            <div className="flex items-center gap-4 text-muted-foreground">
                                                <div className="flex items-center gap-1">
                                                    <Building2 className="w-4 h-4" />
                                                    <span>{job.companyName || 'Company'}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <MapPin className="w-4 h-4" />
                                                    <span>{job.location}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            {job.salary && (
                                                <div className="flex items-center gap-1 text-green-600 dark:text-green-400 font-semibold mb-2">
                                                    <DollarSign className="w-4 h-4" />
                                                    <span>{job.salary}</span>
                                                </div>
                                            )}
                                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                                <Clock className="w-3 h-3" />
                                                <span>{formatDate(job.createdAt)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="mb-4">
                                        <p className="text-muted-foreground line-clamp-3">
                                            {job.description.substring(0, 300)}...
                                        </p>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="flex gap-2">
                                            <Badge variant="secondary">{job.type.replace('_', ' ')}</Badge>
                                            {job.remote && <Badge variant="outline">Remote</Badge>}
                                        </div>

                                        <Button asChild>
                                            <Link href={`/job-detail/${job.id}`}>
                                                View Details →
                                            </Link>
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
