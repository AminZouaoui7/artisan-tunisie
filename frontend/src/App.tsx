

import { useEffect, useState } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import HomePage from "./pages/HomePage";
import ProductsPage from "./pages/ProductsPage";
import OurStoryPage from "./pages/OurStoryPage";
import ReservationPage from "./pages/ReservationPage";
import ContactPage from "./pages/ContactPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import VerifyEmailPage from "./pages/VerifyEmailPage";
import SessionExpiredPage from "./pages/SessionExpiredPage";

import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";

import AccountPage from "./pages/AccountPage";
import AccountDashboardPage from "./pages/AccountDashboardPage";
import AccountReservationsPage from "./pages/AccountReservationsPage";
import AccountOrdersPage from "./pages/AccountOrdersPage";

import ProtectedRoute from "./components/ProtectedRoute";
import SiteLoader from "./components/SiteLoader";
import ScrollToTop from "./components/ScrollToTop";

import { I18nProvider, useI18n } from "./i18n/i18n";

import {
  cleanupVisitorLocationStorage,
  fetchAndStoreUserLocation,
} from "./services/apiClient";

import "./App.css";

function AccountComingSoonPage({ titleKey }: { titleKey: string }) {
  const { t } = useI18n();

  return (
    <div className="account-card">
      <div className="account-card-head">
        <h3>{t(titleKey)}</h3>
      </div>

      <div className="account-card-divider" />

      <div style={{ padding: "0 32px 32px" }}>
        <p>{t("account.comingSoon")}</p>
      </div>
    </div>
  );
}

function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const protectedPrefixes = ["/account"];
    const protectedRoutes = ["/cart", "/checkout"];

    const handleSessionExpired = (event: Event) => {
      const customEvent = event as CustomEvent<{
        pathname?: string;
        requestMethod?: string;
      }>;

      const pathname = customEvent.detail?.pathname || window.location.pathname;
      const requestMethod = customEvent.detail?.requestMethod || "GET";
      const isProtectedPage =
        protectedRoutes.includes(pathname) ||
        protectedPrefixes.some((prefix) => pathname.startsWith(prefix));
      const isProtectedAction = requestMethod !== "GET";

      if (isProtectedPage || isProtectedAction) {
        navigate("/session-expired", { replace: true });
      }
    };

    window.addEventListener("artisan:session-expired", handleSessionExpired);

    return () => {
      window.removeEventListener(
        "artisan:session-expired",
        handleSessionExpired
      );
    };
  }, [navigate]);

  useEffect(() => {
    let isMounted = true;

    async function initializeApp() {
      try {
        cleanupVisitorLocationStorage();
        await fetchAndStoreUserLocation();
      } catch (error) {
        console.error("Erreur chargement localisation :", error);
      } finally {
        window.setTimeout(() => {
          if (isMounted) {
            setLoading(false);
          }
        }, 1200);
      }
    }

    initializeApp();

    return () => {
      isMounted = false;
    };
  }, []);

  const hideFooterPages = [
    "/login",
    "/register",
    "/verify-email",
    "/session-expired",
  ];

  const hideFooter = hideFooterPages.includes(location.pathname);

  return (
    <>
      <SiteLoader isVisible={loading} />

      <ScrollToTop />

      {!loading && (
        <div className="site-shell">
          <Navbar />

          <main className="site-content">
            <Routes>
              <Route path="/" element={<HomePage />} />

              <Route path="/products" element={<ProductsPage />} />

              <Route path="/our-story" element={<OurStoryPage />} />

              <Route path="/reservation" element={<ReservationPage />} />

              <Route path="/contact" element={<ContactPage />} />

              <Route path="/login" element={<LoginPage />} />

              <Route path="/register" element={<RegisterPage />} />

              <Route
                path="/verify-email"
                element={<VerifyEmailPage />}
              />

              <Route
                path="/session-expired"
                element={<SessionExpiredPage />}
              />

              <Route
                path="/cart"
                element={
                  <ProtectedRoute>
                    <CartPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/checkout"
                element={
                  <ProtectedRoute>
                    <CheckoutPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/account"
                element={
                  <ProtectedRoute>
                    <AccountPage />
                  </ProtectedRoute>
                }
              >
                <Route
                  index
                  element={<AccountDashboardPage />}
                />

                <Route
                  path="orders"
                  element={<AccountOrdersPage />}
                />

                <Route
                  path="reservations"
                  element={<AccountReservationsPage />}
                />

                <Route
                  path="price-requests"
                  element={
                    <AccountComingSoonPage
                      titleKey="account.nav.priceRequests"
                    />
                  }
                />

                <Route
                  path="settings"
                  element={<AccountDashboardPage />}
                />
              </Route>
            </Routes>
          </main>

          {!hideFooter && <Footer />}
        </div>
      )}
    </>
  );
}

export default function App() {
  return (
    <I18nProvider>
      <AppContent />
    </I18nProvider>
  );
}
