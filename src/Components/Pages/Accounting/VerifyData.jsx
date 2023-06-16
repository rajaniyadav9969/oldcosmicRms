import React, { memo, useState } from 'react'
import { Form, Row, Col, InputGroup } from 'react-bootstrap'
import { AiFillAccountBook, AiFillFilePdf } from 'react-icons/ai';
import { BsCalendar2EventFill, BsCurrencyExchange } from 'react-icons/bs';
import { FaHandsHelping } from 'react-icons/fa';
import moment from 'moment';
import { useSelector } from "react-redux";
import { Notification } from '../../Notification';
import { UploadVerifyFile_API } from '../../Redux/API';
import TabComponent from './TabComponent';
import { CusColumn } from '../../DataTable/CusColumn';
import { Datepicker } from '../../DynamicComponent';
import profile from '../../ProfilePage/ProfilePage.module.scss'
import './Accounting.scss'


const VerifyData = () => {

    const Globalexchange = useSelector((state) => state && state.exchange);

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

    const [checkVerifyData, setCheckVerifyData] = useState(false)

    // console.log(props.data.exchange);
    const [dateValue, setDateValue] = useState(moment(new Date()).format('YYYY-MM-DD'))
    const [exchange, setExchange] = useState('All');
    const [fileData, setFileData] = useState([]);
    const [Tolerance, setTolerance] = useState(0);

    const [errorMessage, setErrorMessage] = useState("Enter Exchange Name");

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

        e.preventDefault()
        const formData = new FormData();
        formData.append('file', fileData);
        formData.append('exchange', exchange);
        formData.append('date', dateValue);
        formData.append('Tolerance', Tolerance);
        formData.append('filetype', 'Verify_Accounts');
        setNotifyData((data) => ({ ...data, loadingFlag: true, loadingMsg: "Uploading Data..." }))

        const ps1 = new Promise((resolve, reject) => {
            resolve(UploadVerifyFile_API(formData))
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
            setCheckVerifyData(!checkVerifyData)

        } else {
            setNotifyData((data) => ({ ...data, loadingFlag: false, confirmFlag: false, errorFlag: true, errorMsg: rs['message'] }))
        }
    };


    const handleChange = (event) => {

        setTolerance(event.target.value)

        if (event.target.value.includes(" ")) {
            console.log("changeee");
            setErrorMessage("No Space Allowed");
        }
        else {
            setErrorMessage("Enter Tolerance");
        }

    }

    const handleDate = (props) => {
        setDateValue(props)
    }

    const handleFileChange = (e) => {
        setFileData(e.target.files[0])
    }

    return (
        <div className="container-fluid">
            <div className='row'>
                <div className="col-md-3">
                    <div className={`basic-forminfo ${profile.basicInfo}`}>
                        <h5 className={profile.basicHeading}>
                            <span className={profile.icons}>
                                <AiFillAccountBook />
                            </span>
                            Verify Accounts
                        </h5>
                        <Form
                            noValidate
                            className={profile.basicInfoSetting}
                            onSubmit={handleSubmit}
                        >
                            <Row className="">
                                <Form.Group
                                    as={Col}
                                    md="12"
                                    controlId="validationCustomDate"
                                    className='mb-3 '
                                >
                                    <Form.Label>
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
                                <Form.Group
                                    as={Col}
                                    md="12"
                                    controlId="validationCustomExchange"
                                    className='mb-3'
                                >
                                    <Form.Label>
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
                                    md="12"
                                    controlId="validationCustomSettkementFile"
                                    className='mb-3'
                                >
                                    <Form.Label>
                                        <span className={`label-icon ${profile.labelIcon}`}>
                                            <FaHandsHelping />
                                        </span>
                                        Enter Tolerance Value
                                        <span className={profile.mendatory}>
                                            *
                                        </span>
                                    </Form.Label>
                                    <InputGroup hasValidation>
                                        <Form.Control
                                            type="text"
                                            name='tolerance'
                                            placeholder="Enter Tolerance Value"
                                            onChange={handleChange}
                                            required
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            Enter Tolerance Value
                                        </Form.Control.Feedback>
                                    </InputGroup>
                                </Form.Group>
                                <Form.Group as={Col}
                                    md="12"
                                    controlId="validationCustomSettkementFile"
                                    className='mb-3'
                                >
                                    <Form.Label>
                                        <span className={`label-icon ${profile.labelIcon}`}>
                                            <AiFillFilePdf />
                                        </span>
                                        Select File
                                        <span className={profile.mendatory}>
                                            *
                                        </span>
                                    </Form.Label>
                                    <InputGroup hasValidation>
                                        <Form.Control
                                            type="file"
                                            placeholder='Enter UserId'
                                            onChange={(e) => handleFileChange(e)}
                                            required
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            Select File
                                        </Form.Control.Feedback>
                                    </InputGroup>
                                </Form.Group>


                                {checkVerifyData
                                    ?
                                    <div>
                                        <Form.Group as={Col}
                                            md="12"
                                            controlId="validationotp"
                                            className='mb-3'
                                        >
                                            <Form.Label>
                                                <span className={`label-icon ${profile.labelIcon}`}>
                                                    <FaHandsHelping />
                                                </span>
                                                Enter OTP
                                                <span className={profile.mendatory}>
                                                    *
                                                </span>
                                            </Form.Label>
                                            <InputGroup hasValidation>
                                                <Form.Control
                                                    type="text"
                                                    name='tolerance'
                                                    placeholder="Enter OTP"
                                                    onChange={handleChange}
                                                    required
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                Enter OTP
                                                </Form.Control.Feedback>
                                            </InputGroup>
                                        </Form.Group>
                                        <input type="submit" className={profile.basicInfoBtn} value='Verified' />
                                        <input type="submit" className={`mt-2 cancelBtn ${profile.basicDangerBtn}`} value='Cancel' onClick={()=>{setCheckVerifyData(false);setData([])}} />

                                    </div>
                                    :
                                    <div>
                                        <input type="submit" className={profile.basicInfoBtn} value='Upload' />
                                    </div>
                                }
                            </Row>
                        </Form>
                    </div>
                    <Notification notify={NotifyData} CloseError={CloseError} CloseSuccess={CloseSuccess} />
                </div >

                <div className='col-md-9 '>
                    <TabComponent data={data} columns={columns} />
                </div>
            </div>
        </div >
    )
}

export default memo(VerifyData)