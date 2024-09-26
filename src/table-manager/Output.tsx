import React from "react";
import TableManager from "./tablemanager";
import TableProvider from "./TableProvider";

let data: string[] = [
  "Vitamin A",
  "Vitamin C",
  "Vitamin D",
  "Vitamin E",
  "Vitamin K",
  "Vitamin B1",
  "Vitamin B2",
  "Vitamin B3",
  "Vitamin B6",
  "Vitamin B12",
];

function Output() {
  return (
    <TableProvider>
      <TableManager data={data} />
    </TableProvider>
  );
}
export default Output;
