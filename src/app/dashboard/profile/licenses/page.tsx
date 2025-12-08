"use client";

import { useState, useEffect } from "react";
import { getLicenses, createLicense, deleteLicense } from "@/lib/actions/profile";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { ArrowLeft, X, Plus, Shield } from "lucide-react";

export default function LicensesPage() {
    const [licenses, setLicenses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [adding, setAdding] = useState(false);

    useEffect(() => {
        loadLicenses();
    }, []);

    async function loadLicenses() {
        try {
            const data = await getLicenses();
            setLicenses(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    async function handleAddLicense(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setAdding(true);

        const formData = new FormData(e.currentTarget);

        try {
            await createLicense({
                licenseType: formData.get("licenseType") as string,
                licenseNumber: formData.get("licenseNumber") as string,
                state: formData.get("state") as string,
                issueDate: new Date(formData.get("issueDate") as string),
                expiryDate: formData.get("expiryDate") ? new Date(formData.get("expiryDate") as string) : undefined,
                status: formData.get("status") as string || "ACTIVE",
            });

            await loadLicenses();
            (e.target as HTMLFormElement).reset();
        } catch (error) {
            console.error(error);
            alert("Failed to add license");
        } finally {
            setAdding(false);
        }
    }

    async function handleDeleteLicense(id: string) {
        if (!confirm("Remove this license?")) return;

        try {
            await deleteLicense(id);
            await loadLicenses();
        } catch (error) {
            console.error(error);
            alert("Failed to delete license");
        }
    }

    return (
        <main className="container mx-auto py-10 px-4 max-w-3xl">
            <Link href="/dashboard/profile" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6">
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back to Profile
            </Link>

            <div className="mb-8">
                <h1 className="text-4xl font-bold mb-2">Medical Licenses</h1>
                <p className="text-muted-foreground">
                    Manage your state medical licenses
                </p>
            </div>

            <Card className="mb-6">
                <CardHeader>
                    <CardTitle>Add New License</CardTitle>
                    <CardDescription>
                        Add licenses from different states
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleAddLicense} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="licenseType">License Type *</Label>
                                <Select name="licenseType" required>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="RN">Registered Nurse (RN)</SelectItem>
                                        <SelectItem value="LPN">Licensed Practical Nurse (LPN)</SelectItem>
                                        <SelectItem value="NP">Nurse Practitioner (NP)</SelectItem>
                                        <SelectItem value="MD">Medical Doctor (MD)</SelectItem>
                                        <SelectItem value="DO">Doctor of Osteopathy (DO)</SelectItem>
                                        <SelectItem value="PA">Physician Assistant (PA)</SelectItem>
                                        <SelectItem value="CNA">Certified Nursing Assistant (CNA)</SelectItem>
                                        <SelectItem value="Other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="licenseNumber">License Number *</Label>
                                <Input
                                    id="licenseNumber"
                                    name="licenseNumber"
                                    placeholder="e.g., RN123456"
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="state">State *</Label>
                                <Select name="state" required>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select state" />
                                    </SelectTrigger>
                                    <SelectContent className="max-h-[200px]">
                                        <SelectItem value="AL">Alabama</SelectItem>
                                        <SelectItem value="AK">Alaska</SelectItem>
                                        <SelectItem value="AZ">Arizona</SelectItem>
                                        <SelectItem value="AR">Arkansas</SelectItem>
                                        <SelectItem value="CA">California</SelectItem>
                                        <SelectItem value="CO">Colorado</SelectItem>
                                        <SelectItem value="CT">Connecticut</SelectItem>
                                        <SelectItem value="DE">Delaware</SelectItem>
                                        <SelectItem value="FL">Florida</SelectItem>
                                        <SelectItem value="GA">Georgia</SelectItem>
                                        <SelectItem value="HI">Hawaii</SelectItem>
                                        <SelectItem value="ID">Idaho</SelectItem>
                                        <SelectItem value="IL">Illinois</SelectItem>
                                        <SelectItem value="IN">Indiana</SelectItem>
                                        <SelectItem value="IA">Iowa</SelectItem>
                                        <SelectItem value="KS">Kansas</SelectItem>
                                        <SelectItem value="KY">Kentucky</SelectItem>
                                        <SelectItem value="LA">Louisiana</SelectItem>
                                        <SelectItem value="ME">Maine</SelectItem>
                                        <SelectItem value="MD">Maryland</SelectItem>
                                        <SelectItem value="MA">Massachusetts</SelectItem>
                                        <SelectItem value="MI">Michigan</SelectItem>
                                        <SelectItem value="MN">Minnesota</SelectItem>
                                        <SelectItem value="MS">Mississippi</SelectItem>
                                        <SelectItem value="MO">Missouri</SelectItem>
                                        <SelectItem value="MT">Montana</SelectItem>
                                        <SelectItem value="NE">Nebraska</SelectItem>
                                        <SelectItem value="NV">Nevada</SelectItem>
                                        <SelectItem value="NH">New Hampshire</SelectItem>
                                        <SelectItem value="NJ">New Jersey</SelectItem>
                                        <SelectItem value="NM">New Mexico</SelectItem>
                                        <SelectItem value="NY">New York</SelectItem>
                                        <SelectItem value="NC">North Carolina</SelectItem>
                                        <SelectItem value="ND">North Dakota</SelectItem>
                                        <SelectItem value="OH">Ohio</SelectItem>
                                        <SelectItem value="OK">Oklahoma</SelectItem>
                                        <SelectItem value="OR">Oregon</SelectItem>
                                        <SelectItem value="PA">Pennsylvania</SelectItem>
                                        <SelectItem value="RI">Rhode Island</SelectItem>
                                        <SelectItem value="SC">South Carolina</SelectItem>
                                        <SelectItem value="SD">South Dakota</SelectItem>
                                        <SelectItem value="TN">Tennessee</SelectItem>
                                        <SelectItem value="TX">Texas</SelectItem>
                                        <SelectItem value="UT">Utah</SelectItem>
                                        <SelectItem value="VT">Vermont</SelectItem>
                                        <SelectItem value="VA">Virginia</SelectItem>
                                        <SelectItem value="WA">Washington</SelectItem>
                                        <SelectItem value="WV">West Virginia</SelectItem>
                                        <SelectItem value="WI">Wisconsin</SelectItem>
                                        <SelectItem value="WY">Wyoming</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="status">Status</Label>
                                <Select name="status" defaultValue="ACTIVE">
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="ACTIVE">Active</SelectItem>
                                        <SelectItem value="EXPIRED">Expired</SelectItem>
                                        <SelectItem value="SUSPENDED">Suspended</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="issueDate">Issue Date *</Label>
                                <Input
                                    id="issueDate"
                                    name="issueDate"
                                    type="text"
                                    placeholder="MM/DD/YYYY"
                                    pattern="(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="expiryDate">Expiry Date</Label>
                                <Input
                                    id="expiryDate"
                                    name="expiryDate"
                                    type="text"
                                    placeholder="MM/DD/YYYY"
                                    pattern="(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}"
                                />
                            </div>
                        </div>

                        <Button type="submit" disabled={adding}>
                            <Plus className="w-4 h-4 mr-2" />
                            {adding ? "Adding..." : "Add License"}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Your Licenses ({licenses.length})</CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <p className="text-sm text-muted-foreground">Loading...</p>
                    ) : licenses.length > 0 ? (
                        <div className="space-y-4">
                            {licenses.map((license) => {
                                const isExpired = license.expiryDate && new Date(license.expiryDate) < new Date();
                                const statusColor = license.status === "ACTIVE" ? "default" : license.status === "EXPIRED" ? "destructive" : "secondary";

                                return (
                                    <div key={license.id} className="border rounded-lg p-4">
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <Shield className="w-4 h-4 text-muted-foreground" />
                                                    <h3 className="font-semibold">{license.licenseType} - {license.state}</h3>
                                                    <Badge variant={statusColor as any}>{license.status}</Badge>
                                                    {isExpired && license.status === "ACTIVE" && (
                                                        <Badge variant="destructive">Expired</Badge>
                                                    )}
                                                </div>
                                                <p className="text-sm text-muted-foreground">License #: {license.licenseNumber}</p>
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    Issued: {new Date(license.issueDate).toLocaleDateString('en-US')}
                                                    {license.expiryDate && (
                                                        <> • Expires: {new Date(license.expiryDate).toLocaleDateString('en-US')}</>
                                                    )}
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => handleDeleteLicense(license.id)}
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
                        <p className="text-sm text-muted-foreground">No licenses added yet</p>
                    )}
                </CardContent>
            </Card>
        </main>
    );
}
