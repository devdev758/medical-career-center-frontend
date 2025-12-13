import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import { ArrowRight } from 'lucide-react';

interface SpokeCardProps {
    icon: LucideIcon;
    title: string;
    description: string;
    href: string;
    badge?: string;
}

export function SpokeCard({ icon: Icon, title, description, href, badge }: SpokeCardProps) {
    return (
        <Link href={href}>
            <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer group">
                <CardHeader>
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                <Icon className="w-6 h-6" />
                            </div>
                            <CardTitle className="text-lg">{title}</CardTitle>
                        </div>
                        {badge && (
                            <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                                {badge}
                            </span>
                        )}
                    </div>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">{description}</p>
                    <div className="flex items-center text-sm text-primary group-hover:gap-2 transition-all">
                        <span>Explore</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}
