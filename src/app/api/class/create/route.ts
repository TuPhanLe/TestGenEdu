import { NextResponse } from "next/server"; // Import NextResponse để trả về phản hồi
import { Class, UserClass } from "@prisma/client"; // Import các model từ Prisma
import { prisma } from "@/lib/db";
import { ZodError } from "zod";
import { getAuthSession } from "@/lib/nextauth"; // Adjust the path as needed

// Hàm xử lý POST request để tạo lớp
export async function POST(request: Request) {
  try {
    // Authenticate the user
    const session = await getAuthSession();
    if (!session?.user) {
      return NextResponse.json(
        { error: "You must be logged in" },
        { status: 401 }
      );
    }

    // Parse dữ liệu nhận được từ phía frontend
    const { className, students, lecturers } = await request.json();

    // Kiểm tra dữ liệu đầu vào
    if (!className) {
      return NextResponse.json(
        {
          message: "Invalid data. Class name is required.",
        },
        { status: 400 }
      );
    }

    // Lấy supervisorId từ lecturers nếu có
    const supervisorId = lecturers?.length > 0 ? lecturers[0].id : null;

    // Lấy danh sách studentIds từ students nếu có
    const studentIds = Array.isArray(students)
      ? students.map((student: { id: string }) => student.id)
      : [];

    // Bắt đầu tạo lớp học trong bảng Class (có thể không có supervisorId)
    const createdClass = await prisma.class.create({
      data: {
        name: className,
        supervisorId: supervisorId || undefined, // Nếu không có supervisorId, sẽ không set giá trị
      },
    });

    // Thêm sinh viên vào lớp học nếu có danh sách studentIds
    if (studentIds.length > 0) {
      const userClasses = studentIds.map((studentId: string) => ({
        userId: studentId, // ID sinh viên
        classId: createdClass.id, // ID lớp học vừa được tạo
      }));

      // Sử dụng prisma để tạo nhiều bản ghi trong bảng UserClass
      await prisma.userClass.createMany({
        data: userClasses,
      });
    }

    // Trả về phản hồi thành công cùng với thông tin của lớp vừa tạo
    return NextResponse.json(
      { message: "Class created successfully!", class: createdClass },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating class:", error);

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
}
