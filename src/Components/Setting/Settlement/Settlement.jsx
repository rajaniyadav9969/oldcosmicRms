import React, { memo, useState } from 'react'
import { Form, Row, Col, InputGroup } from 'react-bootstrap'
import { FaCloudUploadAlt } from 'react-icons/fa';
import { BsCalendar2EventFill, BsCurrencyExchange } from 'react-icons/bs';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { SettlementUpload_API } from '../../Redux/API';
import { Notification } from '../../Notification';
import { Datepicker } from '../../DynamicComponent';
import profile from '../../ProfilePage/ProfilePage.module.scss'

const Settlement = (props) => {
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
    const [fileData, setFileData] = useState([]);
    const [exchange, setExchange] = useState('all');

    const CloseConfirm = () => {
        setNotifyData((data) => ({ ...data, confirmFlag: false }))
    }

    const CloseError = () => {
        setNotifyData((data) => ({ ...data, errorFlag: false }))
    }

    const CloseSuccess = () => {
        setNotifyData((data) => ({ ...data, successFlag: false }))
    }
    const handleFileChange = (event) => {
        setFileData(event.target.files[0])
    }
    async function handleSubmit(e) {
        e.preventDefault()
        const formData = new FormData();
        formData.append('file', fileData);
        formData.append('exchange', exchange);
        formData.append('date', dateValue);
        formData.append('filetype', 'Import_Settlement');
        setNotifyData((data) => ({ ...data, loadingFlag: true, loadingMsg: "Uploading settlement..." }))
        const ps1 = new Promise((resolve, reject) => {
            resolve(SettlementUpload_API(formData))
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
        } else {
            setNotifyData((data) => ({ ...data, loadingFlag: false, confirmFlag: false, errorFlag: true, errorMsg: rs['message'] }))
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
                // onSubmit={(e) => handleSubmit(e)}
                onSubmit={(e) => {
                    e.preventDefault();
                    setNotifyData((data) => ({
                        ...data,
                        confirmFlag: true,
                        confirmMsg: "Are you sure, You want to update settlement ?",
                        confirmAction: (e) =>
                            handleSubmit(e)
                    }))
                }}
                className={`${profile.basicInfoSetting} ${profile.history}`}
            >
                <Row className={profile.historySection}>
                    <div className="col-md-5">
                        <h5 className={profile.basicHeading}>
                            <span className={profile.icons}>
                                <FaCloudUploadAlt />
                            </span>
                            Settlement
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
                        <Form.Select
                            value={exchange}
                            onChange={(e) => { setExchange(e.target.value) }}
                            aria-label="Floating label select example"
                            required>
                            <option value={'all'}>All</option>
                            {Globalexchange && Globalexchange.map((val) => { return <option key={val} value={val}>{val}</option> })}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                            Please Select Exchange
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col}
                        md="2"
                        controlId="validationCustomSettkementFile"
                        className={profile.historySingleItem}>
                        <InputGroup hasValidation>
                            <Form.Control
                                type="file"
                                placeholder='Enter UserId'
                                onChange={(e) => handleFileChange(e)}
                                required
                                className={profile.fileSelect}
                            />
                            <Form.Control.Feedback type="invalid">
                                Select File
                            </Form.Control.Feedback>
                        </InputGroup>
                    </Form.Group>
                    <div className='col-md-1'>
                        <input type="submit" className={profile.basicInfoBtn} value='Upload' />
                    </div>
                    {/* <div className="col-md-1">
                        <input type="button" className={`col-md-1 ${profile.basicInfoBtn}`} value='Reset' onClick={handleResetClick} />
                    </div> */}
                </Row>
                <h6
                    onClick={() => props.hideShow()}
                    className={profile.hideShowtoggle}
                >
                    {props.show ? 'Hide ' : 'Show '}
                    Settlement History
                </h6>
            </Form>
            <Notification
                notify={NotifyData}
                CloseError={CloseError}
                CloseSuccess={CloseSuccess}
                CloseConfirm={CloseConfirm}
            />
        </div >
    )
}

export default memo(Settlement)