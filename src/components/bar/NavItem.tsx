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

interface NavItem {
  name: string;
  href: string;
  icon: JSX.Element;
  active: boolean;
  position: "top" | "bottom";
}

export const NavItems = (admin: boolean = false): NavItem[] => {
  const pathname = usePathname();

  function isNavItemActive(pathname: string, nav: string) {
    return pathname.includes(nav);
  }

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
        name: "Settings",
        href: "/admin/settings",
        icon: <Settings size={19} />,
        active: isNavItemActive(pathname, "/admin/settings"),
        position: "bottom",
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
      href: "/settings",
      icon: <Settings size={19} />,
      active: isNavItemActive(pathname, "/settings"),
      position: "bottom",
    },
  ];
};
