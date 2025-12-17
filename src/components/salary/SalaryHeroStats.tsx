'use client';

import { formatSalary, formatNumber } from '@/lib/salary-utils';
import { DollarSign, Users, TrendingUp, MapPin, BarChart2, Building } from 'lucide-react';

interface StatCardProps {
    icon: React.ReactNode;
    label: string;
    value: string;
    subValue?: string;
    highlight?: boolean;
}

function StatCard({ icon, label, value, subValue, highlight = false }: StatCardProps) {
    return (
        <div className={`relative overflow-hidden rounded-xl p-6 ${highlight
                ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white'
                : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
            }`}>
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-3 ${highlight
                    ? 'bg-white/20'
                    : 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                }`}>
                {icon}
            </div>
            <div className={`text-sm font-medium mb-1 ${highlight ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
                }`}>
                {label}
            </div>
            <div className={`text-3xl font-bold ${highlight ? 'text-white' : 'text-gray-900 dark:text-gray-100'
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
}: SalaryHeroStatsProps) {
    const locationText = location?.city
        ? `${location.city}, ${location.stateName}`
        : location?.stateName || 'United States';

    return (
        <div className="space-y-6">
            {/* Title */}
            <div className="text-center md:text-left">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100">
                    {professionName} Salary {location ? `in ${locationText}` : 'Guide'} 2024
                </h1>
                {location && (
                    <p className="mt-2 text-gray-600 dark:text-gray-400 flex items-center justify-center md:justify-start gap-2">
                        <MapPin className="w-4 h-4" />
                        {locationText}
                    </p>
                )}
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard
                    icon={<DollarSign className="w-6 h-6" />}
                    label="Median Salary"
                    value={formatSalary(medianSalary)}
                    subValue={hourlyRate ? `${formatSalary(hourlyRate, 'hourly')}/hour` : undefined}
                    highlight
                />

                <StatCard
                    icon={<Users className="w-6 h-6" />}
                    label="Total Jobs"
                    value={formatNumber(employment)}
                    subValue={location ? `in ${location.stateName || 'this area'}` : 'nationwide'}
                />

                {topPercentile && (
                    <StatCard
                        icon={<TrendingUp className="w-6 h-6" />}
                        label="Top 10% Earn"
                        value={formatSalary(topPercentile)}
                        subValue="or more"
                    />
                )}

                {vsNational && (
                    <StatCard
                        icon={<BarChart2 className="w-6 h-6" />}
                        label="vs National Avg"
                        value={vsNational.formatted}
                        subValue={vsNational.isPositive ? 'above average' : 'below average'}
                    />
                )}

                {!vsNational && locationQuotient && (
                    <StatCard
                        icon={<Building className="w-6 h-6" />}
                        label="Job Concentration"
                        value={locationQuotient >= 1 ? 'Above Avg' : 'Below Avg'}
                        subValue={`LQ: ${locationQuotient.toFixed(2)}`}
                    />
                )}
            </div>

            {/* Location Quotient Note */}
            {jobsPer1000 && (
                <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                    <BarChart2 className="w-4 h-4" />
                    {jobsPer1000.toFixed(1)} {professionName.toLowerCase()} jobs per 1,000 total jobs in this area
                </p>
            )}
        </div>
    );
}
