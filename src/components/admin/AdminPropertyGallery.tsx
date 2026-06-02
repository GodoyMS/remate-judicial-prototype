"use client";

import { useCallback, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Images, Maximize2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PropertyGalleryFullscreen } from "@/components/dashboard/PropertyGalleryFullscreen";
import { cn } from "@/lib/utils";

interface AdminPropertyGalleryProps {
  images: string[];
  title: string;
  overlay?: React.ReactNode;
}

export function AdminPropertyGallery({
  images,
  title,
  overlay,
}: AdminPropertyGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);

  const hasMultiple = images.length > 1;
  const extraCount = Math.max(0, images.length - 4);

  const goPrev = useCallback(() => {
    setActiveIndex((i) => (i === 0 ? images.length - 1 : i - 1));
  }, [images.length]);

  const goNext = useCallback(() => {
    setActiveIndex((i) => (i === images.length - 1 ? 0 : i + 1));
  }, [images.length]);

  const openGallery = (index: number) => {
    setGalleryIndex(index);
    setGalleryOpen(true);
  };

  if (images.length === 0) {
    return (
      <div className="relative aspect-[4/3] bg-muted/40 flex flex-col items-center justify-center gap-2">
        <Images className="size-8 text-muted-foreground/40" />
        <p className="text-xs text-muted-foreground">Sin imágenes</p>
      </div>
    );
  }

  return (
    <>
      <div className="relative">
        <div
          className="relative aspect-[4/3] overflow-hidden cursor-pointer group"
          onClick={() => openGallery(activeIndex)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") openGallery(activeIndex);
          }}
          aria-label={`Ver galería de ${title}`}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, scale: 1.02 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="absolute inset-0"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={images[activeIndex]}
                alt={`${title} — foto ${activeIndex + 1}`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              />
            </motion.div>
          </AnimatePresence>

          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-transparent pointer-events-none" />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors pointer-events-none" />

          <div className="absolute top-3 left-3 right-3 flex items-start justify-between gap-2 z-10 pointer-events-none">
            <Badge className="bg-black/50 text-white border-0 backdrop-blur-sm text-[10px] gap-1">
              <Images className="size-3" />
              {images.length} {images.length === 1 ? "foto" : "fotos"}
            </Badge>
            <Badge
              variant="secondary"
              className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] gap-1 shadow-md pointer-events-none"
            >
              <Maximize2 className="size-3" />
              Ampliar
            </Badge>
          </div>

          {hasMultiple && (
            <>
              <Button
                type="button"
                variant="secondary"
                size="icon-sm"
                className="absolute left-2 top-1/2 -translate-y-1/2 z-10 rounded-full size-8 bg-white/90 hover:bg-white shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation();
                  goPrev();
                }}
                aria-label="Foto anterior"
              >
                <ChevronLeft className="size-4" />
              </Button>
              <Button
                type="button"
                variant="secondary"
                size="icon-sm"
                className="absolute right-2 top-1/2 -translate-y-1/2 z-10 rounded-full size-8 bg-white/90 hover:bg-white shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation();
                  goNext();
                }}
                aria-label="Foto siguiente"
              >
                <ChevronRight className="size-4" />
              </Button>

              <div className="absolute bottom-14 left-0 right-0 flex justify-center gap-1.5 z-10 pointer-events-none">
                {images.map((_, i) => (
                  <span
                    key={i}
                    className={cn(
                      "h-1.5 rounded-full transition-all duration-300",
                      i === activeIndex
                        ? "w-5 bg-white"
                        : "w-1.5 bg-white/50"
                    )}
                  />
                ))}
              </div>
            </>
          )}

          {overlay && (
            <div className="absolute bottom-3 left-3 right-3 z-10 pointer-events-none">
              {overlay}
            </div>
          )}
        </div>

        {images.length > 1 && (
          <div className="grid grid-cols-4 gap-1.5 p-2 bg-muted/20 border-t border-border/40">
            {images.slice(0, 4).map((img, i) => {
              const isLastVisible = i === 3 && extraCount > 0;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    if (isLastVisible) openGallery(3);
                    else {
                      setActiveIndex(i);
                    }
                  }}
                  className={cn(
                    "relative aspect-[4/3] rounded-lg overflow-hidden ring-2 transition-all",
                    activeIndex === i && !isLastVisible
                      ? "ring-primary scale-[0.98]"
                      : "ring-transparent hover:ring-border/80 opacity-80 hover:opacity-100"
                  )}
                  aria-label={
                    isLastVisible
                      ? `Ver ${extraCount} fotos más`
                      : `Ver foto ${i + 1}`
                  }
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img} alt="" className="w-full h-full object-cover" />
                  {isLastVisible && (
                    <div className="absolute inset-0 bg-black/55 flex items-center justify-center">
                      <span className="text-white text-xs font-semibold">
                        +{extraCount}
                      </span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      <PropertyGalleryFullscreen
        images={images}
        initialIndex={galleryIndex}
        open={galleryOpen}
        onClose={() => setGalleryOpen(false)}
        propertyName={title}
      />
    </>
  );
}
