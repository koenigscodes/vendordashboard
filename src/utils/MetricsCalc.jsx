export const calculateMetrics = (orders) => {
  const metrics = orders.reduce((acc, order) => {
    acc.totalOrders++

    const orderTotal = order.items.reduce((itemSum, item) => {
      return itemSum + (item.price * item.quantity)
    }, 0)
    
    acc.grossRevenue += orderTotal

    switch (order.status) {
      case "pending":
        acc.pendingOrders++;
        break;
      case "processing":
        acc.processingOrders++;
        break;
      case "delivered": 
        acc.deliveredOrders++;
        acc.deliveredRevenue += orderTotal;
        break;
      case "cancelled":
        acc.cancelledOrders++;
        break; 
      default:
        break;   
    }

    // acc.pendingPercentage = (acc.pendingOrders / acc.totalOrders) * 100;
    // acc.processingPercentage = (acc.processingOrders / acc.totalOrders) * 100;
    // acc.deliveredPercentage = (acc.deliveredOrders / acc.totalOrders) * 100;
    // acc.cancelledPercentage = (acc.cancelledOrders / acc.totalOrders) * 100;

    return acc;
  }, {
    totalOrders: 0,
    pendingOrders: 0,
    processingOrders: 0,
    deliveredOrders: 0,
    cancelledOrders: 0,
    grossRevenue: 0,
    deliveredRevenue: 0,
    // pendingPercentage: 0,
    // processingPercentage: 0,
    // deliveredPercentage: 0,
    // cancelledPercentage: 0,
  });

  const total = metrics.totalOrders

  metrics.pendingPercentage = 
    metrics.totalOrders > 0 
      ? (metrics.pendingOrders / total) * 100
      : 0;
  
  metrics.processingPercentage = 
    metrics.totalOrders > 0 
      ? (metrics.processingOrders / total) * 100
      : 0;    
  
  metrics.deliveredPercentage = 
    metrics.totalOrders > 0 
      ? (metrics.deliveredOrders / total) * 100
      : 0;
  
  metrics.cancelledPercentage = 
    metrics.totalOrders > 0 
      ? (metrics.cancelledOrders / total) * 100
      : 0;


  return metrics;
};



