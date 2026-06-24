"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  X,
  Star,
  Quote,
  Sparkles,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import type { AdminTestimonial } from "@/lib/admin/types";

interface TestimonialVideoModalProps {
  testimonial: AdminTestimonial | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

export function TestimonialVideoModal({
  testimonial,
  open,
  onOpenChange,
}: TestimonialVideoModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [hasError, setHasError] = useState(false);

  const resetPlayer = useCallback(() => {
    const video = videoRef.current;
    if (video) {
      video.pause();
      video.currentTime = 0;
    }
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setHasError(false);
  }, []);

  useEffect(() => {
    if (!open) resetPlayer();
  }, [open, resetPlayer]);

  useEffect(() => {
    const video = videoRef.current;
    if (video) video.muted = isMuted;
  }, [isMuted]);

  if (!testimonial) return null;

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const hasVideo = Boolean(testimonial.videoUrl);

  const handlePlay = async () => {
    const video = videoRef.current;
    if (!video || hasError) return;
    try {
      await video.play();
      setIsPlaying(true);
    } catch {
      setIsPlaying(false);
    }
  };

  const handlePause = () => {
    videoRef.current?.pause();
    setIsPlaying(false);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!duration || !videoRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const nextTime = ratio * duration;
    videoRef.current.currentTime = nextTime;
    setCurrentTime(nextTime);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="max-w-4xl gap-0 overflow-hidden border-0 bg-transparent p-0 shadow-none sm:max-w-4xl"
      >
        <DialogTitle className="sr-only">
          Testimonio de {testimonial.name}
        </DialogTitle>

        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 12 }}
          transition={{ type: "spring", stiffness: 320, damping: 28 }}
          className="relative overflow-hidden rounded-3xl bg-[#0d1f00] shadow-2xl shadow-[#163300]/30 ring-1 ring-[#9FE870]/20"
        >
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="absolute right-4 top-4 z-30 flex size-9 items-center justify-center rounded-full border border-white/10 bg-black/50 text-white/80 backdrop-blur-md transition-colors hover:bg-black/70 hover:text-white"
            aria-label="Cerrar"
          >
            <X className="size-4" />
          </button>

          <div className="grid lg:grid-cols-5">
            {/* Video / visual panel */}
            <div className="relative lg:col-span-3">
              {hasVideo ? (
                <div className="relative aspect-video w-full bg-[#163300]">
                  <video
                    ref={videoRef}
                    className="absolute inset-0 h-full size-full object-cover"
                    src={testimonial.videoUrl}
                    poster={testimonial.videoPosterUrl}
                    playsInline
                    preload="metadata"
                    onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
                    onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                    onEnded={() => setIsPlaying(false)}
                    onError={() => setHasError(true)}
                  />

                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

                  {hasError && (
                    <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#163300] p-6 text-center">
                      <p className="text-sm text-white/70">Video no disponible</p>
                    </div>
                  )}

                  {!hasError && (
                    <div className="absolute bottom-0 left-0 right-0 z-20 p-4">
                      <div
                        className="group/progress relative mb-3 h-1 cursor-pointer rounded-full bg-white/20"
                        onClick={handleSeek}
                        role="slider"
                        aria-valuemin={0}
                        aria-valuemax={duration}
                        aria-valuenow={currentTime}
                        aria-label="Progreso del video"
                      >
                        <div
                          className="absolute inset-y-0 left-0 rounded-full bg-[#9FE870]"
                          style={{ width: `${progress}%` }}
                        />
                        <div
                          className="absolute top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#9FE870] opacity-0 shadow-lg transition-opacity group-hover/progress:opacity-100"
                          style={{ left: `${progress}%` }}
                        />
                      </div>

                      <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-black/50 px-3 py-2 backdrop-blur-xl">
                        <button
                          type="button"
                          onClick={isPlaying ? handlePause : () => void handlePlay()}
                          className="flex size-8 items-center justify-center rounded-full text-white transition-colors hover:bg-white/10"
                          aria-label={isPlaying ? "Pausar" : "Reproducir"}
                        >
                          {isPlaying ? (
                            <Pause className="size-3.5 fill-white" />
                          ) : (
                            <Play className="ml-0.5 size-3.5 fill-white" />
                          )}
                        </button>
                        <span className="text-[11px] tabular-nums text-white/60">
                          {formatTime(currentTime)} / {formatTime(duration)}
                        </span>
                        <div className="flex-1" />
                        <button
                          type="button"
                          onClick={() => setIsMuted((m) => !m)}
                          className="flex size-8 items-center justify-center rounded-full text-white/70 transition-colors hover:bg-white/10 hover:text-white"
                          aria-label={isMuted ? "Activar sonido" : "Silenciar"}
                        >
                          {isMuted ? (
                            <VolumeX className="size-3.5" />
                          ) : (
                            <Volume2 className="size-3.5" />
                          )}
                        </button>
                      </div>
                    </div>
                  )}

                  {!isPlaying && !hasError && (
                    <button
                      type="button"
                      onClick={() => void handlePlay()}
                      className="absolute inset-0 z-10 flex items-center justify-center"
                      aria-label="Reproducir testimonio en video"
                    >
                      <span className="flex size-16 items-center justify-center rounded-full bg-[#9FE870] shadow-2xl shadow-[#9FE870]/40 ring-4 ring-[#9FE870]/30 transition-transform hover:scale-105">
                        <Play className="ml-1 size-7 fill-[#163300] text-[#163300]" />
                      </span>
                    </button>
                  )}
                </div>
              ) : (
                <div className="relative flex aspect-video items-center justify-center bg-gradient-to-br from-[#163300] to-[#0d1f00] p-8 lg:aspect-auto lg:min-h-[320px]">
                  <div className="absolute inset-0 opacity-20">
                    <div className="absolute -right-20 -top-20 size-64 rounded-full bg-[#9FE870]/30 blur-3xl" />
                    <div className="absolute -bottom-10 -left-10 size-48 rounded-full bg-[#9FE870]/20 blur-2xl" />
                  </div>
                  <Quote className="relative size-20 text-[#9FE870]/30" />
                </div>
              )}
            </div>

            {/* Details panel */}
            <div className="flex flex-col gap-5 bg-white p-6 lg:col-span-2 lg:p-8">
              <div className="flex items-center gap-2">
                <Sparkles className="size-3.5 text-[#9FE870]" />
                <span className="text-[10px] font-semibold uppercase tracking-widest text-[#163300]/50">
                  Testimonio verificado
                </span>
              </div>

              <div className="flex gap-0.5">
                {Array.from({ length: testimonial.stars }).map((_, i) => (
                  <Star
                    key={i}
                    className="size-4 fill-[#9FE870] text-[#9FE870]"
                  />
                ))}
              </div>

              <blockquote className="flex-1 text-base leading-relaxed text-[#163300]/85">
                &ldquo;{testimonial.review}&rdquo;
              </blockquote>

              <div className="flex items-center gap-3 border-t border-[#163300]/8 pt-5">
                <div
                  className={cn(
                    "flex size-12 shrink-0 items-center justify-center rounded-full text-sm font-bold",
                    testimonial.avatarImageUrl
                      ? "overflow-hidden ring-2 ring-[#9FE870]/30"
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
                  <p className="font-semibold text-[#163300]">{testimonial.name}</p>
                  <p className="text-sm text-[#163300]/50">{testimonial.role}</p>
                </div>
              </div>

              {testimonial.amount && (
                <span className="inline-flex w-fit items-center rounded-full bg-[#9FE870]/20 px-3 py-1.5 text-xs font-semibold text-[#163300]">
                  {testimonial.amount}
                </span>
              )}
            </div>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
