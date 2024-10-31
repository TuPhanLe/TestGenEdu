import { NextResponse } from "next/server";
import { ZodError, z } from "zod";
import { getAuthSession } from "@/lib/nextauth";
import { prisma } from "@/lib/db";
// Định nghĩa schema xác thực dữ liệu từ FE
const updateTestResultSchema = z.object({
  testId: z.string(), // ID bài kiểm tra
  startTime: z.string(), // Chuỗi thời gian ISO 8601
  endTime: z.string().optional(), // Thời gian kết thúc, tùy chọn
  results: z.array(
    z.object({
      questionId: z.string(), // ID câu hỏi
      userAnswer: z.string(), // Đáp án của người dùng
    })
  ),
});

export const POST = async (req: Request) => {
  try {
    // Xác thực người dùng
    const session = await getAuthSession();
    if (!session?.user) {
      return NextResponse.json(
        { error: "You must be logged in" },
        { status: 401 }
      );
    }

    // Phân tích và xác thực dữ liệu từ body request
    const body = await req.json();
    const { testId, startTime, endTime, results } =
      updateTestResultSchema.parse(body);

    // Tìm bài kiểm tra dựa vào testId
    const test = await prisma.test.findUnique({
      where: { id: testId },
      include: { questions: true },
    });

    if (!test) {
      return NextResponse.json({ error: "Test not found" }, { status: 404 });
    }

    const totalQuestions = test.questions.length;
    const studentId = session.user.id;

    // Duyệt qua từng câu trả lời của người dùng và so sánh với đáp án đúng
    let correctAnswersCount = 0;
    for (const result of results) {
      const question = test.questions.find((q) => q.id === result.questionId);
      if (!question) continue;
      const isCorrect = isAnswerCorrect(question.answer, result.userAnswer);
      if (isCorrect) correctAnswersCount++;
    }

    // Tính điểm dựa trên số câu trả lời đúng
    const score = (correctAnswersCount / totalQuestions) * 10;
    const passed = score > 5;

    // Tìm bản ghi gần nhất cho lần làm bài này
    const latestAttempt = await prisma.testResult.findFirst({
      where: { testId, studentId },
      orderBy: { attemptNumber: "desc" },
    });

    if (latestAttempt) {
      // Nếu đã có bản ghi, cập nhật nó
      await prisma.testResult.update({
        where: { id: latestAttempt.id },
        data: {
          startTime: new Date(startTime),
          endTime: endTime ? new Date(endTime) : null,
          score,
          totalScore: 10, // Giả định tổng điểm là 10
          passed,
          studentAnswers: results, // Cập nhật câu trả lời của người dùng
        },
      });
    }

    // Trả về phản hồi thành công
    return NextResponse.json(
      {
        message: "TestResult updated successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating TestResult:", error);

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

// Hàm kiểm tra độ tương thích của hai chuỗi
const levenshteinDistance = (a: string, b: string): number => {
  const dp = Array.from({ length: a.length + 1 }, () =>
    Array(b.length + 1).fill(0)
  );

  for (let i = 0; i <= a.length; i++) dp[i][0] = i;
  for (let j = 0; j <= b.length; j++) dp[0][j] = j;

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      if (a[i - 1] === b[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = Math.min(
          dp[i - 1][j] + 1, // Xóa
          dp[i][j - 1] + 1, // Thêm
          dp[i - 1][j - 1] + 1 // Thay thế
        );
      }
    }
  }

  return dp[a.length][b.length];
};

const isAnswerCorrect = (
  correctAnswer: string,
  userAnswer: string
): boolean => {
  const distance = levenshteinDistance(
    correctAnswer.trim().toLowerCase(),
    userAnswer.trim().toLowerCase()
  );
  const maxLen = Math.max(correctAnswer.length, userAnswer.length);
  const similarity = 1 - distance / maxLen;
  return similarity >= 0.8; // Nếu tương đồng >= 80% thì coi là đúng
};
