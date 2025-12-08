export default function LocationSalaryPage({ params }: { params: { career: string; location: string } }) {
    const { career, location } = params;

    return (
        <main className="container mx-auto py-10 px-4">
            <h1 className="text-2xl font-bold">Location Salary Page (Minimal Test)</h1>
            <p>Career: {career}</p>
            <p>Location: {location}</p>
            <p>This page works because it has NO async, NO database, NO metadata.</p>
            <p>Time: {new Date().toISOString()}</p>
        </main>
    );
}
