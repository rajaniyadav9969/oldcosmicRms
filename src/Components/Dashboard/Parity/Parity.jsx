import React, { memo, useEffect } from 'react'
import { useState } from 'react';
import Autocomplete from 'react-autocomplete';
import { MdDelete } from 'react-icons/md';
import { FaSave } from 'react-icons/fa';
import { GiCancel } from 'react-icons/gi';
import { CreateParity_API, DeleteParityWatch_API, GetParityWatch_API } from '../../Redux/API'
import { Notification } from '../../Notification';
import parityStyle from './Parity.module.scss';
import { useSelector } from 'react-redux';

const Parity = (props) => {
    const state = useSelector(state => state)
    let contracts = useSelector(state => state.contracts);
    // console.log(contracts);
    const broadcaster=props.Broadcaster

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

    if (props.contracts != undefined) {
        if (props.contracts.length > 1) {
            contracts = props.contracts
        }
    }
    contracts.splice(contracts.findIndex(a => a.exchange == 'USD'), 1)

    const CloseConfirm = () => {
        setNotifyData((data) => ({ ...data, confirmFlag: false }))
    }
    const CloseError = () => {
        setNotifyData((data) => ({ ...data, errorFlag: false }));
        // navigate("/login", { replace: true })
    };

    const CloseSuccess = () => {
        setNotifyData((data) => ({ ...data, successFlag: false }));
    };
    
    const [data, setData] = useState([])

    const [dropdownData, setDropDownData] = useState({
        exchange: contracts && [...new Set(contracts.map(val => { return val.exchange }))].map(el => { return { label: el } }),
        securitytype: [],
        symbol: [],
        expirydate: [],
        opttype: [],
        strikeprice: [],
        bid: [],
        ask: []
    })

    const [dropdownData2, setDropDownData2] = useState({
        exchange: contracts && [...new Set(contracts.map(val => { return val.exchange }))].map(el => { return { label: el } }),
        securitytype: [],
        symbol: [],
        expirydate: [],
        opttype: [],
        strikeprice: [],
        bid: [],
        ask: []
    })
    const [dropdownData3, setDropDownData3] = useState({
        exchange: contracts && [...new Set(contracts.map(val => { return val.exchange }))].map(el => { return { label: el } }),
        securitytype: [],
        symbol: [],
        expirydate: [],
        opttype: [],
        strikeprice: [],
        bid: [],
        ask: []
    })

    const [index, setIndex] = useState(0);

    const handleSubmit = async (id) => {
        console.log('data',data,index);
        setNotifyData((data) => ({ ...data, loadingFlag: true, loadingMsg: "Save Parity..." }))
        const ps1 = new Promise((resolve, reject) => {
            resolve(CreateParity_API(data[index]))           
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
            let responseData;
            if(rs['data'].exchange3 === null){
                responseData= { 
                    id: rs['data'].id,
                    leg1: rs['data'].leg1,
                    exchange1: rs['data'].exchange1,
                    symbol1: rs['data'].symbol1,
                    scripcode1: rs['data'].scripcode1,
                    securitytype1: rs['data'].securitytype1,
                    expirydate1: rs['data'].expirydate1,
                    opttype1: rs['data'].opttype1,
                    strikeprice1: rs['data'].strikeprice1.toString(),
                    leg2: rs['data'].leg2,
                    exchange2: rs['data'].exchange2,
                    symbol2: rs['data'].symbol2,
                    scripcode2: rs['data'].scripcode2,
                    securitytype2: rs['data'].securitytype2,
                    expirydate2: rs['data'].expirydate2,
                    opttype2: rs['data'].opttype2,
                    strikeprice2: rs['data'].strikeprice2.toString(),
                }
            }
            if(rs['data'].exchange3 !== null){
                responseData= { 
                    id: rs['data'].id,
                    leg1: rs['data'].leg1,
                    exchange1: rs['data'].exchange1,
                    symbol1: rs['data'].symbol1,
                    scripcode1: rs['data'].scripcode1,
                    securitytype1: rs['data'].securitytype1,
                    expirydate1: rs['data'].expirydate1,
                    opttype1: rs['data'].opttype1,
                    strikeprice1: rs['data'].strikeprice1.toString(),
                    leg2: rs['data'].leg2,
                    exchange2: rs['data'].exchange2,
                    symbol2: rs['data'].symbol2,
                    scripcode2: rs['data'].scripcode2,
                    securitytype2: rs['data'].securitytype2,
                    expirydate2: rs['data'].expirydate2,
                    opttype2: rs['data'].opttype2,
                    strikeprice2: rs['data'].strikeprice2.toString(),
                    leg3:rs['data'].leg3,
                    exchange3:rs['data'].exchange3,
                    scripcode3: rs['data'].scripcode3,
                    securitytype3:rs['data'].securitytype3,
                    symbol3:rs['data'].symbol3,
                    expirydate3:rs['data'].expirydate3,
                    opttype3:rs['data'].opttype3,
                    strikeprice3:rs['data'].strikeprice3.toString()

                }

            }
            data.splice(data.length - 1, 1, responseData)
            setData(data)
        } else {
            setNotifyData((data) => ({ ...data, loadingFlag: false, confirmFlag: false, errorFlag: true, errorMsg: rs['message'], activesession: rs['session'] }))
        }

    };

    useEffect(() => {
        async function getParityData() {
            setNotifyData((data) => ({
                ...data,
                loadingFlag: true,
                loadingMsg: "Retriving data...",
            }));
            const ps1 = new Promise((resolve, reject) => {
                resolve(GetParityWatch_API());
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
                        console.log(rs.data);
                        setData(rs.data.map(val=>{
                            if(val.exchange3 === null){
                                return { 
                                    id: val.id,
                                    leg1: val.leg1,
                                    exchange1: val.exchange1,
                                    symbol1: val.symbol1,
                                    scripcode1: val.scripcode1,
                                    securitytype1: val.securitytype1,
                                    expirydate1: val.expirydate1,
                                    opttype1: val.opttype1,
                                    strikeprice1: val.strikeprice1.toString(),
                                    leg2: val.leg2,
                                    exchange2: val.exchange2,
                                    symbol2: val.symbol2,
                                    scripcode2: val.scripcode2,
                                    securitytype2: val.securitytype2,
                                    expirydate2: val.expirydate2,
                                    opttype2: val.opttype2,
                                    strikeprice2: val.strikeprice2.toString(),
                                }
                            }
                            if(val.exchange3 !== null){
                                return { 
                                    id: val.id,
                                    leg1: val.leg1,
                                    exchange1: val.exchange1,
                                    symbol1: val.symbol1,
                                    scripcode1: val.scripcode1,
                                    securitytype1: val.securitytype1,
                                    expirydate1: val.expirydate1,
                                    opttype1: val.opttype1,
                                    strikeprice1: val.strikeprice1.toString(),
                                    leg2: val.leg2,
                                    exchange2: val.exchange2,
                                    symbol2: val.symbol2,
                                    scripcode2: val.scripcode2,
                                    securitytype2: val.securitytype2,
                                    expirydate2: val.expirydate2,
                                    opttype2: val.opttype2,
                                    strikeprice2: val.strikeprice2.toString(),
                                    leg3:val.leg3,
                                    exchange3:val.exchange3,
                                    scripcode3: val.scripcode3,
                                    securitytype3:val.securitytype3,
                                    symbol3:val.symbol3,
                                    expirydate3:val.expirydate3,
                                    opttype3:val.opttype3,
                                    strikeprice3:val.strikeprice3.toString()

                                }

                            } 
                        }))
                        // setData(rs.data.map(val => {
                        //     val.buy = 0
                        //     val.sell = 0

                        //     return val
                        // }));
                    }
                }
            } else {
                setNotifyData((data) => ({ ...data, loadingFlag: false, errorFlag: true, errorMsg: rs["message"] }));
            }
        }
        getParityData()

    }, [])

    useEffect(() => {
        if (data[index]) {
            if (data[index].exchange1.length > 0) {
                setDropDownData({
                    ...dropdownData,
                    securitytype: [...new Set(contracts.filter(val => { return (val.exchange === data[index].exchange1) }).map(el => { return el.securitytype }))].map(mp => { return { label: mp } })
                })
            }
            if (data[index].securitytype1.length > 0) {
                setDropDownData({
                    ...dropdownData,
                    symbol: [...new Set(contracts.filter(val => { return (val.exchange === data[index].exchange1) && (val.securitytype === data[index].securitytype1) }).map(el => { return el.symbol }))].map(mp => { return { label: mp } })
                })
            }
            if (data[index].symbol1.length > 0) {
                setDropDownData({
                    ...dropdownData,
                    expirydate: [...new Set(contracts.filter(val => { return (val.exchange === data[index].exchange1) && (val.securitytype === data[index].securitytype1) && (val.symbol === data[index].symbol1) }).map(el => { return el.expirydate }))].map(mp => { return { label: mp } })
                })
            }
            if (data[index].expirydate1.length > 0) {
                setDropDownData({
                    ...dropdownData,
                    opttype: [...new Set(contracts.filter(val => { return (val.exchange === data[index].exchange1) && (val.securitytype === data[index].securitytype1) && (val.symbol === data[index].symbol1) && (val.expirydate === data[index].expirydate1) }).map(el => { return el.opttype }))].map(mp => { return { label: mp } })
                })
            }
            if (data[index].opttype1.length > 0) {
                setDropDownData({
                    ...dropdownData,
                    strikeprice: [...new Set(contracts.filter(val => { return (val.exchange === data[index].exchange1) && (val.securitytype === data[index].securitytype1) && (val.symbol === data[index].symbol1) && (val.expirydate === data[index].expirydate1) && (val.opttype === data[index].opttype1) }).map(el => { return el.strikeprice }))].map(mp => { return { label: mp.toString() } })
                })
            }

            // //------------------------------------------------------dropdown for leg2 inputs---------------------------------------------------
            if (data[index].exchange2.length > 0) {
                setDropDownData2({
                    ...dropdownData2,
                    securitytype: [...new Set(contracts.filter(val => { return (val.exchange === data[index].exchange2) }).map(el => { return el.securitytype }))].map(mp => { return { label: mp } })
                })
            }
            if (data[index].securitytype2.length > 0) {
                setDropDownData2({
                    ...dropdownData2,
                    symbol: [...new Set(contracts.filter(val => { return (val.exchange === data[index].exchange2) && (val.securitytype === data[index].securitytype2) }).map(el => { return el.symbol }))].map(mp => { return { label: mp } })
                })
            }
            if (data[index].symbol2.length > 0) {
                setDropDownData2({
                    ...dropdownData2,
                    expirydate: [...new Set(contracts.filter(val => { return (val.exchange === data[index].exchange2) && (val.securitytype === data[index].securitytype2) && (val.symbol === data[index].symbol2) }).map(el => { return el.expirydate }))].map(mp => { return { label: mp } })
                })
            }
            if (data[index].expirydate2.length > 0) {
                setDropDownData2({
                    ...dropdownData2,
                    opttype: [...new Set(contracts.filter(val => { return (val.exchange === data[index].exchange2) && (val.securitytype === data[index].securitytype2) && (val.symbol === data[index].symbol2) && (val.expirydate === data[index].expirydate2) }).map(el => { return el.opttype }))].map(mp => { return { label: mp } })
                })
            }
            if (data[index].opttype2.length > 0) {
                setDropDownData2({
                    ...dropdownData2,
                    strikeprice: [...new Set(contracts.filter(val => { return (val.exchange === data[index].exchange2) && (val.securitytype === data[index].securitytype2) && (val.symbol === data[index].symbol2) && (val.expirydate === data[index].expirydate2) && (val.opttype === data[index].opttype2) }).map(el => { return el.strikeprice }))].map(mp => { return { label: mp.toString() } })
                })
            }
            //------------------------------leg 3 inputs-----------------------------------------------
            if (data[index].leg3) {
                if (data[index].exchange3.length > 0) {
                    setDropDownData3({
                        ...dropdownData3,
                        securitytype: [...new Set(contracts.filter(val => { return (val.exchange === data[index].exchange3) }).map(el => { return el.securitytype }))].map(mp => { return { label: mp } })
                    })
                }
                if (data[index].securitytype3.length > 0) {
                    setDropDownData3({
                        ...dropdownData3,
                        symbol: [...new Set(contracts.filter(val => { return (val.exchange === data[index].exchange3) && (val.securitytype === data[index].securitytype3) }).map(el => { return el.symbol }))].map(mp => { return { label: mp } })
                    })
                }
                if (data[index].symbol3.length > 0) {
                    setDropDownData3({
                        ...dropdownData3,
                        expirydate: [...new Set(contracts.filter(val => { return (val.exchange === data[index].exchange3) && (val.securitytype === data[index].securitytype3) && (val.symbol === data[index].symbol3) }).map(el => { return el.expirydate }))].map(mp => { return { label: mp } })
                    })
                }
                if (data[index].expirydate3.length > 0) {
                    setDropDownData3({
                        ...dropdownData3,
                        opttype: [...new Set(contracts.filter(val => { return (val.exchange === data[index].exchange3) && (val.securitytype === data[index].securitytype3) && (val.symbol === data[index].symbol3) && (val.expirydate === data[index].expirydate3) }).map(el => { return el.opttype }))].map(mp => { return { label: mp } })
                    })
                }
                if (data[index].opttype3.length > 0) {
                    setDropDownData3({
                        ...dropdownData3,
                        strikeprice: [...new Set(contracts.filter(val => { return (val.exchange === data[index].exchange3) && (val.securitytype === data[index].securitytype3) && (val.symbol === data[index].symbol3) && (val.expirydate === data[index].expirydate3) && (val.opttype === data[index].opttype3) }).map(el => { return el.strikeprice }))].map(mp => { return { label: mp.toString() } })
                    })
                }
            }
        }
    }, [data])

    const handleAddParity = (leg) => {
        console.log(leg);
        // let idArr = [];
        // data.map(val => idArr.push(val.id))
        // let id = data.length == 0 ? 1 : Math.max(...idArr) + 1;

        if (leg === '2Leg') {
            const item = {
                id: '', leg1: 'leg1', exchange1: '', securitytype1: '', symbol1: '', expirydate1: '', strikeprice1: '', opttype1: '', bid1: '', ask1: '', buy: '', sell: '', scripcode1: '', cancel: true,
                leg2: 'leg2', exchange2: '', securitytype2: '', symbol2: '', expirydate2: '', opttype2: '', strikeprice2: '', bid2: '', ask2: '', scripcode2: '',
            }
            setData([
                ...data,
                item
            ])
        }

        if (leg === '3Leg') {
            const item = {
                id: '', leg1: 'leg1', exchange1: '', securitytype1: '', symbol1: '', expirydate1: '', strikeprice1: '', opttype1: '', bid1: '', ask1: '', buy: '', sell: '', scripcode1: '', cancel: true,
                leg2: 'leg2', exchange2: '', securitytype2: '', symbol2: '', expirydate2: '', opttype2: '', strikeprice2: '', bid2: '', ask2: '', scripcode2: '',
                leg3: 'leg3', exchange3: '', securitytype3: '', symbol3: '', expirydate3: '', opttype3: '', strikeprice3: '', bid3: '', ask3: '', scripcode3: '',
            }
            setData([
                ...data,
                item
            ])
        }
    }

    const handleDeleteparity = async (id) => {

        setNotifyData((data) => ({ ...data, loadingFlag: true, loadingMsg: "Deleting..." }))
        const ps1 = new Promise((resolve, reject) => {
            resolve(DeleteParityWatch_API({ id: id }))
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
            setData(data.filter(val => { return val.id != id }))
            setNotifyData((data) => ({ ...data, loadingFlag: false, confirmFlag: false, successFlag: true, successMsg: "Deleted Successful" }))
        } else {
            setNotifyData((data) => ({ ...data, loadingFlag: false, confirmFlag: false, errorFlag: true, errorMsg: rs['message'] }))
            // navigate("/")
        }

    }

    useEffect(() => {
        function calculateParity() {
            if (data != undefined) {
                if (data.length > 0) {
                    for (let i = 0; i < broadcaster.length; i++) {
                        for (let j = 0; j < data.length; j++) {

                            if (data[j]['scripcode1'] == broadcaster[i]['scripcode']) {
                                data[j]['bid1'] = broadcaster[i]['bid']
                                data[j]['ask1'] = broadcaster[i]['ask']
                            }
                            if (data[j]['scripcode2'] == broadcaster[i]['scripcode']) {
                                data[j]['bid2'] = broadcaster[i]['bid']
                                data[j]['ask2'] = broadcaster[i]['ask']
                            }
                            if (data[j]['scripcode3'] == broadcaster[i]['scripcode']) {
                                data[j]['bid3'] = broadcaster[i]['bid']
                                data[j]['ask3'] = broadcaster[i]['ask']
                            }

                            if (data[j].leg3 == null) {
                                if (data[j].bid2 && data[j].ask1 && data[j].bid1 && data[j].ask2) {
                                    data[j].buy = data[j].bid2 - data[j].ask1
                                    data[j].sell =  data[j].ask2 - data[j].bid1
                                }
                            } else {
                                if (data[j].bid3 && data[j].ask2 && data[j].strikeprice3 && data[j].bid2 && data[j].ask3 && data[j].strikeprice3) {
                                    let optionBuyParity = ((data[j].bid2 - data[j].ask3) + (+(data[j].strikeprice3)));
                                    let optionSellParity = ((data[j].ask2 - data[j].bid3) + (+(data[j].strikeprice3)));
                                    data[j].buy = optionBuyParity - data[j].ask1
                                    data[j].sell = optionSellParity - data[j].bid1
                                }
                            }


                        }
                    }
                }
            }
            setData(data)
        }
        calculateParity()
    }, [broadcaster])

    return (
        <div className={`parity-section ${parityStyle.paritySection}`}>
            {props.parityScript &&
                <div className={parityStyle.addParityBtn}>

                    {/* <button className={parityStyle.addBtn} onClick={handleAddParity}> New Script </button> */}
                    <select defaultValue={''} className={parityStyle.addBtn} value onChange={(e) => handleAddParity(e.target.value)}>
                        <option value=''>Add Parity</option>
                        <option value='2Leg' >2 Leg</option>
                        <option value='3Leg' >3 Leg</option>
                    </select>
                </div>
            }
            <div>
                <h4 className={parityStyle.parityHeading}>Parity Watch</h4>
            </div>
            <div className={parityStyle.parityDataSection}>
                <div className={`parity-data-lable ${parityStyle.parityDataLable}`}>
                    <div className={parityStyle.parityHead}>
                        <span>ID</span>
                    </div>
                    <div className={parityStyle.parityHead}>
                        <span>LEG</span>
                    </div>
                    <div className={parityStyle.parityHead}>
                        <span>EXCHANGE</span>
                    </div>
                    <div className={parityStyle.parityHead}>
                        <span>SECURITYTYPE</span>
                    </div>
                    <div className={parityStyle.parityHead}>
                        <span>SYMBOL</span>
                    </div>
                    <div className={parityStyle.parityHead}>
                        <span>EXPIRYDATE</span>
                    </div>
                    <div className={parityStyle.parityHead}>
                        <span>OPTTYPE</span>
                    </div>
                    <div className={parityStyle.parityHead}>
                        <span>STRIKEPRICE</span>
                    </div>
                    <div className={parityStyle.parityHead}>
                        <span>BID</span>
                    </div>
                    <div className={parityStyle.parityHead}>
                        <span>ASK</span>
                    </div>
                    <div className={parityStyle.parityHead}>
                        <span>BUY PARITY</span>
                    </div>
                    <div className={parityStyle.parityHead}>
                        <span>SELL PARITY</span>
                    </div>
                    {props.parityScript &&
                        <div className={parityStyle.parityHead}>
                            <span>ACTION</span>
                        </div>
                    }
                </div>
                <div className={parityStyle.parityBody}>
                    {data && data.map((val, i) => {
                        return <div key={val.id} className={`parity-value ${parityStyle.parityValue}`}>
                            <div className={parityStyle.parityCard}>
                                <div className={`${parityStyle.paritySingleData} ${parityStyle.parityValueData}`}>
                                    <span>{val.id}</span>
                                </div>

                                <div className={parityStyle.parityValueData}>
                                    <span>{val.leg1}</span>
                                </div>
                                <div
                                    className={`parity-value-data ${parityStyle.parityValueData}`}
                                >
                                    <Autocomplete
                                        items={dropdownData.exchange && dropdownData.exchange}
                                        getItemValue={(item) => item.label}
                                        renderItem={(item, isHighlighted) => (
                                            <h6
                                                style={{
                                                    background: isHighlighted ? "lightgray" : "white",
                                                    // position: "relative",
                                                    // zIndex: "99999999",
                                                }}
                                                className={parityStyle.parityInputValue}
                                            >
                                                {item.label}
                                            </h6>
                                        )}
                                        value={val.exchange1}
                                        shouldItemRender={(item, value) =>
                                            item.label.toLowerCase().indexOf(value.toLowerCase()) > -1
                                            // console.log(item,value)
                                        }
                                        onChange={(e) => {
                                            const rows = [...data]
                                            rows[i] = {
                                                ...rows[i],
                                                exchange1: e.target.value
                                            };
                                            setData(rows)
                                        }}
                                        onSelect={(selectedValue) => {
                                            const rows = [...data]
                                            rows[i] = {
                                                ...rows[i],
                                                exchange1: selectedValue
                                            };
                                            setData(rows)
                                            setIndex(i)
                                        }}
                                    />
                                </div>
                                <div
                                    className={`parity-value-data ${parityStyle.parityValueData}`}
                                >
                                    <Autocomplete
                                        items={dropdownData.securitytype}
                                        getItemValue={(item) => item.label}
                                        renderItem={(item, isHighlighted) => (
                                            <h6
                                                style={{
                                                    background: isHighlighted ? "lightgray" : "white",
                                                    // position: "relative",
                                                    // zIndex: "99999999",
                                                }}
                                                className={parityStyle.parityInputValue}
                                            >
                                                {item.label}
                                            </h6>
                                        )}
                                        value={val.securitytype1}
                                        shouldItemRender={(item, value) =>
                                            item.label.toLowerCase().indexOf(value.toLowerCase()) > -1
                                            // console.log(item,value)
                                        }
                                        onChange={(e) => {
                                            const rows = [...data]
                                            rows[i] = {
                                                ...rows[i],
                                                securitytype1: e.target.value
                                            };
                                            setData(rows)
                                        }}
                                        onSelect={(selectedValue) => {
                                            const rows = [...data]
                                            rows[i] = {
                                                ...rows[i],
                                                securitytype1: selectedValue
                                            };
                                            setData(rows)
                                        }}
                                    />
                                </div>
                                <div
                                    className={`parity-value-data ${parityStyle.parityValueData}`}
                                >
                                    <Autocomplete
                                        items={dropdownData.symbol}
                                        getItemValue={(item) => item.label}
                                        renderItem={(item, isHighlighted) => (
                                            <h6
                                                style={{
                                                    background: isHighlighted ? "lightgray" : "white",
                                                    // position: "relative",
                                                    // zIndex: "99999999",
                                                }}
                                                className={parityStyle.parityInputValue}
                                            >
                                                {item.label}
                                            </h6>
                                        )}
                                        value={val.symbol1}
                                        shouldItemRender={(item, value) =>
                                            item.label.toLowerCase().indexOf(value.toLowerCase()) > -1
                                            // console.log(item,value)
                                        }
                                        onChange={(e) => {

                                            const rows = [...data]
                                            rows[i] = {
                                                ...rows[i],
                                                symbol1: e.target.value
                                            };
                                            setData(rows)
                                        }}
                                        onSelect={(selectedValue) => {

                                            const rows = [...data]
                                            rows[i] = {
                                                ...rows[i],
                                                symbol1: selectedValue
                                            };
                                            setData(rows)
                                        }}
                                    />
                                </div>
                                <div
                                    className={`parity-value-data ${parityStyle.parityValueData}`}
                                >
                                    <Autocomplete
                                        items={dropdownData.expirydate}
                                        getItemValue={(item) => item.label}
                                        renderItem={(item, isHighlighted) => (
                                            <h6
                                                style={{
                                                    background: isHighlighted ? "lightgray" : "white",
                                                    // position: "relative",
                                                    // zIndex: "99999999",
                                                }}
                                                className={parityStyle.parityInputValue}
                                            >
                                                {item.label}
                                            </h6>
                                        )}
                                        value={val.expirydate1}
                                        shouldItemRender={(item, value) =>
                                            item.label.toLowerCase().indexOf(value.toLowerCase()) > -1
                                            // console.log(item,value)
                                        }
                                        onChange={(e) => {
                                            const rows = [...data]
                                            rows[i] = {
                                                ...rows[i],
                                                expirydate1: e.target.value
                                            };
                                            setData(rows)
                                        }}
                                        onSelect={(selectedValue) => {
                                            const rows = [...data]
                                            rows[i] = {
                                                ...rows[i],
                                                expirydate1: selectedValue
                                            };
                                            setData(rows)
                                        }}
                                    />
                                </div>
                                <div
                                    className={`parity-value-data ${parityStyle.parityValueData}`}
                                >
                                    <Autocomplete
                                        items={dropdownData.opttype}
                                        getItemValue={(item) => item.label}
                                        renderItem={(item, isHighlighted) => (
                                            <h6
                                                style={{
                                                    background: isHighlighted ? "lightgray" : "white",
                                                    // position: "relative",
                                                    // zIndex: "99999999",
                                                }}
                                                className={parityStyle.parityInputValue}
                                            >
                                                {item.label}
                                            </h6>
                                        )}
                                        value={val.opttype1}
                                        shouldItemRender={(item, value) =>
                                            item.label.toLowerCase().indexOf(value.toLowerCase()) > -1
                                            // console.log(item,value)
                                        }
                                        onChange={(e) => {
                                            const rows = [...data]
                                            rows[i] = {
                                                ...rows[i],
                                                opttype1: e.target.value,
                                            };
                                            setData(rows)
                                        }}
                                        onSelect={(selectedValue) => {
                                            const rows = [...data]
                                            rows[i] = {
                                                ...rows[i],
                                                opttype1: selectedValue
                                            };
                                            setData(rows)
                                        }}
                                    />
                                </div>
                                <div
                                    className={`parity-value-data ${parityStyle.parityValueData}`}

                                >
                                    <Autocomplete
                                        items={dropdownData.strikeprice}
                                        getItemValue={(item) => item.label}
                                        renderItem={(item, isHighlighted) => (
                                            <h6
                                                style={{
                                                    background: isHighlighted ? "lightgray" : "white",
                                                    // position: "relative",
                                                    // zIndex: "99999999",
                                                }}
                                                className={parityStyle.parityInputValue}
                                            >
                                                {item.label}
                                            </h6>
                                        )}
                                        value={val.strikeprice1}
                                        shouldItemRender={(item, value) =>
                                            item.label.toLowerCase().indexOf(value.toString().toLowerCase()) > -1
                                            // console.log(item,value)
                                        }
                                        onChange={(e) => {
                                            let filteredRow = contracts.filter(val => data[index].exchange1 === val.exchange && data[index].securitytype1 === val.securitytype && data[index].symbol1 === val.symbol && data[index].expirydate1 === val.expirydate && data[index].opttype1 === val.opttype && e.target.value == val.strikeprice)

                                            const rows = [...data]
                                            rows[i] = {
                                                ...rows[i],
                                                strikeprice1: e.target.value,
                                                scripcode1: filteredRow.length > 0 && filteredRow[0]['scripcode']

                                            };

                                            setData(rows)
                                        }}
                                        onSelect={(selectedValue) => {
                                            let filteredRow = contracts.filter(val => data[index].exchange1 === val.exchange && data[index].securitytype1 === val.securitytype && data[index].symbol1 === val.symbol && data[index].expirydate1 === val.expirydate && data[index].opttype1 === val.opttype && selectedValue == val.strikeprice)
                                            console.log(filteredRow, "filter data**********");
                                            const rows = [...data]
                                            rows[i] = {
                                                ...rows[i],
                                                strikeprice1: selectedValue,
                                                scripcode1: filteredRow[0]['scripcode']

                                            };
                                            // console.log("000", rows);
                                            setData(rows)
                                        }}
                                    />
                                </div>
                                <div className={parityStyle.parityValueData}>
                                    <span>{val.bid1}</span>
                                </div>
                                <div className={parityStyle.parityValueData}>
                                    <span>{val.ask1}</span>
                                </div>
                                <div className={`parity-buy-sell ${parityStyle.parityValueData} ${parityStyle.parityBuySell}`}>
                                    <span>{val.buy && val.buy.toFixed(2)}</span>
                                </div>
                                <div className={`parity-buy-sell ${parityStyle.parityValueData} ${parityStyle.parityBuySell}`}>
                                    <span>{val.sell && val.sell.toFixed(2)}</span>
                                </div>
                                {props.parityScript &&
                                    <div className={`${parityStyle.parityDelete} ${parityStyle.parityValueData}`}>
                                        {val.cancel
                                            ?
                                            <span
                                                className={parityStyle.deleteBtn}
                                            >
                                                <GiCancel onClick={() => data.splice(data.findIndex(cancel => cancel.id === val.id), 1)} />
                                            </span>
                                            :
                                            <span
                                                className={parityStyle.deleteBtn}
                                                onClick={(e) => setNotifyData((data) => ({
                                                    ...data,
                                                    confirmFlag: true,
                                                    confirmMsg: "Are you sure you want to delate parity...",
                                                    confirmAction: (e) => handleDeleteparity(val.id)
                                                }))}
                                            >
                                                <MdDelete />
                                            </span>
                                        }
                                        <span className={parityStyle.paritySave}>
                                            <FaSave onClick={(val) => handleSubmit(val.id)} />
                                        </span>
                                    </div>
                                }
                            </div>
                            <div className={parityStyle.parityCard}>
                                <div className={parityStyle.parityValueData}>
                                    <span></span>
                                </div>
                                <div className={parityStyle.parityValueData}>
                                    <span>{val.leg2}</span>
                                </div>
                                <div className={`parity-value-data ${parityStyle.parityValueData}`}>
                                    <Autocomplete
                                        items={dropdownData2.exchange && dropdownData2.exchange}
                                        getItemValue={(item) => item.label}
                                        renderItem={(item, isHighlighted) => (
                                            <h6
                                                style={{
                                                    background: isHighlighted ? "lightgray" : "white",
                                                    // position: "relative",
                                                    // zIndex: "99999999",
                                                }}
                                                className={parityStyle.parityInputValue}
                                            >
                                                {item.label}
                                            </h6>
                                        )}
                                        value={val.exchange2}
                                        shouldItemRender={(item, value) =>
                                            item.label.toLowerCase().indexOf(value.toLowerCase()) > -1
                                            // console.log(item,value)
                                        }
                                        onChange={(e) => {
                                            const rows = [...data]
                                            rows[i] = {
                                                ...rows[i],
                                                exchange2: e.target.value
                                            };
                                            setData(rows)
                                        }}
                                        onSelect={(selectedValue) => {
                                            const rows = [...data]
                                            rows[i] = {
                                                ...rows[i],
                                                exchange2: selectedValue
                                            };
                                            setData(rows)
                                            setIndex(i)
                                        }}
                                    />
                                </div>
                                <div className={`parity-value-data ${parityStyle.parityValueData}`}>
                                    <Autocomplete
                                        items={dropdownData2.securitytype}
                                        getItemValue={(item) => item.label}
                                        renderItem={(item, isHighlighted) => (
                                            <h6
                                                style={{
                                                    background: isHighlighted ? "lightgray" : "white",
                                                    // position: "relative",
                                                    // zIndex: "99999999",
                                                }}
                                                className={parityStyle.parityInputValue}
                                            >
                                                {item.label}
                                            </h6>
                                        )}
                                        value={val.securitytype2}
                                        shouldItemRender={(item, value) =>
                                            item.label.toLowerCase().indexOf(value.toLowerCase()) > -1
                                            // console.log(item,value)
                                        }
                                        onChange={(e) => {
                                            const rows = [...data]
                                            rows[i] = {
                                                ...rows[i],
                                                securitytype2: e.target.value
                                            };
                                            setData(rows)
                                        }}
                                        onSelect={(selectedValue) => {
                                            const rows = [...data]
                                            rows[i] = {
                                                ...rows[i],
                                                securitytype2: selectedValue
                                            };
                                            setData(rows)
                                        }}
                                    />
                                </div>
                                <div className={`parity-value-data ${parityStyle.parityValueData}`}>
                                    <Autocomplete
                                        items={dropdownData2.symbol}
                                        getItemValue={(item) => item.label}
                                        renderItem={(item, isHighlighted) => (
                                            <h6
                                                style={{
                                                    background: isHighlighted ? "lightgray" : "white",
                                                    // position: "relative",
                                                    // zIndex: "99999999",
                                                }}
                                                className={parityStyle.parityInputValue}
                                            >
                                                {item.label}
                                            </h6>
                                        )}
                                        value={val.symbol2}
                                        shouldItemRender={(item, value) =>
                                            item.label.toLowerCase().indexOf(value.toLowerCase()) > -1
                                            // console.log(item,value)
                                        }
                                        onChange={(e) => {
                                            const rows = [...data]
                                            rows[i] = {
                                                ...rows[i],
                                                symbol2: e.target.value
                                            };
                                            setData(rows)
                                        }}
                                        onSelect={(selectedValue) => {
                                            const rows = [...data]
                                            rows[i] = {
                                                ...rows[i],
                                                symbol2: selectedValue
                                            };
                                            setData(rows)
                                        }}
                                    />
                                </div>
                                <div className={`parity-value-data ${parityStyle.parityValueData}`}>
                                    <Autocomplete
                                        items={dropdownData2.expirydate}
                                        getItemValue={(item) => item.label}
                                        renderItem={(item, isHighlighted) => (
                                            <h6
                                                style={{
                                                    background: isHighlighted ? "lightgray" : "white",
                                                    // position: "relative",
                                                    // zIndex: "99999999",
                                                }}
                                                className={parityStyle.parityInputValue}
                                            >
                                                {item.label}
                                            </h6>
                                        )}
                                        value={val.expirydate2}
                                        shouldItemRender={(item, value) =>
                                            item.label.toLowerCase().indexOf(value.toLowerCase()) > -1
                                            // console.log(item,value)
                                        }
                                        onChange={(e) => {
                                            const rows = [...data]
                                            rows[i] = {
                                                ...rows[i],
                                                expirydate2: e.target.value
                                            };
                                            setData(rows)
                                        }}
                                        onSelect={(selectedValue) => {
                                            const rows = [...data]
                                            rows[i] = {
                                                ...rows[i],
                                                expirydate2: selectedValue
                                            };
                                            setData(rows)
                                        }}
                                    />
                                </div>
                                <div className={`parity-value-data ${parityStyle.parityValueData}`}>
                                    <Autocomplete
                                        items={dropdownData2.opttype}
                                        getItemValue={(item) => item.label}
                                        renderItem={(item, isHighlighted) => (
                                            <h6
                                                style={{
                                                    background: isHighlighted ? "lightgray" : "white",
                                                    // position: "relative",
                                                    // zIndex: "99999999",
                                                }}
                                                className={parityStyle.parityInputValue}
                                            >
                                                {item.label}
                                            </h6>
                                        )}
                                        value={val.opttype2}
                                        shouldItemRender={(item, value) =>
                                            item.label.toLowerCase().indexOf(value.toLowerCase()) > -1
                                            // console.log(item,value)
                                        }
                                        onChange={(e) => {
                                            const rows = [...data]
                                            rows[i] = {
                                                ...rows[i],
                                                opttype2: e.target.value
                                            };
                                            setData(rows)
                                        }}
                                        onSelect={(selectedValue) => {
                                            const rows = [...data]
                                            rows[i] = {
                                                ...rows[i],
                                                opttype2: selectedValue
                                            };
                                            setData(rows)
                                        }}
                                    />
                                </div>
                                <div className={`parity-value-data ${parityStyle.parityValueData}`}>
                                    <Autocomplete
                                        items={dropdownData2.strikeprice}
                                        getItemValue={(item) => item.label}
                                        renderItem={(item, isHighlighted) => (
                                            <h6
                                                style={{
                                                    background: isHighlighted ? "lightgray" : "white",
                                                    // position: "relative",
                                                    // zIndex: "99999999",
                                                }}
                                                className={parityStyle.parityInputValue}
                                            >
                                                {item.label}
                                            </h6>
                                        )}
                                        value={val.strikeprice2.toString()}
                                        shouldItemRender={(item, value) =>
                                            item.label.toString().toLowerCase().indexOf(value.toLowerCase()) > -1
                                            // console.log(item,value)
                                        }
                                        onChange={(e) => {
                                            let filteredRow = contracts.filter(val => data[index].exchange2 === val.exchange && data[index].securitytype2 === val.securitytype && data[index].symbol2 === val.symbol && data[index].expirydate2 === val.expirydate && data[index].opttype2 === val.opttype && e.target.value == val.strikeprice)
                                            const rows = [...data]
                                            rows[i] = {
                                                ...rows[i],
                                                strikeprice2: e.target.value,
                                                scripcode2: filteredRow.length > 0 && filteredRow[0].scripcode
                                            };
                                            setData(rows)
                                        }}
                                        onSelect={(selectedValue) => {
                                            let filteredRow = contracts.filter(val => data[index].exchange2 === val.exchange && data[index].securitytype2 === val.securitytype && data[index].symbol2 === val.symbol && data[index].expirydate2 === val.expirydate && data[index].opttype2 === val.opttype && selectedValue == val.strikeprice)
                                            const rows = [...data]
                                            rows[i] = {
                                                ...rows[i],
                                                strikeprice2: selectedValue,
                                                scripcode2: filteredRow[0].scripcode
                                            };
                                            setData(rows)
                                        }}
                                    />
                                </div>
                                <div className={parityStyle.parityValueData}>
                                    <span>{val.bid2}</span>
                                </div>
                                <div className={parityStyle.parityValueData}>
                                    <span>{val.ask2}</span>
                                </div>
                                <div className={parityStyle.parityValueData}>
                                    <span></span>
                                </div>
                                <div className={parityStyle.parityValueData}>
                                    <span></span>
                                </div>
                                <div className={parityStyle.parityValueData}>
                                    <span></span>
                                </div>
                            </div>
                            {val.leg3 != null &&
                                <div className={parityStyle.parityCard}>
                                    <div className={parityStyle.parityValueData}>
                                        <span></span>
                                    </div>
                                    <div className={parityStyle.parityValueData}>
                                        <span>{val.leg3}</span>
                                    </div>
                                    <div className={`parity-value-data ${parityStyle.parityValueData}`}>
                                        <Autocomplete
                                            items={dropdownData3.exchange && dropdownData3.exchange}
                                            getItemValue={(item) => item.label}
                                            renderItem={(item, isHighlighted) => (
                                                <h6
                                                    style={{
                                                        background: isHighlighted ? "lightgray" : "white",
                                                        // position: "relative",
                                                        // zIndex: "99999999",
                                                    }}
                                                    className={parityStyle.parityInputValue}
                                                >
                                                    {item.label}
                                                </h6>
                                            )}
                                            value={val.exchange3}
                                            shouldItemRender={(item, value) =>
                                                item.label.toLowerCase().indexOf(value.toLowerCase()) > -1
                                                // console.log(item,value)
                                            }
                                            onChange={(e) => {
                                                const rows = [...data]
                                                rows[i] = {
                                                    ...rows[i],
                                                    exchange3: e.target.value
                                                };
                                                setData(rows)
                                            }}
                                            onSelect={(selectedValue) => {
                                                const rows = [...data]
                                                rows[i] = {
                                                    ...rows[i],
                                                    exchange3: selectedValue
                                                };
                                                setData(rows)
                                                setIndex(i)
                                            }}
                                        />
                                    </div>
                                    <div className={`parity-value-data ${parityStyle.parityValueData}`}>
                                        <Autocomplete
                                            items={dropdownData3.securitytype}
                                            getItemValue={(item) => item.label}
                                            renderItem={(item, isHighlighted) => (
                                                <h6
                                                    style={{
                                                        background: isHighlighted ? "lightgray" : "white",
                                                        // position: "relative",
                                                        // zIndex: "99999999",
                                                    }}
                                                    className={parityStyle.parityInputValue}
                                                >
                                                    {item.label}
                                                </h6>
                                            )}
                                            value={val.securitytype3}
                                            shouldItemRender={(item, value) =>
                                                item.label.toLowerCase().indexOf(value.toLowerCase()) > -1
                                                // console.log(item,value)
                                            }
                                            onChange={(e) => {
                                                const rows = [...data]
                                                rows[i] = {
                                                    ...rows[i],
                                                    securitytype3: e.target.value
                                                };
                                                setData(rows)
                                            }}
                                            onSelect={(selectedValue) => {
                                                const rows = [...data]
                                                rows[i] = {
                                                    ...rows[i],
                                                    securitytype3: selectedValue
                                                };
                                                setData(rows)
                                            }}
                                        />
                                    </div>
                                    <div className={`parity-value-data ${parityStyle.parityValueData}`}>
                                        <Autocomplete
                                            items={dropdownData3.symbol}
                                            getItemValue={(item) => item.label}
                                            renderItem={(item, isHighlighted) => (
                                                <h6
                                                    style={{
                                                        background: isHighlighted ? "lightgray" : "white",
                                                        // position: "relative",
                                                        // zIndex: "99999999",
                                                    }}
                                                    className={parityStyle.parityInputValue}
                                                >
                                                    {item.label}
                                                </h6>
                                            )}
                                            value={val.symbol3}
                                            shouldItemRender={(item, value) =>
                                                item.label.toLowerCase().indexOf(value.toLowerCase()) > -1
                                                // console.log(item,value)
                                            }
                                            onChange={(e) => {
                                                const rows = [...data]
                                                rows[i] = {
                                                    ...rows[i],
                                                    symbol3: e.target.value
                                                };
                                                setData(rows)
                                            }}
                                            onSelect={(selectedValue) => {
                                                const rows = [...data]
                                                rows[i] = {
                                                    ...rows[i],
                                                    symbol3: selectedValue
                                                };
                                                setData(rows)
                                            }}
                                        />
                                    </div>
                                    <div className={`parity-value-data ${parityStyle.parityValueData}`}>
                                        <Autocomplete
                                            items={dropdownData3.expirydate}
                                            getItemValue={(item) => item.label}
                                            renderItem={(item, isHighlighted) => (
                                                <h6
                                                    style={{
                                                        background: isHighlighted ? "lightgray" : "white",
                                                        // position: "relative",
                                                        // zIndex: "99999999",
                                                    }}
                                                    className={parityStyle.parityInputValue}
                                                >
                                                    {item.label}
                                                </h6>
                                            )}
                                            value={val.expirydate3}
                                            shouldItemRender={(item, value) =>
                                                item.label.toLowerCase().indexOf(value.toLowerCase()) > -1
                                                // console.log(item,value)
                                            }
                                            onChange={(e) => {
                                                const rows = [...data]
                                                rows[i] = {
                                                    ...rows[i],
                                                    expirydate3: e.target.value
                                                };
                                                setData(rows)
                                            }}
                                            onSelect={(selectedValue) => {
                                                const rows = [...data]
                                                rows[i] = {
                                                    ...rows[i],
                                                    expirydate3: selectedValue
                                                };
                                                setData(rows)
                                            }}
                                        />
                                    </div>
                                    <div className={`parity-value-data ${parityStyle.parityValueData}`}>
                                        <Autocomplete
                                            items={dropdownData3.opttype}
                                            getItemValue={(item) => item.label}
                                            renderItem={(item, isHighlighted) => (
                                                <h6
                                                    style={{
                                                        background: isHighlighted ? "lightgray" : "white",
                                                        // position: "relative",
                                                        // zIndex: "99999999",
                                                    }}
                                                    className={parityStyle.parityInputValue}
                                                >
                                                    {item.label}
                                                </h6>
                                            )}
                                            value={val.opttype3}
                                            shouldItemRender={(item, value) =>
                                                item.label.toLowerCase().indexOf(value.toLowerCase()) > -1
                                                // console.log(item,value)
                                            }
                                            onChange={(e) => {
                                                const rows = [...data]
                                                rows[i] = {
                                                    ...rows[i],
                                                    opttype3: e.target.value
                                                };
                                                setData(rows)
                                            }}
                                            onSelect={(selectedValue) => {
                                                const rows = [...data]
                                                rows[i] = {
                                                    ...rows[i],
                                                    opttype3: selectedValue
                                                };
                                                setData(rows)
                                            }}
                                        />
                                    </div>
                                    <div className={`parity-value-data ${parityStyle.parityValueData}`}>
                                        <Autocomplete
                                            items={dropdownData3.strikeprice}
                                            getItemValue={(item) => item.label}
                                            renderItem={(item, isHighlighted) => (
                                                <h6
                                                    style={{
                                                        background: isHighlighted ? "lightgray" : "white",
                                                        // position: "relative",
                                                        // zIndex: "99999999",
                                                    }}
                                                    className={parityStyle.parityInputValue}
                                                >
                                                    {item.label}
                                                </h6>
                                            )}
                                            value={val.strikeprice3.toString()}
                                            shouldItemRender={(item, value) =>
                                                item.label.toLowerCase().indexOf(value.toLowerCase()) > -1
                                                // console.log(item,value)
                                            }
                                            onChange={(e) => {
                                                let filteredRow = contracts.filter(val => data[index].exchange3 === val.exchange && data[index].securitytype3 === val.securitytype && data[index].symbol3 === val.symbol && data[index].expirydate3 === val.expirydate && data[index].opttype3 === val.opttype && e.target.value == val.strikeprice)
                                                const rows = [...data]
                                                rows[i] = {
                                                    ...rows[i],
                                                    strikeprice3: e.target.value,
                                                    scripcode3: filteredRow.length > 0 && filteredRow[0].scripcode
                                                };
                                                setData(rows)
                                            }}
                                            onSelect={(selectedValue) => {
                                                let filteredRow = contracts.filter(val => data[index].exchange3 === val.exchange && data[index].securitytype3 === val.securitytype && data[index].symbol3 === val.symbol && data[index].expirydate3 === val.expirydate && data[index].opttype3 === val.opttype && selectedValue == val.strikeprice)
                                                const rows = [...data]
                                                rows[i] = {
                                                    ...rows[i],
                                                    strikeprice3: selectedValue,
                                                    scripcode3: filteredRow[0].scripcode
                                                };
                                                setData(rows)
                                            }}
                                        />
                                    </div>
                                    <div className={parityStyle.parityValueData}>
                                        <span>{val.bid3}</span>
                                    </div>
                                    <div className={parityStyle.parityValueData}>
                                        <span>{val.ask3}</span>
                                    </div>
                                    <div className={parityStyle.parityValueData}>
                                        <span></span>
                                    </div>
                                    <div className={parityStyle.parityValueData}>
                                        <span></span>
                                    </div>
                                    <div className={parityStyle.parityValueData}>
                                        <span></span>
                                    </div>
                                </div>
                            }
                        </div>
                    })}
                </div>
            </div>
            <Notification
                notify={NotifyData}
                CloseError={CloseError}
                CloseSuccess={CloseSuccess}
                CloseConfirm={CloseConfirm}
            />
        </div >
    )
}

export default memo(Parity)