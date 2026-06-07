import NavBar from "../components/NavBar"
import SideBar from "../components/SideBar"
import StatCards from "../components/StatCards"

import OrderItemsList from "../components/OrderItemsList"
import Analytics from "../components/Analytics"


const OrdersPage = () => {
  return (
    <section className="md:grid md:grid-cols-[minmax(80px,200px)_1fr] w-full">
      <SideBar />
      <div className="container p-4 max-w-full">
        <NavBar />
        <StatCards />
        <OrderItemsList />
        <Analytics />
      </div>
    </section>
  )
}

export default OrdersPage