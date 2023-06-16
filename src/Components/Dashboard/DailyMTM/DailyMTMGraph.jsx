import Window from 'floating-window-ui';
import React, { memo } from 'react';
import { useState } from 'react';
import Chart from 'react-apexcharts';
import { AiFillExclamationCircle } from 'react-icons/ai';
import { INotifyBtn } from '../../Notification';
import './DailyMTMGraph.scss';

function DailyMTMGraph(props) {
    const { mtm } = props;
    const [showprofiltLossGraph, setShowprofiltLossGraph] = useState(false);
    return (
        <div className='mtm-graph'>
            <div className='graph-container '>
                <div className='title'>
                    <h6 className='h6_title'>ARB MTM Overview In INR(Cr.)</h6>
                    <div className='mtm-grap-window-btn'>
                        <AiFillExclamationCircle onClick={() => setShowprofiltLossGraph(true)} />
                    </div>
                </div>
                <div className='graph'>
                    <Chart 
                    options={
                        {
                            chart: {
                                id: "area",
                                toolbar: {
                                    show: true
                                },
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
                                }
                            },
                            grid: {
                                show: false
                            },
                            stroke: {
                                width: 2,
                            },
                            colors: ['#00e396', '#2165ff', '#fbbc05', '#9c27b0'],


                            xaxis: {
                                categories: mtm.map((dt) => { return dt.datetime })
                            },
                            // yaxis: {
                            //     tickAmount: 2
                            // },
                            // dataLabels:{
                            //         enabled:false
                            // }
                        }
                    }
                        series={[
                            {
                                name: "OverAll",
                                data: mtm.map(dt => ((dt["overall_arb"]) / 10000000).toFixed(2))
                            },
                            {
                                name: "Client",
                                data: mtm.map(dt => ((dt["client_arb"]) / 10000000).toFixed(2))
                            },
                            {
                                name: "Broker",
                                data: mtm.map(dt => ((dt["broker_arb"]) / 10000000).toFixed(2))
                            },
                            {
                                name: "Company",
                                data: mtm.map(dt => ((dt["company_arb"]) / 10000000).toFixed(2))
                            }
                        ]}
                        type="area"
                        className="graf-chart"
                        height='201'
                    />
                </div>

                {
                    showprofiltLossGraph
                        ? (
                            <Window
                                id="react-window"
                                height="auto"
                                width={"26%"}
                                resizable={true}
                                titleBar={{
                                    icon: <AiFillExclamationCircle />,
                                    title: "ARB MTM Overview In INR(Cr.)",
                                    buttons: { minimize: true, maximize: true, close: () => setShowprofiltLossGraph(false) },
                                }}
                            >
                                <div className='graph'>
                                    <Chart options={
                                        {
                                            chart: {
                                                id: "area",
                                                toolbar: {
                                                    show: true
                                                },
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
                                                }
                                            },
                                            grid: {
                                                show: false
                                            },
                                            stroke: {
                                                width: 2,
                                            },
                                            colors: ['#00e396', '#2165ff', '#fbbc05', '#9c27b0'],


                                            xaxis: {
                                                categories: mtm.map((dt) => { return dt.datetime })
                                            },
                                            // yaxis: {
                                            //     tickAmount: 2
                                            // },
                                            // dataLabels:{
                                            //         enabled:false
                                            // }
                                        }
                                    }
                                        series={[
                                            {
                                                name: "OverAll",
                                                data: mtm.map(dt => ((dt["overall_arb"]) / 10000000).toFixed(2))
                                            },
                                            {
                                                name: "Client",
                                                data: mtm.map(dt => ((dt["client_arb"]) / 10000000).toFixed(2))
                                            },
                                            {
                                                name: "Broker",
                                                data: mtm.map(dt => ((dt["broker_arb"]) / 10000000).toFixed(2))
                                            },
                                            {
                                                name: "Company",
                                                data: mtm.map(dt => ((dt["company_arb"]) / 10000000).toFixed(2))
                                            }
                                        ]}
                                        type="area"
                                        className="graf-chart"
                                        height="auto"
                                    />
                                </div>
                            </Window>
                        )
                        :
                        null
                }
                {/* <div className='inotification-ballicon'>
                    <INotifyBtn />
                </div> */}
            </div>

        </div>
    )
}

export default memo(DailyMTMGraph)