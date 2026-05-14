import { useEffect, useState } from "react";
import {
  CalendarDays,
  Clock,
  Users,
  Eye,
  X,
  MessageSquareText,
  PackageCheck,
} from "lucide-react";

import { useAuth } from "../context/useAuth";
import {
  getMyDemoBookings,
  type CustomerDemoBooking,
} from "../services/demoBookingService";
import { useI18n } from "../i18n/i18n";

import "../styles/AccountPage.css";

export default function AccountReservationsPage() {
  const { t } = useI18n();
  const { token } = useAuth();

  const [bookings, setBookings] = useState<CustomerDemoBooking[]>([]);
  const [selectedBooking, setSelectedBooking] =
    useState<CustomerDemoBooking | null>(null);

  const [loading, setLoading] = useState(true);
  const [errorKey, setErrorKey] = useState<string | null>(null);
  const [errorRaw, setErrorRaw] = useState("");

  useEffect(() => {
    async function loadBookings() {
      if (!token) return;

      try {
        setLoading(true);
        setErrorKey(null);
        setErrorRaw("");

        const data = await getMyDemoBookings(token);
        setBookings(data);
      } catch (err) {
        if (err instanceof Error) {
          setErrorRaw(err.message);
        } else {
          setErrorKey("account.common.unknownError");
        }
      } finally {
        setLoading(false);
      }
    }

    loadBookings();
  }, [token]);

  function getStatusLabel(status: string) {
    if (status === "Pending") return t("account.reservations.status.pending");
    if (status === "Confirmed") return t("account.reservations.status.confirmed");
    if (status === "Cancelled") return t("account.reservations.status.cancelled");
    if (status === "Completed") return t("account.reservations.status.completed");
    return status;
  }

  return (
    <>
      <div className="account-card">
        <div className="account-card-head">
          <h3>{t("account.reservations.title")}</h3>
        </div>

        <div className="account-card-divider" />

        <div className="account-reservations-wrap">
          {loading && (
            <p className="account-muted">
              {t("account.reservations.loading")}
            </p>
          )}

          {(errorRaw || errorKey) && (
            <div className="account-alert-error">
              {errorRaw || (errorKey ? t(errorKey) : "")}
            </div>
          )}

          {!loading && !errorRaw && !errorKey && bookings.length === 0 && (
            <p className="account-muted">
              {t("account.reservations.empty")}
            </p>
          )}

          {!loading && !errorRaw && !errorKey && bookings.length > 0 && (
            <div className="account-reservations-list">
              {bookings.map((booking) => (
                <article
                  key={booking.id}
                  className="account-reservation-item"
                >
                  <div className="account-reservation-main">
                    <div>
                      <span className="account-reservation-id">
                        {t("account.reservations.bookingNumber", { id: booking.id })}
                      </span>

                      <h4>
                        {t("account.reservations.privateDemo")}
                      </h4>
                    </div>

                    <span
                      className={`account-status account-status--${booking.status.toLowerCase()}`}
                    >
                      {getStatusLabel(booking.status)}
                    </span>
                  </div>

                  <div className="account-reservation-meta">
                    <span>
                      <CalendarDays size={15} />
                      {booking.demoDate}
                    </span>

                    <span>
                      <Clock size={15} />
                      {booking.demoTime}
                    </span>

                    <span>
                      <Users size={15} />
                      {booking.guestsCount}{" "}
                      {booking.guestsCount === 1
                        ? t("account.common.person")
                        : t("account.common.people")}
                    </span>
                  </div>

                  <div className="account-reservation-footer">
                    <p>
                      {booking.letTeamChooseProducts
                        ? t("account.reservations.teamWillChoose")
                        : booking.productsToSee.length === 1
                        ? t("account.reservations.selectedOne")
                        : t("account.reservations.selectedMany", {
                            count: booking.productsToSee.length,
                          })}
                    </p>

                    <button
                      type="button"
                      onClick={() => setSelectedBooking(booking)}
                    >
                      <Eye size={15} />
                      {t("account.reservations.viewDetails")}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>

      {selectedBooking && (
        <div
          className="account-reservation-modal"
          onClick={() => setSelectedBooking(null)}
        >
          <div
            className="account-reservation-panel"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="account-reservation-close"
              onClick={() => setSelectedBooking(null)}
              aria-label={t("common.close")}
            >
              <X size={18} />
            </button>

            <div className="account-reservation-panel-head">
              <p>{t("account.reservations.bookingNumber", { id: selectedBooking.id })}</p>
              <h3>{t("account.reservations.detailTitle")}</h3>

              <span
                className={`account-status account-status--${selectedBooking.status.toLowerCase()}`}
              >
                {getStatusLabel(selectedBooking.status)}
              </span>
            </div>

            <div className="account-reservation-detail-grid">
              <div>
                <CalendarDays size={17} />
                <span>{t("account.reservations.fields.date")}</span>
                <strong>{selectedBooking.demoDate}</strong>
              </div>

              <div>
                <Clock size={17} />
                <span>{t("account.reservations.fields.time")}</span>
                <strong>{selectedBooking.demoTime}</strong>
              </div>

              <div>
                <Users size={17} />
                <span>{t("account.reservations.fields.guests")}</span>
                <strong>{selectedBooking.guestsCount}</strong>
              </div>

              <div>
                <PackageCheck size={17} />
                <span>{t("account.reservations.fields.duration")}</span>
                <strong>
                  {selectedBooking.durationMinutes} {t("account.common.minutesShort")}
                </strong>
              </div>
            </div>

            {selectedBooking.message && (
              <div className="account-reservation-message">
                <MessageSquareText size={17} />
                <div>
                  <span>{t("account.reservations.yourMessage")}</span>
                  <p>{selectedBooking.message}</p>
                </div>
              </div>
            )}

            <div className="account-reservation-products">
              <h4>{t("account.reservations.selectedTitle")}</h4>

              {selectedBooking.letTeamChooseProducts ? (
                <p className="account-muted">
                  {t("account.reservations.letTeamChoose")}
                </p>
              ) : (
                <div className="account-reservation-products-grid">
                  {selectedBooking.productsToSee.map((product) => (
                    <div
                      key={product.productId}
                      className="account-reservation-product"
                    >
                      <div className="account-reservation-product-img">
                        {product.productImage ? (
                          <img
                            src={
                              product.productImage.startsWith("http")
                                ? product.productImage
                                : `http://localhost:5163${product.productImage}`
                            }
                            alt={product.productName}
                          />
                        ) : (
                          <span>{t("common.rug")}</span>
                        )}
                      </div>

                      <div>
                        <strong>{product.productName}</strong>
                        <small>{t("account.reservations.artisanalPiece")}</small>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
