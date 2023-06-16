import React, { memo, useState } from 'react'
import { Form, Row, Col, InputGroup } from 'react-bootstrap'
import { FaUser } from 'react-icons/fa';
import { Notification } from '../../Notification';
import { ExcludeUserId_API } from '../../Redux/API';
import profile from '../../ProfilePage/ProfilePage.module.scss'


const UserIdExclude = (props) => {
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
    const [useridErrorMessage, setUseridErrorMessage] = useState("Enter UserId");
    const [addExcludeUserId, setAddExcludeUserId] = useState(
        {
            userid: '',
        }
    )

    const [validated, setValidated] = useState(false);
    // const nameRef = useRef('');
    // const typeRef = useRef('');
    // const sharingRef = useRef('');
    // const parentIdRef = useRef('');

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
    // const handleErrorMessage = () => {
    //     if (nameRef.current.value.length > 0) {
    //         if (nameRef.current.value.includes(" ")) {
    //             setUseridErrorMessage("No Space Allowed");
    //         }
    //         else {
    //             setUseridErrorMessage("Field cannot be empty");
    //         }
    //     }
    // }

    const onAddExcludeUserId = async (e) => {
        e.preventDefault()
        setNotifyData((data) => ({ ...data, loadingFlag: true, loadingMsg: "Exclude userid..." }))
        const ps1 = new Promise((resolve, reject) => {
            resolve(ExcludeUserId_API(addExcludeUserId))
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
            setNotifyData((data) => ({ ...data, loadingFlag: false, confirmFlag: false, errorFlag: true, errorMsg: rs['message'] }))
        }
    }

    return (
        <div className={`basic-forminfo ${profile.basicInfo}`}>
            <h5 className={profile.basicHeading}>
                <span className={profile.icons}>
                    <FaUser />
                </span>
                Exclude UserIds
            </h5>
            <Form
                noValidate
                validated={validated}
                onSubmit={handleSubmit}
                className={profile.basicInfoSetting}
            >
                <Row className="">
                    <Form.Group
                        as={Col}
                        md="6"
                        controlId="validationCustomName"
                        className={`mb-3 ${profile.rmsName}`}
                    >
                        <Form.Label>
                            <span className={`label-icon ${profile.labelIcon}`}>
                                <FaUser />
                            </span>
                            UserId
                            <span className={profile.mendatory}>
                                *
                            </span>
                        </Form.Label>
                        <InputGroup hasValidation>
                            <Form.Control
                                type="text"
                                placeholder="Enter Userid"
                                pattern="[^\s]+"
                                // onChange={handleErrorMessage}
                                onChange={(e) => setAddExcludeUserId({ ...addExcludeUserId, userid: e.target.value })}
                                value={addExcludeUserId.userid}
                                required
                            />
                            <Form.Control.Feedback type="invalid">
                                {useridErrorMessage}
                            </Form.Control.Feedback>
                        </InputGroup>
                    </Form.Group>
                    <div
                        className={`col-md-6 mb-3 ${profile.rmsBtnSection} ${profile.createGroupBtn}`}
                    >
                        <input type="submit"
                            className={profile.basicInfoBtn}
                            value='Exclude'
                            // onClick={onAddExcludeUserId}
                            onClick={(e) => {
                                e.preventDefault();
                                setNotifyData((data) => ({
                                    ...data,
                                    confirmFlag: true,
                                    confirmMsg: "Are you sure, You want to exclude userid?",
                                    confirmAction: (e) =>
                                        onAddExcludeUserId(e)
                                }))
                            }}
                        />
                    </div>
                </Row>
                <h6 onClick={() => props.toggleVisibility()} className={profile.hideShowtoggle}>
                    {props.visibility ? 'Hide ' : 'Show '}
                    Exclude UserId History
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

export default memo(UserIdExclude)
