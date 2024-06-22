import axios from "axios";
import React, { useEffect, useState } from "react";
import Heading from "./Heading";

const Statistics = ({ month, months }) => {
  const [record, setRecord] = useState({});
  const monthName = months.find((item) => item.id === Number(month))?.name;
  console.log(monthName);

  useEffect(() => {
    fetchStatistics();
  }, [month]);
  async function fetchStatistics() {
    try {
      const response = await axios.get(
        `http://localhost:8800/stat/statistics?month=${month}`,
      );
      setRecord({
        totalSale: response.data.totalSoldAmount,
        totalSoldItem: response.data.totalItemSold,
        totalUnsoldItem: response.data.totalUnsoldItems,
      });
      console.log(response.data);

      // Assuming the response contains a list of transactions
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <>
      <Heading>Statistics - {monthName}</Heading>
      <div className='stats shadow '>
        <div className='stat bg-slate-300'>
          <div className='stat-figure text-secondary'></div>
          <div className='stat-title'>Total Sale</div>
          <div className='stat-value'>{record?.totalSale?.toFixed(2)}</div>
        </div>

        <div className='stat  bg-slate-300'>
          <div className='stat-figure text-secondary'></div>
          <div className='stat-title'>Total Item Sold</div>
          <div className='stat-value'>{record?.totalSoldItem || 0}</div>
        </div>

        <div className='stat  bg-slate-300'>
          <div className='stat-figure text-secondary'></div>
          <div className='stat-title'>Total not Sold Items</div>
          <div className='stat-value'>↘︎ {record?.totalUnsoldItem || 0}</div>
        </div>
      </div>
    </>
  );
};

export default Statistics;
