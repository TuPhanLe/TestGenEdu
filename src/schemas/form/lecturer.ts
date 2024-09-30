import { z } from "zod";

export const lecturerSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Name must be at least 1 character long" }),
  userName: z
    .string()
    .min(1, { message: "User Name must be at least 1 character long" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 character long" }),
  email: z.string().optional(),
  status: z.string(),
});
