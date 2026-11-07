import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@fontsource-variable/inter";
import "./index.css";
import App from "./App.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
    <ToastContainer
      position="top-right"
      autoClose={3500}
      hideProgressBar
      newestOnTop
      closeOnClick
      pauseOnHover
      theme="light"
      toastClassName="!rounded-xl !shadow-lg !text-sm !font-medium"
    />
  </StrictMode>
);
