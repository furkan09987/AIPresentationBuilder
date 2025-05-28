"use client";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { useSlideStore } from "@/store/useSlideStore";
import { table } from "console";
import React, { useEffect, useState } from "react";

interface TableComponentProps {
  content: string[][];
  onChange: (newContent: string[][]) => void;
  isPreview?: boolean;
  isEditable?: boolean;
  initialRowSize?: number;
  initialColumnSize?: number;
}

const TableComponent = ({
  content,
  onChange,
  isPreview,
  isEditable,
  initialRowSize,
  initialColumnSize,
}: TableComponentProps) => {
  const { currentTheme } = useSlideStore();
  const [rowSizes, setRowSizes] = useState<number[]>([]);
  const [columnSizes, setColumnSizes] = useState<number[]>([]);
  const [tableData, setTableData] = useState<string[][]>(() => {
    if (content.length === 0 || content[0].length === 0) {
      return Array(initialRowSize).fill(Array(initialColumnSize).fill(""));
    }
    return content;
  });

  const handleResizeColumn = (index: number, newSize: number) => {
    if (!isEditable) return;
    const newSizes = [...columnSizes];
    newSizes[index] = newSize;
    setColumnSizes(newSizes);
  };

  const updateCell = (rowIndex: number, columnIndex: number, value: string) => {
    if (!isEditable) return;
    const newData = tableData.map((row, rowIndex) =>
      rowIndex === rowIndex ? row.map((cell, cIndex) => (cIndex === columnIndex ? value : cell)) : row
    );
    setTableData(newData);
    onChange(newData);
  };

  useEffect(() => {
    setRowSizes(new Array(tableData.length).fill(100 / tableData.length));
    setColumnSizes(new Array(tableData[0].length).fill(100 / tableData[0].length));
  }, [tableData]);

  if (isPreview)
    return (
      <div className="w-full overflow-x-auto text-xs">
        <table className="w-full">
          <thead>
            <tr>
              {tableData[0].map((cell, index) => (
                <th key={index} className="p-2 border" style={{ width: `${columnSizes[index]}%` }}>
                  {cell || "Buraya Yazın"}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableData.slice(1).map((row, rowIndex) => (
              <tr key={rowIndex} style={{ height: `${rowSizes[rowIndex + 1]}%` }}>
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex} className="p-2 border">
                    {cell || "Buraya Yazın"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  return (
    <div
      className="w-full h-full relative"
      style={{
        background: currentTheme.gradientBackground || currentTheme.backgroundColor,
        borderRadius: "8px",
      }}
    >
      <ResizablePanelGroup
        direction="vertical"
        className={`h-full w-full rounded-lg border ${
          initialColumnSize === 2
            ? "min-h-[100px]"
            : initialColumnSize === 3
            ? "min-h-[150px]"
            : initialColumnSize === 4
            ? "min-h-[200px]"
            : "min-h-[100px]"
        }`}
        onLayout={(sizes) => setRowSizes(sizes)}
      >
        {tableData.map((row, rowIndex) => (
          <React.Fragment key={rowIndex}>
            {rowIndex > 0 && <ResizableHandle />}
            <ResizablePanelGroup
              direction="horizontal"
              onLayout={(sizes) => setColumnSizes(sizes)}
              className="w-full h-full"
            >
              {row.map((cell, columnIndex) => (
                <React.Fragment key={columnIndex}>
                  {columnIndex > 0 && <ResizableHandle />}
                  <ResizablePanel
                    defaultSize={columnSizes[columnIndex]}
                    onResize={(size) => handleResizeColumn(columnIndex, size)}
                    className="w-full h-full min-h-9"
                  >
                    <div className="relative w-full h-full min-h-3">
                      <input
                        value={cell}
                        onChange={(e) => updateCell(rowIndex, columnIndex, e.target.value)}
                        className="w-full h-full p-4 bg-transparent
focus:outline-none focus:ring-2
focus:ring-blue-500 rounded-md"
                        style={{ color: currentTheme.fontColor }}
                        placeholder="Buraya yazın"
                        readOnly={!isEditable}
                      ></input>
                    </div>
                  </ResizablePanel>
                </React.Fragment>
              ))}
            </ResizablePanelGroup>
          </React.Fragment>
        ))}
      </ResizablePanelGroup>
    </div>
  );
};

export default TableComponent;
