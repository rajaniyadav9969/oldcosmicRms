import React, { memo, useState } from 'react'
import { useNavigate, Outlet } from 'react-router-dom';
import { FiLogOut } from "react-icons/fi";
import logout from './Logout.module.scss';

const Logout = () => {

    return (
        <div 
        className={logout.logoutcardcontainer}
         >
            <div className={logout.logoutmaincard}>
                <div className={logout.logoutcard}>
                    <div className={logout.logoutcardicon}>
                        <span className={logout.logoutcardiconmain}><FiLogOut /></span>
                    </div>
                    <div className={logout.logoutcardcontents}>
                        <h6 className={logout.logoutcardheading}>Logout</h6>
                        {/* <h6 className={logout.logoutcardheading2}>Client</h6> */}
                    </div>
                </div>
            </div>
            <Outlet />
        </div>
    )
}
export default memo(Logout)