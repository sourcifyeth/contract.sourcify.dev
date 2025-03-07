"use client";

import { useState } from "react";
import InfoTooltip from "./InfoTooltip";
import CopyToClipboard from "./CopyToClipboard";

interface CodeData {
  name: string;
  value: string;
  tooltipContent?: string;
}

interface ToggledRawCodeViewProps {
  title: string;
  data1: CodeData;
  data2: CodeData;
  generalTooltipContent?: string;
}

export default function ToggledRawCodeView({ title, data1, data2, generalTooltipContent }: ToggledRawCodeViewProps) {
  const [showFirstOption, setShowFirstOption] = useState(true);

  const currentData = showFirstOption ? data1 : data2;

  // Calculate data length
  const bytesLength = currentData.value?.length
    ? Math.floor(currentData.value.length / 2) - (currentData.value.startsWith("0x") ? 1 : 0) // Subtract 1 for 0x if present
    : 0;

  // Determine which tooltip content to show
  const tooltipContent = showFirstOption
    ? data1.tooltipContent || generalTooltipContent
    : data2.tooltipContent || generalTooltipContent;

  return (
    <section className="mb-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>

      <div className="mb-2 flex items-center">
        <span className={`mr-2 text-sm ${showFirstOption ? "font-medium" : "text-gray-500"}`}>{data1.name}</span>

        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={!showFirstOption}
            onChange={() => setShowFirstOption(!showFirstOption)}
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-gray-300 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-gray-900 after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-200"></div>
        </label>

        <span className={`ml-2 text-sm ${!showFirstOption ? "font-medium" : "text-gray-500"}`}>{data2.name}</span>

        {tooltipContent && <InfoTooltip content={tooltipContent} className="ml-2" />}
      </div>

      <div className="mb-1 mr-2 flex items-center justify-between">
        <span className="text-sm text-gray-500">Length: {bytesLength} bytes</span>
        <CopyToClipboard text={currentData.value} className="ml-2" />
      </div>

      <textarea
        className="w-full h-64 p-3 bg-gray-50 rounded text-xs font-mono border border-gray-200"
        value={currentData.value}
        readOnly
      />
    </section>
  );
}
