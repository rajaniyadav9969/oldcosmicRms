import React from "react";
import {
  useTable,
  useResizeColumns,
  useFlexLayout,
  useExpanded, useBlockLayout
} from "react-table";
import classnames from "classnames";
import "./react-table.css";
import { FixedSizeList, } from 'react-window'
import scrollbarWidth from './scrollbarWidth'
const ReactTable = (props) => {
  const {
    className = "",
    data,
    columns,
    loading = false,
    getTdProps = () => {},
    trClassName = "",
    SubComponent,
    getTrPorps
  } = props;

  const defaultColumn = React.useMemo(
    () => ({
      width: 110,
    }),
    []
  )

  if (SubComponent) {
    columns.unshift({
      Header: "",
      id: "expander",
      resizable: false,
      className: "text-center",
    //   width: 30,
      Cell: ({ row }) => {
        return (
          <div
            {...row.getToggleRowExpandedProps()}
            title="Click here to see more information"
            className="rt-td rt-expandable p-0"
          >
            <div
              className={classnames(
                "rt-expander",
                row.isExpanded ? "-open" : ""
              )}
            >
              •
            </div>
          </div>
        );
      }
    });
  }

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    totalColumnsWidth,
    footerGroups,
    prepareRow
  } = useTable(
    { columns, data, defaultColumn, SubComponent ,defaultColumn},
    useFlexLayout,
    useResizeColumns,
    useExpanded, useBlockLayout
  );
  const scrollBarSize = React.useMemo(() => scrollbarWidth(), [])
  const RenderRow = React.useCallback(
    ({ index, style }) => {
      const row = rows[index]
      
      prepareRow(row)
      return (
        <div
          {...row.getRowProps({
            onClick: e => getTrPorps(),

            style,
          })}
          className="rt-tr"
          onClick={getTrPorps}
          
          
        >
          {row.cells.map(cell => {
            return (
              <div {...cell.getCellProps()}
              className="rt-td"
              >
                {cell.render('Cell')}
              </div>
            )
          })}
        </div>
      )
    },
    [prepareRow, rows]
  )
  return (
    <div className={classnames(className, "ReactTable")}>
      <div {...getTableProps} className="rt-table">
        <div className="rt-thead -header">
          {headerGroups.map((headerGroup) => (
            <div {...headerGroup.getHeaderGroupProps()} className="rt-tr">
              {headerGroup.headers.map((column) => {
                return column.resizable === false ? (
                  <div {...column.getHeaderProps()} className="rt-th">
                    {column.render("Header")}
                  </div>
                ) : (
                  <div
                    {...column.getHeaderProps()}
                    className="rt-th rt-resizable-header"
                  >
                    <div className="rt-resizable-header-content">
                      {column.render("Header")}
                    </div>
                    <div {...column.getResizerProps()} className="rt-resizer" />
                  </div>
                );
              })}
            </div>
          ))}
        </div>
        
        <div className="rt-tbody">
          
            <FixedSizeList
          height={700}
          itemCount={rows.length}
          itemSize={35}
          width={totalColumnsWidth+scrollBarSize}
        >
          {RenderRow}
          {/* <div {...getTableBodyProps()} className="rt-tr-group">
            {rows.map((row, ind) => {
              prepareRow(row);
              return (
                <React.Fragment key={row.id}>
                  <div
                    {...row.getRowProps()}
                    className={classnames(
                      "rt-tr",
                      ind % 2 === 0 ? "-odd" : "-even",
                      trClassName
                    )}
                  >
                    {row.cells.map((cell) => {
                      return (
                        <div
                          {...getTdProps(cell)}
                          {...cell.getCellProps()}
                          className={classnames("rt-td", cell.column.className)}
                        >
                          {cell.render("Cell")}
                        </div>
                      );
                    })}
                  </div>
                  {row.isExpanded ? SubComponent({ row }) : null}
                </React.Fragment>
              );
            })}
          </div> */}
          </FixedSizeList>
          <tfoot className="rt-tfoot">
        {footerGroups.map(group => (
          <tr {...group.getFooterGroupProps()}>
            {group.headers.map(column => (
              <td key={column} {...column.getFooterProps()}>{column.render('Footer')}</td>
            ))}
          </tr>
        ))}
      </tfoot>
        </div>
      </div>
      <div className={classnames("-loading", loading ? "-active" : "")}>
        <div className="-loading-inner">Loading...</div>
      </div>
    </div>
  );
};

export default React.memo(ReactTable)
