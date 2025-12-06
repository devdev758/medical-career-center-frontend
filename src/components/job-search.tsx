"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, X } from "lucide-react";
import { useState, useEffect } from "react";

interface JobSearchProps {
    categories: Array<{ id: string; name: string; icon: string }>;
}

export function JobSearch({ categories }: JobSearchProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [keyword, setKeyword] = useState(searchParams.get("q") || "");
    const [location, setLocation] = useState(searchParams.get("location") || "");
    const [categoryId, setCategoryId] = useState(searchParams.get("category") || "");
    const [experienceLevel, setExperienceLevel] = useState(searchParams.get("level") || "");
    const [jobType, setJobType] = useState(searchParams.get("type") || "");
    const [remote, setRemote] = useState(searchParams.get("remote") === "true");

    const handleSearch = () => {
        const params = new URLSearchParams();
        if (keyword) params.set("q", keyword);
        if (location) params.set("location", location);
        if (categoryId) params.set("category", categoryId);
        if (experienceLevel) params.set("level", experienceLevel);
        if (jobType) params.set("type", jobType);
        if (remote) params.set("remote", "true");

        router.push(`/jobs?${params.toString()}`);
    };

    const handleClear = () => {
        setKeyword("");
        setLocation("");
        setCategoryId("");
        setExperienceLevel("");
        setJobType("");
        setRemote(false);
        router.push("/jobs");
    };

    const hasActiveFilters = keyword || location || categoryId || experienceLevel || jobType || remote;

    return (
        <div className="bg-muted/50 p-6 rounded-lg space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg">Search & Filter</h3>
                {hasActiveFilters && (
                    <Button variant="ghost" size="sm" onClick={handleClear}>
                        <X className="w-4 h-4 mr-1" />
                        Clear All
                    </Button>
                )}
            </div>

            <div className="space-y-4">
                {/* Keyword Search */}
                <div className="space-y-2">
                    <Label htmlFor="keyword">Keyword</Label>
                    <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                            id="keyword"
                            placeholder="Job title, company, or keyword..."
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                            className="pl-9"
                        />
                    </div>
                </div>

                {/* Location */}
                <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                        id="location"
                        placeholder="City, state, or zip code"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    />
                </div>

                {/* Category */}
                <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select value={categoryId} onValueChange={setCategoryId}>
                        <SelectTrigger>
                            <SelectValue placeholder="All categories" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All categories</SelectItem>
                            {categories.map((cat) => (
                                <SelectItem key={cat.id} value={cat.id}>
                                    {cat.icon} {cat.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Experience Level */}
                <div className="space-y-2">
                    <Label htmlFor="level">Experience Level</Label>
                    <Select value={experienceLevel} onValueChange={setExperienceLevel}>
                        <SelectTrigger>
                            <SelectValue placeholder="All levels" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All levels</SelectItem>
                            <SelectItem value="ENTRY">Entry Level</SelectItem>
                            <SelectItem value="MID">Mid Level</SelectItem>
                            <SelectItem value="SENIOR">Senior Level</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Job Type */}
                <div className="space-y-2">
                    <Label htmlFor="jobType">Job Type</Label>
                    <Select value={jobType} onValueChange={setJobType}>
                        <SelectTrigger>
                            <SelectValue placeholder="All types" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All types</SelectItem>
                            <SelectItem value="FULL_TIME">Full Time</SelectItem>
                            <SelectItem value="PART_TIME">Part Time</SelectItem>
                            <SelectItem value="CONTRACT">Contract</SelectItem>
                            <SelectItem value="INTERNSHIP">Internship</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Remote */}
                <div className="flex items-center space-x-2">
                    <Checkbox
                        id="remote"
                        checked={remote}
                        onCheckedChange={(checked) => setRemote(checked as boolean)}
                    />
                    <Label htmlFor="remote" className="cursor-pointer">
                        Remote positions only
                    </Label>
                </div>

                <Button onClick={handleSearch} className="w-full">
                    <Search className="w-4 h-4 mr-2" />
                    Search Jobs
                </Button>
            </div>
        </div>
    );
}
