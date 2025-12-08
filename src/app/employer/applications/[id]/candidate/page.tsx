import { getCandidateProfile, getCandidateWorkExperience, getCandidateEducation, getCandidateSkills, getCandidateLicenses, getCandidateCertifications } from "@/lib/actions/profile";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ArrowLeft, Briefcase, GraduationCap, Award, Shield, User, Mail, Phone, MapPin, Calendar } from "lucide-react";

export default async function CandidateProfilePage({
    params,
}: {
    params: { id: string };
}) {
    const [candidateData, workExperience, education, skills, licenses, certifications] = await Promise.all([
        getCandidateProfile(params.id),
        getCandidateWorkExperience(params.id),
        getCandidateEducation(params.id),
        getCandidateSkills(params.id),
        getCandidateLicenses(params.id),
        getCandidateCertifications(params.id),
    ]);

    const { user, profile } = candidateData;

    return (
        <main className="container mx-auto py-10 px-4 max-w-5xl">
            <Link href={`/employer/applications/${params.id}`} className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6">
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back to Application
            </Link>

            <div className="mb-8">
                <h1 className="text-4xl font-bold mb-2">Candidate Profile</h1>
                <p className="text-muted-foreground">
                    Comprehensive profile of {profile?.firstName || user.name}
                </p>
            </div>

            {/* Basic Information */}
            <Card className="mb-6">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <User className="w-5 h-5" />
                        Basic Information
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Full Name</p>
                            <p className="text-lg font-medium">
                                {profile?.firstName && profile?.lastName
                                    ? `${profile.firstName} ${profile.middleName ? profile.middleName + ' ' : ''}${profile.lastName}`
                                    : user.name || "Not provided"}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Email</p>
                            <div className="flex items-center gap-2">
                                <Mail className="w-4 h-4" />
                                <a href={`mailto:${user.email}`} className="hover:underline">
                                    {user.email}
                                </a>
                            </div>
                        </div>
                    </div>

                    {profile?.phone && (
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Phone</p>
                            <div className="flex items-center gap-2">
                                <Phone className="w-4 h-4" />
                                <a href={`tel:${profile.phone}`} className="hover:underline">
                                    {profile.phone}
                                </a>
                            </div>
                        </div>
                    )}

                    {(profile?.city || profile?.state) && (
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Location</p>
                            <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4" />
                                <p>{profile.city}{profile.city && profile.state && ', '}{profile.state}</p>
                            </div>
                        </div>
                    )}

                    {profile?.headline && (
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Professional Headline</p>
                            <p className="text-lg">{profile.headline}</p>
                        </div>
                    )}

                    {profile?.bio && (
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Professional Summary</p>
                            <p className="text-sm whitespace-pre-wrap">{profile.bio}</p>
                        </div>
                    )}

                    {profile?.yearsOfExperience && (
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Years of Experience</p>
                            <p>{profile.yearsOfExperience} years</p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Medical Licenses */}
            {licenses.length > 0 && (
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Shield className="w-5 h-5" />
                            Medical Licenses
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {licenses.map((license) => {
                                const isExpired = license.expiryDate && new Date(license.expiryDate) < new Date();
                                return (
                                    <div key={license.id} className="border-l-2 pl-4 py-2">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-medium">{license.licenseType} - {license.state}</p>
                                                <p className="text-sm text-muted-foreground">License #: {license.licenseNumber}</p>
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    Issued: {new Date(license.issueDate).toLocaleDateString('en-US')}
                                                    {license.expiryDate && (
                                                        <> • Expires: {new Date(license.expiryDate).toLocaleDateString('en-US')}</>
                                                    )}
                                                </p>
                                            </div>
                                            <div className="flex gap-2">
                                                <Badge variant={license.status === "ACTIVE" ? "default" : "secondary"}>
                                                    {license.status}
                                                </Badge>
                                                {isExpired && license.status === "ACTIVE" && (
                                                    <Badge variant="destructive">Expired</Badge>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Work Experience */}
            {workExperience.length > 0 && (
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Briefcase className="w-5 h-5" />
                            Work Experience
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
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
                                            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                                                <Calendar className="w-3 h-3" />
                                                {new Date(exp.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} - {' '}
                                                {exp.isCurrent ? 'Present' : new Date(exp.endDate!).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                                            </p>
                                            {exp.description && (
                                                <p className="text-sm mt-2">{exp.description}</p>
                                            )}
                                        </div>
                                        {exp.isCurrent && (
                                            <Badge variant="secondary">Current</Badge>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Education */}
            {education.length > 0 && (
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <GraduationCap className="w-5 h-5" />
                            Education
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
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
                                            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                                                <Calendar className="w-3 h-3" />
                                                {new Date(edu.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} - {' '}
                                                {edu.isCurrent ? 'Present' : new Date(edu.endDate!).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                                            </p>
                                            {edu.grade && (
                                                <p className="text-sm mt-1">Grade: {edu.grade}</p>
                                            )}
                                        </div>
                                        {edu.isCurrent && (
                                            <Badge variant="secondary">Current</Badge>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Skills */}
            {skills.length > 0 && (
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Award className="w-5 h-5" />
                            Skills
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-2">
                            {skills.map((skill) => (
                                <Badge key={skill.id} variant="outline">
                                    {skill.name}
                                    {skill.level && ` • ${skill.level}`}
                                    {skill.yearsOfExperience && ` • ${skill.yearsOfExperience}y`}
                                </Badge>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Certifications */}
            {certifications.length > 0 && (
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Award className="w-5 h-5" />
                            Certifications
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {certifications.map((cert) => {
                                const isExpired = cert.expiryDate && new Date(cert.expiryDate) < new Date();
                                return (
                                    <div key={cert.id} className="border-l-2 pl-4 py-2">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-medium">{cert.name}</p>
                                                <p className="text-sm text-muted-foreground">{cert.issuingOrg}</p>
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    Issued: {new Date(cert.issueDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                                                    {cert.expiryDate && (
                                                        <> • Expires: {new Date(cert.expiryDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</>
                                                    )}
                                                </p>
                                                {cert.credentialId && (
                                                    <p className="text-xs text-muted-foreground">ID: {cert.credentialId}</p>
                                                )}
                                                {cert.credentialUrl && (
                                                    <a href={cert.credentialUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline">
                                                        View Credential
                                                    </a>
                                                )}
                                            </div>
                                            {isExpired && (
                                                <Badge variant="destructive">Expired</Badge>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>
            )}
        </main>
    );
}
