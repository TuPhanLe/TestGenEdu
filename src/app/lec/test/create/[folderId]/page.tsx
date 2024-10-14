import { getAuthSession } from "@/lib/nextauth";
import { redirect } from "next/navigation";
import { UserRole } from "@prisma/client";
import CreateTest from "@/components/forms/Test/CreateTest";

export const metadata = {
  title: "TEST GEN EDU | DNU",
  description: "Let's make a Quiz!",
};

type Props = {
  params: { folderId: string }; // Update to retrieve from params
};

const Quiz = async ({ params }: Props) => {
  const session = await getAuthSession();
  if (!session?.user) {
    redirect("/");
  }

  if (session.user.role !== UserRole.LECTURER) {
    redirect("/not-authorized");
    return null;
  }

  const { folderId } = params; // Extract folderId from params
  console.log(folderId);

  return <CreateTest folderId={folderId} />;
};

export default Quiz;
