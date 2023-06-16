import React, { memo, useEffect, useRef, useState } from 'react'
import Draggable from "react-draggable";
import SpeedDial from "@material-ui/lab/SpeedDial";
import SpeedDialAction from "@material-ui/lab/SpeedDialAction";
import { handleColorChange, Months } from '../../Utilities/Utilities';
import './Draggable.scss';
// import '../FloatingBtn/FloatingBtn'

const DragableFloating = (props) => {

    const parityRef = useRef();
    const nseltpRef = useRef();
    const sgxltpRef = useRef();
    const usdRef = useRef();

    const [open, setOpen] = useState(false);
    const [disabled, setdisabled] = useState(false)
    const [parityData, setparityData] = useState()
    const handleClose = () => {
        setOpen(false);
    };
    const handleOpen = () => {
        setOpen(true);
    };
    useEffect(() => {
        if (window.innerWidth <= 768) {
            setdisabled(true)
        }
        else if (window.innerWidth > 768) {
            setdisabled(false)
        }
    }, [window.innerWidth])

    useEffect(() => {
        if (props.Broadcaster !== undefined) {
            if (props.Broadcaster.length !== 0) {
                let parityData = []
                let data = props.Broadcaster.filter(val => { return val.securitytype == 'FUT' && (val.symbol == 'NIFTY' || val.exchange == 'SGXFO') || val.exchange == 'USD' })
                let ExpiryList = [...new Set(data.map(val => { return val.exchange!='USD' && val.expirydate }))]
                for (let k = 0; k < ExpiryList.length; k++) {
                    if (new Date(ExpiryList[k]).getMonth() == new Date().getMonth() && new Date(ExpiryList[k]).getFullYear() == new Date().getFullYear()) {
                        parityData.push({ expirydate: ExpiryList[k], usd: 0, nsebid: 0, nseask: 0, nseltp: 0, sgxbid: 0, sgxask: 0, sgxltp: 0, parity: 0 })
                    }
                    else if(new Date(ExpiryList[k]).getMonth() == new Date().getMonth()+1  && new Date(ExpiryList[k]).getFullYear() == new Date().getFullYear()) {
                        parityData.push({ expirydate: ExpiryList[k], usd: 0, nsebid: 0, nseask: 0, nseltp: 0, sgxbid: 0, sgxask: 0, sgxltp: 0, parity: 0 })

                    }
                }
                for (let i = 0; i < data.length; i++) {
                    for (let j = 0; j < parityData.length; j++) {

                        if (parityData[j]['expirydate'] == data[i]['expirydate']) {

                            if (data[i]['exchange'].startsWith('NSEFO')) {
                                parityData[j]['nsebid'] = data[i]['bid']
                                parityData[j]['nseask'] = data[i]['ask']
                                handleColorChange(data[i]['ltp'], nseltpRef);
                                parityData[j]['nseltp'] = data[i]['ltp']
                            }
                            if (data[i]['exchange'].startsWith('SGXFO')) {
                                parityData[j]['sgxbid'] = data[i]['bid']
                                parityData[j]['sgxask'] = data[i]['ask']
                                handleColorChange(data[i]['ltp'], sgxltpRef);
                                parityData[j]['sgxltp'] = data[i]['ltp']
                            }
                            handleColorChange(parseFloat(parseFloat((parityData[j]['nsebid'] - parityData[j]['sgxask'] + parityData[j]['nseask'] - parityData[j]['sgxbid']) / 2).toFixed(2)), parityRef);
                            parityData[j]['parity'] = parseFloat(parseFloat((parityData[j]['nsebid'] - parityData[j]['sgxask'] + parityData[j]['nseask'] - parityData[j]['sgxbid']) / 2).toFixed(2))
                        }
                        if (data[i]['exchange'].startsWith('USD')) {
                            handleColorChange(data[i]['ltp'], usdRef);
                            parityData[j]['usd'] = data[i]['ltp']
                        }
                    }

                }
                setparityData(parityData[0]);
                document.getElementById("titleTag").innerHTML = " (" + Months[new Date(parityData[0]['expirydate']).getMonth()] + ' ' + parityData[0]['parity'] + ") Cosmic Trades"
            }
        }
    }, [props.Broadcaster])
    return (
        <Draggable
            disabled={disabled}
            scale={1}
        >
            <SpeedDial
                ariaLabel="SpeedDial example"
                icon={
                    <div >
                        <span className='parity-content'>
                            Parity
                        </span>
                        <span ref={parityRef}>
                            {parityData && parityData['parity']}
                        </span>
                        <h6>Parity</h6>
                    </div>
                }
                onClose={handleClose}
                onOpen={handleOpen}
                open={open}
                className="muidial-direction"
                direction="left"
            >
                <SpeedDialAction
                    key='Parity'
                    icon={
                        <div className='parity-details'>
                            <span className='partyle-item'>Expiry : {parityData && parityData['expirydate']} </span>
                            <span className='partyle-item'>USD : <span id="number" ref={usdRef}>{parityData && parityData['usd'].toFixed(2)} </span></span>
                            <span className='partyle-item'>NSE : <span id="number" ref={nseltpRef}>{parityData && parityData['nseltp'].toFixed(2)} </span></span>
                            <span className='partyle-item'>SGX : <span id="number" ref={sgxltpRef}>{parityData && parityData['sgxltp'].toFixed(2)} </span></span>
                        </div>
                    }
                    tooltipTitle='Parity'
                    className='parity'
                />
            </SpeedDial>
        </Draggable>
    )
}

export default memo(DragableFloating)