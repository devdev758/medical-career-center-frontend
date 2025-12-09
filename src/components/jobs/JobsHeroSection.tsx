'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, MapPin, TrendingUp } from 'lucide-react';

interface JobsHeroSectionProps {
    totalJobs: number;
    totalProfessions: number;
}

export function JobsHeroSection({ totalJobs, totalProfessions }: JobsHeroSectionProps) {
    const router = useRouter();
    const [keyword, setKeyword] = useState('');
    const [location, setLocation] = useState('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (keyword) params.set('q', keyword);
        if (location) params.set('location', location);
        router.push(`/jobs?${params.toString()}`);
    };

    return (
        <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950/20 dark:via-indigo-950/20 dark:to-purple-950/20 rounded-2xl p-8 md:p-12 mb-12">
            <div className="max-w-3xl mx-auto text-center">
                <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    Find Your Next Healthcare Career
                </h1>
                <p className="text-xl text-muted-foreground mb-8">
                    Discover opportunities across {totalProfessions} healthcare professions
                </p>

                {/* Search Form */}
                <form onSubmit={handleSearch} className="mb-8">
                    <div className="flex flex-col md:flex-row gap-3 bg-white dark:bg-gray-900 p-2 rounded-lg shadow-lg">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            <Input
                                type="text"
                                placeholder="Job title, keywords, or company"
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
                                className="pl-10 border-0 focus-visible:ring-0 h-12"
                            />
                        </div>
                        <div className="flex-1 relative">
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            <Input
                                type="text"
                                placeholder="City, state, or zip code"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                className="pl-10 border-0 focus-visible:ring-0 h-12"
                            />
                        </div>
                        <Button type="submit" size="lg" className="h-12 px-8">
                            Search Jobs
                        </Button>
                    </div>
                </form>

                {/* Stats */}
                <div className="flex flex-wrap justify-center gap-8 text-sm">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="font-semibold">{totalJobs.toLocaleString()}+</span>
                        <span className="text-muted-foreground">Active Jobs</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-blue-500" />
                        <span className="font-semibold">{totalProfessions}</span>
                        <span className="text-muted-foreground">Professions</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-purple-500" />
                        <span className="font-semibold">All 50</span>
                        <span className="text-muted-foreground">States</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
