'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Save, Eye } from 'lucide-react';
import { DataReview } from './DataReview';
import { ResumePreview } from './ResumePreview';
import { AIAssistant } from './AIAssistant';
import { useToast } from '@/hooks/use-toast';

interface ResumeEditorProps {
    resume: any;
    userData: any;
}

export function ResumeEditor({ resume, userData }: ResumeEditorProps) {
    const router = useRouter();
    const { toast } = useToast();
    const [isSaving, setIsSaving] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const [isEnhancing, setIsEnhancing] = useState(false);
    const [enhancedData, setEnhancedData] = useState<any>(resume.enhancedContent || null);

    const [formData, setFormData] = useState({
        name: resume.name,
        customSummary: resume.customSummary || userData.profile?.bio || '',
        selectedExp: resume.selectedExp || userData.workExperience.map((exp: any) => exp.id),
        selectedEdu: resume.selectedEdu || userData.education.map((edu: any) => edu.id),
        selectedCerts: resume.selectedCerts || userData.certifications.map((cert: any) => cert.id),
        customSkills: resume.customSkills || userData.skills.map((skill: any) => skill.id),
    });

    const handleEnhanceAll = async () => {
        setIsEnhancing(true);
        try {
            const selectedExperiences = userData.workExperience.filter((exp: any) =>
                formData.selectedExp.includes(exp.id)
            );
            const selectedEducation = userData.education.filter((edu: any) =>
                formData.selectedEdu.includes(edu.id)
            );
            const selectedCertifications = userData.certifications.filter((cert: any) =>
                formData.selectedCerts.includes(cert.id)
            );

            const response = await fetch('/api/resumes/enhance-content', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    workExperience: selectedExperiences,
                    education: selectedEducation,
                    certifications: selectedCertifications,
                }),
            });

            if (response.ok) {
                const enhanced = await response.json();
                setEnhancedData(enhanced);
                toast({
                    title: "✨ Content Enhanced!",
                    description: "AI has generated professional descriptions. Review them in the preview.",
                });
            } else {
                toast({
                    title: "Enhancement Failed",
                    description: "Failed to enhance content. Please try again.",
                    variant: "destructive",
                });
            }
        } catch (error) {
            console.error('Error enhancing content:', error);
            toast({
                title: "Enhancement Failed",
                description: "An error occurred. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsEnhancing(false);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const response = await fetch(`/api/resumes/${resume.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    enhancedContent: enhancedData, // Save AI-enhanced descriptions
                }),
            });

            if (response.ok) {
                router.push('/resume-builder');
            } else {
                alert('Failed to save resume');
            }
        } catch (error) {
            console.error('Error saving resume:', error);
            alert('Failed to save resume');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <Button
                        variant="ghost"
                        onClick={() => router.push('/resume-builder')}
                        className="mb-4"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Resumes
                    </Button>
                    <h1 className="text-4xl font-bold">Edit Resume</h1>
                    <p className="text-muted-foreground mt-2">{resume.name}</p>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        onClick={handleEnhanceAll}
                        disabled={isEnhancing}
                        className="gap-2"
                    >
                        {isEnhancing ? (
                            <>
                                <span className="animate-spin">⚡</span>
                                Enhancing...
                            </>
                        ) : (
                            <>
                                <span>✨</span>
                                Enhance All with AI
                            </>
                        )}
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => setShowPreview(!showPreview)}
                    >
                        <Eye className="w-4 h-4 mr-2" />
                        {showPreview ? 'Hide' : 'Show'} Preview
                    </Button>
                    <Button onClick={handleSave} disabled={isSaving}>
                        <Save className="w-4 h-4 mr-2" />
                        {isSaving ? 'Saving...' : 'Save Changes'}
                    </Button>
                </div>
            </div>

            {/* Main Content */}
            <div className={`grid ${showPreview ? 'grid-cols-2' : 'grid-cols-1'} gap-6`}>
                {/* Editor */}
                <div>
                    <Tabs defaultValue="summary" className="w-full">
                        <TabsList className="grid w-full grid-cols-4">
                            <TabsTrigger value="summary">Summary</TabsTrigger>
                            <TabsTrigger value="experience">Experience</TabsTrigger>
                            <TabsTrigger value="education">Education</TabsTrigger>
                            <TabsTrigger value="skills">Skills</TabsTrigger>
                        </TabsList>

                        {/* Summary Tab */}
                        <TabsContent value="summary" className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Professional Summary</CardTitle>
                                    <CardDescription>
                                        Customize your professional summary for this resume
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <Label htmlFor="name">Resume Name</Label>
                                        <Input
                                            id="name"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="mt-2"
                                        />
                                    </div>
                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <Label htmlFor="summary">Summary</Label>
                                            <AIAssistant
                                                type="summary"
                                                data={{
                                                    workExperience: userData.workExperience.map((exp: any) => ({
                                                        title: exp.title,
                                                        company: exp.company,
                                                        years: exp.isCurrent ? 'current' : `${new Date(exp.endDate).getFullYear() - new Date(exp.startDate).getFullYear()} years`
                                                    })),
                                                    education: userData.education.map((edu: any) => ({
                                                        degree: edu.degree,
                                                        institution: edu.institution
                                                    })),
                                                    skills: userData.skills.map((s: any) => s.name),
                                                    profession: resume.professionSlug || 'healthcare professional'
                                                }}
                                                onApply={(suggestion) => setFormData({ ...formData, customSummary: suggestion })}
                                                buttonText="Generate with AI"
                                            />
                                        </div>
                                        <Textarea
                                            id="summary"
                                            rows={6}
                                            value={formData.customSummary}
                                            onChange={(e) => setFormData({ ...formData, customSummary: e.target.value })}
                                            placeholder="Write a compelling professional summary..."
                                            className="mt-2"
                                        />
                                        <p className="text-sm text-muted-foreground mt-1">
                                            {userData.profile?.bio ? 'Default from your profile. Edit to customize for this resume.' : 'Add a professional summary'}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Experience Tab */}
                        <TabsContent value="experience">
                            <DataReview
                                title="Work Experience"
                                description="Select which work experiences to include in this resume"
                                items={userData.workExperience}
                                selectedIds={formData.selectedExp}
                                onSelectionChange={(ids) => setFormData({ ...formData, selectedExp: ids })}
                                renderItem={(exp: any) => (
                                    <div>
                                        <div className="font-semibold">{exp.title}</div>
                                        <div className="text-sm text-muted-foreground">{exp.company}</div>
                                        <div className="text-sm text-muted-foreground">
                                            {new Date(exp.startDate).toLocaleDateString()} - {exp.isCurrent ? 'Present' : new Date(exp.endDate).toLocaleDateString()}
                                        </div>
                                    </div>
                                )}
                            />
                        </TabsContent>

                        {/* Education Tab */}
                        <TabsContent value="education">
                            <DataReview
                                title="Education"
                                description="Select which education entries to include in this resume"
                                items={userData.education}
                                selectedIds={formData.selectedEdu}
                                onSelectionChange={(ids) => setFormData({ ...formData, selectedEdu: ids })}
                                renderItem={(edu: any) => (
                                    <div>
                                        <div className="font-semibold">{edu.degree}</div>
                                        <div className="text-sm text-muted-foreground">{edu.institution}</div>
                                        <div className="text-sm text-muted-foreground">
                                            {edu.fieldOfStudy && `${edu.fieldOfStudy} • `}
                                            {new Date(edu.startDate).getFullYear()} - {edu.isCurrent ? 'Present' : new Date(edu.endDate).getFullYear()}
                                        </div>
                                    </div>
                                )}
                            />
                        </TabsContent>

                        {/* Skills Tab */}
                        <TabsContent value="skills">
                            <DataReview
                                title="Skills & Certifications"
                                description="Select skills and certifications to highlight"
                                items={[...userData.skills, ...userData.certifications]}
                                selectedIds={[...formData.customSkills, ...formData.selectedCerts]}
                                onSelectionChange={(ids) => {
                                    const skillIds = ids.filter(id => userData.skills.some((s: any) => s.id === id));
                                    const certIds = ids.filter(id => userData.certifications.some((c: any) => c.id === id));
                                    setFormData({ ...formData, customSkills: skillIds, selectedCerts: certIds });
                                }}
                                renderItem={(item: any) => (
                                    <div>
                                        <div className="font-semibold">{item.name}</div>
                                        <div className="text-sm text-muted-foreground">
                                            {item.level ? `Level: ${item.level}` : item.issuingOrg ? `Issued by: ${item.issuingOrg}` : ''}
                                        </div>
                                    </div>
                                )}
                            />
                        </TabsContent>
                    </Tabs>
                </div>

                {/* Preview */}
                {showPreview && (
                    <div className="lg:col-span-1">
                        <div className="sticky top-6">
                            <ResumePreview
                                resume={resume}
                                userData={userData}
                                customData={formData}
                                enhancedData={enhancedData}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
