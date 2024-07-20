import { Button } from "@/components/ui/button";
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
export default async function Home() {
  const session = await getAuthSession();
  if (session?.user) {
    return redirect("/dashboard");
  }
  return (
    <div className="absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
      <Card className="w-[500px]">
        <CardHeader>
          <CardTitle> Welcome to TEST GEN EDU</CardTitle>
          <CardDescription>
            TEST GEN EDU is the Online application platform that compiles a
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
