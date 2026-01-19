'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

interface FilterSection {
    title: string;
    isOpen: boolean;
}

export interface JobFiltersState {
    sortBy: string;
    datePosted: string;
    salaryMin: number;
    salaryMax: number;
    remote: string[];
    location: string[];
    company: string[];
    employmentType: string[];
    hours: string[];
}

interface JobFilterSidebarProps {
    onFilterChange: (filters: JobFiltersState) => void;
    availableLocations: string[];
    availableCompanies: string[];
}

export function JobFilterSidebar({ onFilterChange, availableLocations, availableCompanies }: JobFilterSidebarProps) {
    const [openSections, setOpenSections] = useState<Record<string, boolean>>({
        sortBy: true,
        datePosted: true,
        salary: false,
        remote: false,
        location: false,
        category: false,
        company: false,
        employmentType: false,
        hours: false
    });

    const [filters, setFilters] = useState<JobFiltersState>({
        sortBy: 'relevance',
        datePosted: 'any',
        salaryMin: 0,
        salaryMax: 300000,
        remote: [],
        location: [],
        company: [],
        employmentType: [],
        hours: []
    });

    const toggleSection = (section: string) => {
        setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    const updateFilter = (key: keyof JobFiltersState, value: any) => {
        const newFilters = { ...filters, [key]: value };
        setFilters(newFilters);
        onFilterChange(newFilters);
    };

    const toggleArrayFilter = (key: keyof JobFiltersState, value: string) => {
        const currentArray = filters[key] as string[];
        const newArray = currentArray.includes(value)
            ? currentArray.filter(v => v !== value)
            : [...currentArray, value];
        updateFilter(key, newArray);
    };

    const FilterSection = ({ title, children, sectionKey }: { title: string; children: React.ReactNode; sectionKey: string }) => (
        <div className="border-b last:border-b-0">
            <button
                onClick={() => toggleSection(sectionKey)}
                className="w-full flex items-center justify-between py-4 px-4 hover:bg-muted/50 transition-colors"
            >
                <span className="font-medium text-sm">{title}</span>
                {openSections[sectionKey] ? (
                    <ChevronUp className="w-4 h-4 text-muted-foreground" />
                ) : (
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                )}
            </button>
            {openSections[sectionKey] && (
                <div className="px-4 pb-4">
                    {children}
                </div>
            )}
        </div>
    );

    return (
        <div className="bg-card border rounded-lg overflow-hidden sticky top-4 max-h-[calc(100vh-2rem)] flex flex-col">
            <div className="p-4 border-b bg-muted/30 shrink-0">
                <h2 className="font-semibold text-lg">Filter results</h2>
            </div>
            <div className="overflow-y-auto flex-1">

                {/* Sort By */}
                <FilterSection title="Sort by" sectionKey="sortBy">
                    <RadioGroup value={filters.sortBy} onValueChange={(v) => updateFilter('sortBy', v)}>
                        <div className="flex items-center space-x-2 mb-2">
                            <RadioGroupItem value="relevance" id="sort-relevance" />
                            <Label htmlFor="sort-relevance" className="text-sm cursor-pointer">Relevance</Label>
                        </div>
                        <div className="flex items-center space-x-2 mb-2">
                            <RadioGroupItem value="date" id="sort-date" />
                            <Label htmlFor="sort-date" className="text-sm cursor-pointer">Date posted</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="salary" id="sort-salary" />
                            <Label htmlFor="sort-salary" className="text-sm cursor-pointer">Salary</Label>
                        </div>
                    </RadioGroup>
                </FilterSection>

                {/* Date Posted */}
                <FilterSection title="Date posted" sectionKey="datePosted">
                    <RadioGroup value={filters.datePosted} onValueChange={(v) => updateFilter('datePosted', v)}>
                        <div className="flex items-center space-x-2 mb-2">
                            <RadioGroupItem value="any" id="date-any" />
                            <Label htmlFor="date-any" className="text-sm cursor-pointer">Any time</Label>
                        </div>
                        <div className="flex items-center space-x-2 mb-2">
                            <RadioGroupItem value="24h" id="date-24h" />
                            <Label htmlFor="date-24h" className="text-sm cursor-pointer">Last 24 hours</Label>
                        </div>
                        <div className="flex items-center space-x-2 mb-2">
                            <RadioGroupItem value="7d" id="date-7d" />
                            <Label htmlFor="date-7d" className="text-sm cursor-pointer">Last 7 days</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="30d" id="date-30d" />
                            <Label htmlFor="date-30d" className="text-sm cursor-pointer">Last 30 days</Label>
                        </div>
                    </RadioGroup>
                </FilterSection>

                {/* Salary */}
                <FilterSection title="Salary" sectionKey="salary">
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <Label className="text-xs text-muted-foreground mb-1 block">Min</Label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">$</span>
                                    <input
                                        type="number"
                                        value={filters.salaryMin}
                                        onChange={(e) => updateFilter('salaryMin', parseInt(e.target.value) || 0)}
                                        className="w-full pl-6 pr-2 py-1.5 text-sm border rounded-md"
                                        min={0}
                                        max={filters.salaryMax}
                                        step={5000}
                                    />
                                </div>
                            </div>
                            <div>
                                <Label className="text-xs text-muted-foreground mb-1 block">Max</Label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">$</span>
                                    <input
                                        type="number"
                                        value={filters.salaryMax}
                                        onChange={(e) => updateFilter('salaryMax', parseInt(e.target.value) || 200000)}
                                        className="w-full pl-6 pr-2 py-1.5 text-sm border rounded-md"
                                        min={filters.salaryMin}
                                        max={300000}
                                        step={5000}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="pt-2">
                            <Slider
                                min={0}
                                max={300000}
                                step={5000}
                                value={[filters.salaryMin, filters.salaryMax]}
                                onValueChange={([min, max]: number[]) => {
                                    updateFilter('salaryMin', min);
                                    updateFilter('salaryMax', max);
                                }}
                                className="w-full"
                            />
                            <div className="flex justify-between text-xs text-muted-foreground mt-1">
                                <span>$0</span>
                                <span>$300K</span>
                            </div>
                        </div>
                    </div>
                </FilterSection>

                {/* Remote */}
                <FilterSection title="Remote" sectionKey="remote">
                    <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="remote-yes"
                                checked={filters.remote.includes('yes')}
                                onCheckedChange={() => toggleArrayFilter('remote', 'yes')}
                            />
                            <Label htmlFor="remote-yes" className="text-sm cursor-pointer">Remote</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="remote-hybrid"
                                checked={filters.remote.includes('hybrid')}
                                onCheckedChange={() => toggleArrayFilter('remote', 'hybrid')}
                            />
                            <Label htmlFor="remote-hybrid" className="text-sm cursor-pointer">Hybrid</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="remote-no"
                                checked={filters.remote.includes('no')}
                                onCheckedChange={() => toggleArrayFilter('remote', 'no')}
                            />
                            <Label htmlFor="remote-no" className="text-sm cursor-pointer">On-site</Label>
                        </div>
                    </div>
                </FilterSection>

                {/* Location */}
                <FilterSection title="Location" sectionKey="location">
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                        {availableLocations.slice(0, 10).map((loc) => (
                            <div key={loc} className="flex items-center space-x-2">
                                <Checkbox
                                    id={`loc-${loc}`}
                                    checked={filters.location.includes(loc)}
                                    onCheckedChange={() => toggleArrayFilter('location', loc)}
                                />
                                <Label htmlFor={`loc-${loc}`} className="text-sm cursor-pointer">{loc}</Label>
                            </div>
                        ))}
                    </div>
                </FilterSection>

                {/* Employment Type */}
                <FilterSection title="Employment type" sectionKey="employmentType">
                    <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="type-full"
                                checked={filters.employmentType.includes('FULL_TIME')}
                                onCheckedChange={() => toggleArrayFilter('employmentType', 'FULL_TIME')}
                            />
                            <Label htmlFor="type-full" className="text-sm cursor-pointer">Full-time</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="type-part"
                                checked={filters.employmentType.includes('PART_TIME')}
                                onCheckedChange={() => toggleArrayFilter('employmentType', 'PART_TIME')}
                            />
                            <Label htmlFor="type-part" className="text-sm cursor-pointer">Part-time</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="type-contract"
                                checked={filters.employmentType.includes('CONTRACT')}
                                onCheckedChange={() => toggleArrayFilter('employmentType', 'CONTRACT')}
                            />
                            <Label htmlFor="type-contract" className="text-sm cursor-pointer">Contract</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="type-temp"
                                checked={filters.employmentType.includes('TEMPORARY')}
                                onCheckedChange={() => toggleArrayFilter('employmentType', 'TEMPORARY')}
                            />
                            <Label htmlFor="type-temp" className="text-sm cursor-pointer">Temporary</Label>
                        </div>
                    </div>
                </FilterSection>

                {/* Company */}
                <FilterSection title="Company" sectionKey="company">
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                        {availableCompanies.slice(0, 10).map((company) => (
                            <div key={company} className="flex items-center space-x-2">
                                <Checkbox
                                    id={`company-${company}`}
                                    checked={filters.company.includes(company)}
                                    onCheckedChange={() => toggleArrayFilter('company', company)}
                                />
                                <Label htmlFor={`company-${company}`} className="text-sm cursor-pointer text-ellipsis overflow-hidden whitespace-nowrap">
                                    {company}
                                </Label>
                            </div>
                        ))}
                    </div>
                </FilterSection>
            </div>{/* End scrollable wrapper */}

            {/* Clear Filters - Fixed at bottom */}
            <div className="p-4 border-t shrink-0">
                <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                        const resetFilters: JobFiltersState = {
                            sortBy: 'relevance',
                            datePosted: 'any',
                            salaryMin: 0,
                            salaryMax: 300000,
                            remote: [],
                            location: [],
                            company: [],
                            employmentType: [],
                            hours: []
                        };
                        setFilters(resetFilters);
                        onFilterChange(resetFilters);
                    }}
                >
                    Clear all filters
                </Button>
            </div>
        </div>
    );
}
