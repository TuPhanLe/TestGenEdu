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

    const tests = await prisma.test.findMany({
      where: {
        userId: session.user.id,
      },
    });

    return NextResponse.json(
      {
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
