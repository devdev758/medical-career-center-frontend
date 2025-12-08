import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { getProfile, updateProfile } from "@/lib/actions/profile";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function EditProfilePage() {
    const session = await auth();

    if (!session?.user) {
        redirect("/login?callbackUrl=/dashboard/profile/edit");
    }

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { role: true },
    });

    if (user?.role === "EMPLOYER") {
        redirect("/employer/company");
    }

    const profile = await getProfile().catch(() => null);

    async function handleSubmit(formData: FormData) {
        "use server";

        const jobTypes = formData.getAll("jobTypes") as string[];

        await updateProfile({
            // Personal Information
            firstName: formData.get("firstName") as string,
            lastName: formData.get("lastName") as string,
            dateOfBirth: formData.get("dateOfBirth") ? new Date(formData.get("dateOfBirth") as string) : null,
            gender: formData.get("gender") as string,
            address: formData.get("address") as string,
            city: formData.get("city") as string,
            state: formData.get("state") as string,
            zipCode: formData.get("zipCode") as string,
            country: formData.get("country") as string,

            // Professional Information
            headline: formData.get("headline") as string,
            bio: formData.get("bio") as string,
            phone: formData.get("phone") as string,
            location: formData.get("location") as string,
            website: formData.get("website") as string,
            linkedIn: formData.get("linkedIn") as string,

            // Medical-Specific Fields
            licenseNumber: formData.get("licenseNumber") as string,
            licenseState: formData.get("licenseState") as string,
            licenseExpiry: formData.get("licenseExpiry") ? new Date(formData.get("licenseExpiry") as string) : null,
            npiNumber: formData.get("npiNumber") as string,
            specialization: formData.get("specialization") as string,
            yearsOfExperience: formData.get("yearsOfExperience") ? parseInt(formData.get("yearsOfExperience") as string) : null,

            // Job Preferences
            jobTypes,
            desiredSalary: formData.get("desiredSalary") as string,
            willingToRelocate: formData.get("willingToRelocate") === "on",
            availableFrom: formData.get("availableFrom") ? new Date(formData.get("availableFrom") as string) : null,
            isPublic: formData.get("isPublic") === "on",
        });

        redirect("/dashboard/profile");
    }

    return (
        <main className="container mx-auto py-10 px-4 max-w-4xl">
            <Link href="/dashboard/profile" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6">
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back to Profile
            </Link>

            <div className="mb-8">
                <h1 className="text-4xl font-bold mb-2">Edit Profile</h1>
                <p className="text-muted-foreground">
                    Update your professional information
                </p>
            </div>

            <form action={handleSubmit} className="space-y-6">
                {/* Personal Information */}
                <Card>
                    <CardHeader>
                        <CardTitle>Personal Information</CardTitle>
                        <CardDescription>
                            Your basic personal details
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="firstName">First Name *</Label>
                                <Input
                                    id="firstName"
                                    name="firstName"
                                    placeholder="John"
                                    defaultValue={profile?.firstName || ""}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="middleName">Middle Initial</Label>
                                <Input
                                    id="middleName"
                                    name="middleName"
                                    placeholder="M"
                                    maxLength={1}
                                    defaultValue={profile?.middleName || ""}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="lastName">Last Name *</Label>
                                <Input
                                    id="lastName"
                                    name="lastName"
                                    placeholder="Doe"
                                    defaultValue={profile?.lastName || ""}
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                                <Input
                                    id="dateOfBirth"
                                    name="dateOfBirth"
                                    type="date"
                                    defaultValue={profile?.dateOfBirth ? new Date(profile.dateOfBirth).toISOString().split('T')[0] : ""}
                                />
                                <p className="text-xs text-muted-foreground">Format: MM/DD/YYYY</p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="gender">Gender</Label>
                                <Select name="gender" defaultValue={profile?.gender || ""}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select gender" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Male">Male</SelectItem>
                                        <SelectItem value="Female">Female</SelectItem>
                                        <SelectItem value="Non-binary">Non-binary</SelectItem>
                                        <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="address">Street Address *</Label>
                            <Input
                                id="address"
                                name="address"
                                placeholder="123 Main Street"
                                defaultValue={profile?.address || ""}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="address2">Apartment, Suite, Unit, etc.</Label>
                            <Input
                                id="address2"
                                name="address2"
                                placeholder="Apt 4B"
                                defaultValue={profile?.address2 || ""}
                            />
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="city">City *</Label>
                                <Input
                                    id="city"
                                    name="city"
                                    placeholder="New York"
                                    defaultValue={profile?.city || ""}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="state">State *</Label>
                                <Select name="state" defaultValue={profile?.state || ""} required>
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
                                <Label htmlFor="zipCode">ZIP Code *</Label>
                                <Input
                                    id="zipCode"
                                    name="zipCode"
                                    placeholder="10001"
                                    pattern="[0-9]{5}"
                                    maxLength={5}
                                    defaultValue={profile?.zipCode || ""}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number *</Label>
                            <Input
                                id="phone"
                                name="phone"
                                type="tel"
                                placeholder="(555) 123-4567"
                                pattern="[\(]?[0-9]{3}[\)]?[\s\-]?[0-9]{3}[\s\-]?[0-9]{4}"
                                defaultValue={profile?.phone || ""}
                                required
                            />
                            <p className="text-xs text-muted-foreground">Format: (555) 123-4567</p>
                        </div>
                    </CardContent>
                </Card>

                {/* Professional Information */}
                <Card>
                    <CardHeader>
                        <CardTitle>Professional Information</CardTitle>
                        <CardDescription>
                            Tell employers about your professional background
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="headline">Professional Headline *</Label>
                            <Input
                                id="headline"
                                name="headline"
                                placeholder="e.g., Registered Nurse with 5 years of ICU experience"
                                defaultValue={profile?.headline || ""}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="bio">Professional Summary</Label>
                            <Textarea
                                id="bio"
                                name="bio"
                                placeholder="Tell us about your background, experience, and career goals..."
                                rows={6}
                                defaultValue={profile?.bio || ""}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="location">Preferred Work Location</Label>
                                <Input
                                    id="location"
                                    name="location"
                                    placeholder="City, State"
                                    defaultValue={profile?.location || ""}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="yearsOfExperience">Years of Experience</Label>
                                <Input
                                    id="yearsOfExperience"
                                    name="yearsOfExperience"
                                    type="number"
                                    min="0"
                                    placeholder="5"
                                    defaultValue={profile?.yearsOfExperience || ""}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="website">Website</Label>
                                <Input
                                    id="website"
                                    name="website"
                                    type="url"
                                    placeholder="https://yourwebsite.com"
                                    defaultValue={profile?.website || ""}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="linkedIn">LinkedIn Profile</Label>
                                <Input
                                    id="linkedIn"
                                    name="linkedIn"
                                    type="url"
                                    placeholder="https://linkedin.com/in/yourprofile"
                                    defaultValue={profile?.linkedIn || ""}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Medical-Specific Information */}
                <Card>
                    <CardHeader>
                        <CardTitle>Medical Credentials</CardTitle>
                        <CardDescription>
                            Your medical licenses and certifications
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="licenseNumber">License Number</Label>
                                <Input
                                    id="licenseNumber"
                                    name="licenseNumber"
                                    placeholder="e.g., RN123456"
                                    defaultValue={profile?.licenseNumber || ""}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="licenseState">License State</Label>
                                <Input
                                    id="licenseState"
                                    name="licenseState"
                                    placeholder="e.g., CA"
                                    defaultValue={profile?.licenseState || ""}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="licenseExpiry">License Expiry Date</Label>
                                <Input
                                    id="licenseExpiry"
                                    name="licenseExpiry"
                                    type="date"
                                    defaultValue={profile?.licenseExpiry ? new Date(profile.licenseExpiry).toISOString().split('T')[0] : ""}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="npiNumber">NPI Number</Label>
                                <Input
                                    id="npiNumber"
                                    name="npiNumber"
                                    placeholder="10-digit NPI"
                                    defaultValue={profile?.npiNumber || ""}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="specialization">Specialization</Label>
                            <Input
                                id="specialization"
                                name="specialization"
                                placeholder="e.g., Critical Care, Pediatrics"
                                defaultValue={profile?.specialization || ""}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Job Preferences */}
                <Card>
                    <CardHeader>
                        <CardTitle>Job Preferences</CardTitle>
                        <CardDescription>
                            Help us match you with the right opportunities
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>Preferred Job Types</Label>
                            <div className="grid grid-cols-2 gap-2">
                                {["FULL_TIME", "PART_TIME", "CONTRACT", "INTERNSHIP"].map((type) => (
                                    <div key={type} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={type}
                                            name="jobTypes"
                                            value={type}
                                            defaultChecked={profile?.jobTypes?.includes(type)}
                                        />
                                        <label htmlFor={type} className="text-sm">
                                            {type.replace("_", " ")}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="desiredSalary">Desired Salary Range</Label>
                                <Input
                                    id="desiredSalary"
                                    name="desiredSalary"
                                    placeholder="e.g., $60,000 - $80,000"
                                    defaultValue={profile?.desiredSalary || ""}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="availableFrom">Available From</Label>
                                <Input
                                    id="availableFrom"
                                    name="availableFrom"
                                    type="date"
                                    defaultValue={profile?.availableFrom ? new Date(profile.availableFrom).toISOString().split('T')[0] : ""}
                                />
                            </div>
                        </div>

                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="willingToRelocate"
                                name="willingToRelocate"
                                defaultChecked={profile?.willingToRelocate}
                            />
                            <label htmlFor="willingToRelocate" className="text-sm">
                                Willing to relocate
                            </label>
                        </div>

                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="isPublic"
                                name="isPublic"
                                defaultChecked={profile?.isPublic}
                            />
                            <label htmlFor="isPublic" className="text-sm">
                                Make my profile public (visible to employers)
                            </label>
                        </div>
                    </CardContent>
                </Card>

                <div className="flex gap-4">
                    <Button type="submit">Save Changes</Button>
                    <Button type="button" variant="outline" asChild>
                        <Link href="/dashboard/profile">Cancel</Link>
                    </Button>
                </div>
            </form>
        </main>
    );
}
