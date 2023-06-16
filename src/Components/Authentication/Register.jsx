import React, { memo, useState } from 'react'
import { Col, Form, Row } from 'react-bootstrap';
import { useNavigate, NavLink } from 'react-router-dom';
import { Register_User_API } from '../Redux/API';
import { Notification } from '../Notification';
import authlogin from './Authentication.module.scss'
import avtarimg from '../../Assets/Gif/bg1.gif'
import rocket from '../../Assets/Img/chat.png'
import background from '../../Assets/Img/background-pattern.svg'
import { FaLock, FaUser, FaUsersCog } from 'react-icons/fa';
import { BsFillEyeFill, BsFillEyeSlashFill } from 'react-icons/bs';


function Register() {
    const navigate = useNavigate()
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
        rolename: '',
        pwdvisibilty: false,
        cnfpwdvisibilty: false
    })

    const CloseError = () => {
        setNotifyData((data) => ({ ...data, errorFlag: false }))
    }
    const CloseSuccess = () => {
        setNotifyData((data) => ({ ...data, successFlag: false }))
    }
    const register = async (e) => {
        e.preventDefault();
        setNotifyData((data) => ({ ...data, loadingFlag: true, loadingMsg: "Creating new user..." }))
        const ps1 = new Promise((resolve, reject) => {
            resolve(Register_User_API(data))
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
            setNotifyData((data) => ({ ...data, loadingFlag: false, successFlag: true, successMsg: "Register Successful" }))
            navigate("/usermanagement", { replace: true })
        } else {
            setNotifyData((data) => ({ ...data, loadingFlag: false, errorFlag: true, errorMsg: rs['message'] }))
        }
    }

    return (
        <>
            <div className={`container-fluid ${authlogin.authentication}`}>
                <Row className={authlogin.Loginpage}>
                    <Col md={5} >
                        <div className={`register-section ${authlogin.LoginCard} ${authlogin.registerCard}`}>
                            <div className="d-flex">
                                <h1 className={authlogin.hey}>Hey,</h1><div className={authlogin.BotAvatar}>
                                    <img className={authlogin.avatar} src={avtarimg} alt="avtarimg" />
                                </div>
                            </div>
                            <h3>Create new account</h3>
                            <Form
                                noValidate
                                onSubmit={register}
                                className=""
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
                                        value={data.username} onChange={(e) => setData({ ...data, username: e.target.value })}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label
                                        htmlFor="role"
                                        className="form-label"
                                    >
                                        <FaUsersCog className={authlogin.labelIcon} /> Role
                                    </Form.Label>
                                    <Form.Select
                                        name='role'
                                        value={data.rolename}
                                        onChange={(e) => setData({ ...data, rolename: e.target.value })}
                                        aria-label="Floating label select example"
                                        required
                                        defaultValue={"Select Role"}>
                                        <option value="Select Role" hidden>Select Role</option>
                                        <option value="client">CLIENT</option>
                                        <option value="broker">BROKER</option>
                                        <option value="company">COMPANY</option>
                                    </Form.Select>
                                    <Form.Control.Feedback type="invalid">
                                        Please Select Role
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group
                                    className={`mb-3 ${authlogin.passwordSection}`}
                                >
                                    <Form.Label
                                        htmlFor="password"
                                        className="form-label"
                                    >
                                        <FaLock className={authlogin.labelIcon} /> Password
                                    </Form.Label>
                                    <Form.Control
                                        type={data.pwdvisibilty ? "text" : "password"}
                                        className="form-control"
                                        id="password"
                                        placeholder="Enter password "
                                        value={data.password} onChange={(e) => setData({ ...data, password: e.target.value })}
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
                                <Form.Group
                                    className={`mb-4 ${authlogin.passwordSection}`}
                                >
                                    <Form.Label
                                        htmlFor="cnfpassword"
                                        className="form-label">
                                        <FaLock className={authlogin.labelIcon} /> Confirm Password
                                    </Form.Label>
                                    <Form.Control
                                        type={data.cnfpwdvisibilty ? "text" : "password"}
                                        className="form-control"
                                        id="cnfpassword"
                                        placeholder="Enter Confirm password "
                                    />
                                    <i
                                        onClick={(e) => {
                                            setData({
                                                ...data,
                                                cnfpwdvisibilty: !data.cnfpwdvisibilty
                                            })
                                        }}
                                        className={authlogin.adminPassHideShow}
                                    >
                                        {data.cnfpwdvisibilty
                                            ?
                                            <BsFillEyeFill className={authlogin.eyeIcon} />
                                            :
                                            <BsFillEyeSlashFill className={authlogin.eyeIcon} />
                                        }
                                    </i>
                                </Form.Group>
                                <Form.Group className={authlogin.customBtn}>
                                    <Form.Control
                                        type='submit'
                                        value='Register'
                                        className={authlogin.sigleCustomBtn}
                                    // onClick={register} 
                                    />

                                </Form.Group>
                            </Form>
                        </div>
                    </Col>
                    <Col md={7}>
                        <div className={`${authlogin.chatBackground} ${authlogin.rocketBackgroung}`}>
                            <img className={authlogin.backimg} src={background} alt="" />
                            <img className={authlogin.backimg2} src={rocket} alt="" />
                            <div className={authlogin.backcontent}>
                                <h4 className={authlogin.content}>Your journey starts here</h4>
                            </div>
                            <div className={authlogin.backPContent}>
                                <p>Just as it takes a company to sustain a product, it takes a community to sustain a protocol.</p>
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>
            <Notification notify={NotifyData} CloseError={CloseError} CloseSuccess={CloseSuccess} />
        </>
    )
}

export default memo(Register)