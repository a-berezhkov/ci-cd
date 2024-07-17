// ./main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

import Root from "./app/Root";
import CounterPage from "./pages/CounterPage";
import ToDoPage from "./pages/ToDoPage";
import NotFoundPage from "./pages/NotFoundPage";
import Auth from "./pages/AuthPage";
import { UserProvider } from "./context/userContext";
import RegPage from "./pages/RegPage";
import ToDoItemPage from "./pages/ToDoItemPage";
 
const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <UserProvider>
        <Root />
      </UserProvider>
    ),
    errorElement: <NotFoundPage />,
    children: [
      {
        path: "/",
        element: <ToDoPage />,
      },
      {
        path: "counter",
        element: <CounterPage />,
      },
      {
        path: "todolist",
        element: <ToDoPage />,
      },
      {
        path: "todoitem/:id",
        element: <ToDoItemPage/>,
      },
      {
        path: "auth",
        element: <Auth />,
      },
      {
        path: "reg",
        element: <RegPage />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);
