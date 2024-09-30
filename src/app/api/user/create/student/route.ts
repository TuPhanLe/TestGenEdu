import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { getAuthSession } from "@/lib/nextauth";
import { prisma } from "@/lib/db";
import { hash } from "bcrypt-ts";
import { UserRole, UserStatus } from "@prisma/client"; // Import enum từ Prisma
import { studentSchema } from "@/schemas/form/student";

// API POST để tạo sinh viên
// API POST để tạo sinh viên
export async function POST(req: Request) {
  try {
    // Xác thực phiên đăng nhập người dùng (nếu cần thiết)
    const session = await getAuthSession();

    // Nếu không có phiên đăng nhập, trả về lỗi không được phép
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Bạn không có quyền truy cập" },
        { status: 403 }
      );
    }

    // Lấy dữ liệu từ request body
    const json = await req.json();

    // Kiểm tra dữ liệu với schema bằng Zod
    const parsedStudent = studentSchema.parse(json);

    // Mã hóa mật khẩu bằng bcrypt-ts
    const hashedPassword = await hash(parsedStudent.password, 10); // 10 là số rounds mặc định của bcrypt

    // Điều kiện để trả về giá trị từ enum UserStatus
    let userStatus: UserStatus;
    if (parsedStudent.status === "ACTIVE") {
      userStatus = UserStatus.ACTIVE;
    } else parsedStudent.status === "INACTIVE";
    {
      userStatus = UserStatus.INACTIVE;
    }

    // Tạo sinh viên mới trong cơ sở dữ liệu với role là STUDENT
    const newStudent = await prisma.user.create({
      data: {
        name: parsedStudent.name,
        userName: parsedStudent.userName,
        password: hashedPassword, // Lưu mật khẩu đã được mã hóa
        email: parsedStudent.email,
        status: userStatus, // Trạng thái được lấy từ điều kiện ở trên
        role: UserRole.STUDENT, // Vai trò sinh viên
        studentId: parsedStudent.studentId, // Mã sinh viên
        class: parsedStudent.class, // Lớp
        department: parsedStudent.department, // Khoa
      },
    });

    // Trả về sinh viên mới được tạo
    return NextResponse.json(newStudent, { status: 201 });
  } catch (error) {
    // Xử lý lỗi Zod nếu validation thất bại
    if (error instanceof ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }

    // Xử lý các lỗi khác
    return NextResponse.json({ error: "Đã có lỗi xảy ra" }, { status: 500 });
  }
}
