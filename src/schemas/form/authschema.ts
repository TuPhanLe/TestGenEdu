import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().nonempty("Username cannot be left empty"),
  password: z.string().min(8, "The password must be at least 8 characters"),
});
