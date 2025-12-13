import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, TrendingUp, Users, Briefcase } from 'lucide-react';
import professionRelationships from '@/data/profession-relationships.json';

interface RelatedProfessionsProps {
    profession: string;
    currentPageType?: 'hub' | 'salary' | 'jobs' | 'schools' | 'certification' | 'interview' | 'resume' | 'specializations' | 'skills' | 'career-path' | 'work-life' | 'career-guide';
    state?: string; // 2-letter state code for geographic pages
    maxItems?: number;
    className?: string;
}

interface RelatedProfession {
    slug: string;
    name: string;
    relationship: string;
}

interface ProfessionData {
    similar: RelatedProfession[];
    progression: RelatedProfession[];
    related: RelatedProfession[];
    family: string;
}

export function RelatedProfessions({
    profession,
    currentPageType = 'hub',
    state,
    maxItems = 6,
    className = ''
}: RelatedProfessionsProps) {
    const data = (professionRelationships as Record<string, ProfessionData>)[profession];

    if (!data) {
        return null; // No relationships defined for this profession
    }

    // Combine all related professions
    const allRelated: Array<RelatedProfession & { type: string }> = [
        ...data.progression.map(p => ({ ...p, type: 'progression' })),
        ...data.similar.map(p => ({ ...p, type: 'similar' })),
        ...data.related.map(p => ({ ...p, type: 'related' })),
    ];

    // Limit to maxItems
    const displayedProfessions = allRelated.slice(0, maxItems);

    if (displayedProfessions.length === 0) {
        return null;
    }

    // Build URL based on page type
    const buildUrl = (professionSlug: string) => {
        switch (currentPageType) {
            case 'salary':
                return state ? `/${professionSlug}-salary/${state}` : `/${professionSlug}-salary`;
            case 'jobs':
                return state ? `/${professionSlug}-jobs/${state}` : `/${professionSlug}-jobs`;
            case 'schools':
                return state ? `/${professionSlug}-schools/${state}` : `/${professionSlug}-schools`;
            case 'certification':
                return `/${professionSlug}-certification`;
            case 'interview':
                return `/${professionSlug}-interview-questions`;
            case 'resume':
                return `/${professionSlug}-resume`;
            case 'specializations':
                return `/${professionSlug}-specializations`;
            case 'skills':
                return `/${professionSlug}-skills`;
            case 'career-path':
                return `/${professionSlug}-career-path`;
            case 'work-life':
                return `/${professionSlug}-work-life-balance`;
            case 'career-guide':
                return `/how-to-become-${professionSlug}`;
            case 'hub':
            default:
                return `/${professionSlug}`;
        }
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'progression':
                return <TrendingUp className="w-4 h-4" />;
            case 'similar':
                return <Users className="w-4 h-4" />;
            case 'related':
                return <Briefcase className="w-4 h-4" />;
            default:
                return <ArrowRight className="w-4 h-4" />;
        }
    };

    const getTypeLabel = (type: string) => {
        switch (type) {
            case 'progression':
                return 'Career Advancement';
            case 'similar':
                return 'Similar Role';
            case 'related':
                return 'Related Career';
            default:
                return 'Related';
        }
    };

    return (
        <Card className={className}>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Related Healthcare Careers
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {displayedProfessions.map((relatedProf) => (
                        <Link
                            key={relatedProf.slug}
                            href={buildUrl(relatedProf.slug)}
                            className="group block p-4 rounded-lg border border-border hover:border-primary hover:bg-accent transition-colors"
                        >
                            <div className="flex items-start justify-between mb-2">
                                <Badge variant="outline" className="text-xs">
                                    {getIcon(relatedProf.type)}
                                    <span className="ml-1">{getTypeLabel(relatedProf.type)}</span>
                                </Badge>
                                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-transform" />
                            </div>
                            <h4 className="font-semibold text-sm mb-1 group-hover:text-primary transition-colors">
                                {relatedProf.name}
                            </h4>
                            <p className="text-xs text-muted-foreground line-clamp-2">
                                {relatedProf.relationship}
                            </p>
                        </Link>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
