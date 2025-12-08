"use client";

import { useState, useEffect } from "react";
import { getCertifications, createCertification, deleteCertification } from "@/lib/actions/profile";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ArrowLeft, X, Plus, Award } from "lucide-react";

export default function CertificationsPage() {
    const [certifications, setCertifications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [adding, setAdding] = useState(false);

    useEffect(() => {
        loadCertifications();
    }, []);

    async function loadCertifications() {
        try {
            const data = await getCertifications();
            setCertifications(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    async function handleAddCertification(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setAdding(true);

        const formData = new FormData(e.currentTarget);

        try {
            await createCertification({
                name: formData.get("name") as string,
                issuingOrg: formData.get("issuingOrg") as string,
                issueDate: new Date(formData.get("issueDate") as string),
                expiryDate: formData.get("expiryDate") ? new Date(formData.get("expiryDate") as string) : undefined,
                credentialId: formData.get("credentialId") as string || undefined,
                credentialUrl: formData.get("credentialUrl") as string || undefined,
            });

            await loadCertifications();
            (e.target as HTMLFormElement).reset();
        } catch (error) {
            console.error(error);
            alert("Failed to add certification");
        } finally {
            setAdding(false);
        }
    }

    async function handleDeleteCertification(id: string) {
        if (!confirm("Remove this certification?")) return;

        try {
            await deleteCertification(id);
            await loadCertifications();
        } catch (error) {
            console.error(error);
            alert("Failed to delete certification");
        }
    }

    return (
        <main className="container mx-auto py-10 px-4 max-w-3xl">
            <Link href="/dashboard/profile" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6">
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back to Profile
            </Link>

            <div className="mb-8">
                <h1 className="text-4xl font-bold mb-2">Certifications & Licenses</h1>
                <p className="text-muted-foreground">
                    Add your professional certifications and licenses
                </p>
            </div>

            <Card className="mb-6">
                <CardHeader>
                    <CardTitle>Add New Certification</CardTitle>
                    <CardDescription>
                        Add certifications relevant to your medical profession
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleAddCertification} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Certification Name *</Label>
                            <Input
                                id="name"
                                name="name"
                                placeholder="e.g., BLS Certification"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="issuingOrg">Issuing Organization *</Label>
                            <Input
                                id="issuingOrg"
                                name="issuingOrg"
                                placeholder="e.g., American Heart Association"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="issueDate">Issue Date *</Label>
                                <Input
                                    id="issueDate"
                                    name="issueDate"
                                    type="month"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="expiryDate">Expiry Date</Label>
                                <Input
                                    id="expiryDate"
                                    name="expiryDate"
                                    type="month"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="credentialId">Credential ID</Label>
                                <Input
                                    id="credentialId"
                                    name="credentialId"
                                    placeholder="Optional"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="credentialUrl">Credential URL</Label>
                                <Input
                                    id="credentialUrl"
                                    name="credentialUrl"
                                    type="url"
                                    placeholder="https://..."
                                />
                            </div>
                        </div>

                        <Button type="submit" disabled={adding}>
                            <Plus className="w-4 h-4 mr-2" />
                            {adding ? "Adding..." : "Add Certification"}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Your Certifications ({certifications.length})</CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <p className="text-sm text-muted-foreground">Loading...</p>
                    ) : certifications.length > 0 ? (
                        <div className="space-y-4">
                            {certifications.map((cert) => {
                                const isExpired = cert.expiryDate && new Date(cert.expiryDate) < new Date();
                                return (
                                    <div key={cert.id} className="border rounded-lg p-4">
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <Award className="w-4 h-4 text-muted-foreground" />
                                                    <h3 className="font-semibold">{cert.name}</h3>
                                                    {isExpired && (
                                                        <Badge variant="destructive">Expired</Badge>
                                                    )}
                                                </div>
                                                <p className="text-sm text-muted-foreground">{cert.issuingOrg}</p>
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    Issued: {new Date(cert.issueDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                                                    {cert.expiryDate && (
                                                        <> • Expires: {new Date(cert.expiryDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</>
                                                    )}
                                                </p>
                                                {cert.credentialId && (
                                                    <p className="text-xs text-muted-foreground">ID: {cert.credentialId}</p>
                                                )}
                                                {cert.credentialUrl && (
                                                    <a href={cert.credentialUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline">
                                                        View Credential
                                                    </a>
                                                )}
                                            </div>
                                            <button
                                                onClick={() => handleDeleteCertification(cert.id)}
                                                className="text-muted-foreground hover:text-destructive"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <p className="text-sm text-muted-foreground">No certifications added yet</p>
                    )}
                </CardContent>
            </Card>
        </main>
    );
}
