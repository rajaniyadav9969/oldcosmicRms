import React, { memo, useState } from 'react'
import { Form, Row, Col, InputGroup } from 'react-bootstrap'
import { BsCalendar2EventFill } from 'react-icons/bs';
import moment from 'moment';
import { MdBackup } from "react-icons/md";
import { Backup_API } from '../../Redux/API';
import { Notification } from '../../Notification';
import { Datepicker } from '../../DynamicComponent';
import profile from '../../ProfilePage/ProfilePage.module.scss'


const NetpositionBackup = (props) => {
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
        setNotifyData((data) => ({ ...data, loadingFlag: true, loadingMsg: "Backup netposition data..." }))
        const ps1 = new Promise((resolve, reject) => {
            resolve(Backup_API({ type: 'position', date: dateValue }))
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
            setNotifyData((data) => ({ ...data, loadingFlag: false, confirmFlag: false, errorFlag: true, ErrorMsg: rs['message'], activesession: rs['session'] }))
        }
    };
    const handleDate = (props) => {
        setDateValue(props)
    }
    return (
        <div className={`basic-forminfo ${profile.basicInfo}`}>
            <Form
                noValidate

                validated={validated}
                // onSubmit={handleSubmit}
                className={`${profile.basicInfoSetting} ${profile.history}`}
            >
                <Row className={profile.historySection}>
                    <div className="col-md-9">
                        <h5 className={profile.basicHeading}>
                            <span className={profile.icons}>
                                <MdBackup />
                            </span>
                            Netposition Backup
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

                    <div className={`col-md-1 ${profile.rmsBtnSection}`}>
                        <input
                            type="submit"
                            className={profile.basicInfoBtn}
                            value='Backup'
                            // onClick={handleSubmit}
                            onClick={(e) => {
                                e.preventDefault();
                                setNotifyData((data) => ({
                                    ...data,
                                    confirmFlag: true,
                                    confirmMsg: "Are you sure, You want to netpostion backup ?",
                                    confirmAction: (e) =>
                                        handleSubmit(e)
                                }))
                            }}
                        />
                    </div>
                </Row>
                <h6 onClick={() => props.netHideShow()} className={profile.hideShowtoggle}>
                    {props.netshow ? 'Hide ' : 'Show '}
                    NetPosition History
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

export default memo(NetpositionBackup)