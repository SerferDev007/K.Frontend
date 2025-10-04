import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.tsx";
import { AuthProvider } from "./contexts/authProvider.tsx";
import { Toaster } from "react-hot-toast";
import "./i18n";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <AuthProvider>
      <App />
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          style: {
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxWidth: "500px",
            fontSize: "18px",
            padding: "16px 24px",
            borderRadius: "12px",
            color: "#fff",
            boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
          },
          // Dynamic colors
          success: {
            style: {
              background: "green",
            },
          },
          error: {
            style: {
              background: "red",
            },
          },
          loading: {
            style: {
              background: "blue",
              color: "#000",
            },
          },
          duration: 3000, // stay for 3 seconds
        }}
      />
    </AuthProvider>
  </BrowserRouter>
);
