"use server";

import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { prisma } from "@/lib/prisma";

export async function authenticate(
    prevState: string | undefined,
    formData: FormData,
) {
    try {
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;
        let callbackUrl = formData.get("callbackUrl") as string;

        // If no callback URL, determine based on user role
        if (!callbackUrl || callbackUrl === "/dashboard") {
            const user = await prisma.user.findUnique({
                where: { email },
                select: { role: true },
            });

            if (user?.role === "EMPLOYER") {
                callbackUrl = "/employer/dashboard";
            } else {
                callbackUrl = "/dashboard";
            }
        }

        await signIn("credentials", {
            redirect: true,
            redirectTo: callbackUrl,
            email,
            password,
        });
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return "Invalid credentials.";
                default:
                    return "Something went wrong.";
            }
        }
        throw error;
    }
}
