import React from "react";
import Heading from "../ui/Heading";
import Table from "../ui/Table";

const Transaction = () => {
  return (
    <div className='w-full h-full pb-4'>
      <Heading>Transactions Table</Heading>
      <Table />
      <div className='h-20 w-full'></div>
    </div>
  );
};

export default Transaction;
