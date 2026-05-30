import { useGetOrdersQuery } from "../features/api/ordersApi";
import { setFilter } from "../features/orders/orderSlice";

import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";

import { useState } from "react";

import { ChevronRight } from "lucide-react";

const OrdersList = () => {
  const [page, setPage] = useState(1)
  const {
    data: response,
    isLoading,
    isError,
    error
  } = useGetOrdersQuery(page);

  const orders = response?.data || [];

  const filter = useSelector(state => state.orders.filter);
  
  const dispatch = useDispatch();

  const [searchOrder, setSearchOrder] = useState("");
  const [sortBy, setSortBy] = useState("newest");

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

  const sortedOrders = [...filteredOrders].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return (
          new Date(b.createdAt) - new Date(a.createdAt)
        )

      case 'oldest':
        return (
          new Date(a.createdAt) - new Date(b.createdAt)
        )
      
      case 'highest': {
        const totalA = a.items.reduce((sum, item) => {
          return sum + item.price * item.quantity
        }, 0)

        const totalB = b.items.reduce((sum, item) => {
          return sum + item.price * item.quantity
        }, 0)

        return totalB - totalA
      }
      
      case 'lowest': {
        const totalA = a.items.reduce((sum, item) => {
          return sum + item.price * item.quantity
        }, 0)

        const totalB = b.items.reduce((sum, item) => {
          return sum + item.price * item.quantity
        }, 0)

        return totalA- totalB
      }
      default:
        return 0
    }
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
      <div className=" w-full px-3 shadow-xl rounded-b-md">
        <div className="flex flex-col w-full"> 
          <div className="flex flex-wrap justify-between items-center">
            <input
              type="text"
              placeholder="Search customer..."
              value={searchOrder}
              onChange={(e) => setSearchOrder(e.target.value)}
              className="border p-2 w-full sm:w-md md:w-md h-8 m-2 rounded-full"
            />
            <div className="flex items-center text-sm">
              <h3>Sortby</h3>
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border h-8 p-1 m-2 text-xs rounded-full"
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="highest">Highest Price</option>
                <option value="lowest">Lowest Price</option>
              </select>
            </div>
            
          </div>
          <div className="flex justify-between text-sm">
            <h2 className="font-semibold">Recent Orders</h2>
            <button className="text-blue-800">View all</button>
          </div>
          
          <div className="flex flex-row gap-2 text-xs sm:text-sm mb-2 mt-2 flex-wrap">
            <button 
              onClick={() => {
                  return (
                    dispatch(setFilter("all")),
                    setPage(1)
                  )
                }}
              className="border border-black text-blue-800 py-1 px-3 rounded-md cursor-pointer"
            >
              All
            </button>
            <div className="flex bg-gray-100 gap-4 items-center px-2.5 p-1 rounded-md">
              <button
                className="cursor-pointer"
                onClick={() => {
                  return (
                    dispatch(setFilter("pending")),
                    setPage(1)
                  )
                }}
              >
                Pending
              </button>
              <button
                className="cursor-pointer"
                onClick={() => {
                  return (
                    dispatch(setFilter("processing")),
                    setPage(1)
                  )
                }}
              >
                Processing
              </button>
              <button
                className="cursor-pointer"
                onClick={() => {
                  return (
                    dispatch(setFilter("delivered")),
                    setPage(1)
                  )
                }}
              >
                Delivered
              </button>
              <button
                className="sm:block cursor-pointer"
                onClick={() => {
                  return (
                    dispatch(setFilter("cancelled")),
                    setPage(1)
                  )
                }}
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
        
        {sortedOrders.length > 0 ? (
          sortedOrders.map(order => (
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
        ) : (
          <div className="flex justify-center items-center font-semibold py-10">
            <p>Order not found</p>
          </div>
        )}

        {
          <div className="hidden md:block">

            {sortedOrders.length > 0 ? (
              sortedOrders.map(order => (
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
              ))  
            ) : (
              <div className="flex justify-center items-center font-semibold py-10">
                <p>Order not found</p>
              </div>
            )}
          </div> 
        }
        <div className="flex justify-center items-center text-xs gap-2 mt-3">
          <button
            onClick={() => setPage(prev => prev - 1)}
            disabled={!response?.prev}
            className="border px-2 py-1 mb-2 rounded cursor-pointer"
          >
            Prev
          </button>

          <span className="mb-2">
            Page {page}
          </span>

          <button
            onClick={() => setPage(prev => prev + 1)}
             disabled={!response?.next}
            className="border px-2 py-1 mb-2 rounded cursor-pointer"
          >
            Next
          </button>
        </div>
      </div>
    </section>
  )
};

export default OrdersList;
