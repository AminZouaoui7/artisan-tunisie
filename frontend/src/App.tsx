import { lazy, Suspense, useEffect, useState } from "react";
import { Navigate, Routes, Route, useLocation, useNavigate } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

const HomePage = lazy(() => import("./pages/HomePage"));
const ProductsPage = lazy(() => import("./pages/ProductsPage"));
const ProductDetailPage = lazy(() => import("./pages/ProductDetailPage"));
const OurStoryPage = lazy(() => import("./pages/OurStoryPage"));
const BoutiquePage = lazy(() => import("./pages/BoutiquePage"));
const ReservationPage = lazy(() => import("./pages/ReservationPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const RegisterPage = lazy(() => import("./pages/RegisterPage"));
const VerifyEmailPage = lazy(() => import("./pages/VerifyEmailPage"));
const SessionExpiredPage = lazy(() => import("./pages/SessionExpiredPage"));
const ArtisanatTunisiePage = lazy(() => import("./pages/ArtisanatTunisiePage"));
const TapisTunisiensPage = lazy(() => import("./pages/TapisTunisiensPage"));
const TapisArtisanalTunisiePage = lazy(() => import("./pages/TapisArtisanalTunisiePage"));
const TapisBerbereTunisiePage = lazy(() => import("./pages/TapisBerbereTunisiePage"));
const TapisLaineTunisiePage = lazy(() => import("./pages/TapisLaineTunisiePage"));
const TunisianRugsPage = lazy(() => import("./pages/TunisianRugsPage"));
const RugIntentPage = lazy(() => import("./pages/RugIntentPage"));
const BlogPage = lazy(() => import("./pages/BlogPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));
const CartPage = lazy(() => import("./pages/CartPage"));
const CheckoutPage = lazy(() => import("./pages/CheckoutPage"));
const AccountPage = lazy(() => import("./pages/AccountPage"));
const AccountDashboardPage = lazy(() => import("./pages/AccountDashboardPage"));
const AccountReservationsPage = lazy(() => import("./pages/AccountReservationsPage"));
const AccountOrdersPage = lazy(() => import("./pages/AccountOrdersPage"));

import ProtectedRoute from "./components/ProtectedRoute";
import SiteLoader from "./components/SiteLoader";
import ScrollToTop from "./components/ScrollToTop";
import AnalyticsPageView from "./components/AnalyticsPageView";

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

  const [isLoading, setIsLoading] = useState(true);

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
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    initializeApp();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = isLoading ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isLoading]);

  const hideFooterPages = [
    "/login",
    "/register",
    "/verify-email",
    "/session-expired",
  ];

  const hideFooter = hideFooterPages.includes(location.pathname);

  return (
    <>
      {isLoading && <SiteLoader isVisible={isLoading} />}

      <ScrollToTop />

      {!isLoading && (
        <div className="site-shell">
          <AnalyticsPageView />
          <Navbar />

          <div className="site-content">
            <Suspense fallback={<div className="site-page-loading" role="status">Chargement…</div>}>
              <Routes>
              <Route path="/" element={<HomePage />} />

              <Route path="/products" element={<ProductsPage />} />
              <Route path="/products/:slug" element={<ProductDetailPage />} />

              <Route path="/our-story" element={<OurStoryPage />} />

              <Route path="/boutique" element={<BoutiquePage />} />

              <Route path="/reservation" element={<ReservationPage />} />

              <Route path="/contact" element={<ContactPage />} />

              <Route
                path="/artisanat-de-la-tunisie"
                element={<ArtisanatTunisiePage />}
              />
              <Route path="/tapis-tunisiens" element={<TapisTunisiensPage />} />
              <Route
                path="/tapis-artisanal-tunisie"
                element={<TapisArtisanalTunisiePage />}
              />
              <Route
                path="/tapis-berbere-tunisie"
                element={<TapisBerbereTunisiePage />}
              />
              <Route
                path="/tapis-laine-tunisie"
                element={<TapisLaineTunisiePage />}
              />
              <Route path="/tunisian-rugs" element={<Navigate to="/en/tunisian-rugs" replace />} />
              <Route path="/en/tunisian-rugs" element={<TunisianRugsPage />} />
              <Route path="/margoum" element={<RugIntentPage pathname="/margoum" />} />
              <Route path="/kilim" element={<RugIntentPage pathname="/kilim" />} />
              <Route path="/tapis-noue" element={<RugIntentPage pathname="/tapis-noue" />} />
              <Route path="/en/handmade-rugs" element={<RugIntentPage pathname="/en/handmade-rugs" />} />
              <Route path="/en/berber-rugs" element={<RugIntentPage pathname="/en/berber-rugs" />} />
              <Route path="/en/kilim-rugs" element={<RugIntentPage pathname="/en/kilim-rugs" />} />
              <Route path="/en/margoum-rugs" element={<RugIntentPage pathname="/en/margoum-rugs" />} />
              <Route path="/tapis-tunisien" element={<Navigate to="/tapis-tunisiens" replace />} />
              <Route path="/tapis-berbere" element={<Navigate to="/tapis-berbere-tunisie" replace />} />
              <Route path="/tapis-laine" element={<Navigate to="/tapis-laine-tunisie" replace />} />
              <Route path="/blog" element={<BlogPage />} />

              <Route path="/login" element={<LoginPage />} />

              <Route path="/register" element={<RegisterPage />} />

              <Route path="/verify-email" element={<VerifyEmailPage />} />

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
                <Route index element={<AccountDashboardPage />} />

                <Route path="orders" element={<AccountOrdersPage />} />

                <Route
                  path="reservations"
                  element={<AccountReservationsPage />}
                />

                <Route
                  path="price-requests"
                  element={
                    <AccountComingSoonPage titleKey="account.nav.priceRequests" />
                  }
                />

                <Route path="settings" element={<AccountDashboardPage />} />
              </Route>

              <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </Suspense>
          </div>

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
