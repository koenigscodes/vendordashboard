import { useGetOrdersQuery } from "../features/api/ordersApi";
import { setFilter } from "../features/orders/orderSlice";

import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";

import { useState } from "react";

import { ChevronRight } from "lucide-react";

const OrdersList = () => {
  const {
    data: orders = [],
    isLoading,
    isError,
    error
  } = useGetOrdersQuery();

  const filter = useSelector(state => state.orders.filter);
  
  const dispatch = useDispatch();

  const [searchOrder, setSearchOrder] = useState("");

  if (isLoading && !orders) {
    return <div className="flex justify-center items-center">
      <p className="font-bold">Loading orders...</p>
    </div> 
  }
  if (isError) return <p>Something went wrong, {error}</p>

  const filteredOrders = orders.filter(order => {
    const matchesStatus = 
      filter === "all"
        ? true
        : order.status === filter
    ;
    const matchesSearch =
      order.customerName
        .toLowerCase()
        .includes(searchOrder.toLowerCase())    
    ;
    return matchesStatus && matchesSearch
  })

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);

    const formattedDate = date.toLocaleDateString('en-US', {
      month: "short",
      day: "2-digit",
      year: "numeric"
    });

    const formattedTime = date.toLocaleTimeString('en-US', {
      hour: "numeric",
      minute: "2-digit",
      hour12: true
    }).replace('', '');

    return `${formattedDate} ${formattedTime}`;
  }

  const statusStyles = {
    pending: "bg-blue-100 text-blue-600",
    processing: "bg-amber-100 text-amber-600",
    delivered: "bg-green-100 text-green-600",
    cancelled: "bg-red-100 text-red-600",
  };

  const orderTotal = (items) => {
    return items.reduce((sum, item) => {
      return sum + (item.price * item.quantity)
    }, 0)
  }

  return (
    <section>
      <div className=" w-full px-3 shadow-lg">
        <div className="flex flex-col w-full"> 
          <div>
            <input
              type="text"
              placeholder="Search customer..."
              value={searchOrder}
              onChange={(e) => setSearchOrder(e.target.value)}
              className="border p-2 w-full sm:w-md md:w-md h-8 m-2 rounded-full"
            />
          </div>
          <div className="flex justify-between text-sm">
            <h2 className="font-semibold">Recent Orders</h2>
            <button className="text-blue-800">View all</button>
          </div>
          
          <div className="flex flex-row gap-2 text-xs sm:text-sm mb-2 mt-2 flex-wrap">
            <button 
              onClick={() => dispatch(setFilter("all"))}
              className="border border-blue-400 text-blue-800 py-1 px-3 rounded-md cursor-pointer"
            >
              All
            </button>
            <div className="flex bg-gray-100 gap-4 items-center px-2.5 p-1 rounded-md">
              <button
                className="cursor-pointer"
                onClick={() => dispatch(setFilter("pending"))}
              >
                Pending
              </button>
              <button
                className="cursor-pointer"
                onClick={() => dispatch(setFilter("processing"))}
              >
                Processing
              </button>
              <button
                className="cursor-pointer"
                onClick={() => dispatch(setFilter("delivered"))}
              >
                Delivered
              </button>
              <button
                className="sm:block cursor-pointer"
                onClick={() => dispatch(setFilter("cancelled"))}
              >
                Cancelled
              </button>
            </div>
          </div>
        </div>

        <div className="hidden md:grid md:grid-cols-[1fr_1.5fr_2fr_1fr_1fr_auto] p-2 bg-gray-400 mb-3">
          <div>Order ID</div>
          <div>Customer</div>
          <div>Date</div>
          <div>Total</div>
          <div>Status</div>
          <div>Action</div>
        </div>
        
        {
          filteredOrders.map(order => (
            <div 
              key={order.id} 
              
              className="grid grid-cols-[40%_auto] p-1 border-b border-b-gray-200 w-full md:hidden"
            >
              <div className="flex flex-col gap-2 p-1 justify-items-center text-xs sm:text-sm">
                <span className="font-semibold">#ORD-{order.id}</span>
                <span className="text-xs sm:text-sm">{order.customerName}</span>
              </div>
              <div className="grid grid-cols-[90%_auto] items-center text-xs sm:text-sm">
                <div className="flex flex-col gap-1 min-w-31">
                  <span>
                    {formatDateTime(order.createdAt)}
                  </span>
                  <div className="flex items-center gap-4 sm:gap-8 ">
                    <span
                      className={`
                      p-1 truncate text-xs rounded-lg
                      ${statusStyles[order.status]}
                    `}
                    >
                      {order.status}
                    </span>
                    <span>
                      ₦{orderTotal(order.items).toLocaleString()}
                    </span>
                  </div>
                </div>
                <div className="cursor-pointer">
                  <Link to={`/orders/${order.id}`} >
                    <button 
                      className="hidden sm:block text-[14px] text-blue-600 border border-blue-300 p-1 rounded-md cursor-pointer"
                    >
                      View
                    </button>
                    <ChevronRight className="sm:hidden w-5 border border-blue-300 p-1 rounded-md " color="blue" strokeWidth={2} />
                  </Link>
                </div>
              </div>
            </div>
          ))
        }

        {
          <div className="hidden md:block">

            {filteredOrders.map(order => (
              <div 
                key={order.id} 
                className="
                  grid grid-cols-[1fr_1.5fr_2fr_1fr_1fr_auto] p-2.5 
                  border-t border-gray-200 text-sm lg:text-[14px] items-center gap-3
                "
              >
                <span className="font-semibold">
                  #ORD-{order.id}
                </span>
                <span>{order.customerName}</span>
                <span className="lg:text-[14px] min-w-36">
                  {formatDateTime(order.createdAt)}
                </span>
                <span className="truncate">₦{orderTotal(order.items)}</span>
                <div className="flex items-center">
                  <span
                    className={`
                      py-1 px-2 truncate lg:text-[14px]  rounded-lg
                      ${statusStyles[order.status]}
                    `}
                  >
                    {order.status}
                  </span>
                </div>
                <div className="text-blue-600 lg:text-[14px] border border-purple-200 p-1 h-fit rounded-lg">View</div>
              </div>
            ))}
          </div> 
        }
      </div>
    </section>
  )
};

export default OrdersList;
