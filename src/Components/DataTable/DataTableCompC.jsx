// import React from 'react'
// import { BsFillCaretDownFill } from "react-icons/bs";
// import { FaSave } from 'react-icons/fa';
// import ReactTable from 'react-table';
// import MaterialReactTable from 'material-react-table';
// import _ from "lodash";
// import "jspdf-autotable";
// import Multiselect from 'multiselect-react-dropdown';
// import { PopupMenu } from './ContextMenu';
// import html2canvas from 'html2canvas'
// import { TelegramSendpic_API, UpdateColumns_API } from '../Redux/API';
// import { Notification } from '../Notification';

// import './DataTable.scss'
// // import withFixedColumns from "react-table-hoc-fixed-columns";
// // import "react-table-hoc-fixed-columns/lib/styles.css";


// // const ReactTableFixedColumns = withFixedColumns(ReactTable);


// export default class DataTableComp extends React.PureComponent {
//     constructor(props, { goupbyfilter, savebtn, pagination }) {
//         super(props);
//         this.tableref = React.createRef();
//         this.divRef = React.createRef();
//         this.state = {
//             columns: this.props.columns,
//             grpName: [],
//             grpby: [],
//             popup: {
//                 visible: false,
//                 x: 0, y: 0
//             },
//             filter: false,
//             pagination: false,
//             showUserRole: false,
//             fullScreen: false,
//             NotifyData:
//             {
//                 successFlag: false,
//                 successMsg: 'success msg',
//                 errorFlag: false,
//                 errorMsg: 'error msg',
//                 loadingFlag: false,
//                 loadingMsg: 'loading msg',
//                 activesession: false
//             },
//             columnVisibilityBtn: false,
//         };

//     }

//     FilterBtn = () => {
//         this.state.filter = !this.state.filter;
//         localStorage.setItem(this.props.id + 'filter', JSON.stringify(this.state.filter))

//     }

//     visibilityBtn = () => {
//         this.state.columnVisibilityBtn = !this.state.columnVisibilityBtn;
//         localStorage.setItem(this.props.id + 'columnvisi', JSON.stringify(this.state.columnVisibilityBtn))
//     }

//     PagHideShow = () => {
//         this.state.pagination = !this.state.pagination;
//         localStorage.setItem(this.props.id + 'pagination', JSON.stringify(this.state.pagination))
//     }

//     FullScreenHandle = (myRef) => {
//         this.setState(prev => ({ fullScreen: !prev.fullScreen }));
//         var elem = document.querySelector('#' + myRef.current.id);
//         if (!elem.requestFullscreen()) {
//             elem.requestFullscreen();
//         }
//         else {
//             document.exitFullscreen();
//         }
//     }
//     onRow = (record, rowInfo, Cell) => ({
//         onContextMenu: event => {
//             event.preventDefault()
//             if (!this.state.visible) {
//                 const that = this
//                 document.addEventListener(`click`, function onClickInsideside1() {
//                     that.setState({ popup: { visible: false } })
//                     document.removeEventListener(`click`, onClickInsideside1)
//                 })
//             }
//             this.setState({
//                 popup: {
//                     record,
//                     visible: true,
//                     x: event.clientX,
//                     y: event.clientY
//                 }
//             })
//         }
//     })

//     onTableData = (state, rowInfo, column, instance) => {

//         return {
//             onClick: () => {
//                 let UserId = rowInfo.original['userid'];
//                 let colName = column['Header']

//                 let TotalQty = 0
//                 console.log(UserId, colName)

//                 let NetPositionTbData = this.props.netposition;
//                 console.log('NetPositionTbData', NetPositionTbData);
//                 NetPositionTbData = NetPositionTbData.filter(x => !x['symbol'].startsWith('NIFTY'))

//                 let result = []

//                 if (NetPositionTbData) {
//                     TotalQty = 0
//                     // TotalHedgeOutQty = 0
//                     for (let i = 0; i < NetPositionTbData.length; i++) {

//                         if (NetPositionTbData[i]['userid'] == UserId) {
//                             if (colName == 'nsefutqty') {
//                                 if (NetPositionTbData[i]['opttype'] == 'XX') {
//                                     result.push(NetPositionTbData[i])
//                                 }
//                             }
//                             else if (colName == 'nseceqty') {
//                                 if (NetPositionTbData[i]['opttype'] == 'CE') {
//                                     result.push(NetPositionTbData[i])
//                                 }
//                             }

//                             else if (colName == 'nsepeqty') {
//                                 if (NetPositionTbData[i]['opttype'] == 'PE') {
//                                     result.push(NetPositionTbData[i])
//                                 }
//                             }
//                         }
//                     }
//                 }
//                 console.log(result);
//             }
//         }
//     }
//     groupby = (e) => {
//         this.state.grpby = e;
//         this.setState({ grpby: e },
//             localStorage.setItem(this.props.id, JSON.stringify(this.state.grpby)));
//     }
//     componentDidMount() {

//         if (localStorage.getItem((this.props.id + 'filter'))) {
//             var filter1 = JSON.parse(localStorage.getItem((this.props.id + 'filter')))
//             this.setState({ filter: filter1 })
//         }
//         if (localStorage.getItem((this.props.id + 'pagination'))) {
//             var pagination1 = JSON.parse(localStorage.getItem((this.props.id + 'pagination')))
//             this.setState({ pagination: pagination1 })
//         }
//         if (localStorage.getItem((this.props.id + 'columnvisi'))) {
//             var columnVisibilityBtn1 = JSON.parse(localStorage.getItem((this.props.id + 'columnvisi')))
//             this.setState({ columnVisibilityBtn: columnVisibilityBtn1 })
//         }

//     }

//     onClickUserRole = () => {
//         this.setState({
//             showUserRole: !this.state.showUserRole
//         });
//     }

//     CloseError = () => {
//         this.setState({ NotifyData: { errorFlag: false } })
//     }

//     CloseSuccess = () => {
//         this.setState({ NotifyData: { successFlag: false } })
//     }

//     SendPic = async (image, name) => {
//         const ps1 = new Promise((resolve, reject) => {
//             resolve(TelegramSendpic_API({ 'imgdata': image.split('data:image/jpeg;base64,')[1], 'tablename': name }))
//         })
//         const rs = await Promise.all([ps1]).then((val) => {
//             return val[0]['data'];
//         }).catch((err) => {
//             this.setState({ NotifyData: { loadingFlag: false } })
//             this.setState({ NotifyData: { successFlag: true, successMsg: err['message'] } })
//             console.log("*********", err.response.status);
//             (err.response.status === 401) && setTimeout(() => { window.location.assign(window.location.origin) }, 1000);
//             return err["response"]["data"];
//         })
//         if (rs['type'] === 'success') {
//             this.setState({ NotifyData: { loadingFlag: false } })
//             this.setState({ NotifyData: { successFlag: true, successMsg: rs['message'] } })
//         } else {
//             this.setState({ NotifyData: { loadingFlag: false } })
//             this.setState({ NotifyData: { errorFlag: true, errorMsg: rs['message'] } })
//         }
//     }
//     SubmitScreenShot = async (myRef) => {
//         this.setState({ NotifyData: { loadingFlag: true, loadingMsg: 'Capturing image...' } })
//         const captureElement = document.querySelector('#' + myRef.current.id);
//         // const captureElement = document.querySelector('#balance');
//         html2canvas(captureElement)
//             .then(canvas => {
//                 canvas.style.display = 'none';
//                 return canvas;
//             })
//             .then(canvas => {
//                 canvas.remove();
//                 this.SendPic(canvas.toDataURL('image/png').replace('image/png', 'image/jpeg'), myRef.current.id)
//             });

//     }


//     render() {
//         const options = ["groupname", "symbol", "userid", "accountcode", "expirydate", "excode", "sripcode", "securitytype", "strikeprice"];
//         return (
//             <div
//                 ref={this.divRef}
//                 id={this.props.id}
//                 style={{
//                     padding: `${this.state.fullScreen ? "1rem" : ""}`
//                 }}
//                 className="tableDivSection"
//             >
//                 {/* <button onClick={this.myFunction}>Toggle dark mode</button> */}
//                 <div className='filter'>
//                     <div className='select-dropdown'>
//                         {this.state.columnVisibilityBtn
//                             &&
//                             <div className='select-hideshow-with-savebtn'>
//                                 <div className="select-hideshow">
//                                     <div className="select-userid" onClick={this.onClickUserRole} >
//                                         <div className="form-control form-control-alternative">
//                                             <div className="dropdown-btn">Column visibility
//                                                 <span className='label-icon'><BsFillCaretDownFill /></span>
//                                             </div>
//                                         </div>
//                                     </div>
//                                     <div className="dropdown">
//                                         {this.state.showUserRole &&
//                                             <ul className="items">
//                                                 {this.props.columns.map((column) => (
//                                                     <Checkbox
//                                                         key={column.Header}
//                                                         label={column.Header}
//                                                         isSelected={column.show}
//                                                         isLoading={true}
//                                                         onCheckboxChange={() => this.props.handleColumnVisibility({ header: column.Header, id: this.props.id })}
//                                                     />
//                                                 ))
//                                                 }
//                                             </ul>
//                                         }
//                                     </div>
//                                 </div>
//                                 <div>
//                                     <span
//                                         className='column-save-btn'
//                                         onClick={async (e) => {
//                                             e.preventDefault();
//                                             const ps1 = new Promise((resolve, reject) => {
//                                                 resolve(UpdateColumns_API({ id: this.props.userid, table_id: this.props.id, access_columns: (this.props.columns.filter(val => { return val.show === false }).map(el => { return el.Header }).toString()) ? this.props.columns.filter(val => { return val.show === false }).map(el => { return el.Header }).toString() : 'all' }))
//                                             })
//                                             const rs = await Promise.all([ps1]).then((val) => {
//                                                 return val[0]['data'];
//                                             }).catch((err) => {
//                                                 this.setState({ NotifyData: { loadingFlag: false } })
//                                                 this.setState({ NotifyData: { successFlag: true, successMsg: err['message'] } })
//                                                 console.log("*********", err.response.status);
//                                                 (err.response.status === 401) && setTimeout(() => { window.location.assign(window.location.origin) }, 1000);
//                                                 return err["response"]["data"];
//                                             })
//                                             if (rs['type'] === 'success') {
//                                                 this.setState({ NotifyData: { loadingFlag: false } })
//                                                 this.setState({ NotifyData: { successFlag: true, successMsg: rs['message'] } })
//                                             } else {
//                                                 this.setState({ NotifyData: { loadingFlag: false } })
//                                                 this.setState({ NotifyData: { errorFlag: true, errorMsg: rs['message'] } })
//                                             }

//                                         }}
//                                     >
//                                         <FaSave />
//                                     </span>
//                                 </div>

//                             </div>
//                         }
//                         {this.props.goupbyfilter
//                             &&
//                             <div className='grouping'>
//                                 <Multiselect
//                                     options={this.props.columns && this.props.columns.map((el) => el.Header)}
//                                     // options={options}
//                                     isObject={false}
//                                     onSelect={this.groupby}
//                                     // onSelect={(e)=>{this.setState({grpby:e})}}
//                                     selectedValues={this.state.grpby}
//                                     onRemove={this.groupby}
//                                     showCheckbox={true}
//                                     hidePlaceholder={true}
//                                     showArrow={true}
//                                     isSelected={true}
//                                     placeholder="Groupby Columns"
//                                 />
//                             </div>
//                         }

//                     </div>
//                     {/* <h6>date range</h6> */}
//                     {/* <div className='features-icon'>
//                         <div className="screenManage">
//                             <span className='snapshot'
//                                 onClick={async (e) => {
//                                     await this.setState(prev => ({ fullScreen: !prev.fullScreen }));
//                                     var elem = document.querySelector('#' + this.divRef.current.id);
//                                     if (!elem.requestFullscreen()) {
//                                         elem.requestFullscreen();

//                                     }
//                                     else {
//                                         document.exitFullscreen();
//                                     }
//                                 }}>
//                                 <CgMaximize />
//                             </span>
//                         </div>
//                         <div>
//                             <span className='snapshot' onClick={(e) => this.SubmitScreenShot(this.tableref)}><AiFillCamera /></span>
//                         </div>
//                     </div> */}
//                 </div>
//                 <div
//                     ref={this.tableref}
//                     id={this.props.id}
//                     data={this.props.data}
//                 >
//                     {/* {this.buildContextMenuJSX()}
//                     <ContextMenuTrigger id="sample-menu"> */}

//                     <ReactTable
//                         data={this.props.data}
//                         // className="-highlight"
//                         // resolveData={data => data.map(row => row)} 
//                         columns={this.props.columns}
//                         filterable={this.state.filter}
//                         minRows={0}
//                         defaultSorted={[{ id: "referenceno", desc: true }]}
//                         showPagination={this.state.pagination}
//                         defaultPageSize={100}
//                         freezeWhenExpanded={true}
//                         pivotBy={this.state.grpby === "" ? [] : this.state.grpby}
//                         getTrProps={this.onRow}
//                         noDataText={'No Data Found'}
//                         className={`${this.state.fullScreen ? 'full-screen' : ""}`}
//                         // getTdProps={this.props.getTdProps}
//                         getTdProps={this.onTableData}

//                     />
//                     <PopupMenu
//                         {...this.state.popup}
//                         data={this.props.data}

//                         rowFilterVisiblity={this.state.filter}
//                         filterBtn={this.FilterBtn}

//                         paginationVisiblity={this.state.pagination}
//                         paginationBtn={this.PagHideShow}

//                         columnVisibilityBtn={this.state.columnVisibilityBtn}
//                         visibilityBtn={this.visibilityBtn}

//                         tableref={this.tableref}
//                         id={this.props.id}

//                         SubmitScreenShot={this.SubmitScreenShot}

//                         fullScreen={this.state.fullScreen}
//                         fullScreenHandle={() => this.FullScreenHandle(this.tableref)}
//                     />
//                 </div>
//                 <Notification
//                     notify={this.state.NotifyData}
//                     CloseError={this.CloseError}
//                     CloseSuccess={this.CloseSuccess}
//                 />
//             </div >

//         )
//     }
// }
// const Checkbox = ({ label, isSelected, onCheckboxChange, isLoading }) => (
//     <div>
//         <label>
//             <input
//                 type="checkbox"
//                 name={label}
//                 checked={isSelected}
//                 onChange={onCheckboxChange}
//                 className="form-check-input"
//                 style={{ marginRight: '4px' }}
//             />
//             {label}
//         </label>
//     </div>
// );