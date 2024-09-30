import { usePathname } from "next/navigation";
import {
  Bell,
  Briefcase,
  FileText,
  Folder,
  Home,
  Settings,
  User,
} from "lucide-react";
import { signOut } from "next-auth/react";
import React from "react";

interface NavItem {
  name: string;
  href: string;
  icon: JSX.Element;
  active: boolean;
  position: "top" | "bottom";
  onClick?: () => void; // Thêm thuộc tính onClick
}

export const NavItems = (admin: boolean = false): NavItem[] => {
  const pathname = usePathname();

  function isNavItemActive(pathname: string, nav: string) {
    return pathname.includes(nav);
  }

  const handleSignOut = () => {
    signOut({ callbackUrl: "/auth/login" }).catch(console.error);
  };

  if (admin) {
    return [
      {
        name: "Home",
        href: "/admin/dashboard",
        icon: <Home size={19} />,
        active: pathname === "/admin/dashboard",
        position: "top",
      },
      {
        name: "Manage Users",
        href: "/admin/users",
        icon: <User size={19} />,
        active: isNavItemActive(pathname, "/admin/users"),
        position: "top",
      },
      {
        name: "Manage Folders",
        href: "/admin/folders",
        icon: <Folder size={19} />,
        active: isNavItemActive(pathname, "/admin/folders"),
        position: "top",
      },
      {
        name: "Notifications",
        href: "/admin/notifications",
        icon: <Bell size={19} />,
        active: isNavItemActive(pathname, "/admin/notifications"),
        position: "top",
      },
      {
        name: "Reports",
        href: "/admin/reports",
        icon: <Briefcase size={19} />,
        active: isNavItemActive(pathname, "/admin/reports"),
        position: "bottom",
      },
      {
        name: "Logout",
        href: "#", // Đặt href là "#" vì chúng ta sẽ xử lý sự kiện nhấp chuột
        icon: <Settings size={19} />,
        active: isNavItemActive(pathname, "/"),
        position: "bottom",
        onClick: handleSignOut, // Thêm hàm xử lý sự kiện nhấp chuột
      },
    ];
  }

  return [
    {
      name: "Home",
      href: "/",
      icon: <Home size={19} />,
      active: pathname === "/",
      position: "top",
    },
    {
      name: "Folder",
      href: "/lec/folder/view",
      icon: <Folder size={19} />,
      active: isNavItemActive(pathname, "/lec/folder/view"),
      position: "top",
    },
    {
      name: "Test",
      href: "/lec/test/view",
      icon: <FileText size={19} />,
      active: isNavItemActive(pathname, "/lec/test/view"),
      position: "top",
    },
    {
      name: "Notifications",
      href: "/lec/notifications",
      icon: <Bell size={19} />,
      active: isNavItemActive(pathname, "/lec/notifications"),
      position: "top",
    },
    {
      name: "Reports",
      href: "/lec/reports",
      icon: <Briefcase size={19} />,
      active: isNavItemActive(pathname, "/lec/reports"),
      position: "top",
    },
    {
      name: "Settings",
      href: "#", // Đặt href là "#" vì chúng ta sẽ xử lý sự kiện nhấp chuột
      icon: <Settings size={19} />,
      active: isNavItemActive(pathname, "/settings"),
      position: "bottom",
      onClick: handleSignOut, // Thêm hàm xử lý sự kiện nhấp chuột
    },
  ];
};
