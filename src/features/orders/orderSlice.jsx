import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  filter: 'pending', 
  selectedOrderId: null
};

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    setFilter: (state, action) => {
      state.filter = action.payload;
    }, 
    setSelectedOrder: (state, action) => {
      state.selectedOrderId = action.payload;
    }
  }
});

export const {
  setFilter,
  setSelectedOrder
} = orderSlice.actions;

export default orderSlice.reducer;