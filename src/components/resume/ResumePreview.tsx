'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ResumePreviewProps {
    resume: any;
    userData: any;
    customData: {
        name: string;
        customSummary: string;
        selectedExp: string[];
        selectedEdu: string[];
        selectedCerts: string[];
        customSkills: string[];
    };
    enhancedData?: any; // AI-enhanced descriptions
}

export function ResumePreview({ resume, userData, customData, enhancedData }: ResumePreviewProps) {
    const selectedExperiences = userData.workExperience.filter((exp: any) =>
        customData.selectedExp.includes(exp.id)
    );

    const selectedEducation = userData.education.filter((edu: any) =>
        customData.selectedEdu.includes(edu.id)
    );

    const selectedSkills = userData.skills.filter((skill: any) =>
        customData.customSkills.includes(skill.id)
    );

    const selectedCerts = userData.certifications.filter((cert: any) =>
        customData.selectedCerts.includes(cert.id)
    );

    // Helper to get AI-enhanced description
    const getEnhancedExp = (expId: string) => {
        return enhancedData?.workExperience?.find((e: any) => e.id === expId);
    };

    const getEnhancedEdu = (eduId: string) => {
        return enhancedData?.education?.find((e: any) => e.id === eduId);
    };

    const getEnhancedCert = (certId: string) => {
        return enhancedData?.certifications?.find((c: any) => c.id === certId);
    };

    return (
        <Card className="shadow-lg">
            <CardHeader className="bg-primary text-primary-foreground">
                <CardTitle className="text-2xl">{userData.name || 'Your Name'}</CardTitle>
                <div className="text-sm opacity-90">
                    {userData.profile?.headline || 'Professional Title'}
                </div>
                {userData.email && (
                    <div className="text-sm opacity-90">{userData.email}</div>
                )}
            </CardHeader>
            <CardContent className="p-6 space-y-6">
                {/* Summary */}
                {customData.customSummary && (
                    <div>
                        <h3 className="font-bold text-lg mb-2 border-b pb-1">Professional Summary</h3>
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                            {customData.customSummary}
                        </p>
                    </div>
                )}

                {/* Experience */}
                {selectedExperiences.length > 0 && (
                    <div>
                        <h3 className="font-bold text-lg mb-3 border-b pb-1">Work Experience</h3>
                        <div className="space-y-4">
                            {selectedExperiences.map((exp: any) => {
                                const enhanced = getEnhancedExp(exp.id);
                                return (
                                    <div key={exp.id}>
                                        <div className="font-semibold">{exp.title}</div>
                                        <div className="text-sm text-muted-foreground">{exp.company}</div>
                                        <div className="text-xs text-muted-foreground mb-2">
                                            {new Date(exp.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} -{' '}
                                            {exp.isCurrent ? 'Present' : new Date(exp.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                                        </div>
                                        {/* Show AI-enhanced description if available, otherwise show original */}
                                        {enhanced?.aiDescription ? (
                                            <div className="text-sm text-muted-foreground whitespace-pre-wrap bg-blue-50 dark:bg-blue-950 p-2 rounded border border-blue-200 dark:border-blue-800">
                                                <div className="text-xs text-blue-600 dark:text-blue-400 mb-1">✨ AI-Enhanced</div>
                                                {enhanced.aiDescription}
                                            </div>
                                        ) : exp.description ? (
                                            <p className="text-sm text-muted-foreground">{exp.description}</p>
                                        ) : null}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Education */}
                {selectedEducation.length > 0 && (
                    <div>
                        <h3 className="font-bold text-lg mb-3 border-b pb-1">Education</h3>
                        <div className="space-y-3">
                            {selectedEducation.map((edu: any) => {
                                const enhanced = getEnhancedEdu(edu.id);
                                return (
                                    <div key={edu.id}>
                                        <div className="font-semibold">{edu.degree}</div>
                                        <div className="text-sm text-muted-foreground">{edu.institution}</div>
                                        <div className="text-xs text-muted-foreground">
                                            {edu.fieldOfStudy && `${edu.fieldOfStudy} • `}
                                            {new Date(edu.startDate).getFullYear()} -{' '}
                                            {edu.isCurrent ? 'Present' : new Date(edu.endDate).getFullYear()}
                                        </div>
                                        {enhanced?.aiDescription && (
                                            <div className="text-sm text-muted-foreground mt-1 bg-blue-50 dark:bg-blue-950 p-2 rounded border border-blue-200 dark:border-blue-800">
                                                <div className="text-xs text-blue-600 dark:text-blue-400 mb-1">✨ AI-Enhanced</div>
                                                {enhanced.aiDescription}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Skills */}
                {selectedSkills.length > 0 && (
                    <div>
                        <h3 className="font-bold text-lg mb-3 border-b pb-1">Skills</h3>
                        <div className="flex flex-wrap gap-2">
                            {selectedSkills.map((skill: any) => (
                                <Badge key={skill.id} variant="secondary">
                                    {skill.name}
                                </Badge>
                            ))}
                        </div>
                    </div>
                )}

                {/* Certifications */}
                {selectedCerts.length > 0 && (
                    <div>
                        <h3 className="font-bold text-lg mb-3 border-b pb-1">Certifications</h3>
                        <div className="space-y-2">
                            {selectedCerts.map((cert: any) => {
                                const enhanced = getEnhancedCert(cert.id);
                                return (
                                    <div key={cert.id} className="text-sm">
                                        <div className="font-semibold">{cert.name}</div>
                                        <div className="text-muted-foreground">
                                            {cert.issuingOrg} • {new Date(cert.issueDate).getFullYear()}
                                        </div>
                                        {enhanced?.aiDescription && (
                                            <div className="text-sm text-muted-foreground mt-1 bg-blue-50 dark:bg-blue-950 p-2 rounded border border-blue-200 dark:border-blue-800">
                                                <div className="text-xs text-blue-600 dark:text-blue-400 mb-1">✨ AI-Enhanced</div>
                                                {enhanced.aiDescription}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
