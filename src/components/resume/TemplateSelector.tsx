'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Check } from 'lucide-react';

const TEMPLATES = [
    {
        id: 'professional',
        name: 'Professional',
        description: 'Clean and traditional layout perfect for medical professionals',
        preview: '/templates/professional.png',
    },
    {
        id: 'modern',
        name: 'Modern',
        description: 'Contemporary design with accent colors',
        preview: '/templates/modern.png',
    },
    {
        id: 'minimal',
        name: 'Minimal',
        description: 'Simple and elegant, focuses on content',
        preview: '/templates/minimal.png',
    },
    {
        id: 'medical',
        name: 'Medical',
        description: 'Specifically designed for healthcare careers',
        preview: '/templates/medical.png',
    },
];

interface TemplateSelectorProps {
    selectedTemplate: string;
    onSelect: (templateId: string) => void;
}

export function TemplateSelector({ selectedTemplate, onSelect }: TemplateSelectorProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {TEMPLATES.map((template) => (
                <Card
                    key={template.id}
                    className={`cursor-pointer transition-all ${selectedTemplate === template.id
                            ? 'ring-2 ring-primary shadow-lg'
                            : 'hover:shadow-md'
                        }`}
                    onClick={() => onSelect(template.id)}
                >
                    <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                            <div>
                                <h4 className="font-semibold">{template.name}</h4>
                                <p className="text-sm text-muted-foreground mt-1">
                                    {template.description}
                                </p>
                            </div>
                            {selectedTemplate === template.id && (
                                <div className="bg-primary text-primary-foreground rounded-full p-1">
                                    <Check className="w-4 h-4" />
                                </div>
                            )}
                        </div>

                        {/* Template Preview Placeholder */}
                        <div className="aspect-[8.5/11] bg-muted rounded border flex items-center justify-center">
                            <div className="text-center text-muted-foreground">
                                <div className="text-4xl mb-2">📄</div>
                                <div className="text-sm">{template.name} Template</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
