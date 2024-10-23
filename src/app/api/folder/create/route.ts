import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { getAuthSession } from "@/lib/nextauth"; // Adjust the path as needed
import { prisma } from "@/lib/db"; // Adjust the path as needed
import { folderSchema } from "@/schemas/form/folder"; // Adjust the path as needed

export const POST = async (req: Request) => {
  try {
    // Authenticate the user
    const session = await getAuthSession();
    if (!session?.user) {
      return NextResponse.json(
        { error: "You must be logged in" },
        { status: 401 }
      );
    }

    // Parse and validate the request body
    const body = await req.json();
    const { name, description, selectedTest } = folderSchema.parse(body);
    // console.log(body);

    // Create the folder in the database
    const folder = await prisma.folder.create({
      data: {
        name,
        description,
        creatorId: session.user.id,
        tests: {
          connect:
            selectedTest?.map((testId: string) => ({ id: testId })) || [],
        },
      },
    });

    // Return a successful response with folder details
    return NextResponse.json(
      {
        id: folder.id,
        name: folder.name,
        description: folder.description,
        createdAt: folder.createdAt, // Include the `createdAt` field
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error creating folder:", error);

    if (error instanceof ZodError) {
      // Handle validation errors
      return NextResponse.json({ error: error.issues }, { status: 400 });
    } else {
      // Handle internal server errors
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 }
      );
    }
  }
};
