import axios from "axios";
import React, { useEffect, useState } from "react";
import Statistics from "./Statistics";
import BarChart from "./BarChart";

const Table = () => {
  const [transactions, setTransactions] = useState([]);
  const [record, setRecord] = useState({});
  const [pageNo, setPageNo] = useState(1);
  const [month, setMonth] = useState(3);
  const [query, setQuery] = useState("");
  const months = [
    {
      id: 1,
      name: "January",
    },
    {
      id: 2,
      name: "February",
    },
    {
      id: 3,
      name: "March",
    },
    {
      id: 4,
      name: "April",
    },
    {
      id: 5,
      name: "May",
    },
    {
      id: 6,
      name: "June",
    },
    {
      id: 7,
      name: "July",
    },
    {
      id: 8,
      name: "August",
    },
    {
      id: 9,
      name: "September",
    },
    {
      id: 10,
      name: "October",
    },
    {
      id: 11,
      name: "November",
    },
    {
      id: 12,
      name: "December",
    },
  ];

  useEffect(() => {
    fetchTransactions();
  }, [month, pageNo]);
  async function fetchTransactions() {
    try {
      const response = await axios.get(
        `http://localhost:8800/stat/transactions?month=${month}&page=${pageNo}&perPage=5`,
      );
      setRecord({
        pages: response.data.page,
        perPage: response.data.perPage,
        total: response.data.total,
      });

      setTransactions(response.data.transactions); // Assuming the response contains a list of transactions
    } catch (error) {
      console.log(error);
    }
  }
  function handleChangeMonth(month) {
    setMonth(month);
  }
  function goOnPreviousPage() {
    setPageNo((page) => page - 1);
  }
  function goOnNextPage() {
    setPageNo((page) => page + 1);
  }
  async function handleQuery(event) {
    if (event.keyCode === 13) {
      try {
        const response = await axios.get(
          `http://localhost:8800/stat/transactions?search=${query}&month=${month}&page=${pageNo}&perPage=5`,
        );
        setRecord({
          pages: response.data.page,
          perPage: response.data.perPage,
          total: response.data.total,
        });

        setTransactions(response.data.transactions); // Assuming the response contains a list of transactions
      } catch (error) {
        console.log(error);
      }
    }
  }
  return (
    <div className='flex items-center justify-center flex-col h-full px-10 py-10 mb-10 font-pop'>
      <div className='overflow-x-auto     '>
        <div className='px-2  mb-4 flex items-center  w-full justify-between '>
          <select
            className='select select-bordered w-40 max-w-xs rounded-xl py-2'
            defaultValue={3}
            onChange={(e) => handleChangeMonth(e.target.value)}
          >
            <option value={1}>Jan</option>
            <option value={2}>Feb</option>
            <option value={3}>Mar</option>
            <option value={4}>April</option>
            <option value={5}>May</option>
            <option value={6}>June</option>
            <option value={7}>July</option>
            <option value={8}>August</option>
            <option value={9}>September</option>
            <option value={10}>October</option>
            <option value={11}>November</option>
            <option value={12}>December</option>
          </select>
          <label className='input input-bordered rounded-xl flex items-center gap-2'>
            <input
              type='text'
              className='grow'
              placeholder='Search'
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleQuery}
              onEmptiedCapture={fetchTransactions}
            />
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 16 16'
              fill='currentColor'
              className='w-4 h-4 opacity-70'
            >
              <path
                fillRule='evenodd'
                d='M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z'
                clipRule='evenodd'
              />
            </svg>
          </label>
        </div>
        <table className='table shadow-lg border border-gray-200 rounded-xl overflow-hidden  '>
          {/* head */}
          <thead className=' bg-gray-500 text-white '>
            <tr className='py-8'>
              <th>Product</th>
              <th>Description</th>
              <th>Category</th>
              <th>Availability</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map(
              ({ id, title, price, category, image, sold, description }) => {
                return (
                  <tr
                    className={`${sold ? " bg-stone-200 opacity-60" : ""}`}
                    key={id}
                  >
                    <td>
                      <div className='flex items-center gap-3'>
                        <div className='avatar'>
                          <div className='mask mask-squircle w-16 h-16 '>
                            <img
                              src={`${image}`}
                              alt='Avatar Tailwind CSS Component'
                            />
                          </div>
                        </div>
                        <div>
                          <div className='font-bold'>{title}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      {" "}
                      <span className='badge badge-ghost badge-sm h-full'>
                        {description.split(" ").slice(0, 10).join(" ")}....
                      </span>
                    </td>
                    <td>{category}</td>
                    <td>
                      {sold ? (
                        <div className='font-semibold text-red-800'>
                          Sold out
                        </div>
                      ) : (
                        <div className='font-semibold text-green-500'>
                          Available
                        </div>
                      )}
                    </td>
                    <th>
                      <div className='text-sm font-medium opacity-50'>
                        ${price.toFixed(2)}
                      </div>
                    </th>
                  </tr>
                );
              },
            )}
            {/* row 2 */}
          </tbody>
          {/* foot */}
          <tfoot></tfoot>
        </table>
        <div className='w-full flex items-center justify-between py-4'>
          <button className='btn rounded-lg'>
            Page
            <div className='badge badge-secondary'>{record.pages}</div>
          </button>
          <div className='join grid grid-cols-2'>
            <button
              onClick={goOnPreviousPage}
              className='join-item btn btn-outline rounded-l-md disabled:bg-opacity-50 disabled:text-white disabled:cursor-not-allowed'
              disabled={pageNo === 1}
            >
              Previous page
            </button>
            <button
              onClick={goOnNextPage}
              className='join-item btn btn-outline rounded-r-md disabled:bg-opacity-50 disabled:text-white disabled:cursor-not-allowed'
              disabled={pageNo * record?.perPage >= record.total}
            >
              Next
            </button>
          </div>
          <button className='btn rounded-lg '>
            Per Page
            <div className='badge badge-secondary'>{record.perPage}</div>
          </button>
        </div>
      </div>
      <Statistics month={month} months={months} />
      <BarChart month={month} months={months} />
    </div>
  );
};

export default Table;
