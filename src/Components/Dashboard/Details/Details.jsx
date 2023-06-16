import React, { useState,memo } from 'react'
import './Details.scss'
import { GoGraph } from 'react-icons/go';
import { SiDatabricks } from "react-icons/si";
import { AiOutlinePercentage } from "react-icons/ai";
import Chart from 'react-apexcharts';

function Details(props) {
    const { details } = props;
    const [show, setShow] = useState(false);
    return (
        <div className='maindetails row'>
            {
                details.map((el, i) => {
                    return el.profitloss !== 0 ? <div key={i} className="singleDetails col-md-6" >
                        <div className='details'>
                            <div className='details-container'>
                                {show &&
                                    <div
                                        // id={Object.keys(el)[0]}
                                        className='graph'>
                                        <Chart
                                            height='220'
                                            options={
                                                {
                                                    chart: {
                                                        foreColor: '#fff',
                                                        id: "area",
                                                        animations: {
                                                            enabled: true,
                                                            easing: 'easeinout',
                                                            speed: 800,
                                                            animateGradually: {
                                                                enabled: true,
                                                                delay: 150
                                                            },
                                                            dynamicAnimation: {
                                                                enabled: true,
                                                                speed: 350
                                                            }
                                                        },
                                                        toolbar: {
                                                            show: false
                                                        }
                                                    },
                                                    grid: {
                                                        show: false
                                                    },
                                                    stroke: {
                                                        width: 2
                                                    },

                                                    xaxis: {
                                                        categories: el.GraphicalData.map(val => val.timestamp.split(' ')[1])
                                                    }
                                                }
                                            }
                                            series={
                                                [
                                                    {
                                                        name: "MTM",
                                                        data: el.GraphicalData.map(val => val.MTM)
                                                    },
                                                    // {
                                                    //     name: "QTY",
                                                    //     data: el.GraphicalData.map(val => val.Qty)
                                                    // },
                                                    // {
                                                    //     name: "LTP",
                                                    //     data: el.GraphicalData.map(val => val.LTP)
                                                    // }
                                                ]
                                            }
                                            type="area" />
                                    </div>
                                }
                                <div className='data-board'>
                                    <div className='title'>
                                        <div className='details-content'>
                                            <h6 className='title-users'>{el.name}</h6>
                                            {/* <div style={{lineHight: '0'}}
                                                // onClick={()=>maxMin(Object.keys(el)[0])}
                                                onClick={() => setShow(!show)}
                                            ><AiOutlineAreaChart /></div> */}
                                        </div>
                                        <div className='row symbol-position'>
                                            {/* <span className='col-md-6 user-desc'>{el.name}</span><br /> */}
                                            <div className="col-md-12 symbol-position-2">
                                                <div>
                                                    <span className='user-desc'>{'Close'}&nbsp;&nbsp;</span>
                                                    <span className='user-desc'>{el.closerate.toFixed(2)}</span>
                                                </div>
                                                <span> &nbsp;&nbsp;|&nbsp;&nbsp; </span>
                                                <div>
                                                    <span className='user-desc'>{'LTP'}&nbsp;&nbsp;</span>
                                                    <span className='user-desc'>{el.ltp.toFixed(2)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='data-grid row'>
                                        <div className='users col-md-3 col-6' >
                                            <div className='title-container'>
                                                <div className='icon'><SiDatabricks /></div>
                                                <span className='span-tag'>{'netqty'}</span>
                                            </div>
                                            <div className='amount-container'>
                                                <h4 className='h4-tag'>{el.netqty}</h4>
                                                <div className='bar'></div>
                                            </div>
                                        </div>
                                        <div className='clicks col-md-3  col-6'>
                                            <div className='title-container'>
                                                <div className='icon'><SiDatabricks /></div>
                                                <span className='span-tag'>{'NetAvg'}</span>
                                            </div>
                                            <div className='amount-container'>
                                                <h4 className='h4-tag'>{(el.netavg).toFixed(2)}</h4>
                                                <div className='bar'></div>
                                            </div>
                                        </div>
                                        <div className='sales col-md-4 col-6'>
                                            <div className='title-container'>
                                                <div className='icon'><GoGraph /></div>
                                                <span className='span-tag'>{'profit/loss'}</span>
                                            </div>
                                            <div className='amount-container'>
                                                <h4 className='h4-tag'>{el.currency === 'INR' ? '₹' : '$'} {(el.profitloss).toFixed(2)}</h4>
                                                <div className='bar'></div>
                                            </div>
                                        </div>
                                        <div className='items col-md-2 col-6'>
                                            <div className='title-container'>
                                                <div className='icon'><AiOutlinePercentage /></div>
                                                <span className='span-tag'>{'change'}</span>
                                            </div>
                                            <div className='amount-container'>
                                                <h4 className='h4-tag'>{el.change}%</h4>
                                                <div className='bar'></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                        :
                        null
                })
            }
        </div >

    )
}

export default memo(Details)

