import React, { memo, useState } from 'react'
import { Form, Row, Col, InputGroup } from 'react-bootstrap'
import { AiFillAccountBook } from 'react-icons/ai';
import { BsCalendar2EventFill, BsCurrencyExchange } from 'react-icons/bs';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { Datepicker } from '../../DynamicComponent';
import { Notification } from '../../Notification';
import { SettlementUpload_API } from '../../Redux/API';
import profile from '../../ProfilePage/ProfilePage.module.scss'

const ImportTrade = (props) => {
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
    const [dateValue, setDateValue] = useState(moment(new Date()).format('YYYY-MM-DD'))
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

    const handleSubmit = async (e) => {
        // event.preventDefault();
        // const form = event.currentTarget;
        // if (form.checkValidity() === false) {
        //     // event.preventDefault();
        //     event.stopPropagation();
        // }
        // setValidated(true);
      
        // const formData = new FormData();
        // formData.append('file', file);
        // formData.append('fileName', file.name);
        // formData.append('date', dateValue);
        // formData.append('filetype', 'Import_TradeBook');
        // const config = {
        //     withCredentials: true,
        //     headers: {
        //         'X-CSRFToken': '',
        //         'content-type': 'multipart/form-data'
        //     },
        // };
        // axios.post(url+'/utilities/uploadfile', formData, config).then((response) => {
        //     console.log(response);
        // });

        e.preventDefault()
        const formData = new FormData();
        formData.append('file', fileData);
        formData.append('exchange', exchange);
        formData.append('date', dateValue);
        formData.append('filetype', 'Import_TradeBook');
        setNotifyData((data) => ({ ...data, loadingFlag: true, loadingMsg: "Uploading trades..." }))
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
    };

    const handleFileChange = (e) => {
        console.log(e);
        setFileData(e.target.files[0])
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
                className={`${profile.basicInfoSetting} ${profile.history}`}
            >
                <Row className={profile.historySection}>
                    <div className="col-md-5">
                        <h5 className={profile.basicHeading}>
                            <span className={profile.icons}>
                                <AiFillAccountBook />
                            </span>
                            Import Trade
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
                            <Datepicker dateValue={dateValue} handleDate={handleDate} yesterday={false} />
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
                            {Globalexchange && Globalexchange.map((val, i) => { return <option key={i} value={val}>{val}</option> })}
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
                                onChange={(e)=>handleFileChange(e)}
                                required
                            />
                            <Form.Control.Feedback type="invalid">
                                Select File
                            </Form.Control.Feedback>
                        </InputGroup>
                    </Form.Group>
                    <div className='col-md-1'>
                        <input type="submit" className={profile.basicInfoBtn} value='Upload' />
                    </div>
                </Row>
                <h6 onClick={() => props.toggleVisibility()} className={profile.hideShowtoggle}>
                    {props.visibility ? 'Hide ' : 'Show '}
                    Trade History
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

export default memo(ImportTrade)