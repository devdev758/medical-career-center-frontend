"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, ArrowRight, TrendingUp, DollarSign, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";

interface Profession {
    id: string;
    slug: string;
    displayName: string;
    tier: number;
}

interface ProfessionsGridProps {
    professions: Profession[];
}

const tiers = [
    { id: 0, label: "All Careers" },
    { id: 1, label: "Top Rated" },
    { id: 2, label: "Fast Growth" },
    { id: 3, label: "Specialized" },
];

export function ProfessionsGrid({ professions }: ProfessionsGridProps) {
    const [search, setSearch] = useState("");
    const [activeTier, setActiveTier] = useState(0);

    // Filter logic
    const filtered = professions.filter((p) => {
        const matchesSearch = p.displayName.toLowerCase().includes(search.toLowerCase());
        const matchesTier = activeTier === 0 || p.tier === activeTier;
        return matchesSearch && matchesTier;
    });

    return (
        <div className="space-y-8">
            {/* Search & Filter Controls */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between sticky top-[80px] z-30 py-4 bg-background/80 backdrop-blur-md border-b border-border/40">
                <div className="relative w-full md:max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                        placeholder="Search for a career..."
                        className="pl-10 h-12 text-lg rounded-xl border-primary/20 bg-background/50 focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 hide-scrollbar">
                    {tiers.map((tier) => (
                        <button
                            key={tier.id}
                            onClick={() => setActiveTier(tier.id)}
                            className={`
                px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all
                ${activeTier === tier.id
                                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                                    : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                                }
              `}
                        >
                            {tier.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Grid */}
            <motion.div
                layout
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
            >
                <AnimatePresence mode="popLayout">
                    {filtered.map((prof) => (
                        <motion.div
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.2 }}
                            key={prof.id}
                        >
                            <Link href={`/${prof.slug}`} className="block h-full">
                                <div className="group h-full bg-card border border-border/50 rounded-xl p-5 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 active-card flex flex-col justify-between">
                                    <div>
                                        <div className="flex justify-between items-start mb-3">
                                            <h3 className="text-lg font-bold font-heading group-hover:text-primary transition-colors line-clamp-2">
                                                {prof.displayName}
                                            </h3>
                                            <ArrowRight className="w-5 h-5 text-muted-foreground -rotate-45 group-hover:rotate-0 group-hover:text-primary transition-all duration-300" />
                                        </div>

                                        {/* Fake data indicators for visual density - ideally real data */}
                                        <div className="space-y-2 mt-4">
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                <DollarSign className="w-3 h-3 text-secondary" />
                                                <span className="font-mono">Avg: $85k - $120k</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                <TrendingUp className="w-3 h-3 text-green-400" />
                                                <span className="font-mono">Growth: +12%</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-5 pt-4 border-t border-border/40 flex gap-2">
                                        {prof.tier === 1 && <Badge variant="secondary" className="text-[10px] h-5 bg-primary/10 text-primary hover:bg-primary/20">Top Choice</Badge>}
                                        {prof.tier === 2 && <Badge variant="secondary" className="text-[10px] h-5 bg-secondary/10 text-secondary hover:bg-secondary/20">Growth</Badge>}
                                        <Badge variant="outline" className="text-[10px] h-5">Details</Badge>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </motion.div>

            {filtered.length === 0 && (
                <div className="text-center py-24 text-muted-foreground">
                    <p className="text-xl">No professions found matching "{search}"</p>
                </div>
            )}
        </div>
    );
}
