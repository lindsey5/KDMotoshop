import { useState } from "react";

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
