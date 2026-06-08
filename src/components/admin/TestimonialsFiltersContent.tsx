"use client";

import { FilterCheckboxGroup } from "@/components/admin/FilterCheckboxGroup";
import type { PublishedFilterValue } from "@/components/admin/PropertiesFiltersContent";

export type FeaturedFilterValue = "featured" | "normal";
export type VideoFilterValue = "with_video" | "text_only";

export interface TestimonialsFilterState {
  published: PublishedFilterValue[];
  featured: FeaturedFilterValue[];
  hasVideo: VideoFilterValue[];
}

interface TestimonialsFiltersContentProps {
  filters: TestimonialsFilterState;
  onChange: (filters: TestimonialsFilterState) => void;
}

const PUBLISHED_OPTIONS: {
  value: PublishedFilterValue;
  label: string;
  description?: string;
}[] = [
  { value: "published", label: "Publicado", description: "Visible en landing" },
  { value: "draft", label: "Borrador", description: "Oculto en landing" },
];

const FEATURED_OPTIONS: {
  value: FeaturedFilterValue;
  label: string;
  description?: string;
}[] = [
  { value: "featured", label: "Destacado", description: "Prioridad en carrusel" },
  { value: "normal", label: "Normal", description: "Orden estándar" },
];

const VIDEO_OPTIONS: {
  value: VideoFilterValue;
  label: string;
  description?: string;
}[] = [
  { value: "with_video", label: "Con video", description: "Incluye testimonio en video" },
  { value: "text_only", label: "Solo texto", description: "Sin video asociado" },
];

export const defaultTestimonialsFilters: TestimonialsFilterState = {
  published: [],
  featured: [],
  hasVideo: [],
};

export function countTestimonialsActiveFilters(
  filters: TestimonialsFilterState
): number {
  let count = 0;
  if (filters.published.length > 0) count++;
  if (filters.featured.length > 0) count++;
  if (filters.hasVideo.length > 0) count++;
  return count;
}

export function matchTestimonialPublishedFilter(
  values: PublishedFilterValue[],
  published: boolean
): boolean {
  if (values.length === 0) return true;
  if (values.includes("published") && published) return true;
  if (values.includes("draft") && !published) return true;
  return false;
}

export function matchTestimonialFeaturedFilter(
  values: FeaturedFilterValue[],
  featured: boolean
): boolean {
  if (values.length === 0) return true;
  if (values.includes("featured") && featured) return true;
  if (values.includes("normal") && !featured) return true;
  return false;
}

export function matchTestimonialVideoFilter(
  values: VideoFilterValue[],
  hasVideo: boolean
): boolean {
  if (values.length === 0) return true;
  if (values.includes("with_video") && hasVideo) return true;
  if (values.includes("text_only") && !hasVideo) return true;
  return false;
}

export function TestimonialsFiltersContent({
  filters,
  onChange,
}: TestimonialsFiltersContentProps) {
  const patch = (partial: Partial<TestimonialsFilterState>) =>
    onChange({ ...filters, ...partial });

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
      <FilterCheckboxGroup
        label="Estado de publicación"
        options={PUBLISHED_OPTIONS}
        selected={filters.published}
        onChange={(published) => patch({ published })}
      />
      <FilterCheckboxGroup
        label="Destacado"
        options={FEATURED_OPTIONS}
        selected={filters.featured}
        onChange={(featured) => patch({ featured })}
      />
      <FilterCheckboxGroup
        label="Tipo de contenido"
        options={VIDEO_OPTIONS}
        selected={filters.hasVideo}
        onChange={(hasVideo) => patch({ hasVideo })}
        className="md:col-span-2"
      />
    </div>
  );
}
