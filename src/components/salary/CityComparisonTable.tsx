'use client';

import Link from 'next/link';
import { formatSalary, formatNumber, calculatePercentChange } from '@/lib/salary-utils';
import { MapPin, Briefcase } from 'lucide-react';

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
    limit?: number;
    title?: string;
}

export function CityComparisonTable({
    cities,
    baselineMedian,
    profession,
    stateCode,
    limit = 20,
    title = 'Top Paying Cities',
}: CityComparisonTableProps) {
    const displayCities = cities.slice(0, limit);

    const createCitySlug = (city: string) => {
        return city.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    };

    return (
        <div className="space-y-4">
            <h3 className="text-xl font-semibold text-[#003554]">
                {title}
            </h3>

            <div className="grid gap-3 md:grid-cols-2">
                {displayCities.map((city, index) => {
                    const change = calculatePercentChange(city.median, baselineMedian);
                    const cityUrl = `/${profession}/salary/${city.state.toLowerCase()}/${createCitySlug(city.city)}`;

                    return (
                        <Link
                            key={`${city.city}-${city.state}`}
                            href={cityUrl}
                            className="flex items-center justify-between p-4 bg-white rounded-lg border border-[#006494]/10 hover:border-[#0582CA]/30 hover:shadow-md transition-all"
                        >
                            <div className="flex items-center gap-3">
                                <div className="flex items-center justify-center w-8 h-8 bg-[#003554]/10 rounded-full text-[#003554] text-sm font-bold">
                                    {index + 1}
                                </div>
                                <div>
                                    <div className="flex items-center gap-1 font-medium text-[#003554]">
                                        <MapPin className="w-4 h-4 text-[#6B7280]" />
                                        {city.city}, {city.state}
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-[#6B7280]">
                                        <Briefcase className="w-3 h-3" />
                                        {formatNumber(city.employment)} jobs
                                    </div>
                                </div>
                            </div>

                            <div className="text-right">
                                <div className="font-semibold text-[#003554]">
                                    {formatSalary(city.median)}
                                </div>
                                <div className={`text-xs font-medium ${change.isPositive
                                    ? 'text-green-600'
                                    : 'text-red-600'
                                    }`}>
                                    {change.formatted}
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>
            {/* Removed the "View all" link as it was broken and unnecessary for top 20 list */}
        </div>
    );
}
