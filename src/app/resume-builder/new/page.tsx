'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight, FileText } from 'lucide-react';
import { TemplateSelector } from '@/components/resume/TemplateSelector';

const STEPS = [
    { id: 1, name: 'Name & Template', description: 'Choose a name and template' },
    { id: 2, name: 'Profession', description: 'Select your profession' },
    { id: 3, name: 'Review', description: 'Review and create' },
];

export default function NewResumePage() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(1);
    const [isCreating, setIsCreating] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        templateId: 'professional',
        professionSlug: '',
    });

    const handleNext = () => {
        if (currentStep < STEPS.length) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleCreate = async () => {
        if (!formData.name) {
            alert('Please enter a resume name');
            return;
        }

        setIsCreating(true);
        try {
            const response = await fetch('/api/resumes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                const resume = await response.json();
                router.push(`/resume-builder/${resume.id}/edit`);
            } else {
                const error = await response.json();
                alert(error.error || 'Failed to create resume');
            }
        } catch (error) {
            console.error('Error creating resume:', error);
            alert('Failed to create resume');
        } finally {
            setIsCreating(false);
        }
    };

    const progress = (currentStep / STEPS.length) * 100;

    return (
        <div className="container mx-auto py-10 px-4 max-w-4xl">
            {/* Header */}
            <div className="mb-8">
                <Button
                    variant="ghost"
                    onClick={() => router.push('/resume-builder')}
                    className="mb-4"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Resumes
                </Button>
                <h1 className="text-4xl font-bold mb-2">Create New Resume</h1>
                <p className="text-muted-foreground">
                    Follow the steps to create your professional resume
                </p>
            </div>

            {/* Progress */}
            <div className="mb-8">
                <Progress value={progress} className="mb-4" />
                <div className="flex justify-between">
                    {STEPS.map((step) => (
                        <div
                            key={step.id}
                            className={`flex-1 text-center ${step.id === currentStep ? 'text-primary font-semibold' : 'text-muted-foreground'
                                }`}
                        >
                            <div className="text-sm">{step.name}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Steps */}
            <Card>
                <CardHeader>
                    <CardTitle>{STEPS[currentStep - 1].name}</CardTitle>
                    <CardDescription>{STEPS[currentStep - 1].description}</CardDescription>
                </CardHeader>
                <CardContent>
                    {/* Step 1: Name & Template */}
                    {currentStep === 1 && (
                        <div className="space-y-6">
                            <div>
                                <Label htmlFor="name">Resume Name *</Label>
                                <Input
                                    id="name"
                                    placeholder="e.g., Registered Nurse Resume, ER Nurse Resume"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="mt-2"
                                />
                                <p className="text-sm text-muted-foreground mt-1">
                                    Give your resume a descriptive name to help you identify it later
                                </p>
                            </div>

                            <div>
                                <Label>Choose Template</Label>
                                <TemplateSelector
                                    selectedTemplate={formData.templateId}
                                    onSelect={(templateId) => setFormData({ ...formData, templateId })}
                                />
                            </div>
                        </div>
                    )}

                    {/* Step 2: Profession */}
                    {currentStep === 2 && (
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="profession">Profession (Optional)</Label>
                                <Input
                                    id="profession"
                                    placeholder="e.g., registered-nurses, physical-therapists"
                                    value={formData.professionSlug}
                                    onChange={(e) => setFormData({ ...formData, professionSlug: e.target.value })}
                                    className="mt-2"
                                />
                                <p className="text-sm text-muted-foreground mt-1">
                                    Link to a profession to get AI-powered suggestions tailored to your field
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Review */}
                    {currentStep === 3 && (
                        <div className="space-y-4">
                            <div className="bg-muted p-4 rounded-lg space-y-3">
                                <div>
                                    <div className="text-sm text-muted-foreground">Resume Name</div>
                                    <div className="font-semibold">{formData.name || 'Not set'}</div>
                                </div>
                                <div>
                                    <div className="text-sm text-muted-foreground">Template</div>
                                    <div className="font-semibold capitalize">{formData.templateId}</div>
                                </div>
                                <div>
                                    <div className="text-sm text-muted-foreground">Profession</div>
                                    <div className="font-semibold">{formData.professionSlug || 'Not specified'}</div>
                                </div>
                            </div>

                            <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
                                <div className="flex gap-3">
                                    <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
                                            Next Steps
                                        </h4>
                                        <p className="text-sm text-blue-800 dark:text-blue-200">
                                            After creating your resume, you'll be able to customize the content, select which
                                            work experiences and education to include, and generate a professional PDF.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Navigation */}
            <div className="flex justify-between mt-6">
                <Button
                    variant="outline"
                    onClick={handleBack}
                    disabled={currentStep === 1}
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                </Button>

                {currentStep < STEPS.length ? (
                    <Button onClick={handleNext}>
                        Next
                        <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                ) : (
                    <Button onClick={handleCreate} disabled={isCreating}>
                        {isCreating ? 'Creating...' : 'Create Resume'}
                    </Button>
                )}
            </div>
        </div>
    );
}
