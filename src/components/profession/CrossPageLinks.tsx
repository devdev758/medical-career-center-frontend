import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    DollarSign,
    Briefcase,
    School,
    Award,
    FileText,
    MessageSquare,
    Target,
    Zap,
    TrendingUp,
    Heart,
    BookOpen,
    ArrowRight
} from 'lucide-react';

interface CrossPageLinksProps {
    profession: string;
    state?: string; // 2-letter state code
    city?: string;
    currentPage: 'hub' | 'salary' | 'jobs' | 'schools' | 'certification' | 'interview' | 'resume' | 'specializations' | 'skills' | 'career-path' | 'work-life' | 'career-guide';
    className?: string;
}

interface PageLink {
    type: string;
    label: string;
    href: string;
    icon: React.ReactNode;
    description: string;
}

export function CrossPageLinks({
    profession,
    state,
    city,
    currentPage,
    className = ''
}: CrossPageLinksProps) {
    const formatCareerTitle = (slug: string): string => {
        return slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    };

    const careerTitle = formatCareerTitle(profession);
    const locationSuffix = state ? ` in ${state.toUpperCase()}` : '';

    // Define all possible links
    const allLinks: PageLink[] = [
        {
            type: 'hub',
            label: `${careerTitle} Hub`,
            href: `/${profession}`,
            icon: <BookOpen className="w-4 h-4" />,
            description: 'Complete career overview'
        },
        {
            type: 'career-guide',
            label: 'Career Guide',
            href: `/how-to-become-${profession}`,
            icon: <BookOpen className="w-4 h-4" />,
            description: 'How to become a professional'
        },
        {
            type: 'salary',
            label: `Salary${locationSuffix}`,
            href: state ? `/${profession}-salary/${state}` : `/${profession}-salary`,
            icon: <DollarSign className="w-4 h-4" />,
            description: 'Salary data and trends'
        },
        {
            type: 'jobs',
            label: `Jobs${locationSuffix}`,
            href: state ? `/${profession}-jobs/${state}` : `/${profession}-jobs`,
            icon: <Briefcase className="w-4 h-4" />,
            description: 'Current job openings'
        },
        {
            type: 'schools',
            label: `Schools${locationSuffix}`,
            href: state ? `/${profession}-schools/${state}` : `/${profession}-schools`,
            icon: <School className="w-4 h-4" />,
            description: 'Training programs'
        },
        {
            type: 'certification',
            label: 'Certification',
            href: `/${profession}-certification`,
            icon: <Award className="w-4 h-4" />,
            description: 'Licensing requirements'
        },
        {
            type: 'interview',
            label: 'Interview Prep',
            href: `/${profession}-interview-questions`,
            icon: <MessageSquare className="w-4 h-4" />,
            description: 'Common interview questions'
        },
        {
            type: 'resume',
            label: 'Resume Examples',
            href: `/${profession}-resume`,
            icon: <FileText className="w-4 h-4" />,
            description: 'Resume templates'
        },
        {
            type: 'specializations',
            label: 'Specializations',
            href: `/${profession}-specializations`,
            icon: <Target className="w-4 h-4" />,
            description: 'Career specialties'
        },
        {
            type: 'skills',
            label: 'Skills Guide',
            href: `/${profession}-skills`,
            icon: <Zap className="w-4 h-4" />,
            description: 'Essential skills'
        },
        {
            type: 'career-path',
            label: 'Career Path',
            href: `/${profession}-career-path`,
            icon: <TrendingUp className="w-4 h-4" />,
            description: 'Progression opportunities'
        },
        {
            type: 'work-life',
            label: 'Work-Life Balance',
            href: `/${profession}-work-life-balance`,
            icon: <Heart className="w-4 h-4" />,
            description: 'Lifestyle insights'
        },
    ];

    // Filter out current page and select relevant links
    const relevantLinks = allLinks.filter(link => link.type !== currentPage);

    // Prioritize links based on current page
    let displayedLinks: PageLink[] = [];

    switch (currentPage) {
        case 'salary':
            displayedLinks = relevantLinks.filter(l =>
                ['jobs', 'schools', 'career-guide', 'career-path'].includes(l.type)
            ).slice(0, 4);
            break;
        case 'jobs':
            displayedLinks = relevantLinks.filter(l =>
                ['salary', 'schools', 'resume', 'interview'].includes(l.type)
            ).slice(0, 4);
            break;
        case 'schools':
            displayedLinks = relevantLinks.filter(l =>
                ['certification', 'salary', 'jobs', 'career-guide'].includes(l.type)
            ).slice(0, 4);
            break;
        case 'certification':
            displayedLinks = relevantLinks.filter(l =>
                ['schools', 'skills', 'career-path', 'salary'].includes(l.type)
            ).slice(0, 4);
            break;
        case 'interview':
            displayedLinks = relevantLinks.filter(l =>
                ['resume', 'jobs', 'skills', 'career-guide'].includes(l.type)
            ).slice(0, 4);
            break;
        case 'resume':
            displayedLinks = relevantLinks.filter(l =>
                ['interview', 'jobs', 'skills', 'career-guide'].includes(l.type)
            ).slice(0, 4);
            break;
        case 'specializations':
            displayedLinks = relevantLinks.filter(l =>
                ['certification', 'schools', 'career-path', 'salary'].includes(l.type)
            ).slice(0, 4);
            break;
        case 'skills':
            displayedLinks = relevantLinks.filter(l =>
                ['schools', 'certification', 'specializations', 'career-guide'].includes(l.type)
            ).slice(0, 4);
            break;
        case 'career-path':
            displayedLinks = relevantLinks.filter(l =>
                ['salary', 'schools', 'specializations', 'certification'].includes(l.type)
            ).slice(0, 4);
            break;
        case 'work-life':
            displayedLinks = relevantLinks.filter(l =>
                ['career-guide', 'salary', 'jobs', 'career-path'].includes(l.type)
            ).slice(0, 4);
            break;
        case 'career-guide':
            displayedLinks = relevantLinks.filter(l =>
                ['schools', 'certification', 'salary', 'skills'].includes(l.type)
            ).slice(0, 4);
            break;
        case 'hub':
            displayedLinks = relevantLinks.filter(l =>
                ['career-guide', 'salary', 'jobs', 'schools'].includes(l.type)
            ).slice(0, 4);
            break;
        default:
            displayedLinks = relevantLinks.slice(0, 4);
    }

    if (displayedLinks.length === 0) {
        return null;
    }

    return (
        <Card className={className}>
            <CardHeader>
                <CardTitle className="text-lg">Explore More</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid md:grid-cols-2 gap-3">
                    {displayedLinks.map((link) => (
                        <Link
                            key={link.type}
                            href={link.href}
                            className="group flex items-start gap-3 p-3 rounded-lg border border-border hover:border-primary hover:bg-accent transition-colors"
                        >
                            <div className="p-2 rounded-md bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                {link.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2">
                                    <h4 className="font-semibold text-sm group-hover:text-primary transition-colors">
                                        {link.label}
                                    </h4>
                                    <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0" />
                                </div>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                    {link.description}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
