import { Metadata } from "next";

interface PageProps {
    params: {
        career: string;
        location?: string[];
    };
}

export const metadata: Metadata = {
    title: "Debug Mode",
    description: "Debug mode for salary page",
};

export default async function SalaryPage({ params }: PageProps) {
    console.log("SalaryPage: Rendering started", params);
    const { career, location } = params;

    return (
        <main className="container mx-auto py-10 px-4">
            <h1 className="text-2xl font-bold">Debug Mode</h1>
            <p>Career: {career}</p>
            <p>Location: {location?.join(", ") || "None"}</p>
            <p>Time: {new Date().toISOString()}</p>
        </main>
    );
}
