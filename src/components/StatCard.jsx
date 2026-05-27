import { useGetOrdersQuery } from "../features/api/ordersApi";

const StatCard = () => {
  const {
    data: orders = []
  } = useGetOrdersQuery();

  const totalOrders = orders.length;
  const pendingOrders = orders.filter(order => order.status === "pending").length;
  const deliveredOrders = orders.filter(order => order.status === "delivered").length;


  const totalRevenue = orders.reduce((sum, order) => {

    if (order.status !== 'delivered') {
      return sum
    }

    const orderTotal = order.items.reduce((itemSum, item) => {
      return itemSum + (item.price * item.quantity)
    }, 0)

    return sum + orderTotal
  }, 0)

  return (
    <div>
      <div className="cards grid grid-cols-2 md:grid-cols-4 gap-4 mt-3 mb-4">
        <div className="shadow-md text-sm p-1 rounded-md min-w-0">
          <p>Total Orders</p>
          <h3>{totalOrders}</h3>
        </div>
        <div className="h-20 shadow-gray-300 text-sm shadow-md p-1 rounded-md">
          <p>Revenue</p>
          <h3>₦{totalRevenue.toLocaleString()}</h3>
        </div>
        <div className="h-20 shadow-gray-300 text-sm shadow-md p-1 rounded-md">
          <p>Pending</p>
          <h3>{pendingOrders.toLocaleString()}</h3>
        </div>
        <div className="h-20 shadow-gray-300 text-sm shadow-md p-1 rounded-md">
          <p>Delivered</p>
          <h3>{deliveredOrders.toLocaleString()}</h3>
        </div>
      </div>
    </div>
  )
}

export default StatCard;