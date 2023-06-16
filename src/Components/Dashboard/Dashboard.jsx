import React, { memo, useEffect, useState } from "react";
import DailyMTMGraph from "./DailyMTM/DailyMTMGraph";
import { Form } from "react-bootstrap";
import _ from "lodash";
import { shallowEqual, useSelector } from "react-redux";
import { CusColumn } from "../DataTable/CusColumn";
import { GetColumns_API, GetDataSummary_API, GetMonthlyMTM_API, GetNetPosition_API } from "../Redux/API";
import { Notification } from "../Notification";
import { CreateCard } from "../DynamicComponent";
import { createBalance, createDataSummary, createExposure, createNetPosition } from "../Utilities/Utilities";
import ExposureCard from "../DynamicComponent/ExposureCard/ExposureCard";
import dash from "./Dashboard.module.scss";
import DonutAnalysisChart from "./DailyMTM/DonutAnalysisChart";
import AnalysisChartPos from "./DailyMTM/AnalysisChartPos";
import AnalysisChartMTM from "./DailyMTM/AnalysisChartMTM";


const Dashboard = () => {
    const GlobalSocketData = useSelector(state => state && state.SocketData, shallowEqual)
    const Globalpermissions = useSelector(state => state && state.permissions)

    const [NotifyData, setNotifyData] = useState({
        successFlag: false,
        successMsg: "success msg",
        errorFlag: false,
        errorMsg: "error msg",
        loadingFlag: false,
        loadingMsg: "loading msg",
        activesession: false,
    });

    const [netposition, setnetposition] = useState([]);
    const [datasummary, setDataSummary] = useState([]);

    const [columnsNetPosition, setColumnsNetPosition] = useState([]);
    const [columnsDataSummary, setColumnsDataSummary] = useState([]);
    const [WebSocketNotification, setWebSocketNotification] = useState([])
    const [columnsOverAll, setColumnsOverAll] = useState([]);
    const [columnsClient, setColumnsClient] = useState([]);
    const [columnsBroker, setColumnsBroker] = useState([]);
    const [columnsCompany, setColumnsCompany] = useState([]);
    const [exposureData, setexposureData] = useState([])
    const [exposureColumn, setexposureColumn] = useState([])
    const [usdrate, setusdrate] = useState(0)
    const [CardFilter, setCardFilter] = useState({
        exchange: 'sgx',
        type: 'client'
    })

    const [clientmtmrecords, setClientMTMRecords] = useState([]);

    const [balance, setBalance] = useState([
        {
            currency: "INR",
            tilllyesterday: 0,
            todayposition: 0,
            today: 0,
            current: 0,
            percentagechange: 0,
        },
    ]);

    const [columnsToHide, setColumnsToHide] = useState([]);

    const CloseError = () => {
        setNotifyData((data) => ({ ...data, errorFlag: false }));
        // navigate("/login", { replace: true })
    };

    const CloseSuccess = () => {
        setNotifyData((data) => ({ ...data, successFlag: false }));
    };

    useEffect(() => {
        const getColumns = async () => {
            const ps1 = new Promise((resolve, reject) => {
                resolve(GetColumns_API('netposition'))
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
                setColumnsToHide(rs['data']);

                // setNotifyData((data) => ({ ...data, successFlag: true, successMsg: rs['message'] }))
            } else {
                setNotifyData((data) => ({ ...data, loadingFlag: false, errorFlag: true, errorMsg: rs['message'] }))
            }

        }
        getColumns();

        async function getPrevGraphMTM() {
            setNotifyData((data) => ({
                ...data,
                loadingFlag: true,
                loadingMsg: "Retriving data...",
            }));

            const ps1 = new Promise((resolve, reject) => {
                resolve(GetMonthlyMTM_API());
            });

            const rs = await Promise.all([ps1])
                .then((val) => {
                    return val[0]["data"];
                })
                .catch((err) => {
                    setNotifyData((data) => ({
                        ...data, loadingFlag: false, errorFlag: true,
                        errorMsg: err["message"]
                    }));
                    console.log("*********", err.response.status);
                    (err.response.status === 401) && setTimeout(() => { window.location.assign(window.location.origin) }, 1000);
                    return err["response"]["data"];
                });
            if (rs["type"] === "success") {
                setNotifyData((data) => ({ ...data, loadingFlag: false }));
                setClientMTMRecords(rs["data"]);
            } else {
                setNotifyData((data) => ({ ...data, loadingFlag: false, errorFlag: true, errorMsg: rs["message"] }));
            }
        }
        // async function getPortfolioBalance() {
        //     setNotifyData((data) => ({
        //         ...data,
        //         loadingFlag: true,
        //         loadingMsg: "Retriving data...",
        //     }));
        //     const ps1 = new Promise((resolve, reject) => {
        //         resolve(GetPortfolioBalance_API("client"));
        //     });
        //     const rs = await Promise.all([ps1])
        //         .then((val) => {
        //             return val[0]["data"];
        //         })
        //         .catch((err) => {
        //             setNotifyData((data) => ({ ...data, loadingFlag: false, errorFlag: true, errorMsg: err["message"] }));
        //             console.log("*********", err.response.status);
        //             (err.response.status === 401) && setTimeout(() => { window.location.assign(window.location.origin) }, 1000);
        //             return err["response"]["data"];
        //         });
        //     if (rs["type"] === "success") {
        //         setNotifyData((data) => ({ ...data, loadingFlag: false }));
        //         setBalance(
        //             balance.map((val) => {
        //                 val.tilllyesterday = _.sumBy(rs.data, "tilllastweekmtm");
        //                 val.todayposition = _.sumBy(rs.data, "currentweekmtm");
        //                 return val;
        //             })
        //         );
        //     } else {
        //         setNotifyData((data) => ({ ...data, loadingFlag: false, errorFlag: true, errorMsg: rs["message"] }));
        //     }
        // }
        async function getDataSummary() {
            setNotifyData((data) => ({
                ...data,
                loadingFlag: true,
                loadingMsg: "Retriving data...",
            }));
            const ps1 = new Promise((resolve, reject) => {
                resolve(GetDataSummary_API());
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
                        setDataSummary(rs.data);
                        if (columnsDataSummary.length === 0) {
                            setColumnsDataSummary(CusColumn(rs.data[0]));
                            setColumnsClient(CusColumn(rs.data[0], Object.keys(rs.data[0]).map((val) => { return !val.includes("client") && !val.includes("userid") && !val.includes("groupname") && !val.includes("segment") && !val.includes("hedgeratio") && val })))

                            setColumnsBroker(CusColumn(rs.data[0], Object.keys(rs.data[0]).map((val) => { return !val.includes("broker") && !val.includes("userid") && !val.includes("groupname") && !val.includes("segment") && !val.includes("hedgeratio") && val })))

                            setColumnsCompany(CusColumn(rs.data[0], Object.keys(rs.data[0]).map((val) => { return !val.includes("company") && !val.includes("userid") && !val.includes("groupname") && !val.includes("segment") && !val.includes("hedgeratio") && val })))

                            setColumnsOverAll(CusColumn(rs.data[0], Object.keys(rs.data[0]).map((val) => { return (val.includes("client") || val.includes("broker") || val.includes("company")) && !val.includes("userid") && !val.includes("groupname") && !val.includes("segment") && !val.includes("hedgeratio") && val })))
                        }
                    }
                }
            } else {
                setNotifyData((data) => ({ ...data, loadingFlag: false, errorFlag: true, errorMsg: rs["message"] }));
            }
        }
        async function getNetposition() {
            setNotifyData((data) => ({
                ...data,
                loadingFlag: true,
                loadingMsg: "Retriving data...",
            }));
            const ps1 = new Promise((resolve, reject) => {
                resolve(GetNetPosition_API());
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
                        setnetposition(rs.data);
                        if (columnsNetPosition.length === 0) {
                            setColumnsNetPosition(CusColumn(rs.data[0], ['currency', 'broksharing', 'comsharing', 'multiplier', 'usdrate', 'clientsharing', 'brokmtm', 'compmtm']));
                        }
                    }
                }
            } else {
                setNotifyData((data) => ({ ...data, loadingFlag: false, errorFlag: true, errorMsg: rs["message"] }));
            }
        }

        getDataSummary();
        // getNetposition();
        getPrevGraphMTM();

    }, []);

    useEffect(() => {
        // console.log(GlobalSocketData);

        if (GlobalSocketData !== undefined) {
            if (GlobalSocketData.length !== 0) {
                // setnetposition(GlobalSocketData.NetPosition);
                if (GlobalSocketData.Broadcaster !== undefined) {
                    GlobalSocketData.Broadcaster.map(val => {
                        val.exchange === 'USD' && setusdrate(val.ltp)
                        return val
                    })

                }
                GlobalSocketData && setnetposition(createNetPosition(GlobalSocketData.NetPosition, GlobalSocketData.Broadcaster, netposition))
                setDataSummary(createDataSummary(netposition, datasummary, usdrate))
                setBalance(createBalance(datasummary, balance, CardFilter));
                setexposureData(createExposure(netposition, GlobalSocketData.Broadcaster))

                if (netposition !== undefined) {
                    if (netposition.length > 1) {
                        if (columnsNetPosition.length < 1) {
                            let colData = CusColumn(netposition[0], ['currency', 'broksharing', 'comsharing', 'multiplier', 'usdrate', 'clientsharing', 'brokmtm', 'compmtm'])
                            if (columnsToHide.length > 0) {
                                let temp = columnsToHide[0].access_columns.split(',')
                                for (let i = 0; i < temp.length; i++) {
                                    for (let j = 0; j < colData.length; j++) {
                                        if (temp[i] == colData[j]['Header']) {
                                            colData[j]['show'] = false;
                                        }
                                    }
                                }
                            }
                            setColumnsNetPosition(colData)
                        }
                    }
                }
                GlobalSocketData.Notification !== undefined && GlobalSocketData.Notification && setWebSocketNotification(GlobalSocketData.Notification);
            }
        }

    }, [GlobalSocketData])


    // if (netposition.length > 1) {
    //     if (columnsNetPosition.length < 1) {
    //         setColumnsNetPosition(CusColumn(netposition[0], ['currency', 'broksharing', 'comsharing', 'multiplier', 'usdrate', 'clientsharing']));
    //     }
    // }
    if (datasummary && datasummary.length > 1) {
        if (columnsDataSummary.length < 1) {
            setColumnsDataSummary(CusColumn(datasummary[0]));
        }
    }

    if (exposureData && exposureData.length > 0) {
        if (exposureColumn.length < 1) {
            setexposureColumn(CusColumn(exposureData[0], ['nseceqty', 'nsepeqty', 'nsefutqty', 'nseceexpo', 'nsepeexpo', 'nsefutexpo']))
        }
    }

    const handleColumnVisibility = (props) => {
        let newState;

        if (props.id === 'exposuredata') {
            newState = [...exposureColumn];
        }
        newState.map(column => {
            return ((column.Header === props.header) ? column.show = !column.show : null
                // if (column.Header === props.header) {
                //     column.show = !column.show
                // }
            )
        });
        if (props.id === 'exposuredata') {
            setexposureColumn(newState)
        }
        localStorage.setItem(props.id, JSON.stringify(newState));
    }

    const handleCreateAlert = (e, data = {}, flag) => {
        e.preventDefault()
        setBalance(
            balance.map((val) => {
                val.condition = data.condition;
                val.alertamount = data.amount;
                val.enablealert = true;
                return val;
            })
        );
    }
    const handleStopAlert = (flag) => {
        setBalance(
            balance.map((val) => {
                val.enablealert = flag;
                return val;
            })
        );
    }

    return (
        <div className={`container-fluid ${dash.containerFluid}`}>
            <div className={dash.dashboardSection}>
                <div className={dash.dashboardTradeSection}>

                    {Globalpermissions && Globalpermissions.isportfolio && (
                        <div
                            // className={dash.dashboardCardSection}
                            className={Globalpermissions && ((Globalpermissions.isexposure) && (Globalpermissions.isprofitlossgraph)) ? `${dash.dashboardCard}` : `${dash.fulldashboardCard}`}
                        >
                            <div
                                className={`group-filter ${dash.dashboardGroupFilter}`}
                            >
                                <div className={dash.groupSection}>
                                    <Form.Check
                                        type="radio"
                                        value="client"
                                        inline
                                        label="client"
                                        name="groupfilter"
                                        id="client"
                                        defaultChecked
                                        onClick={(e) => { setCardFilter({ ...CardFilter, type: e.target.value }) }}
                                        className={dash.groupFilterCheck}
                                    />
                                    <Form.Check
                                        type="radio"
                                        value="broker"
                                        inline
                                        label="broker"
                                        name="groupfilter"
                                        id="broker"
                                        onClick={(e) => { setCardFilter({ ...CardFilter, type: e.target.value }) }}
                                        className={dash.groupFilterCheck}
                                    />
                                    <Form.Check
                                        type="radio"
                                        value="company"
                                        inline
                                        label="company"
                                        name="groupfilter"
                                        id="company"
                                        onClick={(e) => { setCardFilter({ ...CardFilter, type: e.target.value }) }}
                                        className={dash.groupFilterCheck}
                                    />
                                    <Form.Check
                                        type="radio"
                                        value=""
                                        inline
                                        label="overall"
                                        name="groupfilter"
                                        id="overall"
                                        onClick={(e) => { setCardFilter({ ...CardFilter, type: e.target.value }) }}
                                        className={dash.groupFilterCheck}
                                    />
                                </div>
                                <div className={dash.exchangeSection}>
                                    <Form.Check
                                        type="radio"
                                        value="nse"
                                        inline
                                        label="nsefo"
                                        name="cardExchangeFilter"
                                        onClick={(e) => { setCardFilter({ ...CardFilter, exchange: e.target.value }) }}
                                        id="nsefo"
                                        className={dash.groupFilterCheck}
                                    />
                                    <Form.Check
                                        type="radio"
                                        value="sgx"
                                        inline
                                        label="sgxfo"
                                        name="cardExchangeFilter"
                                        defaultChecked
                                        onClick={(e) => { setCardFilter({ ...CardFilter, exchange: e.target.value }) }}
                                        id="sgxfo"
                                        className={dash.groupFilterCheck}
                                    />
                                    <Form.Check
                                        type="radio"
                                        value="arb"
                                        inline
                                        label="arb"
                                        name="cardExchangeFilter"
                                        onClick={(e) => { setCardFilter({ ...CardFilter, exchange: e.target.value }) }}
                                        id="arb"
                                        className={dash.groupFilterCheck}
                                    />
                                </div>
                            </div>

                            <div

                                // className={dash.dashboardCard}
                                id="balance">
                                <CreateCard
                                    data={balance}
                                    // rolename={Globalsettings && Globalsettings.username}
                                    // ismask={Globalsettings && Globalsettings.ismask}
                                    handleCreateAlert={handleCreateAlert}
                                    handleStopAlert={handleStopAlert}
                                />
                            </div>
                        </div>
                    )}
                    {Globalpermissions && Globalpermissions.isexposure && (
                        <div
                            className={Globalpermissions && ((Globalpermissions.isportfolio) && (Globalpermissions.isprofitlossgraph)) ? "exposureCardSection " : "full-exposure-card"}
                        >
                            <ExposureCard
                                exposureData={exposureData && exposureData}
                                exposureColumn={exposureColumn && exposureColumn}
                                handleColumnVisiblity={handleColumnVisibility}
                            />
                        </div>
                    )}
                    {Globalpermissions && Globalpermissions.isprofitlossgraph && (
                        <div
                            className={Globalpermissions && ((Globalpermissions.isportfolio) && (Globalpermissions.isexposure)) ? "daily-mtm-graph" : "daily-mtm-graph1"}
                        >
                            <DailyMTMGraph mtm={clientmtmrecords} />
                        </div>
                    )}
                </div>
                <div className={dash.dashboardTradeSection}>
                    {Globalpermissions && Globalpermissions.isexposure && (
                        <div
                            className={Globalpermissions && (Globalpermissions.isprofitlossgraph) ? `${dash.expoAnalysisDonutGraph}` : `${dash.fullposAnalysisGraph}`}
                        >
                            <DonutAnalysisChart data={exposureData && exposureData} />
                        </div>
                    )}
                    {Globalpermissions && Globalpermissions.isprofitlossgraph && (
                        <div
                            className={Globalpermissions && (Globalpermissions.isexposure) ? `${dash.posAnalysisGraph}` : `${dash.fullposAnalysisGraph}`}
                        >
                            <AnalysisChartPos data={datasummary} />
                        </div>
                    )}
                </div>
                <div className={dash.mtmAnalysisGraph}>
                    <AnalysisChartMTM data={datasummary} />
                </div>
            </div>
            <Notification
                notify={NotifyData}
                CloseError={CloseError}
                CloseSuccess={CloseSuccess}
            />
        </div>
    );
};

export default memo(Dashboard);
