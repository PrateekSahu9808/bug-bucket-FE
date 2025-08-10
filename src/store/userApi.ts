import { apiSlice } from "./api/apiSlice";

export const userApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    profile: builder.query<any, void>({
      query: () => ({
        url: "users/profile",
        credentials: "include",
      }),
    }),
  }),
});

export const { useProfileQuery } = userApi;
