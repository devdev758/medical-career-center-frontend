import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Briefcase } from 'lucide-react';

interface ProfessionWithCount {
    slug: string;
    name: string;
    jobCount: number;
}

interface ProfessionBrowseGridProps {
    professions: ProfessionWithCount[];
}

export function ProfessionBrowseGrid({ professions }: ProfessionBrowseGridProps) {
    return (
        <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-bold mb-2">Browse by Profession</h2>
                    <p className="text-muted-foreground">
                        Explore jobs in your specialty
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {professions.map((profession) => (
                    <Link
                        key={profession.slug}
                        href={`/${profession.slug}-jobs`}
                        className="group"
                    >
                        <Card className="hover:shadow-lg transition-all hover:border-primary">
                            <CardContent className="p-4">
                                <div className="flex items-start justify-between mb-2">
                                    <Briefcase className="w-5 h-5 text-primary" />
                                    <Badge variant="secondary" className="text-xs">
                                        {profession.jobCount}
                                    </Badge>
                                </div>
                                <h3 className="font-semibold text-sm group-hover:text-primary transition-colors line-clamp-2">
                                    {profession.name}
                                </h3>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    );
}
