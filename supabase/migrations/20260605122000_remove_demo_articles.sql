-- Migration: remove seeded demo articles and related demo records

DELETE FROM articles WHERE slug IN (
  'ghana-gold-production-q1-2026',
  'anglogold-obuasi-expansion',
  'lithium-rush-west-africa',
  'newmont-ceo-interview',
  'ai-mineral-exploration',
  'esg-community-development',
  'copper-price-forecast-africa',
  'ghana-manganese-investment'
);

-- Optionally remove demo authors (only if they are not referenced elsewhere)
DELETE FROM authors WHERE name IN ('Kwame Asante', 'Ama Osei', 'Kofi Mensah', 'Nana Akufo');
