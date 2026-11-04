import { cn } from "@/lib/utils";

/**
 * Rematto logo files in /public/brand, cut directly from the supplied artwork
 * (blue #2D45DC, transparent background). They are real images so people can
 * save them; never redraw them or replace them with vector approximations.
 *
 * `brand` is blue in the light theme and white in the dark theme, `white` is
 * for surfaces that are always dark, and `inverted` is for bg-foreground
 * surfaces, which are dark in the light theme and light in the dark theme.
 */
export type LogoTone = "brand" | "white" | "inverted";

const TONE_CLASSES: Record<LogoTone, { blue: string; white: string }> = {
  brand: { blue: "dark:hidden", white: "hidden dark:block" },
  white: { blue: "hidden", white: "block" },
  inverted: { blue: "hidden dark:block", white: "dark:hidden" },
};

type BrandImageProps = {
  blueSrc: string;
  whiteSrc: string;
  alt: string;
  width: number;
  height: number;
  tone: LogoTone;
  className?: string;
  style?: React.CSSProperties;
};

function BrandImage({
  blueSrc,
  whiteSrc,
  alt,
  width,
  height,
  tone,
  className,
  style,
}: BrandImageProps) {
  const classes = TONE_CLASSES[tone];
  const shared = { width, height, style };

  return (
    <>
      {/* Plain <img> so "Save image as" gives the PNG, not an optimized copy. */}
      {tone !== "white" && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          {...shared}
          alt={alt}
          src={blueSrc}
          className={cn("shrink-0", classes.blue, className)}
        />
      )}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        {...shared}
        alt={alt}
        src={whiteSrc}
        className={cn("shrink-0", classes.white, className)}
      />
    </>
  );
}

type LogoMarkProps = {
  tone?: LogoTone;
  className?: string;
};

/** Rematto symbol: the house "o" of the logotype. Size via className. */
export function LogoMark({ tone = "brand", className }: LogoMarkProps) {
  return (
    <BrandImage
      blueSrc="/brand/rematto-mark.png"
      whiteSrc="/brand/rematto-mark-white.png"
      alt="Rematto"
      width={173}
      height={186}
      tone={tone}
      className={cn("object-contain", className)}
    />
  );
}

type LogoProps = {
  tone?: LogoTone;
  className?: string;
};

/**
 * Rematto logotype.
 * Scales with font-size — set size via text-* classes and color via `tone`,
 * e.g. `<Logo className="text-2xl" tone="white" />`.
 * The contextual size is multiplied by the `--logo-scale` design token,
 * user-adjustable from the appearance panel.
 */
export function Logo({ tone = "brand", className }: LogoProps) {
  return (
    <span className={cn("inline-flex items-center leading-none", className)}>
      <BrandImage
        blueSrc="/brand/rematto-logo.png"
        whiteSrc="/brand/rematto-logo-white.png"
        alt="Rematto"
        width={1293}
        height={237}
        tone={tone}
        className="w-auto max-w-none"
        style={{ height: "calc(0.725em * var(--logo-scale, 1))" }}
      />
    </span>
  );
}
