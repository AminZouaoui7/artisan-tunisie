export const SITE_URL = "https://www.artisansdelamedina.com";

export type RugIntentDefinition = {
  path: string;
  title: string;
  description: string;
  lang: "fr" | "en";
  kicker: string;
  h1: string;
  lead: string;
  imageKey: "margoum" | "kilim" | "knotted" | "berber";
  imageAlt: string;
  alternatePath: string;
  productKeywords: string[];
  sections: Array<{ title: string; paragraphs: string[] }>;
  faq: Array<{ question: string; answer: string }>;
};

const definitions: RugIntentDefinition[] = [
  {
    path: "/margoum",
    title: "Margoum tunisien fait main | Tapis de Tunisie",
    description: "Découvrez le Margoum tunisien, tapis en laine tissé et brodé à la main. Origines, motifs, conseils d’entretien et pièces artisanales disponibles.",
    lang: "fr",
    kicker: "Tissage traditionnel tunisien",
    h1: "Margoum tunisien fait main",
    lead: "Le Margoum est un tapis tunisien reconnaissable à son tissage solide et à ses motifs brodés en relief. Chaque pièce porte la sensibilité de l’artisane, la mémoire d’une région et les nuances naturelles de la laine.",
    imageKey: "margoum",
    imageAlt: "Margoum tunisien en laine tissé et brodé à la main",
    alternatePath: "/en/margoum-rugs",
    productKeywords: ["margoum"],
    sections: [
      {
        title: "Un tapis emblématique de l’artisanat tunisien",
        paragraphs: [
          "Le Margoum est travaillé sur un métier traditionnel. La base est tissée à plat, puis enrichie de motifs qui donnent du rythme et du relief. Les légères variations de lignes et de couleurs ne sont pas des défauts : elles témoignent d’une fabrication manuelle.",
          "Dans un salon, une entrée ou une chambre, sa présence structure l’espace sans l’alourdir. Les compositions géométriques dialoguent aussi bien avec le bois et le lin qu’avec un intérieur contemporain.",
        ],
      },
      {
        title: "Laine, motifs et régions de production",
        paragraphs: [
          "La laine apporte chaleur, résistance et profondeur aux couleurs. Les motifs sont souvent inspirés de l’environnement, de la vie quotidienne et de symboles transmis entre générations dans les régions artisanales tunisiennes.",
          "Avant de choisir, observez la régularité des bords, la densité du tissage et l’équilibre du dessin. Les dimensions et l’origine indiquées sur chaque fiche aident à comparer des pièces réellement disponibles.",
        ],
      },
      {
        title: "Choisir, faire livrer et entretenir un Margoum",
        paragraphs: [
          "Mesurez la zone en conservant une circulation confortable autour du tapis. Pour l’entretien, aspirez doucement sans brosse rotative, tournez la pièce une à deux fois par an et absorbez immédiatement tout liquide sans frotter.",
          "La boutique accompagne le choix des dimensions et organise la livraison selon la destination. Les conditions exactes sont confirmées avant toute commande ou demande de prix.",
        ],
      },
    ],
    faq: [
      { question: "Quelle est la différence entre un Margoum et un Kilim ?", answer: "Le Kilim est entièrement tissé à plat. Le Margoum part d’un tissage plat enrichi de motifs brodés, ce qui lui donne davantage de relief." },
      { question: "Le Margoum convient-il à un usage quotidien ?", answer: "Oui. Un tissage dense en laine convient très bien au salon ou à l’entrée, avec une aspiration douce et régulière." },
      { question: "Chaque Margoum tunisien est-il unique ?", answer: "Les pièces faites main présentent toujours de petites variations. La fiche produit précise si le modèle est proposé comme pièce unique." },
    ],
  },
  {
    path: "/kilim",
    title: "Kilim tunisien et Kilim berbère fait main | Tunisie",
    description: "Explorez nos Kilims tunisiens faits main : Kilim berbère, Kilim Toujane et tissages extra fins en laine, avec conseils de choix et d’entretien.",
    lang: "fr",
    kicker: "Tapis tissé à plat",
    h1: "Kilim tunisien fait main",
    lead: "Léger, graphique et résistant, le Kilim tunisien est tissé à plat sur un métier traditionnel. Les modèles berbères et les Kilims de Toujane associent laine, géométrie et palettes expressives dans des pièces faciles à vivre.",
    imageKey: "kilim",
    imageAlt: "Kilim berbère tunisien tissé à plat à la main",
    alternatePath: "/en/kilim-rugs",
    productKeywords: ["kilim", "killim", "toujen", "toujane"],
    sections: [
      {
        title: "Kilim berbère, Toujane et tissage extra fin",
        paragraphs: [
          "Le Kilim berbère privilégie des signes géométriques et des contrastes francs. Les créations de Toujane puisent dans le patrimoine textile du Sud tunisien, tandis que les versions extra fines offrent un dessin plus délicat et une texture souple.",
          "Comme il ne possède pas de velours épais, ce tapis se place facilement sous une table, dans un couloir ou devant un meuble. Sa faible hauteur facilite aussi l’ouverture des portes.",
        ],
      },
      {
        title: "Reconnaître un Kilim tunisien de qualité",
        paragraphs: [
          "Regardez la netteté du tissage, la solidité des lisières et la cohérence des raccords. Une pièce artisanale conserve de petites irrégularités qui montrent le passage de la main, sans compromettre sa tenue.",
          "La laine naturelle donne un toucher vivant et des couleurs nuancées. La fiche de chaque tapis précise ses dimensions, sa matière, sa technique et sa région lorsqu’elles sont disponibles dans le catalogue.",
        ],
      },
      {
        title: "Placement, entretien et livraison",
        paragraphs: [
          "Un sous-tapis antidérapant améliore le confort sur un sol lisse. Aspirez avec une puissance modérée, sans tirer sur les franges, et faites réaliser les nettoyages importants par un spécialiste des textiles artisanaux.",
          "Les Kilims disponibles peuvent être expédiés en Tunisie ou à l’international selon leur format et la destination. La boutique confirme toujours les modalités avant l’envoi.",
        ],
      },
    ],
    faq: [
      { question: "Qu’est-ce qu’un Kilim tunisien ?", answer: "C’est un tapis sans velours, tissé à plat à partir de fils de chaîne et de trame. Il est apprécié pour sa légèreté et ses motifs graphiques." },
      { question: "Un Kilim berbère peut-il aller sous une table ?", answer: "Oui. Son profil plat permet aux chaises de glisser plus facilement et convient bien à une salle à manger." },
      { question: "Comment éviter qu’un Kilim ne glisse ?", answer: "Utilisez un sous-tapis adapté au sol et légèrement plus petit que le tapis afin de stabiliser la pièce sans dépasser." },
    ],
  },
  {
    path: "/tapis-noue",
    title: "Tapis noué tunisien en laine fait main | Artisan de la Médina",
    description: "Découvrez le tapis noué tunisien en laine : fabrication à la main, texture dense, choix des dimensions, entretien et pièces disponibles.",
    lang: "fr",
    kicker: "Laine nouée à la main",
    h1: "Tapis noué tunisien fait main",
    lead: "Le tapis noué tunisien se distingue par une surface dense et confortable. Chaque nœud participe au dessin et demande un geste précis, répété pendant des semaines selon la taille et la finesse de la pièce.",
    imageKey: "knotted",
    imageAlt: "Tapis noué tunisien en laine réalisé à la main",
    alternatePath: "/en/handmade-rugs",
    productKeywords: ["noue", "noué", "tapis"],
    sections: [
      {
        title: "Une technique lente au service du relief",
        paragraphs: [
          "Contrairement au tissage plat, le nouage crée un velours. La densité, la qualité de la laine et la régularité de la tonte déterminent la douceur, la précision du motif et la capacité du tapis à traverser les années.",
          "Les dessins peuvent reprendre des compositions florales, des géométries traditionnelles ou des interprétations contemporaines. Les nuances ne sont jamais totalement uniformes, ce qui donne de la profondeur à la surface.",
        ],
      },
      {
        title: "Quel format pour le salon ou la chambre ?",
        paragraphs: [
          "Dans un salon, un grand tapis peut réunir visuellement le canapé, les fauteuils et la table basse. Dans une chambre, il peut encadrer le lit ou créer une zone douce au réveil. Un couloir demande un format plus étroit et une base stable.",
          "Mesurez le mobilier avant de choisir, puis vérifiez les dimensions réelles sur la fiche. Chaque produit disponible renvoie vers ses caractéristiques et ses images détaillées.",
        ],
      },
      {
        title: "Préserver un tapis noué en laine",
        paragraphs: [
          "Aspirez dans le sens du velours sans brosse agressive et changez régulièrement l’orientation du tapis. En cas de tache, tamponnez avec un chiffon propre sans détremper la laine.",
          "Pour un nettoyage complet, choisissez un professionnel habitué aux tapis noués et aux colorants textiles. La boutique peut aussi conseiller l’entretien selon la pièce choisie.",
        ],
      },
    ],
    faq: [
      { question: "Pourquoi un tapis noué est-il plus épais qu’un Kilim ?", answer: "Les fils sont noués autour de la trame puis égalisés pour former un velours, alors qu’un Kilim reste entièrement plat." },
      { question: "La laine convient-elle aux pièces de vie ?", answer: "Oui. Elle offre confort et résilience, à condition d’utiliser une aspiration douce et de traiter rapidement les taches." },
      { question: "Les prix sont-ils identiques dans tous les pays ?", answer: "Les prix et modalités dépendent de la destination et de la politique commerciale affichée sur le site. Aucun prix masqué n’est publié dans les données SEO." },
    ],
  },
  {
    path: "/en/handmade-rugs",
    title: "Handmade Tunisian Rugs | Wool Rugs from Tunisia",
    description: "Shop authentic handmade Tunisian rugs in wool, including Margoum, Berber Kilim and hand-knotted carpets, with international delivery options.",
    lang: "en",
    kicker: "Crafted in Tunisia",
    h1: "Authentic handmade rugs from Tunisia",
    lead: "A handmade Tunisian rug brings together natural wool, patient work and a visual language shaped by local weaving traditions. Our collection includes flatwoven Kilims, embroidered Margoum rugs and dense hand-knotted carpets.",
    imageKey: "knotted",
    imageAlt: "Authentic handmade Tunisian wool rug",
    alternatePath: "/tapis-artisanal-tunisie",
    productKeywords: ["tapis", "margoum", "kilim", "killim", "noue"],
    sections: [
      {
        title: "Made by hand, selected piece by piece",
        paragraphs: [
          "Hand weaving leaves subtle changes in line, color and texture. These variations make each rug feel personal and show the rhythm of the artisan rather than the repetition of industrial production.",
          "Product pages identify the available dimensions, material, technique and origin whenever that information is supplied by the workshop.",
        ],
      },
      {
        title: "Choose the right Tunisian rug family",
        paragraphs: [
          "Choose a Kilim for a light, graphic flatweave; a Margoum for embroidered relief; or a knotted wool rug for a thicker and softer surface. Size should follow the furniture layout rather than the empty floor alone.",
          "Related guides explain each technique, while direct product links show only pieces currently available in the catalog.",
        ],
      },
      {
        title: "Care and international delivery",
        paragraphs: [
          "Vacuum gently without a rotating brush, keep fringes away from strong suction and blot spills quickly. Professional specialist cleaning is recommended for deeper treatment.",
          "International delivery depends on size and destination. The shop confirms the exact shipping method and any price information before an order is completed.",
        ],
      },
    ],
    faq: [
      { question: "Are Tunisian rugs made from wool?", answer: "Many traditional rugs use wool for its warmth and durability. The exact material is stated on each product page when available." },
      { question: "What makes a handmade rug unique?", answer: "Small variations in weaving, knotting and color record the artisan’s hand and distinguish the piece from machine-made production." },
      { question: "Can Tunisian rugs be delivered internationally?", answer: "International delivery can be arranged for eligible pieces. Timing and cost are confirmed according to the rug and destination." },
    ],
  },
  {
    path: "/en/berber-rugs",
    title: "Tunisian Berber Rugs | Handmade Wool Rugs",
    description: "Discover handmade Tunisian Berber rugs and flatwoven Kilims in wool, with symbolic patterns, natural texture and worldwide delivery options.",
    lang: "en",
    kicker: "Berber textile heritage",
    h1: "Handmade Tunisian Berber rugs",
    lead: "Tunisian Berber rugs use geometry, contrast and tactile wool to tell stories rooted in place. From flatwoven Kilims to heavier Margoum pieces, their character comes from both the weaving method and the artisan’s composition.",
    imageKey: "berber",
    imageAlt: "Handmade Tunisian Berber rug with geometric motifs",
    alternatePath: "/tapis-berbere-tunisie",
    productKeywords: ["berber", "berbère", "berbere"],
    sections: [
      { title: "Patterns with rhythm and meaning", paragraphs: ["Diamonds, stepped lines and repeated signs can refer to protection, landscape or everyday life. Meanings vary by region and artisan, so a rug should be appreciated as a living composition rather than a fixed code.", "Natural variation in wool and dye adds depth to the motifs and makes handmade pieces visibly different from printed imitations."] },
      { title: "Flatweave or textured Berber rug", paragraphs: ["A Berber Kilim is thin, light and practical under furniture. A Berber Margoum adds embroidered relief and a stronger tactile presence. The best choice depends on traffic, comfort and the visual weight of the room.", "Use the product dimensions and material details to compare real pieces, then follow the links to related Tunisian weaving guides."] },
      { title: "Keeping wool rugs beautiful", paragraphs: ["Rotate the rug periodically, vacuum gently and limit long exposure to strong direct sunlight. Blot spills instead of rubbing them into the fibers.", "For deep cleaning, use a specialist familiar with handmade wool textiles and traditional fringes."] },
    ],
    faq: [
      { question: "Are Tunisian Berber rugs always black and white?", answer: "No. Neutral palettes are common, but Tunisian weavers also use red, green, blue and multicolored geometric compositions." },
      { question: "What is a Berber Kilim?", answer: "It is a flatwoven rug whose geometric language is associated with Berber textile traditions. Its surface has no cut pile." },
      { question: "Can a Berber rug work in a modern interior?", answer: "Yes. Its geometry and natural texture pair especially well with wood, stone, linen and simple contemporary furniture." },
    ],
  },
  {
    path: "/en/kilim-rugs",
    title: "Tunisian Kilim Rugs | Berber & Toujane Flatweaves",
    description: "Explore handmade Tunisian Kilim rugs, including Berber and Toujane flatweaves in wool. Authentic pieces with care advice and delivery options.",
    lang: "en",
    kicker: "Handwoven flatweaves",
    h1: "Handmade Tunisian Kilim rugs",
    lead: "Tunisian Kilim rugs are woven flat, creating a light and durable textile with crisp geometry. Berber designs, Toujane traditions and extra-fine weaves offer distinct textures while sharing the same patient handwork.",
    imageKey: "kilim",
    imageAlt: "Handwoven Tunisian Kilim rug from Toujane",
    alternatePath: "/kilim",
    productKeywords: ["kilim", "killim", "toujen", "toujane"],
    sections: [
      { title: "A practical rug with a strong identity", paragraphs: ["Because a Kilim has no thick pile, it sits neatly under dining chairs, in a hallway or beside a bed. Its reversible-looking structure and graphic surface make it easy to combine with modern interiors.", "Toujane pieces are associated with the textile heritage of southern Tunisia, while Berber Kilims often emphasize symbolic geometry and contrast."] },
      { title: "How to evaluate a handmade Kilim", paragraphs: ["Check the edges, the consistency of the weave and the way colors meet. Small shifts are normal in a handmade textile; loose structure or damaged borders require closer attention.", "Each catalog page uses actual product data for dimensions, material, technique and availability."] },
      { title: "Care, placement and shipping", paragraphs: ["Use a suitable rug pad on smooth floors, vacuum at low power and avoid pulling the fringes. Specialist cleaning helps protect wool and dyes over time.", "Shipping is arranged according to the selected rug’s size and destination, with the final terms confirmed by the shop."] },
    ],
    faq: [
      { question: "What is the difference between a Kilim and a pile rug?", answer: "A Kilim is flatwoven and has no cut pile, making it lighter and thinner than a knotted carpet." },
      { question: "Where is Toujane?", answer: "Toujane is a village in southern Tunisia known for its landscape and textile traditions." },
      { question: "Do Kilim rugs need a rug pad?", answer: "A rug pad is recommended on smooth floors because it improves grip, comfort and long-term wear." },
    ],
  },
  {
    path: "/en/margoum-rugs",
    title: "Tunisian Margoum Rugs | Handmade Wool Flatweaves",
    description: "Discover authentic Tunisian Margoum rugs, handwoven in wool and enriched with embroidered motifs. Browse available pieces and care guidance.",
    lang: "en",
    kicker: "A Tunisian weaving signature",
    h1: "Authentic Tunisian Margoum rugs",
    lead: "The Margoum is a distinctive Tunisian rug: a strong flatwoven foundation is enriched with embroidered motifs that add texture and visual rhythm. It balances everyday practicality with the presence of a crafted object.",
    imageKey: "margoum",
    imageAlt: "Authentic Tunisian Margoum rug woven in wool",
    alternatePath: "/margoum",
    productKeywords: ["margoum"],
    sections: [
      { title: "Woven structure and embroidered relief", paragraphs: ["Margoum production combines controlled tension on the loom with careful decorative work. The result is flatter than a knotted carpet but more textured than a plain Kilim.", "Geometric patterns and balanced color fields allow the rug to work as a focal point without overwhelming furniture and natural materials."] },
      { title: "Selecting an authentic piece", paragraphs: ["Look for stable edges, coherent motifs and a dense, even foundation. Slight asymmetry is part of the handmade process and can reveal the decisions made during weaving.", "Available product pages provide real images and specifications supplied by the catalog, without invented reviews or prices."] },
      { title: "Daily care and delivery", paragraphs: ["Vacuum gently, rotate the rug to balance wear and blot spills immediately. Avoid machine washing and harsh chemicals that could affect wool or color.", "The shop confirms international delivery options, timing and any applicable price information for the selected piece and destination."] },
    ],
    faq: [
      { question: "Is a Margoum rug the same as a Kilim?", answer: "Both use a flatwoven base, but a Margoum is typically enriched with embroidered motifs that create additional relief." },
      { question: "Is Margoum suitable for a living room?", answer: "Yes. Its durable structure and decorative surface work well in living rooms, entrances and other regularly used spaces." },
      { question: "How should a Margoum rug be cleaned?", answer: "Use gentle vacuuming for routine care and a textile specialist for deep cleaning. Spills should be blotted quickly without rubbing." },
    ],
  },
];

export const rugIntentDefinitions = Object.fromEntries(
  definitions.map((definition) => [definition.path, definition])
) as Record<string, RugIntentDefinition>;

export const rugIntentRoutes = definitions.map((definition) => definition.path);
