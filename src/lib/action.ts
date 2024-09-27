import { signIn } from "next-auth/react";
import { z } from "zod";
import { useRouter } from "next/router"; // Sử dụng router để định tuyến người dùng

// Định nghĩa lỗi AuthError nếu muốn bắt các lỗi tùy chỉnh
class AuthError extends Error {
  constructor(message: string, public type: string) {
    super(message);
    this.name = "AuthError";
  }
}

// FormData validation schema (nếu cần, dùng zod)
const loginSchema = z.object({
  username: z.string(),
  password: z.string(),
});

type LoginFormData = z.infer<typeof loginSchema>;

export async function authenticate(
  prevState: string | undefined,
  formData: FormData // FormData truyền từ phía client
) {
  try {
    const formObject: LoginFormData = {
      username: formData.get("username") as string,
      password: formData.get("password") as string,
    };

    // Xác thực dữ liệu đầu vào bằng loginSchema
    console.log(formObject);

    const result = await signIn("credentials", {
      ...formObject,
      redirect: false, // Đảm bảo bạn đang kiểm soát luồng logic điều hướng
    });

    // Nếu đăng nhập thành công
    if (!result?.error) {
      return { success: true, message: "Sign in successful!" };
    } else {
      // Nếu có lỗi đăng nhập
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
    throw error; // Ném lại lỗi nếu có
  }
}
