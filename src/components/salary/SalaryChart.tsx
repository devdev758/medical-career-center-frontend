'use client';

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatSalary } from '@/lib/salary-utils';

interface SalaryChartProps {
    data: {
        annual10th?: number | null;
        annual25th?: number | null;
        annualMedian?: number | null;
        annual75th?: number | null;
        annual90th?: number | null;
    };
    professionName: string;
}

export function SalaryChart({ data, professionName }: SalaryChartProps) {
    const chartData = [
        { percentile: '10%', salary: data.annual10th || 0, label: 'Entry Level' },
        { percentile: '25%', salary: data.annual25th || 0, label: 'Early Career' },
        { percentile: '50%', salary: data.annualMedian || 0, label: 'Median' },
        { percentile: '75%', salary: data.annual75th || 0, label: 'Experienced' },
        { percentile: '90%', salary: data.annual90th || 0, label: 'Top Earners' },
    ].filter(point => point.salary > 0);

    return (
        <Card className="h-full border-border/50 bg-card active-card">
            <CardHeader>
                <CardTitle className="text-xl font-heading">Earning Potential Curve</CardTitle>
                <p className="text-sm text-muted-foreground">Salary growth potential for {professionName}</p>
            </CardHeader>
            <CardContent>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorSalary" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
                            <XAxis
                                dataKey="label"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                                dy={10}
                            />
                            <YAxis
                                hide
                                domain={['dataMin - 10000', 'dataMax + 10000']}
                            />
                            <Tooltip
                                content={({ active, payload }) => {
                                    if (active && payload && payload.length) {
                                        return (
                                            <div className="bg-popover border border-border p-3 rounded-xl shadow-xl">
                                                <p className="text-sm font-medium text-popover-foreground mb-1">{payload[0].payload.label}</p>
                                                <p className="text-2xl font-bold text-primary">
                                                    {formatSalary(payload[0].value as number)}
                                                </p>
                                                <p className="text-xs text-muted-foreground">Annual Salary</p>
                                            </div>
                                        );
                                    }
                                    return null;
                                }}
                            />
                            <Area
                                type="monotone"
                                dataKey="salary"
                                stroke="hsl(var(--primary))"
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#colorSalary)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
