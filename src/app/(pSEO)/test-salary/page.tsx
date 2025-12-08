export default function TestSalaryPage() {
    return (
        <main className="container mx-auto py-10 px-4">
            <h1 className="text-2xl font-bold">Test Salary Page</h1>
            <p>This is a simple static route with NO optional catch-all.</p>
            <p>Time: {new Date().toISOString()}</p>
        </main>
    );
}
