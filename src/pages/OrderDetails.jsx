import { useParams, useNavigate} from "react-router-dom"
import { 
  useGetOrderByIdQuery, 
  useUpdateOrderMutation 
} from "../features/api/ordersApi";

import { ArrowLeft } from "lucide-react"

const OrderDetails = () => {

  const { id } = useParams();

  const navigate = useNavigate()

  const {
    data: order,
    isLoading,
    isError,
    error
  } = useGetOrderByIdQuery(
    id,
    {skip: !id}
  )

  const [
    updateOrder,
    {
      isLoading: isUpdating,
    }
  ] = useUpdateOrderMutation();

  const handleUpdateOrder = async (id, status) => {
    try {
      await updateOrder({
      id: id,
      status: status
    }).unwrap()
    } catch (error) {
      console.log(error);
    }
  }

  if (isLoading && !order) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-amber-600 text-xs rounded-full animate-spin"></div>
      </div>
    )
  }

  if (isError) {
    return (
      <p>
        Error loading order: {" "}
        {error?.data?.message || "Something wemt wrong, try again"}
      </p>
    )
  }
  
  const orderTotal = order?.items?.reduce((sum, item) => {
    return sum + (item.price * item.quantity)
  }, 0);

  return (
    <div className="relative">
      {(isUpdating && (
        <div 
          className="
            absolute inset-0
            bg-white/10
            backdrop-blur-xs
            flex justify-center 
            items-center h-screen
          "
        >
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 text-xs rounded-full animate-spin"></div>
        </div>
      ))}
      
      <div className="flex flex-col px-4 py-6 max-w-6xl mx-auto rounded">
        <span 
          className="flex items-center font-xs text-sm cursor-pointer mb-4"
          onClick={() => navigate("/")}
        >
          {<ArrowLeft size={12} />}
          back
        </span>

        <h1 className="font-bold text-xl">Order Details</h1>

        <div className="flex flex-col font-semibold gap-2 mt-4">
          <h1 className="text-lg">Order: #{order.id}</h1>

          <p>Name: {order.customerName}</p>
          <p>Order Status: {order.status} </p>
        </div>

        <div className="mt-4 shadow-lg">
          <div className="flex justify-center items-center border-b border-gray-400">
            <h2>Items</h2>
          </div>
          <div>
            {order.items.map(item => (
              <div
                key={item.name}
                className="border-b border-gray-300 mt-2 p-1"
              >
                <p>{item.name}</p>
                <div className="flex justify-between">
                  <span>₦{item.price } x {item.quantity}</span>
                  <span>₦{(item.price * item.quantity).toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-between my-6 shadow-xl p-2">
          <h2>
            Total
          </h2>
          <p>
            ₦{orderTotal.toLocaleString()}
          </p>
        </div>
        <div className="flex flex-col"> 
          <p className="font-bold">
            Mark as:
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {order.status !== "pending" && (
              <button 
                className="border border-blue-500 rounded p-1 cursor-pointer hover:bg-blue-600 hover:text-white"
                onClick={() => handleUpdateOrder(id, "pending")}
                disabled = {isUpdating}
              >
                {isUpdating ? "updating..." : "Pending"}
              </button>
            )}
            
            {order.status !== "processing" && (
              <button 
                className="border border-amber-600 rounded p-1 cursor-pointer  hover:bg-amber-600 hover:text-white"
                onClick={() => handleUpdateOrder(id, "processing")}
                disabled = {isUpdating}
              >
                {isUpdating ? "updating..." : "Processing"}
              </button>
            )}
            
            {order.status !== "delivered" && (
              <button 
                className="border border-green-600 rounded p-1 cursor-pointer  hover:bg-green-600 hover:text-white"
                onClick={() => handleUpdateOrder(id, "delivered")}
              >
                {isUpdating ? "updating..." : "Delivered"}
              </button>
            )}
            
            {order.status !== "cancelled" && (
              <button 
                className="border border-red-600 rounded p-1 cursor-pointer  hover:bg-red-600 hover:text-white"
                onClick={() => handleUpdateOrder(id, "cancelled")}
              >
                {isUpdating ? "updating..." : "Cancelled"}
              </button>
            )}
          </div>
        </div>  
      </div>
    </div>  
  )
}
export default OrderDetails;