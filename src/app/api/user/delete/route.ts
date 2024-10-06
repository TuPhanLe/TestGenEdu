import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function DELETE(request: Request) {
  const { userName } = await request.json();

  if (!userName) {
    return NextResponse.json({ error: "Missing userName" }, { status: 400 });
  }

  try {
    const deletedUser = await prisma.user.delete({
      where: {
        userName: userName, // Assuming `userName` is unique in the database schema
      },
    });

    return NextResponse.json(
      { message: "User deleted successfully", deletedUser },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    );
  }
}
