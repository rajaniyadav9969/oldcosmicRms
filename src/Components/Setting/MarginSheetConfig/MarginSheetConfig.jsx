import React, { memo, useState ,useRef} from 'react'
import { Form, Row, Col, InputGroup } from 'react-bootstrap'
import { BsCurrencyExchange, BsGraphUp } from 'react-icons/bs';
import { FaRegChartBar, FaUser } from 'react-icons/fa';
import { GiTwoCoins } from 'react-icons/gi';
import { MdDataExploration } from 'react-icons/md';
import { SiGooglesheets } from 'react-icons/si';
import { useSelector } from 'react-redux';
import { Notification } from '../../Notification';
import { GetMarginSheetConfig_API, MarginSheetConfig_API } from '../../Redux/API';
import profile from '../../ProfilePage/ProfilePage.module.scss'

const MarginSheetConfig = ({ visibility, toggleVisibility }) => {
    const Globalexchange = useSelector(state => state && state.exchange)
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
    const [marginSheetConfigDetails, setMarginSheetConfigDetails] = useState({
        userid: '',
        exchange: '',
        currency: '',
        allowedlots: '',
        allowedmargin: '',
        deposit: '',
        levinterestyearly: '',
        hedgeratio: '', levgiven: '', perlot: ''
    })
    const [validated, setValidated] = useState(false);
    let formRef=useRef('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log('hnfhjjukknfhgsg',formRef);
        if (formRef.current.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
            setNotifyData((data) => ({ ...data, confirmFlag: false }))
            setValidated(true);
        }
        else {
            setNotifyData((data) => ({ ...data, loadingFlag: true, loadingMsg: "Saving marginsheet configuration data..." }))
            const ps1 = new Promise((resolve, reject) => {
                resolve(MarginSheetConfig_API(marginSheetConfigDetails))
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
                setMarginSheetConfigDetails({
                    userid: '',
                    exchange: '',
                    currency: '',
                    allowedlots: '',
                    allowedmargin: '',
                    deposit: '',
                    levinterestyearly: '',
                    hedgeratio: '', 
                    levgiven: '', 
                    perlot: ''
                })
                setValidated(false);
                
                
                // dispatch(LoginAction(rs['data']));
            } else {
                setNotifyData((data) => ({ ...data, loadingFlag: false, confirmFlag: false, errorFlag: true, errorMsg: rs['message'], activesession: rs['session'] }))
            }
        }
         
    };

    const getMarginSheetConfig = async (e) => {
        e.preventDefault()

        setNotifyData((data) => ({ ...data, loadingFlag: true, loadingMsg: "Retriving marginsheet configuration data..." }))
        const ps1 = new Promise((resolve, reject) => {
            resolve(GetMarginSheetConfig_API({ userid: marginSheetConfigDetails.userid, exchange: e.target.value }))
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
            setNotifyData((data) => ({ ...data, loadingFlag: false }))
            setMarginSheetConfigDetails(rs['data'][0])

        } else {
            setNotifyData((data) => ({ ...data, loadingFlag: false, errorFlag: true, errorMsg: rs['message'] }))
        }
    }

    const handleChange = (e) => {
        setMarginSheetConfigDetails({
            ...marginSheetConfigDetails,
            [e.target.name]: e.target.value
        })

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
                    <SiGooglesheets />
                </span>
                Margin Configuration
            </h5>
            <Form
                ref={formRef}
                noValidate
                validated={validated}
                onSubmit={handleSubmit}
                className={profile.basicInfoSetting}
            >
                <Row className="mb-3">
                    <Form.Group as={Col}
                        md="6"
                        controlId="validationCustomUserId"
                        className="mb-3">
                        <Form.Label>
                            <span className={`label-icon ${profile.labelIcon}`}>
                                <FaUser />
                            </span>
                            UserId
                            <span className={profile.mendatory}>
                                *
                            </span>
                        </Form.Label>
                        <Form.Select
                            name='userid'
                            value={marginSheetConfigDetails.userid}
                            onChange={handleChange}
                            aria-label="Floating label select example"
                            defaultValue={'Select UserId'}
                        >
                            <option value='Select UserId' hidden >Select UserId</option>

                            {Globalsettings && Globalsettings.access_users.split(',').sort().map((val) => { return <option key={val} value={val}>{val}</option> })}
                        </Form.Select>
                        {/* </Form.Control> */}
                        <Form.Control.Feedback type="invalid">
                            Please Select UserId
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col}
                        md="6"
                        controlId="validationCustomExchange"
                        className="mb-3">
                        <Form.Label>
                            <span className={`label-icon ${profile.labelIcon}`}>
                                <BsCurrencyExchange />
                            </span>
                            Exchange
                            <span className={profile.mendatory}>
                                *
                            </span>
                        </Form.Label>
                        <Form.Select
                            name='exchange'
                            value={marginSheetConfigDetails.exchange}
                            onChange={(e) => getMarginSheetConfig(e)}
                            aria-label="Floating label select example"
                            defaultValue={"Select Exchange"}
                        >
                            <option value='Select Exchange' hidden >Select Exchange</option>

                            {Globalexchange && Globalexchange.map((val) => { return <option key={val} value={val}>{val}</option> })}
                        </Form.Select>
                        {/* </Form.Control> */}
                        <Form.Control.Feedback type="invalid">
                            Select Exchange
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group
                        as={Col}
                        md="6"
                        controlId="validationCustomCurrency"
                        className="mb-3"
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
                        <InputGroup hasValidation>
                            <Form.Control
                                name='currency'
                                type="text"
                                placeholder="Enter Currency"
                                pattern="[^\s]+"
                                readOnly
                                value={
                                    (marginSheetConfigDetails.exchange === 'NSEFO')
                                        ?
                                        (marginSheetConfigDetails.currency = 'INR')
                                        :
                                        (marginSheetConfigDetails.exchange === 'SGXFO')
                                            ?
                                            (marginSheetConfigDetails.currency = 'USD')
                                            :
                                            ''
                                }
                                onChange={handleChange}
                                required
                            />
                            <Form.Control.Feedback type="invalid">
                                "Enter Currency"
                            </Form.Control.Feedback>
                        </InputGroup>
                    </Form.Group>
                    <Form.Group
                        as={Col}
                        md="6"
                        controlId="validationCustomAllowedMargin"
                        className="mb-3"
                    >
                        <Form.Label>
                            <span className={`label-icon ${profile.labelIcon}`}>
                                <FaRegChartBar />
                            </span>
                            Allowed Margin
                            <span className={profile.mendatory}>
                                *
                            </span>
                        </Form.Label>
                        <InputGroup hasValidation>
                            <Form.Control
                                name='allowedmargin'
                                type="number"
                                placeholder="Allowed Margin"
                                pattern="[^\s]+"
                                value={marginSheetConfigDetails.allowedlots * marginSheetConfigDetails.perlot}
                                onChange={handleChange}
                                readOnly={true}
                                required
                            />
                            <Form.Control.Feedback type="invalid">
                                Enter Allowed Margin
                            </Form.Control.Feedback>
                        </InputGroup>
                    </Form.Group>
                    <Form.Group
                        as={Col}
                        md="6"
                        controlId="validationCustomAllowedLots"
                        className="mb-3"
                    >
                        <Form.Label>
                            <span className={`label-icon ${profile.labelIcon}`}>
                                <GiTwoCoins />
                            </span>
                            Allowed Lots
                            <span className={profile.mendatory}>
                                *
                            </span>
                        </Form.Label>
                        <InputGroup hasValidation>
                            <Form.Control
                                name='allowedlots'
                                type="number"
                                placeholder="Allowed Lots"
                                pattern="[^\s]+"
                                value={marginSheetConfigDetails.allowedlots}
                                onChange={handleChange}
                                required
                            />
                            <Form.Control.Feedback type="invalid">
                                Enter Allowed Lots
                            </Form.Control.Feedback>
                        </InputGroup>
                    </Form.Group>
                    <Form.Group
                        as={Col}
                        md="6"
                        controlId="validationCustomHedgeRatio"
                        className="mb-3"
                    >
                        <Form.Label>
                            <span className={`label-icon ${profile.labelIcon}`}>
                                <GiTwoCoins />
                            </span>
                            Per Lot
                            <span className={profile.mendatory}>
                                *
                            </span>
                        </Form.Label>
                        <InputGroup hasValidation>
                            <Form.Control
                                name='perlot'
                                type="number"
                                placeholder="perlot"
                                pattern="[^\s]+"
                                value={marginSheetConfigDetails.perlot}
                                onChange={handleChange}
                                required
                            />
                            <Form.Control.Feedback type="invalid">
                                Enter per Lot
                            </Form.Control.Feedback>
                        </InputGroup>
                    </Form.Group>
                    <Form.Group
                        as={Col}
                        md="6"
                        controlId="validationCustomDepositAmount"
                        className="mb-3"
                    >
                        <Form.Label>
                            <span className={`label-icon ${profile.labelIcon}`}>
                                <GiTwoCoins />
                            </span>
                            Deposit Amount
                            <span className={profile.mendatory}>
                                *
                            </span>
                        </Form.Label>
                        <InputGroup hasValidation>
                            <Form.Control
                                name='deposit'
                                type="number"
                                placeholder="Deposit Amount"
                                pattern="[^\s]+"
                                value={marginSheetConfigDetails.deposit}
                                onChange={handleChange}
                                required
                            />
                            <Form.Control.Feedback type="invalid">
                                Enter Deposit Amount
                            </Form.Control.Feedback>
                        </InputGroup>
                    </Form.Group>
                    <Form.Group
                        as={Col}
                        md="6"
                        controlId="validationCustomLevInterestYearly"
                        className="mb-3"
                    >
                        <Form.Label>
                            <span className={`label-icon ${profile.labelIcon}`}>
                                <BsGraphUp />
                            </span>
                            Lev Interest Yearly
                            <span className={profile.mendatory}>
                                *
                            </span>
                        </Form.Label>
                        <InputGroup hasValidation>
                            <Form.Control
                                name='levinterestyearly'
                                type="number"
                                placeholder="Lev Interest Yearly"
                                pattern="[^\s]+"
                                value={marginSheetConfigDetails.levinterestyearly}
                                onChange={handleChange}
                                required
                            />
                            <Form.Control.Feedback type="invalid">
                                Enter Lev Interest Yearly
                            </Form.Control.Feedback>
                        </InputGroup>
                    </Form.Group>

                    <Form.Group
                        as={Col}
                        md="6"
                        controlId="validationCustomHedgeRatio"
                        className="mb-3"
                    >
                        <Form.Label>
                            <span className={`label-icon ${profile.labelIcon}`}>
                                <GiTwoCoins />
                            </span>
                            Leverage Given
                            <span className={profile.mendatory}>
                                *
                            </span>
                        </Form.Label>
                        <InputGroup hasValidation>
                            <Form.Control
                                name='levgiven'
                                type="number"
                                placeholder="Leverage Given"
                                pattern="[^\s]+"
                                value={marginSheetConfigDetails.levgiven}
                                onChange={handleChange}
                                required
                            />
                            <Form.Control.Feedback type="invalid">
                                Enter Leverage Given
                            </Form.Control.Feedback>
                        </InputGroup>
                    </Form.Group>
                    <Form.Group
                        as={Col}
                        md="6"
                        controlId="validationCustomHedgeRatio"
                        className="mb-3"
                    >
                        <Form.Label>
                            <span className={`label-icon ${profile.labelIcon}`}>
                                <MdDataExploration />
                            </span>
                            Hedge Ratio
                            <span className={profile.mendatory}>
                                *
                            </span>
                        </Form.Label>
                        <InputGroup hasValidation>
                            <Form.Control
                                name='hedgeratio'
                                type="number"
                                placeholder="HedgeRatio"
                                pattern="[^\s]+"
                                value={marginSheetConfigDetails.hedgeratio}
                                onChange={handleChange}
                                required
                            />
                            <Form.Control.Feedback type="invalid">
                                Enter Hedge Ratio
                            </Form.Control.Feedback>
                        </InputGroup>
                    </Form.Group>
                </Row>
                <div className={profile.configBtnSection}>
                    <input type="submit"
                        className={profile.basicInfoBtn}
                        value='Save'
                        // onClick={handleSubmit}
                        onClick={(e) => {
                            e.preventDefault();
                            setNotifyData((data) => ({
                                ...data,
                                confirmFlag: true,
                                confirmMsg: "Are you sure, You want to save margin configuration?",
                                confirmAction: (e) =>
                                    handleSubmit(e)
                            }))
                        }}
                    />
                    <input type="button"
                        className={profile.basicDangerBtn}
                        onClick={() => {
                            setMarginSheetConfigDetails({
                                userid: '',
                                exchange: '',
                                currency: '',
                                allowedlots: '',
                                allowedmargin: '',
                                deposit: '',
                                levinterestyearly: '',
                                hedgeratio: '', levgiven: '', perlot: ''
                            })
                        }}
                        value='Reset' />
                </div>
                <h6 onClick={() => toggleVisibility()} className={profile.hideShowtoggle}>
                    {visibility ? 'Hide ' : 'Show '}
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

export default memo(MarginSheetConfig)