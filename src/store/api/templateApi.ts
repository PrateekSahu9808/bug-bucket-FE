import { apiSlice } from "./apiSlice";

export const templateApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getProjectTemplates: builder.query({
      query: projectId => `/templates/project/${projectId}`,
      providesTags: ["Templates"],
    }),
    createTemplate: builder.mutation({
      query: body => ({
        url: "/templates",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Templates"],
    }),
    updateTemplate: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/templates/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Templates"],
    }),
    deleteTemplate: builder.mutation({
      query: id => ({
        url: `/templates/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Templates"],
    }),
  }),
});

export const {
  useGetProjectTemplatesQuery,
  useCreateTemplateMutation,
  useUpdateTemplateMutation,
  useDeleteTemplateMutation,
} = templateApi;
