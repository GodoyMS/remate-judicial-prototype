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
  ChevronUp,
  MapPin,
  Clock,
  Users,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";

const DURATION = 36;
const FPS_TICK = 100;

const CHAPTERS = [
  { start: 0, label: "Explora", icon: Search },
  { start: 9, label: "Invierte", icon: Wallet },
  { start: 18, label: "Subasta", icon: Gavel },
  { start: 27, label: "Retornos", icon: TrendingUp },
] as const;

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

function getChapterIndex(time: number) {
  for (let i = CHAPTERS.length - 1; i >= 0; i--) {
    if (time >= CHAPTERS[i].start) return i;
  }
  return 0;
}

/* ─── Poster preview (static app mock) ─── */
function PosterPreview() {
  return (
    <div className="absolute inset-0 flex flex-col bg-[#0d1f00]">
      <div className="flex items-center gap-3 border-b border-white/10 px-5 py-3">
        <div className="size-6 rounded-lg bg-[#9FE870]" />
        <div className="h-2 w-24 rounded-full bg-white/20" />
        <div className="ml-auto flex gap-2">
          <div className="h-6 w-16 rounded-full bg-white/10" />
          <div className="size-6 rounded-full bg-white/10" />
        </div>
      </div>
      <div className="flex flex-1 gap-4 p-5">
        <div className="hidden w-36 shrink-0 flex-col gap-2 sm:flex">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className={cn(
                "h-8 rounded-lg",
                i === 1 ? "bg-[#9FE870]/30" : "bg-white/5"
              )}
            />
          ))}
        </div>
        <div className="flex flex-1 flex-col gap-3">
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
            {[
              "photo-1512917774080",
              "photo-1560518883-ce09059eeffa",
              "photo-1568605114967",
            ].map((id, i) => (
              <div
                key={id}
                className={cn(
                  "overflow-hidden rounded-xl border border-white/10",
                  i === 2 && "hidden lg:block"
                )}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`https://images.unsplash.com/${id}?w=400&h=220&fit=crop&auto=format`}
                  alt=""
                  className="h-24 w-full object-cover opacity-80 sm:h-28"
                />
                <div className="space-y-1.5 bg-white/5 p-2.5">
                  <div className="h-2 w-3/4 rounded-full bg-white/20" />
                  <div className="h-2 w-1/2 rounded-full bg-[#9FE870]/40" />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-auto flex items-center gap-3 rounded-xl border border-[#9FE870]/20 bg-[#9FE870]/10 p-3">
            <Gavel className="size-4 text-[#9FE870]" />
            <div className="flex-1">
              <div className="h-2 w-32 rounded-full bg-white/25" />
              <div className="mt-1.5 h-1.5 w-20 rounded-full bg-white/10" />
            </div>
            <div className="rounded-full bg-[#9FE870] px-3 py-1 text-[10px] font-bold text-[#163300]">
              EN VIVO
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Animated demo scenes ─── */
function DemoScene({ chapter }: { chapter: number }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={chapter}
        initial={{ opacity: 0, scale: 1.02 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.98 }}
        transition={{ duration: 0.4 }}
        className="absolute inset-0 flex flex-col bg-[#0d1f00]"
      >
        {chapter === 0 && <ExploreScene />}
        {chapter === 1 && <InvestScene />}
        {chapter === 2 && <AuctionScene />}
        {chapter === 3 && <ReturnsScene />}
      </motion.div>
    </AnimatePresence>
  );
}

function ExploreScene() {
  return (
    <>
      <div className="flex items-center gap-3 border-b border-white/10 px-5 py-3">
        <div className="flex size-7 items-center justify-center rounded-lg bg-[#9FE870] text-xs font-black text-[#163300]">
          R
        </div>
        <span className="text-sm font-semibold text-white">Propiedades</span>
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: "auto", opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="ml-2 flex items-center gap-1.5 overflow-hidden rounded-full border border-[#9FE870]/40 bg-[#9FE870]/15 px-3 py-1"
        >
          <Search className="size-3 text-[#9FE870]" />
          <span className="whitespace-nowrap text-xs text-[#9FE870]">Miraflores · Remate</span>
        </motion.div>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        {[
          { title: "Dpto. Miraflores", price: "S/ 285,000", pct: "68%", img: "photo-1512917774080" },
          { title: "Casa San Isidro", price: "S/ 420,000", pct: "45%", img: "photo-1560518883-ce09059eeffa" },
        ].map((prop, i) => (
          <motion.div
            key={prop.title}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + i * 0.25 }}
            className="flex gap-3 rounded-xl border border-white/10 bg-white/5 p-3"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`https://images.unsplash.com/${prop.img}?w=120&h=80&fit=crop&auto=format`}
              alt=""
              className="size-16 shrink-0 rounded-lg object-cover"
            />
            <div className="flex flex-1 flex-col justify-center gap-1.5">
              <p className="text-sm font-semibold text-white">{prop.title}</p>
              <div className="flex items-center gap-2 text-xs text-white/50">
                <MapPin className="size-3" />
                <span>Lima</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#9FE870]">{prop.price}</span>
                <span className="rounded-full bg-[#9FE870]/20 px-2 py-0.5 text-[10px] font-semibold text-[#9FE870]">
                  {prop.pct} financiado
                </span>
              </div>
            </div>
          </motion.div>
        ))}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-auto text-center text-xs text-white/40"
        >
          +24 propiedades verificadas disponibles
        </motion.div>
      </div>
    </>
  );
}

function InvestScene() {
  return (
    <>
      <div className="flex items-center gap-3 border-b border-white/10 px-5 py-3">
        <span className="text-sm font-semibold text-white">Invertir en subasta</span>
      </div>
      <div className="flex flex-1 flex-col items-center justify-center gap-5 p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-xs rounded-2xl border border-white/10 bg-white/5 p-5"
        >
          <p className="mb-1 text-xs text-white/50">Dpto. Miraflores · Remate #2847</p>
          <p className="text-lg font-bold text-white">¿Cuánto deseas invertir?</p>
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4, type: "spring" }}
            className="my-5 flex items-center justify-center"
          >
            <span className="text-4xl font-black text-[#9FE870]">S/ 2,500</span>
          </motion.div>
          <div className="mb-4 flex gap-2">
            {["S/ 500", "S/ 1,000", "S/ 2,500", "S/ 5,000"].map((amt, i) => (
              <motion.div
                key={amt}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                className={cn(
                  "flex-1 rounded-lg py-1.5 text-center text-[10px] font-semibold",
                  i === 2
                    ? "bg-[#9FE870] text-[#163300]"
                    : "bg-white/10 text-white/60"
                )}
              >
                {amt}
              </motion.div>
            ))}
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#9FE870] py-2.5 text-sm font-bold text-[#163300]"
          >
            <CheckCircle2 className="size-4" />
            Confirmar inversión
          </motion.div>
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="flex items-center gap-1.5 text-xs text-white/40"
        >
          <Wallet className="size-3" />
          Pago seguro · Yape, transferencia o tarjeta
        </motion.p>
      </div>
    </>
  );
}

function AuctionScene() {
  return (
    <>
      <div className="flex items-center justify-between border-b border-white/10 px-5 py-3">
        <div className="flex items-center gap-2">
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-red-500 opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-red-500" />
          </span>
          <span className="text-sm font-semibold text-white">Subasta en vivo</span>
        </div>
        <div className="flex items-center gap-1.5 rounded-full bg-red-500/20 px-2.5 py-1 text-xs font-bold text-red-400">
          <Clock className="size-3" />
          01:47:23
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-4 p-5">
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs text-white/50">Progreso de financiamiento</span>
            <span className="text-sm font-bold text-[#9FE870]">67%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-white/10">
            <motion.div
              initial={{ width: "52%" }}
              animate={{ width: "67%" }}
              transition={{ duration: 2, ease: "easeOut" }}
              className="h-full rounded-full bg-gradient-to-r from-[#9FE870] to-[#7ed44f]"
            />
          </div>
          <div className="mt-2 flex justify-between text-[10px] text-white/40">
            <span>S/ 193,950 recaudados</span>
            <span>Meta: S/ 285,000</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-xs text-white/50">
            <Users className="size-3" />
            Inversiones recientes
          </div>
          {[
            { name: "María E.", amount: "S/ 1,500", color: "bg-blue-500" },
            { name: "Carlos R.", amount: "S/ 3,000", color: "bg-emerald-500" },
            { name: "Sofía T.", amount: "S/ 800", color: "bg-purple-500" },
          ].map((inv, i) => (
            <motion.div
              key={inv.name}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.4 }}
              className="flex items-center gap-3 rounded-lg bg-white/5 px-3 py-2"
            >
              <div className={cn("flex size-7 items-center justify-center rounded-full text-[10px] font-bold text-white", inv.color)}>
                {inv.name.split(" ")[0][0]}{inv.name.split(" ")[1][0]}
              </div>
              <span className="flex-1 text-xs text-white/80">{inv.name}</span>
              <span className="flex items-center gap-0.5 text-xs font-semibold text-[#9FE870]">
                <ChevronUp className="size-3" />
                {inv.amount}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </>
  );
}

function ReturnsScene() {
  return (
    <>
      <div className="flex items-center gap-3 border-b border-white/10 px-5 py-3">
        <span className="text-sm font-semibold text-white">Mi portafolio</span>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: "spring" }}
          className="ml-auto flex items-center gap-1 rounded-full bg-[#9FE870]/20 px-2.5 py-1 text-[10px] font-bold text-[#9FE870]"
        >
          <CheckCircle2 className="size-3" />
          Subasta adjudicada
        </motion.div>
      </div>
      <div className="flex flex-1 flex-col items-center justify-center gap-5 p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-xs text-center"
        >
          <p className="mb-1 text-xs text-white/50">Retorno total</p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-4xl font-black text-[#9FE870]"
          >
            S/ 3,125
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-1 text-sm font-semibold text-white/60"
          >
            +25% sobre tu inversión
          </motion.p>
        </motion.div>

        <div className="flex h-24 w-full max-w-xs items-end gap-1.5 px-2">
          {[30, 45, 38, 55, 48, 72, 65, 85, 78, 100].map((h, i) => (
            <motion.div
              key={i}
              initial={{ height: 0 }}
              animate={{ height: `${h}%` }}
              transition={{ delay: 0.6 + i * 0.08, duration: 0.4 }}
              className="flex-1 rounded-t-sm bg-gradient-to-t from-[#9FE870]/40 to-[#9FE870]"
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="flex items-center gap-2 rounded-xl border border-[#9FE870]/30 bg-[#9FE870]/10 px-4 py-2.5"
        >
          <TrendingUp className="size-4 text-[#9FE870]" />
          <span className="text-xs font-medium text-white/80">
            Transferencia enviada a tu cuenta
          </span>
        </motion.div>
      </div>
    </>
  );
}

/* ─── Big play button ─── */
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

/* ─── Main player ─── */
export function PlatformVideoPlayer() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const chapterIndex = getChapterIndex(currentTime);
  const progress = (currentTime / DURATION) * 100;
  const isEnded = currentTime >= DURATION;

  const resetHideTimer = useCallback(() => {
    setShowControls(true);
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    if (isPlaying) {
      hideTimerRef.current = setTimeout(() => setShowControls(false), 3000);
    }
  }, [isPlaying]);

  useEffect(() => {
    if (!isPlaying || isEnded) return;
    const id = setInterval(() => {
      setCurrentTime((t) => {
        const next = t + FPS_TICK / 1000;
        if (next >= DURATION) {
          setIsPlaying(false);
          return DURATION;
        }
        return next;
      });
    }, FPS_TICK);
    return () => clearInterval(id);
  }, [isPlaying, isEnded]);

  useEffect(() => {
    const onFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  const handlePlay = () => {
    if (isEnded) setCurrentTime(0);
    setHasStarted(true);
    setIsPlaying(true);
    resetHideTimer();
  };

  const handlePause = () => {
    setIsPlaying(false);
    setShowControls(true);
  };

  const handleSeek = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    setCurrentTime(ratio * DURATION);
    resetHideTimer();
  };

  const handleChapterClick = (start: number) => {
    setCurrentTime(start);
    if (!hasStarted) {
      setHasStarted(true);
      setIsPlaying(true);
    }
    resetHideTimer();
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
      if (!hasStarted) handlePlay();
      else if (isPlaying) handlePause();
      else setIsPlaying(true);
    }
    if (e.key === "f") toggleFullscreen();
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
      {/* Content layer */}
      <div className="absolute inset-0">
        {!hasStarted ? <PosterPreview /> : <DemoScene chapter={chapterIndex} />}
      </div>

      {/* Gradient overlays */}
      <div
        className={cn(
          "pointer-events-none absolute inset-0 transition-opacity duration-500",
          !hasStarted
            ? "bg-gradient-to-t from-[#163300]/90 via-[#163300]/40 to-[#163300]/20"
            : "bg-gradient-to-t from-black/70 via-transparent to-black/30",
          hasStarted && !showControls && "opacity-0"
        )}
      />

      {/* Idle state: play CTA */}
      {!hasStarted && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-5">
          <PlayButton onClick={handlePlay} />
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
              {formatTime(DURATION)} · Demo interactiva de la plataforma
            </p>
          </motion.div>
        </div>
      )}

      {/* Chapter pill (top) */}
      {hasStarted && (
        <AnimatePresence>
          {showControls && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-4 left-4 z-20 flex items-center gap-2 rounded-full border border-white/10 bg-black/50 px-3 py-1.5 backdrop-blur-md"
            >
              {(() => {
                const Icon = CHAPTERS[chapterIndex].icon;
                return <Icon className="size-3.5 text-[#9FE870]" />;
              })()}
              <span className="text-xs font-semibold text-white">
                {CHAPTERS[chapterIndex].label}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* Custom controls */}
      <AnimatePresence>
        {(showControls || !hasStarted) && hasStarted && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 bottom-0 left-0 z-20 px-4 pb-4 sm:px-5 sm:pb-5"
          >
            {/* Progress bar with chapter markers */}
            <div
              className="group/progress relative mb-3 h-1.5 cursor-pointer rounded-full bg-white/20"
              onClick={handleSeek}
              role="slider"
              aria-valuemin={0}
              aria-valuemax={DURATION}
              aria-valuenow={currentTime}
              aria-label="Progreso del video"
            >
              <div
                className="absolute inset-y-0 left-0 rounded-full bg-[#9FE870]"
                style={{ width: `${progress}%` }}
              />
              {CHAPTERS.map((ch) => (
                <button
                  key={ch.start}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleChapterClick(ch.start);
                  }}
                  className="absolute top-1/2 z-10 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white/60 bg-[#163300] transition-transform hover:scale-150 hover:border-[#9FE870]"
                  style={{ left: `${(ch.start / DURATION) * 100}%` }}
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
                onClick={isPlaying ? handlePause : isEnded ? handlePlay : () => setIsPlaying(true)}
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
                {formatTime(currentTime)} / {formatTime(DURATION)}
              </span>

              <div className="hidden flex-1 items-center justify-center gap-1 sm:flex">
                {CHAPTERS.map((ch, i) => (
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
                onClick={toggleFullscreen}
                className="flex size-9 items-center justify-center rounded-full text-white/70 transition-colors hover:bg-white/10 hover:text-white"
                aria-label={isFullscreen ? "Salir de pantalla completa" : "Pantalla completa"}
              >
                {isFullscreen ? <Minimize className="size-4" /> : <Maximize className="size-4" />}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Replay overlay when ended */}
      {isEnded && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-4 bg-[#163300]/80 backdrop-blur-sm"
        >
          <p className="text-lg font-bold text-white">¡Listo para invertir!</p>
          <PlayButton
            onClick={() => {
              setCurrentTime(0);
              setIsPlaying(true);
            }}
          />
          <p className="text-xs text-white/60">Reproducir de nuevo</p>
        </motion.div>
      )}
    </div>
  );
}
