import {
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";

import { Link, useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";

import { authService } from "../services/authService";
import { useAuth } from "../context/useAuth";
import { useI18n } from "../i18n/i18n";
import "../styles/RegisterPage.css";

type RegisterResponse = {
  email?: string;
  accessToken?: string;
  token?: string;
  refreshToken?: string;
  customer?: unknown;
  user?: unknown;
};

export default function RegisterPage() {
  useI18n();

  const navigate = useNavigate();
  const { loginWithGoogle } = useAuth();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleGoogleSuccess = async (accessToken: string) => {
    setError("");

    try {
      setGoogleLoading(true);

      await loginWithGoogle(accessToken);

      navigate("/", { replace: true });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Inscription Google impossible."
      );
    } finally {
      setGoogleLoading(false);
    }
  };

  const googleRegister = useGoogleLogin({
    flow: "implicit",
    scope: "openid email profile",
    onSuccess: async (tokenResponse) => {
      if (!tokenResponse.access_token) {
        setError("Token Google introuvable.");
        return;
      }

      await handleGoogleSuccess(tokenResponse.access_token);
    },
    onError: () => {
      setError("Connexion Google annulée ou impossible.");
      setGoogleLoading(false);
    },
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.firstName.trim() || !form.lastName.trim()) {
      setError("Veuillez saisir votre prénom et votre nom.");
      return;
    }

    if (!form.email.trim()) {
      setError("Veuillez saisir votre adresse email.");
      return;
    }

    if (form.password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    try {
      setLoading(true);

      const result = (await authService.register({
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim().toLowerCase(),
        phone: form.phone.trim() || undefined,
        password: form.password,
      })) as RegisterResponse;

      const accessToken = result.accessToken || result.token;

      if (accessToken) {
        localStorage.setItem("artisan_access_token", accessToken);
      }

      if (result.refreshToken) {
        localStorage.setItem("artisan_refresh_token", result.refreshToken);
      }

      const userData = result.customer || result.user;

      if (userData) {
        localStorage.setItem("artisan_user", JSON.stringify(userData));
      }

      window.dispatchEvent(new CustomEvent("artisan:auth-changed"));

      navigate("/", { replace: true });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Une erreur est survenue pendant la création du compte."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="register-page">
      <div className="register-visual">
        <div className="register-visual-corner" />

        <div className="register-visual-badge">
          <div className="register-visual-badge-dot" />
          <span>Artisanat tunisien</span>
        </div>

        <div className="register-visual-content">
          <h1>
            Rejoignez notre
            <br />
            <em>univers artisanal</em>
          </h1>

          <div className="register-visual-rule" />
        </div>
      </div>

      <div className="register-card">
        <div className="register-strip" />

        <div className="register-card-inner">
          <div className="register-card-kicker">
            <span>Espace client</span>
          </div>

          <h2 className="register-card-title">
            Créer
            <br />
            <em>un compte.</em>
          </h2>

          <p className="register-subtitle">
            Inscrivez-vous pour passer commande, réserver ou demander un prix.
          </p>

          {error && <div className="register-error">{error}</div>}

          <button
            type="button"
            className="register-google-btn"
            disabled={googleLoading || loading}
            onClick={() => googleRegister()}
          >
            {googleLoading && <span className="register-btn-spinner" />}

            {!googleLoading && (
              <svg
                className="google-svg"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 48 48"
                aria-hidden="true"
              >
                <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303C33.654 32.657 29.194 36 24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.27 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
                <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.27 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" />
                <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.143 35.091 26.715 36 24 36c-5.173 0-9.625-3.327-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
                <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-1.058 3.066-3.249 5.482-6.084 6.957l.003-.002 6.19 5.238C35.004 40.459 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" />
              </svg>
            )}

            {googleLoading
              ? "Connexion avec Google..."
              : "Continuer avec Google"}
          </button>

          <div className="register-divider">
            <span>ou</span>
          </div>

          <form onSubmit={handleSubmit} className="register-form">
            <div className="register-row">
              <div className="register-field">
                <input
                  id="firstName"
                  name="firstName"
                  placeholder=" "
                  value={form.firstName}
                  onChange={handleChange}
                  autoComplete="given-name"
                />
                <label htmlFor="firstName">Prénom</label>
              </div>

              <div className="register-field">
                <input
                  id="lastName"
                  name="lastName"
                  placeholder=" "
                  value={form.lastName}
                  onChange={handleChange}
                  autoComplete="family-name"
                />
                <label htmlFor="lastName">Nom</label>
              </div>
            </div>

            <div className="register-field">
              <input
                id="email"
                name="email"
                type="email"
                placeholder=" "
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
              />
              <label htmlFor="email">Adresse email</label>
            </div>

            <div className="register-field">
              <input
                id="phone"
                name="phone"
                placeholder=" "
                value={form.phone}
                onChange={handleChange}
                autoComplete="tel"
              />
              <label htmlFor="phone">Téléphone</label>
            </div>

            <div className="register-field">
              <input
                id="password"
                name="password"
                type="password"
                placeholder=" "
                value={form.password}
                onChange={handleChange}
                autoComplete="new-password"
              />
              <label htmlFor="password">Mot de passe</label>
            </div>

            <div className="register-field">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder=" "
                value={form.confirmPassword}
                onChange={handleChange}
                autoComplete="new-password"
              />
              <label htmlFor="confirmPassword">
                Confirmer le mot de passe
              </label>
            </div>

            <button
              type="submit"
              className="register-btn"
              disabled={loading || googleLoading}
            >
              {loading && <span className="register-btn-spinner" />}
              {loading ? "Création..." : "Créer mon compte"}
            </button>
          </form>

          <p className="register-footer">
            Déjà un compte ? <Link to="/login">Se connecter</Link>
          </p>
        </div>
      </div>
    </section>
  );
}