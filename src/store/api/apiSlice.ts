import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5001/api",
    credentials: "include",
    prepareHeaders: headers => {
      headers.set("Accept", "application/json");
      headers.set("Cache-Control", "no-store");
      return headers;
    },
  }),
  tagTypes: ["User"],
  endpoints: () => ({}),
});
