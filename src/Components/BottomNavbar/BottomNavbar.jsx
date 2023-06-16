import React, { memo } from 'react'
import { MdNotifications, MdDashboard } from "react-icons/md";
import { NavLink } from 'react-router-dom'
import { shallowEqual, useSelector } from 'react-redux';
import { BiSupport } from 'react-icons/bi';
import { Badge } from '@material-ui/core';
import { DragableFloating } from '../DynamicComponent';
import { mediaURL } from '../Redux/API';
import './BottomNavba.scss'

const BottomNavbar = (props) => {
    const Globalprofile_pic = useSelector((state) => state && state.profile_pic);
    const GlobalBroadcaster = useSelector((state) => state && state.SocketData && state.SocketData.Broadcaster, shallowEqual);
    const GlobalNotification = useSelector((state) => state && state.SocketData && state.SocketData.Notification, shallowEqual);

    return (
        <div className='bottomnavbar'>
            <div className='subFooter'>
                <div className='singleFooterItem'>
                    <NavLink
                        className="footerItemLink"
                        to='/dashboard'
                    >
                        <MdDashboard />
                    </NavLink>
                </div>
                <div className='singleFooterItem'>
                    <span
                    >
                        <NavLink to='support'
                            className="footerItemLink"
                        >
                            <Badge overlap="rectangular" badgeContent={props.chatnotificationData.length} className="notification-count">
                                <BiSupport />
                            </Badge>
                        </NavLink>
                    </span>
                </div>
                <div className='singleFooterItem'>
                    <div className=" draggable-parity">
                        <DragableFloating Broadcaster={GlobalBroadcaster && GlobalBroadcaster}/>
                    </div>
                </div>

                <div className='singleFooterItem'>
                    <NavLink to='notify' className="footerItemLink">
                        <Badge overlap="rectangular" badgeContent={GlobalNotification && GlobalNotification.length} className="notification-count">
                            <MdNotifications />
                        </Badge>
                    </NavLink>
                    {/* {state && (state.notification.length > 0) && <span className="mob-notification-blinking"></span>} */}
                </div>
                <div className='singleFooterItem'>
                    {/* <span> */}
                        <NavLink to='settings' className="footerItemLink">
                            {/* <FaUser /> */}
                            <img className='footer-user-icon' src={Globalprofile_pic ? mediaURL + Globalprofile_pic : null} alt="usericon" />
                        </NavLink>
                    {/* </span> */}
                </div>
            </div>
        </div >
    )
}

export default memo(BottomNavbar)