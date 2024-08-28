import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/nextauth";
import { prisma } from "@/lib/db";

export const POST = async (req: Request) => {
  try {
    // Xác thực phiên của người dùng
    const session = await getAuthSession();
    if (!session?.user) {
      return NextResponse.json(
        {
          error: "You must be logged in",
        },
        {
          status: 401,
        }
      );
    }

    // Truy vấn các thư mục từ database dựa trên userId
    const folders = await prisma.folder.findMany({
      where: {
        userId: session.user.id,
      },
    });
    const tests = await prisma.test.findMany({
      where: {
        userId: session.user.id,
      },
    });
    // Kiểm tra xem người dùng có thư mục nào không

    // Phản hồi dữ liệu thư mục
    return NextResponse.json(
      {
        folders: folders,
        tests: tests,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error retrieving folders:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      {
        status: 500,
      }
    );
  }
};
