import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { getProfile, getWorkExperience, getEducation, getSkills } from "@/lib/actions/profile";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import { ArrowLeft, Edit, Plus, Briefcase, GraduationCap, Award, User, MapPin, Phone, Globe, Linkedin } from "lucide-react";

export default async function ProfilePage() {
    const session = await auth();

    if (!session?.user) {
        redirect("/login?callbackUrl=/dashboard/profile");
    }

    // Redirect employers to their company profile
    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { role: true },
    });

    if (user?.role === "EMPLOYER") {
        redirect("/employer/company");
    }

    const [profile, workExperience, education, skills] = await Promise.all([
        getProfile().catch(() => null),
        getWorkExperience().catch(() => []),
        getEducation().catch(() => []),
        getSkills().catch(() => []),
    ]);

    const profileCompletion = profile?.profileComplete || 0;

    return (
        <main className="container mx-auto py-10 px-4 max-w-5xl">
            <Link href="/dashboard" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6">
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back to Dashboard
            </Link>

            <div className="mb-8">
                <h1 className="text-4xl font-bold mb-2">My Profile</h1>
                <p className="text-muted-foreground">
                    Build your professional profile to stand out to employers
                </p>
            </div>

            {/* Profile Completion */}
            <Card className="mb-6">
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle>Profile Completion</CardTitle>
                            <CardDescription>
                                Complete your profile to increase your chances of getting hired
                            </CardDescription>
                        </div>
                        <div className="text-3xl font-bold">{profileCompletion}%</div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Progress value={profileCompletion} className="h-2" />
                </CardContent>
            </Card>

            {/* Basic Info */}
            <Card className="mb-6">
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                <User className="w-5 h-5" />
                                Basic Information
                            </CardTitle>
                        </div>
                        <Button variant="outline" size="sm" asChild>
                            <Link href="/dashboard/profile/edit">
                                <Edit className="w-4 h-4 mr-2" />
                                Edit
                            </Link>
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    {profile?.headline ? (
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Headline</p>
                            <p className="text-lg font-medium">{profile.headline}</p>
                        </div>
                    ) : (
                        <p className="text-sm text-muted-foreground">No headline added yet</p>
                    )}

                    {profile?.bio && (
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Bio</p>
                            <p className="text-sm">{profile.bio}</p>
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                        {profile?.location && (
                            <div className="flex items-center gap-2 text-sm">
                                <MapPin className="w-4 h-4 text-muted-foreground" />
                                <span>{profile.location}</span>
                            </div>
                        )}
                        {profile?.phone && (
                            <div className="flex items-center gap-2 text-sm">
                                <Phone className="w-4 h-4 text-muted-foreground" />
                                <span>{profile.phone}</span>
                            </div>
                        )}
                        {profile?.website && (
                            <div className="flex items-center gap-2 text-sm">
                                <Globe className="w-4 h-4 text-muted-foreground" />
                                <a href={profile.website} target="_blank" rel="noopener noreferrer" className="hover:underline">
                                    Website
                                </a>
                            </div>
                        )}
                        {profile?.linkedIn && (
                            <div className="flex items-center gap-2 text-sm">
                                <Linkedin className="w-4 h-4 text-muted-foreground" />
                                <a href={profile.linkedIn} target="_blank" rel="noopener noreferrer" className="hover:underline">
                                    LinkedIn
                                </a>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Work Experience */}
            <Card className="mb-6">
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle className="flex items-center gap-2">
                            <Briefcase className="w-5 h-5" />
                            Work Experience
                        </CardTitle>
                        <Button variant="outline" size="sm" asChild>
                            <Link href="/dashboard/profile/experience/new">
                                <Plus className="w-4 h-4 mr-2" />
                                Add Experience
                            </Link>
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    {workExperience.length > 0 ? (
                        <div className="space-y-4">
                            {workExperience.map((exp) => (
                                <div key={exp.id} className="border-l-2 pl-4 pb-4 last:pb-0">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-semibold">{exp.title}</h3>
                                            <p className="text-sm text-muted-foreground">{exp.company}</p>
                                            {exp.location && (
                                                <p className="text-sm text-muted-foreground">{exp.location}</p>
                                            )}
                                            <p className="text-xs text-muted-foreground mt-1">
                                                {new Date(exp.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} - {' '}
                                                {exp.isCurrent ? 'Present' : new Date(exp.endDate!).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                                            </p>
                                        </div>
                                        {exp.isCurrent && (
                                            <Badge variant="secondary">Current</Badge>
                                        )}
                                    </div>
                                    {exp.description && (
                                        <p className="text-sm mt-2">{exp.description}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-muted-foreground">No work experience added yet</p>
                    )}
                </CardContent>
            </Card>

            {/* Education */}
            <Card className="mb-6">
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle className="flex items-center gap-2">
                            <GraduationCap className="w-5 h-5" />
                            Education
                        </CardTitle>
                        <Button variant="outline" size="sm" asChild>
                            <Link href="/dashboard/profile/education/new">
                                <Plus className="w-4 h-4 mr-2" />
                                Add Education
                            </Link>
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    {education.length > 0 ? (
                        <div className="space-y-4">
                            {education.map((edu) => (
                                <div key={edu.id} className="border-l-2 pl-4 pb-4 last:pb-0">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-semibold">{edu.degree}</h3>
                                            <p className="text-sm text-muted-foreground">{edu.institution}</p>
                                            {edu.fieldOfStudy && (
                                                <p className="text-sm text-muted-foreground">{edu.fieldOfStudy}</p>
                                            )}
                                            <p className="text-xs text-muted-foreground mt-1">
                                                {new Date(edu.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} - {' '}
                                                {edu.isCurrent ? 'Present' : new Date(edu.endDate!).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                                            </p>
                                        </div>
                                        {edu.isCurrent && (
                                            <Badge variant="secondary">Current</Badge>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-muted-foreground">No education added yet</p>
                    )}
                </CardContent>
            </Card>

            {/* Skills */}
            <Card className="mb-6">
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle className="flex items-center gap-2">
                            <Award className="w-5 h-5" />
                            Skills
                        </CardTitle>
                        <Button variant="outline" size="sm" asChild>
                            <Link href="/dashboard/profile/skills">
                                <Edit className="w-4 h-4 mr-2" />
                                Manage Skills
                            </Link>
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    {skills.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                            {skills.map((skill) => (
                                <Badge key={skill.id} variant="outline">
                                    {skill.name}
                                    {skill.level && ` • ${skill.level}`}
                                </Badge>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-muted-foreground">No skills added yet</p>
                    )}
                </CardContent>
            </Card>
        </main>
    );
}
