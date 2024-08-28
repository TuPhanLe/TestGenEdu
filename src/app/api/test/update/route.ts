import { NextResponse } from "next/server";
import { quizUpdateSchema } from "@/schemas/form/quiz";
import { ZodError } from "zod";
import { getAuthSession } from "@/lib/nextauth";
import { prisma } from "@/lib/db";

export const PUT = async (req: Request) => {
  try {
    const session = await getAuthSession();
    if (!session?.user) {
      return NextResponse.json(
        { error: "You must be logged in" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { testId, topic, type, paragraphs } = quizUpdateSchema.parse(body);
    console.log(body);

    const existingTest = await prisma.test.findUnique({
      where: { id: testId, userId: session.user.id },
      include: {
        paragraphs: {
          include: {
            questions: true,
          },
        },
      },
    });

    if (!existingTest) {
      return NextResponse.json(
        {
          error:
            "Test not found or you do not have permission to update this test",
        },
        { status: 404 }
      );
    }

    // Cập nhật thông tin bài kiểm tra
    const updatedTest = await prisma.test.update({
      where: { id: testId },
      data: { topic, testType: type },
    });

    // Cập nhật đoạn văn và câu hỏi
    await Promise.all(
      paragraphs.map(async (paragraph) => {
        const existingParagraph = await prisma.paragraph.findFirst({
          where: { content: paragraph.paragraph, testId: testId },
        });

        if (existingParagraph) {
          await prisma.paragraph.update({
            where: { id: existingParagraph.id },
            data: { content: paragraph.paragraph },
          });

          // Cập nhật câu hỏi trong đoạn văn
          await Promise.all(
            paragraph.questions.map(async (question) => {
              // Thêm câu trả lời vào danh sách tùy chọn
              question.options.push(question.answer);
              const options = question.options.sort(() => Math.random() - 0.5);

              // Tìm câu hỏi hiện tại để cập nhật
              const existingQuestion = await prisma.question.findFirst({
                where: {
                  question: question.question,
                  paragraphId: existingParagraph.id,
                },
              });

              await prisma.question.upsert({
                where: {
                  id: existingQuestion?.id || "-1", // Sử dụng một giá trị không hợp lệ khi không tìm thấy câu hỏi
                },
                update: {
                  question: question.question,
                  answer: question.answer,
                  options: JSON.stringify(options),
                  questionType: type,
                },
                create: {
                  question: question.question,
                  answer: question.answer,
                  options: JSON.stringify(options),
                  questionType: type,
                  paragraphId: existingParagraph.id,
                  testId: testId,
                },
              });
            })
          );
        } else {
          // Tạo đoạn văn mới nếu chưa có
          const newParagraph = await prisma.paragraph.create({
            data: {
              testId: testId,
              content: paragraph.paragraph,
            },
          });

          // Tạo các câu hỏi mới cho đoạn văn mới
          await prisma.question.createMany({
            data: paragraph.questions.map((question) => {
              // Thêm câu trả lời vào danh sách tùy chọn
              question.options.push(question.answer);
              const options = question.options.sort(() => Math.random() - 0.5);
              return {
                question: question.question,
                answer: question.answer,
                options: JSON.stringify(options),
                questionType: type,
                paragraphId: newParagraph.id,
                testId: testId,
              };
            }),
          });
        }
      })
    );

    return NextResponse.json(
      { message: "Test updated successfully", testId: updatedTest.id },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating test:", error);

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
