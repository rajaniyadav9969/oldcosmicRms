import React, { useState, memo } from 'react'
import Chart from 'react-apexcharts';
import _ from 'lodash'
import './DailyMTMGraph.scss';

function AnalysisChartPos({ data }) {

    const [filterOptions, setFilterOptions] = useState({
        groupby: 'userid',
        mtm: 'qty',
        accountType: 'overall',
        graphType: 'area'
    })


    let x_axis = data && [...new Set(data.map(val => { return val[filterOptions.groupby] }))]

    //   var grouped_data = _.chain(data)
    //   .groupBy("groupname")
    //   .toPairs()
    //   .map(pair => _.zipObject(['groupname', 'value'], pair))
    //   .value();

    let grouped_data = _.groupBy(data, `${filterOptions.groupby}`)

    let nse_Grouped_Data = x_axis && x_axis.map((val) => {
        for (let property in grouped_data) {
            if (property == val) {
                return grouped_data[property].map(val => val[`nsetotal${filterOptions.mtm}`] ).reduce((prev, curr) => { return prev + curr, 0 })
            }
        }
    })

    let sgx_Grouped_Data = x_axis && x_axis.map((val) => {
        for (let property in grouped_data) {
            if (property == val) {
                return grouped_data[property].map(val => val[`sgx${filterOptions.mtm}`] ).reduce((prev, curr) => { return prev + curr, 0 })
            }
        }
    })

    let arb_Grouped_Data = x_axis && x_axis.map((val) => {
        for (let property in grouped_data) {
            if (property == val) {
                return grouped_data[property].map(val => val[`out`] ).reduce((prev, curr) => { return prev + curr, 0 })
            }
        }
    })

    // console.log(filterOptions);

    return (
        <div className='mtm-graph'>
            <div className='graph-container'>
                <div className='mtm-ananltsis-section'>
                    <div className='title'>
                        <h6 className='h6_title'>Position Analysis</h6>
                    </div>
                    <div className='mtm-ananltsis-form-group'>
                        <select
                            value={filterOptions.groupby}
                            onChange={(e) => setFilterOptions({ ...filterOptions, groupby: e.target.value })}
                            className="mtm-analysis-form-select"
                        >
                            <option hidden>Select GroupBy</option>
                            <option value='userid'>UserID</option>
                            <option value='groupname'>Group Name</option>
                            <option value='segment'>Segment</option>
                        </select>
                        <select
                            value={filterOptions.graphType}
                            onChange={(e) => setFilterOptions({ ...filterOptions, graphType: e.target.value })}
                            className="mtm-analysis-form-select"
                        >
                            <option hidden> Graph Type</option>
                            <option value='area'>Area</option>
                            <option value='bar'>Bar</option>
                            <option value='line'>Line</option>
                        </select>
                    </div>
                </div>
                <div className='graph'>
                    <Chart
                        options=
                        {
                            {
                                chart: {
                                    id: "area",
                                    toolbar: {
                                        show: true
                                    },
                                    animations: {
                                        enabled: false,
                                        easing: 'easeinout',
                                        speed: 800,
                                        animateGradually: {
                                            enabled: true,
                                            delay: 150
                                        },
                                        dynamicAnimation: {
                                            enabled: true,
                                            speed: 500
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
                                    categories: x_axis
                                    // categories: data.map(val=>val['groupname']) 
                                },
                                yaxis: {
                                    // tickAmount: 4
                                    labels: {
                                        formatter: (val) => { return val.toFixed(2) }
                                    }
                                },
                                dataLabels: {
                                    enabled: true,
                                    formatter: (val) => { return val.toFixed(2) }

                                }
                            }
                        }
                        series={[
                            {
                                name: "NSE",
                                // data: [44, 55, 41, 64, 22, 43, 21,44, 55, 41, 64, 22, 43, 21]
                                data: nse_Grouped_Data ? nse_Grouped_Data : null


                            },
                            {
                                name: "SGX",
                                // data:[53, 32, 33, 52, 13, 44, 32,53, 32, 33, 52, 13, 44, 32]
                                data: sgx_Grouped_Data ? sgx_Grouped_Data : null
                            },
                            {
                                name: "ARB",
                                // data:[53,45 , 39, 65, 19, 88, 10,53,45 , 39, 65, 19, 88, 10]
                                data: arb_Grouped_Data ? arb_Grouped_Data : null
                            }

                        ]}
                        type={filterOptions.graphType}
                        className="graf-chart"
                        height='210'
                    />
                </div>
            </div>

        </div>
    )
}

export default memo(AnalysisChartPos)