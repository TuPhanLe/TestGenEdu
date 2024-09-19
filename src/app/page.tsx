import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import SigninButton from "@/components/SigninButton";
import { getAuthSession } from "@/lib/nextauth";
import { redirect } from "next/navigation";
import { FireExtinguisher } from "lucide-react";
import { UserRole } from "@prisma/client";
export default async function Home() {
  const session = await getAuthSession();
  if (session?.user.role === UserRole.STUDENT) {
    return redirect("/stu/dashboard");
  }
  if (session?.user.role === UserRole.LECTURE) {
    return redirect("/lec/dashboard");
  }
  if (session?.user.role === UserRole.ADMIN) {
    return redirect("/admin/dashboard");
  }
  return (
    <div className="fixed -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
      <Card className="w-[700px]">
        <CardHeader>
          <CardTitle className="text-3xl">WELCOME TO TEST GEN EDU 🔥</CardTitle>
          <CardDescription className="text-1xl">
            Test Gen Edu is the Online application platform that compiles a
            variety of questions, test sets, and exam questions for English
            majors at the Faculty of Foreign Languages, Dong Nai University
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SigninButton text="Sign in with Google" />
        </CardContent>
      </Card>
    </div>
  );
}
