import React, { useState, memo } from 'react'
import { Col, Form, Row } from 'react-bootstrap';
import { NavLink, useNavigate } from 'react-router-dom';
import { Reset_PWD_API, Update_PWD_API } from '../../Components/Redux/API';
import { Notification } from '../Notification';
import authlogin from './Authentication.module.scss'
import lock from '../../Assets/Img/lock.png'
import background from '../../Assets/Img/background-pattern.svg'
import mainlogo from '../../Assets/Img/cosmic-logo.png'
import { FaUser } from "react-icons/fa";
import { MdVpnLock } from 'react-icons/md';

function ResetPwd() {
    let navigate = useNavigate();
    const [otpbox, setOtpbox] = useState(false)
    const [confirmbox, setConfirmOtpbox] = useState(false)
    const [NotifyData, setNotifyData] = useState({
        successFlag: false,
        successMsg: 'success msg',
        errorFlag: false,
        errorMsg: 'error msg',
        loadingFlag: false,
        loadingMsg: 'loading msg',
        activesession: false
    })

    const [data, setData] = useState({
        username: '',
        password: '',
        otp: '',
    })

    const CloseError = () => {
        setNotifyData((data) => ({ ...data, errorFlag: false }))
    }
    const CloseSuccess = () => {
        setNotifyData((data) => ({ ...data, successFlag: false }))
    }


    const sendOTP = async (e) => {
        e.preventDefault()
        setNotifyData((data) => ({ ...data, loadingFlag: true, loadingMsg: "Sending OTP..." }))
        const ps1 = new Promise((resolve, reject) => {
            resolve(Reset_PWD_API(data))
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
            setOtpbox(true)
        } else {
            setNotifyData((data) => ({ ...data, loadingFlag: false, errorFlag: true, errorMsg: rs['message'], activesession: rs['session'] }))
        }
    }

    const verifyOTP = async (e) => {
        e.preventDefault()
        setNotifyData((data) => ({ ...data, loadingFlag: true, loadingMsg: "Verifying OTP..." }))
        const ps1 = new Promise((resolve, reject) => {
            resolve(Reset_PWD_API(data))
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
            setOtpbox(false)
            setConfirmOtpbox(true)
        } else {
            setNotifyData((data) => ({ ...data, loadingFlag: false, errorFlag: true, errorMsg: rs['message'], activesession: rs['session'] }))
        }
    }

    const resetPassword = async (e) => {
        e.preventDefault()
        setNotifyData((data) => ({ ...data, loadingFlag: true, loadingMsg: "Updating password..." }))
        const ps1 = new Promise((resolve, reject) => {
            resolve(Update_PWD_API(data))
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
            setOtpbox(false)
            navigate("/", { replace: true })

        } else {
            setNotifyData((data) => ({ ...data, loadingFlag: false, errorFlag: true, errorMsg: rs['message'], activesession: rs['session'] }))
        }
    }

    return (
        <>
            <div className={`container-fluid ${authlogin.authentication}`}>
                <Row className={authlogin.Loginpage}>
                    <Col md={5} >
                        <Row className={authlogin.loginFormSection}>
                            <Col md={12}>
                                <NavLink to="/login" className={authlogin.logo}>
                                    <img src={mainlogo} alt="mainlogo" className={authlogin.responsiveimg} />
                                </NavLink>
                            </Col>
                            <Col md={12}>
                                <div className={authlogin.LoginCard}>
                                    <h3>Reset Password</h3>
                                    {!confirmbox ?
                                        <Form>
                                            <Form.Group className="mb-4">
                                                <Form.Label
                                                    htmlFor="username"
                                                    className="form-label"
                                                >
                                                    <FaUser className={authlogin.labelIcon} /> Username
                                                </Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    className="form-control"
                                                    id="username"
                                                    placeholder="Enter username"
                                                    value={data.username}
                                                    onChange={(e) => setData({ ...data, username: e.target.value })}
                                                />
                                            </Form.Group>
                                            {otpbox &&
                                                <Form.Group className="mb-4">
                                                    <Form.Label
                                                        htmlFor="otp"
                                                        className="form-label"
                                                    >
                                                        <MdVpnLock className={authlogin.labelIcon} /> OTP
                                                    </Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        className="form-control"
                                                        id="otp"
                                                        placeholder="Enter OTP "
                                                        value={data.otp}
                                                        onChange={(e) => setData({ ...data, otp: e.target.value })}
                                                    />
                                                </Form.Group>
                                            }

                                            {otpbox
                                                ?
                                                <Form.Group className={authlogin.customBtn}>
                                                    <Form.Control
                                                        type='submit'
                                                        value='Verify'
                                                        className={authlogin.sigleCustomBtn}
                                                        onClick={verifyOTP}
                                                    />
                                                </Form.Group>
                                                :
                                                <Form.Group className={authlogin.customBtn}>
                                                    <Form.Control
                                                        type='submit'
                                                        value='Send'
                                                        className={authlogin.sigleCustomBtn}
                                                        onClick={sendOTP}
                                                    />
                                                </Form.Group>
                                            }
                                            <Notification notify={NotifyData} CloseError={CloseError} CloseSuccess={CloseSuccess} />
                                        </Form>
                                        :
                                        <Form>
                                            <Form.Group className="mb-4">
                                                <Form.Label
                                                    htmlFor="password"
                                                    className="form-label"
                                                >
                                                    <FaUser className={authlogin.labelIcon} /> New Password
                                                </Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    className="form-control"
                                                    id="password"
                                                    placeholder="Enter New Password"
                                                    value={data.password}
                                                    onChange={(e) => setData({ ...data, password: e.target.value })}
                                                />
                                            </Form.Group>
                                            <Form.Group className="mb-4">
                                                <Form.Label
                                                    htmlFor="confirmpassword"
                                                    className="form-label"
                                                >
                                                    <FaUser className={authlogin.labelIcon} /> Confirm Password
                                                </Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    className="form-control"
                                                    id="confirmpassword"
                                                    placeholder="Enter Confirm Password"
                                                // value={data.username}
                                                // onChange={(e) => setData({ ...data, username: e.target.value })}
                                                />
                                            </Form.Group>
                                            <Form.Group className={authlogin.customBtn}>
                                                <Form.Control
                                                    type='submit'
                                                    value='Submit'
                                                    className={authlogin.sigleCustomBtn}
                                                    onClick={resetPassword}
                                                />
                                            </Form.Group>
                                        </Form>
                                    }
                                </div>
                            </Col>
                        </Row>
                    </Col>
                    <Col md={7}>
                        <div className={authlogin.chatBackground}>
                            <img className={authlogin.backimg} src={background} alt="" />
                            <img className={authlogin.backimg2} src={lock} alt="" />
                            <div className={authlogin.backcontent}>
                                <h4 className={authlogin.content}>Soft UI Design</h4>
                            </div>
                            <div className={authlogin.backPContent}>
                                <p>Just as it takes a company to sustain a product, it takes a community to sustain a protocol.</p>
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>
        </>
    )
}
export default memo(ResetPwd)