import NavBar from "../components/NavBar"
import SideBar from "../components/SideBar"
import StatCard from "../components/StatCard"

import OrderItemsList from "../components/OrderItemsList"


const OrdersPage = () => {
  return (
    <section className="md:grid md:grid-cols-[minmax(80px,200px)_1fr] w-full">
      <SideBar />
      <div className="container p-4 max-w-full">
        <NavBar />
        <StatCard />
        <OrderItemsList />
      </div>
    </section>
  )
}

export default OrdersPage