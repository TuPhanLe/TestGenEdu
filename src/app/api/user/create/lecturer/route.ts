import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { getAuthSession } from "@/lib/nextauth";
import { prisma } from "@/lib/db";
import { hash } from "bcrypt-ts";
import { UserRole, UserStatus } from "@prisma/client";
import { lecturerSchema } from "@/schemas/form/lecturer";

// API POST để tạo giảng viên
export async function POST(req: Request) {
  try {
    // Xác thực phiên đăng nhập người dùng
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
    const parsedLecturer = lecturerSchema.parse(json);
    let userStatus: UserStatus;
    if (parsedLecturer.status === "ACTIVE") {
      userStatus = UserStatus.ACTIVE;
    } else parsedLecturer.status === "INACTIVE";
    {
      userStatus = UserStatus.INACTIVE;
    }

    // Mã hóa mật khẩu bằng bcrypt-ts
    const hashedPassword = await hash(parsedLecturer.password, 10); // 10 là số rounds mặc định của bcrypt

    // Tạo giảng viên mới trong cơ sở dữ liệu với role là LECTURER
    const newLecturer = await prisma.user.create({
      data: {
        name: parsedLecturer.name,
        userName: parsedLecturer.userName,
        password: hashedPassword, // Lưu mật khẩu đã được mã hóa
        email: parsedLecturer.email,
        status: userStatus, // ACTIVE, INACTIVE hoặc các trạng thái khác
        role: UserRole.LECTURE, // Vai trò của người dùng là giảng viên
      },
    });

    // Trả về giảng viên mới được tạo
    return NextResponse.json(newLecturer, { status: 201 });
  } catch (error) {
    // Xử lý lỗi Zod nếu validation thất bại
    if (error instanceof ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }

    // Xử lý các lỗi khác
    return NextResponse.json({ error: "Đã có lỗi xảy ra" }, { status: 500 });
  }
}
