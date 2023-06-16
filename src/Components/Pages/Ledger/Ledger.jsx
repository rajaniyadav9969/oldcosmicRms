import React, { memo, useRef, useState } from 'react'
import { Form, Row, Col, InputGroup } from 'react-bootstrap'
import { FaFileInvoiceDollar, FaUser, FaUsersCog } from 'react-icons/fa'
import { MdAddLocationAlt, MdComment, MdGroup, MdNoteAlt } from "react-icons/md";
import { BsCalendar2EventFill, BsCreditCard2FrontFill } from 'react-icons/bs'
import { GiReceiveMoney, GiTwoCoins } from "react-icons/gi";
import moment from 'moment'
import { useSelector } from 'react-redux'
import WeeklySettled from './WeeklySettled'
import { Datepicker } from '../../DynamicComponent'
import { Notification } from '../../Notification'
import { LedgerEntry_API } from '../../Redux/API'
import LedgerHistory from './LedgerHistory'
import profile from '../../ProfilePage/ProfilePage.module.scss'

const Ledger = () => {

    // console.log("Ledger");

    const Globalgroupnametable = useSelector((state) => state && state.groupnametable);
    const Globalsegmenttable = useSelector((state) => state && state.segmenttable);
    const Globalaccess_users = useSelector((state) => state && state.settings.access_users);


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
    // const [dateValue, setDateValue] = useState(new Date())

    const entryamountRef = useRef()

    const [ledgerEntry, setLedgerEntry] = useState({
        datetime: moment(new Date()).format('YYYY-MM-DD'),
        groupid: '',
        groupname: '',
        segmentid: '',
        segment: '',
        userid: '',
        note: '',
        type: '',
        currency: '',
        usdrate: '',
        usdinrcost: '',
        location: '',
        entrytype: 'manual',
    })

    const handleLedgerChange = (e) => {
        if (e.target.name === 'segment') {
            setLedgerEntry({ ...ledgerEntry, [e.target.name + 'id']: (e.target.value.split(' ')[0]), [e.target.name]: (e.target.value.split(' ')[1]) });
        }
        else if (e.target.name === 'groupname') {
            setLedgerEntry({ ...ledgerEntry, ['groupid']: (e.target.value.split(' ')[0]), [e.target.name]: (e.target.value.split(' ')[1]) });
        }
        else if (e.target.name === 'debitcredittype') {
            if (e.target.value == 'debit') {
                setLedgerEntry({ ...ledgerEntry, debit: parseFloat(entryamountRef.current.value), credit: 0 });
            } else if (e.target.value == 'credit') {
                setLedgerEntry({ ...ledgerEntry, debit: 0, credit: parseFloat(entryamountRef.current.value) });
            }
        }
        else {
            setLedgerEntry({ ...ledgerEntry, [e.target.name]: (e.target.value) });
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
    const handleReportShow = async (e) => {
        e.preventDefault()
        setNotifyData((data) => ({ ...data, loadingFlag: true, loadingMsg: "Inserting ledger data..." }))
        const ps1 = new Promise((resolve, reject) => {
            resolve(LedgerEntry_API(ledgerEntry))
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

    const handleDate = (props) => {
        setLedgerEntry({
            ...ledgerEntry,
            datetime: props
        })
    }

    return (
        <div className="container-fluid">
            <div className='row'>
                <div className="col-md-4">
                    <div className={`basic-forminfo ${profile.basicInfo}`}>
                        <h5 className={profile.basicHeading}>
                            <span className={profile.icons}>
                                <FaFileInvoiceDollar />
                            </span>
                            Ledger Entry
                        </h5>
                        <Form
                            noValidate
                            className={profile.basicInfoSetting}
                        >
                            <Row className="">
                                <Form.Group
                                    as={Col}
                                    md="12"
                                    controlId="validationCustomDate"
                                    className='mb-3'
                                >
                                    <Form.Label>
                                        <span className={`label-icon ${profile.labelIcon}`}>
                                            <BsCalendar2EventFill />
                                        </span>
                                        Date
                                        <span className={profile.mendatory}>
                                            *
                                        </span>
                                    </Form.Label>
                                    <InputGroup hasValidation>
                                        {/* <input
                                            type="date"
                                            value={ledgerEntry.datetime}
                                            name="datetime"
                                            onChange={handleLedgerChange}
                                            className={`date-section ${profile.dateSection}`}
                                            style={{ width: ' 100%' }}
                                        /> */}
                                        <Datepicker dateValue={ledgerEntry.datetime} handleDate={handleDate} yesterday={false} style={{ width: ' 100%' }} />
                                    </InputGroup>
                                </Form.Group>
                                <Form.Group as={Col}
                                    md="12"
                                    controlId="validationCustomCurrency"
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
                                    <Form.Select
                                        name='groupname'
                                        aria-label="Floating label select example"
                                        onChange={handleLedgerChange}
                                        value={ledgerEntry.groupid + ' ' + ledgerEntry.groupname}
                                        required>

                                        {Globalgroupnametable && Globalgroupnametable.map((val) => { return <option key={val.id} value={val.id + ' ' + val.name}>{val.name}</option> })}

                                    </Form.Select>
                                </Form.Group>
                                <Form.Group as={Col}
                                    md="12"
                                    controlId="validationCustomBrokerageType"
                                    className='mb-3'
                                >
                                    <Form.Label>
                                        <span className={`label-icon ${profile.labelIcon}`}>
                                            <MdNoteAlt />
                                        </span>
                                        Select Segment
                                    </Form.Label>
                                    <Form.Select
                                        name='segment'
                                        aria-label="Floating label select example"
                                        required
                                        onChange={handleLedgerChange}
                                        value={ledgerEntry.segmentid + ' ' + ledgerEntry.segment}
                                    >

                                        {Globalsegmenttable && Globalsegmenttable.map((val) => { return <option key={val.id} value={val.id + ' ' + val.name}>{val.name}</option> })}

                                    </Form.Select>
                                </Form.Group>
                                <Form.Group as={Col}
                                    md="12"
                                    controlId="validationCustomBrokerageType"
                                    className='mb-3'
                                >
                                    <Form.Label>
                                        <span className={`label-icon ${profile.labelIcon}`}>
                                            <FaUser />
                                        </span>
                                        Select UserId
                                    </Form.Label>
                                    <Form.Select
                                        name='userid'
                                        aria-label="Floating label select example"
                                        required
                                        onChange={handleLedgerChange}
                                        value={ledgerEntry.userid}
                                    >
                                        {Globalaccess_users && Globalaccess_users.split(',').map((val, i) => { return <option key={i} value={val}>{val}</option> })}
                                    </Form.Select>
                                </Form.Group>
                                <Form.Group as={Col}
                                    md="4"
                                    controlId="validationCustomUserId"
                                    className='mb-3'
                                >
                                    <Form.Label>
                                        <span className={`label-icon ${profile.labelIcon}`}>
                                            <GiTwoCoins />
                                        </span>
                                        Currency In
                                        <span className={profile.mendatory}>
                                            *
                                        </span>
                                    </Form.Label>
                                    <Form.Select
                                        name='currency'
                                        aria-label="Floating label select example"
                                        required
                                        onChange={handleLedgerChange}
                                        value={ledgerEntry.currency}
                                    >
                                        <option value="INR">INR</option>
                                        <option value="USD">USD</option>
                                    </Form.Select>
                                </Form.Group>
                                <Form.Group
                                    as={Col}
                                    md="4"
                                    controlId="validationCustomFSymbol"
                                    className="mb-3"
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
                                    <InputGroup>
                                        <Form.Control
                                            type="text"
                                            placeholder="USD Rate"
                                            required
                                            name="usdrate"
                                            value={ledgerEntry.usdrate}
                                            onChange={handleLedgerChange}
                                        />

                                    </InputGroup>
                                </Form.Group>
                                <Form.Group
                                    as={Col}
                                    md="4"
                                    controlId="validationCustomFSymbol"
                                    className="mb-3"
                                >
                                    <Form.Label>
                                        <span className={`label-icon ${profile.labelIcon}`}>
                                            <GiTwoCoins />
                                        </span>
                                        USD/INR Cost
                                        <span className={profile.mendatory}>
                                            *
                                        </span>
                                    </Form.Label>
                                    <InputGroup>
                                        <Form.Control
                                            type="text"
                                            placeholder="USD/INR Cost"
                                            required
                                            name="usdinrcost"
                                            value={ledgerEntry.usdinrcost}
                                            onChange={handleLedgerChange}
                                        />

                                    </InputGroup>
                                </Form.Group>

                                <Form.Group
                                    as={Col}
                                    md="8"
                                    controlId="validationCustomFSymbol"
                                    className="mb-3"
                                >
                                    <Form.Label>
                                        <span className={`label-icon ${profile.labelIcon}`}>
                                            <GiReceiveMoney />
                                        </span>
                                        Amount
                                        <span className={profile.mendatory}>
                                            *
                                        </span>
                                    </Form.Label>
                                    <InputGroup >
                                        <Form.Control
                                            ref={entryamountRef}
                                            type="text"
                                            placeholder="Enter Amount"
                                            required
                                        // name="amount"
                                        // value={ledgerEntry.amount}
                                        // onChange={handleLedgerChange}
                                        />

                                    </InputGroup>
                                </Form.Group>
                                <Form.Group as={Col}
                                    md="4"
                                    controlId="validationCustomUserId"
                                    className='mb-3'
                                >
                                    <Form.Label>
                                        <span className={`label-icon ${profile.labelIcon}`}>
                                            <BsCreditCard2FrontFill />
                                        </span>
                                        Type
                                        <span className={profile.mendatory}>
                                            *
                                        </span>
                                    </Form.Label>
                                    <Form.Select
                                        name='debitcredittype'
                                        aria-label="Floating label select example"
                                        required
                                        onChange={handleLedgerChange}
                                        defaultValue={"Select Debit/Credit"}
                                    >
                                        <option value="Select Debit/Credit" hidden>Select Debit/Credit</option>
                                        <option value="debit">Debit</option>
                                        <option value="credit">Credit</option>
                                    </Form.Select>
                                </Form.Group>
                                <Form.Group as={Col}
                                    md="6"
                                    controlId="validationCustomUserId"
                                    className='mb-3'
                                >
                                    <Form.Label>
                                        <span className={`label-icon ${profile.labelIcon}`}>
                                            <FaUsersCog />
                                        </span>
                                        Entery side
                                        <span className={profile.mendatory}>
                                            *
                                        </span>
                                    </Form.Label>
                                    <Form.Select
                                        name='type'
                                        aria-label="Floating label select example"
                                        required
                                        onChange={handleLedgerChange}
                                        value={ledgerEntry.type}
                                    >
                                        <option value="client">client</option>
                                        <option value="broker">broker</option>
                                        <option value="company">company</option>
                                    </Form.Select>
                                </Form.Group>
                                <Form.Group
                                    as={Col}
                                    md="6"
                                    controlId="validationCustomFSymbol"
                                    className="mb-3"
                                >
                                    <Form.Label>
                                        <span className={`label-icon ${profile.labelIcon}`}>
                                            <MdAddLocationAlt />
                                        </span>
                                        Location
                                    </Form.Label>
                                    <InputGroup >
                                        <Form.Control
                                            type="text"
                                            placeholder="Enter Location"
                                            required
                                            name="location"
                                            value={ledgerEntry.location}
                                            onChange={handleLedgerChange}
                                        />

                                    </InputGroup>
                                </Form.Group>
                                <Form.Group
                                    as={Col}
                                    md="12"
                                    controlId="validationCustomFSymbol"
                                    className="mb-3"
                                >
                                    <Form.Label>
                                        <span className={`label-icon ${profile.labelIcon}`}>
                                            <MdComment />
                                        </span>
                                        Notes
                                        <span className={profile.mendatory}>
                                            *
                                        </span>
                                    </Form.Label>
                                    <InputGroup >
                                        <Form.Control
                                            as="textarea"
                                            rows={2}
                                            required
                                            name="note"
                                            value={ledgerEntry.note}
                                            onChange={handleLedgerChange}
                                        />

                                    </InputGroup>
                                </Form.Group>
                                <div>
                                    <input
                                        type="submit"
                                        className={profile.basicInfoBtn}
                                        value='Submit'
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setNotifyData((data) => ({
                                                ...data,
                                                confirmFlag: true,
                                                confirmMsg: "Are you sure,  You want to submit ledger entry ?",
                                                confirmAction: (e) =>
                                                    handleReportShow(e)
                                            }))
                                        }}
                                    />
                                </div>
                            </Row>
                        </Form>
                    </div>
                </div >
                <div className="col-md-8">
                    <div className="row">
                        <div className="col-md-12">
                            <LedgerHistory />
                        </div>
                        <div className="col-md-12">
                            <WeeklySettled />
                        </div>
                    </div>

                </div>
            </div>
            <Notification
                notify={NotifyData}
                CloseError={CloseError}
                CloseSuccess={CloseSuccess}
                CloseConfirm={CloseConfirm}
            />
        </div >
    )
}

export default memo(Ledger)