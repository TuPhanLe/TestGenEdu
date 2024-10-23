// components/UserInfoCard.tsx
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/db";

type UserInfoProps = {
  userId: string;
};

async function getUserInfo(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      name: true,
      email: true,
      studentId: true,
      department: true,
    },
  });
  return user;
}

const UserInfoCard: React.FC<UserInfoProps> = async ({ userId }) => {
  const user = await getUserInfo(userId);
  if (!user) {
    return <p>Loading...</p>; // Hiển thị loader cho đến khi dữ liệu được tải
  }

  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          Personal Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p>
            <strong>Name:</strong> {user.name}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Student ID:</strong> {user.studentId ?? "N/A"}
          </p>
          <p>
            <strong>Department:</strong> {user.department ?? "N/A"}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserInfoCard;
