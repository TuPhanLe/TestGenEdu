import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
  try {
    const { cardId } = await req.json();

    if (!cardId) {
      return NextResponse.json({ error: "Missing cardId" }, { status: 400 });
    }

    await prisma.test.delete({
      where: {
        id: cardId,
      },
    });

    return NextResponse.json(
      { message: "Test deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to delete the test:", error);
    return NextResponse.json(
      { error: "Failed to delete the test" },
      { status: 500 }
    );
  }
}
