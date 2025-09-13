import React from "react";
import { RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./App.css";
import { router } from "./router";

const queryClient = new QueryClient({
  // Query 캐시, 리트라이 등 옵션 필요시 여기에…
});

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
};

export default App;
