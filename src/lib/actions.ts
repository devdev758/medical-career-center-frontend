"use server";

import { signIn } from "@/auth";
import { AuthError } from "next-auth";

export async function authenticate(
    prevState: string | undefined,
    formData: FormData,
) {
    try {
        const callbackUrl = formData.get("callbackUrl") as string || "/dashboard";

        await signIn("credentials", {
            redirect: true,
            redirectTo: callbackUrl,
            email: formData.get("email") as string,
            password: formData.get("password") as string,
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
