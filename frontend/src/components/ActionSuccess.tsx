import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import {
  CalendarCheck2,
  CheckCircle2,
  MailCheck,
  ReceiptText,
  Sparkles,
  UserRoundCheck,
} from "lucide-react";

import "../styles/ActionSuccess.css";

type ActionSuccessVariant =
  | "order"
  | "reservation"
  | "priceRequest"
  | "contact"
  | "auth";

type ActionSuccessProps = {
  title: string;
  message: string;
  details?: ReactNode;
  primaryActionLabel: string;
  primaryActionTo: string;
  secondaryActionLabel?: string;
  secondaryActionTo?: string;
  variant?: ActionSuccessVariant;
};

const iconByVariant = {
  order: ReceiptText,
  reservation: CalendarCheck2,
  priceRequest: Sparkles,
  contact: MailCheck,
  auth: UserRoundCheck,
} satisfies Record<ActionSuccessVariant, typeof CheckCircle2>;

export default function ActionSuccess({
  title,
  message,
  details,
  primaryActionLabel,
  primaryActionTo,
  secondaryActionLabel,
  secondaryActionTo,
  variant = "order",
}: ActionSuccessProps) {
  const Icon = iconByVariant[variant];
  const showSecondaryAction = Boolean(
    secondaryActionLabel && secondaryActionTo
  );

  return (
    <section
      className={`action-success action-success--${variant}`}
      aria-live="polite"
    >
      <div className="action-success__card">
        <div className="action-success__glow" aria-hidden="true" />

        <div className="action-success__icon-wrap">
          <div className="action-success__icon-ring" aria-hidden="true" />
          <div className="action-success__icon">
            <Icon size={26} />
          </div>
        </div>

        <div className="action-success__content">
          <p className="action-success__eyebrow">Artisan Medina</p>
          <h2 className="action-success__title">{title}</h2>
          <p className="action-success__message">{message}</p>

          {details && <div className="action-success__details">{details}</div>}
        </div>

        <div className="action-success__actions">
          <Link
            to={primaryActionTo}
            className="action-success__button action-success__button--primary"
          >
            {primaryActionLabel}
          </Link>

          {showSecondaryAction && secondaryActionLabel && secondaryActionTo && (
            <Link
              to={secondaryActionTo}
              className="action-success__button action-success__button--secondary"
            >
              {secondaryActionLabel}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
