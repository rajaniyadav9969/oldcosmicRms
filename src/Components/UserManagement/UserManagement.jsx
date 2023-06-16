import React, { memo, useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { ImSearch } from "react-icons/im";
import profileUser from '../../Assets/Img/profileuser.jpg'
import { UserPermission } from '.'
import { GetUsersData_API, UpdateUserpermission_API } from '../Redux/API';
import { Notification } from '../Notification';
import userStyle from './UserManagement.module.scss'
import profile from '../ProfilePage/ProfilePage.module.scss'



const UserManagement = () => {
    const [selectedUserData, setSelectedUserData] = useState()
    const [searchValue, setSearchValue] = useState('');

    const [NotifyData, setNotifyData] = useState({
        successFlag: false,
        successMsg: 'success msg',
        errorFlag: false,
        errorMsg: 'error msg',
        loadingFlag: false,
        loadingMsg: 'loading msg',
        activesession: false
    })
    const [usersData, setUsersData] = useState()

    const CloseError = () => {
        setNotifyData((data) => ({ ...data, errorFlag: false }))
    }
    const CloseSuccess = () => {
        setNotifyData((data) => ({ ...data, successFlag: false }))
    }
    const handleUserPermision = (e) => {
        setSelectedUserData((current) => {
            return {
                ...current,
                permissions: {
                    ...current.permissions,
                    [e.target.name]: e.target.checked
                },
                settings: {
                    ...current.settings,
                    [e.target.name]: e.target.checked
                }
            }
        })
    }

    const handleUserSettings = (e) => {
        const newState = { ...selectedUserData }
        newState.settings[e.target.name] = e.target.type == 'checkbox' ? e.target.checked : e.target.value;
        setSelectedUserData(newState)

    }


    const handleUSerData = async (username) => {
        setNotifyData((data) => ({ ...data, loadingFlag: true, loadingMsg: "Retriving users data...." }))
        const ps1 = new Promise((resolve, reject) => {
            resolve(GetUsersData_API({ 'username': username }))
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
            // setNotifyData((data) => ({ ...data, successFlag: true, successMsg: rs['message'] }))
            setSelectedUserData(rs.data);
            // dispatch(LoginAction(rs['data']));
        } else {
            setNotifyData((data) => ({ ...data, loadingFlag: false, errorFlag: true, errorMsg: rs['message'] }))
        }
    }

    const updateUserPermissions = async (username) => {
        setNotifyData((data) => ({ ...data, loadingFlag: true, loadingMsg: "Retriving users data...." }))
        const ps1 = new Promise((resolve, reject) => {
            resolve(UpdateUserpermission_API(selectedUserData.permissions))
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
            // setNotifyData((data) => ({ ...data, successFlag: true, successMsg: rs['message'] }))
            setSelectedUserData(rs.data);
            // dispatch(LoginAction(rs['data']));
        } else {
            setNotifyData((data) => ({ ...data, loadingFlag: false, errorFlag: true, errorMsg: rs['message'] }))
        }
    }

    useEffect(() => {
        async function getUsersData() {
            setNotifyData((data) => ({ ...data, loadingFlag: true, loadingMsg: "Retriving users data..." }))
            const ps1 = new Promise((resolve, reject) => {
                resolve(GetUsersData_API({ 'username': 'all' }))
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
                setUsersData(rs.data.profile);
            } else {
                setNotifyData((data) => ({ ...data, loadingFlag: false, errorFlag: true, errorMsg: rs['message'] }))
            }
        }
        getUsersData()
    }, [])
    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-4">
                    <div className={userStyle.searchUserSection}>
                        <div className={`usermanagement-search-field ${userStyle.searchField}`}>
                            <input
                                type="text"
                                placeholder="Search User"
                                className={`usermanagement-search-box  ${userStyle.searchBox}`}
                                value={searchValue}
                                onChange={(e) => { setSearchValue(e.target.value) }}
                            />
                            <span className={userStyle.searchIcon}>
                                <ImSearch />
                            </span>
                        </div>
                        <div className={`usermanagement-section ${userStyle.UserManagement}`}>
                            {usersData ? Object.values(usersData).filter(el => { return el.username.toLowerCase().includes(searchValue.toLowerCase()) }).map((data, i) => {
                                return <div key={i} className={`usermanagement-card ${userStyle.userManageCard}`} onClick={() => handleUSerData(data.username)}>
                                    <div className={userStyle.userIcon}>
                                        <img src={profileUser} alt="usericon" />
                                    </div>
                                    <div className={`user-activate-blink ${userStyle.userBlink}`}>
                                        {data.is_active
                                            ?
                                            <div className={userStyle.blinkSection}>
                                                <span className={userStyle.blinkCircle}></span>
                                            </div>
                                            :
                                            <span className={userStyle.blinkCircle1}></span>
                                        }
                                    </div>
                                    <div className={`usermanagement-user-info ${userStyle.userInfo}`}>
                                        <h5 className={userStyle.flName}>
                                            {data.first_name + ' ' + data.last_name}
                                        </h5>
                                        <h5 className={userStyle.username}>
                                            {'@' + data.username}
                                        </h5>
                                        <h6><span className={`user-card-caption ${userStyle.cardcaption}`}>Last Login </span>  {data.last_login && new Date(data.last_login).toUTCString()} </h6>
                                    </div>
                                    {/* <div className={userStyle.btnSection}>
                                    <span className={userStyle.btn} >{data.is_active ? 'Active' : 'In-Active'}</span>
                                </div> */}
                                </div>
                            }) : null}
                        </div>

                    </div>
                </div>
                <div className="col-md-8">
                    <div className={userStyle.createBtn}>
                        <NavLink
                            className={`${profile.basicInfoBtn} ${userStyle.usercreateBtn}`}
                            to="/signup"
                        >Create New User</NavLink>
                    </div>
                    <div
                        className={userStyle.settingTabContent1}
                    >
                        {selectedUserData && <UserPermission data={selectedUserData} handleUserPermision={handleUserPermision} handleUserSettings={handleUserSettings} />}
                    </div>
                </div>
            </div>
            <Notification notify={NotifyData} CloseError={CloseError} CloseSuccess={CloseSuccess} />
        </div>
    )
}


export default memo(UserManagement)