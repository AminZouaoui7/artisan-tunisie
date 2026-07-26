import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";

import App from "./App";
import { AuthProvider } from "./context/AuthContext.tsx";
import { CartProvider } from "./context/CartContext";
import { CurrencyProvider } from "./context/CurrencyContext";
import { initializeGoogleAnalytics } from "./services/analytics";

import "./index.css";

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const rootElement = document.getElementById("root")!;

initializeGoogleAnalytics();

if (rootElement.hasAttribute("data-seo-prerendered")) {
  rootElement.replaceChildren();
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={googleClientId}>
      <BrowserRouter>
        <CurrencyProvider>
          <AuthProvider>
            <CartProvider>
              <App />
            </CartProvider>
          </AuthProvider>
        </CurrencyProvider>
      </BrowserRouter>
    </GoogleOAuthProvider>
  </React.StrictMode>
);
