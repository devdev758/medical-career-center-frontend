'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Sparkles } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

interface AIAssistantProps {
    type: 'summary' | 'bulletPoints' | 'skills';
    data: any;
    onApply: (suggestion: string) => void;
    buttonText?: string;
}

export function AIAssistant({ type, data, onApply, buttonText }: AIAssistantProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [suggestion, setSuggestion] = useState('');

    const handleGenerate = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/resumes/ai-suggestions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type, data }),
            });

            if (!response.ok) {
                throw new Error('Failed to generate suggestion');
            }

            const result = await response.json();
            setSuggestion(result.suggestion);
        } catch (error) {
            console.error('Error generating suggestion:', error);
            alert('Failed to generate AI suggestion. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleApply = () => {
        onApply(suggestion);
        setIsOpen(false);
        setSuggestion('');
    };

    const getTitle = () => {
        switch (type) {
            case 'summary':
                return 'AI-Generated Professional Summary';
            case 'bulletPoints':
                return 'AI-Enhanced Bullet Points';
            case 'skills':
                return 'AI-Recommended Skills';
            default:
                return 'AI Suggestion';
        }
    };

    const getDescription = () => {
        switch (type) {
            case 'summary':
                return 'Our AI will analyze your experience and generate a compelling professional summary.';
            case 'bulletPoints':
                return 'Our AI will enhance your job description with strong action verbs and quantifiable results.';
            case 'skills':
                return 'Our AI will recommend relevant skills based on your profession and experience.';
            default:
                return 'Get AI-powered suggestions to improve your resume.';
        }
    };

    return (
        <>
            <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                    setIsOpen(true);
                    if (!suggestion) {
                        handleGenerate();
                    }
                }}
                className="gap-2"
            >
                <Sparkles className="w-4 h-4" />
                {buttonText || 'AI Suggest'}
            </Button>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>{getTitle()}</DialogTitle>
                        <DialogDescription>{getDescription()}</DialogDescription>
                    </DialogHeader>

                    <div className="py-4">
                        {isLoading ? (
                            <div className="flex items-center justify-center py-12">
                                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                                <span className="ml-3 text-muted-foreground">Generating suggestion...</span>
                            </div>
                        ) : suggestion ? (
                            <div>
                                <Textarea
                                    value={suggestion}
                                    onChange={(e) => setSuggestion(e.target.value)}
                                    rows={10}
                                    className="font-mono text-sm"
                                />
                                <p className="text-sm text-muted-foreground mt-2">
                                    You can edit the suggestion above before applying it.
                                </p>
                            </div>
                        ) : null}
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsOpen(false)}>
                            Cancel
                        </Button>
                        {suggestion && !isLoading && (
                            <>
                                <Button variant="outline" onClick={handleGenerate}>
                                    Regenerate
                                </Button>
                                <Button onClick={handleApply}>
                                    Apply Suggestion
                                </Button>
                            </>
                        )}
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
