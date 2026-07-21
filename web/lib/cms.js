const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export function resolveCmsAssetUrl(url) {
  if (!url) return '';
  if (url.startsWith('http') || url.startsWith('data:')) return url;
  if (url.startsWith('/uploads')) return `${API_URL}${url}`;
  return url;
}

export function hasGalleryImage(image) {
  const value = String(image || '').trim();
  if (!value) return false;
  if (/^assets\/images\/project\/project-1-\d+\.jpg$/i.test(value)) return false;
  return true;
}

export const DEFAULT_TOPBAR = {
  email: '',
  address: '',
  social: {
    facebook: '',
    twitter: '',
    linkedin: '',
    instagram: '',
  },
};

export async function fetchTopbarContent() {
  try {
    const res = await fetch(`${API_URL}/api/web-content/home/topbar`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) {
      return DEFAULT_TOPBAR;
    }
    const data = await res.json();
    return {
      ...DEFAULT_TOPBAR,
      ...data.content,
      social: {
        ...DEFAULT_TOPBAR.social,
        ...(data.content?.social || {}),
      },
    };
  } catch {
    return DEFAULT_TOPBAR;
  }
}

export const DEFAULT_SLIDER_SLIDES = [];

export const DEFAULT_HOME_SERVICE_FEATURES = [];

export const DEFAULT_HOME_ABOUT = {
  tagline: '',
  title: '',
  text1: '',
  text2: '',
  buttonText: '',
  buttonLink: '/about',
  image1: '',
  image2: '',
};

export const DEFAULT_HOME_FEATURED_SERVICES = {
  tagline: '',
  titleLine1: '',
  titleLine2: '',
  services: [],
};

export const DEFAULT_HOME_GALLERY = {
  tagline: '',
  titleLine1: '',
  titleLine2: '',
  buttonText: '',
  buttonLink: '/projects',
  items: [],
};

export const DEFAULT_ABOUT_BANNER = {
  title: '',
  backgroundImage: '',
};

export const DEFAULT_TEAM_BANNER = {
  title: '',
  backgroundImage: '',
};

export const DEFAULT_TEAM_DETAILS_BANNER = {
  title: '',
  backgroundImage: '',
};

export const DEFAULT_PROJECTS_BANNER = {
  title: '',
  backgroundImage: '',
};

export const DEFAULT_PROJECT_DETAILS_BANNER = {
  title: '',
  backgroundImage: '',
};

export const DEFAULT_PROJECTS_GALLERY = {
  tagline: '',
  titleLine1: '',
  titleLine2: '',
  buttonText: '',
  buttonLink: '/projects',
  items: [],
};

export const DEFAULT_SERVICES_BANNER = {
  title: '',
  backgroundImage: '',
};

export const DEFAULT_SERVICE_DETAILS_BANNER = {
  title: '',
  backgroundImage: '',
};

export const DEFAULT_CONTACT_BANNER = {
  title: '',
  backgroundImage: '',
};

export const DEFAULT_CONTACT_PAGE_SETTINGS = {
  formTitle: '',
  phone: '',
  displayEmail: '',
  address: '',
  latitude: 43.6532,
  longitude: -79.3832,
  mapZoom: 14,
};

export const DEFAULT_FAQ_BANNER = {
  title: 'FAQ',
  backgroundImage: '',
};

export const DEFAULT_FAQ_SETTINGS = {
  tagline: 'FAQ',
  title: 'Frequently Asked Questions',
  introText: '',
};

export const DEFAULT_LEGAL_BANNERS = {
  terms: {
    title: 'Terms and Conditions',
    backgroundImage: '',
  },
  privacy: {
    title: 'Privacy Policy',
    backgroundImage: '',
  },
};

export const DEFAULT_LEGAL_CONTENT = {
  terms: {
    title: 'Terms and Conditions',
    lastUpdated: '',
    introText: '',
    sections: [],
  },
  privacy: {
    title: 'Privacy Policy',
    lastUpdated: '',
    introText: '',
    sections: [],
  },
};

export const DEFAULT_ABOUT_CONTACT = {
  tagline: '',
  title: '',
  text1: '',
  text2: '',
  primaryButtonText: '',
  primaryButtonLink: '/about',
  secondaryButtonText: '',
  secondaryButtonLink: '/contact',
  backgroundImage: '',
};

export async function fetchSliderContent() {
  try {
    const res = await fetch(`${API_URL}/api/web-content/home/slider`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) {
      return { slides: [] };
    }
    const data = await res.json();
    const slides = Array.isArray(data.content?.slides) ? data.content.slides : [];
    return { slides };
  } catch {
    return { slides: [] };
  }
}

export async function fetchHomeServicesContent() {
  try {
    const res = await fetch(`${API_URL}/api/web-content/home/services`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) {
      return { items: [] };
    }
    const data = await res.json();
    const items = Array.isArray(data.content?.items) ? data.content.items : [];
    return { items };
  } catch {
    return { items: [] };
  }
}
