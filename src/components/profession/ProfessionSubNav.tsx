'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
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
    Users
} from 'lucide-react';

interface ProfessionSubNavProps {
    profession: string;
}

export function ProfessionSubNav({ profession }: ProfessionSubNavProps) {
    const pathname = usePathname();
    const isCNA = profession === 'cna';

    // Standard Spoke Navigation
    const spokeNavItems = [
        { id: 'how-to-become', label: 'Guide', icon: BookOpen, path: '/how-to-become' },
        { id: 'salary', label: 'Salary', icon: DollarSign, path: '/salary' },
        { id: 'jobs', label: 'Jobs', icon: Briefcase, path: '/jobs' },
        { id: 'schools', label: 'Schools', icon: GraduationCap, path: '/schools' },
        { id: 'license', label: 'Licensing', icon: Award, path: '/license' },
        { id: 'crna', label: 'CRNA', icon: Stethoscope, path: '/crna' },
        { id: 'specializations', label: 'Specialties', icon: Target, path: '/specializations' },
        { id: 'resume', label: 'Resume', icon: FileText, path: '/resume' },
        { id: 'interview', label: 'Interview', icon: MessageSquare, path: '/interview' },
    ];

    // CNA-specific Navigation
    const cnaSpokeNavItems = [
        { id: 'how-to-become', label: 'Guide', icon: BookOpen, path: '/how-to-become' },
        { id: 'schools', label: 'Classes', icon: GraduationCap, path: '/schools' },
        { id: 'training', label: 'Training', icon: BookOpen, path: '/training' },
        { id: 'license', label: 'Certification', icon: Award, path: '/license' },
        { id: 'registry', label: 'Registry', icon: Users, path: '/registry' },
        { id: 'practice-test', label: 'Practice Test', icon: Target, path: '/practice-test' },
        { id: 'interview', label: 'Interview', icon: MessageSquare, path: '/interview' },
        { id: 'resume', label: 'Resume', icon: FileText, path: '/resume' },
    ];

    const navItems = isCNA ? cnaSpokeNavItems : spokeNavItems.filter(item =>
        item.id !== 'crna' || profession === 'registered-nurse'
    );

    const isActive = (path: string) => {
        // If path is root /profession, match exactly or match /how-to-become if we default there
        if (path === '/how-to-become' && (pathname === `/${profession}` || pathname === `/${profession}/`)) return true;
        return pathname.includes(path);
    };

    return (
        <div className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm">
            <div className="container mx-auto px-4 max-w-7xl">
                <div className="w-full overflow-x-auto no-scrollbar">
                    <div className="flex h-16 items-center space-x-2 min-w-max">
                        {/* Hub Link (Logo/Home equivalent for this profession) */}
                        <Link
                            href={`/${profession}`}
                            className={cn(
                                "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-colors mr-2 border border-transparent",
                                pathname === `/${profession}`
                                    ? "bg-black text-white shadow-md"
                                    : "text-muted-foreground hover:bg-gray-100 hover:text-black"
                            )}
                        >
                            Overview
                        </Link>

                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const active = isActive(item.path);
                            return (
                                <Link
                                    key={item.id}
                                    href={`/${profession}${item.path}`}
                                    className={cn(
                                        "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all border border-transparent",
                                        active
                                            ? "bg-gray-100 text-black border-gray-200 font-bold"
                                            : "text-muted-foreground hover:bg-gray-50 hover:text-black"
                                    )}
                                >
                                    <Icon className={cn("w-4 h-4", active ? "text-black" : "opacity-70")} />
                                    {item.label}
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
