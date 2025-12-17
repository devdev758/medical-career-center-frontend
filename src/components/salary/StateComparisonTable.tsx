'use client';

import { useState } from 'react';
import Link from 'next/link';
import { formatSalary, formatNumber, calculatePercentChange } from '@/lib/salary-utils';
import { ArrowUpRight, ArrowDownRight, ChevronDown, ChevronUp, MapPin } from 'lucide-react';

interface StateData {
    state: string;
    stateName: string;
    median: number;
    employment: number;
    jobsPer1000?: number | null;
    locationQuotient?: number | null;
}

interface StateComparisonTableProps {
    states: StateData[];
    nationalMedian: number;
    profession: string;
    limit?: number;
}

export function StateComparisonTable({
    states,
    nationalMedian,
    profession,
    limit = 10,
}: StateComparisonTableProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    // Sort states by salary descending
    const sortedStates = [...states].sort((a, b) => b.median - a.median);
    const displayStates = isExpanded ? sortedStates : sortedStates.slice(0, limit);

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Salary by State
            </h3>

            <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Rank
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                State
                            </th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Median Salary
                            </th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                vs National
                            </th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Jobs
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                        {displayStates.map((state, index) => {
                            const change = calculatePercentChange(state.median, nationalMedian);

                            return (
                                <tr
                                    key={state.state}
                                    className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                >
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                        {index + 1}
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap">
                                        <Link
                                            href={`/${profession}/salary/${state.state.toLowerCase()}`}
                                            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 font-medium"
                                        >
                                            <MapPin className="w-4 h-4" />
                                            {state.stateName}
                                        </Link>
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-semibold text-gray-900 dark:text-gray-100">
                                        {formatSalary(state.median)}
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-right">
                                        <span className={`inline-flex items-center gap-1 text-sm font-medium ${change.isPositive
                                                ? 'text-green-600 dark:text-green-400'
                                                : 'text-red-600 dark:text-red-400'
                                            }`}>
                                            {change.isPositive
                                                ? <ArrowUpRight className="w-4 h-4" />
                                                : <ArrowDownRight className="w-4 h-4" />
                                            }
                                            {change.formatted}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-right text-sm text-gray-600 dark:text-gray-400">
                                        {formatNumber(state.employment)}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {states.length > limit && (
                <div className="text-center pt-2">
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors text-sm font-medium"
                    >
                        {isExpanded ? (
                            <>
                                <ChevronUp className="w-4 h-4" />
                                Show Less
                            </>
                        ) : (
                            <>
                                <ChevronDown className="w-4 h-4" />
                                Show All {states.length} States
                            </>
                        )}
                    </button>
                </div>
            )}
        </div>
    );
}
