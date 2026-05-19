import { NavLink, Link, useLocation } from "react-router-dom";
import { useState, useEffect, Fragment } from "react";
import {
  UserRound,
  LogOut,
  ShoppingBag,
  Settings,
  CalendarDays,
} from "lucide-react";

import "../styles/Navbar.css";
import logoMain from "../assets/color white.png";
import { useI18n } from "../i18n/i18n";
import { useAuth } from "../context/useAuth";
import { useCart } from "../context/useCart";
import { getStoredUserLocation } from "../services/apiClient";

export default function Navbar() {
  const location = useLocation();
  const { language, setLanguage, t } = useI18n();
  const { user, isAuthenticated, logout } = useAuth();
  const { cartCount } = useCart();

  const [visitorLocation, setVisitorLocation] = useState(() =>
    getStoredUserLocation()
  );

  const canUseCart = isAuthenticated && !visitorLocation.isTunisia;

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 18);
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = menuOpen ? "hidden" : "";
    document.body.style.overflow = menuOpen ? "hidden" : "";

    return () => {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    setMenuOpen(false);
    setAccountOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleLocationChanged = () => {
      setVisitorLocation(getStoredUserLocation());
    };

    window.addEventListener("artisan:location-changed", handleLocationChanged);

    return () => {
      window.removeEventListener(
        "artisan:location-changed",
        handleLocationChanged
      );
    };
  }, []);

  const links = [
    { to: "/", label: t("nav.home") },
    { to: "/our-story", label: t("nav.ourStory") },
    { to: "/boutique", label: "Notre boutique" },
    { to: "/products", label: t("nav.products") },
    { to: "/reservation", label: t("nav.reservation") },
    { to: "/contact", label: t("nav.contact") },
  ];

  const askLogout = () => {
    setAccountOpen(false);
    setLogoutConfirmOpen(true);
  };

  const confirmLogout = () => {
    logout();
    setAccountOpen(false);
    setMenuOpen(false);
    setLogoutConfirmOpen(false);
  };

  const cancelLogout = () => {
    setLogoutConfirmOpen(false);
  };

  return (
    <>
      <header className={`nb ${scrolled ? "nb--scrolled" : ""}`}>
        <div className="nb__inner">
          <NavLink
            to="/"
            className="nb__logo"
            onClick={() => setMenuOpen(false)}
          >
            <img
              className="nb__logo-image"
              src={logoMain}
              alt="L’ARTISAN DE LA MÉDINA"
            />

            <span className="nb__logo-text">L’ARTISAN DE LA MÉDINA</span>
          </NavLink>

          <nav className="nb__nav" aria-label={t("common.mainNavigation")}>
            <div className="nb__pill">
              {links.map(({ to, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === "/"}
                  className={({ isActive }) =>
                    `nb__link${isActive ? " nb__link--active" : ""}`
                  }
                >
                  <span className="nb__link-text">{label}</span>
                </NavLink>
              ))}
            </div>
          </nav>

          <div className="nb__right">
            {canUseCart && (
              <Link
                to="/cart"
                className="nb__cart"
                aria-label={t("nav.cartAria")}
                onClick={() => setMenuOpen(false)}
              >
                <ShoppingBag size={17} />

                {cartCount > 0 && (
                  <span className="nb__cart-count">{cartCount}</span>
                )}
              </Link>
            )}

            <div
              className="nb__lang"
              role="group"
              aria-label={t("common.languageSwitch")}
            >
              {(["FR", "EN"] as const).map((l, i) => (
                <Fragment key={l}>
                  {i === 1 && (
                    <span className="nb__lang-sep" aria-hidden="true" />
                  )}

                  <button
                    type="button"
                    className={`nb__lang-btn${
                      language === l ? " nb__lang-btn--active" : ""
                    }`}
                    onClick={() => setLanguage(l)}
                    aria-pressed={language === l}
                  >
                    {l}
                  </button>
                </Fragment>
              ))}
            </div>

            {!isAuthenticated ? (
              <div className="nb__auth">
                <Link to="/login" className="nb__auth-login">
                  {t("nav.login")}
                </Link>

                <Link to="/register" className="nb__auth-register">
                  {t("nav.register")}
                </Link>
              </div>
            ) : (
              <div className="nb__account">
                <button
                  type="button"
                  className="nb__account-btn"
                  onClick={() => setAccountOpen((v) => !v)}
                  aria-label={t("account.common.accountMenuLabel")}
                >
                  <UserRound size={18} />
                  <span>{user?.firstName?.[0] ?? "C"}</span>
                </button>

                {accountOpen && (
                  <div className="nb__account-menu">
                    <div className="nb__account-head">
                      <strong>
                        {user?.firstName} {user?.lastName}
                      </strong>
                      <small>{user?.email}</small>
                    </div>

                    <Link
                      to="/account"
                      className="nb__account-item"
                      onClick={() => setAccountOpen(false)}
                    >
                      <Settings size={16} />
                      {t("account.nav.dashboard")}
                    </Link>

                    <Link
                      to="/account/reservations"
                      className="nb__account-item"
                      onClick={() => setAccountOpen(false)}
                    >
                      <CalendarDays size={16} />
                      {t("account.reservations.title")}
                    </Link>

                    <Link
                      to="/account/orders"
                      className="nb__account-item"
                      onClick={() => setAccountOpen(false)}
                    >
                      <ShoppingBag size={16} />
                      {t("account.ordersTitle")}
                    </Link>

                    <button
                      type="button"
                      className="nb__account-item nb__account-logout"
                      onClick={askLogout}
                    >
                      <LogOut size={16} />
                      {t("account.nav.logout")}
                    </button>
                  </div>
                )}
              </div>
            )}

            <button
              type="button"
              className={`nb__burger${menuOpen ? " nb__burger--open" : ""}`}
              onClick={() => setMenuOpen((v) => !v)}
              aria-label={
                menuOpen ? t("common.closeMenu") : t("common.openMenu")
              }
              aria-expanded={menuOpen}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>

      <div
        className={`nb__drawer${menuOpen ? " nb__drawer--open" : ""}`}
        aria-hidden={!menuOpen}
      >
        <nav className="nb__drawer-nav">
          {links.map(({ to, label }, i) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              className={({ isActive }) =>
                `nb__drawer-link${isActive ? " nb__drawer-link--active" : ""}`
              }
              style={{ "--i": i } as React.CSSProperties}
              onClick={() => setMenuOpen(false)}
            >
              <span className="nb__drawer-num">0{i + 1}</span>
              {label}
            </NavLink>
          ))}

          {canUseCart && (
            <NavLink
              to="/cart"
              className="nb__drawer-link"
              onClick={() => setMenuOpen(false)}
            >
              <span className="nb__drawer-num">07</span>
              {t("nav.cart")} {cartCount > 0 ? `(${cartCount})` : ""}
            </NavLink>
          )}

          {!isAuthenticated ? (
            <>
              <NavLink
                to="/login"
                className="nb__drawer-link"
                onClick={() => setMenuOpen(false)}
              >
                <span className="nb__drawer-num">07</span>
                {t("auth.common.loginNav")}
              </NavLink>

              <NavLink
                to="/register"
                className="nb__drawer-link"
                onClick={() => setMenuOpen(false)}
              >
                <span className="nb__drawer-num">08</span>
                {t("auth.common.registerNav")}
              </NavLink>
            </>
          ) : (
            <>
              <NavLink
                to="/account"
                className="nb__drawer-link"
                onClick={() => setMenuOpen(false)}
              >
                <span className="nb__drawer-num">
                  {canUseCart ? "08" : "07"}
                </span>
                {t("account.nav.dashboard")}
              </NavLink>

              <NavLink
                to="/account/reservations"
                className="nb__drawer-link"
                onClick={() => setMenuOpen(false)}
              >
                <span className="nb__drawer-num">
                  {canUseCart ? "09" : "08"}
                </span>
                {t("account.reservations.title")}
              </NavLink>

              <NavLink
                to="/account/orders"
                className="nb__drawer-link"
                onClick={() => setMenuOpen(false)}
              >
                <span className="nb__drawer-num">
                  {canUseCart ? "10" : "09"}
                </span>
                {t("account.ordersTitle")}
              </NavLink>

              <button
                type="button"
                className="nb__drawer-logout"
                onClick={askLogout}
              >
                {t("account.nav.logout")}
              </button>
            </>
          )}
        </nav>

        <div className="nb__drawer-foot">
          <div className="nb__lang nb__lang--drawer">
            {(["FR", "EN"] as const).map((l, i) => (
              <Fragment key={l}>
                {i === 1 && <span className="nb__lang-sep" />}

                <button
                  type="button"
                  className={`nb__lang-btn${
                    language === l ? " nb__lang-btn--active" : ""
                  }`}
                  onClick={() => setLanguage(l)}
                >
                  {l}
                </button>
              </Fragment>
            ))}
          </div>

          <p className="nb__drawer-tagline">{t("nav.drawerTagline")}</p>
        </div>
      </div>

      {menuOpen && (
        <div
          className="nb__backdrop"
          onClick={() => setMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {logoutConfirmOpen && (
        <div className="nb__logout-modal-backdrop" role="presentation">
          <div
            className="nb__logout-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="logout-confirm-title"
          >
            <h3 id="logout-confirm-title">Déconnexion</h3>
            <p>Voulez-vous vraiment vous déconnecter ?</p>

            <div className="nb__logout-actions">
              <button
                type="button"
                className="nb__logout-cancel"
                onClick={cancelLogout}
              >
                Annuler
              </button>

              <button
                type="button"
                className="nb__logout-confirm"
                onClick={confirmLogout}
              >
                Oui, me déconnecter
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}