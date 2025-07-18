import React, { useState } from "react";
import CircleIcon from '@mui/icons-material/Circle';
import { statusColorMap } from "../../constants/status";
import { cn } from "../../utils/utils";
import useDarkmode from "../../hooks/useDarkmode";

export const ExpandableText = ({ text = "", limit = 150 }) => {
  const [expanded, setExpanded] = useState(false);

  const isTruncated = text.length > limit;
  const displayedText = expanded || !isTruncated ? text : text.slice(0, limit) + "...";

  return (
    <div className="whitespace-pre-line">
      <p>{displayedText}</p>
      {isTruncated && (
        <button
          className="text-red-500 mt-2 hover:underline focus:outline-none cursor-pointer"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? "See less" : "See more"}
        </button>
      )}
    </div>
  );
};

export const Status: React.FC<{ status: string, isDark: boolean}> = ({ status, isDark }) => {
  const { bg, icon } = statusColorMap[status] || {
    bg: 'bg-gray-200',
    icon: '#9ca3af',
  };

  return (
    <div
      className={`flex items-center gap-2 p-2 rounded-md ${
        isDark ? 'bg-transparent' : bg
      }`}
    >
      <CircleIcon sx={{ width: 15, height: 15, color: icon }} />
      <h1
        className="font-bold"
        style={{ color: isDark ? icon : undefined }}
      >
        {status}
      </h1>
    </div>
  );
};

const TextSize :  Record<string, string> = {
  "small" : "text-lg",
  "medium" : "text-xl",
  "large" : "text-2xl",
  "xl" : "text-3xl",
  "xxl" : "text-4xl"
}

type TitleProps = {
  children: React.ReactNode;
  fontSize?: "small" | "medium" | "large" | "xl" | "xxl";
  className?: string;
}

export const Title = ({ children, fontSize = "xxl", className } : TitleProps) => {
  const isDark = useDarkmode();

  return (
    <h1 className={cn("font-bold text-red-500", isDark && 'text-white', TextSize[fontSize], className)}
    >{children}</h1>
  )
}