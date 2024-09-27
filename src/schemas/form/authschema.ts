import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().nonempty("Username không được để trống"),
  password: z.string().min(8, "Mật khẩu phải có ít nhất 8 ký tự"),
});
