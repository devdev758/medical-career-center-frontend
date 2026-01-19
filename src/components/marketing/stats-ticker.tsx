"use client";

import { motion } from "framer-motion";
import { TrendingUp, Users, Search, DollarSign } from "lucide-react";

const stats = [
    { label: "Open Healthcare Jobs", value: "15,204", icon: Search, color: "text-primary" },
    { label: "Avg Nurse Salary", value: "$89,010", icon: DollarSign, color: "text-secondary" },
    { label: "Job Growth Rate", value: "+6.0%", icon: TrendingUp, color: "text-green-400" },
    { label: "Active Professionals", value: "50,000+", icon: Users, color: "text-blue-400" },
];

export function StatsTicker() {
    return (
        <div className="w-full bg-background/50 border-y border-white/5 backdrop-blur-sm overflow-hidden py-3">
            <motion.div
                className="flex whitespace-nowrap gap-16"
                animate={{ x: [0, -1000] }}
                transition={{
                    repeat: Infinity,
                    ease: "linear",
                    duration: 25,
                }}
            >
                {[...stats, ...stats, ...stats].map((stat, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm font-mono">
                        <stat.icon className={`w-4 h-4 ${stat.color}`} />
                        <span className="text-muted-foreground">{stat.label}:</span>
                        <span className="font-bold text-foreground">{stat.value}</span>
                    </div>
                ))}
            </motion.div>
        </div>
    );
}
