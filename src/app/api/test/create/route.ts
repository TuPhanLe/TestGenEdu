import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { getAuthSession } from "@/lib/nextauth";
import { prisma } from "@/lib/db";
import { testSchema } from "@/schemas/form/test";

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
    const { testId, topic, testDuration, attemptsAllowed, folderId, parts } =
      testSchema.parse(body);

    // console.log(body);

    // Create the test in the database
    const test = await prisma.test.create({
      data: {
        id: testId,
        creatorId: session.user.id,
        topic,
        testDuration,
        attemptsAllowed,
        folderId,
      },
    });

    // Process parts and questions
    const partData = await Promise.all(
      parts.map(async (part) => {
        const createdPart = await prisma.part.create({
          data: {
            id: part.partId,
            content: part.paragraph || "", // Optional paragraph field
            testType: part.type,
            testId: test.id,
          },
        });

        // Process questions based on part type
        const questionData = await Promise.all(
          part.questions.map(async (question) => {
            // Kiểm tra xem câu hỏi đã tồn tại trong phần đó chưa
            const existingQuestion = await prisma.question.findFirst({
              where: {
                question: question.question,
                partId: createdPart.id,
              },
            });

            if (!existingQuestion) {
              // Nếu câu hỏi chưa tồn tại, tạo mới
              let allOptions = question.options || [];
              if (question.answer && part.type !== "true_false") {
                allOptions = [...allOptions]; // For other types, options are provided
              }

              return prisma.question.create({
                data: {
                  id: question.questionId,
                  question: question.question || "", // Optional for Fill in the Blanks
                  answer: question.answer,
                  options: allOptions.length
                    ? JSON.stringify(allOptions)
                    : undefined, // Optional for types without options
                  questionType: part.type,
                  partId: createdPart.id,
                  testId: test.id,
                },
              });
            } else {
              console.warn(
                `Question "${question.question}" already exists in part ${createdPart.id}`
              );
              return null;
            }
          })
        );

        return questionData.filter((q) => q !== null); // Chỉ trả về các câu hỏi mới
      })
    );

    // Await all part creates
    await Promise.all(partData.flat());

    // Return a successful response with test details
    return NextResponse.json(
      {
        gameId: test.id,
        creatorId: test.creatorId,
        folderId: test.folderId,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error creating test:", error);

    if (error instanceof ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    } else {
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 }
      );
    }
  }
};
