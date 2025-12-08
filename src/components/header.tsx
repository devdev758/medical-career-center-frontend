"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { logout } from "@/lib/actions/auth";
import { LogOut, Briefcase, Building2, User } from "lucide-react";

interface HeaderProps {
    user?: {
        name?: string | null;
        email?: string | null;
        role?: string;
    } | null;
}

export function Header({ user }: HeaderProps) {
    const pathname = usePathname();

    const isEmployer = user?.role === "EMPLOYER";
    const isLoggedIn = !!user;

    return (
        <header className="border-b bg-white sticky top-0 z-50">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 font-bold text-xl">
                        <Briefcase className="w-6 h-6" />
                        <span>Medical Career Center</span>
                    </Link>

                    {/* Navigation */}
                    <nav className="hidden md:flex items-center gap-6">
                        <Link
                            href="/jobs"
                            className={`text-sm font-medium transition-colors hover:text-primary ${pathname === "/jobs" ? "text-primary" : "text-muted-foreground"
                                }`}
                        >
                            Browse Jobs
                        </Link>

                        {isLoggedIn && !isEmployer && (
                            <>
                                <Link
                                    href="/dashboard"
                                    className={`text-sm font-medium transition-colors hover:text-primary ${pathname === "/dashboard" ? "text-primary" : "text-muted-foreground"
                                        }`}
                                >
                                    Dashboard
                                </Link>
                                <Link
                                    href="/dashboard/applications"
                                    className={`text-sm font-medium transition-colors hover:text-primary ${pathname === "/dashboard/applications" ? "text-primary" : "text-muted-foreground"
                                        }`}
                                >
                                    My Applications
                                </Link>
                                <Link
                                    href="/dashboard/saved-jobs"
                                    className={`text-sm font-medium transition-colors hover:text-primary ${pathname === "/dashboard/saved-jobs" ? "text-primary" : "text-muted-foreground"
                                        }`}
                                >
                                    Saved Jobs
                                </Link>
                            </>
                        )}

                        {isEmployer && (
                            <>
                                <Link
                                    href="/employer/dashboard"
                                    className={`text-sm font-medium transition-colors hover:text-primary ${pathname === "/employer/dashboard" ? "text-primary" : "text-muted-foreground"
                                        }`}
                                >
                                    Dashboard
                                </Link>
                                <Link
                                    href="/employer/jobs"
                                    className={`text-sm font-medium transition-colors hover:text-primary ${pathname === "/employer/jobs" ? "text-primary" : "text-muted-foreground"
                                        }`}
                                >
                                    My Jobs
                                </Link>
                                <Link
                                    href="/employer/applications"
                                    className={`text-sm font-medium transition-colors hover:text-primary ${pathname === "/employer/applications" ? "text-primary" : "text-muted-foreground"
                                        }`}
                                >
                                    Applications
                                </Link>
                                <Link
                                    href="/employer/jobs/new"
                                    className={`text-sm font-medium transition-colors hover:text-primary ${pathname === "/employer/jobs/new" ? "text-primary" : "text-muted-foreground"
                                        }`}
                                >
                                    Post Job
                                </Link>
                            </>
                        )}
                    </nav>

                    {/* Auth Actions */}
                    <div className="flex items-center gap-4">
                        {isLoggedIn ? (
                            <>
                                <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
                                    <User className="w-4 h-4" />
                                    <span>{user.name || user.email}</span>
                                    {isEmployer && <Building2 className="w-4 h-4 ml-2" />}
                                </div>
                                <form action={logout}>
                                    <Button variant="outline" size="sm" type="submit">
                                        <LogOut className="w-4 h-4 mr-2" />
                                        Logout
                                    </Button>
                                </form>
                            </>
                        ) : (
                            <>
                                <Button variant="ghost" size="sm" asChild>
                                    <Link href="/login">Login</Link>
                                </Button>
                                <Button size="sm" asChild>
                                    <Link href="/register">Sign Up</Link>
                                </Button>
                                <Button variant="outline" size="sm" asChild>
                                    <Link href="/register/employer">
                                        <Building2 className="w-4 h-4 mr-2" />
                                        Employer
                                    </Link>
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
