/**
 * Landing page demo video.
 *
 * Replace the file at `public/videos/landing-demo.mp4` with your own video.
 * Optionally add a poster image at `public/videos/landing-demo-poster.jpg`.
 */
export const LANDING_DEMO_VIDEO_SRC = "/videos/landing-demo.mp4";

export const LANDING_DEMO_POSTER_SRC = "/videos/landing-demo-poster.jpg";

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
