import React, { memo, useRef, useState } from 'react'
import { Form, Row, Col, InputGroup } from 'react-bootstrap'
import { SiProducthunt } from 'react-icons/si';
import { GiTwoCoins } from 'react-icons/gi';
import { FaBoxOpen, FaRegChartBar } from 'react-icons/fa';
import { BsCurrencyExchange } from 'react-icons/bs';
import { MdOutlineSecurity } from 'react-icons/md';
import { useEffect } from 'react';
import { Notification } from '../../Notification';
import { GetProductConfHis_API, UpdateProductDetails_API } from '../../Redux/API';
import profile from '../../ProfilePage/ProfilePage.module.scss'

const ProductConfig = (props) => {
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
    const [fetchData, setFetchData] = useState([]);

    const [validated, setValidated] = useState(false);
    const [productDetails, setProductDetails] = useState({})
    const [scripcode, setScripCode] = useState()
    const formRef = useRef();

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
        if (formRef.current.checkValidity() === false) {
            e.stopPropagation();
            setNotifyData((data) => ({ ...data, confirmFlag: false }))
        }
        else {
            setNotifyData((data) => ({ ...data, loadingFlag: true, loadingMsg: "Saving product configuration data..." }))
            const ps1 = new Promise((resolve, reject) => {
                resolve(UpdateProductDetails_API({ id: scripcode.split(' ')[0], marginrate: productDetails.marginrate, multiplier: productDetails.multiplier, lotsize: productDetails.lotsize }))
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
    }

    useEffect(() => {
        async function fetchConversionData(e) {
            // e.preventDefault();
            setNotifyData((data) => ({
                ...data,
                loadingFlag: true,
                loadingMsg: "Retriving Trade converison data...",
            }));
            const ps1 = new Promise((resolve, reject) => {
                resolve(GetProductConfHis_API("new"));
            });
            const rs = await Promise.all([ps1])
                .then((val) => {
                    return val[0]["data"];
                })
                .catch((err) => {
                    setNotifyData((data) => ({ ...data, loadingFlag: false, errorFlag: true, errorMsg: err["message"] }));
                    // setNotifyData((data) => ({
                    //   ...data,
                    //   errorFlag: true,
                    //   errorMsg: err["message"],
                    // }));
                    return err["response"];
                });
            if (rs["type"] === "success") {
                setNotifyData((data) => ({ ...data, loadingFlag: false }));
                setFetchData(rs["data"]);
            } else {
                setNotifyData((data) => ({ ...data, loadingFlag: false, errorFlag: true, errorMsg: rs["message"] }));
                // setNotifyData((data) => ({
                //   ...data,
                //   errorFlag: true,
                //   errorMsg: rs["message"],
                // }));
            }
        }
        fetchConversionData();
    }, []);


    return (
        <div className={`basic-forminfo ${profile.basicInfo}`}>
            <h5 className={profile.basicHeading}>
                <span className={profile.icons}>
                    <SiProducthunt />
                </span>
                Product Configuration
            </h5>
            <Form
                ref={formRef}
                noValidate
                validated={validated}
                // onSubmit={handleSubmit}
                onSubmit={(e) => {
                    e.preventDefault();
                    setNotifyData((data) => ({
                        ...data,
                        confirmFlag: true,
                        confirmMsg: "Are you sure,  You want to save product configuration?",
                        confirmAction: (e) =>
                            handleSubmit(e)
                    }))
                }}
                className={profile.basicInfoSetting}
            >
                <Row className="mb-3">
                    <Form.Group
                        as={Col}
                        md="6"
                        controlId="validationCustomScripCode"
                        className='mb-3'
                    >
                        <Form.Label>
                            <span className={`label-icon ${profile.labelIcon}`}>
                                <SiProducthunt />
                            </span>
                            Select Product
                            <span className={profile.mendatory}>
                                *
                            </span>
                        </Form.Label>
                        <InputGroup hasValidation>
                            <Form.Select
                                value={scripcode}
                                onChange={async (e) => {
                                    e.preventDefault()
                                    setScripCode(e.target.value)
                                    setNotifyData((data) => ({ ...data, loadingFlag: true, loadingMsg: "Retriving product configuration data..." }))
                                    const ps1 = new Promise((resolve, reject) => {
                                        resolve(GetProductConfHis_API(e.target.value.split(' ')[0]))
                                    })
                                    const rs = await Promise.all([ps1]).then((val) => {
                                        return val[0]['data'];
                                    }).catch((err) => {
                                        setNotifyData((data) => ({ ...data, loadingFlag: false }))
                                        setNotifyData((data) => ({ ...data, errorFlag: true, errorMsg: err['message'] }))
                                        return err['response']
                                    })
                                    if (rs['type'] === 'success') {
                                        setNotifyData((data) => ({ ...data, loadingFlag: false }))
                                        setProductDetails(rs['data'][0])
                                        // dispatch(LoginAction(rs['data']));
                                    } else {
                                        setNotifyData((data) => ({ ...data, loadingFlag: false }))
                                        setNotifyData((data) => ({ ...data, errorFlag: true, errorMsg: rs['message'] }))
                                    }
                                }}
                                aria-label="Floating label select example"
                                defaultValue={"Select Product"}
                            >
                                <option value='Select Product' hidden >Select Product</option>
                                {fetchData.map((val) => { return <option key={val} value={val}>{val}</option> })}
                            </Form.Select>
                            <Form.Control.Feedback type="invalid">
                                Please select product
                            </Form.Control.Feedback>
                        </InputGroup>
                    </Form.Group>
                    <Form.Group
                        as={Col}
                        md="6"
                        controlId="validationCustomSymbol"
                        className='mb-3'
                    >
                        <Form.Label>
                            <span className={`label-icon ${profile.labelIcon}`}>
                                <FaBoxOpen />
                            </span>
                            Symbol
                            <span className={profile.mendatory}>
                                *
                            </span>
                        </Form.Label>
                        <InputGroup hasValidation>
                            <Form.Control
                                type="text"
                                readOnly
                                pattern="[^\s]+"
                                required
                                value={productDetails.symbol}
                            />
                            <Form.Control.Feedback type="invalid">
                                Please enter symbol.
                            </Form.Control.Feedback>
                        </InputGroup>
                    </Form.Group>
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
                                pattern="[^\s]+"
                                readOnly
                                required
                                value={productDetails.exchange}
                            />
                            <Form.Control.Feedback type="invalid">
                                Please enter Exchange
                            </Form.Control.Feedback>
                        </InputGroup>
                    </Form.Group>

                    <Form.Group
                        as={Col}
                        md="6"
                        controlId="validationCustomSecurityType"
                        className='mb-3'
                    >
                        <Form.Label>
                            <span className={`label-icon ${profile.labelIcon}`}>
                                <MdOutlineSecurity />
                            </span>
                            Security Type
                            <span className={profile.mendatory}>
                                *
                            </span>
                        </Form.Label>
                        <InputGroup hasValidation>
                            <Form.Control
                                type="text"
                                pattern="[^\s]+"
                                readOnly
                                required
                                value={productDetails.securitytype}
                            />
                            <Form.Control.Feedback type="invalid">
                                Please enter SecurityType
                            </Form.Control.Feedback>
                        </InputGroup>
                    </Form.Group>

                    <Form.Group
                        as={Col}
                        md="6"
                        controlId="validationCustomMarginRate"
                        className='mb-3'
                    >
                        <Form.Label>
                            <span className={`label-icon ${profile.labelIcon}`}>
                                <FaRegChartBar />
                            </span>
                            Margin Rate
                            <span className={profile.mendatory}>
                                *
                            </span>
                        </Form.Label>
                        <InputGroup hasValidation>
                            <Form.Control
                                type="number"
                                pattern="[^\s]+"
                                placeholder='Enter MarginRate'
                                required
                                onChange={(e) => { setProductDetails({ ...productDetails, marginrate: e.target.value }) }}
                                value={productDetails.marginrate}
                            />
                            <Form.Control.Feedback type="invalid">
                                Please enter MarginRate
                            </Form.Control.Feedback>
                        </InputGroup>
                    </Form.Group>
                    <Form.Group
                        as={Col}
                        md="6"
                        controlId="validationCustomMultiplier"
                        className='mb-3'
                    >
                        <Form.Label>
                            <span className={`label-icon ${profile.labelIcon}`}>
                                <GiTwoCoins />
                            </span>
                            Multiplier
                            <span className={profile.mendatory}>
                                *
                            </span>
                        </Form.Label>
                        <InputGroup hasValidation>
                            <Form.Control
                                type="number"
                                pattern="[^\s]+"
                                placeholder='Enter Multiplier'
                                required
                                onChange={(e) => { setProductDetails({ ...productDetails, multiplier: e.target.value }) }}
                                value={productDetails.multiplier}
                            />
                            <Form.Control.Feedback type="invalid">
                                Please enter Multiplier
                            </Form.Control.Feedback>
                        </InputGroup>
                    </Form.Group>
                    <Form.Group
                        as={Col}
                        md="6"
                        controlId="validationCustomLotSize"
                        className='mb-3'
                    >
                        <Form.Label>
                            <span className={`label-icon ${profile.labelIcon}`}>
                                <GiTwoCoins />
                            </span>
                            LotSize
                            <span className={profile.mendatory}>
                                *
                            </span>
                        </Form.Label>
                        <InputGroup hasValidation>
                            <Form.Control
                                type="number"
                                pattern="[^\s]+"
                                placeholder='Enter LotSize'
                                onChange={(e) => { setProductDetails({ ...productDetails, lotsize: e.target.value }) }}
                                required
                                value={productDetails.lotsize}

                            />
                            <Form.Control.Feedback type="invalid">
                                Please enter LotSize
                            </Form.Control.Feedback>
                        </InputGroup>
                    </Form.Group>
                </Row>
                <div className={profile.configBtnSection}>
                    <input
                        type="submit"
                        className={profile.basicInfoBtn}
                        value='Save'
                    //    onSubmit={handleSubmit}
                    />

                    <input
                        type="reset"
                        className={profile.basicDangerBtn}
                        value='Clear'
                    />
                </div>
                <h6 onClick={() => props.toggleVisibility()} className={profile.hideShowtoggle}>
                    {props.visibility ? 'Hide ' : 'Show '}
                    Product Configuration History
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

export default memo(ProductConfig)