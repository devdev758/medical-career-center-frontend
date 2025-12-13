import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbItem {
    label: string;
    href?: string;
}

interface BreadcrumbProps {
    items: BreadcrumbItem[];
    className?: string;
}

export function Breadcrumb({ items, className = '' }: BreadcrumbProps) {
    // Generate schema.org BreadcrumbList JSON-LD
    const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.label,
            ...(item.href && { item: `https://medicalcareercenter.org${item.href}` }),
        })),
    };

    return (
        <>
            {/* Schema.org markup */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
            />

            {/* Visual breadcrumb */}
            <nav aria-label="Breadcrumb" className={className}>
                <ol className="flex items-center gap-2 text-sm text-muted-foreground">
                    {items.map((item, index) => {
                        const isLast = index === items.length - 1;

                        return (
                            <li key={index} className="flex items-center gap-2">
                                {item.href && !isLast ? (
                                    <Link
                                        href={item.href}
                                        className="hover:text-foreground transition-colors"
                                    >
                                        {item.label}
                                    </Link>
                                ) : (
                                    <span
                                        className={isLast ? 'text-foreground font-medium' : ''}
                                        aria-current={isLast ? 'page' : undefined}
                                    >
                                        {item.label}
                                    </span>
                                )}

                                {!isLast && (
                                    <ChevronRight className="w-4 h-4 text-muted-foreground/50" />
                                )}
                            </li>
                        );
                    })}
                </ol>
            </nav>
        </>
    );
}

// Helper function to generate breadcrumbs for profession pages
export function getProfessionBreadcrumbs(
    professionSlug: string,
    professionName: string,
    currentPage?: 'hub' | 'career-guide' | 'salary' | 'jobs'
): BreadcrumbItem[] {
    const breadcrumbs: BreadcrumbItem[] = [
        { label: 'Home', href: '/' },
        { label: professionName, href: `/${professionSlug}` },
    ];

    if (currentPage && currentPage !== 'hub') {
        const pageLabels = {
            'career-guide': 'Career Guide',
            'salary': 'Salary Data',
            'jobs': 'Job Openings',
        };
        breadcrumbs.push({ label: pageLabels[currentPage] });
    }

    return breadcrumbs;
}
