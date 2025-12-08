import Link from "next/link";

export function Footer() {
    return (
        <footer className="border-t bg-gray-50 mt-auto">
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <h3 className="font-semibold mb-4">Medical Career Center</h3>
                        <p className="text-sm text-muted-foreground">
                            Connecting healthcare professionals with opportunities.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4">For Job Seekers</h4>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="/jobs" className="text-muted-foreground hover:text-primary">
                                    Browse Jobs
                                </Link>
                            </li>
                            <li>
                                <Link href="/register" className="text-muted-foreground hover:text-primary">
                                    Create Account
                                </Link>
                            </li>
                            <li>
                                <Link href="/dashboard" className="text-muted-foreground hover:text-primary">
                                    Dashboard
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4">For Employers</h4>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="/register/employer" className="text-muted-foreground hover:text-primary">
                                    Post Jobs
                                </Link>
                            </li>
                            <li>
                                <Link href="/employer/dashboard" className="text-muted-foreground hover:text-primary">
                                    Employer Dashboard
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4">Resources</h4>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="/" className="text-muted-foreground hover:text-primary">
                                    Articles
                                </Link>
                            </li>
                            <li>
                                <Link href="/jobs" className="text-muted-foreground hover:text-primary">
                                    Career Advice
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
                    <p>&copy; {new Date().getFullYear()} Medical Career Center. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
