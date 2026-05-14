import { NavLink, Outlet } from "react-router-dom";

import {
  UserRound,
  ShieldCheck,
  LogOut,
  ShoppingBag,
  CalendarDays,
  MessageSquareQuote,
  LayoutDashboard,
  Settings,
} from "lucide-react";

import { useAuth } from "../context/useAuth";
import { useI18n } from "../i18n/i18n";
import "../styles/AccountPage.css";

function isTunisiaClient(user: any) {
  const countryValue = (
    user?.country ||
    user?.countryCode ||
    user?.detectedCountry ||
    user?.location ||
    ""
  )
    .toString()
    .trim()
    .toLowerCase();

  return ["tn", "tunisia", "tunisie", "تونس"].includes(countryValue);
}

export default function AccountPage() {
  const { t } = useI18n();
  const { user, logout } = useAuth();

  const isTunisia = isTunisiaClient(user);

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

            {!isTunisia && (
              <NavLink to="/account/orders">
                <ShoppingBag size={15} />
                {t("account.nav.orders")}
              </NavLink>
            )}

            <NavLink to="/account/reservations">
              <CalendarDays size={15} />
              {t("account.nav.reservations")}
            </NavLink>

            {isTunisia && (
              <NavLink to="/account/price-requests">
                <MessageSquareQuote size={15} />
                {t("account.nav.priceRequests")}
              </NavLink>
            )}

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
