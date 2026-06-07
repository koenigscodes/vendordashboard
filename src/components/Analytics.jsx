import { useGetOrdersQuery } from "../features/api/ordersApi"

import { calculateMetrics } from "../utils/MetricsCalc";

const Analytics = () => {
  const {
    data: response,
  } = useGetOrdersQuery();

  const orders = response?.data || [];

  const {
    pendingOrders,
    processingOrders,
    deliveredOrders,
    cancelledOrders,
    pendingPercentage,
    processingPercentage,
    deliveredPercentage,
    cancelledPercentage,
  } = calculateMetrics(orders);  
  
  const statusBreadown = [
    {
      label: "Pending",
      count: pendingOrders,
      percentage: pendingPercentage,
      color: "bg-blue-500"
    },
    {
      label: "Processing",
      count: processingOrders,
      percentage: processingPercentage,
      color: "bg-amber-500"
    },
    {
      label: "Delivered",
      count: deliveredOrders,
      percentage: deliveredPercentage,
      color: "bg-green-500"
    },
    {
      label: "Cancelled",
      count: cancelledOrders,
      percentage: cancelledPercentage,
      color: "bg-red-500"
    }
  ]  
      
  return (
    <div className="mt-5 p-3 rounded-b-md shadow-md">
      {statusBreadown.map(status => (
        <div className="mb-2" key={status.label}>
          <div className="bg-gray-100 h-2 w-full rounded-lg translation-all duration-500">
            <div 
              className={`${status.color} h-full rounded-lg`}
              style={{
                width: `${status.percentage}%`
              }}
            />
          </div>
          <p>{status.label} {status.count} ({status.percentage.toFixed(1)}%)</p>
        </div>
      ))}
    </div>
  )
}

export default Analytics;