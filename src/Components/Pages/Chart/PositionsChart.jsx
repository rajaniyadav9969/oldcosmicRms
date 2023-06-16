import React, { memo } from 'react'
import { INotifyBtn } from '../../Notification'
import Chart from 'react-apexcharts';
import '../../Dashboard/DailyMTM/DailyMTMGraph.scss';


const PositionsChart = (props) => {
    return (
        <div className='mtm-graph overview-graph'>
            <div className='graph-container'>
                <div className='title'>
                    <h6 className='h6_title'>Positions Overview</h6>
                </div>
                <div className='graph'>
                    <Chart options={
                        {
                            // dataLabels:{enabled:false},
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
                            colors: ['#00e396', '#2165ff', '#fbbc05'],

                            xaxis: {
                                categories: props.data.map((dt) => { return dt.userid }),
                            }
                        }
                    }
                        series={[
                            {
                                name: 'NSE FUT QTY',
                                data: props.data && props.data.map(dt => { return (dt.nsemtm)})
                            }
                            , {
                                name: 'SGX FUT QTY',
                                data: props.data && props.data.map(dt => { return (dt.nsefutqty)})
                            }
                            , {
                                name: 'OUT QTY',
                                data: props.data && props.data.map(dt => { return (dt.outqty)})
                            }
                        ]}
                        type="area"
                        height="350px"
                        // width="350px"
                        className="graf-chart"
                    />
                </div>
                <div className='inotification-ballicon'>
                    <INotifyBtn />
                </div>
            </div>

        </div>
    )
}

export default memo(PositionsChart)