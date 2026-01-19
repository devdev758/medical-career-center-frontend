import type { Metadata } from 'next';
import { getAllProfessions } from '@/lib/profession-utils';
import { ProfessionsGrid } from '@/components/directory/professions-grid';
import { Breadcrumb } from '@/components/ui/breadcrumb';

export const metadata: Metadata = {
    title: 'Career Directory | Medical Career Center',
    description: 'The authoritative index of medical careers. Search salaries, job growth, and education requirements for 50+ healthcare professions.',
};

export const dynamic = 'force-dynamic';

export default async function ProfessionsPage() {
    const professions = await getAllProfessions();

    return (
        <main className="min-h-screen bg-background pb-32">
            {/* Header Section */}
            <div className="relative border-b border-border/40 bg-muted/10 pt-32 pb-20 px-4">
                <div className="container mx-auto max-w-7xl">
                    <Breadcrumb
                        items={[
                            { label: 'Home', href: '/' },
                            { label: 'Directory' }
                        ]}
                        className="mb-8"
                    />

                    <div className="max-w-3xl">
                        <h1 className="text-5xl md:text-7xl font-heading font-bold tracking-tight mb-6">
                            Career <span className="text-primary text-glow">Directory</span>
                        </h1>
                        <p className="text-xl text-muted-foreground leading-relaxed">
                            The complete index of {professions.length} healthcare professions.
                            Filter by demand, growth, or specialization to find your path.
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 max-w-7xl -mt-8 relative z-10">
                <ProfessionsGrid professions={professions} />
            </div>
        </main>
    );
}
