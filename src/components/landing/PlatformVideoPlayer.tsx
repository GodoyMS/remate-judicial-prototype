"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type MouseEvent,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Gavel,
  Search,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  LANDING_DEMO_CHAPTERS,
  LANDING_DEMO_POSTER_SRC,
  LANDING_DEMO_VIDEO_SRC,
} from "@/lib/landing/media";

const CHAPTER_ICONS = [Search, Wallet, Gavel, TrendingUp] as const;

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

function getChapterIndex(time: number) {
  for (let i = LANDING_DEMO_CHAPTERS.length - 1; i >= 0; i--) {
    if (time >= LANDING_DEMO_CHAPTERS[i].start) return i;
  }
  return 0;
}

function PlayButton({ onClick }: { onClick: () => void }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-label="Reproducir video"
      className="group relative z-20 flex size-24 items-center justify-center sm:size-28"
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.3, type: "spring", stiffness: 260 }}
    >
      <span className="absolute inset-0 animate-ping rounded-full bg-[#9FE870]/20" />
      <span className="absolute inset-[-12px] rounded-full border border-[#9FE870]/30" />
      <span className="absolute inset-[-24px] rounded-full border border-[#9FE870]/15" />
      <span className="relative flex size-full items-center justify-center rounded-full bg-[#9FE870] shadow-2xl shadow-[#9FE870]/40 ring-4 ring-[#9FE870]/30 transition-shadow group-hover:shadow-[#9FE870]/60">
        <Play className="ml-1.5 size-10 fill-[#163300] text-[#163300] sm:size-12" />
      </span>
    </motion.button>
  );
}

export function PlatformVideoPlayer() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [hasError, setHasError] = useState(false);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const hasChapters = LANDING_DEMO_CHAPTERS.length > 0;
  const chapterIndex = getChapterIndex(currentTime);
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const isEnded = duration > 0 && currentTime >= duration - 0.25;

  const resetHideTimer = useCallback(() => {
    setShowControls(true);
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    if (isPlaying) {
      hideTimerRef.current = setTimeout(() => setShowControls(false), 3000);
    }
  }, [isPlaying]);

  useEffect(() => {
    const video = videoRef.current;
    if (video) video.muted = isMuted;
  }, [isMuted]);

  useEffect(() => {
    const onFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  const handlePlay = async () => {
    const video = videoRef.current;
    if (!video || hasError) return;

    if (isEnded) video.currentTime = 0;

    setHasStarted(true);
    try {
      await video.play();
      setIsPlaying(true);
      resetHideTimer();
    } catch {
      setIsPlaying(false);
    }
  };

  const handlePause = () => {
    videoRef.current?.pause();
    setIsPlaying(false);
    setShowControls(true);
  };

  const seekTo = (time: number) => {
    const video = videoRef.current;
    if (!video || !Number.isFinite(duration) || duration <= 0) return;

    const nextTime = Math.max(0, Math.min(time, duration));
    video.currentTime = nextTime;
    setCurrentTime(nextTime);
    resetHideTimer();
  };

  const handleSeek = (e: MouseEvent<HTMLDivElement>) => {
    if (!duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    seekTo(ratio * duration);
  };

  const handleChapterClick = (start: number) => {
    if (!hasStarted) {
      setHasStarted(true);
      void handlePlay();
    }
    seekTo(start);
  };

  const toggleFullscreen = async () => {
    if (!containerRef.current) return;
    if (document.fullscreenElement) {
      await document.exitFullscreen();
    } else {
      await containerRef.current.requestFullscreen();
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === " " || e.key === "k") {
      e.preventDefault();
      if (!hasStarted) void handlePlay();
      else if (isPlaying) handlePause();
      else void handlePlay();
    }
    if (e.key === "f") void toggleFullscreen();
    if (e.key === "m") setIsMuted((m) => !m);
  };

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      role="application"
      aria-label="Reproductor de demostración de Remata"
      onKeyDown={handleKeyDown}
      onMouseMove={resetHideTimer}
      onMouseLeave={() => isPlaying && setShowControls(false)}
      className={cn(
        "group/player relative aspect-video w-full overflow-hidden rounded-3xl",
        "bg-[#0d1f00] shadow-2xl shadow-[#163300]/20",
        "ring-1 ring-[#163300]/10",
        isFullscreen && "rounded-none"
      )}
    >
      <video
        ref={videoRef}
        className="absolute inset-0 size-full object-cover"
        src={LANDING_DEMO_VIDEO_SRC}
        poster={LANDING_DEMO_POSTER_SRC}
        playsInline
        preload="metadata"
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => {
          setIsPlaying(false);
          setShowControls(true);
        }}
        onError={() => setHasError(true)}
      />

      {hasError && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 bg-[#0d1f00] p-6 text-center">
          <p className="text-sm font-semibold text-white">Video no disponible</p>
          <p className="max-w-sm text-xs text-white/60">
            Coloca tu archivo en{" "}
            <span className="font-mono text-[#9FE870]">public/videos/landing-demo.mp4</span>
          </p>
        </div>
      )}

      <div
        className={cn(
          "pointer-events-none absolute inset-0 transition-opacity duration-500",
          !hasStarted
            ? "bg-gradient-to-t from-[#163300]/90 via-[#163300]/40 to-[#163300]/20"
            : "bg-gradient-to-t from-black/70 via-transparent to-black/30",
          hasStarted && !showControls && "opacity-0"
        )}
      />

      {!hasStarted && !hasError && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-5">
          <PlayButton onClick={() => void handlePlay()} />
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-center"
          >
            <p className="text-sm font-semibold text-white sm:text-base">
              Ver cómo funciona Remata
            </p>
            <p className="mt-1 text-xs text-white/60">
              {duration > 0 ? formatTime(duration) : "Demo"} · Recorrido de la plataforma
            </p>
          </motion.div>
        </div>
      )}

      {hasStarted && hasChapters && (
        <AnimatePresence>
          {showControls && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-4 left-4 z-20 flex items-center gap-2 rounded-full border border-white/10 bg-black/50 px-3 py-1.5 backdrop-blur-md"
            >
              {(() => {
                const Icon = CHAPTER_ICONS[chapterIndex] ?? Search;
                return <Icon className="size-3.5 text-[#9FE870]" />;
              })()}
              <span className="text-xs font-semibold text-white">
                {LANDING_DEMO_CHAPTERS[chapterIndex]?.label}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      )}

      <AnimatePresence>
        {(showControls || !hasStarted) && hasStarted && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 bottom-0 left-0 z-20 px-4 pb-4 sm:px-5 sm:pb-5"
          >
            <div
              className="group/progress relative mb-3 h-1.5 cursor-pointer rounded-full bg-white/20"
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
              {hasChapters &&
                duration > 0 &&
                LANDING_DEMO_CHAPTERS.map((ch) => (
                  <button
                    key={ch.start}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleChapterClick(ch.start);
                    }}
                    className="absolute top-1/2 z-10 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white/60 bg-[#163300] transition-transform hover:scale-150 hover:border-[#9FE870]"
                    style={{ left: `${(ch.start / duration) * 100}%` }}
                    aria-label={`Ir a ${ch.label}`}
                  />
                ))}
              <div
                className="absolute top-1/2 size-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#9FE870] opacity-0 shadow-lg ring-2 ring-white/50 transition-opacity group-hover/progress:opacity-100"
                style={{ left: `${progress}%` }}
              />
            </div>

            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/60 px-3 py-2 backdrop-blur-xl sm:px-4 sm:py-2.5">
              <button
                type="button"
                onClick={
                  isPlaying
                    ? handlePause
                    : isEnded
                      ? () => void handlePlay()
                      : () => void handlePlay()
                }
                className="flex size-9 items-center justify-center rounded-full text-white transition-colors hover:bg-white/10"
                aria-label={isPlaying ? "Pausar" : "Reproducir"}
              >
                {isPlaying ? (
                  <Pause className="size-4 fill-white" />
                ) : (
                  <Play className="ml-0.5 size-4 fill-white" />
                )}
              </button>

              <span className="min-w-[4.5rem] text-xs tabular-nums text-white/70">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>

              {hasChapters && (
                <div className="hidden flex-1 items-center justify-center gap-1 sm:flex">
                  {LANDING_DEMO_CHAPTERS.map((ch, i) => (
                    <button
                      key={ch.label}
                      type="button"
                      onClick={() => handleChapterClick(ch.start)}
                      className={cn(
                        "rounded-full px-2.5 py-1 text-[10px] font-semibold transition-colors",
                        i === chapterIndex
                          ? "bg-[#9FE870]/20 text-[#9FE870]"
                          : "text-white/40 hover:text-white/70"
                      )}
                    >
                      {ch.label}
                    </button>
                  ))}
                </div>
              )}

              <button
                type="button"
                onClick={() => setIsMuted((m) => !m)}
                className="flex size-9 items-center justify-center rounded-full text-white/70 transition-colors hover:bg-white/10 hover:text-white"
                aria-label={isMuted ? "Activar sonido" : "Silenciar"}
              >
                {isMuted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
              </button>

              <button
                type="button"
                onClick={() => void toggleFullscreen()}
                className="flex size-9 items-center justify-center rounded-full text-white/70 transition-colors hover:bg-white/10 hover:text-white"
                aria-label={isFullscreen ? "Salir de pantalla completa" : "Pantalla completa"}
              >
                {isFullscreen ? <Minimize className="size-4" /> : <Maximize className="size-4" />}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {isEnded && !hasError && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-4 bg-[#163300]/80 backdrop-blur-sm"
        >
          <p className="text-lg font-bold text-white">¡Listo para invertir!</p>
          <PlayButton onClick={() => void handlePlay()} />
          <p className="text-xs text-white/60">Reproducir de nuevo</p>
        </motion.div>
      )}
    </div>
  );
}
