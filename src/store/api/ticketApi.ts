import { apiSlice } from "./apiSlice";

export const ticketApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getProjectTickets: builder.query({
      query: projectId => `/tickets/project/${projectId}`,
      providesTags: ["Tickets"],
    }),
    getTicketById: builder.query({
      query: ticketId => `/tickets/${ticketId}`,
      providesTags: (result, error, id) => [{ type: "Tickets", id }],
    }),
    createTicket: builder.mutation({
      query: body => ({
        url: "/tickets",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Tickets"],
    }),
    updateTicket: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/tickets/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Tickets"],
    }),
    deleteTicket: builder.mutation({
      query: id => ({
        url: `/tickets/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Tickets"],
    }),
  }),
});

export const {
  useGetProjectTicketsQuery,
  useGetTicketByIdQuery,
  useCreateTicketMutation,
  useUpdateTicketMutation,
  useDeleteTicketMutation,
} = ticketApi;
