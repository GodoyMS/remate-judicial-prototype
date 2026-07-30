/**
 * Landing page demo video.
 *
 * Replace the file at `public/videos/landing-demo.mp4` with your own video.
 * Optionally add a poster image at `public/videos/landing-demo-poster.jpg`.
 */
export const LANDING_DEMO_VIDEO_SRC = "/videos/hero.mp4";

export const LANDING_DEMO_POSTER_SRC = "/videos/landing-demo-poster.jpg";

/** Full-bleed hero background video (muted, looping). */
export const LANDING_HERO_VIDEO_SRC = "/videos/file.mp4";

/** Full-bleed luxury residence behind the testimonials section. */
export const LANDING_TESTIMONIALS_BG_SRC =
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=2400&h=1400&fit=crop&auto=format&q=80";

/**
 * Chapter timestamps in seconds. Adjust these to match your video edit points.
 * Set to an empty array to hide chapter markers.
 */
export const LANDING_DEMO_CHAPTERS = [
  { start: 0, label: "Explora" },
  { start: 9, label: "Invierte" },
  { start: 18, label: "Subasta" },
  { start: 27, label: "Retornos" },
] as const;
