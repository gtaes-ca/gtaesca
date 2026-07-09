const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export function resolveCmsAssetUrl(url) {
  if (!url) return '';
  if (url.startsWith('http') || url.startsWith('data:')) return url;
  if (url.startsWith('/uploads')) return `${API_URL}${url}`;
  return url;
}

export const DEFAULT_TOPBAR = {
  email: 'example@gamil.com',
  address: '12 Green Road, 05 New York',
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

export const DEFAULT_SLIDER_SLIDES = [
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

export const DEFAULT_HOME_SERVICE_FEATURES = [
  {
    title: 'Fair & Transparent Pricing',
    text: 'Honest upfront quotes with no hidden fees on residential and commercial electrical work.',
    link: '/services',
    icon: 'icon-affordable-price',
  },
  {
    title: 'Licensed & Insured',
    text: 'ESA-certified electricians delivering safe, code-compliant work backed by our satisfaction guarantee.',
    link: '/about',
    icon: 'icon-setting',
  },
  {
    title: '24/7 Emergency Service',
    text: 'Available around the clock for urgent electrical repairs across the Greater Toronto Area.',
    link: '/contact',
    icon: 'icon-services',
  },
];

export const DEFAULT_HOME_ABOUT = {
  tagline: 'Get To Know Us',
  title: 'Trusted Electrical Experts Across the Greater Toronto Area',
  text1: 'GTA Electric Services provides reliable residential and commercial electrical solutions, from troubleshooting and repairs to panel upgrades, lighting, EV chargers, and full-home rewiring.',
  text2: 'Our licensed ESA-certified electricians deliver safe, code-compliant work with honest pricing and dependable service you can count on.',
  buttonText: 'About Us More',
  buttonLink: '/about',
  image1: 'assets/images/resources/about-one-img-1.jpg',
  image2: 'assets/images/resources/about-one-img-2.jpg',
};

export const DEFAULT_HOME_FEATURED_SERVICES = {
  tagline: 'Our Services',
  titleLine1: 'Featured Electrical Services',
  titleLine2: 'for Your Home & Business',
  services: [],
};

export const DEFAULT_HOME_GALLERY = {
  tagline: 'Our Gallery',
  titleLine1: 'Your Brightest',
  titleLine2: 'Choice in Repairs',
  buttonText: 'All Gallery',
  buttonLink: '/projects',
  items: [],
};

export const DEFAULT_ABOUT_BANNER = {
  title: 'About Us',
  backgroundImage: '',
};

export const DEFAULT_TEAM_BANNER = {
  title: 'Our Team',
  backgroundImage: '',
};

export const DEFAULT_TEAM_DETAILS_BANNER = {
  title: 'Member Details',
  backgroundImage: '',
};

export const DEFAULT_PROJECTS_BANNER = {
  title: 'Projects',
  backgroundImage: '',
};

export const DEFAULT_PROJECT_DETAILS_BANNER = {
  title: 'Project Details',
  backgroundImage: '',
};

export const DEFAULT_PROJECTS_GALLERY = {
  tagline: 'Our Gallery',
  titleLine1: 'Your Brightest',
  titleLine2: 'Choice in Repairs',
  buttonText: '',
  buttonLink: '/projects',
  items: [],
};

export const DEFAULT_SERVICES_BANNER = {
  title: 'Our Services',
  backgroundImage: '',
};

export const DEFAULT_SERVICE_DETAILS_BANNER = {
  title: 'Service Details',
  backgroundImage: '',
};

export const DEFAULT_CONTACT_BANNER = {
  title: 'Contact',
  backgroundImage: '',
};

export const DEFAULT_CONTACT_PAGE_SETTINGS = {
  formTitle: 'Get A Free Quote',
  phone: '+55 827 057 5405',
  displayEmail: 'example@gamil.com',
  address: '12 Green Road, 05 New York',
  latitude: 43.6532,
  longitude: -79.3832,
  mapZoom: 14,
};

export const DEFAULT_ABOUT_CONTACT = {
  tagline: 'contact with us',
  title: 'Choose Our Electric Repair Service because its 24/7',
  text1: 'The wise man therefore always holds in these matters to this principle of selection. He rejects pleasures to secure other greater pleasures, or else he endures pains to avoid worse pains to the selection point.',
  text2: 'But in certain circumstances and owing to the claims of duty or the obligations of business we often need reliable electrical support around the clock.',
  primaryButtonText: 'Discover More',
  primaryButtonLink: '/about',
  secondaryButtonText: 'Free estimate',
  secondaryButtonLink: '/contact',
  backgroundImage: 'assets/images/backgrounds/video-one-bg.jpg',
  videoId: 'vfhzo499OeA',
};

export async function fetchSliderContent() {
  try {
    const res = await fetch(`${API_URL}/api/web-content/home/slider`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) {
      return { slides: DEFAULT_SLIDER_SLIDES };
    }
    const data = await res.json();
    const slides = Array.isArray(data.content?.slides) && data.content.slides.length
      ? data.content.slides
      : DEFAULT_SLIDER_SLIDES;
    return { slides };
  } catch {
    return { slides: DEFAULT_SLIDER_SLIDES };
  }
}

export async function fetchHomeServicesContent() {
  try {
    const res = await fetch(`${API_URL}/api/web-content/home/services`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) {
      return { items: DEFAULT_HOME_SERVICE_FEATURES };
    }
    const data = await res.json();
    const items = Array.isArray(data.content?.items) && data.content.items.length
      ? data.content.items
      : DEFAULT_HOME_SERVICE_FEATURES;
    return { items };
  } catch {
    return { items: DEFAULT_HOME_SERVICE_FEATURES };
  }
}
