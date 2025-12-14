'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    FileText,
    Download,
    Edit,
    Trash2,
    Star,
    MoreVertical,
    Eye,
    Share2,
    Calendar
} from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { formatDistanceToNow } from 'date-fns';

interface ResumeCardProps {
    resume: {
        id: string;
        name: string;
        professionSlug: string | null;
        templateId: string;
        isPrimary: boolean;
        isPublic: boolean;
        viewCount: number;
        downloadCount: number;
        pdfUrl: string | null;
        createdAt: Date;
        updatedAt: Date;
        _count: {
            applications: number;
        };
    };
}

export function ResumeCard({ resume }: ResumeCardProps) {
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this resume?')) return;

        setIsDeleting(true);
        try {
            const response = await fetch(`/api/resumes/${resume.id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                router.refresh();
            } else {
                alert('Failed to delete resume');
            }
        } catch (error) {
            console.error('Error deleting resume:', error);
            alert('Failed to delete resume');
        } finally {
            setIsDeleting(false);
        }
    };

    const handleSetPrimary = async () => {
        try {
            const response = await fetch(`/api/resumes/${resume.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isPrimary: true }),
            });

            if (response.ok) {
                router.refresh();
            } else {
                alert('Failed to set as primary');
            }
        } catch (error) {
            console.error('Error setting primary:', error);
            alert('Failed to set as primary');
        }
    };

    const handleDownload = async () => {
        try {
            const response = await fetch(`/api/resumes/${resume.id}/pdf`);

            if (!response.ok) {
                alert('Failed to generate PDF');
                return;
            }

            // Get the PDF blob
            const blob = await response.blob();

            // Create download link
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${resume.name.toLowerCase().replace(/\s+/g, '-')}.pdf`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);

            // Refresh to update download count
            router.refresh();
        } catch (error) {
            console.error('Error downloading PDF:', error);
            alert('Failed to download PDF');
        }
    };

    return (
        <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <CardTitle className="flex items-center gap-2">
                            <FileText className="w-5 h-5" />
                            {resume.name}
                            {resume.isPrimary && (
                                <Badge variant="default" className="gap-1">
                                    <Star className="w-3 h-3 fill-current" />
                                    Primary
                                </Badge>
                            )}
                        </CardTitle>
                        <CardDescription className="mt-2">
                            Template: {resume.templateId}
                            {resume.professionSlug && ` • ${resume.professionSlug}`}
                        </CardDescription>
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <MoreVertical className="w-4 h-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => router.push(`/resume-builder/${resume.id}/edit`)}>
                                <Edit className="w-4 h-4 mr-2" />
                                Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => router.push(`/resume-builder/${resume.id}/preview`)}>
                                <Eye className="w-4 h-4 mr-2" />
                                Preview
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={handleDownload}>
                                <Download className="w-4 h-4 mr-2" />
                                Download PDF
                            </DropdownMenuItem>
                            {!resume.isPrimary && (
                                <DropdownMenuItem onClick={handleSetPrimary}>
                                    <Star className="w-4 h-4 mr-2" />
                                    Set as Primary
                                </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={handleDelete}
                                disabled={isDeleting}
                                className="text-destructive"
                            >
                                <Trash2 className="w-4 h-4 mr-2" />
                                {isDeleting ? 'Deleting...' : 'Delete'}
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </CardHeader>

            <CardContent>
                <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                        <div className="text-muted-foreground">Applications</div>
                        <div className="font-semibold">{resume._count.applications}</div>
                    </div>
                    <div>
                        <div className="text-muted-foreground">Views</div>
                        <div className="font-semibold">{resume.viewCount}</div>
                    </div>
                    <div>
                        <div className="text-muted-foreground">Downloads</div>
                        <div className="font-semibold">{resume.downloadCount}</div>
                    </div>
                </div>
            </CardContent>

            <CardFooter className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Updated {formatDistanceToNow(new Date(resume.updatedAt), { addSuffix: true })}
                </div>
                {resume.isPublic && (
                    <Badge variant="outline" className="gap-1">
                        <Share2 className="w-3 h-3" />
                        Public
                    </Badge>
                )}
            </CardFooter>
        </Card>
    );
}
