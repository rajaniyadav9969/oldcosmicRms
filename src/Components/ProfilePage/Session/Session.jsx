import React, { memo } from 'react'
import { RiComputerLine } from "react-icons/ri";
import { useSelector } from "react-redux";
import style from './Session.module.scss'

const Session = () => {
    // const state = useSelector((state) => state);
    const Globalhostdetails = useSelector(state => state && state.hostdetails)
    return (
        <div className={`session-section ${style.session}`}>
            <div className={style.sessionHeading}>
                <h3>Session</h3>
            </div>
            <div className={`session-card ${style.sessionCard}`}>
                {/* <div className={style.sessionCardItem}> */}
                <div className={`session-card-item ${style.sessionCardItem}`}>
                    <div className={`session-card-icon ${style.sessionCardIcon}`}>
                        <span>
                            <RiComputerLine />
                        </span>
                    </div>
                    <div className={style.sessionCardItemContent}>
                        <span className={style.hostDetails}>{Globalhostdetails && Globalhostdetails.browsertype + ' ' + Globalhostdetails.browserversion}</span>
                        <span className={style.ipAddress}>
                            <span className={style.deviceInfo}>Device Infomation: </span>
                            {Globalhostdetails
                                &&
                                Globalhostdetails.devicetype
                                + ' ' +
                                (Globalhostdetails.devicemodel == "None" ? '' : Globalhostdetails.devicemodel)
                                + ' ' +
                                (Globalhostdetails.devicebrand == "None" ? '' : Globalhostdetails.devicebrand)
                            }
                        </span>
                        <span className={style.ipAddress}>
                            <span className={style.deviceInfo}>OS Information: </span>
                            {Globalhostdetails
                                &&
                                Globalhostdetails.ostype
                                + '/' +
                                Globalhostdetails.osversion
                            }
                        </span>
                        <span className={style.ipAddress}>Your current session on {Globalhostdetails && Globalhostdetails.ipaddress}</span>
                    </div>
                </div>
                <div className={style.sessionCardFunc}>
                    <button type='button' className={style.sessionActivebtn}>
                        Active
                    </button>
                </div>
                {/* </div> */}
            </div>
        </div>
    )
}

export default memo(Session)