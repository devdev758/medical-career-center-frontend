'use client';

import { interpretLocationQuotient } from '@/lib/salary-utils';
import { BarChart2, TrendingUp, TrendingDown, Info } from 'lucide-react';

interface LocationInsightCardProps {
    locationQuotient: number | null | undefined;
    jobsPer1000: number | null | undefined;
    stateName?: string;
    professionName: string;
}

export function LocationInsightCard({
    locationQuotient,
    jobsPer1000,
    stateName,
    professionName,
}: LocationInsightCardProps) {
    const insight = interpretLocationQuotient(locationQuotient);

    if (!locationQuotient && !jobsPer1000) {
        return null;
    }

    return (
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 p-6">
            <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${insight.isAboveAverage
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                        : 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400'
                    }`}>
                    {insight.isAboveAverage
                        ? <TrendingUp className="w-6 h-6" />
                        : <TrendingDown className="w-6 h-6" />
                    }
                </div>

                <div className="flex-1 min-w-0">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
                        Job Market Insight {stateName ? `for ${stateName}` : ''}
                    </h4>

                    <div className="space-y-2">
                        {locationQuotient && (
                            <div className="flex items-baseline gap-2">
                                <span className={`text-xl font-bold ${insight.isAboveAverage
                                        ? 'text-green-600 dark:text-green-400'
                                        : 'text-orange-600 dark:text-orange-400'
                                    }`}>
                                    {insight.text}
                                </span>
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                    (LQ: {locationQuotient.toFixed(2)})
                                </span>
                            </div>
                        )}

                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            {insight.description}
                        </p>

                        {jobsPer1000 && (
                            <div className="flex items-center gap-2 pt-2 border-t border-gray-200 dark:border-gray-700 mt-3">
                                <BarChart2 className="w-4 h-4 text-gray-400" />
                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                    <strong>{jobsPer1000.toFixed(1)}</strong> {professionName.toLowerCase()} jobs per 1,000 total jobs
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Info tooltip */}
            <div className="mt-4 flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <Info className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-blue-700 dark:text-blue-300">
                    <strong>Location Quotient (LQ)</strong> compares the concentration of jobs in this area to the national average.
                    LQ = 1.0 means average, &gt; 1.0 means more jobs per capita, &lt; 1.0 means fewer.
                </p>
            </div>
        </div>
    );
}
