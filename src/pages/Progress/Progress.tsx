import React, { useEffect, useState } from 'react';
import { Bar } from "react-chartjs-2";
import  Chart  from "../../components/Chart/Chart";

const Progress = () => {
    const [chartData, setChartData] = useState({})
    useEffect(() => {
        const fetchPrices = async () => {
          const res = await fetch("https://api.coincap.io/v2/assets/?limit=5")
          const data = await res.json()
          setChartData({
            labels: data.data.map((crypto: { name: any; }) => crypto.name),
            datasets: [
              {
                label: "Price in USD",
                data: data.data.map((crypto: { priceUsd: any; }) => crypto.priceUsd),
                backgroundColor: [
                  "#ffbb11",
                  "#ecf0f1",
                  "#50AF95",
                  "#f3ba2f",
                  "#2a71d0"
                ]
              }
            ]
          });
        };
        fetchPrices()
      }, []);
  return (
    <div>
    <Chart chartData={chartData} />
  </div>
  )
}

export default Progress