
import { Bar } from "react-chartjs-2";


const Chart = (props: any) => {
  return (
    <div>
     <Bar data={props.chartData}  />
    </div>
  )
}

export default Chart