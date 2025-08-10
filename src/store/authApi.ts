import { apiSlice } from "./api/apiSlice";

type SignupRequest = {
  name: string;
  email: string;
  password: string;
};

type LoginResponse = {
  message: string;
  responseCode: number;
  user: {
    id: string;
    name: string;
    email: string;
  };
};
type LogoutResponse = {
  message: string;
};
export const authApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    signup: builder.mutation<LoginResponse, SignupRequest>({
      query: credentials => ({
        url: "/auth/signup",
        method: "POST",
        body: credentials,
      }),
    }),
    login: builder.mutation<any, any>({
      query: credentials => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
    }),
    logout: builder.mutation<LogoutResponse, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
        body: {},
      }),
    }),
  }),
});

export const { useSignupMutation, useLoginMutation, useLogoutMutation } =
  authApi;
