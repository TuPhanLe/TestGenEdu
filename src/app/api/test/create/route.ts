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
    const { testId, topic, type, paragraphs } = testSchema.parse(body);
    console.log(body);

    // Upsert the test in the database
    const test = await prisma.test.upsert({
      where: { id: testId }, // Check if a test with this ID exists
      update: {
        testType: type,
        timeStarted: new Date(),
        creatorId: session.user.id,
        topic,
      },
      create: {
        id: testId,
        testType: type,
        timeStarted: new Date(),
        creatorId: session.user.id,
        topic,
      },
    });

    // Process paragraphs and questions
    const paragraphData = await Promise.all(
      paragraphs.map(async (paragraph) => {
        const createdParagraph = await prisma.paragraph.upsert({
          where: { id: paragraph.paragraphId }, // Check if paragraph exists
          update: {
            content: paragraph.paragraph,
            testId: test.id,
          },
          create: {
            id: paragraph.paragraphId,
            content: paragraph.paragraph,
            testId: test.id,
          },
        });

        // Return paragraph ID and questions for further processing
        return {
          paragraphId: createdParagraph.id,
          questions: paragraph.questions,
        };
      })
    );

    // Process questions and their options
    const questionData = await Promise.all(
      paragraphData.flatMap((paragraph) =>
        paragraph.questions.map((question) => {
          // Add the correct answer to the options array and shuffle them
          const allOptions = [...question.options, question.answer];
          const shuffledOptions = allOptions.sort(() => Math.random() - 0.5);

          return prisma.question.upsert({
            where: { id: question.questionId }, // Check if question exists
            update: {
              question: question.question,
              answer: question.answer,
              options: JSON.stringify(shuffledOptions), // Store options as a JSON string
              questionType: type,
              paragraphId: paragraph.paragraphId,
              testId: test.id,
            },
            create: {
              id: question.questionId,
              question: question.question,
              answer: question.answer,
              options: JSON.stringify(shuffledOptions),
              questionType: type,
              paragraphId: paragraph.paragraphId,
              testId: test.id,
            },
          });
        })
      )
    );

    // Await all question upserts
    await Promise.all(questionData);

    // Return a successful response with test details
    return NextResponse.json(
      {
        gameId: test.id,
        creatorId: test.creatorId,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error creating or updating test:", error);

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
