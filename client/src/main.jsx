import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { AuthProvider } from "../AuthContext.jsx";
import "./index.css";
import "tailwindcss/tailwind.css";
import { ToastContainer } from "react-toastify";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <ToastContainer />
      <App />
    </AuthProvider>
  </React.StrictMode>
);
