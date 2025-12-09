import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getRelatedProfessions, formatProfessionTitle } from '@/lib/profession-relationships';
import { getNeighboringStates, getMajorCities, getStateName, createCitySlug } from '@/lib/geographic-data';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface InternalLinksProps {
    profession: string;
    state?: string;
    city?: string;
}

export async function InternalLinks({ profession, state, city }: InternalLinksProps) {
    const professionTitle = formatProfessionTitle(profession);

    // Get related professions
    const relatedProfessionSlugs = getRelatedProfessions(profession);

    // Verify which related professions have data in this location
    const verifiedRelatedProfessions = await Promise.all(
        relatedProfessionSlugs.map(async (slug) => {
            const hasData = await prisma.salaryData.findFirst({
                where: {
                    careerKeyword: slug,
                    ...(city && state ? {
                        location: { city: { contains: city, mode: 'insensitive' }, state: state.toUpperCase() }
                    } : state ? {
                        location: { state: state.toUpperCase(), city: '' }
                    } : {
                        locationId: null
                    })
                }
            });
            return hasData ? slug : null;
        })
    );

    const relatedProfessions = verifiedRelatedProfessions
        .filter(Boolean)
        .slice(0, 6) as string[];

    // Get neighboring states and verify they have data
    let verifiedNeighboringStates: string[] = [];
    if (state && !city) {
        const neighboringStateCodes = getNeighboringStates(state);
        const stateChecks = await Promise.all(
            neighboringStateCodes.map(async (stateCode) => {
                const hasData = await prisma.salaryData.findFirst({
                    where: {
                        careerKeyword: profession,
                        location: { state: stateCode, city: '' }
                    }
                });
                return hasData ? stateCode : null;
            })
        );
        verifiedNeighboringStates = stateChecks.filter(Boolean).slice(0, 5) as string[];
    }

    // Get major cities and verify they have data
    let verifiedMajorCities: string[] = [];
    if (state && !city) {
        const majorCityNames = getMajorCities(state);
        const cityChecks = await Promise.all(
            majorCityNames.map(async (cityName) => {
                const hasData = await prisma.salaryData.findFirst({
                    where: {
                        careerKeyword: profession,
                        location: {
                            city: { contains: cityName, mode: 'insensitive' },
                            state: state.toUpperCase()
                        }
                    }
                });
                return hasData ? cityName : null;
            })
        );
        verifiedMajorCities = cityChecks.filter(Boolean).slice(0, 6) as string[];
    }

    // Get nearby cities for city pages (already filtered by profession in query)
    let nearbyCities: string[] = [];
    if (city && state) {
        const citiesInState = await prisma.location.findMany({
            where: {
                state: state.toUpperCase(),
                city: { not: '', notIn: [city] },
                salaries: {
                    some: {
                        careerKeyword: profession
                    }
                }
            },
            select: { city: true },
            take: 6
        });
        nearbyCities = citiesInState.map((l: { city: string }) => l.city);
    }

    const stateFullName = state ? getStateName(state) : '';
    const locationText = city ? `${city}, ${state?.toUpperCase()}` : state ? stateFullName : '';

    return (
        <div className="space-y-8 mt-12 not-prose">
            {/* Related Professions */}
            {relatedProfessions.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-xl">
                            Related Healthcare Careers{locationText ? ` in ${locationText}` : ''}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {relatedProfessions.map(slug => (
                                <Link
                                    key={slug}
                                    href={`/${slug}-salary${state ? `/${state.toLowerCase()}` : ''}${city ? `/${createCitySlug(city)}` : ''}`}
                                    className="text-primary hover:underline font-medium"
                                >
                                    {formatProfessionTitle(slug)}
                                </Link>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Major Cities (for state pages) */}
            {state && !city && verifiedMajorCities.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-xl">
                            {professionTitle} Salary in Top {stateFullName} Cities
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {verifiedMajorCities.map(cityName => (
                                <Link
                                    key={cityName}
                                    href={`/${profession}-salary/${state.toLowerCase()}/${createCitySlug(cityName)}`}
                                    className="text-primary hover:underline"
                                >
                                    {cityName}
                                </Link>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Nearby Cities (for city pages) */}
            {city && nearbyCities.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-xl">
                            {professionTitle} Salary in Nearby Cities
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {nearbyCities.map(cityName => (
                                <Link
                                    key={cityName}
                                    href={`/${profession}-salary/${state?.toLowerCase()}/${createCitySlug(cityName)}`}
                                    className="text-primary hover:underline"
                                >
                                    {cityName}, {state?.toUpperCase()}
                                </Link>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Neighboring States (for state pages only) */}
            {state && !city && verifiedNeighboringStates.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-xl">
                            {professionTitle} Salary in Neighboring States
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {verifiedNeighboringStates.map(stateCode => (
                                <Link
                                    key={stateCode}
                                    href={`/${profession}-salary/${stateCode.toLowerCase()}`}
                                    className="text-primary hover:underline"
                                >
                                    {getStateName(stateCode)}
                                </Link>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Job Listings CTA */}
            <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
                <CardContent className="p-8">
                    <div className="text-center">
                        <h3 className="text-2xl font-bold mb-3">
                            Looking for {professionTitle} Jobs?
                        </h3>
                        <p className="text-muted-foreground mb-6 text-lg">
                            Browse open positions and apply today{locationText ? ` in ${locationText}` : ''}
                        </p>
                        <Button size="lg" asChild className="text-lg px-8">
                            <Link href={`/${profession}-jobs${state ? `/${state.toLowerCase()}` : ''}${city ? `/${createCitySlug(city)}` : ''}`}>
                                View {professionTitle} Jobs →
                            </Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
