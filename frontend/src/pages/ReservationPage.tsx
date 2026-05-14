import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock,
  Users,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import { getProducts, type ProductViewDto } from "../services/productService";
import { createDemoBooking } from "../services/demoBookingService";
import "../styles/ReservationPage.css";
import { useI18n } from "../i18n/i18n";

import demo1 from "../assets/IMG_2574.jpeg";
import demo2 from "../assets/IMG_2576.jpeg";
import demo3 from "../assets/IMG_2766.jpeg";
import demo4 from "../assets/IMG_2771.jpeg";
import demo5 from "../assets/IMG_2776.jpeg";

const demoImages = [demo1, demo2, demo3, demo4, demo5];

export default function ReservationPage() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const { user, token, isAuthenticated, loadingAuth } = useAuth();

  const [, setProducts] = useState<ProductViewDto[]>([]);
  const [selectedProductIds, setSelectedProductIds] = useState<number[]>([]);
  const [showProductChoice, setShowProductChoice] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);

  const [submitting, setSubmitting] = useState(false);
  const [successKey, setSuccessKey] = useState<string | null>(null);
  const [errorKey, setErrorKey] = useState<string | null>(null);
  const [errorRaw, setErrorRaw] = useState("");

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    demoDate: "",
    demoTime: "",
    guestsCount: 1,
    durationMinutes: 30,
    message: "",
  });

  useEffect(() => {
    if (!user) return;

    setForm((current) => ({
      ...current,
      fullName: `${user.firstName} ${user.lastName}`.trim(),
      email: user.email,
      phone: user.phone || "",
    }));
  }, [user]);

  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await getProducts();
        setProducts(data.filter((p) => p.stock > 0));
      } catch {
        setErrorKey("reservation.loadError");
      } finally {
      }
    }

    loadProducts();
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCarouselIndex((current) => (current + 1) % demoImages.length);
    }, 4200);

    return () => window.clearInterval(timer);
  }, []);

  function goNext() {
    setCarouselIndex((current) => (current + 1) % demoImages.length);
  }

  function goPrev() {
    setCarouselIndex((current) =>
      current === 0 ? demoImages.length - 1 : current - 1
    );
  }

  function updateField(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    const { name, value } = e.target;

    setForm((current) => ({
      ...current,
      [name]:
        name === "guestsCount" || name === "durationMinutes"
          ? Number(value)
          : value,
    }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setSuccessKey(null);
    setErrorKey(null);
    setErrorRaw("");

    if (loadingAuth) return;

    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    setSubmitting(true);

    try {
      await createDemoBooking(
        {
          fullName: form.fullName,
          email: form.email,
          phone: form.phone,
          productIds: showProductChoice ? selectedProductIds : [],
          demoDate: form.demoDate,
          demoTime: form.demoTime,
          guestsCount: form.guestsCount,
          durationMinutes: form.durationMinutes,
          message: form.message,
        },
        token ?? undefined
      );

      setSuccessKey("reservation.submitSuccess");

      setForm({
        fullName: user
          ? `${user.firstName} ${user.lastName}`.trim()
          : "",
        email: user?.email || "",
        phone: user?.phone || "",
        demoDate: "",
        demoTime: "",
        guestsCount: 1,
        durationMinutes: 30,
        message: "",
      });

      setSelectedProductIds([]);
      setShowProductChoice(false);
    } catch (error) {
      if (error instanceof Error) {
        setErrorRaw(error.message);
      } else {
        setErrorKey("reservation.submitUnknownError");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="page-section reservation-page">
      

      <div className="reservation-layout">
        <div className="reservation-demo-carousel-card">
          <div className="reservation-carousel-heading">
            <p className="page-kicker">{t("reservation.carouselKicker")}</p>
            <h2>{t("reservation.carouselTitle")}</h2>
            <p>{t("reservation.carouselDescription")}</p>
          </div>

          <div className="reservation-carousel">
            <button
              type="button"
              className="reservation-carousel-btn left"
              onClick={goPrev}
              aria-label={t("reservation.prevImage")}
            >
              <ChevronLeft size={22} />
            </button>

            <img
              src={demoImages[carouselIndex]}
              alt={t("reservation.imageAlt", {
                index: carouselIndex + 1,
              })}
            />

            <button
              type="button"
              className="reservation-carousel-btn right"
              onClick={goNext}
              aria-label={t("reservation.nextImage")}
            >
              <ChevronRight size={22} />
            </button>

            <div className="reservation-carousel-dots">
              {demoImages.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  className={index === carouselIndex ? "active" : ""}
                  onClick={() => setCarouselIndex(index)}
                  aria-label={t("reservation.viewImage", {
                    index: index + 1,
                  })}
                />
              ))}
            </div>
          </div>
        </div>

        <form className="reservation-form-card" onSubmit={handleSubmit}>
          <p className="page-kicker">{t("reservation.formKicker")}</p>
          <h2>{t("reservation.formTitle")}</h2>

          <div className="reservation-form-grid">
            <label>
              {t("reservation.fullName")}
              <input
                name="fullName"
                value={form.fullName}
                onChange={updateField}
                required
                placeholder={t("home.yourName")}
              />
            </label>

            <label>
              {t("reservation.email")}
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={updateField}
                required
                placeholder={t("common.emailPlaceholder")}
              />
            </label>

            <label>
              {t("reservation.phone")}
              <input
                name="phone"
                value={form.phone}
                onChange={updateField}
                placeholder={t("common.phonePlaceholder")}
              />
            </label>

            <label>
              <span>
                <CalendarDays size={15} /> {t("reservation.date")}
              </span>
              <input
                name="demoDate"
                type="date"
                value={form.demoDate}
                onChange={updateField}
                required
              />
            </label>

            <label>
              <span>
                <Clock size={15} /> {t("reservation.time")}
              </span>
              <input
                name="demoTime"
                type="time"
                value={form.demoTime}
                onChange={updateField}
                required
              />
            </label>

            <label>
              <span>
                <Users size={15} /> {t("reservation.guests")}
              </span>
              <input
                name="guestsCount"
                type="number"
                min={1}
                max={20}
                value={form.guestsCount}
                onChange={updateField}
                required
              />
            </label>

            <label>
              {t("reservation.duration")}
              <select
                name="durationMinutes"
                value={form.durationMinutes}
                onChange={updateField}
              >
                <option value={30}>{t("reservation.duration30")}</option>
                <option value={45}>{t("reservation.duration45")}</option>
                <option value={60}>{t("reservation.duration60")}</option>
                <option value={90}>{t("reservation.duration90")}</option>
                <option value={120}>{t("reservation.duration120")}</option>
              </select>
            </label>
          </div>

          

          <label className="reservation-message">
            {t("reservation.message")}
            <textarea
              name="message"
              value={form.message}
              onChange={updateField}
              rows={5}
              placeholder={t("reservation.messagePlaceholder")}
            />
          </label>

          {successKey && (
            <p className="reservation-alert success">{t(successKey)}</p>
          )}

          {(errorRaw || errorKey) && (
            <p className="reservation-alert error">
              {errorRaw || (errorKey ? t(errorKey) : "")}
            </p>
          )}

          <button
            type="submit"
            className="reservation-submit"
            disabled={submitting || loadingAuth}
          >
            {submitting
              ? t("reservation.sending")
              : loadingAuth
              ? t("reservation.loadingProducts")
              : t("reservation.sendRequest")}
          </button>
        </form>
      </div>
    </section>
  );
}
