import { NextResponse } from "next/server";
import { quizCreationSchema } from "@/schemas/form/quiz";
import { ZodError } from "zod";
import { getAuthSession } from "@/lib/nextauth";
import { prisma } from "@/lib/db";
import { GameType } from "@prisma/client";

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
    const { topic, type, paragraphs } = quizCreationSchema.parse(body);
    const game = await prisma.game.create({
      data: {
        gameType: type,
        timeStarted: new Date(),
        userId: session.user.id,
        topic,
      },
    });
    const paragraphData = await Promise.all(
      paragraphs.map(async (paragraph) => {
        const createdParagraph = await prisma.paragraph.create({
          data: {
            gameId: game.id,
            content: paragraph.paragraph,
          },
        });
        return {
          paragraphId: createdParagraph.id,
          questions: paragraph.questions,
        };
      })
    );
    const questionData = paragraphData.flatMap((paragraph) =>
      paragraph.questions.map((question) => {
        question.options.push(question.answer);
        let options = question.options.sort(() => Math.random() - 0.5);
        return {
          question: question.question,
          answer: question.answer,
          options: JSON.stringify(options),
          questionType: type,
          paragraphId: paragraph.paragraphId,
          gameId: game.id,
        };
      })
    );
    console.log(game);
    console.log(paragraphData);
    console.log(questionData);

    await prisma.question.createMany({
      data: questionData,
    });

    return NextResponse.json(
      {
        gameId: game.id,
        game: game.userId,
        manyData: questionData,
      },
      {
        status: 200,
      }
    );
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
