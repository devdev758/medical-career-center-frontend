"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { logout } from "@/lib/actions/auth";
import { LogOut, Briefcase, Building2, User, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface HeaderProps {
    user?: {
        name?: string | null;
        email?: string | null;
        role?: string;
    } | null;
}

export function Header({ user }: HeaderProps) {
    const pathname = usePathname();
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const isEmployer = user?.role === "EMPLOYER";
    const isLoggedIn = !!user;

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        { href: "/professions", label: "Professions" },
        { href: "/salary", label: "Salaries" },
        { href: "/jobs", label: "Jobs" },
    ];

    return (
        <React.Fragment>
            <motion.header
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 w-full ${isScrolled ? "bg-primary/95 backdrop-blur-md shadow-md py-2" : "bg-primary py-4"
                    }`}
            >
                <div className="container mx-auto px-4 max-w-7xl flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 font-heading font-bold text-xl tracking-tight text-white hover:opacity-90 transition-opacity">
                        <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                            <Briefcase className="w-5 h-5 text-white" />
                        </div>
                        <span>MCC</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-2">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`
                                    px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
                                    ${pathname.startsWith(link.href)
                                        ? "bg-white/10 text-white font-bold"
                                        : "text-blue-100 hover:text-white hover:bg-white/5"
                                    }
                                `}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>

                    {/* Auth Actions */}
                    <div className="hidden md:flex items-center gap-3">
                        {isLoggedIn ? (
                            <div className="flex items-center gap-3">
                                <Link href={isEmployer ? "/employer/dashboard" : "/dashboard"}>
                                    <div className="flex items-center gap-2 text-sm font-medium text-white hover:text-blue-200 transition-colors">
                                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                                            <User className="w-4 h-4 text-white" />
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Button variant="ghost" size="sm" asChild className="rounded-full text-blue-100 hover:text-white hover:bg-white/10 font-medium">
                                    <Link href="/login">Login</Link>
                                </Button>
                                <Button size="sm" asChild className="rounded-full px-5 font-semibold bg-white text-primary hover:bg-white/90 shadow-lg">
                                    <Link href="/register">Get Started</Link>
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* Mobile Toggle */}
                    <button
                        className="md:hidden p-2 text-white"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <X /> : <Menu />}
                    </button>
                </div>
            </motion.header>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed inset-0 z-40 bg-background pt-24 px-6 md:hidden"
                    >
                        <nav className="flex flex-col gap-6">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="text-2xl font-heading font-bold text-foreground"
                                >
                                    {link.label}
                                </Link>
                            ))}
                            <div className="h-px bg-border my-2" />
                            {isLoggedIn ? (
                                <Link
                                    href="/dashboard"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="text-xl font-medium text-primary"
                                >
                                    Go to Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="text-xl font-medium">Login</Link>
                                    <Link href="/register" onClick={() => setMobileMenuOpen(false)} className="text-xl font-medium text-primary">Get Started</Link>
                                </>
                            )}
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Spacer for fixed header */}
            <div className="h-24" />
        </React.Fragment>
    );
}

import React from 'react';
