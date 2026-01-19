'use client';

import { formatSalary } from '@/lib/salary-utils';
import { DollarSign, TrendingUp, MapPin, Users } from 'lucide-react';

interface SalaryHeroProps {
    professionName: string;
    medianSalary: number;
    employment: number;
    locationName?: string;
    hourlyRate?: number;
    jobsPer1000?: number | null;
}

export function SalaryHero({
    professionName,
    medianSalary,
    employment,
    locationName = 'United States',
    hourlyRate,
    jobsPer1000
}: SalaryHeroProps) {
    return (
        <div className="relative overflow-hidden rounded-3xl bg-card border border-border/50 p-8 md:p-12 mb-8">
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px] -z-10" />

            <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                        <DollarSign className="w-4 h-4" />
                        <span>Salary Data 2024-2025</span>
                    </div>

                    <div>
                        <p className="text-muted-foreground text-lg mb-1">Median Annual Salary in {locationName}</p>
                        <h1 className="text-5xl md:text-7xl font-heating font-bold tracking-tight text-foreground">
                            {formatSalary(medianSalary)}
                        </h1>
                        {hourlyRate && (
                            <p className="text-xl text-muted-foreground mt-2 font-mono">
                                {formatSalary(hourlyRate, 'hourly')}/hour
                            </p>
                        )}
                    </div>

                    <div className="flex flex-wrap gap-6 pt-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-primary" />
                            <span>{employment.toLocaleString()} Active Jobs</span>
                        </div>
                        {jobsPer1000 && (
                            <div className="flex items-center gap-2">
                                <TrendingUp className="w-4 h-4 text-green-500" />
                                <span>{jobsPer1000.toFixed(1)} Density Score</span>
                            </div>
                        )}
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-green-500 font-medium">High Confidence</span>
                        </div>
                    </div>
                </div>

                <div className="hidden md:block relative h-full min-h-[200px]">
                    {/* Abstract minimal viz or huge percent change */}
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 text-right">
                        <div className="text-sm text-muted-foreground uppercase tracking-wider mb-2">Market Outlook</div>
                        <div className="text-4xl font-bold text-primary">+8.2%</div>
                        <div className="text-sm text-muted-foreground">Growth Rate (10yr)</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
