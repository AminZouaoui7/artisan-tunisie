import { useI18n } from "../i18n/i18n";

type Product = {
  name: string;
  price: string;
  image: string;
};

export default function FeaturedProducts() {
  const { t } = useI18n();

  const products: Product[] = [
    {
      name: t("legacy.featuredProducts.items.0.name"),
      price: t("legacy.featuredProducts.items.0.price"),
      image:
        "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80",
    },
    {
      name: t("legacy.featuredProducts.items.1.name"),
      price: t("legacy.featuredProducts.items.1.price"),
      image:
        "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=900&q=80",
    },
    {
      name: t("legacy.featuredProducts.items.2.name"),
      price: t("legacy.featuredProducts.items.2.price"),
      image:
        "https://images.unsplash.com/photo-1517705008128-361805f42e86?auto=format&fit=crop&w=900&q=80",
    },
  ];

  return (
    <section className="section alt-section" id="featured">
      <div className="container">
        <div className="section-heading">
          <span>{t("legacy.featuredProducts.kicker")}</span>
          <h2>{t("legacy.featuredProducts.title")}</h2>
          <p>{t("legacy.featuredProducts.description")}</p>
        </div>

        <div className="products-grid">
          {products.map((product, index) => (
            <div className="product-card" key={index}>
              <div className="product-image">
                <img src={product.image} alt={product.name} />
              </div>

              <div className="product-info">
                <h3>{product.name}</h3>
                <p>{product.price}</p>
                <button className="btn btn-primary small-btn">
                  {t("legacy.featuredProducts.cta")}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
