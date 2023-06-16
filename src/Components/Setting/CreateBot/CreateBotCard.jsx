import React, { useState, useEffect, memo,useRef } from 'react'
import { FaColumns, FaUser } from 'react-icons/fa'
import { MdDelete, MdGroup, MdNoteAlt } from 'react-icons/md'
import { Col, Form, InputGroup, Modal, OverlayTrigger, Popover, Row } from 'react-bootstrap'
import { BsCurrencyExchange } from 'react-icons/bs'
import { AiFillExclamationCircle } from 'react-icons/ai'
import { Notification } from '../../Notification'
import { CreateTelegramBotConfig_API, DeleteTelegramBotConfig_API, GetReportRowData_API, GetTelegramBotConfig_API } from '../../Redux/API'
import { CusColumn } from '../../DataTable/CusColumn'
import parityStyle from '../../Dashboard/Parity/Parity.module.scss'
import botdataStyle from './CreateBot.module.scss'
import profile from '../../ProfilePage/ProfilePage.module.scss'


const CreateBotCard = (props) => {
    const [ReportRowData, setReportRowData] = useState([])

    const [data, setData] = useState([])
    const [columns, setColumns] = useState([])

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

    const formRef = useRef("");
    const [validated, setValidated] = useState(false);
    const [botmsgConfig, setBotmsgConfig] = useState({
        groupname: '',
        segment: '',
        exchange: '',
        isposition: true,
        ismtm: true,
        isclient: true,
        isbroker: true,
        iscompany: true,
        isoverall: true,
        isapikey: false,
        apikey: '',
        isprice: true,
    })
    const handleChange = (e) => {
        setBotmsgConfig({
            ...botmsgConfig,
            [e.target.name]: e.target.type == 'checkbox' ? e.target.checked : e.target.value
        })
    }

    const CloseConfirm = () => {
        setNotifyData((data) => ({ ...data, confirmFlag: false }))
    }
    const CloseError = () => {
        setNotifyData((data) => ({ ...data, errorFlag: false }));
        // navigate("/login", { replace: true })
    };

    const CloseSuccess = () => {
        setNotifyData((data) => ({ ...data, successFlag: false }));
    };


    const handleDeleteBot = async (id) => {
        console.log("callll");

        setNotifyData((data) => ({ ...data, loadingFlag: true, loadingMsg: "Deleting bot config..." }))
        const ps1 = new Promise((resolve, reject) => {
            resolve(DeleteTelegramBotConfig_API({ id: id }))
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
            setData(data.filter(val => { return val.id != id }))
            setNotifyData((data) => ({ ...data, loadingFlag: false, confirmFlag: false, successFlag: true, successMsg: "Deleted Successful" }))
        } else {
            setNotifyData((data) => ({ ...data, loadingFlag: false, confirmFlag: false, errorFlag: true, errorMsg: rs['message'] }))
            // navigate("/")
        }

    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        console.log(botmsgConfig);

        if (formRef.current.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
            setNotifyData((data) => ({ ...data, confirmFlag: false }))
        }
        else {
            setNotifyData((data) => ({ ...data, loadingFlag: true, loadingMsg: "Inserting New Bot Config..." }))
            const ps1 = new Promise((resolve, reject) => {
                resolve(CreateTelegramBotConfig_API(botmsgConfig))
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
                setData([...data,
                rs['data']])
                setBotmsgConfig({
                    groupname: '',
                    segment: '',
                    exchange: '',
                    isposition: true,
                    ismtm: true,
                    isclient: true,
                    isbroker: true,
                    iscompany: true,
                    isoverall: true,
                    isapikey: false,
                    apikey: '',
                    isprice: true,
                })
                props.setShowBotForm(false)
                // dispatch(LoginAction(rs['data']));
            } else {
                setNotifyData((data) => ({ ...data, loadingFlag: false, confirmFlag: false, errorFlag: true, ErrorMsg: rs['message'], activesession: rs['session'] }))
            }
        }
        setValidated(true);
    };

    useEffect(() => {
        async function getUsersData() {
            setNotifyData((data) => ({ ...data, loadingFlag: true, loadingMsg: "Retriving users data..." }))
            const ps1 = new Promise((resolve, reject) => {
                resolve(GetReportRowData_API())
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
                setReportRowData(rs.data);
            } else {
                setNotifyData((data) => ({ ...data, loadingFlag: false, errorFlag: true, errorMsg: rs['message'] }))
            }
        }
        getUsersData()
        async function getBotData() {
            setNotifyData((data) => ({
                ...data,
                loadingFlag: true,
                loadingMsg: "Retriving data...",
            }));
            const ps1 = new Promise((resolve, reject) => {
                resolve(GetTelegramBotConfig_API());
            });
            const rs = await Promise.all([ps1])
                .then((val) => {
                    return val[0]["data"];
                })
                .catch((err) => {
                    setNotifyData((data) => ({ ...data, loadingFlag: false, errorFlag: true, errorMsg: err["message"] }));
                    console.log("*********", err.response.status);
                    (err.response.status === 401) && setTimeout(() => { window.location.assign(window.location.origin) }, 1000);
                    return err["response"]["data"];
                });
            if (rs["type"] === "success") {
                setNotifyData((data) => ({ ...data, loadingFlag: false }));
                if (rs.data !== undefined) {
                    if (rs.data.length !== 0) {
                        setData(rs.data);
                        if (columns.length === 0) {
                            setColumns(CusColumn(rs.data[0]));
                        }
                    }
                }
            } else {
                setNotifyData((data) => ({ ...data, loadingFlag: false, errorFlag: true, errorMsg: rs["message"] }));
            }
        }
        getBotData();
    }, [])

    return (
        <div className={`parity-section ${parityStyle.paritySection}`}>
            <div>
                <h4 className={parityStyle.parityHeading}>Created Bot</h4>
            </div>
            <div className={`${botdataStyle.createBotDataSection} ${parityStyle.parityDataSection}`}>
                <div className={`parity-data-lable ${botdataStyle.createBotDataLable} ${parityStyle.parityDataLable}`}>
                    <div className={`${botdataStyle.createBotHead} ${parityStyle.parityHead}`}>
                        <span>ID</span>
                    </div>
                    <div className={`${botdataStyle.createBotHead} ${parityStyle.parityHead}`}>
                        <span>apikey</span>
                    </div>
                    <div className={`${botdataStyle.createBotHead} ${parityStyle.parityHead}`}>
                        <span>exchange</span>
                    </div>
                    <div className={`${botdataStyle.createBotHead} ${parityStyle.parityHead}`}>
                        <span>groupname</span>
                    </div>
                    <div className={`${botdataStyle.createBotHead} ${parityStyle.parityHead}`}>
                        <span>isapikey</span>
                    </div>
                    <div className={`${botdataStyle.createBotHead} ${parityStyle.parityHead}`}>
                        <span>isbroker</span>
                    </div>
                    <div className={`${botdataStyle.createBotHead} ${parityStyle.parityHead}`}>
                        <span>isclient</span>
                    </div>
                    <div className={`${botdataStyle.createBotHead} ${parityStyle.parityHead}`}>
                        <span>iscompany</span>
                    </div>
                    <div className={`${botdataStyle.createBotHead} ${parityStyle.parityHead}`}>
                        <span>isenable</span>
                    </div>
                    <div className={`${botdataStyle.createBotHead} ${parityStyle.parityHead}`}>
                        <span>ismtm</span>
                    </div>
                    <div className={`${botdataStyle.createBotHead} ${parityStyle.parityHead}`}>
                        <span>isoverall</span>
                    </div>
                    <div className={`${botdataStyle.createBotHead} ${parityStyle.parityHead}`}>
                        <span>isposition</span>
                    </div>
                    <div className={`${botdataStyle.createBotHead} ${parityStyle.parityHead}`}>
                        <span>isprice</span>
                    </div>
                    <div className={`${botdataStyle.createBotHead} ${parityStyle.parityHead}`}>
                        <span>segment</span>
                    </div>

                    <div className={`${botdataStyle.createBotHead} ${parityStyle.parityHead}`}>
                        <span>ACTION</span>
                    </div>

                </div>

                <div className={parityStyle.parityBody}>
                    {data && data.map((val, i) => {
                        return <div key={val.id} className={`parity-value ${botdataStyle.createBotValueSection} ${parityStyle.parityValue}`}>
                            <div className={parityStyle.parityCard}>
                                <div className={`${botdataStyle.createBotValue} ${parityStyle.parityValueData}`}>
                                    <span>{val.id}</span>
                                </div>
                                <div className={`${botdataStyle.createBotValue} ${parityStyle.parityValueData}`}>
                                    <span>{val.apikey}</span>
                                </div>
                                <div className={`${botdataStyle.createBotValue} ${parityStyle.parityValueData}`}>
                                    <span>{val.exchange}</span>
                                </div>
                                <div className={`${botdataStyle.createBotValue} ${parityStyle.parityValueData}`}>
                                    <span>{val.groupname}</span>
                                </div>
                                <div className={`${botdataStyle.createBotValue} ${parityStyle.parityValueData}`}>
                                    <span >
                                        {val.isapikey
                                            ?
                                            <span className={botdataStyle.blinkCircle}></span>
                                            :
                                            <span className={botdataStyle.blinkCircle1}></span>
                                        }
                                    </span>
                                </div>
                                <div className={`${botdataStyle.createBotValue} ${parityStyle.parityValueData}`}>
                                    <span>
                                        {
                                            val.isbroker
                                                ?
                                                <span className={botdataStyle.blinkCircle}></span>
                                                :
                                                <span className={botdataStyle.blinkCircle1}></span>
                                        }
                                    </span>
                                </div>
                                <div className={`${botdataStyle.createBotValue} ${parityStyle.parityValueData}`}>
                                    <span>
                                        {
                                            val.isclient
                                                ?
                                                <span className={botdataStyle.blinkCircle}></span>
                                                :
                                                <span className={botdataStyle.blinkCircle1}></span>
                                        }
                                    </span>
                                </div>
                                <div className={`${botdataStyle.createBotValue} ${parityStyle.parityValueData}`}>
                                    <span>
                                        {
                                            val.iscompany
                                                ?
                                                <span className={botdataStyle.blinkCircle}></span>
                                                :
                                                <span className={botdataStyle.blinkCircle1}></span>
                                        }
                                    </span>
                                </div>
                                <div className={`${botdataStyle.createBotValue} ${parityStyle.parityValueData}`}>
                                    <span>
                                        {
                                            val.isenable
                                                ?
                                                <span className={botdataStyle.blinkCircle}></span>
                                                :
                                                <span className={botdataStyle.blinkCircle1}></span>
                                        }
                                    </span>
                                </div>
                                <div className={`${botdataStyle.createBotValue} ${parityStyle.parityValueData}`}>
                                    <span>
                                        {
                                            val.ismtm
                                                ?
                                                <span className={botdataStyle.blinkCircle}></span>
                                                :
                                                <span className={botdataStyle.blinkCircle1}></span>
                                        }
                                    </span>
                                </div>
                                <div className={`${botdataStyle.createBotValue} ${parityStyle.parityValueData}`}>
                                    <span>
                                        {
                                            val.isoverall
                                                ?
                                                <span className={botdataStyle.blinkCircle}></span>
                                                :
                                                <span className={botdataStyle.blinkCircle1}></span>
                                        }
                                    </span>
                                </div>
                                <div className={`${botdataStyle.createBotValue} ${parityStyle.parityValueData}`}>
                                    <span>
                                        {
                                            val.isposition
                                                ?
                                                <span className={botdataStyle.blinkCircle}></span>
                                                :
                                                <span className={botdataStyle.blinkCircle1}></span>
                                        }
                                    </span>
                                </div>
                                <div className={`${botdataStyle.createBotValue} ${parityStyle.parityValueData}`}>
                                    <span>
                                        {
                                            val.isprice
                                                ?
                                                <span className={botdataStyle.blinkCircle}></span>
                                                :
                                                <span className={botdataStyle.blinkCircle1}></span>
                                        }
                                    </span>
                                </div>
                                <div className={`${botdataStyle.createBotValue} ${parityStyle.parityValueData}`}>
                                    <span>{val.segment}</span>
                                </div>
                                <div className={`${botdataStyle.createBotValue} ${parityStyle.parityValueData}`}>
                                    <span
                                        className={parityStyle.deleteBtn}
                                        // onClick={(e)=>props.handleDeleteBot(val.id)}
                                        onClick={(e) => setNotifyData((data) => ({ ...data, confirmFlag: true, confirmMsg: "Are you sure you want to delate parity...", confirmAction: (e) => handleDeleteBot(val.id) }))}

                                    >
                                        <MdDelete />
                                    </span>
                                </div>
                            </div>
                        </div>
                    })}
                </div>
            </div>
            <Modal
                show={props.showBotForm}
                onHide={() => props.setShowBotForm(false)}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title> New Bot Message Config</Modal.Title>
                </Modal.Header>
                <Modal.Body
                // className={parityStyle.parityModalBody}
                >
                    <div className={`basic-forminfo ${botdataStyle.botDataSection}`}>
                        <Form
                            noValidate
                            ref={formRef}
                            validated={validated}
                            onSubmit={handleSubmit}
                            className={botdataStyle.createBotFormSection}
                        >
                            <Row className="mb-3">
                                <Form.Group
                                    as={Col}
                                    md="12"
                                    className={`mb-3 ${botdataStyle.formGroup}`}
                                >
                                    <Form.Label className={profile.IconlabelSection}>
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
                                        onChange={handleChange}
                                        value={botmsgConfig.groupname}
                                        className={botdataStyle.formSelect}
                                        aria-label="Floating label select example"
                                        required
                                        defaultValue={"Select GroupName"}
                                    >
                                        <option value="Select GroupName" hidden>Select GroupName</option>
                                        {
                                            [...new Set(ReportRowData.map(el => { return el.groupname }))].map((val) => {
                                                return <option key={val} value={val}>{val}</option>
                                            })
                                        }

                                    </Form.Select>
                                    <Form.Control.Feedback type="invalid">
                                        Please Select Group Name
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group
                                    as={Col}
                                    md="12"
                                    className={`mb-3 ${botdataStyle.formGroup}`}
                                >
                                    <Form.Label className={profile.IconlabelSection}>
                                        <span className={`label-icon ${profile.labelIcon}`}>
                                            <MdNoteAlt />
                                        </span>
                                        Segment
                                        <span className={profile.mendatory}>
                                            *
                                        </span>
                                    </Form.Label>
                                    <Form.Select
                                        name='segment'
                                        required
                                        onChange={handleChange}
                                        value={botmsgConfig.segment}
                                        className={botdataStyle.formSelect}
                                        defaultValue={'select segment'}
                                    >
                                        <option value="select segment" hidden>Select Segment</option>
                                        {
                                            [...new Set(ReportRowData.map(el => { return (el.groupname === botmsgConfig.groupname) && el.segment }))].map((val) => {
                                                return val && <option key={val} value={val}>{val}</option>
                                            })
                                        }
                                    </Form.Select>
                                    <Form.Control.Feedback type="invalid">
                                        Please Select Segment
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group
                                    as={Col}
                                    md="12"
                                    className={`mb-3 ${botdataStyle.formGroup}`}
                                >
                                    <Form.Label className={profile.IconlabelSection}>
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
                                        required
                                        onChange={handleChange}
                                        value={botmsgConfig.exchange}
                                        className={botdataStyle.formSelect}
                                        defaultValue={'select exchange'}
                                    >
                                        <option value="select exchange" hidden>Select Exchange</option>
                                        <option value="NSEFO">NSEFO</option>
                                        <option value="SGXFO">SGXFO</option>

                                    </Form.Select>
                                    <Form.Control.Feedback type="invalid">
                                        Please Select Segment
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <div className={botdataStyle.botCondition}>
                                    <div className='col-md-4 mt-1'>
                                        <Form.Label className={profile.IconlabelSection}>
                                            <span className={`label-icon ${profile.labelIcon}`}>
                                                <FaColumns />
                                            </span>
                                            Column Name
                                        </Form.Label>
                                        <Form.Check
                                            type="checkbox"
                                            label="Position"
                                            name='isposition'
                                            onChange={handleChange}
                                            checked={botmsgConfig.isposition}
                                        />
                                        <Form.Check
                                            type="checkbox"
                                            label="MTM"
                                            name='ismtm'
                                            onChange={handleChange}
                                            checked={botmsgConfig.ismtm}
                                        />
                                        <Form.Check
                                            type="checkbox"
                                            label="Price Change"
                                            name='isprice'
                                            onChange={handleChange}
                                            checked={botmsgConfig.isprice}
                                        />

                                    </div>
                                    <div className='col-md-4 mt-1'>
                                        <Form.Label className={profile.IconlabelSection}>
                                            <span className={`label-icon ${profile.labelIcon}`}>
                                                <FaUser />
                                            </span>
                                            Type
                                        </Form.Label>
                                        <Form.Check
                                            type="checkbox"
                                            label="OverAll"
                                            name='isoverall'
                                            onChange={handleChange}
                                            checked={botmsgConfig.isoverall}
                                        />
                                        <Form.Check
                                            type="checkbox"
                                            label="Client"
                                            name='isclient'
                                            onChange={handleChange}
                                            checked={botmsgConfig.isclient}
                                        />
                                        <Form.Check
                                            type="checkbox"
                                            label="Broker"
                                            name='isbroker'
                                            onChange={handleChange}
                                            checked={botmsgConfig.isbroker}
                                        />
                                        <Form.Check
                                            type="checkbox"
                                            label="Company"
                                            name='iscompany'
                                            onChange={handleChange}
                                            checked={botmsgConfig.iscompany}
                                        />
                                    </div>

                                </div>
                                <div>
                                    <div className={botdataStyle.ownBotApi}>
                                        <Form.Check
                                            type="switch"
                                            label="Use your own bot api"
                                            name='isapikey'
                                            onChange={handleChange}
                                            checked={botmsgConfig.isapikey}
                                        />
                                        <OverlayTrigger
                                            placement="right"
                                            overlay={
                                                <Popover
                                                    id={`popover-positioned`}
                                                >
                                                    <Popover.Header className={botdataStyle.noticeHead} as="h3">{`Notice `}</Popover.Header>
                                                    <Popover.Body>
                                                        Current year Profit Loss
                                                    </Popover.Body>
                                                </Popover>
                                            }
                                        >
                                            <span className={botdataStyle.botApiNoticeIcon}><AiFillExclamationCircle /></span>
                                        </OverlayTrigger>

                                    </div>
                                    <Form.Group as={Col}
                                        md="12"
                                        className='mt-3'
                                        hidden={!botmsgConfig.isapikey}
                                    >

                                        <InputGroup
                                            className={botdataStyle.formSelect}
                                            hasValidation>
                                            <Form.Control
                                                type="text"
                                                name='apikey'
                                                onChange={handleChange}
                                                placeholder="Telegram Bot API Key"
                                                required={botmsgConfig.isapikey}
                                                value={botmsgConfig.apikey}
                                            />
                                            {!botmsgConfig.isapikey ?
                                                <Form.Control.Feedback type="invalid">
                                                    Please Enter Own Bot API
                                                </Form.Control.Feedback>
                                                : null}
                                        </InputGroup>
                                    </Form.Group>

                                </div>
                            </Row>
                            <div>
                                <input
                                    type="submit"
                                    className={profile.basicInfoBtn}
                                    value='Create Bot'
                                    onClick={handleSubmit}
                                />
                            </div>
                        </Form>

                    </div>
                </Modal.Body>
            </Modal>
            <Notification
                notify={NotifyData}
                CloseError={CloseError}
                CloseSuccess={CloseSuccess}
                CloseConfirm={CloseConfirm}
            />
        </div >
    )
}

export default memo(CreateBotCard)