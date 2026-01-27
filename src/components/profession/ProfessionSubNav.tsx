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
        <div className="sticky top-20 z-40 w-full py-3 px-4">
            {/* Centered Oval SubNav - Matching Header Style */}
            <div className="mx-auto max-w-4xl">
                <div className="bg-[#14213D] rounded-full px-4 py-2 shadow-xl border border-[#FFC300]/20 overflow-x-auto no-scrollbar">
                    <div className="flex items-center justify-center space-x-1 min-w-max">
                        {/* Hub Link (Overview) */}
                        <Link
                            href={`/${profession}`}
                            className={cn(
                                "px-4 py-2 text-sm font-bold rounded-full transition-all duration-200",
                                pathname === `/${profession}`
                                    ? "bg-[#FFC300] text-[#14213D]"
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
                                        "flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-full transition-all duration-200",
                                        active
                                            ? "bg-[#FFC300] text-[#14213D] font-bold"
                                            : "text-white/70 hover:text-white hover:bg-white/10"
                                    )}
                                >
                                    <Icon className={cn("w-3.5 h-3.5", active ? "text-[#14213D]" : "")} />
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
