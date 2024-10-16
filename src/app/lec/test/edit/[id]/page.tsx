import React from "react";
import { notFound, redirect } from "next/navigation";
import { getAuthSession } from "@/lib/nextauth";
import { prisma } from "@/lib/db";
import EditTest from "@/components/forms/Test/EditTest";
import { UserRole } from "@prisma/client";

export const metadata = {
  title: "TEST GEN EDU | DNU",
  description: "Let's make a Quiz!",
};

type Props = {
  params: {
    id: string;
  };
};

const EditPage = async ({ params: { id } }: Props) => {
  try {
    // Lấy thông tin session
    const session = await getAuthSession();

    // Kiểm tra nếu người dùng chưa đăng nhập
    if (!session?.user) {
      return redirect("/");
    }

    // Kiểm tra quyền của người dùng
    if (session.user.role !== UserRole.LECTURER) {
      return redirect("/not-authorized");
    }

    // Lấy dữ liệu bài kiểm tra từ cơ sở dữ liệu
    const test = await prisma.test.findUnique({
      where: { id },
      include: {
        parts: {
          include: {
            questions: true,
          },
        },
      },
    });

    if (!test) {
      notFound();
    }

    // Chuyển đổi dữ liệu từ DB thành định dạng mong muốn cho defaultValues
    const formattedTest = {
      testId: test.id,
      topic: test.topic,
      testDuration: test.testDuration ?? 60, // Gán giá trị mặc định nếu null
      attemptsAllowed: test.attemptsAllowed ?? 1, // Gán giá trị mặc định nếu null
      parts: test.parts.map((part) => ({
        partId: part.id,
        paragraph: part.content || "", // Đoạn văn cho các loại câu hỏi có đoạn văn
        type: part.testType,
        questions: part.questions.map((question) => ({
          questionId: question.id,
          question: question.question || "", // Có thể bỏ trống cho các loại như fillup
          answer: question.answer,
          options: question.options
            ? JSON.parse(question.options as string)
            : [], // Xử lý options nếu không có
        })),
      })),
    };

    console.log("Formatted Test Data:", formattedTest);

    // Trả về component EditTest với dữ liệu đã được format
    return <EditTest test={formattedTest} />;
  } catch (error) {
    console.error("Error fetching test data:", error);
    return redirect("/error");
  }
};

export default EditPage;
