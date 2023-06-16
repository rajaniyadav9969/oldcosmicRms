import React, { memo, useEffect, useRef, useState } from "react";
import {  Tab } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";
import Tabs from "@material-ui/core/Tabs";
import { BiLinkExternal } from "react-icons/bi";
import Window from "floating-window-ui";
import {
    FaBalanceScaleLeft,
    FaBookReader,
    FaBuilding,
    FaChartArea,
    FaDatabase,
    FaFileInvoiceDollar,
    FaGripHorizontal,
    FaHandHoldingUsd,
    FaUserAlt,
    FaUserFriends,
} from "react-icons/fa";
import _ from "lodash";
import { shallowEqual, useSelector } from "react-redux";
import { DataTableComp } from "../DataTable";
import { CusColumn } from "../DataTable/CusColumn";
import { GetColumns_API, GetDataSummary_API, GetNetPosition_API, GetPortfolioBalance_API, GetSpreadBook_API } from "../Redux/API";
import { Notification } from "../Notification";
import {  FloatingBtn } from "../DynamicComponent";
import { createDataSummary,  createNetPosition, handleColorChange, Months } from "../Utilities/Utilities";
import Parity from "./Parity/Parity";
import dash from "./Dashboard.module.scss";


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
    const [activeTab, setActiveTab] = useState("netposition");
    const [activeIndex, setactiveIndex] = useState(0);
    const handleChange = (event, activeIndex) => {
        setactiveIndex(activeIndex);
    };

    const [showNetpositionWindow, setShowNetpositionWindow] = useState(false);
    const [showSpreadbookWindow, setShowSpreadbookWindow] = useState(false);
    const [showMarginWindow, setShowMarginWindow] = useState(false);
    const [showMarketwatchWindow, setShowMarketwatchWindow] = useState(false);
    const [showParityWindow, setShowParityWindow] = useState(false);
    const [showOverAllWindow, setShowOverAllWindow] = useState(false);
    const [showClientWindow, setShowClientWindow] = useState(false);
    const [showBrokerWindow, setShowBrokerWindow] = useState(false);
    const [showCompanyWindow, setShowCompanyWindow] = useState(false);

    const [parityData, setparityData] = useState()
    const parityRef = useRef();
    const nseltpRef = useRef();
    const sgxltpRef = useRef();
    const usdRef = useRef();

    const [activeSubTab, setActiveSubTab] = useState("overall");
    const [activeSubIndex, setactiveSubIndex] = useState(0);
    const handleSubChange = (event, activeSubIndex) => {
        setactiveSubIndex(activeSubIndex);
    };

    const [details, setDetails] = useState([]);
    const [netposition, setnetposition] = useState([]);
    const [datasummary, setDataSummary] = useState([]);
    const [spreadbook, setSpreadBook] = useState([]);
    const [margin, setMargin] = useState([]);
    const [marketwatch, setMarketwatch] = useState([]);
    const [overall, setOverAll] = useState([]);
    const [client, setClient] = useState([]);
    const [broker, setBroket] = useState([]);
    const [company, setCompany] = useState([]);

    const [columnsNetPosition, setColumnsNetPosition] = useState([]);
    const [columnsDataSummary, setColumnsDataSummary] = useState([]);
    const [columnsSpreadBook, setColumnsSpreadBook] = useState([]);
    const [columnsMargin, setColumnsMargin] = useState([]);
    const [columnsMarketwatch, setColumnsMarketwatch] = useState([]);
    const [columnsprofitloss, setColumnsProfitLoss] = useState([]);
    const [WebSocketNotification, setWebSocketNotification] = useState([])
    const [columnsOverAll, setColumnsOverAll] = useState([]);
    const [columnsClient, setColumnsClient] = useState([]);
    const [columnsBroker, setColumnsBroker] = useState([]);
    const [columnsCompany, setColumnsCompany] = useState([]);
    const [usdrate, setusdrate] = useState(0)
  

    const [clientmtmrecords, setClientMTMRecords] = useState([]);
    const [columnsToHide, setColumnsToHide] = useState([]);

    // console.log("%%%%%%%%%%%%%%%%%%%%%", balance)



   
    function CreateParityData(data) {
        // console.log(data);
        if (data != undefined) {
            if (data.length > 0) {
                let parityData = []
                data = data.filter(val => { return val.securitytype == 'FUT' && (val.symbol == 'NIFTY' || val.exchange == 'SGXFO') || val.exchange == 'USD' })
                let ExpiryList = [...new Set(data.map(val => { return val.exchange!='USD' && val.expirydate }))]

                for (let k = 0; k < ExpiryList.length; k++) {
                    if (new Date(ExpiryList[k]).getMonth() == new Date().getMonth() && new Date(ExpiryList[k]).getFullYear() == new Date().getFullYear()) {
                        parityData.push({ expirydate: ExpiryList[k], usd: 0, nsebid: 0, nseask: 0, nseltp: 0, sgxbid: 0, sgxask: 0, sgxltp: 0, parity: 0 })
                    }
                    else if (Months[new Date(ExpiryList[k]).getMonth()] == Months[new Date().getMonth() + 1] && new Date(ExpiryList[k]).getFullYear() == new Date().getFullYear()) {
                        parityData.push({ expirydate: ExpiryList[k], usd: 0, nsebid: 0, nseask: 0, nseltp: 0, sgxbid: 0, sgxask: 0, sgxltp: 0, parity: 0 })

                    }
                }
                for (let i = 0; i < data.length; i++) {
                    for (let j = 0; j < parityData.length; j++) {

                        if (parityData[j]['expirydate'] == data[i]['expirydate']) {

                            if (data[i]['exchange'].startsWith('NSEFO')) {
                                parityData[j]['nsebid'] = data[i]['bid']
                                parityData[j]['nseask'] = data[i]['ask']
                                nseltpRef && handleColorChange(data[i]['ltp'], nseltpRef);
                                parityData[j]['nseltp'] = data[i]['ltp']
                            }
                            if (data[i]['exchange'].startsWith('SGXFO')) {
                                parityData[j]['sgxbid'] = data[i]['bid']
                                parityData[j]['sgxask'] = data[i]['ask']
                                sgxltpRef && handleColorChange(data[i]['ltp'], sgxltpRef);
                                parityData[j]['sgxltp'] = data[i]['ltp']
                            }
                            parityRef && handleColorChange(parseFloat(parseFloat((parityData[j]['nsebid'] - parityData[j]['sgxask'] + parityData[j]['nseask'] - parityData[j]['sgxbid']) / 2).toFixed(2)), parityRef);
                            parityData[j]['parity'] = parseFloat(parseFloat((parityData[j]['nsebid'] - parityData[j]['sgxask'] + parityData[j]['nseask'] - parityData[j]['sgxbid']) / 2).toFixed(2))
                        }
                        if (data[i]['exchange'].startsWith('USD')) {
                            usdRef && handleColorChange(data[i]['ltp'], usdRef);
                            parityData[j]['usd'] = data[i]['ltp']
                        }
                    }
                }
                setparityData(parityData[0]);
                document.getElementById("titleTag").innerHTML = " (" + Months[new Date(parityData[0]['expirydate']).getMonth()] + ' ' + parityData[0]['parity'] + ") Cosmic Trades"
            }
        }
    }
    const CloseError = () => {
        setNotifyData((data) => ({ ...data, errorFlag: false }));
    };

    const CloseSuccess = () => {
        setNotifyData((data) => ({ ...data, successFlag: false }));
    };

    useEffect(() => {
        const getColumns = async () => {
            const ps1 = new Promise((resolve, reject) => {
                resolve(GetColumns_API())
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
                        
                        // if (columnsNetPosition.length === 0) {
                        //     setColumnsNetPosition(CusColumn(rs.data[0], ['currency', 'broksharing', 'comsharing', 'multiplier', 'usdrate', 'clientsharing', 'brokmtm', 'compmtm']));
                        // }
                    }
                }
            } else {
                setNotifyData((data) => ({ ...data, loadingFlag: false, errorFlag: true, errorMsg: rs["message"] }));
            }
        }
        async function getSpreadBook() {
            setNotifyData((data) => ({
                ...data,
                loadingFlag: true,
                loadingMsg: "Retriving data...",
            }));
            const ps1 = new Promise((resolve, reject) => {
                resolve(GetSpreadBook_API());
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
                        setSpreadBook(rs.data);
                        if (columnsSpreadBook.length === 0) {
                            setColumnsSpreadBook(CusColumn(rs.data[0]));
                        }
                    }
                }
            } else {
                setNotifyData((data) => ({ ...data, loadingFlag: false, errorFlag: true, errorMsg: rs["message"] }));
            }
        }
        getDataSummary();
        getNetposition();
        getSpreadBook();
        // getPortfolioBalance();

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
                // GlobalSocketData && setnetposition([
                //     {'currency':"Math.random()*12", 'broksharing':"abc", 'comsharing':"xyz", 'multiplier':"xyz", 'usdrate':"Math.random()*23", 'clientsharing':"abc", 'brokmtm':"abc", 'compmtm':"abx"},
                //     {'currency':"Math.random()*12", 'broksharing':"abc", 'comsharing':"xyz", 'multiplier':"xyz", 'usdrate':"Math.random()*23", 'clientsharing':"abc", 'brokmtm':"abc", 'compmtm':"abx"},
                //     {'currency':"Math.random()*12", 'broksharing':"abc", 'comsharing':"xyz", 'multiplier':"xyz", 'usdrate':"Math.random()*23", 'clientsharing':"abc", 'brokmtm':"abc", 'compmtm':"abx"},
                //     {'currency':"Math.random()*12", 'broksharing':"abc", 'comsharing':"xyz", 'multiplier':"xyz", 'usdrate':"Math.random()*23", 'clientsharing':"abc", 'brokmtm':"abc", 'compmtm':"abx"},
                //     {'currency':"Math.random()*12", 'broksharing':"abc", 'comsharing':"xyz", 'multiplier':"xyz", 'usdrate':"Math.random()*23", 'clientsharing':"abc", 'brokmtm':"abc", 'compmtm':"abx"}
                // ])
                setDataSummary(createDataSummary(netposition, datasummary, usdrate))

                if (netposition !== undefined) {
                    if (netposition.length > 1) {
                        if (columnsNetPosition.length < 1) {
                            let colData = CusColumn(netposition[0], ['currency', 'broksharing', 'comsharing', 'multiplier', 'usdrate', 'clientsharing', 'brokmtm', 'compmtm'])
                                // if (columnsToHide.length > 0) {
                                //     let temp = columnsToHide[0].access_columns.split(',')
                                //     for (let i = 0; i < temp.length; i++) {
                                //         for (let j = 0; j < colData.length; j++) {
                                //             if (temp[i] == colData[j]['Header']) {
                                //                 colData[j]['show'] = false;
                                //             }
                                //         }
                                //     }
                                // }
                            setColumnsNetPosition(colData)
                        }
                        
                    }
                }
                
                

                
                

                // console.log(netposition);

                GlobalSocketData.Notification !== undefined && GlobalSocketData.Notification && setWebSocketNotification(GlobalSocketData.Notification);

                // GlobalSocketData.SpreadBook != undefined && GlobalSocketData.SpreadBook && GlobalSocketData.SpreadBook.length > 0 && setSpreadBook(GlobalSocketData.SpreadBook);



                if (GlobalSocketData.SpreadBook) {
                    let data = GlobalSocketData.SpreadBook
                    let tmpSpread = JSON.parse(JSON.stringify(spreadbook))

                    if (data.length > 0) {
                        if (tmpSpread.length === 0) {
                            tmpSpread = data
                        }
                        const mapped=tmpSpread.map((obj)=>{
                            obj.price1=Math.random()*234*Math.random()
                            return obj

                        })
                       console.log("tempspread",mapped);
                        setSpreadBook(mapped);
                    }
                }
            
                GlobalSocketData.MarginSheet !== undefined && GlobalSocketData.MarginSheet && setMargin(GlobalSocketData.MarginSheet);
                GlobalSocketData.Broadcaster !== undefined && GlobalSocketData.Broadcaster && setMarketwatch(GlobalSocketData.Broadcaster);
                GlobalSocketData.Broadcaster !== undefined && GlobalSocketData.Broadcaster && CreateParityData(GlobalSocketData.Broadcaster);

            }
        }

    }, [GlobalSocketData,columnsToHide])

    useEffect(()=>{
        let table_id= columnsToHide && columnsToHide.map(val=>{return  val.table_id})

        let setVisibilityDef=(data=[],column=[],str='')=>{
            if (data) {
                let colData=[...column]
                        if (columnsToHide.length > 0) {
                            let temp = columnsToHide.filter(val=>val.table_id===str)[0].access_columns.split(',')
                            for (let i = 0; i < temp.length; i++) {
                                for (let j = 0; j < colData.length; j++) {
                                    if (temp[i] == colData[j]['Header']) {
                                        colData[j]['show'] = false;
                                    }
                                }
                            }
                        }
                return colData
        }
        }
        if(table_id.includes('netposition')){
            setColumnsNetPosition(setVisibilityDef(netposition,columnsNetPosition,'netposition'))
        } 
        

        if(table_id.includes("overall")){ 
            setColumnsOverAll(setVisibilityDef(datasummary,columnsOverAll,'overall'))
        }

        if(table_id.includes("client")){
            setColumnsClient(setVisibilityDef(datasummary,columnsClient,'client'))
        } 
        
        if(table_id.includes("company")) {
            setColumnsCompany(setVisibilityDef(datasummary,columnsCompany,'company'))
        } 
        

        if(table_id.includes("broker")){
            setColumnsBroker(setVisibilityDef(datasummary,columnsBroker,'broker'))
        } 
        

        if(table_id.includes("spreadbook")){
            setColumnsSpreadBook(setVisibilityDef(spreadbook,columnsSpreadBook,'spreadbook'))
        }
       
       if(table_id.includes('marketwatch')){
        setColumnsMarketwatch(setVisibilityDef(marketwatch,columnsMarketwatch,'marketwatch'))
       } 
       

       if(table_id.includes('margin')) {
        setColumnsMargin(setVisibilityDef(margin,columnsMargin,'margin'))
       }

     },[columnsToHide,activeTab,activeSubTab])
    
    // console.log('columnsToHide',columnsToHide);
    // console.log(overall);

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
    if (margin.length > 1) {
        if (columnsMargin.length < 1) {
            setColumnsMargin(CusColumn(margin[0]));
        }
    }
    if (spreadbook.length > 1) {
        if (columnsSpreadBook.length < 1) {
            setColumnsSpreadBook(CusColumn(spreadbook[0]));
        }
    }
    if (marketwatch.length > 1) {
        if (columnsMarketwatch.length < 1) {
            setColumnsMarketwatch(CusColumn(marketwatch[0]));
        }
    }
    if (overall.length > 1) {
        if (columnsOverAll.length < 1) {
            setColumnsOverAll(CusColumn(overall[0]));
        }
    }
    if (client.length > 1) {
        if (columnsClient.length < 1) {
            setColumnsClient(CusColumn(client[0]));
        }
    }
    if (broker.length > 1) {
        if (columnsBroker.length < 1) {
            setColumnsBroker(CusColumn(broker[0]));
        }
    }
    if (company.length > 1) {
        if (columnsCompany.length < 1) {
            setColumnsCompany(CusColumn(company[0]));
        }
    }

    const handleColumnVisibility = (props) => {
        let newState;
        if (props.id === 'netposition') {
            newState = [...columnsNetPosition];
        }
        if (props.id === 'datasummary') {
            newState = [...columnsDataSummary];
        }
        if (props.id === 'spreadbook') {
            newState = [...columnsSpreadBook];
        }
        if (props.id === 'margin') {
            newState = [...columnsMargin];
        }
        if (props.id === 'marketwatch') {
            newState = [...columnsMarketwatch];
        }
        if (props.id === 'overall') {
            newState = [...columnsOverAll];
        }
        if (props.id === 'client') {
            newState = [...columnsClient];
        }
        if (props.id === 'broker') {
            newState = [...columnsBroker];
        }
        if (props.id === 'company') {
            newState = [...columnsCompany];
        }

        newState.map(column => { 
            return ( (column.Header === props.header) ? column.show = !column.show : null
            // if (column.Header === props.header) {
            //     column.show = !column.show
            // }
            )
        });
        if (props.id === 'netposition') {
            setColumnsNetPosition(newState)
        }
        if (props.id === 'datasummary') {
            setColumnsDataSummary(newState)
        }
        if (props.id === 'spreadbook') {
            setColumnsSpreadBook(newState)
        }
        if (props.id === 'margin') {
            setColumnsMargin(newState)
        }
        if (props.id === 'marketwatch') {
            setColumnsMarketwatch(newState)
        }
        if (props.id === 'overall') {
            setColumnsOverAll(newState)
        }
        if (props.id === 'client') {
            setColumnsClient(newState)
        }
        if (props.id === 'broker') {
            setColumnsBroker(newState)
        }
        if (props.id === 'company') {
            setColumnsCompany(newState)
        }
        localStorage.setItem(props.id, JSON.stringify(newState));
    }

    

    const getTdProps = (state, rowInfo, instance) => {
        if (rowInfo) {
            return {
                style: {
                    color: rowInfo.row.spreadside === 'Buy' ? 'green' : 'red',
                    // color: 'white'
                }
            }
        }
    }

    

    // {console.log( Globalpermissions && ((Globalpermissions.isexposure) && (Globalpermissions.isprofitlossgraph))
    //     ?
    //     dash.dashboardGroupFilter1
    //     :
    //     dash.dashboardGroupFilter)}

    return (
        <div className={`container-fluid ${dash.containerFluid}`}>
            <div className={dash.dashboardSection}>
               
                <div className={dash.dashDetails}>
                    <div className={dash.positionportflio}>
                        <div>
                            <h2 className={dash.settionIcon}>
                                <FloatingBtn TotalTrades={GlobalSocketData && GlobalSocketData.TotalTrades} />
                            </h2>
                        </div>
                        <div className={`dashboard-parity-details ${dash.parityDetails}`}>
                            <span className={dash.parityItem}>Expiry : <span className={dash.parityValue}>{parityData && parityData['expirydate']}</span> </span>
                            <span className={dash.parityItem}>USD : <span className={dash.parityValue} id="number" ref={usdRef}>{parityData && parityData['usd'].toFixed(2)} </span></span>
                            <span className={dash.parityItem}>NSE : <span className={dash.parityValue} id="number" ref={nseltpRef}>{parityData && parityData['nseltp'].toFixed(2)} </span></span>
                            <span className={dash.parityItem}>SGX : <span className={dash.parityValue} id="number" ref={sgxltpRef}>{parityData && parityData['sgxltp'].toFixed(2)} </span></span>
                            <span className={dash.parityItem}>Parity : <span className={dash.parityValue} ref={parityRef}>{parityData && parityData['parity']}</span></span>
                        </div>
                        <VerticalTabs
                            value={activeIndex}
                            className={`dashboard-postion-tab ${dash.positioncard}`}
                            onChange={handleChange}
                        >
                            {/* {Globalpermissions && Globalpermissions.isnetpositioncard
                                &&
                                < MyTab
                                    label={
                                        <h6>
                                            <FaAddressCard />
                                            <span className={dash.iconContent}>Product Card</span>
                                        </h6>
                                    }
                                    className={dash.singlePositionCard}
                                    onClick={() => setActiveTab('productcard')}
                                />
                            } */}
                            {/* <Badge badgeContent={GlobalSocketData.TotalTrades} max={GlobalSocketData.TotalTrades} className="position-count">
                            </Badge> */}
                            {Globalpermissions && Globalpermissions.isnetposition && (
                                <MyTab
                                    label={
                                        <h6>
                                            <span className={dash.tableTabsIcon}>
                                                <BiLinkExternal onClick={() => setShowNetpositionWindow(true)} />
                                            </span>
                                            <span
                                                className={dash.iconContent}
                                                onClick={() => setActiveTab("netposition")}
                                            >
                                                Position
                                            </span>
                                            <span
                                                className={dash.tableTabsMobIcon}
                                                onClick={() => setActiveTab("netposition")}
                                            >
                                                <FaGripHorizontal />
                                            </span>
                                        </h6>
                                    }
                                    className={dash.singlePositionCard}
                                />
                            )}
                            {Globalpermissions && Globalpermissions.isspreadbook && (
                                <MyTab
                                    label={
                                        <h6>
                                            <span className={dash.tableTabsIcon}>
                                                <BiLinkExternal onClick={() => setShowSpreadbookWindow(true)} />
                                            </span>
                                            <span
                                                className={dash.iconContent}
                                                onClick={() => setActiveTab("spreadbook")}
                                            >
                                                SpreadBook
                                            </span>
                                            <span
                                                className={dash.tableTabsMobIcon}
                                                onClick={() => setActiveTab("spreadbook")}
                                            >
                                                <FaBookReader />
                                            </span>
                                        </h6>
                                    }
                                    className={dash.singlePositionCard}
                                />
                            )}
                            {Globalpermissions && Globalpermissions.ismarginsheet && (
                                <MyTab
                                    label={
                                        <h6 >
                                            <span className={dash.tableTabsIcon}>
                                                <BiLinkExternal onClick={() => setShowMarginWindow(true)} />
                                            </span>
                                            <span
                                                className={dash.iconContent}
                                                onClick={() => setActiveTab("margin")}
                                            >
                                                Margin
                                            </span>
                                            <span
                                                className={dash.tableTabsMobIcon}
                                                onClick={() => setActiveTab("margin")}
                                            >
                                                <FaFileInvoiceDollar />
                                            </span>
                                        </h6>
                                    }
                                    className={dash.singlePositionCard}
                                />
                            )}
                            {Globalpermissions && Globalpermissions.ismarketwatch && (
                                <MyTab
                                    label={
                                        <h6>
                                            <span className={dash.tableTabsIcon}>
                                                <BiLinkExternal onClick={() => setShowMarketwatchWindow(true)} />
                                            </span>
                                            <span
                                                className={dash.iconContent}
                                                onClick={() => setActiveTab("marketwatch")}
                                            >
                                                Market Watch
                                            </span>
                                            <span
                                                className={dash.tableTabsMobIcon}
                                                onClick={() => setActiveTab("marketwatch")}
                                            >
                                                <FaChartArea />
                                            </span>
                                        </h6>
                                    }
                                    className={dash.singlePositionCard}
                                />
                            )}
                            {Globalpermissions && Globalpermissions.isparitywatch && (
                                <MyTab
                                    label={
                                        <h6 >
                                            <span className={dash.tableTabsIcon}>
                                                <BiLinkExternal onClick={() => setShowParityWindow(true)} />
                                            </span>
                                            <span
                                                className={dash.iconContent}
                                                onClick={() => setActiveTab("parity")}
                                            >
                                                Parity
                                            </span>
                                            <span
                                                className={dash.tableTabsMobIcon}
                                                onClick={() => setActiveTab("parity")}
                                            >
                                                <FaBalanceScaleLeft />
                                            </span>
                                        </h6>
                                    }
                                    className={dash.singlePositionCard}
                                />
                            )}
                            {Globalpermissions && Globalpermissions.isdatasummary && (
                                <MyTab
                                    label={
                                        <h6>
                                            <span>
                                                <FaDatabase />
                                            </span>
                                            <span
                                                className={dash.iconContent}
                                                onClick={() => setActiveTab("datasummary")}
                                            >
                                                Data Summary
                                            </span>

                                        </h6>
                                    }
                                    className={dash.singlePositionCard}
                                    onClick={() => setActiveTab("datasummary")}
                                />
                            )}
                            {/* <MyTab
                label={
                  <h6>
                    <FaHandHoldingUsd />
                    <span className={dash.iconContent}>Profit Loss</span>
                  </h6>
                }
                className={dash.singlePositionCard}
                onClick={() => setActiveTab("profitloss")}
              /> */}
                        </VerticalTabs>
                    </div>
                    <div 
                    // className={Globalpermissions && ((Globalpermissions.isportfolio) || (Globalpermissions.isprofitlossgraph) || Globalpermissions.isexposure) ? "small-react-table" : "full-react-table"}
                    className="tabular-dash-table"
                    >
                        {/* {activeTab === 'productcard' &&
                            <TabContainer className={dash.detailsgraph}>
                                {details ? <Details details={details} /> : null}
                            </TabContainer>
                        } */}
                        {console.log(netposition)}
                        {(activeTab === "netposition" && (netposition && netposition.length > 0)) && (
                            <TabContainer>
                                <DataTableComp
                                    id="netposition"
                                    userid={columnsToHide.length > 0 && columnsToHide[0]['id']}
                                    data={netposition}
                                    columns={columnsNetPosition}
                                    goupbyfilter={false}
                                    handleColumnVisibility={handleColumnVisibility}

                                />
                            </TabContainer>
                        )}
                        {(activeTab === "spreadbook" && (spreadbook && spreadbook.length > 0)) && (
                            <TabContainer>
                                <DataTableComp
                                    id="spreadbook"
                                    data={spreadbook}
                                    columns={columnsSpreadBook}
                                    goupbyfilter={false}
                                    handleColumnVisibility={handleColumnVisibility}
                                    getTdProps={getTdProps}
                                />
                            </TabContainer>
                        )}
                        {(activeTab === "margin" && (margin && margin.length > 0)) && (
                            <TabContainer>
                                <DataTableComp
                                    id="margin"
                                    data={margin}
                                    columns={columnsMargin}
                                    goupbyfilter={false}
                                    handleColumnVisibility={handleColumnVisibility}
                                />
                            </TabContainer>
                        )}
                        {(activeTab === "marketwatch" && (marketwatch && marketwatch.length > 0)) && (
                            <TabContainer>
                                <DataTableComp
                                    id="marketwatch"
                                    data={marketwatch}
                                    columns={columnsMarketwatch}
                                    goupbyfilter={false}
                                    handleColumnVisibility={handleColumnVisibility}
                                />
                            </TabContainer>
                        )}
                        {activeTab === "parity" && (
                            <TabContainer>
                                <Parity parityScript={Globalpermissions && Globalpermissions.isparityscript}  {...(GlobalSocketData.Broadcaster && GlobalSocketData.Broadcaster !== undefined) && { Broadcaster: GlobalSocketData.Broadcaster }} />
                            </TabContainer>
                        )}
                        {(activeTab === "datasummary") && (
                            <div>
                                <div className={`${dash.positionportflio} ${dash.positionsubtab}`}>
                                    <VerticalTabs
                                        value={activeSubIndex}
                                        className={dash.positioncard}
                                        onChange={handleSubChange}
                                    >
                                        <MyTab
                                            label={
                                                <h6>
                                                    <span className={dash.tableTabsIcon}>
                                                        <BiLinkExternal onClick={() => setShowOverAllWindow(true)} />
                                                    </span>
                                                    <span
                                                        className={dash.iconContent}
                                                        onClick={() => setActiveSubTab("overall")}
                                                    >
                                                        Over All
                                                    </span>
                                                    <span
                                                        className={dash.tableTabsMobIcon}
                                                        onClick={() => setActiveSubTab("overall")}
                                                    >
                                                        <FaUserFriends />
                                                    </span>
                                                </h6>
                                            }
                                            className={dash.singlePositionCard}
                                        />
                                        <MyTab
                                            label={
                                                <h6 >
                                                    <span className={dash.tableTabsIcon}>
                                                        <BiLinkExternal onClick={() => setShowClientWindow(true)} />
                                                    </span>
                                                    <span
                                                        className={dash.iconContent}
                                                        onClick={() => setActiveSubTab("client")}
                                                    >
                                                        Client
                                                    </span>
                                                    <span
                                                        className={dash.tableTabsMobIcon}
                                                        onClick={() => setActiveSubTab("client")}
                                                    >
                                                        <FaUserAlt />
                                                    </span>
                                                </h6>
                                            }
                                            className={dash.singlePositionCard}
                                        />
                                        <MyTab
                                            label={
                                                <h6 >
                                                    <span className={dash.tableTabsIcon}>
                                                        <BiLinkExternal onClick={() => setShowBrokerWindow(true)} />
                                                    </span>
                                                    <span
                                                        className={dash.iconContent}
                                                        onClick={() => setActiveSubTab("broker")}
                                                    >
                                                        Broker
                                                    </span>
                                                    <span
                                                        className={dash.tableTabsMobIcon}
                                                        onClick={() => setActiveSubTab("broker")}
                                                    >
                                                        <FaHandHoldingUsd />
                                                    </span>
                                                </h6>
                                            }
                                            className={dash.singlePositionCard}
                                        />
                                        <MyTab
                                            label={
                                                <h6 >
                                                    <span className={dash.tableTabsIcon}>
                                                        <BiLinkExternal onClick={() => setShowCompanyWindow(true)} />
                                                    </span>
                                                    <span
                                                        className={dash.iconContent}
                                                        onClick={() => setActiveSubTab("company")}
                                                    >
                                                        Company
                                                    </span>
                                                    <span
                                                        className={dash.tableTabsMobIcon}
                                                        onClick={() => setActiveSubTab("company")}
                                                    >
                                                        <FaBuilding />
                                                    </span>
                                                </h6>
                                            }
                                            className={dash.singlePositionCard}
                                        />
                                    </VerticalTabs>

                                </div>
                                {activeSubTab === "overall" && (datasummary && datasummary.length>0) && ( 
                                    <TabContainer>
                                        <DataTableComp
                                            id="overall"
                                            userid={columnsToHide.length > 0 && columnsToHide[0]['id']}
                                            data={datasummary}
                                            columns={columnsOverAll}
                                            netposition={netposition}
                                            goupbyfilter={false}
                                            handleColumnVisibility={handleColumnVisibility}
                                        />
                                    </TabContainer>
                                )}
                                {activeSubTab === "client" && (datasummary && datasummary.length>0) && (
                                    <TabContainer>
                                        <DataTableComp
                                            id="client"
                                            data={datasummary}
                                            columns={columnsClient}
                                            goupbyfilter={false}
                                            handleColumnVisibility={handleColumnVisibility}
                                        />
                                    </TabContainer>
                                )}
                                {activeSubTab === "broker" && (datasummary && datasummary.length>0) && (
                                    <TabContainer>
                                        <DataTableComp
                                            id="broker"
                                            data={datasummary}
                                            columns={columnsBroker}
                                            goupbyfilter={false}
                                            handleColumnVisibility={handleColumnVisibility}
                                        />
                                    </TabContainer>
                                )}
                                {activeSubTab === "company" && (datasummary && datasummary.length>0) && (
                                    <TabContainer>
                                        <DataTableComp
                                            id="company"
                                            data={datasummary}
                                            columns={columnsCompany}
                                            goupbyfilter={false}
                                            handleColumnVisibility={handleColumnVisibility}
                                        />
                                    </TabContainer>
                                )}
                            </div>
                        )}

                        {/* {activeTab === "profitloss" && (
              <TabContainer>
                <DataTableComp
                  id="profitloss"
                  data={profitloss}
                  columns={columnsprofitloss}
                  goupbyfilter={true}
                />
              </TabContainer>
            )} */}
                    </div>
                    <div>
                        {showNetpositionWindow && (netposition && netposition.length > 0) ? (
                            <Window
                                id="react-window"
                                height="auto"
                                width={"26%"}
                                resizable={true}
                                titleBar={{
                                    icon: <FaGripHorizontal />,
                                    title: "NetPosition",
                                    buttons: { minimize: true, maximize: true, close: () => setShowNetpositionWindow(false) },
                                }}
                            >
                                <DataTableComp
                                    id="netposition"
                                    userid={columnsToHide.length > 0 && columnsToHide[0]['id']}
                                    data={netposition}
                                    columns={columnsNetPosition}
                                    goupbyfilter={false}
                                    handleColumnVisibility={handleColumnVisibility}

                                />
                            </Window>
                        ) : null}
                        {showSpreadbookWindow && (spreadbook && spreadbook.length > 0) ? (
                            <Window
                                id="netposition-window"
                                height="auto"
                                width={"26%"}
                                resizable={true}
                                titleBar={{
                                    icon: <FaBookReader />,
                                    title: "SpreadBook",
                                    buttons: { minimize: true, maximize: true, close: () => setShowSpreadbookWindow(false) },
                                }}
                            >
                                <DataTableComp
                                    id="spreadbook"
                                    data={spreadbook}
                                    columns={columnsSpreadBook}
                                    goupbyfilter={false}
                                    handleColumnVisibility={handleColumnVisibility}
                                    getTdProps={getTdProps}
                                />
                            </Window>
                        ) : null}
                        {showMarginWindow && (margin && margin.length > 0) ? (
                            <Window
                                id="margin-window"
                                height="auto"
                                width={"26%"}
                                resizable={true}
                                titleBar={{
                                    icon: <FaFileInvoiceDollar />,
                                    title: "Margin",
                                    buttons: { minimize: true, maximize: true, close: () => setShowMarginWindow(false) },
                                }}
                            >
                                <DataTableComp
                                    id="margin"
                                    data={margin}
                                    columns={columnsMargin}
                                    goupbyfilter={false}
                                    handleColumnVisibility={handleColumnVisibility}
                                />
                            </Window>
                        ) : null}
                        {showMarketwatchWindow && (marketwatch && marketwatch.length > 0) ? (
                            <Window
                                id="marketwatch-window"
                                height="auto"
                                width={"26%"}
                                resizable={true}
                                titleBar={{
                                    icon: <FaChartArea />,
                                    title: "Market Watch",
                                    buttons: { minimize: true, maximize: true, close: () => setShowMarketwatchWindow(false) },
                                }}
                            >
                                <DataTableComp
                                    id="marketwatch"
                                    data={marketwatch}
                                    columns={columnsMarketwatch}
                                    goupbyfilter={false}
                                    handleColumnVisibility={handleColumnVisibility}
                                />
                            </Window>
                        ) : null}
                        {showParityWindow ? (
                            <Window
                                id="parity-window"
                                height="auto"
                                width={"26%"}
                                resizable={true}
                                titleBar={{
                                    icon: <FaBalanceScaleLeft />,
                                    title: "Parity Watch",
                                    buttons: { minimize: true, maximize: true, close: () => setShowParityWindow(false) },
                                }}
                            >
                                <Parity parityScript={Globalpermissions && Globalpermissions.isparityscript}  {...(GlobalSocketData.Broadcaster && GlobalSocketData.Broadcaster !== undefined) && { Broadcaster: GlobalSocketData.Broadcaster }} />
                            </Window>
                        ) : null}
                        {showOverAllWindow ? (
                            <Window
                                id="datasummaryover-window"
                                height="auto"
                                width={"26%"}
                                resizable={true}
                                titleBar={{
                                    icon: <FaUserFriends />,
                                    title: "Over All",
                                    buttons: { minimize: true, maximize: true, close: () => setShowOverAllWindow(false) },
                                }}
                            >
                                <DataTableComp
                                    id="overall"
                                    data={datasummary}
                                    columns={columnsOverAll}
                                    goupbyfilter={false}
                                    handleColumnVisibility={handleColumnVisibility}
                                />
                            </Window>
                        ) : null}
                        {showClientWindow ? (
                            <Window
                                id="client-window"
                                height="auto"
                                width={"26%"}
                                resizable={true}
                                titleBar={{
                                    icon: <FaUserAlt />,
                                    title: "Client",
                                    buttons: { minimize: true, maximize: true, close: () => setShowClientWindow(false) },
                                }}
                            >
                                <DataTableComp
                                    id="client"
                                    data={datasummary}
                                    columns={columnsClient}
                                    goupbyfilter={false}
                                    handleColumnVisibility={handleColumnVisibility}
                                />
                            </Window>
                        ) : null}
                        {showBrokerWindow ? (
                            <Window
                                id="broker-window"
                                height="auto"
                                width={"26%"}
                                resizable={true}
                                titleBar={{
                                    icon: <FaHandHoldingUsd />,
                                    title: "Broker",
                                    buttons: { minimize: true, maximize: true, close: () => setShowBrokerWindow(false) },
                                }}
                            >
                                <DataTableComp
                                    id="broker"
                                    data={datasummary}
                                    columns={columnsBroker}
                                    goupbyfilter={false}
                                    handleColumnVisibility={handleColumnVisibility}
                                />
                            </Window>
                        ) : null}
                        {showCompanyWindow ? (
                            <Window
                                id="company-window"
                                height="auto"
                                width={"26%"}
                                resizable={true}
                                titleBar={{
                                    icon: <FaBuilding />,
                                    title: "Company",
                                    buttons: { minimize: true, maximize: true, close: () => setShowCompanyWindow(false) },
                                }}
                            >
                                <DataTableComp
                                    id="company"
                                    data={datasummary}
                                    columns={columnsCompany}
                                    goupbyfilter={false}
                                    handleColumnVisibility={handleColumnVisibility}
                                />
                            </Window>
                        ) : null}
                    </div>
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
const VerticalTabs = withStyles((theme) => ({
    flexContainer: {
        flexDirection: "row",
    },
    indicator: {
        display: "none",
    },
}))(Tabs);

const MyTab = withStyles((theme) => ({
    selected: {
        color: "tomato",
        borderBottom: "2px solid tomato",
    },
}))(Tab);

function TabContainer(props) {
    return (
        <Typography
            component="div"
        // className={`custom-table ${dash.customdatatable}`}
        >
            {props.children}
        </Typography>
    );
}
export default memo(Dashboard);
