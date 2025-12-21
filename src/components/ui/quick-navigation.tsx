import Link from 'next/link';
import {
    BookOpen,
    DollarSign,
    Briefcase,
    GraduationCap,
    Award,
    Target,
    FileText,
    MessageSquare,
    Zap,
    TrendingUp,
    Heart
} from 'lucide-react';

interface QuickNavigationProps {
    profession: string;
    currentPath?: string; // e.g., 'schools', 'salary', 'how-to-become'
}

const spokeNavItems = [
    { id: 'how-to-become', label: 'How to Become', icon: BookOpen, path: '/how-to-become' },
    { id: 'salary', label: 'Salary', icon: DollarSign, path: '/salary' },
    { id: 'jobs', label: 'Jobs', icon: Briefcase, path: '/jobs' },
    { id: 'schools', label: 'Schools', icon: GraduationCap, path: '/schools' },
    { id: 'license', label: 'License', icon: Award, path: '/license' },
    { id: 'specializations', label: 'Specializations', icon: Target, path: '/specializations' },
    { id: 'resume', label: 'Resume', icon: FileText, path: '/resume' },
    { id: 'interview', label: 'Interview', icon: MessageSquare, path: '/interview' },
    { id: 'skills', label: 'Skills', icon: Zap, path: '/skills' },
    { id: 'career-path', label: 'Career Path', icon: TrendingUp, path: '/career-path' },
    { id: 'work-life-balance', label: 'Work-Life', icon: Heart, path: '/work-life-balance' },
];

export function QuickNavigation({ profession, currentPath }: QuickNavigationProps) {
    return (
        <div className="bg-muted/50 rounded-lg p-6 mb-8">
            <h2 className="font-semibold mb-4 text-lg">Quick Navigation</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {spokeNavItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = currentPath === item.id;

                    return (
                        <Link
                            key={item.id}
                            href={`/${profession}${item.path}`}
                            className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-colors border ${isActive
                                ? 'bg-primary text-primary-foreground border-primary'
                                : 'bg-background hover:bg-primary/10'
                                }`}
                        >
                            <Icon className={`w-4 h-4 ${isActive ? 'text-primary-foreground' : 'text-primary'}`} />
                            <span className="text-sm font-medium">{item.label}</span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
