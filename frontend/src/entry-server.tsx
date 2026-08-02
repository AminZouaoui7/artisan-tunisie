import type { ComponentType } from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom";
import ArtisanatTunisiePage from "./pages/ArtisanatTunisiePage";
import TapisArtisanalTunisiePage from "./pages/TapisArtisanalTunisiePage";
import TapisBerbereTunisiePage from "./pages/TapisBerbereTunisiePage";
import TapisLaineTunisiePage from "./pages/TapisLaineTunisiePage";
import TapisTunisiensPage from "./pages/TapisTunisiensPage";
import TunisianRugsPage from "./pages/TunisianRugsPage";
import RugIntentPage from "./pages/RugIntentPage";
import { rugIntentDefinitions } from "./seo/rugIntentDefinitions";

type SeoRouteDefinition = {
  component: ComponentType;
  title: string;
  description: string;
  lang: "fr" | "en";
  image: string;
  alternatePath?: string;
  productKeywords?: string[];
};

const SITE_URL = "https://www.artisansdelamedina.com";

const routeDefinitions: Record<string, SeoRouteDefinition> = {
  "/artisanat-de-la-tunisie": {
    component: ArtisanatTunisiePage,
    title: "Artisan tunisien à Tunis | Artisanat de la Tunisie",
    description:
      "Artisan tunisien à Tunis : découvrez l’artisanat de la Tunisie, les tapis faits main, la poterie, la céramique et les savoir-faire de la Médina.",
    lang: "fr",
    image: `${SITE_URL}/og-artisanat-tunisie.png`,
  },
  "/tapis-tunisiens": {
    component: TapisTunisiensPage,
    title: "Tapis tunisiens | Histoire, types & savoir-faire – L’Artisan de la Médina",
    description:
      "Tapis tunisiens : histoire, Margoum, Kilim, tapis noués, matières, motifs et conseils pour choisir un tapis artisanal tunisien authentique.",
    lang: "fr",
    image: `${SITE_URL}/logo-email.png`,
    alternatePath: "/en/tunisian-rugs",
    productKeywords: ["tapis", "margoum", "kilim", "killim", "noue"],
  },
  "/tapis-artisanal-tunisie": {
    component: TapisArtisanalTunisiePage,
    title:
      "Tapis artisanal Tunisie | Margoum, Kilim & tapis noués – L’Artisan de la Médina",
    description:
      "Tapis artisanal Tunisie : guide complet (Margoum, Kilim, tapis noués), matières, motifs, tailles, entretien et conseils pour acheter un tapis fait main.",
    lang: "fr",
    image: `${SITE_URL}/logo-email.png`,
    alternatePath: "/en/handmade-rugs",
    productKeywords: ["tapis", "margoum", "kilim", "killim", "noue"],
  },
  "/tapis-berbere-tunisie": {
    component: TapisBerbereTunisiePage,
    title: "Tapis berbère Tunisie | Motifs, laine & conseils – L’Artisan de la Médina",
    description:
      "Tapis berbère Tunisie : motifs, laine, couleurs, styles et conseils pour choisir un tapis berbère tunisien fait main pour salon ou chambre.",
    lang: "fr",
    image: `${SITE_URL}/logo-email.png`,
    alternatePath: "/en/berber-rugs",
    productKeywords: ["berber", "berbère", "berbere"],
  },
  "/tapis-laine-tunisie": {
    component: TapisLaineTunisiePage,
    title: "Tapis laine Tunisie | Confort, qualité & entretien – L’Artisan de la Médina",
    description:
      "Tapis laine Tunisie : avantages de la laine naturelle, qualité, confort, durabilité, entretien et conseils pour choisir un tapis tunisien fait main.",
    lang: "fr",
    image: `${SITE_URL}/logo-email.png`,
    productKeywords: ["laine"],
  },
  "/en/tunisian-rugs": {
    component: TunisianRugsPage,
    title: "Handmade Tunisian Rugs | Berber, Kilim & Margoum Rugs",
    description:
      "Shop authentic handmade Tunisian rugs, including Berber Kilims, Margoum rugs and hand-knotted wool carpets. Unique artisan pieces with international delivery.",
    lang: "en",
    image: `${SITE_URL}/logo-email.png`,
    alternatePath: "/tapis-tunisiens",
    productKeywords: ["tapis", "margoum", "kilim", "killim", "noue"],
  },
};

Object.values(rugIntentDefinitions).forEach((definition) => {
  routeDefinitions[definition.path] = {
    component: () => <RugIntentPage pathname={definition.path} />,
    title: definition.title,
    description: definition.description,
    lang: definition.lang,
    image: `${SITE_URL}/og-artisanat-tunisie.png`,
    alternatePath: definition.alternatePath,
    productKeywords: definition.productKeywords,
  };
});

export const seoRoutes = Object.entries(routeDefinitions).map(
  ([pathname, definition]) => ({
    pathname,
    title: definition.title,
    description: definition.description,
    lang: definition.lang,
    image: definition.image,
    canonical: `${SITE_URL}${pathname}`,
    alternatePath: definition.alternatePath,
    productKeywords: definition.productKeywords || [],
  })
);

export function renderSeoRoute(pathname: string) {
  const definition = routeDefinitions[pathname];

  if (!definition) {
    throw new Error(`Unknown SEO route: ${pathname}`);
  }

  const Page = definition.component;

  return renderToString(
    <StaticRouter location={pathname}>
      <Page />
    </StaticRouter>
  );
}
