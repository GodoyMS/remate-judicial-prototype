"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Play, Quote, Star } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { getPublishedTestimonials } from "@/lib/admin/mock-data";
import type { AdminTestimonial } from "@/lib/admin/types";
import { TestimonialVideoModal } from "@/components/landing/TestimonialVideoModal";

/**
 * Testimonials — second review, findings 32 and 33.
 *
 * · 32 — fourteen testimonials inside the main flow is not social proof, it
 *   is a wall. Four representative profiles are shown; the rest live on
 *   /testimonios, reached from "Ver más historias".
 * · 33 — the section mixed three different card shapes (photo, initials,
 *   "Video / Ver testimonio / Historia en video"). There are now exactly two
 *   components, written and video, built on the same shell: same header, same
 *   quote treatment, same author row. A video testimonial differs in one
 *   thing only — it opens the recording.
 *
 * The four featured profiles are chosen to span who actually invests: someone
 * on their first operation, an experienced investor, someone outside Lima and
 * a retired investor. Reading order is fixed, not shuffled, so the section is
 * the same for everyone who links to it.
 */
const FEATURED_IDS = ["t1", "t2", "t4", "t9"];

type CardTone = "default" | "onMedia";

function Stars({ count, tone }: { count: number; tone: CardTone }) {
  return (
    <div className="flex gap-0.5" aria-label={`${count} de 5 estrellas`}>
      {Array.from({ length: count }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            "size-3.5 fill-primary text-primary",
            tone === "onMedia" && "fill-primary text-primary"
          )}
          aria-hidden
        />
      ))}
    </div>
  );
}

function AuthorRow({ testimonial }: { testimonial: AdminTestimonial }) {
  return (
    <div className="mt-auto flex items-center gap-3 border-t border-foreground/8 pt-4">
      <div
        className={cn(
          "flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-bold",
          testimonial.avatarImageUrl
            ? "overflow-hidden ring-2 ring-primary/20"
            : "bg-foreground text-primary"
        )}
      >
        {testimonial.avatarImageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={testimonial.avatarImageUrl}
            alt=""
            className="size-full object-cover"
          />
        ) : (
          testimonial.avatar
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold leading-snug text-foreground">
          {testimonial.name}
        </p>
        <p className="text-xs leading-snug text-muted-foreground">
          {testimonial.role}
          {testimonial.amount && (
            <>
              {" · "}
              <span className="font-medium text-primary">
                {testimonial.amount}
              </span>
            </>
          )}
        </p>
      </div>
    </div>
  );
}

const shell = (tone: CardTone) =>
  cn(
    "group flex h-full flex-col gap-4 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-0.5",
    tone === "onMedia"
      ? "border border-white/15 bg-white/95 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.55)] backdrop-blur-md hover:border-primary/50"
      : "border border-foreground/8 bg-card shadow-sm hover:border-primary/40 hover:shadow-lg"
  );

/** Component 1 of 2 — a written testimonial. */
function WrittenTestimonial({
  testimonial,
  tone,
}: {
  testimonial: AdminTestimonial;
  tone: CardTone;
}) {
  return (
    <article className={shell(tone)}>
      <header className="flex items-start justify-between">
        <span className="type-label text-muted-foreground">Testimonio</span>
        <Stars count={testimonial.stars} tone={tone} />
      </header>

      <Quote className="size-6 text-primary/40" aria-hidden />
      <p className="flex-1 text-sm leading-relaxed text-foreground/80">
        &ldquo;{testimonial.review}&rdquo;
      </p>

      <AuthorRow testimonial={testimonial} />
    </article>
  );
}

/** Component 2 of 2 — a video testimonial. Same shell, one extra action. */
function VideoTestimonial({
  testimonial,
  tone,
  onOpen,
}: {
  testimonial: AdminTestimonial;
  tone: CardTone;
  onOpen: (t: AdminTestimonial) => void;
}) {
  return (
    <article className={shell(tone)}>
      <header className="flex items-start justify-between">
        <span className="type-label text-primary">Testimonio en video</span>
        <Stars count={testimonial.stars} tone={tone} />
      </header>

      <button
        type="button"
        onClick={() => onOpen(testimonial)}
        className="relative aspect-video w-full overflow-hidden rounded-xl bg-foreground text-left transition-transform hover:scale-[1.01] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        aria-label={`Reproducir el testimonio de ${testimonial.name}`}
      >
        {testimonial.videoPosterUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={testimonial.videoPosterUrl}
            alt=""
            className="absolute inset-0 size-full object-cover opacity-70"
            loading="lazy"
            decoding="async"
          />
        )}
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="flex size-12 items-center justify-center rounded-full bg-primary shadow-lg shadow-primary/30">
            <Play className="ml-0.5 size-5 fill-primary-foreground text-primary-foreground" />
          </span>
        </span>
      </button>

      <p className="flex-1 line-clamp-3 text-sm leading-relaxed text-foreground/80">
        &ldquo;{testimonial.review}&rdquo;
      </p>

      <AuthorRow testimonial={testimonial} />
    </article>
  );
}

function TestimonialItem({
  testimonial,
  tone,
  onOpen,
}: {
  testimonial: AdminTestimonial;
  tone: CardTone;
  onOpen: (t: AdminTestimonial) => void;
}) {
  return testimonial.videoUrl ? (
    <VideoTestimonial testimonial={testimonial} tone={tone} onOpen={onOpen} />
  ) : (
    <WrittenTestimonial testimonial={testimonial} tone={tone} />
  );
}

export function Testimonials({
  tone = "default",
  variant = "preview",
}: {
  tone?: CardTone;
  variant?: "preview" | "all";
}) {
  const reduceMotion = useReducedMotion();
  const published = getPublishedTestimonials();
  const featured = FEATURED_IDS.map((id) =>
    published.find((t) => t.id === id)
  ).filter((t): t is AdminTestimonial => Boolean(t));
  const rest = published.filter((t) => !FEATURED_IDS.includes(t.id));
  const visible = variant === "all" ? published : featured;

  const [selected, setSelected] = useState<AdminTestimonial | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const openTestimonial = (t: AdminTestimonial) => {
    setSelected(t);
    setModalOpen(true);
  };

  const handleModalChange = (open: boolean) => {
    setModalOpen(open);
    if (!open) setSelected(null);
  };

  if (visible.length === 0) return null;

  return (
    <>
      <div
        className={cn(
          "grid gap-5 sm:grid-cols-2",
          variant === "all" ? "lg:grid-cols-3" : "lg:grid-cols-4"
        )}
      >
        {visible.map((t, i) => (
          <motion.div
            key={t.id}
            initial={
              variant === "all" || reduceMotion
                ? false
                : { opacity: 0, y: 18 }
            }
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: reduceMotion ? 0 : i * 0.05, duration: 0.45 }}
            className="h-full"
          >
            <TestimonialItem
              testimonial={t}
              tone={tone}
              onOpen={openTestimonial}
            />
          </motion.div>
        ))}
      </div>

      {variant === "preview" && rest.length > 0 && (
        <div className="mt-8 flex flex-col items-center gap-2">
          <Link
            href="/testimonios"
            className={cn(
              "inline-flex cursor-pointer items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-semibold transition-colors",
              tone === "onMedia"
                ? "border-white/25 bg-white/10 text-white backdrop-blur-md hover:bg-white/20"
                : "border-border bg-card text-foreground hover:border-primary/40 hover:bg-primary/5"
            )}
          >
            {`Ver más historias (${rest.length})`}
            <ArrowRight className="size-4" aria-hidden />
          </Link>
          <p
            className={cn(
              "text-xs",
              tone === "onMedia" ? "text-white/55" : "text-muted-foreground"
            )}
          >
            Historias publicadas con autorización de cada inversionista.
          </p>
        </div>
      )}

      <TestimonialVideoModal
        testimonial={selected}
        open={modalOpen}
        onOpenChange={handleModalChange}
      />
    </>
  );
}
