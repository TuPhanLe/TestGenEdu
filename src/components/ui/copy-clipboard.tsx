import React, { useState } from "react";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

interface CopyClipboardProps {
  textToCopy: string; // Định nghĩa prop cho chuỗi cần sao chép
}

export function CopyClipboard({ textToCopy }: CopyClipboardProps) {
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(textToCopy); // Sử dụng prop textToCopy để sao chép
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Đặt trạng thái lại sau 2 giây
    } catch (error) {
      console.error("Failed to copy text: ", error);
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" onClick={handleCopy}>
            {copied ? "Copied!" : "Copy to Clipboard"}
            <ClipboardIcon className="ml-2 h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Click to copy</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

function ClipboardIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    </svg>
  );
}
