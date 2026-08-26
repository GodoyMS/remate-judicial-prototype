"use client";

import type { CSSProperties } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { dashboardProperties } from "@/lib/dashboard/mock-data";
import { cn } from "@/lib/utils";

type RainHouse = {
  src: string;
  left: string;
  width: number;
  aspect: string;
  duration: number;
  delay: number;
  rotate: number;
  drift: number;
  opacity: number;
  blur: number;
  z: number;
};

/** Only URLs already used across the product (PropertyPreview / dashboard). */
const HOUSE_IMAGES = Array.from(
  new Set(
    dashboardProperties.flatMap((p) => [
      p.img.replace(/w=\d+&h=\d+/, "w=480&h=640"),
      ...p.images.map((src) => src.replace(/w=\d+&h=\d+/, "w=480&h=640")),
    ])
  )
);

const RAIN_LAYOUT: Omit<RainHouse, "src">[] = [
  { left: "4%", width: 148, aspect: "3/4", duration: 28, delay: -4, rotate: -6, drift: 28, opacity: 0.72, blur: 0, z: 1 },
  { left: "14%", width: 176, aspect: "4/3", duration: 34, delay: -18, rotate: 4, drift: -22, opacity: 0.55, blur: 1, z: 0 },
  { left: "22%", width: 132, aspect: "3/4", duration: 24, delay: -9, rotate: -3, drift: 36, opacity: 0.8, blur: 0, z: 2 },
  { left: "32%", width: 120, aspect: "4/3", duration: 31, delay: -22, rotate: 7, drift: -14, opacity: 0.4, blur: 2, z: 0 },
  { left: "68%", width: 160, aspect: "3/4", duration: 26, delay: -6, rotate: 5, drift: -30, opacity: 0.75, blur: 0, z: 2 },
  { left: "78%", width: 188, aspect: "4/3", duration: 36, delay: -14, rotate: -5, drift: 18, opacity: 0.5, blur: 1, z: 0 },
  { left: "88%", width: 140, aspect: "3/4", duration: 29, delay: -20, rotate: 3, drift: -24, opacity: 0.7, blur: 0, z: 1 },
  { left: "8%", width: 168, aspect: "4/3", duration: 33, delay: -27, rotate: -4, drift: 20, opacity: 0.45, blur: 1.5, z: 0 },
  { left: "42%", width: 112, aspect: "3/4", duration: 22, delay: -11, rotate: 8, drift: 40, opacity: 0.35, blur: 2.5, z: 0 },
  { left: "58%", width: 124, aspect: "3/4", duration: 30, delay: -16, rotate: -7, drift: -36, opacity: 0.38, blur: 2, z: 0 },
  { left: "72%", width: 152, aspect: "4/3", duration: 27, delay: -2, rotate: 2, drift: 16, opacity: 0.65, blur: 0, z: 1 },
  { left: "94%", width: 130, aspect: "3/4", duration: 32, delay: -24, rotate: -8, drift: -18, opacity: 0.58, blur: 1, z: 1 },
  { left: "48%", width: 100, aspect: "4/3", duration: 38, delay: -30, rotate: 5, drift: 12, opacity: 0.28, blur: 3, z: 0 },
  { left: "1%", width: 110, aspect: "3/4", duration: 25, delay: -13, rotate: 6, drift: 32, opacity: 0.5, blur: 0.5, z: 1 },
  { left: "96%", width: 118, aspect: "4/3", duration: 35, delay: -8, rotate: -2, drift: -28, opacity: 0.42, blur: 1.5, z: 0 },
  { left: "55%", width: 170, aspect: "3/4", duration: 23, delay: -19, rotate: -4, drift: 22, opacity: 0.68, blur: 0, z: 2 },
];

const RAIN_HOUSES: RainHouse[] = RAIN_LAYOUT.map((layout, i) => ({
  ...layout,
  src: HOUSE_IMAGES[i % HOUSE_IMAGES.length],
}));

function HouseFrame({
  src,
  className,
  style,
  loading = "lazy",
}: {
  src: string;
  className?: string;
  style?: CSSProperties;
  loading?: "eager" | "lazy";
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-background/15 bg-background/10 shadow-lg shadow-foreground/30",
        className
      )}
      style={style}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt=""
        className="size-full object-cover"
        loading={loading}
        decoding="async"
      />
    </div>
  );
}

function HouseRain({ reduced }: { reduced: boolean }) {
  if (reduced) {
    return (
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        {RAIN_HOUSES.slice(0, 8).map((house, i) => (
          <HouseFrame
            key={`static-${i}`}
            src={house.src}
            className="absolute"
            style={{
              left: house.left,
              top: `${12 + (i % 4) * 22}%`,
              width: house.width * 0.85,
              aspectRatio: house.aspect,
              opacity: house.opacity * 0.55,
              filter: house.blur ? `blur(${house.blur}px)` : undefined,
              transform: `rotate(${house.rotate}deg)`,
              zIndex: house.z,
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {RAIN_HOUSES.map((house, i) => (
        <div
          key={`rain-${i}`}
          className={cn(
            "house-rain-tile absolute top-0 will-change-transform",
            i >= 10 && "hidden sm:block",
            i >= 14 && "hidden lg:block"
          )}
          style={
            {
              left: house.left,
              width: house.width,
              aspectRatio: house.aspect,
              zIndex: house.z,
              "--house-duration": `${house.duration}s`,
              "--house-delay": `${house.delay}s`,
              "--house-rotate": `${house.rotate}deg`,
              "--house-drift": `${house.drift}px`,
            } as CSSProperties
          }
        >
          <HouseFrame
            src={house.src}
            className="size-full"
            loading={i < 6 ? "eager" : "lazy"}
            style={{
              opacity: house.opacity,
              filter: house.blur ? `blur(${house.blur}px)` : undefined,
            }}
          />
        </div>
      ))}
    </div>
  );
}

export function FinalCTA() {
  const reducedMotion = useReducedMotion();

  return (
    <section
      data-nav-tone="dark"
      className="relative isolate min-h-[88vh] overflow-hidden bg-foreground py-28 text-background sm:min-h-[92vh] sm:py-32"
    >
      <div className="pointer-events-none absolute -top-32 left-1/2 size-[600px] -translate-x-1/2 rounded-full bg-primary/25 blur-3xl" aria-hidden />
      <div className="pointer-events-none absolute -bottom-24 -right-20 size-80 rounded-full bg-primary/15 blur-3xl" aria-hidden />

      <HouseRain reduced={!!reducedMotion} />

      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_55%_50%_at_50%_48%,color-mix(in_oklch,var(--foreground)_92%,transparent)_0%,color-mix(in_oklch,var(--foreground)_70%,transparent)_40%,color-mix(in_oklch,var(--foreground)_25%,transparent)_70%,transparent_100%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-linear-to-b from-foreground to-transparent"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-linear-to-t from-foreground to-transparent"
        aria-hidden
      />

      <div className="relative z-10 mx-auto flex min-h-[56vh] max-w-4xl flex-col items-center justify-center gap-10 section-padding text-center sm:min-h-[60vh]">
        <motion.div
          initial={reducedMotion ? false : { opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-2xl rounded-2xl border border-background/10 bg-background/8 px-6 py-10 shadow-xl shadow-foreground/40 backdrop-blur-xl sm:px-12 sm:py-12"
        >
          {/* RM-022 — the close used to repeat the return promise and the
              investor count. Someone who has read the whole page already knows
              both; what still stops them is not knowing what happens next. So
              the close removes friction instead of selling again. */}
          <h2 className="text-balance text-3xl font-bold leading-[1.15] tracking-tight text-background sm:text-4xl lg:text-5xl">
            Crear tu cuenta{" "}
            <span className="text-primary">no te obliga a invertir</span>
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-pretty text-base leading-relaxed text-background/70 sm:text-lg">
            Regístrate para ver el expediente, los plazos y las comisiones de
            cada operación abierta. Decides después, o no decides.
          </p>

          <ol className="mx-auto mt-8 grid max-w-xl gap-3 text-left sm:grid-cols-3">
            {[
              {
                step: "1",
                title: "Te registras",
                detail: "Correo y contraseña. Toma un minuto.",
              },
              {
                step: "2",
                title: "Verificamos tu identidad",
                detail: "Hasta 24 horas hábiles, como exige la ley.",
              },
              {
                step: "3",
                title: "Exploras sin compromiso",
                detail: "Ves todo el detalle. Inviertes solo si quieres.",
              },
            ].map((item) => (
              <li
                key={item.step}
                className="rounded-xl border border-background/10 bg-background/5 p-4"
              >
                <span className="type-label text-primary">
                  Paso {item.step}
                </span>
                <p className="mt-1.5 text-sm font-semibold text-background">
                  {item.title}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-background/60">
                  {item.detail}
                </p>
              </li>
            ))}
          </ol>
        </motion.div>

        <motion.div
          initial={reducedMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
        >
          <Button
            size="lg"
            asChild
            className="group h-13 rounded-full bg-primary px-8 text-base font-semibold text-primary-foreground shadow-xl shadow-primary/30 hover:bg-primary/90"
          >
            <Link href="/register">
              Crear cuenta gratis
              <ArrowRight className="ml-1 size-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </Button>

          <p className="mt-5 text-xs leading-relaxed text-background/55">
            Las inversiones en remates judiciales conllevan riesgo de pérdida.{" "}
            <Link
              href="/politica-de-riesgos"
              className="font-medium text-background/80 underline underline-offset-2 hover:text-background"
            >
              Lee la política de riesgos
            </Link>{" "}
            o{" "}
            <Link
              href="/contacto"
              className="font-medium text-background/80 underline underline-offset-2 hover:text-background"
            >
              habla con el equipo
            </Link>{" "}
            antes de decidir.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
