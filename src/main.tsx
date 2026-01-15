import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/context/AuthContext";
import { NotificationProvider } from "@/context/NotificationContext"; // 🔔 NEW
import { CrowdProvider } from "@/context/CrowdContext";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <NotificationProvider>
        <CrowdProvider>
          <App />
        </CrowdProvider>
      </NotificationProvider>
    </AuthProvider>
  </QueryClientProvider>
);
