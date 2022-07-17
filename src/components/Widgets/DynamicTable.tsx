import React from "react";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type HeadCell<DataType> = {
  name: string;
};

type TableProps<DataType> = {
  heads: HeadCell<DataType>[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rows: Record<string, any>;
};

export function TableWidget<T>({ heads, rows }: TableProps<T>) {
  const ColumnsKeys = heads.map((item: HeadCell<T>) => item.name);

  return (
    <table className="border-collapse border-t-2 border-l-2 border-gray-200 p-1">
      <tr>
        {heads.map((head, headKey) => {
          return (
            <th
              key={headKey}
              className="border-r-2 border-b-2 border-gray-200 p-1"
            >
              {head.name}
            </th>
          );
        })}
      </tr>
      {rows.map(
        (
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          row: any,
          rowKey: string
        ) => {
          return (
            <tr key={rowKey}>
              {ColumnsKeys.map((column: string, columnKey) => {
                return (
                  <td
                    key={columnKey}
                    className="border-r-2 border-b-2 border-gray-200 p-1 bg-white"
                  >
                    {row[column] + ""}
                  </td>
                );
              })}
            </tr>
          );
        }
      )}
    </table>
  );
}
