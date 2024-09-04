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

export const NavItems = () => {
  const pathname = usePathname();

  function isNavItemActive(pathname: string, nav: string) {
    return pathname.includes(nav);
  }

  return [
    {
      name: "Home",
      href: "/",
      icon: <Home size={19} />,
      active: pathname === "/lec/dashboard",
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
      name: "Settings",
      href: "/settings",
      icon: <Settings size={19} />,
      active: isNavItemActive(pathname, "/settings"),
      position: "bottom",
    },
  ];
};
