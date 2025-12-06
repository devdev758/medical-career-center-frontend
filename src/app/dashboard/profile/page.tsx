import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function ProfilePage() {
    const session = await auth();

    if (!session?.user) {
        redirect("/login?callbackUrl=/dashboard/profile");
    }

    async function updateProfile(formData: FormData) {
        "use server";
        const name = formData.get
