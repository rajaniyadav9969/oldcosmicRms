import React, { memo } from 'react'
import { INotifyBtn } from '../../Notification'
import Chart from 'react-apexcharts';
import '../../Dashboard/DailyMTM/DailyMTMGraph.scss';


const ProfitLossChart = (props) => {
    return (
        <div className='mtm-graph overview-graph'>
            <div className='graph-container'>
                <div className='title'>
                    <h6 className='h6_title'>Profit/Loss Overview</h6>
                </div>
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
                            colors: ['#00e396', '#2165ff', '#fbbc05'],

                            xaxis: {
                                categories: props.data.map((dt) => { return dt.userid }),
                                tooltip: { enabled: false }
                            }
                        }
                    }
                        series={[
                            {
                                name: 'NSEFO MTM',
                                data: props.data && props.data.map(dt => { return (dt.nsemtm / 100000) })
                            }
                            , {
                                name: 'SGXFO MTM',
                                data: props.data && props.data.map(dt => { return (dt.sgxmtm / 100000) })
                            }
                            , {
                                name: 'NET MTM',
                                data: props.data && props.data.map(dt => { return ((dt.inrmtm) / 100000) })
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

export default memo(ProfitLossChart)