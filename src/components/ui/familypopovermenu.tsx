import {
  EnvelopeClosedIcon,
  GearIcon,
  HeartIcon,
  PlusCircledIcon,
  PlusIcon,
  Share1Icon,
} from "@radix-ui/react-icons";
import { AnimatePresence, motion } from "framer-motion";

import React, { useState } from "react";
import { useMediaQuery } from "@/hooks/use-media-query";
import useClickOutside from "@/hooks/useClickOutside";
interface FamilyPopoverMenuProps {
  add: () => void; // Add the prop type definition
  share: () => void; // Add the prop type definition
}
export default function FamilyPopoverMenu({
  add,
  share,
}: FamilyPopoverMenuProps) {
  const refMenu = React.useRef<HTMLDivElement>(null);
  const [openMenu, setOpenMenu] = useState(false);

  const isScreenSizeSm = useMediaQuery("(max-width: 640px)");

  const duration = 0.2;
  const transition = { duration, ease: [0.32, 0.72, 0, 1] };

  const menuVariants = {
    open: {
      opacity: 1,
      width: isScreenSizeSm ? "100%" : "320px",
      height: 220,
      borderRadius: "48px",
      bottom: -44,
      transition,
    },
    closed: {
      bottom: 0,
      opacity: 1,
      width: "56px",
      height: 48,
      borderRadius: "50%",
      transition,
    },
  };

  const contentVariants = {
    open: { opacity: 1, scale: 1, transition },
    closed: { opacity: 0, scale: 1, transition },
  };

  const items = [
    {
      icon: PlusCircledIcon,
      onClick: add,
    },
    {
      icon: Share1Icon,
      onClick: share,
    },
    {
      icon: HeartIcon,
    },
  ];

  useClickOutside<HTMLDivElement>(refMenu, () => {
    setOpenMenu(false);
  });

  return (
    <div className="relative mx-6 mb-16 flex h-[300px] items-end justify-start">
      <AnimatePresence>
        <motion.div
          className="absolute  flex flex-col items-center overflow-hidden bg-mauve-dark-1 p-1 dark:bg-mauve-light-1"
          initial="closed"
          animate="open"
          exit="closed"
          variants={menuVariants}
          onClick={(e) => e.stopPropagation()}
          ref={refMenu}
        >
          <motion.ul
            variants={contentVariants}
            className="relative flex w-full flex-col space-y-1"
          >
            {items.map((item, index) => {
              return (
                <li
                  key={index}
                  onClick={item.onClick}
                  className="w-full select-none rounded-b-[4px] rounded-t-[4px] bg-mauve-dark-2 transition-transform first:rounded-t-[12px] last:rounded-b-[12px] active:scale-[0.98] dark:bg-mauve-light-2"
                >
                  <div className="flex items-center py-3">
                    <div className="px-4">
                      <item.icon className="h-5 w-5 text-mauve-dark-12 dark:text-mauve-light-12" />
                    </div>
                  </div>
                </li>
              );
            })}
          </motion.ul>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
