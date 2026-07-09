INSERT INTO web_content_widgets (page, section, content) VALUES
  (
    'home',
    'topbar',
    '{
      "email": "example@gamil.com",
      "address": "12 Green Road, 05 New York",
      "social": {
        "facebook": "",
        "twitter": "",
        "linkedin": "",
        "instagram": ""
      }
    }'::jsonb
  ),
  (
    'home',
    'slider',
    '{
      "slides": [
        {
          "subTitle": "Service Company",
          "titleLine1": "Bright Solutions",
          "titleLine2": "for Dark Problems",
          "text": "We have been operating for over a decade, providing top-notch services to our clients",
          "buttonText": "Learn More",
          "buttonLink": "/about",
          "backgroundImage": "assets/images/backgrounds/slider-1-1.jpg",
          "backgroundImageMobile": "assets/images/backgrounds/slider-1-1.jpg"
        },
        {
          "subTitle": "Service Company",
          "titleLine1": "Bright Solutions",
          "titleLine2": "for Dark Problems",
          "text": "We have been operating for over a decade, providing top-notch services to our clients",
          "buttonText": "Learn More",
          "buttonLink": "/about",
          "backgroundImage": "assets/images/backgrounds/slider-1-2.jpg",
          "backgroundImageMobile": "assets/images/backgrounds/slider-1-2.jpg"
        },
        {
          "subTitle": "Service Company",
          "titleLine1": "Bright Solutions",
          "titleLine2": "for Dark Problems",
          "text": "We have been operating for over a decade, providing top-notch services to our clients",
          "buttonText": "Learn More",
          "buttonLink": "/about",
          "backgroundImage": "assets/images/backgrounds/slider-1-3.jpg",
          "backgroundImageMobile": "assets/images/backgrounds/slider-1-3.jpg"
        }
      ]
    }'::jsonb
  ),
  (
    'home',
    'services',
    '{
      "items": [
        {
          "title": "Fair & Transparent Pricing",
          "text": "Honest upfront quotes with no hidden fees on residential and commercial electrical work.",
          "link": "/services",
          "icon": "icon-affordable-price"
        },
        {
          "title": "Licensed & Insured",
          "text": "ESA-certified electricians delivering safe, code-compliant work backed by our satisfaction guarantee.",
          "link": "/about",
          "icon": "icon-setting"
        },
        {
          "title": "24/7 Emergency Service",
          "text": "Available around the clock for urgent electrical repairs across the Greater Toronto Area.",
          "link": "/contact",
          "icon": "icon-services"
        }
      ]
    }'::jsonb
  ),
  (
    'home',
    'featured-services',
    '{
      "tagline": "Our Services",
      "titleLine1": "Featured Electrical Services",
      "titleLine2": "for Your Home & Business",
      "serviceIds": []
    }'::jsonb
  ),
  (
    'home',
    'gallery',
    '{
      "tagline": "Our Gallery",
      "titleLine1": "Your Brightest",
      "titleLine2": "Choice in Repairs",
      "buttonText": "All Gallery",
      "buttonLink": "/projects",
      "items": [
        {
          "subTitle": "Home Electrical",
          "title": "Panel Upgrade & Installation",
          "text": "Safe electrical panel upgrades to support modern home power needs.",
          "link": "/projects",
          "image": "assets/images/project/project-1-1.jpg"
        },
        {
          "subTitle": "Lighting",
          "title": "Indoor & Outdoor Lighting",
          "text": "Clean lighting installs for homes, exteriors, and landscape areas.",
          "link": "/projects",
          "image": "assets/images/project/project-1-2.jpg"
        },
        {
          "subTitle": "EV Charging",
          "title": "EV Charger Installation",
          "text": "Professional Level 2 charger installs for convenient at-home charging.",
          "link": "/projects",
          "image": "assets/images/project/project-1-3.jpg"
        },
        {
          "subTitle": "Commercial",
          "title": "Commercial Lighting Upgrade",
          "text": "Efficient lighting upgrades for offices, retail, and warehouses.",
          "link": "/projects",
          "image": "assets/images/project/project-1-4.jpg"
        },
        {
          "subTitle": "Safety",
          "title": "Smoke & CO Alarm Setup",
          "text": "Code-compliant smoke and carbon monoxide alarm installations.",
          "link": "/projects",
          "image": "assets/images/project/project-1-5.jpg"
        },
        {
          "subTitle": "Rewiring",
          "title": "Home Rewiring Project",
          "text": "Reliable rewiring for outdated or unsafe electrical systems.",
          "link": "/projects",
          "image": "assets/images/project/project-1-6.jpg"
        }
      ]
    }'::jsonb
  )
ON CONFLICT (page, section) DO NOTHING;
