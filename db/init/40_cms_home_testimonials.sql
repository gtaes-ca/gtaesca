INSERT INTO web_content_widgets (page, section, content) VALUES
  (
    'home',
    'testimonials',
    '{
      "tagline": "Testimonials",
      "titleLine1": "What Our Clients Say",
      "titleLine2": "",
      "items": [
        {
          "message": "GTA Electric Services upgraded our panel quickly and explained every step. Professional, clean work, and fair pricing.",
          "clientName": "Sarah Mitchell",
          "timestamp": "2026-06-12T14:30:00.000Z",
          "rating": 5
        },
        {
          "message": "They handled our office lighting retrofit after hours so we had zero downtime. Highly recommend for commercial work.",
          "clientName": "James Chen",
          "timestamp": "2026-05-28T10:00:00.000Z",
          "rating": 5
        },
        {
          "message": "Responsive, licensed, and thorough. Fixed our intermittent breaker issues the same week we called.",
          "clientName": "Priya Patel",
          "timestamp": "2026-04-18T16:45:00.000Z",
          "rating": 4
        }
      ]
    }'::jsonb
  )
ON CONFLICT (page, section) DO NOTHING;
