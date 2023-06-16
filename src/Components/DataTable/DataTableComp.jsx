import React, { useState } from 'react'
import { BsFillCaretDownFill } from "react-icons/bs";
import { FaSave } from 'react-icons/fa';
import ReactTable from './ReactTable';
import MaterialReactTable from 'material-react-table';
import _ from "lodash";
import "jspdf-autotable";
import Multiselect from 'multiselect-react-dropdown';
import { PopupMenu } from './ContextMenu';
import html2canvas from 'html2canvas'
import { TelegramSendpic_API, UpdateColumns_API } from '../Redux/API';
import { Notification } from '../Notification';

import './DataTable.scss'
import { useEffect } from 'react';
// import withFixedColumns from "react-table-hoc-fixed-columns";
// import "react-table-hoc-fixed-columns/lib/styles.css";


// const ReactTableFixedColumns = withFixedColumns(ReactTable);
const DataTableComp = (props, { goupbyfilter, savebtn }) => {
    // constructor(props, { goupbyfilter, savebtn, pagination }) {
    //     super(props);
    //     tableref = React.createRef();
    //     divRef = React.createRef();
    //     state = {
    //         columns: props.columns,
    //         grpName: [],
    //         grpby: [],
    //         popup: {
    //             visible: false,
    //             x: 0, y: 0
    //         },
    //         filter: false,
    //         pagination: false,
    //         showUserRole: false,
    //         fullScreen: false,
    //         NotifyData:
    //         {
    //             successFlag: false,
    //             successMsg: 'success msg',
    //             errorFlag: false,
    //             errorMsg: 'error msg',
    //             loadingFlag: false,
    //             loadingMsg: 'loading msg',
    //             activesession: false
    //         },
    //         columnVisibilityBtn: false,
    //     };

    // }
    const [columns, setcolumns] = useState(props.columns)
    const [grpName, setgrpName] = useState([])
    const [grpby, setgrpby] = useState([])
    const [popup, setpopup] = useState({
        visible: false,
        x: 0, y: 0
    })
    const [filter, setfilter] = useState(false)
    const [pagination, setpagination] = useState(false)
    const [showUserRole, setshowUserRole] = useState(false)
    const [fullScreen, setfullScreen] = useState(false)
    const [NotifyData, setNotifyData] = useState({
        successFlag: false,
        successMsg: 'success msg',
        errorFlag: false,
        errorMsg: 'error msg',
        loadingFlag: false,
        loadingMsg: 'loading msg',
        activesession: false
    })
    const [columnVisibilityBtn, setcolumnVisibilityBtn] = useState(false)
    const tableref = React.createRef();
    const divRef = React.createRef();

    const FilterBtn = () => {
        filter = !filter;
        localStorage.setItem(props.id + 'filter', JSON.stringify(filter))

    }

    const visibilityBtn = () => {
        columnVisibilityBtn = !columnVisibilityBtn;
        localStorage.setItem(props.id + 'columnvisi', JSON.stringify(columnVisibilityBtn))
    }

    const PagHideShow = () => {
        pagination = !pagination;
        localStorage.setItem(props.id + 'pagination', JSON.stringify(pagination))
    }

    const FullScreenHandle = (myRef) => {
        setfullScreen(prev => !prev.fullScreen);
        var elem = document.querySelector('#' + myRef.current.id);
        if (!elem.requestFullscreen()) {
            elem.requestFullscreen();
        }
        else {
            document.exitFullscreen();
        }
    }
    const onRow = (record, rowInfo, Cell) => ({
        onContextMenu: event => {
            event.preventDefault()
            console.log("clicked")
            if (!popup.visible) {
                const that = this
                document.addEventListener(`click`, function onClickInsideside1() {
                    setpopup({ visible: false })
                    document.removeEventListener(`click`, onClickInsideside1)
                })
            }
            setpopup({
                record,
                visible: true,
                x: event.clientX,
                y: event.clientY
            })
        }
    })

    const onTableData = (state, rowInfo, column, instance) => {

        return {
            onClick: () => {
                let UserId = rowInfo.original['userid'];
                let colName = column['Header']

                let TotalQty = 0
                console.log(UserId, colName)

                let NetPositionTbData = props.netposition;
                console.log('NetPositionTbData', NetPositionTbData);
                NetPositionTbData = NetPositionTbData.filter(x => !x['symbol'].startsWith('NIFTY'))

                let result = []

                if (NetPositionTbData) {
                    TotalQty = 0
                    // TotalHedgeOutQty = 0
                    for (let i = 0; i < NetPositionTbData.length; i++) {

                        if (NetPositionTbData[i]['userid'] == UserId) {
                            if (colName == 'nsefutqty') {
                                if (NetPositionTbData[i]['opttype'] == 'XX') {
                                    result.push(NetPositionTbData[i])
                                }
                            }
                            else if (colName == 'nseceqty') {
                                if (NetPositionTbData[i]['opttype'] == 'CE') {
                                    result.push(NetPositionTbData[i])
                                }
                            }

                            else if (colName == 'nsepeqty') {
                                if (NetPositionTbData[i]['opttype'] == 'PE') {
                                    result.push(NetPositionTbData[i])
                                }
                            }
                        }
                    }
                }
                console.log(result);
            }
        }
    }
    const groupby = (e) => {
        grpby = e;
        setgrpby(e,
            localStorage.setItem(props.id, JSON.stringify(grpby)));
    }
    // componentDidMount() {

    //     if (localStorage.getItem((props.id + 'filter'))) {
    //         var filter1 = JSON.parse(localStorage.getItem((props.id + 'filter')))
    //         setfilter( filter1 )
    //     }
    //     if (localStorage.getItem((props.id + 'pagination'))) {
    //         var pagination1 = JSON.parse(localStorage.getItem((props.id + 'pagination')))
    //         setpagination(pagination1 )
    //     }
    //     if (localStorage.getItem((props.id + 'columnvisi'))) {
    //         var columnVisibilityBtn1 = JSON.parse(localStorage.getItem((props.id + 'columnvisi')))
    //         setcolumnVisibilityBtn( columnVisibilityBtn1 )
    //     }

    // }
    useEffect(() => {
        if (localStorage.getItem((props.id + 'filter'))) {
            var filter1 = JSON.parse(localStorage.getItem((props.id + 'filter')))
            setfilter(filter1)
        }
        if (localStorage.getItem((props.id + 'pagination'))) {
            var pagination1 = JSON.parse(localStorage.getItem((props.id + 'pagination')))
            setpagination(pagination1)
        }
        if (localStorage.getItem((props.id + 'columnvisi'))) {
            var columnVisibilityBtn1 = JSON.parse(localStorage.getItem((props.id + 'columnvisi')))
            setcolumnVisibilityBtn(columnVisibilityBtn1)
        }
    }, [])


    const onClickUserRole = () => {
        setshowUserRole(!showUserRole
        );
    }

    const CloseError = () => {
        setNotifyData({ errorFlag: false })
    }

    const CloseSuccess = () => {
        setNotifyData({ successFlag: false })
    }

    const SendPic = async (image, name) => {
        const ps1 = new Promise((resolve, reject) => {
            resolve(TelegramSendpic_API({ 'imgdata': image.split('data:image/jpeg;base64,')[1], 'tablename': name }))
        })
        const rs = await Promise.all([ps1]).then((val) => {
            return val[0]['data'];
        }).catch((err) => {
            setNotifyData({ loadingFlag: false })
            setNotifyData({ successFlag: true, successMsg: err['message'] })
            console.log("*********", err.response.status);
            (err.response.status === 401) && setTimeout(() => { window.location.assign(window.location.origin) }, 1000);
            return err["response"]["data"];
        })
        if (rs['type'] === 'success') {
            setNotifyData({ loadingFlag: false })
            setNotifyData({ successFlag: true, successMsg: rs['message'] })
        } else {
            setNotifyData({ loadingFlag: false })
            setNotifyData({ errorFlag: true, errorMsg: rs['message'] })
        }
    }
    const SubmitScreenShot = async (myRef) => {
        setNotifyData({ loadingFlag: true, loadingMsg: 'Capturing image...' })
        const captureElement = document.querySelector('#' + myRef.current.id);
        // const captureElement = document.querySelector('#balance');
        html2canvas(captureElement)
            .then(canvas => {
                canvas.style.display = 'none';
                return canvas;
            })
            .then(canvas => {
                canvas.remove();
                SendPic(canvas.toDataURL('image/png').replace('image/png', 'image/jpeg'), myRef.current.id)
            });

    }



    const options = ["groupname", "symbol", "userid", "accountcode", "expirydate", "excode", "sripcode", "securitytype", "strikeprice"];
    return (
        <div
            ref={divRef}
            id={props.id}
            style={{
                padding: `${fullScreen ? "1rem" : ""}`
            }}
            className="tableDivSection"
        >
            {/* <button onClick={myFunction}>Toggle dark mode</button> */}
            <div className='filter'>
                <div className='select-dropdown'>
                    {columnVisibilityBtn
                        &&
                        <div className='select-hideshow-with-savebtn'>
                            <div className="select-hideshow">
                                <div className="select-userid" onClick={onClickUserRole} >
                                    <div className="form-control form-control-alternative">
                                        <div className="dropdown-btn">Column visibility
                                            <span className='label-icon'><BsFillCaretDownFill /></span>
                                        </div>
                                    </div>
                                </div>
                                <div className="dropdown">
                                    {showUserRole &&
                                        <ul className="items">
                                            {props.columns.map((column) => (
                                                <Checkbox
                                                    key={column.Header}
                                                    label={column.Header}
                                                    isSelected={column.show}
                                                    isLoading={true}
                                                    onCheckboxChange={() => props.handleColumnVisibility({ header: column.Header, id: props.id })}
                                                />
                                            ))
                                            }
                                        </ul>
                                    }
                                </div>
                            </div>
                            <div>
                                <span
                                    className='column-save-btn'
                                    onClick={async (e) => {
                                        e.preventDefault();
                                        const ps1 = new Promise((resolve, reject) => {
                                            resolve(UpdateColumns_API({ id: props.userid, table_id: props.id, access_columns: (props.columns.filter(val => { return val.show === false }).map(el => { return el.Header }).toString()) ? props.columns.filter(val => { return val.show === false }).map(el => { return el.Header }).toString() : 'all' }))
                                        })
                                        const rs = await Promise.all([ps1]).then((val) => {
                                            return val[0]['data'];
                                        }).catch((err) => {
                                            setNotifyData({ loadingFlag: false  })
                                            setNotifyData({ successFlag: true, successMsg: err['message']  })
                                            console.log("*********", err.response.status);
                                            (err.response.status === 401) && setTimeout(() => { window.location.assign(window.location.origin) }, 1000);
                                            return err["response"]["data"];
                                        })
                                        if (rs['type'] === 'success') {
                                            setNotifyData({ loadingFlag: false  })
                                            setNotifyData({  successFlag: true, successMsg: rs['message']  })
                                        } else {
                                            setNotifyData({  loadingFlag: false  })
                                            setNotifyData({ errorFlag: true, errorMsg: rs['message']  })
                                        }

                                    }}
                                >
                                    <FaSave />
                                </span>
                            </div>

                        </div>
                    }
                    {props.goupbyfilter
                        &&
                        <div className='grouping'>
                            <Multiselect
                                options={props.columns && props.columns.map((el) => el.Header)}
                                // options={options}
                                isObject={false}
                                onSelect={groupby}
                                // onSelect={(e)=>{setState({grpby:e})}}
                                selectedValues={grpby}
                                onRemove={groupby}
                                showCheckbox={true}
                                hidePlaceholder={true}
                                showArrow={true}
                                isSelected={true}
                                placeholder="Groupby Columns"
                            />
                        </div>
                    }

                </div>
                {/* <h6>date range</h6> */}
                {/* <div className='features-icon'>
                        <div className="screenManage">
                            <span className='snapshot'
                                onClick={async (e) => {
                                    await setState(prev => ({ fullScreen: !prev.fullScreen }));
                                    var elem = document.querySelector('#' + divRef.current.id);
                                    if (!elem.requestFullscreen()) {
                                        elem.requestFullscreen();

                                    }
                                    else {
                                        document.exitFullscreen();
                                    }
                                }}>
                                <CgMaximize />
                            </span>
                        </div>
                        <div>
                            <span className='snapshot' onClick={(e) => SubmitScreenShot(tableref)}><AiFillCamera /></span>
                        </div>
                    </div> */}
            </div>
            <div
                ref={tableref}
                id={props.id}
                data={props.data}
            >
                {/* {buildContextMenuJSX()}
                    <ContextMenuTrigger id="sample-menu"> */}

                <ReactTable
                    data={props.data}
                    
                    
                    // className="-highlight"
                    // resolveData={data => data.map(row => row)} 
                    columns={props.columns}
                    filterable={filter}
                    minRows={0}
                    defaultSorted={[{ id: "referenceno", desc: true }]}
                    showPagination={pagination}
                    defaultPageSize={0}
                    freezeWhenExpanded={true}
                    pivotBy={grpby === "" ? [] : grpby}
                    getTrProps={onRow}
                    noDataText={'No Data Found'}
                    className={`${fullScreen ? 'full-screen' : ""}`}
                    // getTdProps={props.getTdProps}
                    getTdProps={onTableData}

                />
                {/* <MaterialReactTable
      columns={props.columns}
      data={props.data} //10,000 rows
      enableBottomToolbar={false}
    //   enableColumnVirtualization
    //   enableGlobalFilterModes
      enablePagination={false}
      enablePinning
      enableRowNumbers
    //   enableRowVirtualization
      muiTableContainerProps={{ sx: { maxHeight: '600px' } }}
    //   onSortingChange={setSorting}
    //   state={{  sorting }}
    //   rowVirtualizerInstanceRef={rowVirtualizerInstanceRef} //optional
    //   rowVirtualizerProps={{ overscan: 5 }} //optionally customize the row virtualizer
    //   columnVirtualizerProps={{ overscan: 2 }} //optionally customize the column virtualizer
    /> */}
                <PopupMenu
                    {...popup}
                    data={props.data}

                    rowFilterVisiblity={filter}
                    filterBtn={FilterBtn}

                    paginationVisiblity={pagination}
                    paginationBtn={PagHideShow}

                    columnVisibilityBtn={columnVisibilityBtn}
                    visibilityBtn={visibilityBtn}

                    tableref={tableref}
                    id={props.id}

                    SubmitScreenShot={SubmitScreenShot}

                    fullScreen={fullScreen}
                    fullScreenHandle={() => FullScreenHandle(tableref)}
                />
            </div>
            <Notification
                notify={NotifyData}
                CloseError={CloseError}
                CloseSuccess={CloseSuccess}
            />
        </div >

    )
}
export default DataTableComp
const Checkbox = ({ label, isSelected, onCheckboxChange, isLoading }) => (
    <div>
        <label>
            <input
                type="checkbox"
                name={label}
                checked={isSelected}
                onChange={onCheckboxChange}
                className="form-check-input"
                style={{ marginRight: '4px' }}
            />
            {label}
        </label>
    </div>
);