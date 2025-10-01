import { apiSlice } from "./api/apiSlice";

export const projectApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    createProject: builder.mutation<any, any>({
      query: data => ({
        url: "projects",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const { useCreateProjectMutation } = projectApi;
