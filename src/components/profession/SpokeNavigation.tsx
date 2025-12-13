import Link from 'next/link';
import {
    BookOpen,
    Award,
    MessageSquare,
    FileText,
    Target,
    Zap,
    TrendingUp,
    Heart
} from 'lucide-react';

interface SpokeNavigationProps {
    profession: string;
    currentSpoke?: string;
}

const spokes = [
    { id: 'career-guide', label: 'Career Guide', icon: BookOpen, suffix: '' },
    { id: 'schools', label: 'Schools', icon: BookOpen, suffix: '-schools' },
    { id: 'certification', label: 'Certification', icon: Award, suffix: '-certification' },
    { id: 'interview', label: 'Interview Prep', icon: MessageSquare, suffix: '-interview-questions' },
    { id: 'resume', label: 'Resume', icon: FileText, suffix: '-resume' },
    { id: 'specializations', label: 'Specializations', icon: Target, suffix: '-specializations' },
    { id: 'skills', label: 'Skills', icon: Zap, suffix: '-skills' },
    { id: 'career-path', label: 'Career Path', icon: TrendingUp, suffix: '-career-path' },
    { id: 'work-life', label: 'Work-Life', icon: Heart, suffix: '-work-life-balance' },
];

export function SpokeNavigation({ profession, currentSpoke }: SpokeNavigationProps) {
    return (
        <div className="bg-muted/50 rounded-lg p-4">
            <h3 className="font-semibold mb-3 text-sm text-muted-foreground">Quick Navigation</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {spokes.map((spoke) => {
                    const href = spoke.id === 'career-guide'
                        ? `/how-to-become-${profession}`
                        : `/${profession}${spoke.suffix}`;
                    const Icon = spoke.icon;
                    const isCurrent = currentSpoke === spoke.id;

                    return (
                        <Link
                            key={spoke.id}
                            href={href}
                            className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${isCurrent
                                    ? 'bg-primary text-primary-foreground'
                                    : 'hover:bg-muted'
                                }`}
                        >
                            <Icon className="w-4 h-4" />
                            <span>{spoke.label}</span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
