// app/selection/page.tsx
import TestSelection from "@/components/forms/PlayGround/TestSelection";
import { prisma } from "@/lib/db";

// Hàm lấy danh sách bài kiểm tra từ Prisma
async function getTests() {
  return await prisma.test.findMany({
    select: {
      id: true,
      topic: true,
      createdAt: true,
    },
  });
}

// Component chính hiển thị trang Selection
const SelectionPage = async () => {
  const tests = await getTests(); // Truy vấn dữ liệu từ Prisma

  return <TestSelection tests={tests} />;
};

export default SelectionPage;
