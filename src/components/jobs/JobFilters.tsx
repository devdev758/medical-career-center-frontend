'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, MapPin, Briefcase, Home } from 'lucide-react';

interface JobFiltersProps {
    onFilterChange: (filters: JobFilterState) => void;
    states: string[];
    cities: string[];
}

export interface JobFilterState {
    search: string;
    state: string;
    city: string;
    jobType: string;
    remote: string;
}

export function JobFilters({ onFilterChange, states, cities }: JobFiltersProps) {
    const [filters, setFilters] = useState<JobFilterState>({
        search: '',
        state: 'all',
        city: 'all',
        jobType: 'all',
        remote: 'all'
    });

    const handleFilterChange = (key: keyof JobFilterState, value: string) => {
        const newFilters = { ...filters, [key]: value };
        setFilters(newFilters);
        onFilterChange(newFilters);
    };

    return (
        <div className="bg-card border rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Search className="w-5 h-5" />
                Filter Jobs
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {/* Search */}
                <div className="lg:col-span-2">
                    <label className="text-sm font-medium mb-2 block">Search</label>
                    <Input
                        placeholder="Job title, company, keywords..."
                        value={filters.search}
                        onChange={(e) => handleFilterChange('search', e.target.value)}
                        className="w-full"
                    />
                </div>

                {/* State */}
                <div>
                    <label className="text-sm font-medium mb-2 block flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        State
                    </label>
                    <Select value={filters.state} onValueChange={(v) => handleFilterChange('state', v)}>
                        <SelectTrigger>
                            <SelectValue placeholder="All States" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All States</SelectItem>
                            {states.map(state => (
                                <SelectItem key={state} value={state}>{state}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Job Type */}
                <div>
                    <label className="text-sm font-medium mb-2 block flex items-center gap-1">
                        <Briefcase className="w-3 h-3" />
                        Job Type
                    </label>
                    <Select value={filters.jobType} onValueChange={(v) => handleFilterChange('jobType', v)}>
                        <SelectTrigger>
                            <SelectValue placeholder="All Types" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Types</SelectItem>
                            <SelectItem value="FULL_TIME">Full Time</SelectItem>
                            <SelectItem value="PART_TIME">Part Time</SelectItem>
                            <SelectItem value="CONTRACT">Contract</SelectItem>
                            <SelectItem value="TEMPORARY">Temporary</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Remote */}
                <div>
                    <label className="text-sm font-medium mb-2 block flex items-center gap-1">
                        <Home className="w-3 h-3" />
                        Remote
                    </label>
                    <Select value={filters.remote} onValueChange={(v) => handleFilterChange('remote', v)}>
                        <SelectTrigger>
                            <SelectValue placeholder="All Jobs" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Jobs</SelectItem>
                            <SelectItem value="yes">Remote Only</SelectItem>
                            <SelectItem value="no">On-site Only</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Active Filters */}
            {(filters.search || filters.state !== 'all' || filters.jobType !== 'all' || filters.remote !== 'all') && (
                <div className="mt-4 flex items-center gap-2 flex-wrap">
                    <span className="text-sm text-muted-foreground">Active filters:</span>
                    {filters.search && (
                        <Badge variant="secondary" className="cursor-pointer" onClick={() => handleFilterChange('search', '')}>
                            Search: {filters.search} ×
                        </Badge>
                    )}
                    {filters.state !== 'all' && (
                        <Badge variant="secondary" className="cursor-pointer" onClick={() => handleFilterChange('state', 'all')}>
                            State: {filters.state} ×
                        </Badge>
                    )}
                    {filters.jobType !== 'all' && (
                        <Badge variant="secondary" className="cursor-pointer" onClick={() => handleFilterChange('jobType', 'all')}>
                            Type: {filters.jobType.replace('_', ' ')} ×
                        </Badge>
                    )}
                    {filters.remote !== 'all' && (
                        <Badge variant="secondary" className="cursor-pointer" onClick={() => handleFilterChange('remote', 'all')}>
                            Remote: {filters.remote} ×
                        </Badge>
                    )}
                </div>
            )}
        </div>
    );
}
