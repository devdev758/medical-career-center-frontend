'use client';

import Link from 'next/link';
import { ArrowRight, Stethoscope, Activity, UserRound, Syringe } from 'lucide-react';

interface RelatedCareer {
    title: string;
    slug: string;
    avgSalary: string;
    icon: any;
    color: string;
}

export function RelatedSalaries({ currentProfession }: { currentProfession: string }) {
    const careers: RelatedCareer[] = [
        {
            title: 'Registered Nurse',
            slug: 'registered-nurses',
            avgSalary: '$86,070',
            icon: Stethoscope,
            color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400'
        },
        {
            title: 'Nurse Practitioner',
            slug: 'nurse-practitioners',
            avgSalary: '$126,260',
            icon: UserRound,
            color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-400'
        },
        {
            title: 'Medical Assistant',
            slug: 'medical-assistants',
            avgSalary: '$42,000',
            icon: Activity,
            color: 'bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-400'
        },
        {
            title: 'Surgical Tech',
            slug: 'surgical-technologists',
            avgSalary: '$60,610',
            icon: Syringe,
            color: 'bg-orange-100 text-orange-600 dark:bg-orange-900/40 dark:text-orange-400'
        },
    ];

    // Filter out current profession
    const displayCareers = careers.filter(c => c.slug !== currentProfession && !currentProfession.includes(c.slug));

    return (
        <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Compare Related Careers
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {displayCareers.map((career) => (
                    <Link
                        key={career.slug}
                        href={`/${career.slug}/salary`}
                        className="group flex flex-col p-5 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-300"
                    >
                        <div className={`w-12 h-12 rounded-lg ${career.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                            <career.icon className="w-6 h-6" />
                        </div>
                        <h4 className="font-semibold text-lg text-gray-900 dark:text-gray-100 mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                            {career.title}
                        </h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                            Avg. Salary: <span className="font-medium text-gray-700 dark:text-gray-300">{career.avgSalary}</span>
                        </p>
                        <div className="mt-auto flex items-center text-sm font-medium text-blue-600 dark:text-blue-400">
                            View Salary Data
                            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
