import React, {  memo } from "react";
import Chart from "react-apexcharts";
import _ from "lodash";

const DonutAnalysisChart = ({ data }) => {
  return (
    <div>
      <div className="mtm-graph">
        <div className="graph-container">
          <div className="mtm-ananltsis-section">
            <div className="title">
              <h6 className="h6_title">Exposure Analysis</h6>
            </div>

          </div>
          <div className='graph'>
            <Chart
              options=
              {
                {
                  chart: {
                    id: "donut",
                    // type: "donut",
                    toolbar: {
                      show: true
                    },
                  },
                  // states: {
                  //   hover: { filter: { type: "lighten", value: 0.5 } },
                  //   active: { filter: { type: "none", value: 0 } }
                  // },
                  plotOptions: {
                    pie: {
                      expandOnClick: true,
                      donut: {
                        size: "55%",
                        labels: {
                          show: true,
                          name: { show: false },
                          value: {
                            fontSize: "25px",
                            fontWeight: 900,
                          },
                          total: {
                            show: true,
                            showAlways: true,
                            formatter: function (w) {
                              return (w.globals.seriesTotals[0] + w.globals.seriesTotals[1]) / 100 + '%';
                            }
                          }
                        }
                      }
                    }
                  },
                  grid: {
                    show: false
                  },
                  stroke: {
                    width: 0,
                  },
                  labels: [
                    "FUTEXPO", "OPTEXPO"
                  ],
                  colors: ['#00e396', '#2165ff'],
                  dataLabels: {
                    enabled: true,
                    formatter: (val) => {
                      return val.toFixed(2) + '%'
                    },
                  },
                  // is3D: true,
                  fill: {
                    type: 'gradient',
                    colors: ['#00e396', '#2165ff'],
                  },
                  // theme: {
                  //   mode: 'dark',
                  //   // palette: 'palette1', 
                  //   monochrome: {
                  //     enabled: false,
                  //     // color: '#255aee',
                  //     shadeTo: 'dark',
                  //     // shadeIntensity: 0.65
                  //   },
                  // }
                }
              }
              series={[
                (data.length > 0) && data[0].FUTEXPO,
                (data.length > 0) && data[0].OPTEXPO,
              ]}
              type="donut"
              className="graf-chart"
              height='220'
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(DonutAnalysisChart);
