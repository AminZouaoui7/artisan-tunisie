import { useEffect, useState } from "react";
import { NavLink, Outlet } from "react-router-dom";

import {
  UserRound,
  ShieldCheck,
  LogOut,
  ShoppingBag,
  CalendarDays,
  LayoutDashboard,
  Settings,
} from "lucide-react";

import { useAuth } from "../context/useAuth";
import { useI18n } from "../i18n/i18n";
import {
  getStoredUserLocation,
  type UserLocationDto,
} from "../services/apiClient";
import "../styles/AccountPage.css";

export default function AccountPage() {
  const { t } = useI18n();
  const { user, logout } = useAuth();

  const [visitorLocation, setVisitorLocation] = useState<UserLocationDto>(
    () => getStoredUserLocation()
  );
  const [locationReady, setLocationReady] = useState<boolean>(() => {
    const initial = getStoredUserLocation();
    return Boolean(initial.countryCode);
  });

  useEffect(() => {
    const refreshFromStorage = () => {
      const next = getStoredUserLocation();
      setVisitorLocation(next);
      if (next.countryCode) {
        setLocationReady(true);
      }
    };

    const handleLocationChanged = () => refreshFromStorage();
    window.addEventListener("artisan:location-changed", handleLocationChanged);

    const initial = getStoredUserLocation();
    if (initial.countryCode) {
      setVisitorLocation(initial);
      setLocationReady(true);
    } else {
      let attempts = 0;
      const intervalId = window.setInterval(() => {
        attempts += 1;
        const current = getStoredUserLocation();
        if (current.countryCode) {
          setVisitorLocation(current);
          setLocationReady(true);
          window.clearInterval(intervalId);
        } else if (attempts >= 40) {
          window.clearInterval(intervalId);
          setLocationReady(true);
        }
      }, 50);
    }

    return () => {
      window.removeEventListener(
        "artisan:location-changed",
        handleLocationChanged
      );
    };
  }, []);

  const isTunisia = visitorLocation.isTunisia === true;

  return (
    <section className="account-page">
      <div className="account-layout">
        <aside className="account-sidebar">
          <div className="account-avatar">
            <UserRound size={30} />
          </div>

          <p className="account-kicker">{t("account.kicker")}</p>
          <h2>
            {t("account.title")} <em>{user?.firstName}</em>
          </h2>

          <span>{user?.email}</span>

          <div className="account-badge">
            <ShieldCheck size={13} />
            {t("account.sidebar.verified")}
          </div>

          <nav className="account-sidebar-nav">
            <NavLink to="/account" end>
              <LayoutDashboard size={15} />
              {t("account.nav.dashboard")}
            </NavLink>

            {locationReady && !isTunisia && (
              <NavLink to="/account/orders">
                <ShoppingBag size={15} />
                {t("account.nav.orders")}
              </NavLink>
            )}

            <NavLink to="/account/reservations">
              <CalendarDays size={15} />
              {t("account.nav.reservations")}
            </NavLink>

            <NavLink to="/account/settings">
              <Settings size={15} />
              {t("account.nav.settings")}
            </NavLink>
          </nav>

          <button className="account-logout-btn" onClick={logout}>
            <LogOut size={14} />
            {t("account.nav.logout")}
          </button>
        </aside>

        <div className="account-content">
          <Outlet />
        </div>
      </div>
    </section>
  );
}
