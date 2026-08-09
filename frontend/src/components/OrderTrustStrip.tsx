import {
  BadgeCheck,
  Headphones,
  ShieldCheck,
  Truck,
} from "lucide-react";

import { useI18n } from "../i18n/i18n";
import "../styles/OrderTrustStrip.css";

const trustItems = [
  { key: "secure", Icon: ShieldCheck },
  { key: "validation", Icon: BadgeCheck },
  { key: "delivery", Icon: Truck },
  { key: "support", Icon: Headphones },
] as const;

export default function OrderTrustStrip() {
  const { t } = useI18n();

  return (
    <section
      className="order-trust-strip"
      aria-label={t("orderTrust.ariaLabel")}
    >
      <div className="order-trust-strip__intro">
        <span>{t("orderTrust.kicker")}</span>
        <strong>{t("orderTrust.title")}</strong>
      </div>

      <div className="order-trust-strip__items" role="list">
        {trustItems.map(({ key, Icon }) => (
          <div className="order-trust-strip__item" role="listitem" key={key}>
            <div className="order-trust-strip__icon" aria-hidden="true">
              <Icon size={20} strokeWidth={1.9} />
            </div>
            <div>
              <strong>{t(`orderTrust.${key}.title`)}</strong>
              <span>{t(`orderTrust.${key}.description`)}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
