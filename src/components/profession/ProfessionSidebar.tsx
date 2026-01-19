'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    BookOpen,
    DollarSign,
    Briefcase,
    GraduationCap,
    Award,
    Stethoscope,
    Target,
    FileText,
    MessageSquare,
    Users,
    ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const spokeNavItems = [
    { id: 'how-to-become', label: 'Career Guide', icon: BookOpen, path: '/how-to-become', desc: 'Step-by-step roadmap' },
    { id: 'salary', label: 'Salary Data', icon: DollarSign, path: '/salary', desc: 'Earnings by state' },
    { id: 'jobs', label: 'Job Board', icon: Briefcase, path: '/jobs', desc: 'Open positions' },
    { id: 'schools', label: 'Schools', icon: GraduationCap, path: '/schools', desc: 'Find programs' },
    { id: 'license', label: 'Licensing', icon: Award, path: '/license', desc: 'State requirements' },
    { id: 'crna', label: 'CRNA Path', icon: Stethoscope, path: '/crna', desc: 'Advanced practice' },
    { id: 'specializations', label: 'Specialties', icon: Target, path: '/specializations', desc: 'Career niches' },
    { id: 'resume', label: 'Resume', icon: FileText, path: '/resume', desc: 'Templates & tips' },
    { id: 'interview', label: 'Interview', icon: MessageSquare, path: '/interview', desc: 'Prep questions' },
];

const cnaSpokeNavItems = [
    { id: 'how-to-become', label: 'Career Guide', icon: BookOpen, path: '/how-to-become', desc: 'Step-by-step roadmap' },
    { id: 'schools', label: 'Classes', icon: GraduationCap, path: '/schools', desc: 'Training programs' },
    { id: 'training', label: 'Training', icon: BookOpen, path: '/training', desc: 'Skills training' },
    { id: 'license', label: 'Certification', icon: Award, path: '/license', desc: 'Exam & Registry' },
    { id: 'registry', label: 'Registry', icon: Users, path: '/registry', desc: 'State lookups' },
    { id: 'practice-test', label: 'Practice Test', icon: Target, path: '/practice-test', desc: 'Exam prep' },
    { id: 'interview', label: 'Interview', icon: MessageSquare, path: '/interview', desc: 'Prep questions' },
    { id: 'resume', label: 'Resume', icon: FileText, path: '/resume', desc: 'Templates' },
];

interface ProfessionSidebarProps {
    profession: string;
}

export function ProfessionSidebar({ profession }: ProfessionSidebarProps) {
    const pathname = usePathname();
    const isCNA = profession === 'cna';

    const isActive = (path: string) => {
        // If path is root /profession, match exactly or match /how-to-become if we default there
        if (path === '/how-to-become' && (pathname === `/${profession}` || pathname === `/${profession}/`)) return true;
        // Otherwise check if pathname includes the subpath (e.g. /salary)
        return pathname.includes(path);
    };

    const navItems = isCNA ? cnaSpokeNavItems : spokeNavItems.filter(item =>
        item.id !== 'crna' || profession === 'registered-nurse'
    );

    return (
        <aside className="space-y-4">
            <div className="space-y-4">
                <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider px-2">Career Modules</h2>
                <div className="space-y-3">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const active = isActive(item.path);
                        // Construct href. If path is /how-to-become, link to root /profession for the "Hub" feel, or explicitly how-to-become?
                        // User likes the Hub page. The Hub page IS the Career Guide.
                        const itemHref = item.path === '/how-to-become' ? `/${profession}` : `/${profession}${item.path}`;

                        return (
                            <Link key={item.id} href={itemHref} className="block group">
                                <div className={cn(
                                    "flex items-center gap-4 p-4 rounded-xl border transition-all duration-200",
                                    active
                                        ? "bg-primary text-primary-foreground border-primary shadow-md"
                                        : "bg-card border-border/50 hover:border-primary/50 hover:bg-muted/50"
                                )}>
                                    <div className={cn(
                                        "p-2 rounded-lg transition-colors",
                                        active ? "bg-white/20 text-white" : "bg-secondary/10 text-secondary group-hover:bg-primary group-hover:text-white"
                                    )}>
                                        <Icon className="w-5 h-5" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className={cn("font-bold font-heading transition-colors", active ? "text-white" : "text-foreground group-hover:text-primary")}>
                                            {item.label}
                                        </h3>
                                        {!active && <p className="text-xs text-muted-foreground">{item.desc}</p>}
                                    </div>
                                    {active && <ArrowRight className="w-4 h-4 ml-auto text-white" />}
                                </div>
                            </Link>
                        )
                    })}
                </div>
            </div>
        </aside>
    );
}
