import { createBrowserRouter } from "react-router";
import { RouteError } from "./routes/RouteError";
import { Component as Shell } from "./routes/Shell";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Shell,
    ErrorBoundary: RouteError,
    children: [
      {
        ErrorBoundary: RouteError,
        children: [
          { index: true, lazy: () => import("./routes/Dashboard") },
          { path: "interview", lazy: () => import("./routes/Interview") },
          { path: ":course", lazy: () => import("./routes/Course") },
          { path: ":course/:topic", lazy: () => import("./routes/Topic") },
          { path: ":course/:topic/:challenge", lazy: () => import("./routes/Challenge") },
          { path: "*", lazy: () => import("./routes/NotFound") },
        ],
      },
    ],
  },
]);
