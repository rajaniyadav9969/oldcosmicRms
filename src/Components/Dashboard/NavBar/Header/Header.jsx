import React, { memo, useState } from 'react'

import { NavDropdown } from 'react-bootstrap';
import { MdMenuOpen, MdNotifications } from "react-icons/md";
import { CgLogOff, CgMaximize, CgMenu } from "react-icons/cg";
import { BsFillSunFill, BsMoonStarsFill } from 'react-icons/bs';
import { Badge } from '@material-ui/core';
import { shallowEqual, useDispatch } from 'react-redux';
import { useSelector } from 'react-redux'
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Notification, Snackbar } from '../../../Notification';
import { NotificationPage } from '../../../NotificationPage';
import { Logout_User_API } from '../../../Redux/API';
import { ChangeThemeAction, DeleteStateAction } from '../../../Redux/RMSAction';
import { socketClose } from '../../../../App';
import dash from "../../Dashboard.module.scss";
import "../Navbar.scss";
import './Header.scss'
import { useEffect } from 'react';


const Header = (props) => {
    let navigate = useNavigate();
    const [NotifyData, setNotifyData] = useState({
        confirmFlag: false,
        confirmMsg: 'confirm msg',
        successFlag: false,
        successMsg: 'success msg',
        errorFlag: false,
        errorMsg: 'error msg',
        loadingFlag: false,
        loadingMsg: 'loading msg',
        activesession: false,
    })
    const Globaldefaulttheme = useSelector(state => state && state.settings.defaulttheme)

    var elem = document.documentElement;
    // const handleScreen = () => {
    //     if (!elem.requestFullscreen()) {
    //         elem.requestFullscreen();
    //     }
    //     else {
    //         document.exitFullscreen();
    //     }
    // }
    const handleScreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen()
        } else {
            document.exitFullscreen();
        }
    }

    // start  log out
    const GlobalNotification = useSelector(state => state && state.SocketData && state.SocketData.Notification, shallowEqual)

    const Globalpermissions = useSelector(state => state && state.permissions)
    const dispatch = useDispatch()

    const CloseConfirm = () => {
        setNotifyData((data) => ({ ...data, confirmFlag: false }))
    }

    const CloseError = () => {
        setNotifyData((data) => ({ ...data, errorFlag: false }))
    }

    const CloseSuccess = () => {
        setNotifyData((data) => ({ ...data, successFlag: false }))
    }
    const onHandle = async () => {
        setNotifyData((data) => ({ ...data, loadingFlag: true, loadingMsg: "Logout user..." }))
        const ps1 = new Promise((resolve, reject) => {
            resolve(Logout_User_API())
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
            setNotifyData((data) => ({ ...data, loadingFlag: false, confirmFlag: false, successFlag: true, successMsg: "Logout Successful" }))
            dispatch(DeleteStateAction())
            socketClose()
            navigate("/", { replace: true })

        } else {
            setNotifyData((data) => ({ ...data, loadingFlag: false, confirmFlag: false, errorFlag: true, errorMsg: rs['message'] }))
            // navigate("/")
        }
        localStorage.removeItem('filterHideShow');
        localStorage.removeItem('togglePagination');
        if (!localStorage.getItem('rememberme') || localStorage.getItem('rememberme') == 'false') {
            // localStorage.removeItem('data') ;
            // localStorage.removeItem('rememberme') ;
            // localStorage.clear()
        }
    }
    //end logout

    Globaldefaulttheme == "dark" ? document.body.classList.add("dark-mode") : document.body.classList.remove("dark-mode")

    return (
        <div collapsed={props.menuCollapse.toString()} className="mainnavbar">
            <div className={props.menuCollapse ? 'closemenu ' : 'openmenu'} onClick={props.menuIconClick} >
                {props.menuCollapse ? <CgMenu /> : <MdMenuOpen />}
            </div>
            <div className='trade-beta-version'>
                <span className='beta-version-content'>Cosmic Trade Beta v0.0.2</span>
            </div>
            <div className='cosmicTrades'>
                <NavLink to='/dashboard' className="cosmic-trade-content">
                    <h1>
                        Cosmic Trades
                    </h1>
                </NavLink>
            </div>
            <div className="menubar">
                <div className="d-flex flex-row">
                    {/* <div className="draggable-parity draggable-parity1">
                        <DragableFloating Broadcaster={props.SocketData.Broadcaster} />
                    </div> */}
                    {Globalpermissions && Globalpermissions.ischangetheme
                        &&
                        <div className="screen-dark-light">
                            <span className='singleItem'>
                                <div onClick={() => { dispatch(ChangeThemeAction(Globaldefaulttheme == "light" ? 'dark' : 'light')) }} >
                                    {Globaldefaulttheme == "light" ? <BsMoonStarsFill /> : <BsFillSunFill />}
                                </div>
                            </span>
                        </div>
                    }
                    <div className="screenManage">
                        <span className='singleItem'>
                            <CgMaximize onClick={handleScreen} />
                        </span>
                    </div>

                    {/* {props.SocketData.Notification && <span className=" notification-blinking"></span>} */}

                    {GlobalNotification &&
                        <div className="notification">
                            <div className='dashboard-tab'>
                                <NavDropdown title=
                                    {
                                        <span className='singleItem'>
                                            <Badge overlap="rectangular" badgeContent={GlobalNotification && GlobalNotification.length} className="notification-count">
                                                <MdNotifications />
                                            </Badge>
                                        </span>
                                    }
                                    id="collasible-nav-dropdown"
                                    className="nav-item ">
                                    <NotificationPage SocketData={props.SocketData && props.SocketData} />
                                </NavDropdown>
                            </div>
                        </div>
                    }
                    
                        <div className="userProfile">
                            <span className='singleItem'
                                onClick={(e) => setNotifyData((data) => ({ ...data, confirmFlag: true, confirmMsg: "Are you sure...", confirmAction: (e) => onHandle() }))}
                            >
                                <CgLogOff />
                            </span>
                        </div>
                        
                    
                </div>

            </div>
            <div className={dash.snackbarNotify}>
                <div className={dash.snackbarMain}>
                    {
                        GlobalNotification !== undefined && GlobalNotification.map((val, i) => { return <Snackbar types={val} key={i} /> })
                    }
                </div>
            </div>
            <Notification
                notify={NotifyData}
                CloseError={CloseError}
                CloseSuccess={CloseSuccess}
                CloseConfirm={CloseConfirm}
            />
            <Outlet />
        </div >
    )
}

export default memo(Header)
