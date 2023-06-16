import React, { memo, useState } from 'react'
import { Form, Row, Col, InputGroup } from 'react-bootstrap';
import { IoKeySharp } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { FaLock } from 'react-icons/fa';
import { socketClose } from '../../App';
import { Notification } from '../Notification';
import { Change_PWD_API } from '../Redux/API';
import { DeleteStateAction } from '../Redux/RMSAction';
import profile from './ProfilePage.module.scss'


const ChangePwd = (props) => {
    let navigate = useNavigate();
    const dispatch = useDispatch()
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

    const [validated, setValidated] = useState(false);
    const [changePwdDetails, setChangePwdDetails] = useState({})

    const CloseConfirm = () => {
        setNotifyData((data) => ({ ...data, confirmFlag: false }))
    }

    const CloseError = () => {
        setNotifyData((data) => ({ ...data, errorFlag: false }))
    }
    const CloseSuccess = () => {
        setNotifyData((data) => ({ ...data, successFlag: false }))
    }
    const handleSubmit = (event) => {
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }
        setValidated(true);
    };

    const onChangePWD = async (e) => {
        e.preventDefault()
        setNotifyData((data) => ({ ...data, loadingFlag: true, loadingMsg: "Changing Password..." }))
        const ps1 = new Promise((resolve, reject) => {
            resolve(Change_PWD_API(changePwdDetails))
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
            dispatch(DeleteStateAction());
            socketClose()
            navigate("/", { replace: true })
        } else {
            setNotifyData((data) => ({ ...data, loadingFlag: false, confirmFlag: false, errorFlag: true, errorMsg: rs['message'] }))
        }
    }
    return (
        <div className={`basic-forminfo ${profile.basicInfo}`}>
            <h5 className={profile.basicHeading}>
                <span className={profile.icons}>
                    <IoKeySharp />
                </span>
                Change Password
            </h5>
            <Form
                noValidate
                validated={validated}
                onSubmit={handleSubmit}
                className={profile.basicInfoSetting}
            >
                <Row className='mb-3'>
                    <Form.Group
                        as={Col}
                        md="12"
                        controlId="validationPassword"
                        className='mb-3'
                    >
                        <Form.Label>
                            <span className={`label-icon ${profile.labelIcon}`}>
                                <FaLock />
                            </span>
                            Current Password
                            <span className={profile.mendatory}>
                                *
                            </span>
                        </Form.Label>
                        <InputGroup hasValidation>
                            <Form.Control
                                type="password"
                                placeholder="Current Password"
                                required
                                onChange={(e) => setChangePwdDetails({ ...changePwdDetails, currentPwd: e.target.value })}
                                value={changePwdDetails.currentPwd}
                            />
                            <Form.Control.Feedback type="invalid">
                                Please provide a valid current password.
                            </Form.Control.Feedback>
                        </InputGroup>
                    </Form.Group>
                    <Form.Group
                        as={Col}
                        md="12"
                        controlId="validationNewpwd"
                        className="mb-3"
                    >
                        <Form.Label>
                            <span className={`label-icon ${profile.labelIcon}`}>
                                <FaLock />
                            </span>
                            New Password
                            <span className={profile.mendatory}>
                                *
                            </span>
                        </Form.Label>
                        <Form.Control
                            required
                            type="password"
                            placeholder="New Password"
                            onChange={(e) => setChangePwdDetails({ ...changePwdDetails, newPwd: e.target.value })}
                            value={changePwdDetails.newPwd}
                        />
                        <Form.Control.Feedback
                            type="invalid"
                        >
                            Please enter New Password
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col}
                        md="12"
                        controlId="validationCustomTelegramId"
                        className="mb-3"
                    >
                        <Form.Label>
                            <span className={`label-icon ${profile.labelIcon}`}>
                                <FaLock />
                            </span>
                            Confirm password
                            <span className={profile.mendatory}>
                                *
                            </span>
                        </Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Confirm password"
                            required
                            onChange={(e) => setChangePwdDetails({ ...changePwdDetails, password: e.target.value })}
                            value={changePwdDetails.confirmPwd}
                        />
                        <Form.Control.Feedback
                            type="invalid"
                        >
                            Please provide a valid Confirm password
                        </Form.Control.Feedback>
                    </Form.Group>
                </Row>
                <div>
                    <input
                        type="submit"
                        className={profile.basicInfoBtn}
                        value='Change'
                        onClick={(e) => {
                            e.preventDefault();
                            setNotifyData((data) => ({
                                ...data,
                                confirmFlag: true,
                                confirmMsg: "Are you sure, You want to change password ?",
                                confirmAction: (e) =>
                                    onChangePWD(e)
                            }))
                        }}
                    />
                </div>
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

export default memo(ChangePwd)