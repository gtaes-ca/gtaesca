import { randomUUID } from 'crypto';
import pool from '../db.js';
import { saveCmsImage } from './cmsImage.js';
import { slugify } from '../utils/slug.js';

const DEFAULT_TOPBAR = {
  phone: '+55 827 057 5405',
  email: 'example@gamil.com',
  address: '12 Green Road, 05 New York',
  social: {
    facebook: 'https://facebook.com/gtaes',
    twitter: 'https://twitter.com/gtaes',
    linkedin: 'https://linkedin.com/gtaes',
    instagram: '',
  },
};

const DEFAULT_SLIDER_SLIDES = [
  {
    subTitle: 'Service Company',
    titleLine1: 'Bright Solutions',
    titleLine2: 'for Dark Problems',
    text: 'We have been operating for over a decade, providing top-notch services to our clients',
    buttonText: 'Learn More',
    buttonLink: '/about',
    backgroundImage: 'assets/images/backgrounds/slider-1-1.jpg',
    backgroundImageMobile: 'assets/images/backgrounds/slider-1-1.jpg',
  },
  {
    subTitle: 'Service Company',
    titleLine1: 'Bright Solutions',
    titleLine2: 'for Dark Problems',
    text: 'We have been operating for over a decade, providing top-notch services to our clients',
    buttonText: 'Learn More',
    buttonLink: '/about',
    backgroundImage: 'assets/images/backgrounds/slider-1-2.jpg',
    backgroundImageMobile: 'assets/images/backgrounds/slider-1-2.jpg',
  },
  {
    subTitle: 'Service Company',
    titleLine1: 'Bright Solutions',
    titleLine2: 'for Dark Problems',
    text: 'We have been operating for over a decade, providing top-notch services to our clients',
    buttonText: 'Learn More',
    buttonLink: '/about',
    backgroundImage: 'assets/images/backgrounds/slider-1-3.jpg',
    backgroundImageMobile: 'assets/images/backgrounds/slider-1-3.jpg',
  },
];

const HOME_SERVICES_ICON = 'icon-like';
const FEATURED_SERVICES_ICON = 'icon-setting';

const DEFAULT_HOME_SERVICES = {
  items: [
    {
      title: 'Fair & Transparent Pricing',
      text: 'Honest upfront quotes with no hidden fees on residential and commercial electrical work.',
      link: '/residential',
      icon: HOME_SERVICES_ICON,
      image: '',
    },
    {
      title: 'Licensed & Insured',
      text: 'ESA-certified electricians delivering safe, code-compliant work backed by our satisfaction guarantee.',
      link: '/about',
      icon: HOME_SERVICES_ICON,
      image: '',
    },
    {
      title: '24/7 Emergency Service',
      text: 'Available around the clock for urgent electrical repairs across the Greater Toronto Area.',
      link: '/contact',
      icon: HOME_SERVICES_ICON,
      image: '',
    },
  ],
};

const DEFAULT_HOME_ABOUT = {
  tagline: 'Get To Know Us',
  title: 'Trusted Electrical Experts Across the Greater Toronto Area',
  text1: 'GTA Electric Services provides reliable residential and commercial electrical solutions, from troubleshooting and repairs to panel upgrades, lighting, EV chargers, and full-home rewiring.',
  text2: 'Our licensed ESA-certified electricians deliver safe, code-compliant work with honest pricing and dependable service you can count on.',
  buttonText: 'About Us More',
  buttonLink: '/about',
  badgeLine1: '',
  badgeLine2: '',
  image1: 'assets/images/resources/about-one-img-1.jpg',
  image2: 'assets/images/resources/about-one-img-2.jpg',
};

const DEFAULT_HOME_FEATURED_SERVICES = {
  tagline: 'What We Do',
  titleLine1: 'Featured Electrical Services',
  titleLine2: 'for Your Home & Business',
  serviceIds: [],
};

const DEFAULT_SERVICES_HOMEPAGE_SECTION = {
  tagline: 'What We Do',
  titleLine1: 'Featured Electrical Services',
  titleLine2: 'for Your Home & Business',
};

const DEFAULT_HOME_GALLERY = {
  tagline: '',
  titleLine1: '',
  titleLine2: '',
  buttonText: '',
  buttonLink: '/projects',
  items: [],
};

const DEFAULT_HOME_TESTIMONIALS = {
  tagline: 'Testimonials',
  titleLine1: 'What Our Clients Say',
  titleLine2: '',
  items: [
    {
      message:
        'GTA Electric Services upgraded our panel quickly and explained every step. Professional, clean work, and fair pricing.',
      clientName: 'Sarah Mitchell',
      timestamp: '2026-06-12T14:30:00.000Z',
      rating: 5,
    },
    {
      message:
        'They handled our office lighting retrofit after hours so we had zero downtime. Highly recommend for commercial work.',
      clientName: 'James Chen',
      timestamp: '2026-05-28T10:00:00.000Z',
      rating: 5,
    },
    {
      message:
        'Responsive, licensed, and thorough. Fixed our intermittent breaker issues the same week we called.',
      clientName: 'Priya Patel',
      timestamp: '2026-04-18T16:45:00.000Z',
      rating: 4,
    },
  ],
};

const DEFAULT_HOME_COVERAGE = {
  tagline: 'Service Coverage',
  titleLine1: 'Areas We Serve Across the GTA',
  titleLine2: '',
  text: 'Licensed electrical service throughout the Greater Toronto Area and nearby communities.',
  gtaLabel: 'Greater Toronto Area',
  nearbyLabel: 'Nearby Areas',
};

function normalizeSlide(slide = {}, index = 0) {
  const fallback = DEFAULT_SLIDER_SLIDES[index] || DEFAULT_SLIDER_SLIDES[0];
  const backgroundImage = String(slide.backgroundImage ?? fallback.backgroundImage).trim();
  const backgroundImageMobile = String(
    slide.backgroundImageMobile ?? slide.backgroundImage ?? fallback.backgroundImageMobile
  ).trim();

  return {
    subTitle: String(slide.subTitle ?? fallback.subTitle).trim(),
    titleLine1: String(slide.titleLine1 ?? fallback.titleLine1).trim(),
    titleLine2: String(slide.titleLine2 ?? fallback.titleLine2).trim(),
    text: String(slide.text ?? fallback.text).trim(),
    buttonText: String(slide.buttonText ?? fallback.buttonText).trim(),
    buttonLink: String(slide.buttonLink ?? fallback.buttonLink).trim(),
    backgroundImage,
    backgroundImageMobile: backgroundImageMobile || backgroundImage,
  };
}

export function normalizeSliderContent(content = {}) {
  const slides = Array.isArray(content.slides) && content.slides.length
    ? content.slides.map((slide, index) => normalizeSlide(slide, index))
    : DEFAULT_SLIDER_SLIDES.map((slide, index) => normalizeSlide(slide, index));

  return { slides };
}

export function normalizeHomeServicesContent(content = {}) {
  const items = Array.isArray(content.items) && content.items.length
    ? content.items
    : DEFAULT_HOME_SERVICES.items;

  return {
    items: items.slice(0, 3).map((item, index) => {
      const fallback = DEFAULT_HOME_SERVICES.items[index] || DEFAULT_HOME_SERVICES.items[0];
      const image = String(item?.image ?? fallback.image ?? '').trim();
      return {
        title: String(item?.title ?? fallback.title).trim(),
        text: String(item?.text ?? fallback.text).trim(),
        link: String(item?.link ?? fallback.link).trim(),
        icon: String(item?.icon ?? fallback.icon ?? HOME_SERVICES_ICON).trim() || HOME_SERVICES_ICON,
        image,
      };
    }),
  };
}

export function normalizeHomeAboutContent(content = {}) {
  return {
    tagline: String(content.tagline ?? DEFAULT_HOME_ABOUT.tagline).trim(),
    title: String(content.title ?? DEFAULT_HOME_ABOUT.title).trim(),
    text1: String(content.text1 ?? DEFAULT_HOME_ABOUT.text1).trim(),
    text2: String(content.text2 ?? DEFAULT_HOME_ABOUT.text2).trim(),
    buttonText: String(content.buttonText ?? DEFAULT_HOME_ABOUT.buttonText).trim(),
    buttonLink: String(content.buttonLink ?? DEFAULT_HOME_ABOUT.buttonLink).trim(),
    badgeLine1: String(content.badgeLine1 ?? DEFAULT_HOME_ABOUT.badgeLine1).trim(),
    badgeLine2: String(content.badgeLine2 ?? DEFAULT_HOME_ABOUT.badgeLine2).trim(),
    image1: String(content.image1 ?? DEFAULT_HOME_ABOUT.image1).trim(),
    image2: String(content.image2 ?? DEFAULT_HOME_ABOUT.image2).trim(),
  };
}

export function normalizeFeaturedServicesWidgetContent(content = {}) {
  const serviceIds = Array.isArray(content.serviceIds)
    ? content.serviceIds.map((id) => Number(id)).filter((id) => Number.isInteger(id) && id > 0)
    : DEFAULT_HOME_FEATURED_SERVICES.serviceIds;

  return {
    tagline: String(content.tagline ?? DEFAULT_HOME_FEATURED_SERVICES.tagline).trim(),
    titleLine1: String(content.titleLine1 ?? DEFAULT_HOME_FEATURED_SERVICES.titleLine1).trim(),
    titleLine2: String(content.titleLine2 ?? DEFAULT_HOME_FEATURED_SERVICES.titleLine2).trim(),
    serviceIds,
  };
}

function formatFeaturedService(row) {
  const categoryName = row.category_name || '';
  const isCommercial = String(categoryName).toLowerCase().includes('commercial');
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description || '',
    image: row.image_url || '',
    categoryId: row.category_id,
    categoryName,
    categorySortOrder: row.category_sort_order ?? 0,
    link: row.slug ? `/services/${row.slug}` : (isCommercial ? '/commercial' : '/residential'),
    icon: FEATURED_SERVICES_ICON,
  };
}

function buildFeaturedServiceCategories(services = []) {
  const categories = new Map();

  for (const service of services) {
    if (!service?.categoryId || categories.has(service.categoryId)) continue;
    categories.set(service.categoryId, {
      id: service.categoryId,
      name: service.categoryName || '',
      sortOrder: service.categorySortOrder ?? 0,
    });
  }

  return [...categories.values()].sort((a, b) => {
    if (a.sortOrder !== b.sortOrder) return a.sortOrder - b.sortOrder;
    return a.id - b.id;
  });
}

function normalizeGalleryItem(item = {}) {
  return {
    subTitle: String(item?.subTitle ?? '').trim(),
    title: String(item?.title ?? '').trim(),
    text: String(item?.text ?? '').trim(),
    link: String(item?.link ?? '/projects').trim(),
    image: String(item?.image ?? '').trim(),
  };
}

export function normalizeHomeGalleryContent(content = {}) {
  const items = Array.isArray(content.items) && content.items.length
    ? content.items.map((item) => normalizeGalleryItem(item))
    : [];

  return {
    tagline: String(content.tagline ?? DEFAULT_HOME_GALLERY.tagline).trim(),
    titleLine1: String(content.titleLine1 ?? DEFAULT_HOME_GALLERY.titleLine1).trim(),
    titleLine2: String(content.titleLine2 ?? DEFAULT_HOME_GALLERY.titleLine2).trim(),
    buttonText: String(content.buttonText ?? DEFAULT_HOME_GALLERY.buttonText).trim(),
    buttonLink: String(content.buttonLink ?? DEFAULT_HOME_GALLERY.buttonLink).trim(),
    items,
  };
}

function clampRating(value) {
  const rating = Number(value);
  if (!Number.isFinite(rating)) return 5;
  return Math.min(5, Math.max(1, Math.round(rating)));
}

function normalizeTimestamp(value) {
  const raw = String(value ?? '').trim();
  if (!raw) return '';
  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) return raw;
  return date.toISOString();
}

function normalizeTestimonialItem(item = {}) {
  return {
    message: String(item?.message ?? '').trim(),
    clientName: String(item?.clientName ?? '').trim(),
    timestamp: normalizeTimestamp(item?.timestamp),
    rating: clampRating(item?.rating ?? 5),
  };
}

export function normalizeHomeTestimonialsContent(content = {}) {
  const items = Array.isArray(content.items)
    ? content.items.map((item) => normalizeTestimonialItem(item)).filter((item) => item.message && item.clientName)
    : [];

  return {
    tagline: String(content.tagline ?? DEFAULT_HOME_TESTIMONIALS.tagline).trim(),
    titleLine1: String(content.titleLine1 ?? DEFAULT_HOME_TESTIMONIALS.titleLine1).trim(),
    titleLine2: String(content.titleLine2 ?? DEFAULT_HOME_TESTIMONIALS.titleLine2).trim(),
    items,
  };
}

export function normalizeHomeCoverageContent(content = {}) {
  return {
    tagline: String(content.tagline ?? DEFAULT_HOME_COVERAGE.tagline).trim(),
    titleLine1: String(content.titleLine1 ?? DEFAULT_HOME_COVERAGE.titleLine1).trim(),
    titleLine2: String(content.titleLine2 ?? DEFAULT_HOME_COVERAGE.titleLine2).trim(),
    text: String(content.text ?? DEFAULT_HOME_COVERAGE.text).trim(),
    gtaLabel: String(content.gtaLabel ?? DEFAULT_HOME_COVERAGE.gtaLabel).trim(),
    nearbyLabel: String(content.nearbyLabel ?? DEFAULT_HOME_COVERAGE.nearbyLabel).trim(),
  };
}

async function getPublicCoverageLocations() {
  const result = await pool.query(
    `SELECT l.id, l.region, l.name, l.parent_id, l.sort_order,
            p.name AS parent_name
     FROM service_locations l
     LEFT JOIN service_locations p ON p.id = l.parent_id
     ORDER BY l.region, COALESCE(p.sort_order, l.sort_order), l.sort_order, l.name`
  );

  const locations = { gta: [], nearby: [] };
  for (const row of result.rows) {
    const item = {
      id: row.id,
      name: row.name,
      parentId: row.parent_id,
      parentName: row.parent_name || '',
      sortOrder: row.sort_order,
      label: row.parent_name ? `${row.name} (${row.parent_name})` : row.name,
    };
    if (row.region === 'gta') locations.gta.push(item);
    if (row.region === 'nearby') locations.nearby.push(item);
  }
  return locations;
}

export async function getHomeCoverageContent() {
  const widget = await getWidget('home', 'coverage');
  const content = normalizeHomeCoverageContent(widget?.content || DEFAULT_HOME_COVERAGE);

  let locations = { gta: [], nearby: [] };
  try {
    locations = await getPublicCoverageLocations();
  } catch (error) {
    console.warn(`Coverage locations unavailable: ${error.message}`);
  }

  return { ...content, locations };
}

export async function updateHomeCoverageContent(content) {
  const normalized = normalizeHomeCoverageContent(content);

  if (!normalized.titleLine1) {
    throw new Error('Coverage section title is required');
  }

  const widget = await upsertWidget('home', 'coverage', normalized);
  return normalizeHomeCoverageContent(widget.content);
}

function convertHomeGalleryToProjectsContent(homeContent) {
  const home = normalizeHomeGalleryContent(homeContent);

  return {
    tagline: home.tagline,
    titleLine1: home.titleLine1,
    titleLine2: home.titleLine2,
    buttonText: home.buttonText,
    buttonLink: home.buttonLink,
    items: home.items.map((item, index) => {
      const id = randomUUID();

      return {
        id,
        subTitle: item.subTitle,
        title: item.title,
        text: item.text,
        challengeText: '',
        resultText: '',
        client: '',
        date: '',
        location: '',
        image: item.image,
      };
    }),
  };
}

function mapProjectsGalleryToHomeContent(projectsContent) {
  return {
    tagline: projectsContent.tagline,
    titleLine1: projectsContent.titleLine1,
    titleLine2: projectsContent.titleLine2,
    buttonText: projectsContent.buttonText,
    buttonLink: projectsContent.buttonLink,
    items: projectsContent.items.map((item) => ({
      subTitle: item.subTitle,
      title: item.title,
      text: item.text,
      link: item.link,
      image: item.image,
    })),
  };
}

async function persistGalleryImages(items) {
  return Promise.all(items.map(async (item, index) => {
    const next = { ...item };
    if (item.imageData) {
      next.image = saveCmsImage(`home-gallery-${index}`, item.imageData);
    }
    delete next.imageData;
    return normalizeGalleryItem(next);
  }));
}

async function resolveFeaturedServices(serviceIds = []) {
  if (!serviceIds.length) {
    const result = await pool.query(
      `SELECT s.id, s.slug, s.name, s.description, s.image_url,
              c.id AS category_id, c.name AS category_name, c.sort_order AS category_sort_order
       FROM services s
       JOIN service_categories c ON c.id = s.category_id
       ORDER BY s.sort_order, s.id
       LIMIT 3`
    );
    return result.rows.map((row) => formatFeaturedService(row));
  }

  const result = await pool.query(
    `SELECT s.id, s.slug, s.name, s.description, s.image_url,
            c.id AS category_id, c.name AS category_name, c.sort_order AS category_sort_order
     FROM services s
     JOIN service_categories c ON c.id = s.category_id
     WHERE s.id = ANY($1::int[])
     ORDER BY array_position($1::int[], s.id)`,
    [serviceIds]
  );

  return result.rows.map((row) => formatFeaturedService(row));
}

async function persistAboutImages(content) {
  const next = { ...content };

  if (content.image1Data) {
    next.image1 = saveCmsImage('home-about-image-1', content.image1Data);
  }
  if (content.image2Data) {
    next.image2 = saveCmsImage('home-about-image-2', content.image2Data);
  }

  delete next.image1Data;
  delete next.image2Data;

  return normalizeHomeAboutContent(next);
}

async function persistSlideImages(slides) {
  return Promise.all(slides.map(async (slide, index) => {
    const next = { ...slide };

    if (slide.backgroundImageData) {
      next.backgroundImage = saveCmsImage(`home-slider-${index}-background`, slide.backgroundImageData);
    }
    if (slide.backgroundImageMobileData) {
      next.backgroundImageMobile = saveCmsImage(
        `home-slider-${index}-background-mobile`,
        slide.backgroundImageMobileData
      );
    }

    delete next.backgroundImageData;
    delete next.backgroundImageMobileData;
    delete next.overlayImageData;
    delete next.overlayImage;
    delete next.portraitImageData;
    delete next.portraitImage;

    return normalizeSlide(next, index);
  }));
}

function formatWidget(row) {
  if (!row) return null;
  return {
    id: row.id,
    page: row.page,
    section: row.section,
    content: row.content,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function getWidget(page, section) {
  const result = await pool.query(
    'SELECT * FROM web_content_widgets WHERE page = $1 AND section = $2',
    [page, section]
  );
  return formatWidget(result.rows[0]);
}

export async function getPageWidgets(page) {
  const result = await pool.query(
    'SELECT * FROM web_content_widgets WHERE page = $1 ORDER BY section',
    [page]
  );
  return result.rows.map(formatWidget);
}

export async function upsertWidget(page, section, content) {
  if (!page || !section) {
    throw new Error('Page and section are required');
  }
  if (!content || typeof content !== 'object' || Array.isArray(content)) {
    throw new Error('Content must be a JSON object');
  }

  const result = await pool.query(
    `INSERT INTO web_content_widgets (page, section, content)
     VALUES ($1, $2, $3::jsonb)
     ON CONFLICT (page, section)
     DO UPDATE SET
       content = EXCLUDED.content,
       updated_at = NOW()
     RETURNING *`,
    [page, section, JSON.stringify(content)]
  );

  return formatWidget(result.rows[0]);
}

export function normalizeTopbarContent(content = {}) {
  return {
    phone: String(content.phone || DEFAULT_TOPBAR.phone).trim(),
    email: String(content.email || DEFAULT_TOPBAR.email).trim(),
    address: String(content.address || DEFAULT_TOPBAR.address).trim(),
    social: {
      facebook: String(content.social?.facebook || '').trim(),
      twitter: String(content.social?.twitter || '').trim(),
      linkedin: String(content.social?.linkedin || '').trim(),
      instagram: String(content.social?.instagram || '').trim(),
    },
  };
}

export async function getTopbarContent() {
  const widget = await getWidget('home', 'topbar');
  return normalizeTopbarContent(widget?.content || DEFAULT_TOPBAR);
}

export async function updateTopbarContent(content) {
  const normalized = normalizeTopbarContent(content);
  if (!normalized.email) {
    throw new Error('Email is required');
  }
  if (!normalized.address) {
    throw new Error('Address is required');
  }
  return upsertWidget('home', 'topbar', normalized);
}

export async function getSliderContent() {
  const widget = await getWidget('home', 'slider');
  return normalizeSliderContent(widget?.content || { slides: DEFAULT_SLIDER_SLIDES });
}

export async function getHomeServicesContent() {
  const widget = await getWidget('home', 'services');
  return normalizeHomeServicesContent(widget?.content || DEFAULT_HOME_SERVICES);
}

export async function updateHomeServicesContent(content) {
  const next = { ...(content || {}) };
  // Support optional base64 image uploads coming from the admin UI.
  if (Array.isArray(next.items)) {
    next.items = await Promise.all(
      next.items.map(async (item, index) => {
        const nextItem = { ...item };
        if (nextItem.imageData) {
          nextItem.image = saveCmsImage(`home-service-feature-${index}`, nextItem.imageData);
          delete nextItem.imageData;
        }
        return nextItem;
      })
    );
  }

  const normalized = normalizeHomeServicesContent(next);

  for (const item of normalized.items) {
    if (!item.title) {
      throw new Error('Each service feature requires a title');
    }
    if (!item.text) {
      throw new Error('Each service feature requires a description');
    }
    if (!item.link) {
      throw new Error('Each service feature requires a link');
    }
  }

  return upsertWidget('home', 'services', normalized);
}

export async function getHomeAboutContent() {
  const widget = await getWidget('home', 'about');
  return normalizeHomeAboutContent(widget?.content || DEFAULT_HOME_ABOUT);
}

export async function updateHomeAboutContent(content) {
  const withImages = await persistAboutImages(content || {});
  const normalized = normalizeHomeAboutContent(withImages);

  if (!normalized.title) {
    throw new Error('Title is required');
  }
  if (!normalized.text1) {
    throw new Error('Primary description is required');
  }
  if (!normalized.image1) {
    throw new Error('Primary side image is required');
  }
  if (!normalized.image2) {
    throw new Error('Secondary side image is required');
  }

  return upsertWidget('home', 'about', normalized);
}

export async function getFeaturedServicesContent() {
  const widget = await getWidget('home', 'featured-services');
  const settings = normalizeFeaturedServicesWidgetContent(widget?.content || DEFAULT_HOME_FEATURED_SERVICES);
  const services = await resolveFeaturedServices(settings.serviceIds);

  const [
    residentialBanner,
    residentialDetails,
    commercialBanner,
    commercialDetails,
  ] = await Promise.all([
    getServiceCategoryBannerContent('residential'),
    getServiceCategoryDetailsContent('residential'),
    getServiceCategoryBannerContent('commercial'),
    getServiceCategoryDetailsContent('commercial'),
  ]);

  const categoryCards = [
    {
      key: 'residential',
      name: residentialDetails.tagline || 'Residential',
      title: residentialBanner.title || residentialDetails.title || 'Residential Services',
      text: residentialDetails.text || '',
      backgroundImage: residentialBanner.backgroundImage || '',
      link: '/residential',
    },
    {
      key: 'commercial',
      name: commercialDetails.tagline || 'Commercial',
      title: commercialBanner.title || commercialDetails.title || 'Commercial Services',
      text: commercialDetails.text || '',
      backgroundImage: commercialBanner.backgroundImage || '',
      link: '/commercial',
    },
  ];

  return {
    ...settings,
    services,
    categories: buildFeaturedServiceCategories(services),
    categoryCards,
  };
}

export async function updateFeaturedServicesContent(content) {
  const normalized = normalizeFeaturedServicesWidgetContent(content);

  if (!normalized.titleLine1) {
    throw new Error('Section title is required');
  }

  if (normalized.serviceIds.length) {
    const result = await pool.query(
      'SELECT id FROM services WHERE id = ANY($1::int[])',
      [normalized.serviceIds]
    );
    if (result.rowCount !== normalized.serviceIds.length) {
      throw new Error('One or more selected services are invalid');
    }
  }

  return upsertWidget('home', 'featured-services', {
    tagline: normalized.tagline,
    titleLine1: normalized.titleLine1,
    titleLine2: normalized.titleLine2,
    serviceIds: normalized.serviceIds,
  });
}

export async function getHomeGalleryContent() {
  const projects = await getProjectsGalleryContent();
  return mapProjectsGalleryToHomeContent(projects);
}

export async function getHomeTestimonialsContent() {
  const widget = await getWidget('home', 'testimonials');
  if (!widget?.content) {
    return normalizeHomeTestimonialsContent(DEFAULT_HOME_TESTIMONIALS);
  }
  return normalizeHomeTestimonialsContent(widget.content);
}

export async function updateHomeTestimonialsContent(content) {
  const normalized = normalizeHomeTestimonialsContent(content);

  if (!normalized.titleLine1) {
    throw new Error('Testimonials title is required');
  }

  for (const item of normalized.items) {
    if (!item.message) {
      throw new Error('Each testimonial requires a message');
    }
    if (!item.clientName) {
      throw new Error('Each testimonial requires a client name');
    }
    if (!item.timestamp) {
      throw new Error('Each testimonial requires a timestamp');
    }
  }

  return upsertWidget('home', 'testimonials', normalized);
}

export async function updateHomeGalleryContent(content) {
  const existing = await getProjectsGalleryContent();
  const incomingItems = Array.isArray(content?.items) ? content.items : [];
  if (!incomingItems.length) {
    throw new Error('At least one gallery item is required');
  }

  const itemsWithImages = await persistGalleryImages(incomingItems);
  const normalized = normalizeHomeGalleryContent({
    ...content,
    items: itemsWithImages,
  });

  if (!normalized.titleLine1) {
    throw new Error('Gallery title is required');
  }

  const mergedItems = itemsWithImages.map((item, index) => {
    const existingItem = existing.items[index];

    return {
      id: existingItem?.id || randomUUID(),
      subTitle: item.subTitle,
      title: item.title,
      text: item.text,
      image: item.image,
      challengeText: existingItem?.challengeText || '',
      resultText: existingItem?.resultText || '',
      client: existingItem?.client || '',
      date: existingItem?.date || '',
      location: existingItem?.location || '',
    };
  });

  for (const item of mergedItems) {
    if (!item.title) {
      throw new Error('Each gallery item requires a title');
    }
    if (!item.image) {
      throw new Error('Each gallery item requires an image');
    }
  }

  return updateProjectsGalleryContent({
    tagline: normalized.tagline,
    titleLine1: normalized.titleLine1,
    titleLine2: normalized.titleLine2,
    buttonText: normalized.buttonText,
    buttonLink: normalized.buttonLink,
    items: mergedItems,
  });
}

export async function updateSliderContent(content) {
  const incomingSlides = Array.isArray(content?.slides) ? content.slides : [];
  if (!incomingSlides.length) {
    throw new Error('At least one slide is required');
  }

  const slidesWithImages = await persistSlideImages(incomingSlides);
  const normalized = normalizeSliderContent({ slides: slidesWithImages });

  for (const slide of normalized.slides) {
    if (!slide.titleLine1) {
      throw new Error('Each slide requires a title');
    }
    if (!slide.backgroundImage) {
      throw new Error('Each slide requires a desktop background image');
    }
    if (!slide.backgroundImageMobile) {
      throw new Error('Each slide requires a mobile background image');
    }
  }

  return upsertWidget('home', 'slider', normalized);
}

const DEFAULT_ABOUT_BANNER = {
  title: 'About Us',
  backgroundImage: '',
};

const DEFAULT_TEAM_BANNER = {
  title: 'Our Team',
  backgroundImage: '',
};

const DEFAULT_TEAM_DETAILS_BANNER = {
  title: 'Member Details',
  backgroundImage: '',
};

const DEFAULT_ABOUT_INTRO = {
  tagline: 'Who We Are',
  title: 'Built on Safety, Skill, and Service Across the GTA',
  text1:
    'GTA Electric Services is a licensed electrical contractor serving homes and businesses throughout the Greater Toronto Area with clear communication and dependable workmanship.',
  text2:
    'From panel upgrades and lighting to EV chargers and emergency repairs, our ESA-certified team focuses on code-compliant installs and honest recommendations.',
  points: [
    'Licensed & insured electricians',
    'Residential and commercial expertise',
    'Transparent quotes with no hidden fees',
  ],
  image: 'assets/images/resources/about-one-img-1.jpg',
  buttonText: 'Request a Quote',
  buttonLink: '/contact',
};

const DEFAULT_ABOUT_VALUES = {
  tagline: 'Our Values',
  title: 'What We Stand For',
  items: [
    {
      icon: 'icon-certified',
      title: 'Safety Above All',
      text: 'Every decision we make on the job starts with safety — for your family, your property, and our team. We follow ESA standards on every project, no exceptions.',
    },
    {
      icon: 'icon-speech-bubbles',
      title: 'Honest Communication',
      text: 'We tell you what the job involves, what it will cost, and how long it will take — before we start. No surprises, no upselling, no runaround.',
    },
    {
      icon: 'icon-medal',
      title: 'Quality Workmanship',
      text: 'We take pride in clean, careful work. From the wiring inside your walls to the finish on your pot lights, the details matter to us.',
    },
    {
      icon: 'icon-clock',
      title: 'Reliable Service',
      text: 'We show up when we say we will, complete the work on schedule, and follow up to make sure you are satisfied. That is how we have earned long-term client relationships.',
    },
  ],
};

const DEFAULT_ABOUT_CREDENTIALS = {
  title: 'Licensed & Certified',
  esaLicenseNumber: '#7014495',
  items: [
    {
      image: 'assets/images/brand/esa-logo.svg',
      label: 'ESA Licensed',
    },
    {
      image: 'assets/images/brand/wsib-logo.svg',
      label: 'WSIB Certified',
    },
  ],
};

function normalizeEsaLicenseNumber(value) {
  let next = String(value ?? '').trim();
  // Strip label-like prefixes so CMS can store either "#7014495" or "ESA Licensed #7014495"
  next = next.replace(/^esa\s*licen[sc]e[d]?\s*/i, '').trim();
  next = next.replace(/^license\s*(no\.?|number|#)?\s*/i, '').trim();
  // Keep only the first line if pasted as multi-line text
  next = next.split(/\r?\n/)[0].trim();
  return next;
}

export function normalizeAboutBannerContent(content = {}) {
  return {
    title: String(content.title ?? DEFAULT_ABOUT_BANNER.title).trim(),
    backgroundImage: String(content.backgroundImage ?? DEFAULT_ABOUT_BANNER.backgroundImage).trim(),
  };
}

export async function getAboutBannerContent() {
  const widget = await getWidget('about', 'banner');
  return normalizeAboutBannerContent(widget?.content || DEFAULT_ABOUT_BANNER);
}

export async function updateAboutBannerContent(content) {
  const normalized = normalizeAboutBannerContent(content);

  if (!normalized.title) {
    throw new Error('Banner title is required');
  }

  const widget = await upsertWidget('about', 'banner', normalized);
  return normalizeAboutBannerContent(widget.content);
}

export function normalizeAboutIntroContent(content = {}) {
  const rawPoints = Array.isArray(content.points) ? content.points : DEFAULT_ABOUT_INTRO.points;
  const points = rawPoints
    .map((point) => String(point ?? '').trim())
    .filter(Boolean)
    .slice(0, 6);

  return {
    tagline: String(content.tagline ?? DEFAULT_ABOUT_INTRO.tagline).trim(),
    title: String(content.title ?? DEFAULT_ABOUT_INTRO.title).trim(),
    text1: String(content.text1 ?? DEFAULT_ABOUT_INTRO.text1).trim(),
    text2: String(content.text2 ?? DEFAULT_ABOUT_INTRO.text2).trim(),
    points: points.length ? points : [...DEFAULT_ABOUT_INTRO.points],
    image: String(content.image ?? DEFAULT_ABOUT_INTRO.image).trim(),
    buttonText: String(content.buttonText ?? DEFAULT_ABOUT_INTRO.buttonText).trim(),
    buttonLink: String(content.buttonLink ?? DEFAULT_ABOUT_INTRO.buttonLink).trim(),
  };
}

export async function getAboutIntroContent() {
  const widget = await getWidget('about', 'intro');
  return normalizeAboutIntroContent(widget?.content || DEFAULT_ABOUT_INTRO);
}

export async function updateAboutIntroContent(content) {
  const incoming = { ...(content || {}) };
  if (incoming.imageData) {
    incoming.image = saveCmsImage('about-intro-image', incoming.imageData);
  }
  delete incoming.imageData;

  const normalized = normalizeAboutIntroContent(incoming);

  if (!normalized.title) {
    throw new Error('Title is required');
  }
  if (!normalized.image) {
    throw new Error('Section image is required');
  }

  const widget = await upsertWidget('about', 'intro', normalized);
  return normalizeAboutIntroContent(widget.content);
}

export function normalizeAboutValuesContent(content = {}) {
  const defaults = DEFAULT_ABOUT_VALUES.items;
  const rawItems = Array.isArray(content.items) ? content.items : defaults;

  const items = rawItems
    .map((item, index) => ({
      icon: String(item?.icon ?? defaults[index]?.icon ?? 'icon-check').trim() || 'icon-check',
      title: String(item?.title ?? '').trim(),
      text: String(item?.text ?? '').trim(),
    }))
    .filter((item) => item.title || item.text)
    .slice(0, 8);

  return {
    tagline: String(content.tagline ?? DEFAULT_ABOUT_VALUES.tagline).trim(),
    title: String(content.title ?? DEFAULT_ABOUT_VALUES.title).trim(),
    items: items.length ? items : defaults.map((item) => ({ ...item })),
  };
}

export async function getAboutValuesContent() {
  const widget = await getWidget('about', 'values');
  return normalizeAboutValuesContent(widget?.content || DEFAULT_ABOUT_VALUES);
}

export async function updateAboutValuesContent(content) {
  const normalized = normalizeAboutValuesContent(content);

  if (!normalized.title) {
    throw new Error('Title is required');
  }
  if (!normalized.items.length) {
    throw new Error('At least one value card is required');
  }
  for (const [index, item] of normalized.items.entries()) {
    if (!item.title) {
      throw new Error(`Value card ${index + 1} needs a title`);
    }
    if (!item.text) {
      throw new Error(`Value card ${index + 1} needs a description`);
    }
  }

  const widget = await upsertWidget('about', 'values', normalized);
  return normalizeAboutValuesContent(widget.content);
}

export function normalizeAboutCredentialsContent(content = {}) {
  const defaults = DEFAULT_ABOUT_CREDENTIALS.items;
  const rawItems = Array.isArray(content.items) ? content.items : defaults;

  const items = rawItems
    .map((item, index) => ({
      image: String(item?.image ?? defaults[index]?.image ?? '').trim(),
      label: String(item?.label ?? '').trim(),
    }))
    .filter((item) => item.image || item.label)
    .slice(0, 6);

  return {
    title: String(content.title ?? DEFAULT_ABOUT_CREDENTIALS.title).trim(),
    esaLicenseNumber: normalizeEsaLicenseNumber(
      content.esaLicenseNumber ?? DEFAULT_ABOUT_CREDENTIALS.esaLicenseNumber
    ),
    items: items.length ? items : defaults.map((item) => ({ ...item })),
  };
}

export async function getAboutCredentialsContent() {
  const widget = await getWidget('about', 'credentials');
  return normalizeAboutCredentialsContent(widget?.content || DEFAULT_ABOUT_CREDENTIALS);
}

export async function updateAboutCredentialsContent(content) {
  const incoming = { ...(content || {}) };
  const rawItems = Array.isArray(incoming.items) ? incoming.items : [];

  incoming.items = rawItems.map((item, index) => {
    const next = { ...(item || {}) };
    if (next.imageData) {
      next.image = saveCmsImage(`about-credentials-${index}`, next.imageData);
    }
    delete next.imageData;
    return next;
  });

  const normalized = normalizeAboutCredentialsContent(incoming);

  if (!normalized.title) {
    throw new Error('Title is required');
  }
  if (!normalized.items.length) {
    throw new Error('At least one credential card is required');
  }
  for (const [index, item] of normalized.items.entries()) {
    if (!item.label) {
      throw new Error(`Credential card ${index + 1} needs a label`);
    }
    if (!item.image) {
      throw new Error(`Credential card ${index + 1} needs a logo image`);
    }
  }

  const widget = await upsertWidget('about', 'credentials', normalized);
  return normalizeAboutCredentialsContent(widget.content);
}

export function normalizeTeamBannerContent(content = {}) {
  return {
    title: String(content.title ?? DEFAULT_TEAM_BANNER.title).trim(),
    backgroundImage: String(content.backgroundImage ?? DEFAULT_TEAM_BANNER.backgroundImage).trim(),
  };
}

export async function getTeamBannerContent() {
  const widget = await getWidget('team', 'banner');
  return normalizeTeamBannerContent(widget?.content || DEFAULT_TEAM_BANNER);
}

export async function updateTeamBannerContent(content) {
  const normalized = normalizeTeamBannerContent(content);

  if (!normalized.title) {
    throw new Error('Banner title is required');
  }

  const widget = await upsertWidget('team', 'banner', normalized);
  return normalizeTeamBannerContent(widget.content);
}

export function normalizeTeamDetailsBannerContent(content = {}) {
  return {
    title: String(content.title ?? DEFAULT_TEAM_DETAILS_BANNER.title).trim(),
    backgroundImage: String(content.backgroundImage ?? DEFAULT_TEAM_DETAILS_BANNER.backgroundImage).trim(),
  };
}

export async function getTeamDetailsBannerContent() {
  const widget = await getWidget('team-details', 'banner');
  return normalizeTeamDetailsBannerContent(widget?.content || DEFAULT_TEAM_DETAILS_BANNER);
}

export async function updateTeamDetailsBannerContent(content) {
  const normalized = normalizeTeamDetailsBannerContent(content);

  if (!normalized.title) {
    throw new Error('Banner title is required');
  }

  const widget = await upsertWidget('team-details', 'banner', normalized);
  return normalizeTeamDetailsBannerContent(widget.content);
}

const DEFAULT_PROJECTS_BANNER = {
  title: 'Projects',
  backgroundImage: '',
};

const DEFAULT_PROJECT_DETAILS_BANNER = {
  title: 'Project Details',
  backgroundImage: '',
};

const DEFAULT_PROJECTS_GALLERY = {
  tagline: '',
  titleLine1: '',
  titleLine2: '',
  buttonText: '',
  buttonLink: '/projects',
  items: [],
};

function normalizeProjectItem(item = {}, usedSlugs = new Set()) {
  const id = String(item?.id ?? randomUUID()).trim();
  const title = String(item?.title ?? '').trim();
  const existingSlug = slugify(item?.slug || item?.link?.split('/').filter(Boolean).pop());
  const baseSlug = slugify(title) || `project-${id.slice(0, 8)}`;
  const slug = existingSlug && !usedSlugs.has(existingSlug)
    ? existingSlug
    : (() => {
      let candidate = baseSlug;
      let counter = 2;
      while (usedSlugs.has(candidate)) {
        candidate = `${baseSlug}-${counter}`;
        counter += 1;
      }
      return candidate;
    })();

  usedSlugs.add(slug);

  return {
    id,
    slug,
    subTitle: String(item?.subTitle ?? '').trim(),
    title,
    text: String(item?.text ?? '').trim(),
    challengeText: String(item?.challengeText ?? '').trim(),
    resultText: String(item?.resultText ?? '').trim(),
    client: String(item?.client ?? '').trim(),
    date: String(item?.date ?? '').trim(),
    location: String(item?.location ?? '').trim(),
    image: String(item?.image ?? '').trim(),
    link: `/projects/${slug}`,
  };
}

export function normalizeProjectsGalleryContent(content = {}) {
  const usedSlugs = new Set();
  const items = Array.isArray(content.items) && content.items.length
    ? content.items.map((item) => normalizeProjectItem(item, usedSlugs))
    : [];

  return {
    tagline: String(content.tagline ?? DEFAULT_PROJECTS_GALLERY.tagline).trim(),
    titleLine1: String(content.titleLine1 ?? DEFAULT_PROJECTS_GALLERY.titleLine1).trim(),
    titleLine2: String(content.titleLine2 ?? DEFAULT_PROJECTS_GALLERY.titleLine2).trim(),
    buttonText: String(content.buttonText ?? DEFAULT_PROJECTS_GALLERY.buttonText).trim(),
    buttonLink: String(content.buttonLink ?? DEFAULT_PROJECTS_GALLERY.buttonLink).trim(),
    items,
  };
}

async function persistProjectImages(items) {
  return Promise.all(items.map(async (item, index) => {
    const next = { ...item };
    if (item.imageData) {
      const key = item.id ? `projects-gallery-${item.id}` : `projects-gallery-${index}`;
      next.image = saveCmsImage(key, item.imageData);
    }
    delete next.imageData;
    return normalizeProjectItem(next);
  }));
}

export async function getProjectsGalleryContent() {
  const widget = await getWidget('projects', 'gallery');
  if (widget?.content && Array.isArray(widget.content.items) && widget.content.items.length) {
    return normalizeProjectsGalleryContent(widget.content);
  }

  const homeWidget = await getWidget('home', 'gallery');
  if (homeWidget?.content && Array.isArray(homeWidget.content.items) && homeWidget.content.items.length) {
    return normalizeProjectsGalleryContent(convertHomeGalleryToProjectsContent(homeWidget.content));
  }

  return normalizeProjectsGalleryContent(DEFAULT_PROJECTS_GALLERY);
}

export async function updateProjectsGalleryContent(content) {
  const incomingItems = Array.isArray(content?.items) ? content.items : [];
  if (!incomingItems.length) {
    throw new Error('At least one project is required');
  }

  const itemsWithImages = await persistProjectImages(incomingItems);
  const normalized = normalizeProjectsGalleryContent({
    ...content,
    items: itemsWithImages,
  });

  if (!normalized.titleLine1) {
    throw new Error('Projects title is required');
  }

  for (const item of normalized.items) {
    if (!item.title) {
      throw new Error('Each project requires a title');
    }
    if (!item.image) {
      throw new Error('Each project requires an image');
    }
  }

  return upsertWidget('projects', 'gallery', normalized);
}

export async function getProjectById(projectId) {
  const gallery = await getProjectsGalleryContent();
  return gallery.items.find((item) => item.id === projectId) || null;
}

export async function getProjectBySlug(slug) {
  const normalizedSlug = slugify(slug);
  if (!normalizedSlug) {
    return null;
  }

  const gallery = await getProjectsGalleryContent();
  return gallery.items.find((item) => item.slug === normalizedSlug) || null;
}

export function normalizeProjectsBannerContent(content = {}) {
  return {
    title: String(content.title ?? DEFAULT_PROJECTS_BANNER.title).trim(),
    backgroundImage: String(content.backgroundImage ?? DEFAULT_PROJECTS_BANNER.backgroundImage).trim(),
  };
}

export async function getProjectsBannerContent() {
  const widget = await getWidget('projects', 'banner');
  return normalizeProjectsBannerContent(widget?.content || DEFAULT_PROJECTS_BANNER);
}

export async function updateProjectsBannerContent(content) {
  const normalized = normalizeProjectsBannerContent(content);

  if (!normalized.title) {
    throw new Error('Banner title is required');
  }

  const widget = await upsertWidget('projects', 'banner', normalized);
  return normalizeProjectsBannerContent(widget.content);
}

export function normalizeProjectDetailsBannerContent(content = {}) {
  return {
    title: String(content.title ?? DEFAULT_PROJECT_DETAILS_BANNER.title).trim(),
    backgroundImage: String(content.backgroundImage ?? DEFAULT_PROJECT_DETAILS_BANNER.backgroundImage).trim(),
  };
}

export async function getProjectDetailsBannerContent() {
  const widget = await getWidget('project-details', 'banner');
  return normalizeProjectDetailsBannerContent(widget?.content || DEFAULT_PROJECT_DETAILS_BANNER);
}

export async function updateProjectDetailsBannerContent(content) {
  const normalized = normalizeProjectDetailsBannerContent(content);

  if (!normalized.title) {
    throw new Error('Banner title is required');
  }

  const widget = await upsertWidget('project-details', 'banner', normalized);
  return normalizeProjectDetailsBannerContent(widget.content);
}

const DEFAULT_SERVICES_BANNER = {
  title: 'Our Services',
  backgroundImage: '',
};

const DEFAULT_SERVICE_DETAILS_BANNER = {
  title: 'Service Details',
  backgroundImage: '',
};

const DEFAULT_SERVICE_CATEGORY_DETAILS = {
  tagline: '',
  title: '',
  text: '',
};

const SERVICE_CATEGORY_PAGES = new Set(['residential', 'commercial']);

function assertServiceCategoryPage(page) {
  const key = String(page || '').trim().toLowerCase();
  if (!SERVICE_CATEGORY_PAGES.has(key)) {
    throw new Error('Invalid service category page');
  }
  return key;
}

export function normalizeServicesBannerContent(content = {}) {
  return {
    title: String(content.title ?? DEFAULT_SERVICES_BANNER.title).trim(),
    backgroundImage: String(content.backgroundImage ?? DEFAULT_SERVICES_BANNER.backgroundImage).trim(),
  };
}

export async function getServicesBannerContent() {
  const widget = await getWidget('services', 'banner');
  return normalizeServicesBannerContent(widget?.content || DEFAULT_SERVICES_BANNER);
}

export async function updateServicesBannerContent(content) {
  const normalized = normalizeServicesBannerContent(content);

  if (!normalized.title) {
    throw new Error('Banner title is required');
  }

  const widget = await upsertWidget('services', 'banner', normalized);
  return normalizeServicesBannerContent(widget.content);
}

export async function getServiceCategoryBannerContent(page) {
  const pageKey = assertServiceCategoryPage(page);
  const widget = await getWidget(pageKey, 'banner');
  const fallbackTitle = pageKey === 'commercial' ? 'Commercial Services' : 'Residential Services';
  return normalizeServicesBannerContent(widget?.content || { title: fallbackTitle, backgroundImage: '' });
}

export async function updateServiceCategoryBannerContent(page, content) {
  const pageKey = assertServiceCategoryPage(page);
  const normalized = normalizeServicesBannerContent(content);

  if (!normalized.title) {
    throw new Error('Banner title is required');
  }

  const widget = await upsertWidget(pageKey, 'banner', normalized);
  return normalizeServicesBannerContent(widget.content);
}

export function normalizeServiceCategoryDetailsContent(content = {}) {
  return {
    tagline: String(content.tagline ?? DEFAULT_SERVICE_CATEGORY_DETAILS.tagline).trim(),
    title: String(content.title ?? DEFAULT_SERVICE_CATEGORY_DETAILS.title).trim(),
    text: String(content.text ?? DEFAULT_SERVICE_CATEGORY_DETAILS.text).trim(),
  };
}

export async function getServiceCategoryDetailsContent(page) {
  const pageKey = assertServiceCategoryPage(page);
  const widget = await getWidget(pageKey, 'details');
  return normalizeServiceCategoryDetailsContent(widget?.content || DEFAULT_SERVICE_CATEGORY_DETAILS);
}

export async function updateServiceCategoryDetailsContent(page, content) {
  const pageKey = assertServiceCategoryPage(page);
  const normalized = normalizeServiceCategoryDetailsContent(content);

  if (!normalized.title) {
    throw new Error('Section title is required');
  }

  const widget = await upsertWidget(pageKey, 'details', normalized);
  return normalizeServiceCategoryDetailsContent(widget.content);
}

export function normalizeServicesHomepageSectionContent(content = {}) {
  return {
    tagline: String(content.tagline ?? DEFAULT_SERVICES_HOMEPAGE_SECTION.tagline).trim(),
    titleLine1: String(content.titleLine1 ?? DEFAULT_SERVICES_HOMEPAGE_SECTION.titleLine1).trim(),
    titleLine2: String(content.titleLine2 ?? DEFAULT_SERVICES_HOMEPAGE_SECTION.titleLine2).trim(),
  };
}

export async function getServicesHomepageSectionContent() {
  const widget = await getWidget('services', 'homepage-section');
  if (widget?.content) {
    return normalizeServicesHomepageSectionContent(widget.content);
  }

  // One-time fallback from legacy homepage featured-services titles
  const featured = await getWidget('home', 'featured-services');
  if (featured?.content) {
    const legacy = normalizeServicesHomepageSectionContent({
      tagline: featured.content.tagline === 'Our Services' ? 'What We Do' : featured.content.tagline,
      titleLine1: featured.content.titleLine1,
      titleLine2: featured.content.titleLine2,
    });
    return legacy;
  }

  return normalizeServicesHomepageSectionContent(DEFAULT_SERVICES_HOMEPAGE_SECTION);
}

export async function updateServicesHomepageSectionContent(content) {
  const normalized = normalizeServicesHomepageSectionContent(content);

  if (!normalized.titleLine1) {
    throw new Error('Section title is required');
  }

  const widget = await upsertWidget('services', 'homepage-section', normalized);
  return normalizeServicesHomepageSectionContent(widget.content);
}

const DEFAULT_SERVICE_CATEGORY_GALLERY = {
  tagline: '',
  titleLine1: '',
  titleLine2: '',
  buttonText: '',
  buttonLink: '',
  items: [],
};

function normalizeServiceCategoryGalleryItem(item = {}) {
  const rawServiceId = item?.serviceId ?? item?.service_id ?? '';
  const parsedId = Number(rawServiceId);
  const serviceId =
    Number.isInteger(parsedId) && parsedId > 0 ? String(parsedId) : '';

  return {
    serviceId,
    serviceName: String(item?.serviceName ?? '').trim(),
    subTitle: String(item?.subTitle ?? '').trim(),
    title: String(item?.title ?? '').trim(),
    text: String(item?.text ?? '').trim(),
    image: String(item?.image ?? '').trim(),
  };
}

export function normalizeServiceCategoryGalleryContent(content = {}) {
  const items = Array.isArray(content.items)
    ? content.items.map((item) => normalizeServiceCategoryGalleryItem(item)).filter((item) => item.image)
    : [];

  return {
    tagline: String(content.tagline ?? DEFAULT_SERVICE_CATEGORY_GALLERY.tagline).trim(),
    titleLine1: String(content.titleLine1 ?? DEFAULT_SERVICE_CATEGORY_GALLERY.titleLine1).trim(),
    titleLine2: String(content.titleLine2 ?? DEFAULT_SERVICE_CATEGORY_GALLERY.titleLine2).trim(),
    buttonText: String(content.buttonText ?? DEFAULT_SERVICE_CATEGORY_GALLERY.buttonText).trim(),
    buttonLink: String(content.buttonLink ?? DEFAULT_SERVICE_CATEGORY_GALLERY.buttonLink).trim(),
    items,
  };
}

async function resolveGalleryServicesForPage(pageKey, serviceIds) {
  const uniqueIds = [...new Set(serviceIds.map((id) => Number(id)).filter((id) => Number.isInteger(id) && id > 0))];
  if (!uniqueIds.length) return new Map();

  const categoryFilter =
    pageKey === 'commercial'
      ? `AND lower(c.name) LIKE '%commercial%'`
      : `AND lower(c.name) NOT LIKE '%commercial%'`;

  const result = await pool.query(
    `SELECT s.id, s.name
     FROM services s
     JOIN service_categories c ON c.id = s.category_id
     WHERE s.id = ANY($1::int[])
     ${categoryFilter}`,
    [uniqueIds]
  );

  return new Map(result.rows.map((row) => [String(row.id), row.name]));
}

export async function getServiceCategoryGalleryContent(page) {
  const pageKey = assertServiceCategoryPage(page);
  const widget = await getWidget(pageKey, 'gallery');
  return normalizeServiceCategoryGalleryContent(widget?.content || DEFAULT_SERVICE_CATEGORY_GALLERY);
}

export async function updateServiceCategoryGalleryContent(page, content) {
  const pageKey = assertServiceCategoryPage(page);
  const normalized = normalizeServiceCategoryGalleryContent(content);

  if (normalized.items.length && !normalized.titleLine1) {
    throw new Error('Section title is required when gallery items are present');
  }

  for (const [index, item] of normalized.items.entries()) {
    if (!item.image) {
      throw new Error(`Gallery item ${index + 1} needs an image`);
    }
    if (!item.serviceId) {
      throw new Error(`Gallery item ${index + 1} needs a linked ${pageKey} service`);
    }
  }

  const serviceMap = await resolveGalleryServicesForPage(
    pageKey,
    normalized.items.map((item) => item.serviceId)
  );

  const items = normalized.items.map((item, index) => {
    const serviceName = serviceMap.get(item.serviceId);
    if (!serviceName) {
      throw new Error(
        `Gallery item ${index + 1} must be linked to a valid ${pageKey} service`
      );
    }
    return {
      ...item,
      serviceId: item.serviceId,
      serviceName,
    };
  });

  const widget = await upsertWidget(pageKey, 'gallery', { ...normalized, items });
  return normalizeServiceCategoryGalleryContent(widget.content);
}

export function normalizeServiceDetailsBannerContent(content = {}) {
  return {
    title: String(content.title ?? DEFAULT_SERVICE_DETAILS_BANNER.title).trim(),
    backgroundImage: String(content.backgroundImage ?? DEFAULT_SERVICE_DETAILS_BANNER.backgroundImage).trim(),
  };
}

export async function getServiceDetailsBannerContent() {
  const widget = await getWidget('service-details', 'banner');
  return normalizeServiceDetailsBannerContent(widget?.content || DEFAULT_SERVICE_DETAILS_BANNER);
}

export async function updateServiceDetailsBannerContent(content) {
  const normalized = normalizeServiceDetailsBannerContent(content);

  if (!normalized.title) {
    throw new Error('Banner title is required');
  }

  const widget = await upsertWidget('service-details', 'banner', normalized);
  return normalizeServiceDetailsBannerContent(widget.content);
}

const DEFAULT_CONTACT_BANNER = {
  title: 'Contact',
  backgroundImage: '',
};

const DEFAULT_CONTACT_PAGE_SETTINGS = {
  formTitle: 'Get A Free Quote',
  recipientEmail: '',
  smtpUser: '',
  smtpPass: '',
  smtpFromEmail: '',
  smtpFromName: '',
  phone: '',
  displayEmail: '',
  address: '',
  latitude: 43.6532,
  longitude: -79.3832,
  mapZoom: 14,
  specificationItems: [
    'Licensed & Insured electricians',
    'Residential & Commercial Expertise',
    'Transparent Qoute with no hidden fee',
  ],
};

function parseCoordinate(value, fallback) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function parseMapZoom(value, fallback) {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(20, Math.max(1, parsed));
}

export function normalizeContactPageSettingsContent(content = {}) {
  const specificationItems = Array.isArray(content.specificationItems)
    ? content.specificationItems.map((item) => String(item || '').trim()).filter(Boolean)
    : DEFAULT_CONTACT_PAGE_SETTINGS.specificationItems;

  return {
    formTitle: String(content.formTitle ?? DEFAULT_CONTACT_PAGE_SETTINGS.formTitle).trim(),
    recipientEmail: String(content.recipientEmail ?? DEFAULT_CONTACT_PAGE_SETTINGS.recipientEmail).trim(),
    smtpUser: String(content.smtpUser ?? DEFAULT_CONTACT_PAGE_SETTINGS.smtpUser).trim(),
    smtpPass: String(content.smtpPass ?? DEFAULT_CONTACT_PAGE_SETTINGS.smtpPass),
    smtpFromEmail: String(content.smtpFromEmail ?? DEFAULT_CONTACT_PAGE_SETTINGS.smtpFromEmail).trim(),
    smtpFromName: String(content.smtpFromName ?? DEFAULT_CONTACT_PAGE_SETTINGS.smtpFromName).trim(),
    phone: String(content.phone ?? DEFAULT_CONTACT_PAGE_SETTINGS.phone).trim(),
    displayEmail: String(content.displayEmail ?? DEFAULT_CONTACT_PAGE_SETTINGS.displayEmail).trim(),
    address: String(content.address ?? DEFAULT_CONTACT_PAGE_SETTINGS.address).trim(),
    latitude: parseCoordinate(content.latitude, DEFAULT_CONTACT_PAGE_SETTINGS.latitude),
    longitude: parseCoordinate(content.longitude, DEFAULT_CONTACT_PAGE_SETTINGS.longitude),
    mapZoom: parseMapZoom(content.mapZoom, DEFAULT_CONTACT_PAGE_SETTINGS.mapZoom),
    specificationItems,
  };
}

/** Admin-facing payload: never echo the raw password; expose a configured flag instead. */
export function toAdminContactPageSettings(content = {}) {
  const normalized = normalizeContactPageSettingsContent(content);
  const { smtpPass, ...rest } = normalized;
  return {
    ...rest,
    smtpPass: '',
    smtpPassConfigured: Boolean(String(smtpPass || '').trim()),
  };
}

export function toPublicContactPageSettings(content = {}) {
  const normalized = normalizeContactPageSettingsContent(content);
  return {
    formTitle: normalized.formTitle,
    phone: normalized.phone,
    displayEmail: normalized.displayEmail,
    address: normalized.address,
    latitude: normalized.latitude,
    longitude: normalized.longitude,
    mapZoom: normalized.mapZoom,
    specificationItems: normalized.specificationItems,
  };
}

export async function getContactPageSettingsContent() {
  const widget = await getWidget('contact', 'settings');
  const normalized = normalizeContactPageSettingsContent(widget?.content || DEFAULT_CONTACT_PAGE_SETTINGS);

  // Prefer CMS recipient; fall back to SMTP From / User configured in the same settings
  if (!normalized.recipientEmail) {
    const smtpEmail = normalized.smtpFromEmail || normalized.smtpUser;
    if (smtpEmail && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(smtpEmail)) {
      normalized.recipientEmail = smtpEmail;
    }
  }

  return normalized;
}

export async function getAdminContactPageSettingsContent() {
  const content = await getContactPageSettingsContent();
  return toAdminContactPageSettings(content);
}

export async function getPublicContactPageSettingsContent() {
  const [settings, topbar] = await Promise.all([
    getContactPageSettingsContent(),
    getTopbarContent(),
  ]);
  return toPublicContactPageSettings({
    ...settings,
    phone: topbar.phone,
    displayEmail: topbar.email,
    address: topbar.address,
  });
}

export async function updateContactPageSettingsContent(content = {}) {
  const current = await getContactPageSettingsContent();
  const syncContactDetails = Boolean(content.syncContactDetails);

  const nextSmtpPass =
    content.smtpPass !== undefined && String(content.smtpPass).trim() !== ''
      ? String(content.smtpPass)
      : current.smtpPass;

  const next = {
    formTitle: content.formTitle !== undefined ? content.formTitle : current.formTitle,
    recipientEmail: content.recipientEmail !== undefined ? content.recipientEmail : current.recipientEmail,
    smtpUser: content.smtpUser !== undefined ? content.smtpUser : current.smtpUser,
    smtpPass: nextSmtpPass,
    smtpFromEmail: content.smtpFromEmail !== undefined ? content.smtpFromEmail : current.smtpFromEmail,
    smtpFromName: content.smtpFromName !== undefined ? content.smtpFromName : current.smtpFromName,
    specificationItems:
      content.specificationItems !== undefined ? content.specificationItems : current.specificationItems,
    phone: syncContactDetails && content.phone !== undefined ? content.phone : current.phone,
    displayEmail:
      syncContactDetails && content.displayEmail !== undefined
        ? content.displayEmail
        : current.displayEmail,
    address: syncContactDetails && content.address !== undefined ? content.address : current.address,
    latitude: content.latitude !== undefined ? content.latitude : current.latitude,
    longitude: content.longitude !== undefined ? content.longitude : current.longitude,
    mapZoom: content.mapZoom !== undefined ? content.mapZoom : current.mapZoom,
  };

  const normalized = normalizeContactPageSettingsContent(next);

  if (!normalized.formTitle) {
    throw new Error('Form title is required');
  }
  if (!normalized.recipientEmail) {
    throw new Error('Recipient email is required');
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized.recipientEmail)) {
    throw new Error('Recipient email is invalid');
  }
  if (normalized.smtpFromEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized.smtpFromEmail)) {
    throw new Error('SMTP From Email is invalid');
  }
  if (normalized.smtpUser && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized.smtpUser)) {
    throw new Error('SMTP User must be a valid email address for Gmail SMTP');
  }
  if (Boolean(normalized.smtpUser) !== Boolean(String(normalized.smtpPass || '').trim())) {
    throw new Error('SMTP User and SMTP Password must both be set');
  }
  if (normalized.displayEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized.displayEmail)) {
    throw new Error('Display email is invalid');
  }
  if (normalized.latitude < -90 || normalized.latitude > 90) {
    throw new Error('Latitude must be between -90 and 90');
  }
  if (normalized.longitude < -180 || normalized.longitude > 180) {
    throw new Error('Longitude must be between -180 and 180');
  }

  const widget = await upsertWidget('contact', 'settings', normalized);
  return toAdminContactPageSettings(normalizeContactPageSettingsContent(widget.content));
}

export function normalizeContactBannerContent(content = {}) {
  return {
    title: String(content.title ?? DEFAULT_CONTACT_BANNER.title).trim(),
    backgroundImage: String(content.backgroundImage ?? DEFAULT_CONTACT_BANNER.backgroundImage).trim(),
  };
}

export async function getContactBannerContent() {
  const widget = await getWidget('contact', 'banner');
  return normalizeContactBannerContent(widget?.content || DEFAULT_CONTACT_BANNER);
}

export async function updateContactBannerContent(content) {
  const normalized = normalizeContactBannerContent(content);

  if (!normalized.title) {
    throw new Error('Banner title is required');
  }

  const widget = await upsertWidget('contact', 'banner', normalized);
  return normalizeContactBannerContent(widget.content);
}

export async function saveWidgetImage(dataUrl, key) {
  return saveCmsImage(key, dataUrl);
}

const DEFAULT_FAQ_BANNER = {
  title: 'FAQ',
  backgroundImage: '',
};

const DEFAULT_FAQ_SETTINGS = {
  tagline: 'FAQ',
  title: 'Frequently Asked Questions',
  introText: '',
};

export function normalizeFaqBannerContent(content = {}) {
  return {
    title: String(content.title ?? DEFAULT_FAQ_BANNER.title).trim(),
    backgroundImage: String(content.backgroundImage ?? DEFAULT_FAQ_BANNER.backgroundImage).trim(),
  };
}

export async function getFaqBannerContent() {
  const widget = await getWidget('faq', 'banner');
  return normalizeFaqBannerContent(widget?.content || DEFAULT_FAQ_BANNER);
}

export async function updateFaqBannerContent(content) {
  const normalized = normalizeFaqBannerContent(content);

  if (!normalized.title) {
    throw new Error('Banner title is required');
  }

  const widget = await upsertWidget('faq', 'banner', normalized);
  return normalizeFaqBannerContent(widget.content);
}

const DEFAULT_SERVICE_AREAS_BANNER = {
  title: 'Service Areas',
  backgroundImage: '',
};

export function normalizeServiceAreasBannerContent(content = {}) {
  return {
    title: String(content.title ?? DEFAULT_SERVICE_AREAS_BANNER.title).trim(),
    backgroundImage: String(content.backgroundImage ?? DEFAULT_SERVICE_AREAS_BANNER.backgroundImage).trim(),
  };
}

export async function getServiceAreasBannerContent() {
  const widget = await getWidget('service-areas', 'banner');
  return normalizeServiceAreasBannerContent(widget?.content || DEFAULT_SERVICE_AREAS_BANNER);
}

export async function updateServiceAreasBannerContent(content) {
  const normalized = normalizeServiceAreasBannerContent(content);

  if (!normalized.title) {
    throw new Error('Banner title is required');
  }

  const widget = await upsertWidget('service-areas', 'banner', normalized);
  return normalizeServiceAreasBannerContent(widget.content);
}

export function normalizeFaqSettingsContent(content = {}) {
  return {
    tagline: String(content.tagline ?? DEFAULT_FAQ_SETTINGS.tagline).trim(),
    title: String(content.title ?? DEFAULT_FAQ_SETTINGS.title).trim(),
    introText: String(content.introText ?? DEFAULT_FAQ_SETTINGS.introText).trim(),
  };
}

export async function getFaqSettingsContent() {
  const widget = await getWidget('faq', 'settings');
  return normalizeFaqSettingsContent(widget?.content || DEFAULT_FAQ_SETTINGS);
}

export async function updateFaqSettingsContent(content) {
  const normalized = normalizeFaqSettingsContent(content);

  if (!normalized.title) {
    throw new Error('Section title is required');
  }

  const widget = await upsertWidget('faq', 'settings', normalized);
  return normalizeFaqSettingsContent(widget.content);
}

const DEFAULT_TERMS_BANNER = {
  title: 'Terms and Conditions',
  backgroundImage: '',
};

const DEFAULT_PRIVACY_BANNER = {
  title: 'Privacy Policy',
  backgroundImage: '',
};

const DEFAULT_TERMS_CONTENT = {
  title: 'Terms and Conditions',
  lastUpdated: '',
  introText: '',
  sections: [],
};

const DEFAULT_PRIVACY_CONTENT = {
  title: 'Privacy Policy',
  lastUpdated: '',
  introText: '',
  sections: [],
};

function normalizeLegalSection(section = {}, index = 0) {
  return {
    id: String(section.id ?? `section-${index + 1}`).trim(),
    heading: String(section.heading ?? '').trim(),
    body: String(section.body ?? '').trim(),
  };
}

export function normalizeLegalPageContent(content = {}, defaults = DEFAULT_TERMS_CONTENT) {
  const sections = Array.isArray(content.sections)
    ? content.sections.map((section, index) => normalizeLegalSection(section, index)).filter((section) => section.heading || section.body)
    : [];

  return {
    title: String(content.title ?? defaults.title).trim(),
    lastUpdated: String(content.lastUpdated ?? defaults.lastUpdated).trim(),
    introText: String(content.introText ?? defaults.introText).trim(),
    sections,
  };
}

export function normalizeLegalBannerContent(content = {}, defaults = DEFAULT_TERMS_BANNER) {
  return {
    title: String(content.title ?? defaults.title).trim(),
    backgroundImage: String(content.backgroundImage ?? defaults.backgroundImage).trim(),
  };
}

export async function getTermsBannerContent() {
  const widget = await getWidget('terms', 'banner');
  return normalizeLegalBannerContent(widget?.content || DEFAULT_TERMS_BANNER, DEFAULT_TERMS_BANNER);
}

export async function updateTermsBannerContent(content) {
  const normalized = normalizeLegalBannerContent(content, DEFAULT_TERMS_BANNER);
  if (!normalized.title) {
    throw new Error('Banner title is required');
  }
  const widget = await upsertWidget('terms', 'banner', normalized);
  return normalizeLegalBannerContent(widget.content, DEFAULT_TERMS_BANNER);
}

export async function getTermsPageContent() {
  const widget = await getWidget('terms', 'content');
  return normalizeLegalPageContent(widget?.content || DEFAULT_TERMS_CONTENT, DEFAULT_TERMS_CONTENT);
}

export async function updateTermsPageContent(content) {
  const normalized = normalizeLegalPageContent(content, DEFAULT_TERMS_CONTENT);
  if (!normalized.title) {
    throw new Error('Page title is required');
  }
  if (!normalized.sections.length) {
    throw new Error('At least one content section is required');
  }
  const widget = await upsertWidget('terms', 'content', normalized);
  return normalizeLegalPageContent(widget.content, DEFAULT_TERMS_CONTENT);
}

export async function getPrivacyBannerContent() {
  const widget = await getWidget('privacy', 'banner');
  return normalizeLegalBannerContent(widget?.content || DEFAULT_PRIVACY_BANNER, DEFAULT_PRIVACY_BANNER);
}

export async function updatePrivacyBannerContent(content) {
  const normalized = normalizeLegalBannerContent(content, DEFAULT_PRIVACY_BANNER);
  if (!normalized.title) {
    throw new Error('Banner title is required');
  }
  const widget = await upsertWidget('privacy', 'banner', normalized);
  return normalizeLegalBannerContent(widget.content, DEFAULT_PRIVACY_BANNER);
}

export async function getPrivacyPageContent() {
  const widget = await getWidget('privacy', 'content');
  return normalizeLegalPageContent(widget?.content || DEFAULT_PRIVACY_CONTENT, DEFAULT_PRIVACY_CONTENT);
}

export async function updatePrivacyPageContent(content) {
  const normalized = normalizeLegalPageContent(content, DEFAULT_PRIVACY_CONTENT);
  if (!normalized.title) {
    throw new Error('Page title is required');
  }
  if (!normalized.sections.length) {
    throw new Error('At least one content section is required');
  }
  const widget = await upsertWidget('privacy', 'content', normalized);
  return normalizeLegalPageContent(widget.content, DEFAULT_PRIVACY_CONTENT);
}
