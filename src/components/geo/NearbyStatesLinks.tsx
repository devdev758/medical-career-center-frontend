import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, ArrowRight } from 'lucide-react';
import stateBorders from '@/data/state-borders.json';
import statesList from '@/data/states-list.json';

interface NearbyStatesLinksProps {
    profession: string;
    currentState: string; // 2-letter state code
    pageType: 'salary' | 'jobs' | 'schools';
    maxStates?: number;
    className?: string;
}

export function NearbyStatesLinks({
    profession,
    currentState,
    pageType,
    maxStates = 5,
    className = ''
}: NearbyStatesLinksProps) {
    // Find current state data
    const currentStateData = statesList.find(
        s => s.abbr.toLowerCase() === currentState.toLowerCase()
    );

    if (!currentStateData) {
        return null;
    }

    // Get neighboring states
    const stateSlug = currentStateData.slug;
    const neighbors = (stateBorders as Record<string, string[]>)[stateSlug] || [];

    if (neighbors.length === 0) {
        return null;
    }

    // Convert slugs to state data and limit
    const neighboringStates = neighbors
        .slice(0, maxStates)
        .map(slug => statesList.find(s => s.slug === slug))
        .filter(Boolean) as typeof statesList;

    // Build URL based on page type
    const buildUrl = (stateAbbr: string) => {
        const abbr = stateAbbr.toLowerCase();
        switch (pageType) {
            case 'salary':
                return `/${profession}-salary/${abbr}`;
            case 'jobs':
                return `/${profession}-jobs/${abbr}`;
            case 'schools':
                return `/${profession}-schools/${abbr}`;
            default:
                return `/${profession}`;
        }
    };

    const getPageTypeLabel = () => {
        switch (pageType) {
            case 'salary':
                return 'Salary';
            case 'jobs':
                return 'Jobs';
            case 'schools':
                return 'Schools';
            default:
                return 'Info';
        }
    };

    return (
        <Card className={className}>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                    <MapPin className="w-5 h-5" />
                    {getPageTypeLabel()} in Nearby States
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                    {neighboringStates.map((state) => (
                        <Link
                            key={state.abbr}
                            href={buildUrl(state.abbr)}
                            className="group flex items-center justify-between p-3 rounded-lg border border-border hover:border-primary hover:bg-accent transition-colors"
                        >
                            <span className="text-sm font-medium group-hover:text-primary transition-colors">
                                {state.name}
                            </span>
                            <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-transform flex-shrink-0 ml-2" />
                        </Link>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
