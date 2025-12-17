'use client';

import { formatSalary, formatNumber } from '@/lib/salary-utils';
import { Building2, Users, DollarSign } from 'lucide-react';

interface IndustryData {
    naicsCode: string;
    naicsTitle: string;
    employment: number;
    meanAnnual: number | null;
}

interface IndustryBreakdownProps {
    industries: IndustryData[];
    professionName: string;
    totalEmployment?: number;
}

export function IndustryBreakdown({ industries, professionName, totalEmployment }: IndustryBreakdownProps) {
    // Filter to top 5-6 industries with employment data
    const topIndustries = industries
        .filter(ind => ind.employment > 0)
        .slice(0, 6);

    // Check if totalEmployment seems valid effectively (sometimes BLS sums are tricky)
    // If sum of top industries > totalEmployment, use sum.
    const sumOfTop = topIndustries.reduce((sum, ind) => sum + ind.employment, 0);
    const effectiveTotal = Math.max(totalEmployment || 0, sumOfTop);

    // Colors for the pie chart segments
    const colors = [
        'bg-blue-500',
        'bg-green-500',
        'bg-purple-500',
        'bg-orange-500',
        'bg-pink-500',
        'bg-cyan-500',
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-gray-500" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Where Do {professionName}s Work?
                </h3>
            </div>

            {/* Visual Bar Breakdown */}
            <div className="space-y-4">
                <div className="h-4 rounded-full overflow-hidden flex bg-gray-100 dark:bg-gray-700">
                    {topIndustries.map((ind, i) => {
                        const percent = (ind.employment / effectiveTotal) * 100;
                        return (
                            <div
                                key={ind.naicsCode}
                                className={`${colors[i]} transition-all duration-500`}
                                style={{ width: `${percent}%` }}
                                title={`${ind.naicsTitle}: ${percent.toFixed(1)}%`}
                            />
                        );
                    })}
                </div>

                {/* Legend */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {topIndustries.map((ind, i) => {
                        const percent = (ind.employment / effectiveTotal) * 100;
                        return (
                            <div
                                key={ind.naicsCode}
                                className="flex items-start gap-2"
                            >
                                <div className={`w-3 h-3 rounded-full ${colors[i]} mt-1 flex-shrink-0`} />
                                <div className="min-w-0">
                                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                                        {ind.naicsTitle.replace(/\(.*\)/g, '').trim()}
                                    </div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                        {percent.toFixed(1)}% • {formatNumber(ind.employment)}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Table Detail */}
            <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Industry
                            </th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                                <div className="flex items-center justify-end gap-1">
                                    <Users className="w-3 h-3" />
                                    Employment
                                </div>
                            </th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                                <div className="flex items-center justify-end gap-1">
                                    <DollarSign className="w-3 h-3" />
                                    Avg Salary
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                        {topIndustries.map((ind, i) => (
                            <tr key={ind.naicsCode} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full ${colors[i]}`} />
                                        <span className="text-sm text-gray-900 dark:text-gray-100">
                                            {ind.naicsTitle.replace(/\(.*\)/g, '').trim()}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-4 py-3 text-right text-sm text-gray-600 dark:text-gray-400">
                                    {formatNumber(ind.employment)}
                                </td>
                                <td className="px-4 py-3 text-right text-sm font-medium text-gray-900 dark:text-gray-100">
                                    {ind.meanAnnual ? formatSalary(ind.meanAnnual) : 'N/A'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
