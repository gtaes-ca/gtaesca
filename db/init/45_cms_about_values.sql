INSERT INTO web_content_widgets (page, section, content) VALUES
  (
    'about',
    'values',
    '{
      "tagline": "Our Values",
      "title": "What We Stand For",
      "items": [
        {
          "icon": "icon-certified",
          "title": "Safety Above All",
          "text": "Every decision we make on the job starts with safety — for your family, your property, and our team. We follow ESA standards on every project, no exceptions."
        },
        {
          "icon": "icon-speech-bubbles",
          "title": "Honest Communication",
          "text": "We tell you what the job involves, what it will cost, and how long it will take — before we start. No surprises, no upselling, no runaround."
        },
        {
          "icon": "icon-medal",
          "title": "Quality Workmanship",
          "text": "We take pride in clean, careful work. From the wiring inside your walls to the finish on your pot lights, the details matter to us."
        },
        {
          "icon": "icon-clock",
          "title": "Reliable Service",
          "text": "We show up when we say we will, complete the work on schedule, and follow up to make sure you are satisfied. That is how we have earned long-term client relationships."
        }
      ]
    }'::jsonb
  )
ON CONFLICT (page, section) DO NOTHING;
