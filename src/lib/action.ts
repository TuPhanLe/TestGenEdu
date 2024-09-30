import { signIn } from "next-auth/react";
import { z } from "zod";
import { useRouter } from "next/router";
import { getAuthSession } from "@/lib/nextauth";

class AuthError extends Error {
  constructor(message: string, public type: string) {
    super(message);
    this.name = "AuthError";
  }
}

const loginSchema = z.object({
  username: z.string(),
  password: z.string(),
});

type LoginFormData = z.infer<typeof loginSchema>;

export async function authenticate(
  prevState: string | undefined,
  formData: FormData
) {
  try {
    const formObject: LoginFormData = {
      username: formData.get("username") as string,
      password: formData.get("password") as string,
    };

    const result = await signIn("credentials", {
      ...formObject,
      redirect: false,
    });

    if (!result?.error) {
      const response = await fetch("/api/user/role", {
        method: "GET", // Sử dụng GET để lấy thông tin
      });

      const userData = await response.json();

      const role = userData.role;

      return { success: true, role: role, message: "Sign in successful!" };
    } else {
      throw new AuthError(result.error, result.error);
    }
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { success: false, message: "Invalid credentials." };
        default:
          return {
            success: false,
            message: "Something went wrong during sign-in.",
          };
      }
    }
    throw error;
  }
}
