import React, { memo, useState } from 'react'
import { Col, Row, Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom';
import { DeleteSession_API, Login_User_API } from '../../Components/Redux/API';
import { LoginAction } from '../Redux/RMSAction';
import { Notification } from '../Notification';
import authlogin from './Authentication.module.scss'
import avtarimg from '../../Assets/Gif/bg1.gif'
import rocket from '../../Assets/Img/rocket-white.png'
import mainlogo from '../../Assets/Img/cosmic-logo.png'
import background from '../../Assets/Img/background-pattern.svg'
import { FaUser, FaLock } from "react-icons/fa";
import { BsFillEyeFill, BsFillEyeSlashFill } from "react-icons/bs";
import { WebsocketConnect } from '../../App';
import { Decompressed } from '../Utilities/Utilities';


function Login() {
    let navigate = useNavigate();
    const dispatch = useDispatch()
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
        username: (localStorage.getItem('rememberme') == 'true' && localStorage.getItem("data")) ? JSON.parse(localStorage.getItem("data")).username : '',
        password: (localStorage.getItem('rememberme') == 'true' && localStorage.getItem("data")) ? JSON.parse(localStorage.getItem("data")).password : '',
        otp: '',
        pwdvisibilty: false
    })

    const CloseError = () => {
        setNotifyData((data) => ({ ...data, errorFlag: false }))
    }
    const CloseSuccess = () => {
        setNotifyData((data) => ({ ...data, successFlag: false }))
    }
    const deletesession = async () => {
        setNotifyData((data) => ({ ...data, loadingFlag: true, loadingMsg: 'Deleteing sesssion...' }))
        const ps1 = new Promise((resolve, reject) => {
            resolve(DeleteSession_API(data))
        })
        const rs = await Promise.all([ps1]).then((val) => {
            return val[0]['data'];
        }).catch((err) => {
            setNotifyData((data) => ({ ...data, loadingFlag: false, errorFlag: true, errorMsg: err['message'] }))
            console.log("*********", err.response.status);
            (err.response.status === 401) && setTimeout(() => { window.location.assign(window.location.origin) }, 1000);
            return err["response"]["data"];
        }
        )
        if (rs['type'] === 'success') {
            setNotifyData((data) => ({ ...data, loadingFlag: false, successFlag: true, successMsg: rs['message'] }))
            setNotifyData((data) => ({ ...data, errorFlag: false, errorMsg: rs['message'] }))
        } else {
            setNotifyData((data) => ({ ...data, loadingFlag: false, errorFlag: true, errorMsg: rs['message'] }))
        }
    }

    const login = async (e) => {
        e.preventDefault()
        setNotifyData((data) => ({ ...data, loadingFlag: true, loadingMsg: "Loging user..." }))

        const ps1 = new Promise((resolve, reject) => {
            resolve(Login_User_API(data))
        })

        const rs = await Promise.all([ps1]).then((val) => {
            // return Decompressed(val[0]['data']);
            val[0]['data']['data']=Decompressed(val[0]['data']['data'])
            return val[0]['data'];
        }).catch((err) => {
            console.log("errroororooo", err);
            setNotifyData((data) => ({ ...data, loadingFlag: false, errorFlag: true, errorMsg: err['message'] }))
            console.log("*********", err.response.status);
            (err.response.status === 401) && setTimeout(() => { window.location.assign(window.location.origin) }, 1000);
            return err["response"]["data"];
        })
        console.log("typeeeeee///", typeof (rs['type']), rs['type'], rs);
        if (rs['type'] == 'success') {
            setNotifyData((data) => ({ ...data, loadingFlag: false, successFlag: true, successMsg: rs['message'] }))
            // localStorage.getItem('rememberme') == 'true' && localStorage.setItem('data', JSON.stringify(data))
            localStorage.setItem('data', JSON.stringify(data))
            localStorage.setItem('username', data.username)
            if (rs['2fa']) {
                console.log("enable 2fa");
                navigate("/2fa", { state: { data } })
            } else {
                dispatch(LoginAction(rs['data']));
                WebsocketConnect()
                navigate(rs['data']['settings']['defaultlandingpage'], { replace: true })

            }
        } else {
            console.log("hbsfhsbdfbshgsghjhb");
            setNotifyData((data) => ({ ...data, loadingFlag: false, errorFlag: true, errorMsg: rs['message'], activesession: rs['session'] }))
        }

    }
    const toggleChange = (e) => {
        localStorage.setItem('rememberme', e.target.checked)
        // e.target.checked && localStorage.setItem('data',data)
    }

    return (
        <React.Fragment>
            <div className={`container-fluid ${authlogin.authentication}`}>
                <Row className={authlogin.Loginpage}>
                    <Col md={5}>
                        <Row className={authlogin.loginFormSection}>
                            <Col md={12}>
                                <NavLink to="/" className={authlogin.logo}>
                                    <img src={mainlogo} alt="mainlogo" className={authlogin.responsiveimg} />
                                </NavLink>
                            </Col>
                            <Col md={12}>
                                <div className={authlogin.LoginCard}>
                                    <div className="d-flex">
                                        <h1 className={authlogin.hey}>Hey,</h1><div className={authlogin.BotAvatar}>
                                            <img className={authlogin.avatar} src={avtarimg} alt='avtarimg' />
                                        </div>
                                    </div>
                                    <h3>Login to your account</h3>
                                    <Form
                                        onSubmit={login}
                                    >
                                        <Form.Group className="mb-3">
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
                                        <Form.Group
                                            className={`mb-3 ${authlogin.passwordSection}`}
                                        >
                                            <Form.Label
                                                htmlFor="password"
                                            >
                                                <FaLock className={authlogin.labelIcon} /> Password
                                            </Form.Label>
                                            <Form.Control
                                                type={data.pwdvisibilty ? "text" : "password"}
                                                className="form-control"
                                                id="password"
                                                placeholder="Enter password "
                                                value={data.password}
                                                onChange={(e) => setData({ ...data, password: e.target.value })}
                                            />
                                            <i
                                                onClick={(e) => {
                                                    setData({
                                                        ...data,
                                                        pwdvisibilty: !data.pwdvisibilty
                                                    })
                                                }}
                                                className={authlogin.adminPassHideShow}
                                            >
                                                {data.pwdvisibilty
                                                    ?
                                                    <BsFillEyeFill className={authlogin.eyeIcon} />
                                                    :
                                                    <BsFillEyeSlashFill className={authlogin.eyeIcon} />
                                                }
                                            </i>
                                        </Form.Group>
                                        <Form.Group className="mb-3">
                                            <Form.Check
                                                type="switch"
                                                label="Remember me"
                                                name='rememberme'
                                                onChange={(e) => toggleChange(e)}
                                                defaultChecked={localStorage.getItem('rememberme') == 'true' ? true : false}

                                            />

                                        </Form.Group>
                                        <Form.Group className={authlogin.customBtn}>
                                            {/* <Form.Control
                                        type='button'
                                        value='Login'
                                        className={authlogin.sigleCustomBtn}
                                        onClick={login}
                                    /> */}
                                            <button type='submit'
                                                value='Login'
                                                className={authlogin.sigleCustomBtn}
                                                onClick={login}
                                            >Login</button>
                                        </Form.Group>
                                        {/* <div>
                                        <input
                                            className={authlogin.sigleCustomBtn}
                                            type='reset'
                                            value='Logout'
                                            onClick={async (e) => {
                                                setNotifyData((data) => ({ ...data, loadingFlag: true }))
                                                e.preventDefault()
                                                const ps1 = new Promise((resolve, reject) => {
                                                    resolve(Logout_User_API())
                                                })
                                                const rs = await Promise.all([ps1]).then((val) => {
                                                    return val[0]['data'];
                                                }).catch((err) => {
                                                    console.log("*********",err.response.status);
                    (err.response.status===401) && setTimeout(() => {window.location.assign(window.location.origin)}, 1000);
                    return err["response"]["data"];
                                                }
                                                )
                                                if (rs['type'] === 'success') {
                                                    setNotifyData((data) => ({ ...data, loadingFlag: false}))
                                                    setSuccess((data) => ({ ...data, flag: true, msg: "Logout Successful" }))
                                                } else {
                                                    setNotifyData((data) => ({ ...data, loadingFlag: false}))
                                                    setNotifyData((data) => ({ ...data, errorFlag: true, errorMsg: rs['message']}))
                                                }
                                            }}
                                        />
                                    </div> */}

                                        <div className={authlogin.userReg}>
                                            <NavLink to='/reset'>Forgot Password ?</NavLink><br />
                                            <Form.Label className="form-label">
                                                Don't have an account? Please contact administrator
                                            </Form.Label>
                                        </div>
                                    </Form>
                                </div>
                            </Col>
                        </Row>
                    </Col>
                    <Col md={7}>
                        {/* <img className={authlogin.bgimage} src={bgimage} /> */}
                        <div className={authlogin.chatBackground}>
                            <img className={authlogin.backimg} src={background} alt="" />
                            <img className={authlogin.backimg2} src={rocket} alt="" />
                            <div className={authlogin.backcontent}>
                                <h4 className={authlogin.content}>"Attention is the new currency"</h4>
                            </div>
                            <div className={authlogin.backPContent}>
                                <p>The more effortless the writing looks, the more effort the writer actually put into the process.</p>
                            </div>
                        </div>
                    </Col>
                </Row>
            </div >
            <Notification notify={NotifyData} CloseError={CloseError} CloseSuccess={CloseSuccess} deletesession={deletesession} />
        </React.Fragment >
    )
}
export default memo(Login)