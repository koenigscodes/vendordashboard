import { useGetOrdersQuery } from "../features/api/ordersApi";

const StatCards = () => {
  const {
    data: response,
  } = useGetOrdersQuery();

  const orders = response?.data || [];

  const metrics = orders.reduce((acc, order) => {
    const isDelivered = order.status === "delivered"

      if (order.status === "pending") {
        acc.pendingOrders++
      }

      if (isDelivered) {
        acc.deliveredOrders++
      }

      acc.totalOrders++

      const orderTotal = order.items.reduce((itemSum, item) => {
        return itemSum + (item.price * item.quantity)
      }, 0)

      if (isDelivered) {
        acc.deliveredRevenue += orderTotal
      }

      acc.grossRevenue += orderTotal


      
      return acc

    }, {
      totalOrders: 0,
      pendingOrders: 0,
      deliveredOrders:0,
      deliveredRevenue:0,
      grossRevenue: 0
    })

    const {
      pendingOrders,
      deliveredOrders,
      totalOrders,
      deliveredRevenue,
    } = metrics

  return (
    <div>
      <div className="cards grid grid-cols-2 md:grid-cols-4 gap-4 mt-3 mb-4">
        <div className="shadow-md text-sm p-1 rounded-md min-w-0">
          <p>Total Orders</p>
          <h3>{totalOrders}</h3>
        </div>
        <div className="h-20 shadow-gray-300 text-sm shadow-md p-1 rounded-md">
          <p>Revenue</p>
          <h3>₦{deliveredRevenue.toLocaleString()}</h3>
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

export default StatCards;