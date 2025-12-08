"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Search, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ApplicationFiltersProps {
    jobs: Array<{ id: string; title: string }>;
    onFilterChange: (filters: {
        search: string;
        status: string;
        jobId: string;
        dateFrom: string;
        dateTo: string;
    }) => void;
}

export function ApplicationFilters({ jobs, onFilterChange }: ApplicationFiltersProps) {
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("ALL");
    const [jobId, setJobId] = useState("ALL");
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            onFilterChange({ search, status, jobId, dateFrom, dateTo });
        }, 300);

        return () => clearTimeout(timer);
    }, [search, status, jobId, dateFrom, dateTo]);

    const hasActiveFilters = search || status !== "ALL" || jobId !== "ALL" || dateFrom || dateTo;

    const clearFilters = () => {
        setSearch("");
        setStatus("ALL");
        setJobId("ALL");
        setDateFrom("");
        setDateTo("");
    };

    const activeFilterCount = [
        search,
        status !== "ALL",
        jobId !== "ALL",
        dateFrom,
        dateTo,
    ].filter(Boolean).length;

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Filters</h3>
                {hasActiveFilters && (
                    <div className="flex items-center gap-2">
                        <Badge variant="secondary">{activeFilterCount} active</Badge>
                        <Button variant="ghost" size="sm" onClick={clearFilters}>
                            <X className="w-4 h-4 mr-1" />
                            Clear all
                        </Button>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Search */}
                <div className="space-y-2">
                    <Label htmlFor="search">Search Candidate</Label>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            id="search"
                            placeholder="Name or email..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                </div>

                {/* Status */}
                <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select value={status} onValueChange={setStatus}>
                        <SelectTrigger id="status">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ALL">All Statuses</SelectItem>
                            <SelectItem value="PENDING">Pending</SelectItem>
                            <SelectItem value="REVIEWED">Reviewed</SelectItem>
                            <SelectItem value="SHORTLISTED">Shortlisted</SelectItem>
                            <SelectItem value="REJECTED">Rejected</SelectItem>
                            <SelectItem value="HIRED">Hired</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Job */}
                <div className="space-y-2">
                    <Label htmlFor="job">Job Position</Label>
                    <Select value={jobId} onValueChange={setJobId}>
                        <SelectTrigger id="job">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ALL">All Jobs</SelectItem>
                            {jobs.map((job) => (
                                <SelectItem key={job.id} value={job.id}>
                                    {job.title}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Date Range */}
                <div className="space-y-2">
                    <Label>Application Date</Label>
                    <div className="flex gap-2">
                        <Input
                            type="date"
                            value={dateFrom}
                            onChange={(e) => setDateFrom(e.target.value)}
                            placeholder="From"
                            className="text-sm"
                        />
                        <Input
                            type="date"
                            value={dateTo}
                            onChange={(e) => setDateTo(e.target.value)}
                            placeholder="To"
                            className="text-sm"
                        />
                    </div>
                </div>
            </div>

            {/* Active Filters Display */}
            {hasActiveFilters && (
                <div className="flex flex-wrap gap-2">
                    {search && (
                        <Badge variant="outline" className="gap-1">
                            Search: {search}
                            <button onClick={() => setSearch("")} className="ml-1">
                                <X className="w-3 h-3" />
                            </button>
                        </Badge>
                    )}
                    {status !== "ALL" && (
                        <Badge variant="outline" className="gap-1">
                            Status: {status}
                            <button onClick={() => setStatus("ALL")} className="ml-1">
                                <X className="w-3 h-3" />
                            </button>
                        </Badge>
                    )}
                    {jobId !== "ALL" && (
                        <Badge variant="outline" className="gap-1">
                            Job: {jobs.find((j) => j.id === jobId)?.title}
                            <button onClick={() => setJobId("ALL")} className="ml-1">
                                <X className="w-3 h-3" />
                            </button>
                        </Badge>
                    )}
                    {dateFrom && (
                        <Badge variant="outline" className="gap-1">
                            From: {new Date(dateFrom).toLocaleDateString()}
                            <button onClick={() => setDateFrom("")} className="ml-1">
                                <X className="w-3 h-3" />
                            </button>
                        </Badge>
                    )}
                    {dateTo && (
                        <Badge variant="outline" className="gap-1">
                            To: {new Date(dateTo).toLocaleDateString()}
                            <button onClick={() => setDateTo("")} className="ml-1">
                                <X className="w-3 h-3" />
                            </button>
                        </Badge>
                    )}
                </div>
            )}
        </div>
    );
}
