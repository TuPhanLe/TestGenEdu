"use client";

import React from "react";
import { Button } from "./ui/button";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation"; // Import hook cho chuyển hướng

type Props = {
  text: string;
};

const SigninButton = ({ text }: Props) => {
  const router = useRouter(); // Khởi tạo hook điều hướng

  return (
    <Button
      onClick={() => {
        // Sử dụng hàm signIn để chuyển hướng đến trang đăng nhập
        signIn(undefined, { callbackUrl: "/auth/login" }).catch(console.error);
      }}
    >
      {text}
    </Button>
  );
};

export default SigninButton;
