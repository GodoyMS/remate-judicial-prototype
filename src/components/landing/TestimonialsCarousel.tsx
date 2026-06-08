"use client";

import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Star,
  Quote,
  ChevronLeft,
  ChevronRight,
  Play,
  Video,
} from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import { getPublishedTestimonials } from "@/lib/admin/mock-data";
import type { AdminTestimonial } from "@/lib/admin/types";
import { TestimonialVideoModal } from "@/components/landing/TestimonialVideoModal";

const AUTOPLAY_INTERVAL = 5000;

function TestimonialCard({
  testimonial,
  onOpen,
}: {
  testimonial: AdminTestimonial;
  onOpen: (t: AdminTestimonial) => void;
}) {
  const hasVideo = Boolean(testimonial.videoUrl);

  return (
    <div
      className={cn(
        "group relative flex h-full flex-col gap-5 rounded-2xl border border-[#163300]/8 bg-white p-6 shadow-sm",
        "transition-all duration-300 hover:-translate-y-0.5 hover:border-[#9FE870]/40 hover:shadow-lg"
      )}
    >
      {hasVideo && (
        <button
          type="button"
          onClick={() => onOpen(testimonial)}
          className="absolute -right-2 -top-2 z-10 flex items-center gap-1 rounded-full border border-[#9FE870]/40 bg-[#163300] px-2.5 py-1 text-[10px] font-semibold text-[#9FE870] shadow-md transition-transform hover:scale-105"
        >
          <Video className="size-3" />
          Video
        </button>
      )}

      <div className="flex items-start justify-between">
        <Quote className="size-8 text-[#9FE870]/50" />
        <div className="flex gap-0.5">
          {Array.from({ length: testimonial.stars }).map((_, j) => (
            <Star
              key={j}
              className="size-3.5 fill-[#9FE870] text-[#9FE870]"
            />
          ))}
        </div>
      </div>

      <p className="line-clamp-4 flex-1 text-sm leading-relaxed text-[#163300]/80">
        &ldquo;{testimonial.review}&rdquo;
      </p>

      {hasVideo && (
        <button
          type="button"
          onClick={() => onOpen(testimonial)}
          className="relative overflow-hidden rounded-xl bg-gradient-to-br from-[#163300] to-[#0d1f00] p-4 text-left transition-transform hover:scale-[1.02]"
        >
          {testimonial.videoPosterUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={testimonial.videoPosterUrl}
              alt=""
              className="absolute inset-0 size-full object-cover opacity-40"
            />
          )}
          <div className="relative flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-full bg-[#9FE870] shadow-lg shadow-[#9FE870]/30">
              <Play className="ml-0.5 size-4 fill-[#163300] text-[#163300]" />
            </span>
            <div>
              <p className="text-xs font-semibold text-white">Ver testimonio</p>
              <p className="text-[10px] text-white/50">Historia en video</p>
            </div>
          </div>
        </button>
      )}

      <div className="flex items-center gap-3 border-t border-[#163300]/8 pt-4">
        <div
          className={cn(
            "flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-bold",
            testimonial.avatarImageUrl
              ? "overflow-hidden ring-2 ring-[#9FE870]/20"
              : "bg-[#163300] text-[#9FE870]"
          )}
        >
          {testimonial.avatarImageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={testimonial.avatarImageUrl}
              alt={testimonial.name}
              className="size-full object-cover"
            />
          ) : (
            testimonial.avatar
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-[#163300]">
            {testimonial.name}
          </p>
          <p className="truncate text-xs text-[#163300]/50">{testimonial.role}</p>
        </div>
        {testimonial.amount && (
          <span className="hidden shrink-0 rounded-full bg-[#9FE870]/25 px-2.5 py-1 text-[10px] font-semibold text-[#163300] sm:inline">
            {testimonial.amount}
          </span>
        )}
      </div>
    </div>
  );
}

export function TestimonialsCarousel() {
  const testimonials = getPublishedTestimonials();
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [selected, setSelected] = useState<AdminTestimonial | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const scrollPrev = useCallback(() => api?.scrollPrev(), [api]);
  const scrollNext = useCallback(() => api?.scrollNext(), [api]);

  useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    const onSelect = () => setCurrent(api.selectedScrollSnap());
    api.on("reInit", onSelect);
    api.on("select", onSelect);

    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  useEffect(() => {
    if (!api || isPaused) return;

    const timer = setInterval(() => {
      if (api.canScrollNext()) {
        api.scrollNext();
      } else {
        api.scrollTo(0);
      }
    }, AUTOPLAY_INTERVAL);

    return () => clearInterval(timer);
  }, [api, isPaused, current]);

  const openTestimonial = (t: AdminTestimonial) => {
    setSelected(t);
    setModalOpen(true);
    setIsPaused(true);
  };

  const handleModalChange = (open: boolean) => {
    setModalOpen(open);
    if (!open) {
      setSelected(null);
      setIsPaused(false);
    }
  };

  if (testimonials.length === 0) return null;

  return (
    <>
      <div
        className="relative"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onFocus={() => setIsPaused(true)}
        onBlur={() => setIsPaused(false)}
      >
        <Carousel
          setApi={setApi}
          opts={{
            align: "start",
            loop: true,
            dragFree: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {testimonials.map((t, i) => (
              <CarouselItem
                key={t.id}
                className="basis-full pl-4 md:basis-1/2 lg:basis-1/3"
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: (i % 3) * 0.08, duration: 0.5 }}
                  className="h-full"
                >
                  <TestimonialCard testimonial={t} onOpen={openTestimonial} />
                </motion.div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        {/* Navigation controls */}
        <div className="mt-8 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={scrollPrev}
            className="flex size-10 items-center justify-center rounded-full border border-[#163300]/15 bg-white text-[#163300] shadow-sm transition-all hover:border-[#9FE870]/50 hover:bg-[#9FE870]/10 hover:shadow-md"
            aria-label="Testimonio anterior"
          >
            <ChevronLeft className="size-5" />
          </button>

          <div className="flex items-center gap-1.5">
            {Array.from({ length: count }).map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => api?.scrollTo(i)}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-300",
                  i === current
                    ? "w-6 bg-[#9FE870]"
                    : "w-1.5 bg-[#163300]/20 hover:bg-[#163300]/35"
                )}
                aria-label={`Ir al grupo ${i + 1}`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={scrollNext}
            className="flex size-10 items-center justify-center rounded-full border border-[#163300]/15 bg-white text-[#163300] shadow-sm transition-all hover:border-[#9FE870]/50 hover:bg-[#9FE870]/10 hover:shadow-md"
            aria-label="Siguiente testimonio"
          >
            <ChevronRight className="size-5" />
          </button>
        </div>

        <p className="mt-4 text-center text-xs text-[#163300]/40">
          {testimonials.length} historias de inversores · Desliza o usa las flechas
        </p>
      </div>

      <TestimonialVideoModal
        testimonial={selected}
        open={modalOpen}
        onOpenChange={handleModalChange}
      />
    </>
  );
}
