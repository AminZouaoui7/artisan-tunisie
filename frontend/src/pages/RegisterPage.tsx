import { useState, type ChangeEvent, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../services/authService";
import { useI18n } from "../i18n/i18n";
import "../styles/RegisterPage.css";

export default function RegisterPage() {
  useI18n();
  const navigate = useNavigate();

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

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleGoogleRegister = () => {
    setError(
      "La connexion Google n’est pas encore activée côté backend. On l’ajoutera après l’inscription classique."
    );
  };

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

      const result = await authService.register({
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim().toLowerCase(),
        phone: form.phone.trim() || undefined,
        password: form.password,
      });

      navigate("/verify-email", {
        state: {
          email: result.email,
        },
      });
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
            Rejoignez notre<br />
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
            Créer<br />
            <em>un compte.</em>
          </h2>

          <p className="register-subtitle">
            Inscrivez-vous pour passer commande, réserver ou demander un prix.
          </p>

          {error && <div className="register-error">{error}</div>}

          <button
            type="button"
            className="register-google-btn"
            onClick={handleGoogleRegister}
          >
            Continuer avec Google
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
              <label htmlFor="confirmPassword">Confirmer le mot de passe</label>
            </div>

            <button
              type="submit"
              className="register-btn"
              disabled={loading}
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
