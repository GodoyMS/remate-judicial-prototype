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

/** Faint architectural photo behind the landing hero. */
export const LANDING_HERO_BG_SRC =
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=2400&h=1400&fit=crop&auto=format&q=80";

/** Full-bleed luxury residence behind the testimonials section. */
export const LANDING_TESTIMONIALS_BG_SRC =
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=2400&h=1400&fit=crop&auto=format&q=80";

/** Photographic assets for the redesigned marketing sections. */
export const LANDING_PHOTOS = {
  whyAccess:
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&h=1000&fit=crop&auto=format&q=80",
  whyManaged:
    "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1600&h=1000&fit=crop&auto=format&q=80",
  whySpread:
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1600&h=1000&fit=crop&auto=format&q=80",
  whyTracking:
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1600&h=1000&fit=crop&auto=format&q=80",
  manageAudit:
    "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1400&h=1100&fit=crop&auto=format&q=80",
  manageAuction:
    "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1400&h=1100&fit=crop&auto=format&q=80",
  manageTitle:
    "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1400&h=1100&fit=crop&auto=format&q=80",
  manageSale:
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1400&h=1100&fit=crop&auto=format&q=80",
  moneyBefore:
    "https://images.unsplash.com/photo-1501167786227-4cba60f6d58f?w=1400&h=1100&fit=crop&auto=format&q=80",
  moneyDuring:
    "https://images.unsplash.com/photo-1436450412740-6b988f486c6b?w=1400&h=1100&fit=crop&auto=format&q=80",
  moneyAfter:
    "https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=1400&h=1100&fit=crop&auto=format&q=80",
  originHero:
    "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=2400&h=1400&fit=crop&auto=format&q=80",
  anotherWay:
    "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&h=1800&fit=crop&auto=format&q=80",
  forYou:
    "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1600&h=1400&fit=crop&auto=format&q=80",
  teamMariana:
    "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&h=1000&fit=crop&auto=format&q=80",
  teamDiego:
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=1000&fit=crop&auto=format&q=80",
  teamRenzo:
    "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=800&h=1000&fit=crop&auto=format&q=80",
} as const;

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
