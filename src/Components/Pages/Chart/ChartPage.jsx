import React, { useState, memo } from "react";
import ProfitLossChart from "./ProfitLossChart";
import { Notification } from "../../Notification";
import PositionsChart from "./PositionsChart";
import dash from '../../Dashboard/Dashboard.module.scss'

const ChartPage = () => {
    const [datasummary, setDataSummary] = useState([])

    const [NotifyData, setNotifyData] = useState({
        successFlag: false,
        successMsg: 'success msg',
        errorFlag: false,
        errorMsg: 'error msg',
        loadingFlag: false,
        loadingMsg: 'loading msg',
        activesession: false
    })

    const CloseError = () => {
        setNotifyData((data) => ({ ...data, errorFlag: false }))
    }
    const CloseSuccess = () => {
        setNotifyData((data) => ({ ...data, successFlag: false }))
    }
    // useEffect(() => {
    //     const WebsocketConnect = () => {
    //         // setNotifyData((data) => ({ ...data, loadingFlag: true }))
    //         let socket = new WebSocket(ws+'/RMS');
    //         socket.onopen = function (e) {
    //             console.log("OPEN");
    //             // socket.send(JSON.stringify({ 'method': 'auth', 'params': { 'UserId': '96', 'Token': 'M9KAeV0DKCN3vAGwXZk3' } }));
    //             socket.send(JSON.stringify({ 'username': 'jayesh' }));
    //         };

    //         socket.onmessage = function (e) {
    //             let data = JSON.parse(e.data)
    //             if (data.DataSummary !== undefined) {
    //                 if (data.DataSummary.length !== 0) {
    //                     setDataSummary(data.DataSummary)
    //                 }
    //             }
    //         };
    //         socket.onclose = function (e) {
    //             console.log("close", e);
    //             setNotifyData((data) => ({ ...data, loadingFlag: false, errorFlag: true, errorMsg: "websocket close"  }))
    //         };
    //         socket.onerror = function (e) {
    //             console.log("error", e);
    //         };

    //     }
    //     WebsocketConnect()
    // }, [])

    return (
        <div className="container-fluid overview-chart">
            <div className="row ">
                <div className={`col-md-12 ${dash.dailyMTMGraph} ${dash.dailyMtmChart}`}>
                    {datasummary && <ProfitLossChart data={datasummary} />}
                </div>
                <div className={`col-md-12 ${dash.dailyMTMGraph} ${dash.dailyMtmChart}`}>
                    {datasummary && <PositionsChart data={datasummary} />}
                </div>
                <Notification notify={NotifyData} CloseError={CloseError} CloseSuccess={CloseSuccess} />
            </div>
        </div>
    )
}
export default memo(ChartPage)