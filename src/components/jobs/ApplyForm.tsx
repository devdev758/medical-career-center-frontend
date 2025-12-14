'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { FileText, Upload } from 'lucide-react';
import Link from 'next/link';

interface Resume {
    id: string;
    name: string;
    isPrimary: boolean;
    pdfGeneratedAt: Date | null;
}

interface ApplyFormProps {
    jobId: string;
    jobSlug: string;
    userEmail: string;
    resumes: Resume[];
}

export function ApplyForm({ jobId, jobSlug, userEmail, resumes }: ApplyFormProps) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [resumeMethod, setResumeMethod] = useState<'existing' | 'upload'>(
        resumes.length > 0 ? 'existing' : 'upload'
    );
    const [selectedResumeId, setSelectedResumeId] = useState(
        resumes.find(r => r.isPrimary)?.id || resumes[0]?.id || ''
    );

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const formData = new FormData(e.currentTarget);

            // Add resume ID if using existing resume
            if (resumeMethod === 'existing' && selectedResumeId) {
                formData.append('resumeId', selectedResumeId);
            }

            const response = await fetch('/api/applications', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                router.push('/dashboard/applications');
            } else {
                const error = await response.json();
                alert(error.error || 'Failed to submit application');
            }
        } catch (error) {
            console.error('Error submitting application:', error);
            alert('Failed to submit application');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <input type="hidden" name="jobId" value={jobId} />

            <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                    id="email"
                    type="email"
                    value={userEmail}
                    disabled
                    className="bg-muted"
                />
                <p className="text-xs text-muted-foreground">
                    This is your account email and cannot be changed.
                </p>
            </div>

            <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    placeholder="(555) 123-4567"
                />
            </div>

            {/* Resume Selection */}
            <div className="space-y-4">
                <Label>Resume *</Label>

                {resumes.length > 0 && (
                    <RadioGroup value={resumeMethod} onValueChange={(value) => setResumeMethod(value as 'existing' | 'upload')}>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="existing" id="existing" />
                            <Label htmlFor="existing" className="font-normal cursor-pointer">
                                Use saved resume
                            </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="upload" id="upload" />
                            <Label htmlFor="upload" className="font-normal cursor-pointer">
                                Upload new resume
                            </Label>
                        </div>
                    </RadioGroup>
                )}

                {resumeMethod === 'existing' && resumes.length > 0 ? (
                    <div className="space-y-2">
                        <Select value={selectedResumeId} onValueChange={setSelectedResumeId}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a resume" />
                            </SelectTrigger>
                            <SelectContent>
                                {resumes.map((resume) => (
                                    <SelectItem key={resume.id} value={resume.id}>
                                        <div className="flex items-center gap-2">
                                            <FileText className="w-4 h-4" />
                                            {resume.name}
                                            {resume.isPrimary && (
                                                <span className="text-xs text-muted-foreground">(Primary)</span>
                                            )}
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground">
                            Don't have the right resume?{' '}
                            <Link href="/resume-builder/new" className="text-primary hover:underline">
                                Create a new one
                            </Link>
                        </p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        <Input
                            id="resume"
                            name="resume"
                            type="file"
                            accept=".pdf,.doc,.docx"
                            required={resumeMethod === 'upload'}
                        />
                        <p className="text-xs text-muted-foreground">
                            Maximum file size: 5MB. Or{' '}
                            <Link href="/resume-builder/new" className="text-primary hover:underline">
                                create a resume
                            </Link>
                        </p>
                    </div>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="coverLetter">Cover Letter (Optional)</Label>
                <Textarea
                    id="coverLetter"
                    name="coverLetter"
                    className="min-h-[200px]"
                    placeholder="Tell us why you're a great fit for this position..."
                />
            </div>

            <div className="flex gap-4">
                <Button type="submit" className="flex-1" disabled={isSubmitting}>
                    {isSubmitting ? 'Submitting...' : 'Submit Application'}
                </Button>
                <Button type="button" variant="outline" asChild>
                    <Link href={`/jobs/${jobSlug}`}>Cancel</Link>
                </Button>
            </div>
        </form>
    );
}
