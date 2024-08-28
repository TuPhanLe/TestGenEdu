import { usePathname } from "next/navigation";

import { Bell, Briefcase, Home, Settings, User } from "lucide-react";

export const NavItems = () => {
  const pathname = usePathname();

  function isNavItemActive(pathname: string, nav: string) {
    return pathname.includes(nav);
  }

  return [
    {
      name: "Home",
      href: "/",
      icon: <Home size={26} />,
      active: pathname === "/lec/dashboard",
      position: "top",
    },
    {
      name: "Action",
      href: "/lec/test/view",
      icon: <User size={26} />,
      active: isNavItemActive(pathname, "/lec/test/view"),
      position: "top",
    },

    {
      name: "Settings",
      href: "/settings",
      icon: <Settings size={26} />,
      active: isNavItemActive(pathname, "/settings"),
      position: "bottom",
    },
  ];
};
