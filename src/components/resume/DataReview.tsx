'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface DataReviewProps {
    title: string;
    description: string;
    items: any[];
    selectedIds: string[];
    onSelectionChange: (ids: string[]) => void;
    renderItem: (item: any) => React.ReactNode;
}

export function DataReview({
    title,
    description,
    items,
    selectedIds,
    onSelectionChange,
    renderItem,
}: DataReviewProps) {
    const handleToggle = (itemId: string) => {
        if (selectedIds.includes(itemId)) {
            onSelectionChange(selectedIds.filter(id => id !== itemId));
        } else {
            onSelectionChange([...selectedIds, itemId]);
        }
    };

    const handleSelectAll = () => {
        if (selectedIds.length === items.length) {
            onSelectionChange([]);
        } else {
            onSelectionChange(items.map(item => item.id));
        }
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>{title}</CardTitle>
                        <CardDescription>{description}</CardDescription>
                    </div>
                    <button
                        onClick={handleSelectAll}
                        className="text-sm text-primary hover:underline"
                    >
                        {selectedIds.length === items.length ? 'Deselect All' : 'Select All'}
                    </button>
                </div>
            </CardHeader>
            <CardContent>
                {items.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                        <p>No items found. Add them to your profile first.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {items.map((item) => (
                            <div
                                key={item.id}
                                className="flex items-start gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                            >
                                <Checkbox
                                    id={item.id}
                                    checked={selectedIds.includes(item.id)}
                                    onCheckedChange={() => handleToggle(item.id)}
                                    className="mt-1"
                                />
                                <Label
                                    htmlFor={item.id}
                                    className="flex-1 cursor-pointer"
                                >
                                    {renderItem(item)}
                                </Label>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
