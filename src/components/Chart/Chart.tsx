import React from 'react';
import { Bar } from "react-chartjs-2";
import {Chart as ChartJS} from 'chart.js/auto'

const Chart = (props: any) => {
  return (
    <div>
      <h1>dgdfg</h1>
     <Bar data={props.chartData}  />
    </div>
  )
}

export default Chart