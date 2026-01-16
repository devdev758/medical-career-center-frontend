import Link from 'next/link';
import type { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { getAllProfessions } from '@/lib/profession-utils';
import {
    Stethoscope,
    Users,
    GraduationCap,
    Heart,
    Brain,
    Activity,
    ArrowRight
} from 'lucide-react';

export const metadata: Metadata = {
    title: 'Healthcare Professions Directory | Medical Career Center',
    description: 'Explore 55 healthcare professions with salary data, job opportunities, schools, and career guides. Find your path in healthcare.',
    alternates: {
        canonical: 'https://medicalcareercenter.org/professions'
    }
};

export const dynamic = 'force-dynamic';

// Icon mapping by tier for visual distinction
const getTierIcon = (tier: number) => {
    switch (tier) {
        case 1: return Stethoscope;
        case 2: return Heart;
        case 3: return Brain;
        default: return Activity;
    }
};

const getTierColor = (tier: number) => {
    switch (tier) {
        case 1: return 'bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 border-emerald-200 dark:border-emerald-800';
        case 2: return 'bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800';
        case 3: return 'bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-800';
        default: return 'bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900/20 dark:to-gray-800/20';
    }
};

const getTierBadgeStyle = (tier: number) => {
    switch (tier) {
        case 1: return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200';
        case 2: return 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200';
        case 3: return 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-200';
        default: return '';
    }
};

export default async function ProfessionsPage() {
    const professions = await getAllProfessions();

    const tier1 = professions.filter(p => p.tier === 1);
    const tier2 = professions.filter(p => p.tier === 2);
    const tier3 = professions.filter(p => p.tier === 3);

    return (
        <main className="container mx-auto py-10 px-4 max-w-7xl">
            <Breadcrumb
                items={[
                    { label: 'Home', href: '/' },
                    { label: 'All Professions' }
                ]}
                className="mb-6"
            />

            {/* Hero Section */}
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                    Healthcare Professions Directory
                </h1>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                    Explore {professions.length} healthcare careers with salary data, job opportunities,
                    education requirements, and career guides.
                </p>
            </div>

            {/* Stats Bar */}
            <div className="grid grid-cols-3 gap-4 mb-12 max-w-2xl mx-auto">
                <div className="text-center p-4 rounded-lg bg-emerald-50 dark:bg-emerald-900/20">
                    <p className="text-3xl font-bold text-emerald-600">{tier1.length}</p>
                    <p className="text-sm text-muted-foreground">High-Demand</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                    <p className="text-3xl font-bold text-blue-600">{tier2.length}</p>
                    <p className="text-sm text-muted-foreground">Growing</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-purple-50 dark:bg-purple-900/20">
                    <p className="text-3xl font-bold text-purple-600">{tier3.length}</p>
                    <p className="text-sm text-muted-foreground">Specialized</p>
                </div>
            </div>

            {/* Tier 1: High-Demand Professions */}
            <section className="mb-16">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
                        <Stethoscope className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold">High-Demand Careers</h2>
                        <p className="text-muted-foreground">Top healthcare roles with excellent job prospects</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {tier1.map((profession) => (
                        <Link
                            key={profession.slug}
                            href={`/${profession.slug}`}
                            className="group"
                        >
                            <Card className={`h-full transition-all duration-200 hover:shadow-lg hover:scale-[1.02] ${getTierColor(1)} border`}>
                                <CardContent className="pt-6">
                                    <div className="flex items-start justify-between mb-3">
                                        <Badge className={`${getTierBadgeStyle(1)} text-xs`}>
                                            Tier 1
                                        </Badge>
                                        <Badge variant="outline" className="text-xs">
                                            {profession.tier === 1 ? 11 : profession.tier === 2 ? 7 : 4} guides
                                        </Badge>
                                    </div>
                                    <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                                        {profession.displayName}
                                    </h3>
                                    <div className="flex items-center text-sm text-muted-foreground group-hover:text-primary transition-colors">
                                        View career info
                                        <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Tier 2: Growing Professions */}
            <section className="mb-16">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                        <Heart className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold">Growing Careers</h2>
                        <p className="text-muted-foreground">Expanding healthcare roles with strong potential</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {tier2.map((profession) => (
                        <Link
                            key={profession.slug}
                            href={`/${profession.slug}`}
                            className="group"
                        >
                            <Card className={`h-full transition-all duration-200 hover:shadow-lg hover:scale-[1.02] ${getTierColor(2)} border`}>
                                <CardContent className="pt-6">
                                    <div className="flex items-start justify-between mb-3">
                                        <Badge className={`${getTierBadgeStyle(2)} text-xs`}>
                                            Tier 2
                                        </Badge>
                                        <Badge variant="outline" className="text-xs">
                                            {profession.tier === 1 ? 11 : profession.tier === 2 ? 7 : 4} guides
                                        </Badge>
                                    </div>
                                    <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                                        {profession.displayName}
                                    </h3>
                                    <div className="flex items-center text-sm text-muted-foreground group-hover:text-primary transition-colors">
                                        View career info
                                        <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Tier 3: Specialized Professions */}
            <section className="mb-16">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                        <Brain className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold">Specialized Careers</h2>
                        <p className="text-muted-foreground">Advanced medical specializations and physicians</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {tier3.map((profession) => (
                        <Link
                            key={profession.slug}
                            href={`/${profession.slug}`}
                            className="group"
                        >
                            <Card className={`h-full transition-all duration-200 hover:shadow-lg hover:scale-[1.02] ${getTierColor(3)} border`}>
                                <CardContent className="pt-6">
                                    <div className="flex items-start justify-between mb-3">
                                        <Badge className={`${getTierBadgeStyle(3)} text-xs`}>
                                            Tier 3
                                        </Badge>
                                        <Badge variant="outline" className="text-xs">
                                            {profession.tier === 1 ? 11 : profession.tier === 2 ? 7 : 4} guides
                                        </Badge>
                                    </div>
                                    <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                                        {profession.displayName}
                                    </h3>
                                    <div className="flex items-center text-sm text-muted-foreground group-hover:text-primary transition-colors">
                                        View career info
                                        <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            </section>
        </main>
    );
}
