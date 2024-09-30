import { type User } from "next-auth";
import { Avatar, AvatarFallback } from "./ui/avatar";
import React from "react";
import Image from "next/image";
type Props = {
  user: Pick<User, "name" | "image">;
};

const UserAvatar = ({ user }: Props) => {
  return (
    <Avatar>
      <Image
        fill
        src={"/images/user.jpg"}
        alt="profile image"
        referrerPolicy="no-referrer"
      />
      <AvatarFallback>
        <span className="sr-only">{user?.name}</span>
      </AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;
