import React from "react";

export const ColumnFilter = ({ column }) => {
  const { filterValue, setFilter } = column;
  return (
    <span>
      <input
        style={{ textAlign: "center" }}
        value={filterValue || ""}
        onChange={(e) => setFilter(e.target.value)}
        placeholder="Filter"
      />
    </span>
  );
};
