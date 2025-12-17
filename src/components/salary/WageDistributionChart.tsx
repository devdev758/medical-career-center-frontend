'use client';

import { formatSalary } from '@/lib/salary-utils';

interface WageDistributionChartProps {
    data: {
        annual10th?: number | null;
        annual25th?: number | null;
        annualMedian?: number | null;
        annual75th?: number | null;
        annual90th?: number | null;
        hourly10th?: number | null;
        hourly25th?: number | null;
        hourlyMedian?: number | null;
        hourly75th?: number | null;
        hourly90th?: number | null;
    };
    showHourly?: boolean;
}

interface PercentileRow {
    label: string;
    annualValue: number | null;
    hourlyValue: number | null;
    description: string;
    colorClass: string;
    widthPercent: number;
}

export function WageDistributionChart({ data, showHourly = false }: WageDistributionChartProps) {
    const maxValue = data.annual90th || data.annual75th || data.annualMedian || 100000;

    const percentiles: PercentileRow[] = [
        {
            label: '10th Percentile',
            annualValue: data.annual10th || null,
            hourlyValue: data.hourly10th || null,
            description: 'Entry Level',
            colorClass: 'bg-slate-400',
            widthPercent: ((data.annual10th || 0) / maxValue) * 100,
        },
        {
            label: '25th Percentile',
            annualValue: data.annual25th || null,
            hourlyValue: data.hourly25th || null,
            description: 'Early Career',
            colorClass: 'bg-slate-500',
            widthPercent: ((data.annual25th || 0) / maxValue) * 100,
        },
        {
            label: 'Median (50th)',
            annualValue: data.annualMedian || null,
            hourlyValue: data.hourlyMedian || null,
            description: 'Typical',
            colorClass: 'bg-blue-500',
            widthPercent: ((data.annualMedian || 0) / maxValue) * 100,
        },
        {
            label: '75th Percentile',
            annualValue: data.annual75th || null,
            hourlyValue: data.hourly75th || null,
            description: 'Experienced',
            colorClass: 'bg-green-500',
            widthPercent: ((data.annual75th || 0) / maxValue) * 100,
        },
        {
            label: '90th Percentile',
            annualValue: data.annual90th || null,
            hourlyValue: data.hourly90th || null,
            description: 'Top Earners',
            colorClass: 'bg-green-600',
            widthPercent: 100,
        },
    ];

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Salary Distribution
            </h3>

            <div className="space-y-3">
                {percentiles.map((row) => (
                    <div key={row.label} className="flex items-center gap-4">
                        <div className="w-32 flex-shrink-0">
                            <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                {row.label}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                {row.description}
                            </div>
                        </div>

                        <div className="flex-1 relative">
                            <div className="h-8 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                                <div
                                    className={`h-full ${row.colorClass} rounded-lg transition-all duration-500 ease-out flex items-center justify-end pr-2`}
                                    style={{ width: `${Math.min(row.widthPercent, 100)}%` }}
                                >
                                    {row.widthPercent > 30 && (
                                        <span className="text-white text-sm font-semibold">
                                            {formatSalary(row.annualValue)}
                                        </span>
                                    )}
                                </div>
                            </div>
                            {row.widthPercent <= 30 && (
                                <span className="absolute right-0 top-1/2 -translate-y-1/2 text-sm font-semibold text-gray-700 dark:text-gray-300 ml-2">
                                    {formatSalary(row.annualValue)}
                                </span>
                            )}
                        </div>

                        {showHourly && (
                            <div className="w-20 text-right text-sm text-gray-600 dark:text-gray-400">
                                {formatSalary(row.hourlyValue, 'hourly')}/hr
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
                * Based on May 2024 BLS Occupational Employment and Wage Statistics
            </p>
        </div>
    );
}
