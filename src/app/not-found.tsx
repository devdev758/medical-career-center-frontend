import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { FileQuestion } from 'lucide-react'

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
            <FileQuestion className="w-24 h-24 text-muted-foreground mb-6" />
            <h2 className="text-3xl font-bold mb-4">Page Not Found</h2>
            <p className="text-muted-foreground mb-8 max-w-md">
                We couldn't find the page you were looking for. It might have been moved, deleted, or the data hasn't been imported yet.
            </p>
            <Button asChild>
                <Link href="/">Return Home</Link>
            </Button>
        </div>
    )
}
