import React, { useMemo } from "react";
import { useFilters, useGlobalFilter, useTable } from "react-table";
import { ColumnFilter } from "../ReactTable/ColumnFilter";
import './MainReactTable.scss'

const ReactTableNew = ({ columns, data }) => {
  const defaultColumn = useMemo(() => {
    // property for every column,no need to specify prop in every column
    return {
      Filter: ColumnFilter
    };
  }, []);
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow
  } = useTable({ columns: columns, data: data, defaultColumn: defaultColumn },
    useFilters,
    useGlobalFilter);

  return (
    <table
      {...getTableProps()}
      style={{
        border: "solid 1px blue",
        // width: "80vw",
        // margin: "0 auto"
      }}
      className="reactTAble2"
    >
      <thead>
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()} >
            {headerGroup.headers.map((column) => (
              <th 
                {...column.getHeaderProps()}
              // style={{
              //   borderBottom: "solid 3px red",
              //   background: "aliceblue",
              //   color: "black",
              //   fontWeight: "bold"
              // }}
              >
                <div className="tableHederlabel">

                  <div className="tableHeder2">
                    <span>

                      {column.render("Header")}
                    </span>
                  </div>
                </div>
                <span>
                  {column.isSorted
                    ? column.isSortedDesc //column sorting indicator
                      ? " D"
                      : " A"
                    : ""}
                </span>
                <div>
                  {column.canFilter ? column.render("Filter") : null}{" "}
                </div>
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row) => {
          prepareRow(row);
          return (
            <tr{...row.getRowProps()}>
              {row.cells.map(cell => {
                return (
                  <td
                    {...cell.getCellProps()}
                    style={{
                      padding: "10px",
                      border: "solid 1px gray",
                      background: "papayawhip"
                    }}
                  >
                    {cell.render("Cell")}
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};
export default ReactTableNew;
