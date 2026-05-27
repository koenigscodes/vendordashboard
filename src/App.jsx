import { Routes, Route } from "react-router-dom"

import OrdersPage from "./pages/OrdersPage"
import OrderDetails from "./pages/OrderDetails"

function App() {


  return (
    <Routes>
      <Route path="/" element={<OrdersPage />} />
      <Route path="/orders/:id" element={<OrderDetails />} />
    </Routes>
  )
}

export default App
