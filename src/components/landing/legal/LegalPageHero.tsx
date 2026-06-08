"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ChevronRight,
  FileText,
  Shield,
  ShieldCheck,
  HelpCircle,
  BookOpen,
  type LucideIcon,
} from "lucide-react";

const badgeIcons = {
  FileText,
  Shield,
  ShieldCheck,
  HelpCircle,
  BookOpen,
} as const;

type BadgeIconName = keyof typeof badgeIcons;

interface LegalPageHeroProps {
  badge: string;
  badgeIcon: BadgeIconName;
  title: string;
  description: string;
  breadcrumbs?: { label: string; href?: string }[];
}

export function LegalPageHero({
  badge,
  badgeIcon,
  title,
  description,
  breadcrumbs = [{ label: "Inicio", href: "/" }],
}: LegalPageHeroProps) {
  const BadgeIcon: LucideIcon = badgeIcons[badgeIcon];
  return (
    <section className="relative overflow-hidden bg-[#F5F9F2] py-20 sm:py-24">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        aria-hidden
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(22,51,0,0.06) 1px, transparent 0)`,
          backgroundSize: "28px 28px",
        }}
      />
      <div className="pointer-events-none absolute -left-32 top-0 size-80 rounded-full bg-[#9FE870]/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 bottom-0 size-64 rounded-full bg-[#163300]/5 blur-3xl" />

      <div className="relative mx-auto max-w-7xl section-padding">
        {breadcrumbs.length > 0 && (
          <motion.nav
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 flex flex-wrap items-center gap-1.5 text-sm text-[#163300]/50"
            aria-label="Breadcrumb"
          >
            {breadcrumbs.map((crumb, i) => (
              <span key={crumb.label} className="flex items-center gap-1.5">
                {i > 0 && <ChevronRight className="size-3.5 shrink-0" />}
                {crumb.href ? (
                  <Link
                    href={crumb.href}
                    className="hover:text-[#163300] transition-colors"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="font-medium text-[#163300]/80">{crumb.label}</span>
                )}
              </span>
            ))}
          </motion.nav>
        )}

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="mx-auto max-w-3xl text-center"
        >
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#163300]/15 bg-[#9FE870]/20 px-4 py-1.5">
            <BadgeIcon className="size-3.5 text-[#163300]" />
            <span className="text-xs font-semibold uppercase tracking-widest text-[#163300]">
              {badge}
            </span>
          </div>
          <h1 className="text-balance text-4xl font-bold tracking-tight text-[#163300] sm:text-5xl">
            {title}
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-[#163300]/65">{description}</p>
        </motion.div>
      </div>
    </section>
  );
}
