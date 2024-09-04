import React from "react";
import { notFound, redirect } from "next/navigation";
import { getAuthSession } from "@/lib/nextauth";
import { UserRole } from "@prisma/client";
import TestList from "@/components/list/TestList";
import { prisma } from "@/lib/db";

export const metadata = {
  title: "TEST GEN EDU | DNU",
  description: "Let's make a Quiz!",
};

type Props = {
  params: {
    id: string;
  };
};

const View = async ({ params: { id } }: Props) => {
  const session = await getAuthSession();

  // Kiểm tra xem người dùng có đăng nhập và có đúng vai trò không
  if (!session?.user) {
    redirect("/");
    return null;
  }

  if (session.user.role !== UserRole.LECTURE) {
    redirect("/not-authorized");
    return null;
  }

  // Lấy folder và bao gồm danh sách tests
  const folder = await prisma.folder.findUnique({
    where: {
      id: id,
    },
    include: {
      tests: true, // Bao gồm danh sách tests
    },
  });

  // Kiểm tra nếu không tìm thấy folder
  if (!folder) {
    notFound();
    return null;
  }
  console.log(folder.tests);

  // Truyền danh sách tests vào component TestList
  return (
    <div className="flex h-screen">
      <div className="flex-1 h-full px-4 py-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <TestList tests={folder.tests} folder={folder} />
        </div>
      </div>
    </div>
  );
};

export default View;
