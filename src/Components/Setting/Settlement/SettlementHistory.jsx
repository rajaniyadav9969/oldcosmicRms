import React, { memo, useState } from 'react'
import { Form, Row, Col, InputGroup } from 'react-bootstrap'
import { FaCloudUploadAlt } from 'react-icons/fa';
import _ from 'lodash'
import { BsCalendar2EventFill, BsCurrencyExchange } from 'react-icons/bs';
import moment from "moment";
import { useSelector } from 'react-redux';
import { Datepicker } from '../../DynamicComponent';
import { DataTableComp } from '../../DataTable'
import { SettlementHistory_API, SettlementUpdate_API } from '../../Redux/API';
import { Notification } from '../../Notification';
import profile from '../../ProfilePage/ProfilePage.module.scss'

const SettlementHistory = () => {
    const Globalexchange = useSelector(state => state && state.exchange)
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
    const [errorMessage, setErrorMessage] = useState("Select Date");
    const [validated, setValidated] = useState(false);
    const [dateValue, setDateValue] = useState(moment(new Date()).subtract(1, 'days').format('YYYY-MM-DD'))
    // const [file, setFile] = useState([]);
    const [exchange, setExchange] = useState('all');
    const [data, setData] = useState([])
    const [columns, setColumns] = useState([])

    const handleSubmit = (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }
        setValidated(true);
    };

    const handleClick = async (e) => {

        setNotifyData((data) => ({ ...data, loadingFlag: true, loadingMsg: "Retriving settlement history data..." }))

        const ps1 = new Promise((resolve, reject) => {
            resolve(SettlementHistory_API({ date: dateValue, exchange: exchange }))
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
            setData(rs['data'])
            setColumns(CusColumnComp(rs['data']))
            // setNotifyData((data) => ({ ...data, successFlag: true, successMsg: rs['message'] }))
        } else {
            setNotifyData((data) => ({ ...data, loadingFlag: false, errorFlag: true, errorMsg: rs['message'] }))
        }
    }

    const CusColumnComp = (coldata) => {
        return Object.keys(coldata[0]).map((key, i) => {
            if (key === "settlementprice") {
                return {
                    Header: key,
                    accessor: key,
                    show: true,
                    Cell: (cellInfo) => {
                        return (
                            <input
                                name="input"
                                type="number"
                                onChange={(event) => {
                                    let newState = [...coldata];
                                    newState[cellInfo.index][cellInfo.column.id] = event.target.value;
                                    setData(newState)
                                }}
                                value={cellInfo.value}
                            />
                        );
                    },
                    Footer: (row) => {
                        const name = row.column.Header;
                        const ltpsum = (_.round(_.sum((row.data).map((dt) => { return dt[name] })), 2) !== 0) ?
                            _.round(_.sum((row.data).map((dt) => { return dt[name] })), 2) : "";
                        return <div >{ltpsum}</div>
                    }
                }
            }
            else {
                return {
                    Header: key,
                    accessor: key,
                    show: true
                }
            }
        }
        )
    }

    const CloseConfirm = () => {
        setNotifyData((data) => ({ ...data, confirmFlag: false }))
    }

    const CloseError = () => {
        setNotifyData((data) => ({ ...data, errorFlag: false }))
    }
    const CloseSuccess = () => {
        setNotifyData((data) => ({ ...data, successFlag: false }))
    }

    const handleUpdate = async (e) => {
        e.preventDefault()
        setNotifyData((data) => ({ ...data, loadingFlag: true, loadingMsg: "Updating Profile" }))
        const ps1 = new Promise((resolve, reject) => {
            resolve(SettlementUpdate_API({ date: dateValue, data: data }))
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
            // dispatch(LoginAction(rs['data']));
        } else {
            setNotifyData((data) => ({ ...data, loadingFlag: false, confirmFlag: false, errorFlag: true, errorMsg: rs['message'], activesession: rs['session'] }))
        }
    }
    const handleDate = (props) => {
        setDateValue(props)
    }

    return (
        <div className={`basic-forminfo ${profile.basicInfo}`}>
            <Form
                noValidate
                validated={validated}
                onSubmit={handleSubmit}
                // className={[profile.basicInfoSetting, profile.history]}
                className={`${profile.basicInfoSetting} ${profile.history}`}
            >
                <Row className={profile.historySection}>
                    <div className="col-md-6">
                        <h5 className={profile.basicHeading}>
                            <span className={profile.icons}>
                                <FaCloudUploadAlt />
                            </span>
                            Settlement History
                        </h5>
                    </div>
                    <Form.Group
                        as={Col}
                        md="2"
                        controlId="validationCustomDate"
                        className={`${profile.rmsDateSection} ${profile.historySingleItem}`}
                    >
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
                            <Datepicker dateValue={dateValue} handleDate={handleDate} yesterday={true} />
                            <Form.Control.Feedback type="invalid">
                                {errorMessage}
                            </Form.Control.Feedback>
                        </InputGroup>
                    </Form.Group>
                    <Form.Group as={Col}
                        md="2"
                        controlId="validationCustomExchange"
                        className={`${profile.rmsDataExchange} ${profile.historySingleItem}`}
                    >
                        <Form.Label className={profile.moblabel}>
                            <span className={`label-icon ${profile.labelIcon}`}>
                                <BsCurrencyExchange />
                            </span>
                            Exchange
                            <span className={profile.mendatory}>
                                *
                            </span>
                        </Form.Label>

                        <Form.Select value={exchange} onChange={(e) => { setExchange(e.target.value) }}
                            aria-label="Floating label select example"
                        >
                            <option value={'all'}>All</option>
                            {Globalexchange && Globalexchange.map((val) => { return <option key={val} value={val}>{val}</option> })}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                            Please Select Exchange
                        </Form.Control.Feedback>
                    </Form.Group>

                    <div className={`col-md-1 ${profile.settlementBtn}`}>
                        <input
                            type="submit"
                            className={profile.basicInfoBtn}
                            value='show'
                            onClick={handleClick}
                        />
                    </div>
                    <div className={`col-md-1 ${profile.settlementBtn}`}>
                        <input
                            type="submit"
                            className={profile.updateHistoty}
                            value='Update'
                            onClick={(e) => {
                                e.preventDefault();
                                setNotifyData((data) => ({
                                    ...data,
                                    confirmFlag: true,
                                    confirmMsg: "Are you sure, You want to update settlement history ?",
                                    confirmAction: (e) =>
                                        handleUpdate(e)
                                }))
                            }}
                        />
                    </div>
                </Row>
            </Form>
            <div
            // className={`custom-table ${dash.customdatatable}`}
            >
                <DataTableComp
                    data={data ? data : null}
                    columns={columns}
                    id="settlementhistory"
                />
            </div>
            <Notification
                notify={NotifyData}
                CloseError={CloseError}
                CloseSuccess={CloseSuccess}
                CloseConfirm={CloseConfirm}
            />
        </div >
    )
}

export default memo(SettlementHistory)