import { configureStore } from "@reduxjs/toolkit";

import ordersReducer from '../features/orders/orderSlice';
import { ordersApi } from "../features/api/ordersApi";

export const store = configureStore({
  reducer: {
    orders: ordersReducer,
    [ordersApi.reducerPath]: ordersApi.reducer
  },

  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware().concat(ordersApi.middleware)
});