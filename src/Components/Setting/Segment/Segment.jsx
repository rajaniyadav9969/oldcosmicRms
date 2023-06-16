import React, { useState, useRef, memo } from 'react'
import { Form, Row, Col, InputGroup } from 'react-bootstrap'
import { FaUser } from 'react-icons/fa';
import { MdNoteAlt } from 'react-icons/md';
import { Notification } from '../../Notification';
import { CreateSegment_API } from '../../Redux/API';
import profile from '../../ProfilePage/ProfilePage.module.scss'


const Segment = (props) => {
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
    const [nameErrorMessage, setNameErrorMessage] = useState("Enter Exchange Name");
    // const [sharingErrorMessage, setSharingErrorMessage] = useState("Enter Exchange Name");
    // const [parentIdErrorMessage, setParentIdErrorMessage] = useState("Enter Exchange Name");
    const [addSegmentDetails, setAddSegmentDetails] = useState(
        {
            name: '',
        }
    )

    const [validated, setValidated] = useState(false);
    const nameRef = useRef('');
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
    //             setNameErrorMessage("No Space Allowed");
    //         }
    //         else {
    //             setNameErrorMessage("Field cannot be empty");
    //         }
    //     }
    //     if (sharingRef.current.value.length > 0) {
    //         if (sharingRef.current.value.includes(" ")) {
    //             setSharingErrorMessage("No Space Allowed");
    //         }
    //         else {
    //             setSharingErrorMessage("Field cannot be empty");
    //         }
    //     }
    //     if (parentIdRef.current.value.length > 0) {
    //         if (parentIdRef.current.value.includes(" ")) {
    //             setParentIdErrorMessage("No Space Allowed");
    //         }
    //         else {
    //             setParentIdErrorMessage("Field cannot be empty");
    //         }
    //     }
    // }

    const onAddSegment = async (e) => {
        e.preventDefault()
        setNotifyData((data) => ({ ...data, loadingFlag: true, loadingMsg: "Creating segment..." }))

        const ps1 = new Promise((resolve, reject) => {
            resolve(CreateSegment_API(addSegmentDetails))
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
                    <MdNoteAlt />
                </span>
                Create Segment
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
                            Name
                            <span className={profile.mendatory}>
                                *
                            </span>
                        </Form.Label>
                        <InputGroup hasValidation>
                            <Form.Control
                                type="text"
                                placeholder="Enter Segment Name"
                                pattern="[^\s]+"
                                // onChange={handleErrorMessage}
                                onChange={(e) => setAddSegmentDetails({ ...addSegmentDetails, name: e.target.value })}
                                value={addSegmentDetails.name}
                                ref={nameRef}
                                required
                            />
                            <Form.Control.Feedback type="invalid">
                                {nameErrorMessage}
                            </Form.Control.Feedback>
                        </InputGroup>
                    </Form.Group>
                    <div
                        className={`col-md-6 mb-3 ${profile.rmsBtnSection} ${profile.createGroupBtn}`}
                    >
                        <input type="submit"
                            className={profile.basicInfoBtn}
                            value='Submit'
                            // onClick={onAddSegment} 
                            onClick={(e) => {
                                e.preventDefault();
                                setNotifyData((data) => ({
                                    ...data,
                                    confirmFlag: true,
                                    confirmMsg: "Are you sure, You want to create segment name ?",
                                    confirmAction: (e) =>
                                        onAddSegment(e)
                                }))
                            }}
                        />
                    </div>
                </Row>
                <h6 onClick={() => props.toggleVisibility()} className={profile.hideShowtoggle}>
                    {props.visibility ? 'Hide ' : 'Show '}
                    Segment History
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
export default memo(Segment)
