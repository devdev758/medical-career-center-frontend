'use client';

import Link from 'next/link';
import { formatSalary, formatNumber, calculatePercentChange } from '@/lib/salary-utils';
import { MapPin, ArrowUpRight, Briefcase } from 'lucide-react';

interface CityData {
    city: string;
    state: string;
    median: number;
    employment: number;
    jobsPer1000?: number | null;
    locationQuotient?: number | null;
}

interface CityComparisonTableProps {
    cities: CityData[];
    baselineMedian: number; // State or national median for comparison
    profession: string;
    stateCode?: string; // If provided, shows cities in a specific state
    showAll?: boolean;
    limit?: number;
    title?: string;
}

export function CityComparisonTable({
    cities,
    baselineMedian,
    profession,
    stateCode,
    showAll = false,
    limit = 10,
    title = 'Top Paying Cities',
}: CityComparisonTableProps) {
    const displayCities = showAll ? cities : cities.slice(0, limit);

    const createCitySlug = (city: string) => {
        return city.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {title}
                </h3>
                {!showAll && cities.length > limit && (
                    <Link
                        href={stateCode ? `/${profession}/salary/${stateCode.toLowerCase()}` : `/${profession}/salary`}
                        className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 flex items-center gap-1"
                    >
                        View all {cities.length} cities
                        <ArrowUpRight className="w-4 h-4" />
                    </Link>
                )}
            </div>

            <div className="grid gap-3 md:grid-cols-2">
                {displayCities.map((city, index) => {
                    const change = calculatePercentChange(city.median, baselineMedian);
                    const cityUrl = `/${profession}/salary/${city.state.toLowerCase()}/${createCitySlug(city.city)}`;

                    return (
                        <Link
                            key={`${city.city}-${city.state}`}
                            href={cityUrl}
                            className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-md transition-all"
                        >
                            <div className="flex items-center gap-3">
                                <div className="flex items-center justify-center w-8 h-8 bg-blue-50 dark:bg-blue-900/30 rounded-full text-blue-600 dark:text-blue-400 text-sm font-bold">
                                    {index + 1}
                                </div>
                                <div>
                                    <div className="flex items-center gap-1 font-medium text-gray-900 dark:text-gray-100">
                                        <MapPin className="w-4 h-4 text-gray-400" />
                                        {city.city}, {city.state}
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                                        <Briefcase className="w-3 h-3" />
                                        {formatNumber(city.employment)} jobs
                                    </div>
                                </div>
                            </div>

                            <div className="text-right">
                                <div className="font-semibold text-gray-900 dark:text-gray-100">
                                    {formatSalary(city.median)}
                                </div>
                                <div className={`text-xs font-medium ${change.isPositive
                                        ? 'text-green-600 dark:text-green-400'
                                        : 'text-red-600 dark:text-red-400'
                                    }`}>
                                    {change.formatted}
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>

            {!showAll && cities.length > limit && (
                <div className="text-center pt-2">
                    <Link
                        href={stateCode ? `/${profession}/salary/${stateCode.toLowerCase()}` : `/${profession}/salary`}
                        className="inline-flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:underline"
                    >
                        See all {cities.length} cities →
                    </Link>
                </div>
            )}
        </div>
    );
}
