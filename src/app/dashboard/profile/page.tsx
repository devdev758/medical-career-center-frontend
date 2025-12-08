"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getProfile, getWorkExperience, getEducation, getSkills, getLicenses, getCertifications, deleteWorkExperience, deleteEducation, deleteSkill } from "@/lib/actions/profile";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import { ArrowLeft, Edit, Plus, Briefcase, GraduationCap, Award, User, Shield, Trash2 } from "lucide-react";

export default function ProfilePage() {
    const router = useRouter();
    const [profile, setProfile] = useState<any>(null);
    const [workExperience, setWorkExperience] = useState<any[]>([]);
    const [education, setEducation] = useState<any[]>([]);
    const [skills, setSkills] = useState<any[]>([]);
    const [licenses, setLicenses] = useState<any[]>([]);
    const [certifications, setCertifications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    async function loadData() {
        try {
            const [profileData, workData, eduData, skillsData, licensesData, certsData] = await Promise.all([
                getProfile().catch(() => null),
                getWorkExperience().catch(() => []),
                getEducation().catch(() => []),
                getSkills().catch(() => []),
                getLicenses().catch(() => []),
                getCertifications().catch(() => []),
            ]);

            setProfile(profileData);
            setWorkExperience(workData);
            setEducation(eduData);
            setSkills(skillsData);
            setLicenses(licensesData);
            setCertifications(certsData);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    async function handleDeleteWork(id: string) {
        if (!confirm("Delete this work experience?")) return;
        try {
            await deleteWorkExperience(id);
            await loadData();
        } catch (error) {
            alert("Failed to delete");
        }
    }

    async function handleDeleteEducation(id: string) {
        if (!confirm("Delete this education entry?")) return;
        try {
            await deleteEducation(id);
            await loadData();
        } catch (error) {
            alert("Failed to delete");
        }
    }

    const profileCompletion = profile?.profileComplete || 0;

    if (loading) {
        return <div className="container mx-auto py-10 px-4">Loading...</div>;
    }

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
                </CardContent>
            </Card>

            {/* Licenses */}
            <Card className="mb-6">
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle className="flex items-center gap-2">
                            <Shield className="w-5 h-5" />
                            Medical Licenses
                        </CardTitle>
                        <Button variant="outline" size="sm" asChild>
                            <Link href="/dashboard/profile/licenses">
                                <Plus className="w-4 h-4 mr-2" />
                                Manage Licenses
                            </Link>
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    {licenses.length > 0 ? (
                        <div className="space-y-2">
                            {licenses.map((license) => (
                                <div key={license.id} className="flex items-center justify-between border-l-2 pl-4 py-2">
                                    <div>
                                        <p className="font-medium">{license.licenseType} - {license.state}</p>
                                        <p className="text-sm text-muted-foreground">License #: {license.licenseNumber}</p>
                                    </div>
                                    <Badge variant={license.status === "ACTIVE" ? "default" : "secondary"}>
                                        {license.status}
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-muted-foreground">No licenses added yet</p>
                    )}
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
                                        <div className="flex-1">
                                            <h3 className="font-semibold">{exp.title}</h3>
                                            <p className="text-sm text-muted-foreground">{exp.company}</p>
                                            {exp.location && (
                                                <p className="text-sm text-muted-foreground">{exp.location}</p>
                                            )}
                                            <p className="text-xs text-muted-foreground mt-1">
                                                {new Date(exp.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} - {' '}
                                                {exp.isCurrent ? 'Present' : new Date(exp.endDate!).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                                            </p>
                                            {exp.description && (
                                                <p className="text-sm mt-2">{exp.description}</p>
                                            )}
                                        </div>
                                        <div className="flex gap-2">
                                            {exp.isCurrent && (
                                                <Badge variant="secondary">Current</Badge>
                                            )}
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleDeleteWork(exp.id)}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
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
                                        <div className="flex-1">
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
                                        <div className="flex gap-2">
                                            {edu.isCurrent && (
                                                <Badge variant="secondary">Current</Badge>
                                            )}
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleDeleteEducation(edu.id)}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
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

            {/* Certifications */}
            <Card className="mb-6">
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle className="flex items-center gap-2">
                            <Award className="w-5 h-5" />
                            Certifications
                        </CardTitle>
                        <Button variant="outline" size="sm" asChild>
                            <Link href="/dashboard/profile/certifications">
                                <Plus className="w-4 h-4 mr-2" />
                                Manage Certifications
                            </Link>
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    {certifications.length > 0 ? (
                        <div className="space-y-2">
                            {certifications.map((cert) => (
                                <div key={cert.id} className="border-l-2 pl-4 py-2">
                                    <p className="font-medium">{cert.name}</p>
                                    <p className="text-sm text-muted-foreground">{cert.issuingOrg}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-muted-foreground">No certifications added yet</p>
                    )}
                </CardContent>
            </Card>
        </main>
    );
}
