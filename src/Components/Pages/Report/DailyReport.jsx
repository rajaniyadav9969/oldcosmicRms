import React, { memo, useState ,useRef,useEffect} from 'react'
import { Form, Row, Col, InputGroup } from 'react-bootstrap'
import { FaFileInvoiceDollar, FaUser, FaUsersCog } from 'react-icons/fa'
import { MdGroup } from "react-icons/md";
import { BsCalendar2EventFill, BsCurrencyExchange } from 'react-icons/bs'
import jsPDF from 'jspdf'
import _ from "lodash";
import moment from 'moment'
import Multiselect from 'multiselect-react-dropdown'
import { useSelector } from 'react-redux'
import pdflogo from '../../../Assets/Img/favicon-new.png'
import { GetReportRowData_API, GetReport_API } from '../../Redux/API'
import { Notification } from '../../Notification'
import { Datepicker } from '../../DynamicComponent'
import profile from '../../ProfilePage/ProfilePage.module.scss'
import PdfCard from './PdfCard'
import Report from './Report'

const DailyReport = () => {
    const useridSelectRef = useRef()


    const Globalexchange = useSelector((state) => state && state.exchange);


    const [NotifyData, setNotifyData] = useState({
        successFlag: false,
        successMsg: 'success msg',
        errorFlag: false,
        errorMsg: 'error msg',
        loadingFlag: false,
        loadingMsg: 'loading msg',
        activesession: false
    })

    const [ReportRowData, setReportRowData] = useState([])

    const [report, setReport] = useState({
        startdatetime: moment(new Date()).format('YYYY-MM-DD'),
        enddatetime: moment(new Date()).format('YYYY-MM-DD'),
        groupname: '',
        segment: 'all',
        userid: [],
        account: '',
        groupwise: '',
        exchange: 'all',
        weekly: false
    })

    const [visibilityCom, setVisibilityCom] = useState(true)
    const [pdfData, setPdfData] = useState();
    const CloseError = () => {
        setNotifyData((data) => ({ ...data, errorFlag: false }))
    }
    const CloseSuccess = () => {
        setNotifyData((data) => ({ ...data, successFlag: false }))
    }

    const handleChange = (e) => {
        setReport({
            ...report,

            [e.target.name]: e.target.type == 'checkbox' ? e.target.checked : e.target.value
        })

    }


    const onRemove = (selectedList, selectedItem) => {

        // let data = selectedList.filter((val) => {
        //     return typeof(val) != 'boolean' &&  val;
        // })

        setReport({ ...report, userid: selectedList })


    }


    const FetchReportData = async () => {

        setNotifyData((data) => ({ ...data, loadingFlag: true, loadingMsg: "Retriving Report data..." }))
        const ps1 = new Promise((resolve, reject) => {

            resolve(GetReport_API({ ...report, userid: useridSelectRef.current.state.selectedValues }))
        })
        const rs = await Promise.all([ps1]).then((val) => {
            return val[0]['data'];
        }).catch((err) => {
            setNotifyData((data) => ({ ...data, loadingFlag: false, errorFlag: true, errorMsg: err['message'] }))
            console.log("*********", err.response.status);
            (err.response.status === 401) && setTimeout(() => { window.location.assign(window.location.origin) }, 1000);
            return err["response"]["data"];
        })
        if (rs['type'] === 'success') {
            setNotifyData((data) => ({ ...data, loadingFlag: false }))
            return rs.data
        } else {
            setNotifyData((data) => ({ ...data, loadingFlag: false, errorFlag: true, errorMsg: rs['message'] }))
        }
    }

    const handleVisibility = async (e) => {

        e.preventDefault();
        let rs = await FetchReportData();
        var doc = new jsPDF({
            orientation: "landscape",
            size: "A4",
            unit: "pt"
        });

        rs.push({
            "userid": "TOTAL",
            "symbol": " ",
            "exchange": " ",
            "opttype": " ",
            "position": _.sumBy(rs, function (o) { return o.position; }),
            "closerate": " ",
            "dailynetmtm": _.sumBy(rs, function (o) { return o.dailynetmtm; }),
            "tilldatemtm": _.sumBy(rs, function (o) { return o.tilldatemtm; }).toFixed(2)
        })
        // const marginLeft = 40;
        let content = {
            theme: "grid",
            startY: 190,
            compress: true,
            showFoot: 'everyPage',
            // pageBreak:'avoid',
            head: [Object.keys(rs[0]).map(el => { return el.toUpperCase() })],
            body: rs.map((val) => { return Object.values(Object.values(val)) }),   //body always will be array of arrays and not array of objets      
            styles: {
                fontSize: 8,
                halign: "center",
                cellWidth: "wrap",
                overflow: "linebreak",
                // fillColor: 'green',
                textColor: "white",
            }, // To change color of header
            tableWidth: 'auto',
            columnWidth: "auto",
            didParseCell: function (data) {
                if (data.section === "body" && data.cell.raw < 0) {
                    data.cell.styles.textColor = "red";
                }
            },

            headStyles: {
                fontSize: 10,
                fontStyle: 'bold',
            },
            bodyStyles: {
                // fillColor: [219, 227, 249],
                textColor: "black",// To change color of body
            },
            willDrawCell: function (data) {
                var rows = data.table.body;
                if (data.row.index === rows.length - 1) {
                    doc.setFillColor('#ffc107');
                    doc.setFont("Helvetica", "bold");
                }
            },

        };

        doc.addImage(pdflogo, 'PNG', 40, 40, 50, 50)

        doc.setFontSize(20)
        doc.setFont("Helvetica", "bold");
        doc.setTextColor('#075792');
        doc.text('Cosmic Trades', 88, 75, 0, 0);

        doc.setFontSize(10);
        doc.setTextColor('#000');
        doc.text('FROM ' + report.startdatetime + ' TO ' + report.enddatetime, 640, 70, 0, 0);


        doc.setFontSize(10)
        doc.setTextColor('#5a6474')
        doc.text('Group name: ' + report.groupname.toUpperCase(), 40, 110, 0, 0)
        doc.text('UserId: ' + report.userid.toUpperCase(), 40, 125, 0, 0)
        // doc.text('Account: ' + report.account.toUpperCase(), 40, 140, 0, 0)
        // doc.text('Group wise: ' + report.groupwise.toUpperCase(), 40, 155, 0, 0)
        doc.text('Exchange: ' + report.exchange.toUpperCase(), 40, 140, 0, 0)


        doc.setFontSize(15);
        doc.setTextColor('#015693');
        doc.text('Report', 40, 180, 0, 0);


        doc.autoTable(content);

        const pageCount = doc.internal.getNumberOfPages();

        for (var i = 1; i <= pageCount; i++) {
            doc.setPage(i)
            doc.addImage(pdflogo, 'PNG', 40, 570, 15, 15)
            doc.setFontSize(10)
            doc.setTextColor('#075792');

            doc.setFontSize(9)
            doc.text('Cosmic Trades', 55, 582, 0, 0)
            doc.text('Page ' + i, 765, 580, 0, 0)
        }
        setPdfData(doc.output('dataurl'));
        setVisibilityCom(false)
    }

    const Downloadpdf = async (e) => {
        e.preventDefault();
        let rs = await FetchReportData();
        var doc = new jsPDF({
            orientation: "landscape",
            size: "A4",
            unit: "pt"
        });

        rs.push({
            "userid": "TOTAL",
            "symbol": " ",
            "exchange": " ",
            "opttype": " ",
            "position": _.sumBy(rs, function (o) { return o.position; }),
            "closerate": " ",
            "dailynetmtm": _.sumBy(rs, function (o) { return o.dailynetmtm; }),
            "tilldatemtm": _.sumBy(rs, function (o) { return o.tilldatemtm; }).toFixed(2)
        })
        // const marginLeft = 40;
        let content = {
            theme: "grid",
            startY: 190,
            compress: true,
            showFoot: 'everyPage',
            // pageBreak:'avoid',
            head: [Object.keys(rs[0]).map(el => { return el.toUpperCase() })],
            body: rs.map((val) => { return Object.values(Object.values(val)) }),   //body always will be array of arrays and not array of objets      
            styles: {
                fontSize: 8,
                halign: "center",
                cellWidth: "wrap",
                overflow: "linebreak",
                // fillColor: 'green',
                textColor: "white",
            }, // To change color of header
            tableWidth: 'auto',
            columnWidth: "auto",
            didParseCell: function (data) {
                if (data.section === "body" && data.cell.raw < 0) {
                    data.cell.styles.textColor = "red";
                }
            },

            headStyles: {
                fontSize: 10,
                fontStyle: 'bold',
            },
            bodyStyles: {
                // fillColor: [219, 227, 249],
                textColor: "black",// To change color of body
            },
            willDrawCell: function (data) {
                var rows = data.table.body;
                if (data.row.index === rows.length - 1) {
                    doc.setFillColor('#ffc107');
                    doc.setFont("Helvetica", "bold");
                }
            },

        };

        doc.addImage(pdflogo, 'PNG', 40, 40, 50, 50)

        doc.setFontSize(20)
        doc.setFont("Helvetica", "bold");
        doc.setTextColor('#075792');
        doc.text('Cosmic Trades', 88, 75, 0, 0);

        doc.setFontSize(10);
        doc.setTextColor('#000');
        doc.text('FROM ' + report.startdatetime + ' TO ' + report.enddatetime, 640, 70, 0, 0);


        doc.setFontSize(10)
        doc.setTextColor('#5a6474')
        doc.text('Group name: ' + report.groupname.toUpperCase(), 40, 110, 0, 0)
        doc.text('UserId: ' + report.userid.toUpperCase(), 40, 125, 0, 0)
        // doc.text('Account: ' + report.account.toUpperCase(), 40, 140, 0, 0)
        // doc.text('Group wise: ' + report.groupwise.toUpperCase(), 40, 155, 0, 0)
        doc.text('Exchange: ' + report.exchange.toUpperCase(), 40, 140, 0, 0)


        doc.setFontSize(15);
        doc.setTextColor('#015693');
        doc.text('Report', 40, 180, 0, 0);


        doc.autoTable(content);

        const pageCount = doc.internal.getNumberOfPages();

        for (var i = 1; i <= pageCount; i++) {
            doc.setPage(i)
            doc.addImage(pdflogo, 'PNG', 40, 570, 15, 15)
            doc.setFontSize(10)
            doc.setTextColor('#075792');

            doc.setFontSize(9)
            doc.text('Cosmic Trades', 55, 582, 0, 0)
            doc.text('Page ' + i, 765, 580, 0, 0)
        }
        doc.save("report.pdf");
    }

    useEffect(() => {
        setReport({
            ...report,
            segment: 'all'
        })
    }, [report.groupname])

    useEffect(() => {
        async function getUsersData() {
            setNotifyData((data) => ({ ...data, loadingFlag: true, loadingMsg: "Retriving users data..." }))
            const ps1 = new Promise((resolve, reject) => {
                resolve(GetReportRowData_API())
            })
            const rs = await Promise.all([ps1]).then((val) => {
                return val[0]['data'];
            }).catch((err) => {
                setNotifyData((data) => ({ ...data, loadingFlag: false, errorFlag: true, errorMsg: err['message'] }))
                console.log("*********", err.response.status);
                (err.response.status === 401) && setTimeout(() => { window.location.assign(window.location.origin) }, 1000);
                return err["response"]["data"];
            })
            if (rs['type'] === 'success') {
                setNotifyData((data) => ({ ...data, loadingFlag: false }))
                setReportRowData(rs.data);
            } else {
                setNotifyData((data) => ({ ...data, loadingFlag: false, errorFlag: true, errorMsg: rs['message'] }))
            }
        }
        getUsersData()
    }, [])

    const handleStartDate = (props) => {
        setReport({
            ...report,
            startdatetime: props
        })
    }
    const handleEndDate = (props) => {
        setReport({
            ...report,
            enddatetime: props
        })
    }
    return (
        <div className="container-fluid">
            <div className='row'>
                <div className="col-md-4">
                    <div className={`basic-forminfo ${profile.basicInfo}`}>
                        <h5 className={profile.basicHeading}>
                            <span className={profile.icons}>
                                <FaFileInvoiceDollar />
                            </span>
                            Download Report (Testing)
                        </h5>
                        <Form
                            noValidate
                            className={profile.basicInfoSetting}
                        >
                            <Row className="">
                                <Form.Group
                                    as={Col}
                                    md="12"
                                    controlId="validationCustomUSDRate"
                                    className='mb-3'
                                >
                                    <div className="d-flex">
                                        <Form.Check
                                            type="switch"
                                            label="Weekly Report"
                                            name='weekly'
                                            onChange={(e) => handleChange(e)}
                                            checked={report.weekly}
                                            className={profile.usdLive}
                                        />
                                    </div>
                                </Form.Group>
                                <Form.Group
                                    as={Col}
                                    md="6"
                                    controlId="validationCustomDate"
                                    className='mb-3'
                                >
                                    <Form.Label>
                                        <span className={`label-icon ${profile.labelIcon}`}>
                                            <BsCalendar2EventFill />
                                        </span>
                                        Start Date
                                        <span className={profile.mendatory}>
                                            *
                                        </span>
                                    </Form.Label>
                                    <InputGroup hasValidation>
                                        {/* <input
                                            type="date"
                                            name="startdatetime"
                                            value={report.startdatetime}
                                            onChange={handleChange}
                                            className={`date-section ${profile.dateSection}`}
                                            style={{ width: ' 100%' }}
                                            disabled={report.weekly}
                                        /> */}
                                        <Datepicker dateValue={report.startdatetime} handleDate={handleStartDate} yesterday={false} />
                                    </InputGroup>
                                </Form.Group>
                                <Form.Group as={Col}
                                    md="6"
                                    controlId="validationCustomCurrency"
                                    className='mb-3'
                                >
                                    <Form.Label>
                                        <span className={`label-icon ${profile.labelIcon}`}>
                                            <BsCalendar2EventFill />
                                        </span>
                                        End Date
                                        <span className={profile.mendatory}>
                                            *
                                        </span>
                                    </Form.Label>
                                    <InputGroup hasValidation>
                                        {/* <input
                                            type="date"
                                            name="enddatetime"
                                            value={report.enddatetime}
                                            onChange={handleChange}
                                            className={`date-section ${profile.dateSection}`}
                                            style={{ width: ' 100%' }}
                                            disabled={report.weekly}

                                        /> */}
                                        <Datepicker dateValue={report.enddatetime} handleDate={handleEndDate} yesterday={false} />
                                    </InputGroup>
                                </Form.Group>



                                <Form.Group as={Col}
                                    md="12"
                                    controlId="validationCustomBrokerageType"
                                    className='mb-3'
                                >
                                    <Form.Label>
                                        <span className={`label-icon ${profile.labelIcon}`}>
                                            <MdGroup />
                                        </span>
                                        Select Group Name
                                    </Form.Label>
                                    <Form.Select
                                        name='groupname'
                                        onChange={handleChange}
                                        value={report.groupname}
                                        aria-label="Floating label select example"
                                        required
                                        defaultValue={"Select Group Name"}
                                    >
                                        <option value="Select Group Name"  hidden>Select Group Name</option>
                                        {
                                            [...new Set(ReportRowData.map(el => { return el.groupname }))].map((val) => {
                                                return <option key={val} value={val}>{val}</option>
                                            })
                                        }

                                    </Form.Select>
                                </Form.Group>

                                <Form.Group as={Col}
                                    md="12"
                                    controlId="validationCustomBrokerageType"
                                    className='mb-3'
                                >
                                    <Form.Label>
                                        <span className={`label-icon ${profile.labelIcon}`}>
                                            <MdGroup />
                                        </span>
                                        Select Segment
                                    </Form.Label>
                                    <Form.Select
                                        name='segment'
                                        onChange={handleChange}
                                        value={report.segment}
                                        aria-label="Floating label select example"
                                        // onSelect={()=>console.log('hello')}
                                        required
                                    >
                                        <option value="all" >All</option>
                                        {
                                            [...new Set(ReportRowData.map(el => { return (el.groupname === report.groupname) && el.segment }))].map((val) => {
                                                return val && <option key={val} value={val}>{val}</option>
                                            })
                                        }


                                    </Form.Select>
                                </Form.Group>
                                <Form.Group as={Col}
                                    md="12"
                                    controlId="validationCustomBrokerageType"
                                    className='mb-3'
                                >
                                    <Form.Label>
                                        <span className={`label-icon ${profile.labelIcon}`}>
                                            <FaUser />
                                        </span>
                                        Select UserId
                                    </Form.Label>
                                    {/* <Form.Select
                                        name='userid'
                                        // onChange={handleChange}
                                        // value={report.userid}
                                        aria-label="Floating label select example"
                                        required
                                    >
                                        <option value="all" >All</option>
                                        {
                                            [...new Set(ReportRowData.map(el => { return ((el.groupname === report.groupname) || (el.segment === report.segment)) && el.userid }))].map((val) => {
                                                return val && <option key={val} value={val}>{val}</option>
                                            })
                                        }

                                    </Form.Select> */}

                                    <Multiselect
                                        ref={useridSelectRef}
                                        isObject={false}
                                        onRemove={onRemove}

                                        selectedValues={[...new Set(ReportRowData.map(el => { return ((el.groupname === report.groupname) && (el.segment === report.segment)) ? el.userid : (el.groupname === report.groupname && report.segment === 'all') && el.userid }))].filter((val) => {
                                            return val;
                                        })}

                                        showCheckbox
                                        className='multi-select'
                                    />
                                </Form.Group>
                                <Form.Group as={Col}
                                    md="12"
                                    controlId="validationCustomUserId"
                                    className='mb-3'
                                >
                                    <Form.Label>
                                        <span className={`label-icon ${profile.labelIcon}`}>
                                            <FaUsersCog />
                                        </span>
                                        Select Account
                                        <span className={profile.mendatory}>
                                            *
                                        </span>
                                    </Form.Label>
                                    <Form.Select
                                        name='account'
                                        onChange={handleChange}
                                        value={report.account}
                                        aria-label="Floating label select example"
                                        required
                                        defaultValue={"Select Account"}
                                    >
                                        <option value="Select Account"  hidden>Select Account</option>
                                        <option value="client">Client</option>
                                        {/* <option value="broker">Broker</option>
                                        <option value="company">Company</option> */}
                                    </Form.Select>
                                </Form.Group>
                                <Form.Group as={Col}
                                    md="12"
                                    controlId="validationCustomUserId"
                                    className='mb-3'
                                >
                                    <Form.Label>
                                        <span className={`label-icon ${profile.labelIcon}`}>
                                            <FaUsersCog />
                                        </span>
                                        GroupBy
                                        <span className={profile.mendatory}>
                                            *
                                        </span>
                                    </Form.Label>
                                    <Form.Select
                                        name='groupwise'
                                        onChange={handleChange}
                                        value={report.groupwise}
                                        aria-label="Floating label select example"
                                        required
                                        defaultValue={"Select GroupBy"}
                                    >
                                        <option value="Select GroupBy"  hidden>Select GroupBy</option>
                                        <option value="symbol">Symbol</option>
                                        <option value="userid">Userid</option>
                                    </Form.Select>
                                </Form.Group>
                                <Form.Group as={Col}
                                    md="12"
                                    controlId="validationCustomUserId"
                                    className='mb-3'
                                >
                                    <Form.Label>
                                        <span className={`label-icon ${profile.labelIcon}`}>
                                            <BsCurrencyExchange />
                                        </span>
                                        Select Exchange
                                        <span className={profile.mendatory}>
                                            *
                                        </span>
                                    </Form.Label>
                                    <Form.Select
                                        name='exchange'
                                        onChange={handleChange}
                                        value={report.exchange}
                                        aria-label="Floating label select example"
                                        required
                                    >
                                        <option value="all">All</option>

                                        {Globalexchange && Globalexchange.map((val) => {
                                            return <option key={val} value={val}>{val}</option>
                                        })}

                                    </Form.Select>
                                </Form.Group>

                                <div>
                                    <button
                                        onClick={(e) => handleVisibility(e)}
                                        className={`${profile.basicInfoBtn} ${profile.pdfPreviewbtn} ${profile.pdfDownloadbtn}`}
                                    >
                                        Preview PDF
                                    </button>
                                    <br />
                                    <button
                                        onClick={Downloadpdf}
                                        className={`${profile.basicInfoBtn} ${profile.pdfDownloadbtn}`}
                                    >
                                        Download PDF
                                    </button>
                                </div>

                            </Row>
                        </Form>
                    </div>
                    <Notification notify={NotifyData} CloseError={CloseError} CloseSuccess={CloseSuccess} />
                </div >

                <div className={`col-md-8 ${profile.pdfReport}`}>
                    {visibilityCom &&
                        <PdfCard />
                    }
                    {!visibilityCom &&
                        <Report data={pdfData && pdfData} />
                    }
                </div>
            </div>
        </div >
    )

}

export default memo(DailyReport)