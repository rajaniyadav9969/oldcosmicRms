import React, { memo, useState } from 'react'
import { Form, Row, Col, InputGroup } from 'react-bootstrap'
import { AiFillEdit } from 'react-icons/ai';
import { FaAddressCard, FaPhoneAlt, FaTelegramPlane, FaUser } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';
import { useSelector } from 'react-redux';
import { Active2FA } from '../Authentication';
import { Notification, PopUp } from '../Notification';
import { UpdateUserBasicProfile_API } from '../Redux/API';
import profile from './ProfilePage.module.scss'


const BasicInfo = () => {

    const Globalprofile = useSelector(state => state && state.profile)
    const Globalsettings = useSelector(state => state && state.settings)


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

    const [ProfileDetails, setProfileDetails] = useState(Globalprofile)
    const [ProfileSettings, setProfileSettings] = useState(Globalsettings)
    const [edttoggle2fa, setEdtToggle2fa] = useState(false);
    const editToggle2fa = () => {
        edttoggle2fa ? setEdtToggle2fa(false) : setEdtToggle2fa(true);
    }

    const [validated, setValidated] = useState(false);

    const handleSubmit = (event) => {
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }
        setValidated(true);
    };

    const CloseConfirm = () => {
        setNotifyData((data) => ({ ...data, confirmFlag: false }))
    }

    const CloseError = () => {
        setNotifyData((data) => ({ ...data, errorFlag: false }))
    }
    const CloseSuccess = () => {
        setNotifyData((data) => ({ ...data, successFlag: false }))
    }

    const handleUpdateBasicInfo = async (e) => {
        e.preventDefault()
        setNotifyData((data) => ({ ...data, loadingFlag: true, loadingMsg: "Updating Profile" }))
        const ps1 = new Promise((resolve, reject) => {
            resolve(UpdateUserBasicProfile_API({ profile: ProfileDetails }))
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
            // dispatch(LoginAction(rs['data']));
        } else {
            setNotifyData((data) => ({ ...data, loadingFlag: false, confirmFlag: false, errorFlag: true, errorMsg: rs['message'], activesession: rs['session'] }))
        }
    }

    return (
        <div className={`basic-forminfo ${profile.basicInfo}`}
        >
            <h5 className={profile.basicHeading}>
                <span className={profile.icons}>
                    <FaAddressCard />
                </span>
                Basic Info
            </h5>
            <Form
                noValidate
                validated={validated}
                onSubmit={handleSubmit}
                className={profile.basicInfoSetting}
            >
                <Row
                    className="mb-3"
                >
                    <Form.Group
                        as={Col}
                        md="6"
                        controlId="validationCustomName"
                        className='mb-3'
                    >
                        <Form.Label>
                            <span className={`label-icon ${profile.labelIcon}`}>
                                <FaUser />
                            </span>
                            First Name
                            <span className={profile.mendatory}>
                                *
                            </span>
                        </Form.Label>
                        <InputGroup hasValidation>
                            <Form.Control
                                type="text"
                                value={ProfileDetails.first_name}
                                onChange={(e) => setProfileDetails({ ...ProfileDetails, first_name: e.target.value })}
                                placeholder="First Name"
                                required
                            />
                            <Form.Control.Feedback type="invalid">
                                Please enter your first name.
                            </Form.Control.Feedback>
                        </InputGroup>
                    </Form.Group>
                    <Form.Group
                        as={Col}
                        md="6"
                        controlId="validationCustomName"
                        className='mb-3'
                    >
                        <Form.Label>
                            <span className={`label-icon ${profile.labelIcon}`}>
                                <FaUser />
                            </span>
                            Last Name
                            <span className={profile.mendatory}>
                                *
                            </span>
                        </Form.Label>
                        <InputGroup hasValidation>
                            <Form.Control
                                type="text"
                                placeholder="Last Name"
                                value={ProfileDetails.last_name}
                                onChange={(e) => setProfileDetails({ ...ProfileDetails, last_name: e.target.value })}
                                required
                            />
                            <Form.Control.Feedback type="invalid">
                                Please enter your last name.
                            </Form.Control.Feedback>
                        </InputGroup>
                    </Form.Group>
                    <Form.Group
                        as={Col}
                        md="6"
                        controlId="validationCustomEmail"
                        className="mb-3"
                    >
                        <Form.Label>
                            <span className={`label-icon ${profile.labelIcon}`}>
                                <MdEmail />
                            </span>
                            Email
                            <span className={profile.mendatory}>
                                *
                            </span>
                        </Form.Label>
                        <Form.Control
                            required
                            type="email"
                            value={ProfileDetails.email}
                            onChange={(e) => setProfileDetails({ ...ProfileDetails, email: e.target.value })}
                            placeholder="Email"
                        />
                        <Form.Control.Feedback
                            type="invalid"
                        >
                            Please enter valid emailID
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col}
                        md="5"
                        controlId="validationCustomTelegramId"
                        className={`mb-3 ${profile.telegramId}`}
                    >
                        <Form.Label>
                            <span className={`label-icon ${profile.labelIcon}`}>
                                <FaTelegramPlane />
                            </span>
                            Telegram Id
                            <span className={profile.mendatory}>
                                *
                            </span>
                        </Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Telegram Id"
                            value={ProfileDetails && ProfileDetails.telegramid}
                            readOnly
                            required
                        />
                        <Form.Control.Feedback
                            type="invalid"
                        >
                            Please provide a valid telegramId
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col}
                        md="1"
                        className={`mb-3 ${profile.teligramEditIcon}`}
                    >
                        <Form.Label></Form.Label>
                        <span className={profile.basicInfoEditbtn} onClick={editToggle2fa}>
                            <span style={{ textAlign: 'center' }}>
                                <AiFillEdit />
                            </span>
                        </span>
                    </Form.Group>
                    <Form.Group
                        as={Col}
                        md="6"
                        controlId="validationCustomPhone"
                        className="mb-3"
                    >
                        <Form.Label>
                            <span className={`label-icon ${profile.labelIcon}`}>
                                <FaPhoneAlt />
                            </span>
                            Contact No.
                            <span className={profile.mendatory}>
                                *
                            </span>
                        </Form.Label>
                        <Form.Control
                            type="number"
                            placeholder="Contact no."
                            value={ProfileDetails.contact}
                            onChange={(e) => setProfileDetails({ ...ProfileDetails, contact: e.target.value })}
                            required
                        />
                        <Form.Control.Feedback type="invalid">
                            Please enter phone number.
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group
                        as={Col}
                        md="6"
                    >
                        <Form.Label>
                            <span className={`label-icon ${profile.labelIcon}`}>
                                <FaUser />
                            </span>
                            Access UserId(You can't change)

                        </Form.Label>
                        <Form.Select
                            value={'View UserId'}
                            aria-label="Floating label select example"
                            required
                        >
                            <option value={'Select GroupBy'} hidden>View UserId</option>
                            {ProfileSettings.access_users.split(',').map((val, i) => { return <option key={i} value={val} disabled>{val}</option> })}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                            Please choose Userid
                        </Form.Control.Feedback>
                    </Form.Group>

                </Row>
                <div>
                    <input
                        type="submit"
                        className={profile.basicInfoBtn}
                        value='Update'
                        // onClick={handleUpdateBasicInfo()}
                        onClick={(e) => {
                            e.preventDefault();
                            setNotifyData((data) => ({
                                ...data,
                                confirmFlag: true,
                                confirmMsg: "Are you sure, You want to update your profile? ",
                                confirmAction: (e) => handleUpdateBasicInfo(e)
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
            <PopUp flag={edttoggle2fa} Close={editToggle2fa} component={<Active2FA />} />
        </div >
    )
}

export default memo(BasicInfo)