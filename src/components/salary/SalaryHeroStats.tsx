'use client';

import { formatSalary, formatNumber } from '@/lib/salary-utils';
import { DollarSign, Users, TrendingUp, MapPin, BarChart2, Building, Trophy, Map } from 'lucide-react';

interface StatCardProps {
    icon: React.ReactNode;
    label: string;
    value: string;
    subValue?: string;
    highlight?: boolean;
    color?: string; // Allow custom icon background
}

function StatCard({ icon, label, value, subValue, highlight = false, color }: StatCardProps) {
    const bgClass = color || (highlight ? 'bg-white/20' : 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400');

    return (
        <div className={`relative overflow-hidden rounded-xl p-6 ${highlight
            ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white'
            : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
            }`}>
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-3 ${bgClass}`}>
                {icon}
            </div>
            <div className={`text-sm font-medium mb-1 ${highlight ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
                }`}>
                {label}
            </div>
            <div className={`text-2xl font-bold ${highlight ? 'text-white' : 'text-gray-900 dark:text-gray-100'
                }`}>
                {value}
            </div>
            {subValue && (
                <div className={`text-sm mt-1 ${highlight ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
                    }`}>
                    {subValue}
                </div>
            )}
        </div>
    );
}

interface SalaryHeroStatsProps {
    professionName: string;
    medianSalary: number;
    employment: number;
    topPercentile?: number;
    hourlyRate?: number;
    location?: {
        city?: string;
        stateName?: string;
    };
    vsNational?: {
        percent: number;
        formatted: string;
        isPositive: boolean;
    };
    jobsPer1000?: number | null;
    locationQuotient?: number | null;
    topState?: {
        name: string;
        salary: number;
    };
    topCity?: {
        name: string;
        salary: number;
    };
}

export function SalaryHeroStats({
    professionName,
    medianSalary,
    employment,
    topPercentile,
    hourlyRate,
    location,
    vsNational,
    jobsPer1000,
    locationQuotient,
    topState,
    topCity,
}: SalaryHeroStatsProps) {

    // We removed the internal Title as requested. The parent page should render the H1.

    return (
        <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {/* 1. Median Salary (Highlighted) */}
                <StatCard
                    icon={<DollarSign className="w-6 h-6" />}
                    label="Median Salary"
                    value={formatSalary(medianSalary)}
                    subValue={hourlyRate ? `${formatSalary(hourlyRate, 'hourly')}/hour` : undefined}
                    highlight
                />

                {/* 2. Top Earner (Top 10%) */}
                {topPercentile && (
                    <StatCard
                        icon={<TrendingUp className="w-6 h-6" />}
                        label="Top Earners (90%)"
                        value={formatSalary(topPercentile)}
                        subValue="High experience"
                        color="bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400"
                    />
                )}

                {/* 3. Top State (New) */}
                {topState && (
                    <StatCard
                        icon={<Trophy className="w-6 h-6" />}
                        label="Top Paying State"
                        value={topState.name}
                        subValue={`${formatSalary(topState.salary)} avg`}
                        color="bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"
                    />
                )}

                {/* 4. Top City (New) */}
                {topCity && (
                    <StatCard
                        icon={<Building className="w-6 h-6" />}
                        label="Top Paying City"
                        value={topCity.name}
                        subValue={`${formatSalary(topCity.salary)} avg`}
                        color="bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400"
                    />
                )}

                {/* 5. Employment / Comparison */}
                {/* Prioritize vsNational if available (State pages), else Employment (National) */}
                {vsNational ? (
                    <StatCard
                        icon={<BarChart2 className="w-6 h-6" />}
                        label="vs National Avg"
                        value={vsNational.formatted}
                        subValue={vsNational.isPositive ? 'Higher' : 'Lower'}
                        color="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400"
                    />
                ) : (
                    <StatCard
                        icon={<Users className="w-6 h-6" />}
                        label="Total Employment"
                        value={formatNumber(employment)}
                        subValue="Nationwide"
                        color="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                    />
                )}
            </div>

            {/* Location Quotient / Jobs Density Note */}
            {jobsPer1000 && (
                <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                    <BarChart2 className="w-4 h-4" />
                    {jobsPer1000.toFixed(1)} {professionName.toLowerCase()} jobs per 1,000 total jobs in this area
                </p>
            )}
        </div>
    );
}
