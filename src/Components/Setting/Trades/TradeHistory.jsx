import React, { memo, useState,useRef } from 'react'
import { Form, Row, Col, InputGroup } from 'react-bootstrap'
import { AiFillAccountBook } from 'react-icons/ai';
import { BsCalendar2EventFill, BsCurrencyExchange } from 'react-icons/bs';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { DataTableComp } from '../../DataTable'
import { CusColumn } from '../../DataTable/CusColumn';
import { TradeHistory_API } from '../../Redux/API';
import { Notification } from '../../Notification';
import { Datepicker } from '../../DynamicComponent';
import profile from '../../ProfilePage/ProfilePage.module.scss'

const TradeHistory = () => {
    const Globalexchange = useSelector(state => state && state.exchange)

    const [NotifyData, setNotifyData] = useState({
        successFlag: false,
        successMsg: 'success msg',
        errorFlag: false,
        errorMsg: 'error msg',
        loadingFlag: false,
        loadingMsg: 'loading msg',
        activesession: false
    })
    const [validated, setValidated] = useState(false);
    const [dateValue, setDateValue] = useState(moment(new Date()).subtract(1, 'days').format('YYYY-MM-DD'))
    const [exchange, setExchange] = useState('all');
    const [data, setData] = useState([])
    const [columns, setColumns] = useState([])
    const formRef = useRef('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }
        else {
            setNotifyData((data) => ({ ...data, loadingFlag: true, loadingMsg: "Retriving trade history data..." }))
            const ps1 = new Promise((resolve, reject) => {
                resolve(TradeHistory_API({ date: dateValue, exchange: exchange }))
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
                setColumns(CusColumn(rs['data'][0]))
                // dispatch(LoginAction(rs['data']));
            } else {
                setNotifyData((data) => ({ ...data, loadingFlag: false, errorFlag: true, errorMsg: rs['message'] }))
                setNotifyData((data) => ({ ...data }))
            }
        }
        setValidated(true);
    };

    const CloseError = () => {
        setNotifyData((data) => ({ ...data, errorFlag: false }))
    }
    const CloseSuccess = () => {
        setNotifyData((data) => ({ ...data, successFlag: false }))
    }
    const handleDate = (props) => {
        setDateValue(props)
    }
    return (
        <div className={`basic-forminfo ${profile.basicInfo}`}>
            <Form
                ref={formRef}
                validated={validated}
                onSubmit={handleSubmit}
                className={`${profile.basicInfoSetting} ${profile.history}`}
            >
                <Row className={profile.historySection}>
                    <div className="col-md-7">
                        <h5 className={profile.basicHeading}>
                            <span className={profile.icons}>
                                <AiFillAccountBook />
                            </span>
                            Trade History
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
                                Select date
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
                        <Form.Select
                            value={exchange}
                            onChange={(e) => { setExchange(e.target.value) }}
                            aria-label="Floating label select example"
                        >
                            <option value={'all'}>All</option>
                            {Globalexchange && Globalexchange.map((val, i) => { return <option key={i} value={val}>{val}</option> })}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                            Please Select Exchange
                        </Form.Control.Feedback>
                    </Form.Group>
                    <div className='col-md-1'>
                        <input
                            type="submit"
                            className={profile.basicInfoBtn}
                            value='show'
                            onClick={handleSubmit} />
                    </div>
                </Row>
            </Form>
            <div
            // className={`custom-table ${dash.customdatatable}`}
            >
                <DataTableComp
                    data={data ? data : null}
                    columns={columns}
                    id="tradehistory"
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

export default memo(TradeHistory)