import React, { memo, useRef, useState } from 'react'
import { Form, Row, Col, InputGroup } from 'react-bootstrap'
import { BsCurrencyExchange, BsFillCalendarXFill } from 'react-icons/bs';
import { FaHandsHelping, FaShare, FaUser, FaUserCog } from 'react-icons/fa';
import { GiPayMoney, GiReceiveMoney, GiTwoCoins } from 'react-icons/gi';
import { MdGroup, MdNoteAlt, MdOutlineSecurity } from 'react-icons/md';
import { HiAdjustments } from "react-icons/hi";
import { useSelector } from 'react-redux';
import { CreateUserConfig_API } from '../../Redux/API';
import { Notification } from '../../Notification';
import Autocomplete from 'react-autocomplete';
import profile from '../../ProfilePage/ProfilePage.module.scss'

const UserConfig = (props) => {
    const Globalsegmenttable = useSelector(state => state && state.segmenttable)
    const Globalgroupnametable = useSelector(state => state && state.groupnametable)
    const Globalsecuritytype = useSelector(state => state && state.securitytype)
    const Globalexchange = useSelector(state => state && state.exchange)
    const Globalsettings = useSelector(state => state && state.settings)

    const [validated, setValidated] = useState(false);
    const formRef = useRef();
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

    const options = Globalsettings.access_users.split(",").sort().map((el) => {
        return { label: el };
    });

    const CloseConfirm = () => {
        setNotifyData((data) => ({ ...data, confirmFlag: false }))
    }

    const CloseError = () => {
        setNotifyData((data) => ({ ...data, errorFlag: false }))
    }
    const CloseSuccess = () => {
        setNotifyData((data) => ({ ...data, successFlag: false }))
    }
    const [userConfigDetails, setuserConfigDetails] = useState({
        userid: '',
        exchange: '',
        securitytype: '',
        isusdlive: true,
        buybrok: '',
        sellbrok: '',
        exbuybrok: '',
        exsellbrok: '',
        usdinrcost: '',
        adjustmentfees: '',
        segmentid: '',
        segment: '',
        groupid: '',
        groupname: '',
        usdrate: 1,
        actualclientsharing: 0,
        actualbroksharing: 0,
    })

    // const createUserconfig = async (event) => {
    //     event.preventDefault();        
    //     setValidated(true);
    // };
    const handleSubmit = async (event) => {
        event.preventDefault();
        if (formRef.current.checkValidity() === false) {
            event.stopPropagation();
            setNotifyData((data) => ({ ...data, confirmFlag: false }))
        }
        else {
            setNotifyData((data) => ({ ...data, loadingFlag: true, loadingMsg: "Creating user configuration..." }))
            const ps1 = new Promise((resolve, reject) => {
                resolve(CreateUserConfig_API(userConfigDetails))
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
            } else {
                setNotifyData((data) => ({ ...data, loadingFlag: false, confirmFlag: false, errorFlag: true, errorMsg: rs['message'], activesession: rs['session'] }))
            }
        }
        setValidated(true);
    };

    const handleChange = (e) => {
        setuserConfigDetails({ ...userConfigDetails, [e.target.name]: e.target.value.toUpperCase() })
    }

    const toggleChange = (e) => {
        setuserConfigDetails({ ...userConfigDetails, [e.target.name]: !userConfigDetails.isusdlive })
    }




    // const checkWhiteSpace=(data)=>{
    //     let flag=false;
    //     if (data.toString().indexOf(' ')>0){
    //         flag=true
    //     }else{
    //         flag=false
    //     }
    //     return flag
    // }

    return (
        <div className={`basic-forminfo ${profile.basicInfo}`}>
            <h5 className={profile.basicHeading}>
                <span className={profile.icons}>
                    <FaUserCog />
                </span>
                Create User Configuration
            </h5>
            <Form
                ref={formRef}
                validated={validated}
                // onSubmit={handleSubmit}
                className={profile.basicInfoSetting}
            >
                <Row className="mb-1">
                    <Form.Group
                        as={Col}
                        md="6"
                        controlId="validationCustomUserId"
                        className="mb-3"
                    >
                        <Form.Label>
                            <span className={`label-icon ${profile.labelIcon}`}>
                                <FaUser />
                            </span>
                            UserId
                            <span className={profile.mendatory}>*</span>
                        </Form.Label>
                        <InputGroup hasValidation className={profile.userConfigUserId}>
                            <Autocomplete
                                items={options}
                                getItemValue={(item) => item.label}
                                renderItem={(item, isHighlighted) => (
                                    <h6
                                        style={{
                                            background: isHighlighted ? "lightgray" : "white",
                                            // position: "relative",
                                            // zIndex: "99999999",
                                        }}
                                    >
                                        {item.label}
                                    </h6>
                                )}
                                value={userConfigDetails.userid}
                                shouldItemRender={(item, value) =>
                                    item.label.toLowerCase().indexOf(value.toLowerCase()) > -1
                                }
                                onChange={(e) => {
                                    setuserConfigDetails({
                                        ...userConfigDetails,
                                        userid: e.target.value.toUpperCase(),
                                    });
                                }}
                                onSelect={(val) => {
                                    setuserConfigDetails({
                                        ...userConfigDetails,
                                        userid: val,
                                    });
                                }}
                            />
                            <Form.Control.Feedback type="invalid">
                                Please enter UserId
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
                            <Form.Select
                                name="exchange"
                                value={userConfigDetails.exchange}
                                onChange={handleChange}
                                aria-label="Floating label select example"
                                defaultValue={"Select Exchange"}
                            >
                                <option value="Select Exchange" hidden>Select Exchange</option>
                                {Globalexchange && Globalexchange.map((val,i) => { return <option key={i} value={val}>{val}</option> })}
                            </Form.Select>
                            <Form.Control.Feedback type="invalid">
                                Please enter Exchange.
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
                            <Form.Select
                                name="securitytype"
                                value={userConfigDetails.securitytype}
                                onChange={handleChange}
                                aria-label="Floating label select example"
                                defaultValue={"Select Security Type"}
                            >
                                <option value="Select Security Type" hidden>Select Security Type</option>
                                {Globalsecuritytype && Globalsecuritytype.map((val,i) => { return <option key={i} value={val}>{val}</option> })}
                            </Form.Select>
                            <Form.Control.Feedback type="invalid">
                                Please enter SecurityType.
                            </Form.Control.Feedback>
                        </InputGroup>
                    </Form.Group>
                    <Form.Group
                        as={Col}
                        md="6"
                        controlId="validationCustomBuy-Brokerage"
                        className='mb-3'
                    >
                        <Form.Label>
                            <span className={`label-icon ${profile.labelIcon}`}>
                                <GiReceiveMoney />
                            </span>
                            Buy Brokerage
                            <span className={profile.mendatory}>
                                *
                            </span>
                        </Form.Label>
                        <InputGroup hasValidation>
                            <Form.Control
                                type="number"
                                pattern="[^\s]+"
                                placeholder='Enter Buy Brokerage'
                                required
                                name="buybrok"
                                value={userConfigDetails.buybrok}
                                onChange={handleChange}
                            />
                            <Form.Control.Feedback type="invalid">
                                Please enter Buy Brokerage.
                            </Form.Control.Feedback>
                        </InputGroup>
                    </Form.Group>
                    <Form.Group
                        as={Col}
                        md="6"
                        controlId="validationCustomSell-Brokerage"
                        className='mb-3'
                    >
                        <Form.Label>
                            <span className={`label-icon ${profile.labelIcon}`}>
                                <GiPayMoney />
                            </span>
                            Sell Brokerage
                            <span className={profile.mendatory}>
                                *
                            </span>
                        </Form.Label>
                        <InputGroup hasValidation>
                            <Form.Control
                                type="number"
                                pattern="[^\s]+"
                                placeholder='Enter Sell Brokerage'
                                required
                                name="sellbrok"
                                value={userConfigDetails.sellbrok}
                                onChange={handleChange}
                            />
                            <Form.Control.Feedback type="invalid">
                                Please enter Sell-Brokerage.
                            </Form.Control.Feedback>
                        </InputGroup>
                    </Form.Group>
                    <Form.Group
                        as={Col}
                        md="6"
                        controlId="validationCustomEX-Buy-Brokerage"
                        className='mb-3'
                    >
                        <Form.Label>
                            <span className={`label-icon ${profile.labelIcon}`}>
                                <BsFillCalendarXFill />
                            </span>
                            Expiry Buy Brokerage
                            <span className={profile.mendatory}>
                                *
                            </span>
                        </Form.Label>
                        <InputGroup hasValidation>
                            <Form.Control
                                type="number"
                                pattern="[^\s]+"
                                placeholder='Enter Expiry Buy Brokerage'
                                required
                                name="exbuybrok"
                                value={userConfigDetails.exbuybrok}
                                onChange={handleChange}
                            />
                            <Form.Control.Feedback type="invalid">
                                Please enter Expiry Buy Brokerage.
                            </Form.Control.Feedback>
                        </InputGroup>
                    </Form.Group>
                    <Form.Group
                        as={Col}
                        md="6"
                        controlId="validationCustomEX-Sell-Brokerage"
                        className='mb-3'
                    >
                        <Form.Label>
                            <span className={`label-icon ${profile.labelIcon}`}>
                                <BsFillCalendarXFill />
                            </span>
                            Expiry Sell Brokerage
                            <span className={profile.mendatory}>
                                *
                            </span>
                        </Form.Label>
                        <InputGroup hasValidation>
                            <Form.Control
                                type="number"
                                pattern="[^\s]+"
                                placeholder='Enter Expiry Sell Brokerage'
                                required
                                name="exsellbrok"
                                value={userConfigDetails.exsellbrok}
                                onChange={handleChange}
                            />
                            <Form.Control.Feedback type="invalid">
                                Please enter Expiry Sell Brokerage.
                            </Form.Control.Feedback>
                        </InputGroup>
                    </Form.Group>
                    <Form.Group
                        as={Col}
                        md="6"
                        controlId="validationCustomUSDCost"
                        className='mb-3'
                    >
                        <Form.Label>
                            <span className={`label-icon ${profile.labelIcon}`}>
                                <GiTwoCoins />
                            </span>
                            USD Cost
                            <span className={profile.mendatory}>
                                *
                            </span>
                        </Form.Label>
                        <InputGroup hasValidation>
                            <Form.Control
                                type="number"
                                pattern="[^\s]+"
                                placeholder='Enter USD Cost'
                                required
                                name="usdinrcost"
                                value={userConfigDetails.usdinrcost}
                                onChange={handleChange}
                            />
                            <Form.Control.Feedback type="invalid">
                                Please enter USD Cost.
                            </Form.Control.Feedback>
                        </InputGroup>
                    </Form.Group>
                    <Form.Group
                        as={Col}
                        md="6"
                        controlId="validationAdjustmentFee"
                        className='mb-3'
                    >
                        <Form.Label>
                            <span className={`label-icon ${profile.labelIcon}`}>
                                <HiAdjustments />
                            </span>
                            Adjustment Fee
                            <span className={profile.mendatory}>
                                *
                            </span>
                        </Form.Label>
                        <InputGroup hasValidation>
                            <Form.Control
                                type="number"
                                pattern="[^\s]+"
                                placeholder='Enter Adjustment Fee'
                                required
                                name="adjustmentfees"
                                value={userConfigDetails.adjustmentfees}
                                onChange={handleChange}
                            />
                            <Form.Control.Feedback type="invalid">
                                Please enter Adjustment Fee.
                            </Form.Control.Feedback>
                        </InputGroup>
                    </Form.Group>
                    <Form.Group
                        as={Col}
                        md="6"
                        controlId="validationActualClientSharing"
                        className='mb-3'
                    >
                        <Form.Label>
                            <span className={`label-icon ${profile.labelIcon}`}>
                                <FaShare />
                            </span>
                            Actual Client Sharing
                            <span className={profile.mendatory}>
                                *
                            </span>
                        </Form.Label>
                        <InputGroup hasValidation>
                            <Form.Control
                                type="number"
                                pattern="[^\s]+"
                                placeholder='Enter Actual Client Sharing'
                                required
                                name="actualclientsharing"
                                value={userConfigDetails.actualclientsharing}
                                onChange={handleChange}
                            />
                            <Form.Control.Feedback type="invalid">
                                Please Enter Actual Client Sharing.
                            </Form.Control.Feedback>
                        </InputGroup>
                    </Form.Group>
                    <Form.Group
                        as={Col}
                        md="6"
                        controlId="validationActualBrokSharing"
                        className='mb-3'
                    >
                        <Form.Label>
                            <span className={`label-icon ${profile.labelIcon}`}>
                                <FaHandsHelping />
                            </span>
                            Actual Broker Sharing
                            <span className={profile.mendatory}>
                                *
                            </span>
                        </Form.Label>
                        <InputGroup hasValidation>
                            <Form.Control
                                type="number"
                                pattern="[^\s]+"
                                placeholder='Enter Actual Broker Sharing'
                                required
                                name="actualbroksharing"
                                value={userConfigDetails.actualbroksharing}
                                onChange={handleChange}
                            />
                            <Form.Control.Feedback type="invalid">
                                Please Enter Actual Broker Sharing.
                            </Form.Control.Feedback>
                        </InputGroup>
                    </Form.Group>
                    <Form.Group
                        as={Col}
                        md="6"
                        controlId="validationSegment"
                        className='mb-3'
                    >
                        <Form.Label>
                            <span className={`label-icon ${profile.labelIcon}`}>
                                <MdNoteAlt />
                            </span>
                            Segment
                            <span className={profile.mendatory}>
                                *
                            </span>
                        </Form.Label>
                        <InputGroup hasValidation>
                            <Form.Select
                                aria-label="Floating label select example"
                                required
                                name="segmentid"
                                value={userConfigDetails.segmentid}
                                onChange={handleChange}
                                defaultValue={"Assign Segment"}
                            >
                                <option value="Assign Segment"  hidden>Assign Segment</option>
                                {Globalsegmenttable && Globalsegmenttable.map((val,i) => { return <option key={i} value={val.id}>{val.name}</option> })}
                            </Form.Select>
                            <Form.Control.Feedback type="invalid">
                                Please enter Segment.
                            </Form.Control.Feedback>
                        </InputGroup>
                    </Form.Group>
                    <Form.Group
                        as={Col}
                        md="6"
                        controlId="validationPolicyName"
                        className='mb-3'
                    >
                        <Form.Label>
                            <span className={`label-icon ${profile.labelIcon}`}>
                                <MdGroup />
                            </span>
                            Group Name
                            <span className={profile.mendatory}>
                                *
                            </span>
                        </Form.Label>
                        <InputGroup hasValidation>
                            <Form.Select
                                aria-label="Floating label select example"
                                required
                                name="groupid"
                                value={userConfigDetails.groupid}
                                onChange={handleChange}
                                defaultValue={"Assign Group Name"}
                            >
                                <option value="Assign Group Name"  hidden>Assign Group Name</option>
                                {Globalgroupnametable && Globalgroupnametable.map((val) => { return <option key={val.id} value={val.id}>{val.name}</option> })}

                            </Form.Select>
                            <Form.Control.Feedback type="invalid">
                                Please enter Group Name.
                            </Form.Control.Feedback>
                        </InputGroup>
                    </Form.Group>
                    <Form.Group
                        as={Col}
                        md="6"
                        controlId="validationCustomUSDRate"
                        className='mb-3'
                    >
                        <Form.Label>
                            <span className={`label-icon ${profile.labelIcon}`}>
                                <GiTwoCoins />
                            </span>
                            USD Rate
                            <span className={profile.mendatory}>
                                *
                            </span>
                        </Form.Label>
                        <InputGroup hasValidation>
                            <Form.Control
                                type="number"
                                pattern="[^\s]+"
                                placeholder='Enter Fixed USD Rate'
                                required
                                name="usdrate"
                                value={userConfigDetails.usdrate}
                                onChange={handleChange}
                                // readOnly
                                disabled={userConfigDetails.isusdlive ? true : false}
                            />
                            <Form.Control.Feedback type="invalid">
                                Please enter USD Rate
                            </Form.Control.Feedback>
                        </InputGroup>
                    </Form.Group>
                    <Form.Group
                        as={Col}
                        md="6"
                        controlId="validationCustomUSDRate"
                        className='mb-3'
                    >
                        <div className="d-flex">
                            <Form.Check
                                type="switch"
                                label="USD Live"
                                name='isusdlive'
                                onChange={toggleChange}
                                checked={userConfigDetails.isusdlive && true}
                                className={profile.usdLive}
                            />
                        </div>
                    </Form.Group>
                </Row>
                <div className={profile.configBtnSection}>
                    <input type="submit"
                        className={profile.basicInfoBtn}
                        value='Create'
                        onClick={(e) => {
                            e.preventDefault();
                            setNotifyData((data) => ({
                                ...data,
                                confirmFlag: true,
                                confirmMsg: "Are you sure,  You want to create user configuration ?",
                                confirmAction: (e) =>
                                    handleSubmit(e)
                            }))
                        }}
                    />
                    <input type="reset"
                        className={profile.basicDangerBtn}
                        value='Reset' />
                </div>
                <h6 onClick={() => props.toggleVisibility()} className={profile.hideShowtoggle}>
                    {props.visibility ? 'Hide ' : 'Show '}
                    User Configuration History
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
export default memo(UserConfig)