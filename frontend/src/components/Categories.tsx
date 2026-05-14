import { useI18n } from "../i18n/i18n";

export default function Categories() {
  const { t } = useI18n();

  const categories = [
    {
      title: t("legacy.categories.items.0.title"),
      text: t("legacy.categories.items.0.text"),
    },
    {
      title: t("legacy.categories.items.1.title"),
      text: t("legacy.categories.items.1.text"),
    },
    {
      title: t("legacy.categories.items.2.title"),
      text: t("legacy.categories.items.2.text"),
    },
  ];

  return (
    <section className="section" id="categories">
      <div className="container">
        <div className="section-heading">
          <span>{t("legacy.categories.kicker")}</span>
          <h2>{t("legacy.categories.title")}</h2>
          <p>{t("legacy.categories.description")}</p>
        </div>

        <div className="categories-grid">
          {categories.map((item, index) => (
            <div className="category-card" key={index}>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
