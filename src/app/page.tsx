import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatsTicker } from "@/components/marketing/stats-ticker";
import { prisma } from "@/lib/prisma";
import {
  ArrowRight,
  Sparkles,
  TrendingUp,
  Users,
  GraduationCap,
  DollarSign,
  Briefcase,
  Award,
  BookOpen,
  FileText,
} from "lucide-react";

export default async function Home() {
  // Fetch featured professions for the grid
  const featuredSlugs = ['registered-nurse', 'physical-therapist', 'nurse-practitioner', 'dental-hygienist', 'radiologic-technologist', 'physician-assistant'];
  const featuredProfessions = await prisma.profession.findMany({
    where: { slug: { in: featuredSlugs } },
    select: { id: true, displayName: true, slug: true }
  });

  return (
    <main className="min-h-screen bg-background">
      {/* Stats Ticker */}
      <div className="border-b border-border/40 bg-background/50 backdrop-blur-sm sticky top-0 md:top-[80px] z-40">
        <StatsTicker />
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32 px-4 md:px-8 max-w-7xl mx-auto">
        {/* Abstract Background Elements */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[120px] -z-10 opacity-30 animate-pulse" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-secondary/10 rounded-full blur-[100px] -z-10 opacity-20" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium">
              <Sparkles className="w-4 h-4" />
              <span>The Future of Medical Careers</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-heading font-extrabold tracking-tight mb-6 text-foreground text-balance">
              LAUNCH YOUR <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary text-glow">CAREER</span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground font-light max-w-xl leading-relaxed">
              The authoritative command center for medical professionals.
              Track salaries, find top schools, and land your dream job with precision data.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button size="lg" className="rounded-full text-lg h-14 px-8 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25 text-white" asChild>
                <Link href="/professions">
                  Explore Professions <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="rounded-full text-lg h-14 px-8 border-2 hover:bg-secondary/10 hover:border-secondary hover:text-secondary transition-all" asChild>
                <Link href="/salary">
                  Search Salaries
                </Link>
              </Button>
            </div>

            <div className="flex items-center gap-8 pt-8 text-sm font-medium text-muted-foreground">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-secondary" />
                <span>50k+ Active Users</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-400" />
                <span>Updated Daily</span>
              </div>
            </div>
          </div>

          {/* Right Side Visual */}
          <div className="relative hidden lg:block h-[600px]">
            {/* 3D Glass Card Effect */}
            <div className="absolute top-10 right-10 w-80 h-96 bg-card border border-white/10 rounded-3xl shadow-2xl z-20 p-6 flex flex-col justify-between active-card rotate-3 hover:rotate-0 transition-all duration-500">
              <div>
                <div className="w-full h-32 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl mb-4" />
                <h3 className="text-2xl font-bold font-heading">Registered Nurse</h3>
                <span className="text-secondary font-mono text-lg">$89,010/yr</span>
              </div>
              <div className="w-full h-2 bg-secondary/20 rounded-full overflow-hidden">
                <div className="w-[70%] h-full bg-secondary" />
              </div>
            </div>

            <div className="absolute top-40 right-60 w-80 h-96 bg-card/50 backdrop-blur-md border border-white/5 rounded-3xl shadow-xl z-10 p-6 -rotate-6 grayscale hover:grayscale-0 transition-all duration-300">
              <div className="w-full h-32 bg-muted/20 rounded-2xl mb-4" />
              <div>
                <h3 className="text-2xl font-bold font-heading text-muted-foreground hover:text-foreground transition-colors">Nurse Practitioner</h3>
                <span className="text-secondary font-mono text-lg">$121,610/yr</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Professions Grid (Bentobox) */}
      <section className="py-24 px-4 md:px-8 max-w-7xl mx-auto border-t border-border/40">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-4xl font-heading font-bold mb-4">Trending Professions</h2>
            <p className="text-muted-foreground text-lg">High growth, high salary career paths.</p>
          </div>
          <Button variant="ghost" className="hidden md:flex" asChild>
            <Link href="/professions">View All <ArrowRight className="w-4 h-4 ml-2" /></Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProfessions.map((prof) => (
            <Link key={prof.id} href={`/${prof.slug}`} className="group relative overflow-hidden bg-card border border-border/50 rounded-2xl p-6 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 active-card flex flex-col h-64 justify-between">
              <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowRight className="w-6 h-6 text-primary -rotate-45 group-hover:rotate-0 transition-transform duration-300" />
              </div>
              <div>
                <h3 className="text-2xl font-bold font-heading mb-2 group-hover:text-primary transition-colors">{prof.displayName}</h3>
                <p className="text-muted-foreground line-clamp-2 text-sm">Explore career paths, salaries, and top schools for {prof.displayName}.</p>
              </div>
              <div className="flex gap-2 mt-4">
                <span className="bg-secondary/10 text-secondary text-xs font-mono px-2 py-1 rounded">High Demand</span>
                <span className="bg-primary/10 text-primary text-xs font-mono px-2 py-1 rounded">$80k+</span>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-8 text-center md:hidden">
          <Button variant="outline" className="w-full" asChild>
            <Link href="/professions">View All Professions</Link>
          </Button>
        </div>
      </section>

      {/* Career Resources — replaces old WordPress blog section */}
      <section className="py-24 px-4 bg-muted/20">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-heading font-bold mb-4 text-center">Career Resources</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Everything you need to plan, launch, and grow your healthcare career.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: DollarSign,
                title: 'Salary Explorer',
                description: 'Compare salaries across 100+ healthcare professions by state and city. Updated with the latest BLS data.',
                href: '/registered-nurse/salary',
                cta: 'Explore Salaries',
                color: 'text-green-500',
                bgColor: 'bg-green-500/10',
              },
              {
                icon: GraduationCap,
                title: 'School Finder',
                description: 'Find accredited nursing and healthcare programs near you. Filter by degree level, location, and specialization.',
                href: '/registered-nurse/schools',
                cta: 'Find Schools',
                color: 'text-blue-500',
                bgColor: 'bg-blue-500/10',
              },
              {
                icon: Briefcase,
                title: 'Job Listings',
                description: 'Browse thousands of healthcare job openings with filters for location, specialty, and experience level.',
                href: '/registered-nurse/jobs',
                cta: 'Browse Jobs',
                color: 'text-purple-500',
                bgColor: 'bg-purple-500/10',
              },
              {
                icon: Award,
                title: 'License & Certification',
                description: 'State-by-state licensing requirements, compact nursing states, NCLEX prep, and renewal guides.',
                href: '/registered-nurse/license',
                cta: 'License Guide',
                color: 'text-amber-500',
                bgColor: 'bg-amber-500/10',
              },
              {
                icon: BookOpen,
                title: 'Career Guides',
                description: 'Step-by-step guides on how to become a nurse, therapist, technician, and more — from education to first job.',
                href: '/registered-nurse/how-to-become',
                cta: 'Read Guides',
                color: 'text-cyan-500',
                bgColor: 'bg-cyan-500/10',
              },
              {
                icon: FileText,
                title: 'Resume Builder',
                description: 'Build a professional healthcare resume with AI-powered suggestions tailored to your target role.',
                href: '/resume-builder',
                cta: 'Build Resume',
                color: 'text-rose-500',
                bgColor: 'bg-rose-500/10',
              },
            ].map((resource) => {
              const Icon = resource.icon;
              return (
                <Card key={resource.title} className="flex flex-col bg-card border-border/50 hover:border-primary/50 transition-colors group">
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-xl ${resource.bgColor} flex items-center justify-center mb-3`}>
                      <Icon className={`w-6 h-6 ${resource.color}`} />
                    </div>
                    <CardTitle className="text-xl font-heading group-hover:text-primary transition-colors">
                      {resource.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-3">
                      {resource.description}
                    </CardDescription>
                  </CardHeader>
                  <CardFooter className="mt-auto">
                    <Button asChild variant="ghost" className="w-full group-hover:bg-primary/10 group-hover:text-primary">
                      <Link href={resource.href}>{resource.cta} <ArrowRight className="w-4 h-4 ml-2" /></Link>
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
