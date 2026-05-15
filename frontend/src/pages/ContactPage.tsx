import { useState } from "react";
import {
  Mail,
  MapPin,
  Phone,
  MessageCircle,
  XCircle,
} from "lucide-react";
import { useI18n } from "../i18n/i18n";
import ActionSuccess from "../components/ActionSuccess";
import { apiFetch } from "../services/apiClient";
import "../styles/ContactPage.css";

export default function ContactPage() {
  const { t } = useI18n();
  const whatsappNumber = "21656250910";
  const email = "aminmimou963@gmail.com";
  const [isEmailSuccess, setIsEmailSuccess] = useState(false);

  const [toast, setToast] = useState<{
    type: "error";
    message: string;
  } | null>(null);

  const showToast = (type: "error", message: string) => {
    setToast({ type, message });

    window.setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  const getFormPayload = (form: HTMLFormElement) => {
    const formData = new FormData(form);

    return {
      name: formData.get("name")?.toString() || "",
      email: formData.get("email")?.toString() || "",
      phone: formData.get("phone")?.toString() || "",
      message: formData.get("message")?.toString() || "",
    };
  };

  const handleEmailSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const payload = getFormPayload(form);

    try {
      setIsEmailSuccess(false);
      const response = await apiFetch("/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(t("contact.emailSendError"));
      }

      setIsEmailSuccess(true);
      form.reset();
    } catch (error) {
      console.error(error);
      showToast("error", t("contact.emailSendError"));
    }
  };

  const handleWhatsAppSubmit = () => {
    const form = document.querySelector(".contact-form") as HTMLFormElement | null;

    if (!form) return;

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const payload = getFormPayload(form);

    const whatsappMessage = t("contact.whatsAppTemplate", {
      name: payload.name,
      email: payload.email,
      phone: payload.phone,
      message: payload.message,
    });

    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
      whatsappMessage
    )}`;

    window.open(whatsappUrl, "_blank");
    form.reset();
  };

  return (
    <main className="contact-page">
      <section className="contact-hero">
        <div className="contact-hero-inner">
          <div className="contact-intro">
            <p className="page-kicker">{t("contact.kicker")}</p>

            <h1 className="contact-title">
              {t("contact.title")} <em>{t("contact.titleEmphasis")}</em>
            </h1>

            <p className="contact-description">
              {t("contact.description")}
            </p>

            <div className="contact-quick-actions">
              <a
                className="contact-whatsapp-btn"
                href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(t("contact.quickWhatsAppText"))}`}
                target="_blank"
                rel="noreferrer"
              >
                <MessageCircle size={20} />
                {t("contact.quickWhatsApp")}
              </a>

              <a className="contact-email-btn" href={`mailto:${email}`}>
                <Mail size={20} />
                {t("contact.quickEmail")}
              </a>
            </div>
          </div>

          <div className="contact-card">
            {isEmailSuccess ? (
              <ActionSuccess
                title="Message envoye"
                message="Merci pour votre message. Nous reviendrons vers vous dans les meilleurs delais."
                primaryActionLabel="Retour a l'accueil"
                primaryActionTo="/"
                variant="contact"
              />
            ) : (
              <form className="contact-form" onSubmit={handleEmailSubmit}>
                <div className="contact-form-header">
                  <p className="page-kicker">{t("contact.formKicker")}</p>
                  <h2>{t("contact.formTitle")}</h2>
                </div>

                <div className="contact-field">
                  <label>{t("contact.fullName")}</label>
                  <input
                    type="text"
                    name="name"
                    placeholder={t("contact.namePlaceholder")}
                    required
                  />
                </div>

                <div className="contact-field">
                  <label>{t("contact.email")}</label>
                  <input
                    type="email"
                    name="email"
                    placeholder={t("contact.emailPlaceholder")}
                    required
                  />
                </div>

                <div className="contact-field">
                  <label>{t("contact.phone")}</label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder={t("contact.phonePlaceholder")}
                  />
                </div>

                <div className="contact-field">
                  <label>{t("contact.message")}</label>
                  <textarea
                    name="message"
                    placeholder={t("contact.messagePlaceholder")}
                    required
                  />
                </div>

                <div className="contact-submit-actions">
                  <button type="submit" className="contact-submit-btn">
                    <Mail size={18} />
                    {t("contact.sendByEmail")}
                  </button>

                  <button
                    type="button"
                    className="contact-whatsapp-submit"
                    onClick={handleWhatsAppSubmit}
                  >
                    <MessageCircle size={18} />
                    {t("contact.sendByWhatsApp")}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      <section className="contact-info-section">
        <div className="contact-info-grid">
          <article className="contact-info-card">
            <Phone size={22} />
            <h3>{t("contact.infoPhone")}</h3>
            <p>{t("contact.infoPhoneDesc")}</p>
            <a href={`tel:+${whatsappNumber}`}>+216 56 250 910</a>
          </article>

          <article className="contact-info-card">
            <Mail size={22} />
            <h3>{t("contact.infoEmail")}</h3>
            <p>{t("contact.infoEmailDesc")}</p>
            <a href={`mailto:${email}`}>{email}</a>
          </article>

          <article className="contact-info-card">
            <MapPin size={22} />
            <h3>{t("contact.infoShop")}</h3>
            <p>{t("contact.infoShopDesc")}</p>
            <span>{t("contact.address")}</span>
          </article>
        </div>
      </section>

      {toast && (
        <div className={`contact-toast contact-toast-${toast.type}`}>
          <div className="contact-toast-icon">
            <XCircle size={22} />
          </div>

          <div>
            <strong>{t("contact.toastError")}</strong>
            <p>{toast.message}</p>
          </div>
        </div>
      )}
    </main>
  );
}
