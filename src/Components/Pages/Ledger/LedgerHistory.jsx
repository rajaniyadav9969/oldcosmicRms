import React, { memo, useState } from 'react'
import { Form, Row, InputGroup } from 'react-bootstrap'
import { BsCalendar2EventFill } from 'react-icons/bs'
import { FaFileInvoiceDollar } from 'react-icons/fa';
import moment from 'moment';
import { CusColumn } from '../../DataTable/CusColumn';
import { GetLedgerEntry_API } from '../../Redux/API';
import { DataTableComp } from '../../DataTable'
import { Notification } from '../../Notification';
import { Datepicker } from '../../DynamicComponent';
import profile from '../../ProfilePage/ProfilePage.module.scss'


const LedgerHist = () => {
    // console.log("LedgerHist");


    const [validated, setValidated] = useState(false);
    const [data, setData] = useState([])
    const [dateValue, setDateValue] = useState(moment(new Date()).subtract(1, 'days').format('YYYY-MM-DD'))
    const [columns, setColumns] = useState([])
    const [NotifyData, setNotifyData] = useState({
        successFlag: false,
        successMsg: 'success msg',
        errorFlag: false,
        errorMsg: 'error msg',
        loadingFlag: false,
        loadingMsg: 'loading msg',
        activesession: false
    })

    const CloseError = () => {
        setNotifyData((data) => ({ ...data, errorFlag: false }))
    }
    const CloseSuccess = () => {
        setNotifyData((data) => ({ ...data, successFlag: false }))
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }
        setValidated(true);
    };

    const handleDate = (props) => {
        setDateValue(props)
    }
    return (

        <div className={`basic-forminfo ${profile.basicInfo}`}>
            <Form
                noValidate
                validated={validated}
                onSubmit={handleSubmit}
                className={`${profile.basicInfoSetting} ${profile.history}`}
            >
                <Row className={profile.historySection}>
                    <div className="col-md-7">
                        <h5 className={profile.basicHeading}>
                            <span className={profile.icons}>
                                <FaFileInvoiceDollar />
                            </span>
                            Ledger History
                        </h5>
                    </div>
                    <div className="col-md-2"></div>
                    <div className="col-md-2">
                        <Form.Group
                            controlId="validationCustomDate"
                            className={profile.historySingleItem}
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
                            </InputGroup>
                        </Form.Group>
                    </div>
                    <div className='col-md-1'>
                        <input
                            type="submit"
                            className={profile.basicInfoBtn}
                            value='Show'
                            onClick={async (e) => {
                                e.preventDefault()
                                setNotifyData((data) => ({ ...data, loadingFlag: true, loadingMsg: "Retriving ledger history data..." }))

                                const ps1 = new Promise((resolve, reject) => {
                                    resolve(GetLedgerEntry_API({ type: 'history', date: dateValue }))
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
                                    setNotifyData((data) => ({ ...data, loadingFlag: false, successFlag: true, successMsg: rs['message'] }))
                                    setData(rs['data'])
                                    setColumns(CusColumn(rs['data'][0]))
                                    // dispatch(LoginAction(rs['data']));
                                } else {
                                    setNotifyData((data) => ({ ...data, loadingFlag: false, errorFlag: true, errorMsg: rs['message'] }))
                                }
                            }} />

                    </div>
                </Row>
            </Form>
            <div
            //  className={`custom-table ${dash.customdatatable}`}
            >
                <DataTableComp
                    data={data ? data : null}
                    columns={columns}
                    id='ledgerhistory'
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

export default memo(LedgerHist)