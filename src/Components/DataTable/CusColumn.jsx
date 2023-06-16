import _ from "lodash";
import React from "react";
import { numberWithCommas } from "../Utilities/Utilities";

export const CusColumn = (data, excludecolumns = []) => {
    let data_after_exclusion = JSON.parse(JSON.stringify(data));

    for (let i = 0; i < excludecolumns.length; i++) {
        for (let property in data_after_exclusion) {
            if (property == excludecolumns[i]) {
                delete data_after_exclusion[excludecolumns[i]]
            }
        }
    }

    return Object.keys(data_after_exclusion).map((key, i) => {
        if (key === 'id') {
            return {
                Header: key,
                accessor: key,
                show: true,
                Cell: (Cell) => {
                    return <span>
                        {Cell.value}
                    </span>
                },
            }
        }
        else if (key.indexOf('mtm') > -1) {
            return {
                Header: key,
                accessor: key,
                show: true,
                Cell: (Cell) => {
                    return <span
                        style={{
                            color: (Cell.value < 0) ? "red" : (Cell.value > 0) ? "rgb(0, 128, 0)" : null,
                            fontWeight: '700',
                        }}>
                        {typeof (Cell.value) === 'number' ? numberWithCommas(parseInt(Cell.value)) : Cell.value}
                    </span>
                },
                width: 130,
                Footer: (row) => {
                    const name = row.column.Header;
                    const ltpsum = (_.round(_.sum((row.data).map((dt) => { return dt[name] })), 0) !== 0) ? _.round(_.sum((row.data).map((dt) => { return dt[name] })), 0) : "";
                    return <div >{numberWithCommas(ltpsum)}</div>
                }
            }
        }
        else if (key.indexOf('share') > -1) {
            return {
                Header: key,
                accessor: key,
                show: true,
                Cell: (Cell) => {
                    return <span
                        style={{
                            color: "#ff9800",
                            fontWeight: '700',
                        }}>
                        {typeof (Cell.value) === 'number' ? numberWithCommas(parseInt(Cell.value)) : Cell.value}
                    </span>
                },
                width: 130,
                Footer: (row) => {
                    const name = row.column.Header;
                    const ltpsum = (_.round(_.sum((row.data).map((dt) => { return dt[name] })), 0) !== 0) ? _.round(_.sum((row.data).map((dt) => { return dt[name] })), 0) : "";
                    return <div >{numberWithCommas(ltpsum)}</div>
                }
            }
        }
        else if (key.indexOf('amt') > -1) {
            return {
                Header: key,
                accessor: key,
                show: true,
                Cell: (Cell) => {
                    return <span>
                        {typeof (Cell.value) === 'number' ? numberWithCommas(parseInt(Cell.value)) : Cell.value}
                    </span>
                },
                width: 130,
                Footer: (row) => {
                    const name = row.column.Header;
                    const ltpsum = (_.round(_.sum((row.data).map((dt) => { return dt[name] })), 0) !== 0) ? _.round(_.sum((row.data).map((dt) => { return dt[name] })), 0) : "";
                    return <div >{numberWithCommas(ltpsum)}</div>
                }
            }
        }
        else if (key.indexOf('qty') > -1) {
            return {
                Header: key,
                accessor: key,
                show: true,
                Cell: (Cell) => {
                    return <span>
                        {typeof (Cell.value) === 'number' ? parseInt(Cell.value) : Cell.value}
                    </span>
                },

                Footer: (row) => {
                    const name = row.column.Header;
                    const ltpsum = (_.round(_.sum((row.data).map((dt) => { return dt[name] })), 0) !== 0) ? _.round(_.sum((row.data).map((dt) => { return dt[name] })), 0) : "";
                    return <div >{ltpsum}</div>
                }
            }
        }
        else if (key.indexOf('hedgratio') > -1) {
            return {
                Header: key,
                accessor: key,
                show: true,
                Cell: (Cell) => {
                    return <span>
                        {typeof (Cell.value) === 'number' ? parseInt(Cell.value) : Cell.value}
                    </span>
                },

                Footer: (row) => {
                    const name = row.column.Header;
                    const ltpsum = (_.round(_.sum((row.data).map((dt) => { return dt[name] })), 0) !== 0) ? _.round(_.sum((row.data).map((dt) => { return dt[name] })), 0) : "";
                    return <div >{""}</div>
                }
            }
        }
        else if (key.indexOf('out') > -1) {
            return {
                Header: key,
                accessor: key,
                show: true,
                Cell: (Cell) => {
                    return <h6
                        style={{
                            backgroundColor: (Cell.value > -200 && Cell.value < 200) ? null : "red",
                            fontWeight: '700',
                            padding: '7px 4px 7px 3px',
                            marginBottom: '0'
                        }} >
                        {typeof (Cell.value) === 'number' ? parseInt(Cell.value) : Cell.value}
                    </h6 >
                },
                Footer: (row) => {
                    const name = row.column.Header;
                    const ltpsum = (_.round(_.sum((row.data).map((dt) => { return dt[name] })), 0) !== 0) ? _.round(_.sum((row.data).map((dt) => { return dt[name] })), 0) : "";
                    return <div >{ltpsum}</div>
                }
            }
        }
        // else if (key === 'spreadside') {
        //     return {
        //         Header: key,
        //         accessor: key,
        //         show: true,
        //         Cell: (Cell) => {
        //             return <span
        //                 style={{
        //                     color: (Cell.value === 'Buy') ? "red" : "rgb(0, 128, 0)",
        //                     fontWeight: '700',
        //                 }}>
        //                 {typeof (Cell.value) === 'number' ? Cell.value.toFixed(2) : Cell.value}

        //             </span>
        //         },

        //         Footer: (row) => {
        //             const name = row.column.Header;
        //             const ltpsum = (_.round(_.sum((row.data).map((dt) => { return dt[name] })), 2) !== 0) ?
        //                 _.round(_.sum((row.data).map((dt) => { return dt[name] })), 2) : "";
        //             return <div >{ltpsum}</div>
        //         }
        //     }
        // }

        else if (key === 'ltp') {
            return {
                Header: key,
                accessor: key,
                show: true,
                Cell: (Cell, prev) => {
                    return <span
                        style={{
                            color: (Cell.value === 0) ? 'red' : 'green',
                            // color: ( Cell.value < prev.value) ? 'green' : 'red',
                        }}>
                        {typeof (Cell.value) === 'number' ? Cell.value.toFixed(2) : Cell.value}
                    </span >
                },

                Footer: (row) => {


                    return <div ></div>
                }
            }
        }


        else if (key === 'bfrate') {
            return {
                Header: key,
                accessor: key,
                show: true,
                Cell: (Cell) => {
                    return <span
                        style={{
                            color: (Cell.value === 0) && 'red',
                        }}>
                        {typeof (Cell.value) === 'number' ? Cell.value.toFixed(2) : Cell.value}
                    </span>
                },

                Footer: (row) => {

                    return <div ></div>
                }
            }
        }
        // else if (key === 'userid' || key === 'groupname' || key === 'segment' || key === 'accountcode' || key === 'exchange' || key === 'expirydate' || key === 'symbol' || key === 'scripcode' || key === 'securitytype' || key === 'opttype' || key === 'strikeprice') {
        //     return {
        //         Header: key,
        //         accessor: key,
        //         show: true,
        //         fixed: 'left',
        //         Cell: (Cell) => {
        //             return <span
        //             >
        //                 {typeof (Cell.value) === 'number' ? Cell.value : Cell.value}
        //             </span>
        //         },

        //         Footer: (row) => {

        //             return <div ></div>
        //         }
        //     }
        // }
        else {
            return {
                Header: key,
                accessor: key,
                show: true,
                Cell: (Cell) => {
                    return <span>
                        {typeof (Cell.value) === 'number' ? Cell.value.toFixed(2) : Cell.value}
                    </span>
                },

                // getProps: (state, rowInfo, column) => {
                //     if (rowInfo) {
                //         return {
                //             style: {
                //                 color: (rowInfo && rowInfo.row.spreadside === 'Buy') ? 'red' : 'green',
                //             },
                //         };
                //     }
                //     else {
                //         return { rowInfo }
                //     }
                // },

                Footer: (row) => {
                    const name = row.column.Header;
                    const ltpsum = (_.round(_.sum((row.data).map((dt) => { return typeof (dt[name]) === 'string' ? "" : dt[name] })), 2) !== 0) ?
                        _.round(_.sum((row.data).map((dt) => { return typeof (dt[name]) === 'string' ? "" : dt[name] })), 2) : "";
                    return <div >{ltpsum}</div>
                }
            }
        }
    });
} 