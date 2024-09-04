import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function DELETE(request: Request) {
  const { cardId } = await request.json();

  if (!cardId) {
    return NextResponse.json({ error: "Missing cardId" }, { status: 400 });
  }

  try {
    const deletedFolder = await prisma.folder.delete({
      where: {
        id: cardId,
      },
    });

    return NextResponse.json(
      { message: "Folder deleted successfully", deletedFolder },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting folder:", error);
    return NextResponse.json(
      { error: "Failed to delete folder" },
      { status: 500 }
    );
  }
}
