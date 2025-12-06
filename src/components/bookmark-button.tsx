"use client";

import { useState } from "react";
import { Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { saveJob, unsaveJob } from "@/lib/actions/saved-jobs";

interface BookmarkButtonProps {
    jobId: string;
    initialSaved: boolean;
    isLoggedIn: boolean;
}

export function BookmarkButton({ jobId, initialSaved, isLoggedIn }: BookmarkButtonProps) {
    const [isSaved, setIsSaved] = useState(initialSaved);
    const [isLoading, setIsLoading] = useState(false);

    async function handleToggle() {
        if (!isLoggedIn) {
            alert("Please sign in to save jobs");
            return;
        }

        setIsLoading(true);
        try {
            if (isSaved) {
                await unsaveJob(jobId);
                setIsSaved(false);
            } else {
                await saveJob(jobId);
                setIsSaved(true);
            }
        } catch (error) {
            console.error("Failed to toggle save:", error);
            alert("Failed to save job. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={handleToggle}
            disabled={isLoading}
            title={isSaved ? "Unsave job" : "Save job"}
        >
            <Bookmark
                className={`w-5 h-5 ${isSaved ? "fill-current" : ""}`}
            />
        </Button>
    );
}
