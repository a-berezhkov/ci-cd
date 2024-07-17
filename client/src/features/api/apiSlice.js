import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  reducerPath: "api", // Добавление редюсера в стейт (по дефолту)
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  endpoints: (builder) => ({
    getTodos: builder.query({
      query: () => "/todos",
    }),
    postTodos: builder.mutation({
        query: () => ({
            url: `/todos`,
            method: 'POST',
           // body,
        }),
      }),
  }),
});

export const { useGetTodosQuery } = apiSlice;
