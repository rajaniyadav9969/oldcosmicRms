import React, { memo, useState } from 'react'
import { GrConnectivity } from "react-icons/gr";
import { GiTrade } from "react-icons/gi";
import { TradeSenderToggle_API } from '../../Redux/API';
import { Notification } from '../../Notification';
import blinking from './Indicator.module.scss';
import { shallowEqual, useSelector } from 'react-redux';

const Indicator = (props) => {

    const GlobalTradeSender = useSelector(state => state && state.SocketData && state.SocketData.TradeSender, shallowEqual)

    const [visibility, setVisibility] = useState({
        toggletradesender: true,
        togglespreadbook: true,
        toggletelegrambot: true
    })

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


    const handleTradeSender = async () => {


        setNotifyData((data) => ({ ...data, loadingFlag: true, loadingMsg: "Trade Sender Toggle..." }))

        const ps1 = new Promise((resolve, reject) => {
            resolve(TradeSenderToggle_API({ tradesender: !GlobalTradeSender }));

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
            setNotifyData((data) => ({ ...data, loadingFlag: false, confirmFlag: false, errorFlag: true, errorMsg: rs['message'] }))
        }
        // setVisibility({
        //     ...visibility,
        //     toggletradesender: !visibility.toggletradesender
        // })
    }
    const handleSpreadBook = () => {
        setVisibility({
            ...visibility,
            togglespreadbook: !visibility.togglespreadbook
        })
    }
    const handleTelegramBot = () => {
        setVisibility({
            ...visibility,
            toggletelegrambot: !visibility.toggletelegrambot
        })
    }
    return (
        <div>
            {!props.indContent && <h6 className={`indicatorContent ${blinking.indicatorContent}`}>Indicator</h6>}
            <div className={blinking.blink}>
                <div className={blinking.blinkingSection} >
                    <span>
                        <span className={blinking.indicatorIcon} >
                            <GrConnectivity />
                        </span>
                        {GlobalTradeSender != undefined ?
                            <span className={blinking.blinkCircle}></span>
                            :
                            <span className={blinking.blinkCircle1}></span>
                        }
                    </span>
                    <span className={`indicator-name ${blinking.indicatorName}`}>
                        Websocket
                    </span>
                </div>
            </div>
            {/* <div className={blinking.blink}
                onClick={(e) => setNotifyData((data) => ({ ...data, confirmFlag: true, confirmMsg: "You want to toggle TradeSender...", confirmAction: (e) => handleTradeSender() }))}

            >
                <div className={blinking.blinkingSection}>
                    <span>
                        <span className={blinking.indicatorIcon}>
                            <GiTrade />
                        </span>
                        {GlobalTradeSender ?
                            <span className={blinking.blinkCircle}></span>
                            :
                            <span className={blinking.blinkCircle1}></span>
                        }
                    </span>
                    <span className={`indicator-name ${blinking.indicatorName}`}>
                        TradeSender
                    </span>
                </div>
            </div> */}
            {/* <div className={blinking.blink} onClick={() => handleSpreadBook()}>
                <div className={blinking.blinkingSection}>
                    <span>
                        <span className={blinking.indicatorIcon}>
                            <FaBookReader />
                        </span>
                        {visibility.togglespreadbook ?
                            <span className={blinking.blinkCircle}></span>
                            :
                            <span className={blinking.blinkCircle1}></span>
                        }
                    </span>
                    <span className={`indicator-name ${blinking.indicatorName}`}>
                        SpreadBook
                    </span>
                </div>
            </div> */}
            <Notification
                notify={NotifyData}
                CloseError={CloseError}
                CloseSuccess={CloseSuccess}
                CloseConfirm={CloseConfirm}
            />

            {/* <div className={blinking.blink} onClick={() => handleTelegramBot()}>
                <div className={blinking.blinkingSection}>
                    <span>
                        <span className={blinking.indicatorIcon}>
                            <FaTelegramPlane />
                        </span>
                        {visibility.toggleTelegramBot ?
                            <span className={blinking.blinkCircle}></span>
                            :
                            <span className={blinking.blinkCircle1}></span>
                        }
                    </span>
                    <span className={`indicator-name ${blinking.indicatorName}`}>
                        TelegramBot
                    </span>
                </div>
            </div> */}


        </div >
    )
}

export default memo(Indicator)