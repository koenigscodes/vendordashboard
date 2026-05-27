import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const ordersApi = createApi({
  reducerPath: 'ordersApi',

  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:5000'
  }),
  tagTypes: ['Orders'],
  endpoints: (builder) => ({
    getOrders: builder.query({
      query: () => '/orders',
      providesTags: (result) => 
        result
          ? [
              ...result.map(order => ({
                type: 'Orders',
                id: String(order.id)
              })),

              { type: 'Orders', id: 'LIST' }
            ]
          : [{ type: 'Orders', id: 'LIST' }]  
    }),
    getOrderById: builder.query({
      query: (id) => `/orders/${id}`,
      providesTags: (result, error, id) => [
        {type: 'Orders', id: String(id)}
      ]
    }),
    updateOrder: builder.mutation({
      query: ({ id, status }) => ({
        url: `/orders/${id}`,
        method: 'PATCH', 
        body: { status }
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        const patchOrderDetails = dispatch(
          ordersApi.util.updateQueryData(
            'getOrderById',
            arg.id,
            (draft) => {
              draft.status = arg.status
            }
          )
        )
        const patchOrderList = dispatch(
          ordersApi.util.updateQueryData(
            'getOrders', 
            undefined,
            (draft) => {
              const order =  draft.find(
                order => order.id === arg.id
              )
              if (order) {
                order.status = arg.status
              }
            }
          )
        )
        try {
          await queryFulfilled
        } catch (error) {
          patchOrderDetails.undo()
          patchOrderList.undo()

          console.log(error);
        }
      }
    }),
  })
})

export const {
  useGetOrdersQuery,
  useGetOrderByIdQuery,
  useUpdateOrderMutation
} = ordersApi;