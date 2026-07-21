CREATE TABLE IF NOT EXISTS web_content_widgets (
  id SERIAL PRIMARY KEY,
  page VARCHAR(50) NOT NULL,
  section VARCHAR(50) NOT NULL,
  content JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (page, section)
);

INSERT INTO web_content_widgets (page, section, content) VALUES
  (
    'home',
    'about',
    '{
      "tagline": "Get To Know Us",
      "title": "Trusted Electrical Experts Across the Greater Toronto Area",
      "text1": "GTA Electric Services provides reliable residential and commercial electrical solutions, from troubleshooting and repairs to panel upgrades, lighting, EV chargers, and full-home rewiring.",
      "text2": "Our licensed ESA-certified electricians deliver safe, code-compliant work with honest pricing and dependable service you can count on.",
      "buttonText": "About Us More",
      "buttonLink": "/about",
      "image1": "assets/images/resources/about-one-img-1.jpg",
      "image2": "assets/images/resources/about-one-img-2.jpg"
    }'::jsonb
  ),
  (
    'about',
    'contact',
    '{
      "tagline": "contact with us",
      "title": "Choose Our Electric Repair Service because its 24/7",
      "text1": "The wise man therefore always holds in these matters to this principle of selection. He rejects pleasures to secure other greater pleasures, or else he endures pains to avoid worse pains to the selection point.",
      "text2": "But in certain circumstances and owing to the claims of duty or the obligations of business we often need reliable electrical support around the clock.",
      "primaryButtonText": "Discover More",
      "primaryButtonLink": "/about",
      "secondaryButtonText": "Free estimate",
      "secondaryButtonLink": "/contact",
      "backgroundImage": ""
    }'::jsonb
  )
ON CONFLICT (page, section) DO NOTHING;
