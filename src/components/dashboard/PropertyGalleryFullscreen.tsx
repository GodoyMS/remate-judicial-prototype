"use client";

import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PropertyGalleryFullscreenProps {
  images: string[];
  initialIndex?: number;
  open: boolean;
  onClose: () => void;
  propertyName: string;
}

export function PropertyGalleryFullscreen({
  images,
  initialIndex = 0,
  open,
  onClose,
  propertyName,
}: PropertyGalleryFullscreenProps) {
  const [current, setCurrent] = useState(initialIndex);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (open) setCurrent(initialIndex);
  }, [open, initialIndex]);

  const goPrev = useCallback(() => {
    setCurrent((i) => (i === 0 ? images.length - 1 : i - 1));
  }, [images.length]);

  const goNext = useCallback(() => {
    setCurrent((i) => (i === images.length - 1 ? 0 : i + 1));
  }, [images.length]);

  useEffect(() => {
    if (!open) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKey);
    };
  }, [open, onClose, goPrev, goNext]);

  if (!mounted || !open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex flex-col bg-black/95 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={`Galería de ${propertyName}`}
    >
      <div className="flex items-center justify-between px-4 py-3 shrink-0">
        <div className="min-w-0">
          <p className="text-white/60 text-xs truncate">{propertyName}</p>
          <p className="text-white text-sm font-medium">
            {current + 1} / {images.length}
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="rounded-full text-white hover:bg-white/10 shrink-0"
        >
          <X className="size-5" />
        </Button>
      </div>

      <div className="flex-1 relative flex items-center justify-center min-h-0 px-2 sm:px-12">
        <Button
          variant="ghost"
          size="icon"
          onClick={goPrev}
          className="absolute left-2 sm:left-4 z-10 rounded-full size-10 sm:size-12 text-white hover:bg-white/10 bg-black/30"
        >
          <ChevronLeft className="size-6" />
        </Button>

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={images[current]}
          alt={`${propertyName} — foto ${current + 1}`}
          className="max-h-[calc(100vh-180px)] max-w-full object-contain select-none"
          draggable={false}
        />

        <Button
          variant="ghost"
          size="icon"
          onClick={goNext}
          className="absolute right-2 sm:right-4 z-10 rounded-full size-10 sm:size-12 text-white hover:bg-white/10 bg-black/30"
        >
          <ChevronRight className="size-6" />
        </Button>
      </div>

      <div className="shrink-0 px-4 py-4 overflow-x-auto">
        <div className="flex gap-2 justify-center min-w-min mx-auto">
          {images.map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setCurrent(i)}
              className={cn(
                "shrink-0 size-14 sm:size-16 rounded-lg overflow-hidden border-2 transition-all",
                i === current ? "border-primary ring-2 ring-primary/40 scale-105" : "border-white/20 opacity-60 hover:opacity-100"
              )}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img} alt="" className="size-full object-cover" />
            </button>
          ))}
        </div>
      </div>

      <div
        className="absolute inset-0 -z-10 sm:hidden"
        onClick={onClose}
        aria-hidden
      />
    </div>,
    document.body
  );
}
