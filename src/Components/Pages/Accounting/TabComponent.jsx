import React, { useState, memo } from "react";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { Form, Row, Col, InputGroup } from 'react-bootstrap'
import moment from 'moment';
import { AiFillAccountBook } from 'react-icons/ai';
import { BsCalendar2EventFill } from 'react-icons/bs';
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";
import { FaFileInvoiceDollar } from 'react-icons/fa';
import { CusColumn } from '../../DataTable/CusColumn';
import { PreviousVerifiedData_API } from '../../Redux/API';
import { Datepicker } from '../../DynamicComponent';
import profile from '../../ProfilePage/ProfilePage.module.scss'
import { DataTableComp } from '../../DataTable';
import './Accounting.scss'
import { Notification } from "../../Notification";

function TabComponent(props) {


    const [dateValue, setDateValue] = useState(moment(new Date()).format('YYYY-MM-DD'))
    // const [exchange, setExchange] = useState('All');


    const [data, setData] = useState([])
    const [columns, setColumns] = useState([])

    const [NotifyData, setNotifyData] = useState({
        confirmFlag: false,
        confirmMsg: 'confirm msg',
        successFlag: false,
        successMsg: 'success msg',
        errorFlag: false,
        errorMsg: 'error msg',
        loadingFlag: false,
        loadingMsg: 'loading msg',
        activesession: false
    })
    const [activeTab, setActiveTab] = useState("currentreport");
    const [tabvalue, setTabValue] = React.useState(0);
    const handleChange = (event, tabvalue) => {
        setTabValue(tabvalue);
    };
    // const handleTabsChange = (event, newValue) => {
    //     console.log(event);
    //     console.log(newValue);
    //     setTabValue(newValue);
    // };

    const CloseConfirm = () => {
        setNotifyData((data) => ({ ...data, confirmFlag: false }))
    }

    const CloseError = () => {
        setNotifyData((data) => ({ ...data, errorFlag: false }))
    }

    const CloseSuccess = () => {
        setNotifyData((data) => ({ ...data, successFlag: false }))
    }




    const handleDate = (props) => {
        setDateValue(props)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setNotifyData((data) => ({ ...data, loadingFlag: true, loadingMsg: "Loading Data..." }))
        const ps1 = new Promise((resolve, reject) => {
            resolve(PreviousVerifiedData_API({ type: 'Previous_Accounts', date: dateValue }))
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
            setNotifyData((data) => ({ ...data, loadingFlag: false, confirmFlag: false, successFlag: true, successMsg: rs['message'] }))
            setData(rs['data'])
            setColumns(CusColumn(rs['data'][0]))

        } else {
            setNotifyData((data) => ({ ...data, loadingFlag: false, confirmFlag: false, errorFlag: true, errorMsg: rs['message'] }))
        }
    };

    return (
        <div className={`basic-forminfo verify-tab-section  ${profile.basicInfo}`}>
            <VerticalTabs
                value={tabvalue}
                onChange={handleChange}
                className="verify-tab-content"
            >
                <MyTab
                    label={
                        <h6>
                            <span >
                                <FaFileInvoiceDollar />
                            </span>
                            <span
                                className='icon-content'
                            >
                                Current Report
                            </span>
                        </h6>
                    }
                    className="single-tab-content"
                    onClick={() => setActiveTab("currentreport")}
                />
                <MyTab
                    label={
                        <h6>
                            <span >
                                <FaFileInvoiceDollar />
                            </span>
                            <span
                                className='icon-content'
                            >
                                Previous Report
                            </span>
                        </h6>
                    }
                    className="single-tab-content"
                    onClick={() => setActiveTab("previousreport")}
                />
            </VerticalTabs>
            <div>
                {(activeTab === "currentreport") && (
                    <TabContainer>
                        <div className="varify-accountTab basic-forminfo">
                            <DataTableComp
                                data={props.data ? props.data : null}
                                columns={props.columns}
                                id="Current_Report"
                            />
                        </div>
                    </TabContainer>
                )}
                {(activeTab === "previousreport") && (
                    <TabContainer>
                        <div className="basic-forminfo varify-account-singletab" >
                            <Form
                                noValidate
                                onSubmit={handleSubmit}
                                className={`previous-account-section ${profile.basicInfoSetting}`}
                            >
                                <Row className="previous-tab">
                                    <div className="col-md-9">
                                        <h5 className={`previous-account-heading ${profile.basicHeading}`}>
                                            <span className={profile.icons}>
                                                <AiFillAccountBook />
                                            </span>
                                            Previous Accounts
                                        </h5>
                                    </div>
                                    <Form.Group as={Col} md="2" controlId="validationCustomDate" className={profile.historySingleItem}>
                                        <Form.Label className={profile.moblabel}>
                                            <span className={`label-icon ${profile.labelIcon}`}>
                                                <BsCalendar2EventFill />
                                            </span>
                                            Date
                                            <span className={profile.mendatory}>
                                                *
                                            </span>
                                        </Form.Label>
                                        <InputGroup hasValidation>
                                            <Datepicker dateValue={dateValue} handleDate={handleDate} yesterday={false} />
                                            <Form.Control.Feedback type="invalid">
                                            </Form.Control.Feedback>
                                        </InputGroup>
                                    </Form.Group>
                                    <div className='col-md-1 account-show-btn'>
                                        <input type="submit" className={profile.basicInfoBtn} value='Show' />
                                    </div>
                                </Row>
                            </Form>
                            <DataTableComp
                                data={data ? data : null}
                                columns={columns}
                                id="Previous_Report"
                            />
                        </div>
                    </TabContainer>
                )}
            </div>

            <Notification
                notify={NotifyData}
                CloseError={CloseError}
                CloseSuccess={CloseSuccess}
                CloseConfirm={CloseConfirm}
            />
        </div >
    );
}

const VerticalTabs = withStyles((theme) => ({
    flexContainer: {
        flexDirection: "row",
    },
    indicator: {
        display: "none",
    },
}))(Tabs);

const MyTab = withStyles((theme) => ({
    selected: {
        color: "tomato",
        borderBottom: "2px solid tomato",
    },
}))(Tab);

function TabContainer(props) {
    return (
        <Typography
            component="div"
        // className={`custom-table ${dash.customdatatable}`}
        >
            {props.children}
        </Typography>
    );
}




export default memo(TabComponent)
