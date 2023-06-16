import React, { memo, useEffect, useRef, useState } from 'react'
import { Form, Row, Col, InputGroup } from 'react-bootstrap'
import Multiselect from 'multiselect-react-dropdown';
import { IoSettings } from 'react-icons/io5';
import { AiFillAccountBook } from 'react-icons/ai';
import { BsCalendar2EventFill } from 'react-icons/bs';
import { FaAddressCard, FaHandsHelping, FaUser, FaUserTag } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { Notification } from '../Notification';
import { UpdateUserpermission_API, UpdateUserSettings_API } from '../Redux/API';
import profile from '../ProfilePage/ProfilePage.module.scss'
import userStyle from './UserManagement.module.scss'

const UserPermission = (props) => {
    const state = useSelector(state => state)
    const useridSelectRef = useRef()
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
    const [validated, setValidated] = useState(false);
    const [totaluserid, setTotalUserId] = useState(
        state.userids
    );

    const [userSettings, setUserSettings] = useState(props.data.settings)

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

    const handleSubmitUserAccessPermissions = async (e) => {
        e.preventDefault()
        setNotifyData((data) => ({ ...data, loadingFlag: true, loadingMsg: "Saving user permission..." }))
        const ps1 = new Promise((resolve, reject) => {
            resolve(UpdateUserpermission_API(props.data.permissions))
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


    const handleSubmitUserSettings = async (e) => {
        e.preventDefault()
        const useriddata = useridSelectRef.current.state.selectedValues
        var access_users = ''
        for (let i = 0; i < useriddata.length; i++) {
            access_users = access_users + useriddata[i] + ',';
        }
        access_users = access_users.slice(0, -1)
        setUserSettings({ ...userSettings, access_users: access_users })


        setNotifyData((data) => ({ ...data, loadingFlag: true, loadingMsg: "Saving user settings..." }))
        const ps1 = new Promise((resolve, reject) => {
            resolve(UpdateUserSettings_API({ id: props.data.settings.id, access_users: access_users, useridlike: props.data.settings.useridlike, rolename: props.data.settings.rolename, isuseridlike: props.data.settings.isuseridlike, startdate: props.data.settings.startdate }))

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
        <div >
            <div className={`basic-forminfo ${profile.basicInfo}`} >
                <div className={userStyle.mainHeadingSection}>
                    <div className={userStyle.headingSection}>
                        <h5 className={profile.basicHeading}>
                            <span className={profile.icons}>
                                <FaAddressCard />
                            </span>
                            UserId Permissions
                        </h5>
                    </div>
                    <div className={userStyle.username}>
                        <label htmlFor="" >@{props.data.settings.username}</label>
                    </div>
                </div>
                <Form
                    noValidate
                    validated={validated}
                    onSubmit={handleSubmit}
                    className={profile.basicInfoSetting}
                >
                    <Row className="mb-3">
                        <Form.Group
                            as={Col}
                            md="12"
                            controlId="validationCustomName"
                            className='mb-3'
                        >
                            {/* <Form.Label >General Access</Form.Label> */}
                            <Form.Check
                                type="switch"
                                label="Set access UserId based on below UserId Like Field"
                                name='isuseridlike'
                                onChange={(e) => props.handleUserSettings(e)}
                                checked={props.data.settings.isuseridlike}
                            />
                        </Form.Group>
                        <Form.Group
                            as={Col}
                            md="6"
                            controlId="validationCustomDate"
                            className='mb-3'
                        >
                            <Form.Label>
                                <span className={`label-icon ${profile.labelIcon}`}>
                                    <BsCalendar2EventFill />
                                </span>
                                Start Date
                                <span className={profile.mendatory}>
                                    *
                                </span>
                            </Form.Label>
                            <InputGroup hasValidation>
                                <input
                                    type="date"
                                    value={props.data.settings.startdate}
                                    name="startdate"
                                    onChange={(e) => props.handleUserSettings(e)}
                                    className={`date-section ${profile.dateSection}`}
                                    style={{ width: ' 100%' }}
                                />
                            </InputGroup>
                        </Form.Group>
                        <Form.Group
                            as={Col}
                            md="6"
                        >
                            <Form.Label>
                                <span className={`label-icon ${profile.labelIcon}`}>
                                    <FaUser />
                                </span>
                                Role Name
                                <span className={profile.mendatory}>
                                    *
                                </span>
                            </Form.Label>
                            <Form.Select value={props.data.settings.rolename}
                                aria-label="Floating label select example"
                                name='rolename'
                                required
                                onChange={(e) => props.handleUserSettings(e)}
                            >
                                <option value='client'>client</option>
                                <option value='broker'>broker</option>
                                <option value='company'>company</option>
                            </Form.Select>
                            <Form.Control.Feedback type="invalid">
                                Please choose Userid
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group
                            as={Col}
                            md="6"
                            controlId="validationCustomPhone"
                            className="mb-3"
                        >
                            <Form.Label>
                                <span className={`label-icon ${profile.labelIcon}`}>
                                    <FaUser />
                                </span>
                                UserId Like
                                <span className={profile.mendatory}>
                                    *
                                </span>
                            </Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter UserId  (ex. CN,RM,CNG)"
                                readOnly={!props.data.settings.isuseridlike}
                                name='useridlike'
                                onChange={(e) => props.handleUserSettings(e)}
                                value={props.data.settings.useridlike}
                            />
                            <Form.Control.Feedback type="invalid">
                                Please enter UserId (ex. CN,RM,CNG).
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group
                            as={Col}
                            md="12"
                            controlId="validationCustomName"
                            className='mb-3'
                        >
                            <Form.Label>
                                <span className={`label-icon ${profile.labelIcon}`}>
                                    <FaUserTag />
                                </span>
                                Set Access UserId
                                <span className={profile.mendatory}>
                                    *
                                </span>
                            </Form.Label>
                            <Multiselect
                                ref={useridSelectRef}
                                isObject={false}
                                // onRemove={useridListIntoString}
                                // onSelect={useridListIntoString}
                                options={totaluserid}
                                selectedValues={props.data.settings.access_users.split(',')}
                                showCheckbox
                                className='multi-select'
                            />
                            <Form.Control.Feedback type="invalid">
                                Please enter your Set Access id
                            </Form.Control.Feedback>
                        </Form.Group>


                    </Row>
                    <div>
                        {/* <Button type="submit" className={profile.basicInfoBtn}>Update</Button> */}
                        <input
                            type="submit"
                            className={profile.basicInfoBtn}
                            value='Save'
                            // onClick={handleSubmitUserSettings}
                            onClick={(e) => {
                                e.preventDefault();
                                setNotifyData((data) => ({
                                    ...data,
                                    confirmFlag: true,
                                    confirmMsg: "Are you sure, You want to change userid permissions?",
                                    confirmAction: (e) =>
                                        handleSubmitUserSettings(e)
                                }))
                            }}
                        />
                    </div>
                </Form>
            </div >
            <div className={`basic-forminfo ${profile.basicInfo}`} >
                <div className={userStyle.mainHeadingSection}>
                    <div className={userStyle.headingSection}>
                        <h5 className={profile.basicHeading}>
                            <span className={profile.icons}>
                                <FaAddressCard />
                            </span>
                            User Access Permissions
                        </h5>
                    </div>
                    <div className={userStyle.username}>
                        <label htmlFor="" >@{props.data.settings.username}</label>
                    </div>
                </div>

                <Form
                    noValidate
                    validated={validated}
                    onSubmit={handleSubmit}
                    className={profile.basicInfoSetting}
                >
                    <Row className="mb-3">
                        <Form.Group
                            as={Col}
                            md="6"
                            controlId="validationCustomName"
                            className='mb-3'
                        >
                            <Form.Label>
                                <span className={`label-icon ${profile.labelIcon}`}>
                                    <IoSettings />
                                </span>
                                Pages
                            </Form.Label>
                            <Form.Check
                                type="switch"
                                label="Dashboard"
                                name='isdashboard'
                                onChange={(e) => props.handleUserPermision(e)}
                                checked={props.data.permissions.isdashboard}
                            />
                            <Form.Check
                                type="switch"
                                label="Tabular Dashboard"
                                name='istabulardashboard'
                                onChange={(e) => props.handleUserPermision(e)}
                                checked={props.data.permissions.istabulardashboard}
                            />
                            <Form.Check
                                type="switch"
                                label="Ledger Enter"
                                name='isledger'
                                onChange={(e) => props.handleUserPermision(e)}
                                checked={props.data.permissions.isledger}
                            />
                            <Form.Check
                                type="switch"
                                label="Settings"
                                name='issettings'
                                onChange={(e) => props.handleUserPermision(e)}
                                checked={props.data.permissions.issettings}
                            />
                            <Form.Check
                                type="switch"
                                label="Report"
                                name='isreport'
                                onChange={(e) => props.handleUserPermision(e)}
                                checked={props.data.permissions.isreport}
                            />
                            <Form.Check
                                type="switch"
                                label="RMS User Management Dashboard"
                                name='isusermanagement'
                                onChange={(e) => props.handleUserPermision(e)}
                                checked={props.data.permissions.isusermanagement}
                            />
                            <Form.Check
                                type="switch"
                                label="Charts"
                                name='ischart'
                                onChange={(e) => props.handleUserPermision(e)}
                                checked={props.data.permissions.ischart}
                            />
                            <Form.Check
                                type="switch"
                                label="Support"
                                name='ischatbox'
                                onChange={(e) => props.handleUserPermision(e)}
                                checked={props.data.permissions.ischatbox}
                            />
                            <Form.Check
                                type="switch"
                                label="Accounting"
                                name='isaccounting'
                                onChange={(e) => props.handleUserPermision(e)}
                                checked={props.data.permissions.isaccounting}
                            />
                        </Form.Group>
                        <Form.Group
                            as={Col}
                            md="6"
                            controlId="validationCustomName"
                            className='mb-3'
                        >
                            <Form.Label>
                                <span className={`label-icon ${profile.labelIcon}`}>
                                    <FaHandsHelping />
                                </span>
                                General Access
                            </Form.Label>
                            <Form.Check
                                type="switch"
                                label="Portfolio"
                                name='isportfolio'
                                onChange={(e) => props.handleUserPermision(e)}
                                checked={props.data.permissions.isportfolio}
                            />
                            <Form.Check
                                type="switch"
                                label="Exposure"
                                name='isexposure'
                                onChange={(e) => props.handleUserPermision(e)}
                                checked={props.data.permissions.isexposure}
                            />
                            <Form.Check
                                type="switch"
                                label="Profit Loss Overview Graph"
                                name='isprofitlossgraph'
                                onChange={(e) => props.handleUserPermision(e)}
                                checked={props.data.permissions.isprofitlossgraph}
                            />
                            <Form.Check
                                type="switch"
                                label="Net Position"
                                name='isnetposition'
                                onChange={(e) => props.handleUserPermision(e)}
                                checked={props.data.permissions.isnetposition}
                            />
                            <Form.Check
                                type="switch"
                                label="Spread Book"
                                name='isspreadbook'
                                onChange={(e) => props.handleUserPermision(e)}
                                checked={props.data.permissions.isspreadbook}
                            />
                            <Form.Check
                                type="switch"
                                label="Margin Sheet"
                                name='ismarginsheet'
                                onChange={(e) => props.handleUserPermision(e)}
                                checked={props.data.permissions.ismarginsheet}
                            />
                            <Form.Check
                                type="switch"
                                label="Market Watch"
                                name='ismarketwatch'
                                onChange={(e) => props.handleUserPermision(e)}
                                checked={props.data.permissions.ismarketwatch}
                            />
                            <Form.Check
                                type="switch"
                                label="Parity Watch"
                                name='isparitywatch'
                                onChange={(e) => props.handleUserPermision(e)}
                                checked={props.data.permissions.isparitywatch}
                            />
                            <Form.Check
                                type="switch"
                                label="Parity Script"
                                name='isparityscript'
                                onChange={(e) => props.handleUserPermision(e)}
                                checked={props.data.permissions.isparityscript}
                            />
                            <Form.Check
                                type="switch"
                                label="Data Summary"
                                name='isdatasummary'
                                onChange={(e) => props.handleUserPermision(e)}
                                checked={props.data.permissions.isdatasummary}
                            />                         
                            <Form.Check
                                type="switch"
                                label="Net Position Cards"
                                name='isnetpositioncard'
                                onChange={(e) => props.handleUserPermision(e)}
                                checked={props.data.permissions.isnetpositioncard}
                            />
                            <Form.Check
                                type="switch"
                                label="Change Theme"
                                name='ischangetheme'
                                onChange={(e) => props.handleUserPermision(e)}
                                checked={props.data.permissions.ischangetheme}
                            />
                            <Form.Check
                                type="switch"
                                label="Indicator"
                                name='isindicator'
                                onChange={(e) => props.handleUserPermision(e)}
                                checked={props.data.permissions.isindicator}
                            />
                            <Form.Check
                                type="switch"
                                label="Create Bot"
                                name='iscreatebot'
                                onChange={(e) => props.handleUserPermision(e)}
                                checked={props.data.permissions.iscreatebot}
                            />
                        </Form.Group>
                        <Form.Group
                            as={Col}
                            md="6"
                            controlId="validationCustomName"
                            className='mb-3'
                        >
                            <Form.Label>
                                <span className={`label-icon ${profile.labelIcon}`}>
                                    <IoSettings />
                                </span>
                                Setting
                            </Form.Label>
                            <Form.Check
                                type="switch"
                                label="Trade Conversion"
                                name='isconversion'
                                onChange={(e) => props.handleUserPermision(e)}
                                checked={props.data.permissions.isconversion}
                            />
                            <Form.Check
                                type="switch"
                                label="User Configuration"
                                name='isuserconfig'
                                onChange={(e) => props.handleUserPermision(e)}
                                checked={props.data.permissions.isuserconfig}
                            />
                            <Form.Check
                                type="switch"
                                label="Product Defination"
                                name='isproductdef'
                                onChange={(e) => props.handleUserPermision(e)}
                                checked={props.data.permissions.isproductdef}
                            />
                            <Form.Check
                                type="switch"
                                label="Add Exchange"
                                name='isaddexchange'
                                onChange={(e) => props.handleUserPermision(e)}
                                checked={props.data.permissions.isaddexchange}
                            />
                            <Form.Check
                                type="switch"
                                label="Edit GroupName"
                                name='isgroupname'
                                onChange={(e) => props.handleUserPermision(e)}
                                checked={props.data.permissions.isgroupname}
                            />
                            <Form.Check
                                type="switch"
                                label="Edit CRUD Segment"
                                name='issegment'
                                onChange={(e) => props.handleUserPermision(e)}
                                checked={props.data.permissions.issegment}
                            />
                            <Form.Check
                                type="switch"
                                label="Exclude Userids"
                                name='isexcludeuserid'
                                onChange={(e) => props.handleUserPermision(e)}
                                checked={props.data.permissions.isexcludeuserid}
                            />
                            <Form.Check
                                type="switch"
                                label="Margin Conf"
                                name='ismarginsheetconf'
                                onChange={(e) => props.handleUserPermision(e)}
                                checked={props.data.permissions.ismarginsheetconf}
                            />
                            <Form.Check
                                type="switch"
                                label="Settlement upload"
                                name='issettlement'
                                onChange={(e) => props.handleUserPermision(e)}
                                checked={props.data.permissions.issettlement}
                            />
                        </Form.Group>
                        <Form.Group
                            as={Col}
                            md="6"
                            controlId="validationCustomName"
                            className='mb-3'
                        >
                            <Form.Label>
                                <span className={`label-icon ${profile.labelIcon}`}>
                                    <AiFillAccountBook />
                                </span>
                                Trade
                            </Form.Label>
                            <Form.Check
                                type="switch"
                                label="Trade Backup"
                                name='istradebackup'
                                onChange={(e) => props.handleUserPermision(e)}
                                checked={props.data.permissions.istradebackup}
                            />
                            <Form.Check
                                type="switch"
                                label="Manual Trade"
                                name='ismanualtrade'
                                onChange={(e) => props.handleUserPermision(e)}
                                checked={props.data.permissions.ismanualtrade}
                            />
                            <Form.Check
                                type="switch"
                                label="Export Tradebook"
                                name='isexporttradebook'
                                onChange={(e) => props.handleUserPermision(e)}
                                checked={props.data.permissions.isexporttradebook}
                            />
                            <Form.Check
                                type="switch"
                                label="Import Tradebook"
                                name='isimporttradebook'
                                onChange={(e) => props.handleUserPermision(e)}
                                checked={props.data.permissions.isimporttradebook}
                            />
                        </Form.Group>
                    </Row>
                    <div>
                        {/* <Button type="submit" className={profile.basicInfoBtn}>Update</Button> */}
                        <input
                            type="submit"
                            className={profile.basicInfoBtn}
                            value='Save'
                            // onClick={handleSubmitUserPermissions}
                            onClick={(e) => {
                                e.preventDefault();
                                setNotifyData((data) => ({
                                    ...data,
                                    confirmFlag: true,
                                    confirmMsg: "Are you sure, You want to chnage user access permissions ?",
                                    confirmAction: (e) =>
                                        handleSubmitUserAccessPermissions(e)
                                }))
                            }}
                        />
                    </div>
                </Form>
            </div >
            <Notification
                notify={NotifyData}
                CloseError={CloseError}
                CloseSuccess={CloseSuccess}
                CloseConfirm={CloseConfirm}
            />
        </div>
    )
}

export default memo(UserPermission)