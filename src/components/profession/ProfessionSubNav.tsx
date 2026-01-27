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
        // Strict matching - don't highlight Guide when on Overview
        const currentPath = pathname.replace(`/${profession}`, '') || '/';
        if (path === '/how-to-become') {
            return currentPath === '/how-to-become' || currentPath.startsWith('/how-to-become/');
        }
        return currentPath === path || currentPath.startsWith(`${path}/`);
    };

    const isOverview = pathname === `/${profession}` || pathname === `/${profession}/`;

    return (
        <div className="relative z-40 -mt-7">
            {/* Full-Width Oval SubNav - All Items in Single Row */}
            <div className="mx-auto max-w-6xl px-4">
                <div className="bg-[#14213D] rounded-full px-8 py-3 shadow-2xl border-2 border-[#FFC300]/30">
                    <div className="flex items-center justify-center gap-2">
                        {/* Hub Link (Overview) */}
                        <Link
                            href={`/${profession}`}
                            className={cn(
                                "px-5 py-2 text-sm font-bold rounded-full transition-all duration-200",
                                isOverview
                                    ? "bg-[#FFC300] text-[#14213D] shadow-md"
                                    : "text-white/80 hover:text-white hover:bg-white/10"
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
                                        "flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-full transition-all duration-200",
                                        active && !isOverview
                                            ? "bg-[#FFC300] text-[#14213D] font-bold shadow-md"
                                            : "text-white/70 hover:text-white hover:bg-white/10"
                                    )}
                                >
                                    <Icon className={cn("w-4 h-4", active && !isOverview ? "text-[#14213D]" : "")} />
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
