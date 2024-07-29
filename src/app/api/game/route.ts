import { NextResponse } from "next/server";
import { quizCreationSchema } from "@/schemas/form/quiz";
import { ZodError } from "zod";
import { getAuthSession } from "@/lib/nextauth";
import { prisma } from "@/lib/db";

// POST /api/questions
export const POST = async (req: Request) => {
  try {
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
    const body = await req.json();
    const { topic, type, questions } = quizCreationSchema.parse(body);

    const game = await prisma.game.create({
      data: {
        gameType: type,
        timeStarted: new Date(),
        userId: session.user.id,
        topic,
      },
    });

    if (type === "mcq") {
      let manyData = questions.map((question) => {
        let options = question.options;
        options = options.sort(() => Math.random() - 0.5);

        return {
          gameId: game.id,
          questionType: type,
          question: question.question,
          answer: question.answer,
          options: JSON.stringify(options),
        };
      });

      console.log("manyData:", manyData); // Log dữ liệu để kiểm tra

      await prisma.question.createMany({
        data: manyData,
      });

      return NextResponse.json(
        {
          manyData: manyData,
          game: game,
        },
        {
          status: 200,
        }
      );
    } else {
      // Handle other types of questions if necessary
      return NextResponse.json(
        {
          message: "Only MCQ type is handled",
        },
        {
          status: 400,
        }
      );
    }
  } catch (error) {
    console.error("Error creating questions:", error);
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: error.issues },
        {
          status: 400,
        }
      );
    } else {
      return NextResponse.json(
        { error: "Internal Server Error" },
        {
          status: 500,
        }
      );
    }
  }
};
