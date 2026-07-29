export const STORE = {
  name: "دار الصنعة",
  domain: "darelsanaa.com",
  whatsapp: "213558522110",
  fbPage: "https://www.facebook.com/profile.php?id=61592694953321",
  pixelId: "1459121952706477",
  currency: "دج",
  homeDeliveryFee: 500,
  stopDeskFee: 350,
  freeShippingThreshold: 6000,
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  hook: string;
  price: number;
  oldPrice: number;
  description: string;
  bullets: string[];
  images: string[];
  ogImage: string;
  metaTitle: string;
  metaDescription: string;
};

export const products: Product[] = [
  {
    id: "p1",
    slug: "chapeau-palmier",
    name: 'قبعة النخيل "شمس بوسعادة"',
    hook: "جمالٌ يقيكِ من الشمس",
    price: 2790,
    oldPrice: 3500,
    description:
      "من ليف النخيل الطبيعي، تُنسج يدوياً غرزةً غرزة على أيادي حرفيات بوسعادة. خفيفة، تسمح بمرور الهواء، وتحميكِ من أشعة الشمس بأناقة تراثية لا تمرّ دون أن يسألكِ أحد عنها. رفيقتك للبحر، للنزهات، ولإطلالة صيفية مختلفة.",
    bullets: [
      "نسيج يدوي 100% من ليف النخيل الطبيعي",
      "حماية فعالة من الشمس مع تهوية مثالية",
      "خفيفة ومريحة طوال اليوم",
      "كل قطعة فريدة — لا توجد نسختان متطابقتان",
      "تناسب الإطلالات الكاجوال والتقليدية",
    ],
    images: ["/images/hat-1.webp", "/images/hat-2.webp"],
    ogImage: "/images/hat-1.webp",
    metaTitle: "قبعة النخيل شمس بوسعادة — دار الصنعة",
    metaDescription:
      "قبعة نخيل تقليدية من بوسعادة، نسيج يدوي 100%، حماية من الشمس وأناقة صيفية. توصيل 58 ولاية، الدفع عند الاستلام.",
  },
  {
    id: "p2",
    slug: "qolla-tissage",
    name: "قلّة بوسعادة المنسوجة + كأسان",
    hook: "ماء بارد… بدون كهرباء",
    price: 3900,
    oldPrice: 4500,
    description:
      '"ثلاجة الجدّات" كما يسمّيها أهلنا. الفخار الطبيعي يحفظ برودة الماء ساعات طويلة ويمنحه مذاقاً نقياً من بيوت أجدادنا، والنسيج الملوّن المضفور يدوياً يجعلها تحفة تزيّن مطبخك قبل أن تخدمه. تأتي مع كأسين فخاريين منسّقين.',
    bullets: [
      "فخار طبيعي يحفظ برودة الماء لساعات",
      "غطاء ونسيج ملوّن مضفور يدوياً",
      "تأتي مع كأسين فخاريين منسّقين",
      "صحية، طبيعية، وصديقة للبيئة",
      "ديكور أصيل + استعمال يومي",
    ],
    images: ["/images/qolla-1.webp", "/images/qolla-2.webp"],
    ogImage: "/images/qolla-1.webp",
    metaTitle: "قلة بوسعادة المنسوجة + كأسان — دار الصنعة",
    metaDescription:
      "قلة فخارية تقليدية من بوسعادة مغطاة بنسيج ملون يدوي، تحفظ برودة الماء مع كأسين. توصيل لكل الولايات، الدفع عند الاستلام.",
  },
  {
    id: "p3",
    slug: "tableaux-desert",
    name: 'مجموعة لوحات "روح الصحراء"',
    hook: "لمسة تراثية… روح أصيلة لجدران بيتك",
    price: 3400,
    oldPrice: 4200,
    description:
      "لوحات قماشية مستوحاة من التراث الجزائري الأصيل — الفارس، الطوارقي، وكثبان الصحراء — تضيف لبيتك دفئاً وهوية. طباعة عالية الدقة على قماش، جاهزة للتعليق مباشرة، وهدية مثالية لمن تحب.",
    bullets: [
      "تصاميم تراثية أصلية من الصحراء الجزائرية",
      "طباعة عالية الدقة على قماش",
      "جاهزة للتعليق مباشرة",
      "عدة مقاسات متناسقة",
      "مثالية للديكور والإهداء",
    ],
    images: ["/images/canvas-set-1.webp", "/images/canvas-set-2.webp"],
    ogImage: "/images/canvas-set-1.webp",
    metaTitle: "مجموعة لوحات روح الصحراء — دار الصنعة",
    metaDescription:
      "مجموعة لوحات قماشية تراثية جزائرية من بوسعادة، جاهزة للتعليق. توصيل 58 ولاية، الدفع عند الاستلام.",
  },
  {
    id: "p4",
    slug: "tableau-enceadre",
    name: 'اللوحة المؤطّرة "فرحة البرّية"',
    hook: "لوحة تحكي قصة… بإطار يليق بها",
    price: 2900,
    oldPrice: 3600,
    description:
      "مشهد جزائري أصيل يفيض براءةً وفرحاً، في إطار ذهبي كلاسيكي فاخر. قطعة فنية تلفت الأنظار من أول نظرة وتضيف فخامة تراثية لأي جدار — في الصالون، المكتب، أو المدخل.",
    bullets: [
      "إطار ذهبي كلاسيكي فاخر",
      "ألوان دافئة تناسب كل الديكورات",
      "تصلح للصالون، المكتب، والمداخل",
      "هدية راقية لا تُنسى",
    ],
    images: ["/images/painting-1.webp", "/images/painting-2.webp"],
    ogImage: "/images/painting-1.webp",
    metaTitle: "اللوحة المؤطرة فرحة البرّية — دار الصنعة",
    metaDescription:
      "لوحة فنية مؤطرة بإطار ذهبي كلاسيكي، مشهد جزائري أصيل. توصيل لكل الولايات، الدفع عند الاستلام.",
  },
  {
    id: "p5",
    slug: "rondins-bois",
    name: 'أقراص خشبية "فارس الصحراء" — 4 قطع',
    hook: "أربع لوحات… حكاية واحدة",
    price: 2600,
    oldPrice: 3200,
    description:
      "جذوع خشبٍ طبيعي رُسم عليها يدوياً فارسُ الصحراء، بأربعة أحجام تتدرّج كأنها حكاية تُروى. ديكور راقٍ للرفوف والطاولات، وهدية تحمل توقيع حرفيّ… لا آلة.",
    bullets: [
      "رسم يدوي على خشب طبيعي 100%",
      "4 قطع بأحجام متدرّجة",
      "كل قطعة فريدة من نوعها",
      "ديكور راقٍ وهدية مثالية",
    ],
    images: ["/images/wood-1.webp"],
    ogImage: "/images/wood-1.webp",
    metaTitle: "أقراص خشبية فارس الصحراء 4 قطع — دار الصنعة",
    metaDescription:
      "أقراص خشبية مرسومة يدوياً بفارس الصحراء، 4 قطع بأحجام مختلفة. توصيل 58 ولاية، الدفع عند الاستلام.",
  },
  {
    id: "p6",
    slug: "mortier-cuivre",
    name: 'المِهراس النحاسي "مِهراس العروسة"',
    hook: "نحاس أصيل… لمطبخ يفخر بأصوله",
    price: 3200,
    oldPrice: 3900,
    description:
      "من نحاسٍ خالص مصقول يدوياً، المِهراس التقليدي الذي لا تستغني عنه المطابخ الجزائرية العريقة — للثوم، البهارات، والحناء. ثقيل، متين، ويزداد جمالاً مع الزمن. قطعة تراث تُورَّث ولا تُستهلك.",
    bullets: [
      "نحاس خالص مصقول يدوياً",
      "متين وثقيل — يدوم لأجيال",
      "مثالي للثوم والبهارات والحناء",
      "قطعة أساسية في جهاز العروسة الجزائرية",
      "لمعة ذهبية تزيّن مطبخك",
    ],
    images: ["/images/mortar-1.webp"],
    ogImage: "/images/mortar-1.webp",
    metaTitle: "المهراس النحاسي التقليدي — دار الصنعة",
    metaDescription:
      "مهراس نحاسي أصيل مصقول يدوياً من بوسعادة، للثوم والبهارات والحناء. توصيل لكل الولايات، الدفع عند الاستلام.",
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function formatPrice(n: number): string {
  return `${n.toLocaleString("ar-DZ")} ${STORE.currency}`;
}

export function normalizeApiProduct(raw: any): Product {
  return {
    id: String(raw.id),
    slug: String(raw.slug),
    name: String(raw.name),
    hook: String(raw.hook || ""),
    price: Number(raw.price),
    oldPrice: Number(raw.old_price || raw.oldPrice || 0),
    description: String(raw.description || ""),
    bullets: Array.isArray(raw.bullets)
      ? raw.bullets
      : JSON.parse(raw.bullets || "[]"),
    images: Array.isArray(raw.images)
      ? raw.images
      : JSON.parse(raw.images || "[]"),
    ogImage: String(raw.og_image || raw.ogImage || ""),
    metaTitle: String(raw.meta_title || raw.metaTitle || raw.name),
    metaDescription: String(raw.meta_description || raw.metaDescription || raw.description || ""),
  };
}

export function discountPercent(p: Product): number {
  return Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100);
}

export function buildOrderMessage(
  orderId: string,
  name: string,
  phone: string,
  wilaya: string,
  city: string,
  deliveryType: string,
  items: string,
  total: number,
  utm: string
): string {
  return [
    "السلام عليكم،",
    "طلب جديد من موقع دار الصنعة:",
    `رقم الطلب: #${orderId}`,
    `الاسم: ${name}`,
    `الهاتف: ${phone}`,
    `الولاية: ${wilaya}`,
    `البلدية: ${city}`,
    `نوع التوصيل: ${deliveryType}`,
    `المنتجات: ${items}`,
    `المجموع: ${total} دج`,
    utm ? `المصدر: ${utm}` : "",
    "الرجاء التأكيد لبدء التوصيل. شكراً.",
  ]
    .filter(Boolean)
    .join("%0A");
}

export function getWhatsAppLink(message: string): string {
  return `https://wa.me/${STORE.whatsapp}?text=${encodeURIComponent(message)}`;
}
