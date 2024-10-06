"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginSchema } from "@/schemas/form/authschema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState, useTransition } from "react";
import { authenticate } from "@/lib/action";
import { useRouter } from "next/navigation";
import { UserRole } from "@prisma/client";

export function LoginForm() {
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();

  type LoginFormData = z.infer<typeof loginSchema>;

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = (data: LoginFormData) => {
    const formData = new FormData();
    formData.append("username", data.username);
    formData.append("password", data.password);
    console.log(formData);

    startTransition(async () => {
      try {
        const result = await authenticate(undefined, formData);

        if (result.role === UserRole.STUDENT) {
          router.push("/stu/dashboard");
        } else if (result.role === UserRole.LECTURER) {
          router.push("/lec/dashboard");
        } else if (result.role === UserRole.ADMIN) {
          router.push("/admin/dashboard");
        }
      } catch (error) {
        setErrorMessage("An unexpected error occurred.");
      }
    });
  };

  return (
    <Card className="fixed -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>
          Enter your username and password below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="username">Username</Label>
            <Input id="username" {...form.register("username")} type="text" />
            {form.formState.errors.username && (
              <p className="text-red-600 text-sm">
                {form.formState.errors.username?.message}
              </p>
            )}
          </div>
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">Password</Label>
            </div>
            <Input
              id="password"
              {...form.register("password")}
              type="password"
              required
            />
            {form.formState.errors.password && (
              <p className="text-red-600 text-sm">
                {form.formState.errors.password?.message}
              </p>
            )}
          </div>
          {errorMessage && (
            <p className="text-red-600 text-sm">{errorMessage}</p>
          )}
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "Logging in..." : "Login"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
