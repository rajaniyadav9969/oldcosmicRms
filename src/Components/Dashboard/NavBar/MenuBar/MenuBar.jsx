import React, { memo, useState } from 'react'
import "react-pro-sidebar/dist/css/styles.css";
import {
    ProSidebar,
    Menu,
    SidebarHeader,
    SidebarContent, MenuItem
} from "react-pro-sidebar";
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { CgClose } from "react-icons/cg";
import Multiselect from 'multiselect-react-dropdown';
import { Badge } from '@material-ui/core';
import { BsFillSunFill, BsMoonStarsFill } from 'react-icons/bs';
import { useDispatch, useSelector } from 'react-redux';
import { Toast } from 'react-bootstrap';
import { ProfileCard } from './ProfileCard';
import { Logout } from './Logout';
import mainlogo from '../../../../Assets/Img/cosmic-logo.png'
import shortlogo from '../../../../Assets/Img/favicon-new.png'
import { Logout_User_API, mediaURL } from '../../../Redux/API';
import { Indicator } from '../../../DynamicComponent';
import '../Navbar.scss'
import { Notification } from '../../../Notification';
import { ChangeThemeAction, DeleteStateAction } from '../../../Redux/RMSAction';
import { socketClose } from '../../../../App';


const MenuBar = (props) => {
    const { dataitems } = props
    const Globalprofile = useSelector(state => state && state.profile)
    const Globalprofile_pic = useSelector(state => state && state.profile_pic)
    const Globalsettings = useSelector(state => state && state.settings)
    const Globalpermissions = useSelector(state => state && state.permissions)
    const Globaldefaulttheme = useSelector(state => state && state.settings.defaulttheme)
    // const [theme, settheme] = useState(false)

    Globaldefaulttheme == "dark" ? document.body.classList.add("dark-mode") : document.body.classList.remove("dark-mode")


    const handleTabs = () => {
        (window.innerWidth < 960) && (props.menuIconClick())
        // (props.menuCollapse ? props.setMenuCollapse(false) : props.setMenuCollapse(true))
    }

    const [showA, setShowA] = useState(false);
    const toggleShowA = () => setShowA(!showA);


    let navigate = useNavigate();
    // start  log out
    const dispatch = useDispatch()
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
    return (
        <ProSidebar collapsed={props.menuCollapse}>
            <div id="header">
                <div className="menuicon" onClick={props.menuIconClick}>
                    {/* <div className={menuCollapse ? <MdClose/> : <MdMenuOpen />}></div> */}
                    {props.menuCollapse ? <CgClose /> : <CgClose />}
                </div>

                <SidebarHeader>
                    {props.menuCollapse ?
                        <div className="logo1">
                            <NavLink className="logoIcon" to="/dashboard">
                                <img className="responsive-img"
                                    src={shortlogo} alt="" />
                            </NavLink>
                        </div >
                        :
                        <div className="logo">
                            <NavLink className="logoIcon" to="/dashboard">
                                <img className="responsive-img" src={mainlogo} alt="" />
                            </NavLink>
                        </div>
                    }
                </SidebarHeader>
                <div className='user-section'>
                    <div className='user-information'>
                        <h6 className="user-username">{Globalprofile.username}</h6>
                        <h6 className="user-rolename">{Globalsettings.rolename}</h6>
                    </div>
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

                </div>
                <SidebarContent>
                    {Globalprofile && <Menu iconShape="square" className={props.menuCollapse ? "navmenu menuCollapse" : "navmenu"}>
                        {dataitems.map((item, index) => {
                            // const depthLevel = 0;
                            return (item.show && <MenuItem key={index} className='singleitem '>
                                <div className='singlemenu' >
                                    <NavLink
                                        to={item.href}
                                        className="sublink1"
                                        onClick={handleTabs}
                                    >
                                        <span className='menuicons1'>
                                            {item.title === 'Support' ? <Badge overlap="rectangular" badgeContent={props.chatnotificationData.length} className="notification-count">
                                                {item.icon}
                                            </Badge>
                                                : item.icon}
                                        </span>
                                        {item.title}
                                    </NavLink>
                                    <Outlet />
                                </div>
                            </MenuItem>
                            )
                        })}
                    </Menu>}

                </SidebarContent>
            </div>
            <div className='sidebar-bottom-Section'>
                {Globalpermissions && Globalpermissions.isindicator &&
                    <div className='indicator-blinking-section'>
                        <Indicator indContent={props.menuCollapse} />
                    </div>
                }
                {Globalprofile_pic &&
                    <div className="profile-side">
                        {props.menuCollapse ?
                            <div>
                                <div className='profile-user-icon' onClick={toggleShowA}>
                                    <span className='user-icon'>
                                        <img src={Globalprofile_pic ? mediaURL + Globalprofile_pic : null} alt="usericon" />
                                    </span>
                                </div>

                                <Toast show={showA} onClose={toggleShowA}>
                                    <div className='tost'></div>
                                    <div className='fade-tost'>
                                        <Toast.Header>
                                            <h4 className="me-auto">Total UserIds {(Globalsettings.access_users.split(',').length)}</h4>
                                        </Toast.Header>
                                        <Toast.Body>
                                            <Multiselect
                                                isObject={false}
                                                options={Globalsettings.access_users.split(',')}
                                                selectedValues={Globalsettings.access_users.split(',')}
                                                showCheckbox
                                                className='multi-select'
                                            />
                                        </Toast.Body>
                                    </div>

                                </Toast>
                            </div>
                            :
                            <ProfileCard />
                        }
                    </div>
                }
                <div className="logout"
                    onClick={(e) => setNotifyData((data) => ({ ...data, confirmFlag: true, confirmMsg: "Are you sure...", confirmAction: (e) => onHandle() }))}
                >
                    <Logout />
                </div>
            </div>
            <Notification
                notify={NotifyData}
                CloseError={CloseError}
                CloseSuccess={CloseSuccess}
                CloseConfirm={CloseConfirm}
            />
            <Outlet />
        </ProSidebar>
    )
}
export default memo(MenuBar)