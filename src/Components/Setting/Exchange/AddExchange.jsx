import React, { useState, useRef, memo } from 'react'
import { Form, Row, Col, InputGroup } from 'react-bootstrap'
import { BsCurrencyExchange } from 'react-icons/bs';
import { GiTwoCoins } from 'react-icons/gi';
import { Notification } from '../../Notification';
import { AddExchange_API } from '../../Redux/API';
import profile from '../../ProfilePage/ProfilePage.module.scss'


const AddExchange = (props) => {
    const [addExchangeDetails, setAddExchangeDetails] = useState({
        exchange: '',
        currency: '',
        brokeragetype: '',
        margintype: ''
    })
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
    const [errorMessage, setErrorMessage] = useState("Enter Exchange Name");
    const [validated, setValidated] = useState(false);
    const formRef = useRef('');


    const handleSubmit = async (event) => {
        event.preventDefault();
        if (formRef.current.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
            setNotifyData((data) => ({ ...data, confirmFlag: false }))
        }
        else {
            setNotifyData((data) => ({ ...data, loadingFlag: true, loadingMsg: "Inserting Exchange..." }))
            const ps1 = new Promise((resolve, reject) => {
                resolve(AddExchange_API(addExchangeDetails))
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
                setNotifyData((data) => ({ ...data, loadingFlag: false, confirmFlag: false, errorFlag: true, ErrorMsg: rs['message'], activesession: rs['session'] }))
            }
        }
        setValidated(true);
    };

    const handleChange = (event) => {
        setAddExchangeDetails({
            ...addExchangeDetails,
            [event.target.name]: (event.target.value).replace(/[^A-Z]/gi, '').toUpperCase()
        });
        if (event.target.value.includes(" ")) {
            setErrorMessage("No Space Allowed");
        }
        else {
            setErrorMessage("Enter Exchange Name");
        }

    }

    const CloseConfirm = () => {
        setNotifyData((data) => ({ ...data, confirmFlag: false }))
    }

    const CloseError = () => {
        setNotifyData((data) => ({ ...data, errorFlag: false }))
    }

    const CloseSuccess = () => {
        setNotifyData((data) => ({ ...data, successFlag: false }))
    }

    return (
        <div className={`basic-forminfo ${profile.basicInfo}`}>
            <h5 className={profile.basicHeading}>
                <span className={profile.icons}>
                    <BsCurrencyExchange />
                </span>
                Add Exchange
            </h5>
            <Form
                ref={formRef}
                // noValidate
                validated={validated}
                onSubmit={handleSubmit}
                className={profile.basicInfoSetting}
            >
                <Row className="mb-3">
                    <Form.Group
                        as={Col}
                        md="6"
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
                        <InputGroup hasValidation>
                            <Form.Control
                                type="text"
                                name='exchange'
                                placeholder="Enter Exchange Name"
                                pattern="[^\s]+"
                                value={addExchangeDetails.exchange}
                                // onChange={(e) => setAddExchangeDetails({ ...addExchangeDetails, exchange: e.target.value })}
                                onChange={handleChange}
                                required
                            />

                            <Form.Control.Feedback type="invalid">
                                {errorMessage}
                            </Form.Control.Feedback>
                        </InputGroup>
                    </Form.Group>
                    <Form.Group as={Col}
                        md="6"
                        controlId="validationCustomCurrency"
                        className='mb-3'
                    >
                        <Form.Label>
                            <span className={`label-icon ${profile.labelIcon}`}>
                                <GiTwoCoins />
                            </span>
                            Currency
                            <span className={profile.mendatory}>
                                *
                            </span>
                        </Form.Label>
                        <Form.Select
                            name='currency'
                            value={addExchangeDetails.currency}
                            // onChange={(e)=>setAddExchangeDetails({...addExchangeDetails,currency:e.target.value})}
                            onChange={handleChange}
                            aria-label="Floating label select example"
                            required
                            defaultValue={"Select Currency"}>
                            <option value="Select Currency"  hidden>Select Currency</option>
                            <option value="INR">INR</option>
                            <option value="USD">USD</option>
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                            Please Select Currency
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col}
                        md="6"
                        controlId="validationCustomBrokerageType"
                        className='mb-3'
                    >
                        <Form.Label>
                            <span className={`label-icon ${profile.labelIcon}`}>
                                <GiTwoCoins />
                            </span>
                            Brokerage Type
                            <span className={profile.mendatory}>
                                *
                            </span>
                        </Form.Label>
                        <Form.Select
                            name='brokeragetype'
                            value={addExchangeDetails.brokeragetype}
                            // onChange={(e)=>setAddExchangeDetails({...addExchangeDetails,brokeragetype:e.target.value})}
                            onChange={handleChange}
                            aria-label="Floating label select example"
                            required
                            defaultValue={"Select Brokerage"}>
                            <option value="Select Brokerage"  hidden>Select Brokerage</option>
                            <option value="CR">CR</option>
                            <option value="LOT">LOT</option>
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                            Please Select Brokerage
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col}
                        md="6"
                        controlId="validationCustomUserId"
                        className='mb-3'
                    >
                        <Form.Label>
                            <span className={`label-icon ${profile.labelIcon}`}>
                                <GiTwoCoins />
                            </span>
                            Margin Type
                            <span className={profile.mendatory}>
                                *
                            </span>
                        </Form.Label>
                        <Form.Select
                            name='margintype'
                            value={addExchangeDetails.margintype}
                            // onChange={(e)=>setAddExchangeDetails({...addExchangeDetails,margintype:e.target.value})}
                            onChange={handleChange}
                            aria-label="Floating label select example"
                            required
                            defaultValue={"Select Margin"}>
                            <option value="Select Margin"  hidden>Select Margin</option>
                            <option value="CR">CR</option>
                            <option value="LOT">LOT</option>
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                            Please Select Margin
                        </Form.Control.Feedback>
                    </Form.Group>
                </Row>
                <div>
                    <input
                        type="submit"
                        className={profile.basicInfoBtn}
                        value='Add'
                        // onClick={handleSubmit}
                        onClick={(e) => {
                            e.preventDefault();
                            setNotifyData((data) => ({
                                ...data,
                                confirmFlag: true,
                                confirmMsg: "Are you sure, You want to add exchange ?",
                                confirmAction: (e) =>
                                    handleSubmit(e)
                            }))
                        }}
                    />
                </div>
                <h6
                    onClick={() => props.toggleVisibility()}
                    className={profile.hideShowtoggle}
                >
                    {props.visibility ? 'Hide ' : 'Show '}
                    Exchange History
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

export default memo(AddExchange)