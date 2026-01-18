import { apiSlice } from "./api/apiSlice";

export const projectApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    createProject: builder.mutation<any, any>({
      query: data => ({
        url: "projects",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Project"],
    }),
    getProjects: builder.query<any, void>({
      query: () => "projects",
      providesTags: ["Project"],
    }),
    getProjectById: builder.query<any, string>({
      query: id => `projects/${id}`,
      providesTags: ["Project"],
    }),
    updateProject: builder.mutation<any, { id: string; data: any }>({
      query: ({ id, data }) => ({
        url: `projects/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Project"],
    }),
    deleteProject: builder.mutation<any, string>({
      query: id => ({
        url: `projects/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Project"],
    }),
  }),
});

export const {
  useCreateProjectMutation,
  useGetProjectsQuery,
  useGetProjectByIdQuery,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
} = projectApi;
