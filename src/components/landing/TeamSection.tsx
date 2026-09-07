"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Users } from "lucide-react";
import { BRAND_NAME } from "@/lib/brand";
import { cn } from "@/lib/utils";

export type TeamMember = {
  name: string;
  area: string;
  summary: string;
  linkedin: string;
  initials: string;
  profileLabel?: string;
};

const MAX_MEMBERS = 3;

function TeamMemberCard({
  member,
  index,
  reduceMotion,
}: {
  member: TeamMember;
  index: number;
  reduceMotion: boolean | null;
}) {
  return (
    <motion.li
      initial={reduceMotion ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: reduceMotion ? 0 : index * 0.07 }}
      className={cn(
        "group flex h-full gap-4 rounded-2xl border border-border/70 bg-card p-5 shadow-sm",
        "transition-all duration-300 hover:border-primary/25 hover:shadow-md"
      )}
    >
      <span
        className="flex size-14 shrink-0 items-center justify-center rounded-full bg-primary/8 text-base font-bold text-primary ring-1 ring-primary/15"
        aria-hidden
      >
        {member.initials}
      </span>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold uppercase tracking-wide text-foreground">
          {member.name}
        </p>
        <p className="mt-1 text-sm font-medium text-foreground/90">
          {member.area}
        </p>
        <p className="mt-2 line-clamp-2 text-sm leading-snug text-muted-foreground">
          {member.summary}
        </p>
        <a
          href={member.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
          aria-label={`${member.profileLabel ?? "Ver perfil profesional"} de ${member.name}`}
        >
          {member.profileLabel ?? "Ver perfil profesional"}
          <ArrowUpRight className="size-3.5 shrink-0" aria-hidden />
        </a>
      </div>
    </motion.li>
  );
}

export function TeamSection({ members }: { members: TeamMember[] }) {
  const reduceMotion = useReducedMotion();
  const visibleMembers = members.slice(0, MAX_MEMBERS);

  return (
    <section
      id="equipo"
      data-nav-tone="light"
      className="relative overflow-hidden bg-muted/45 py-16 sm:py-20 lg:py-24"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-50"
        aria-hidden
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, color-mix(in oklch, var(--primary) 6%, transparent) 1px, transparent 0)`,
          backgroundSize: "28px 28px",
        }}
      />

      <div className="relative mx-auto max-w-6xl section-padding">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className="mx-auto flex max-w-2xl flex-col items-center text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-4 py-1.5">
            <Users className="size-3.5 text-primary" strokeWidth={2.25} />
            <span className="type-label text-primary">Nuestro equipo</span>
          </span>
          <h2 className="type-h2 mt-5 text-balance text-foreground">
            Quién está detrás de {BRAND_NAME}
          </h2>
          <p className="mt-4 type-lead text-pretty text-muted-foreground">
            Conoce a las personas responsables de analizar, estructurar y
            gestionar cada oportunidad.
          </p>
        </motion.div>

        <ul className="mt-12 grid gap-4 sm:mt-14 lg:grid-cols-3 lg:gap-5">
          {visibleMembers.map((member, index) => (
            <TeamMemberCard
              key={member.name}
              member={member}
              index={index}
              reduceMotion={reduceMotion}
            />
          ))}
        </ul>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="mt-10 flex flex-col items-center gap-4 text-center sm:mt-12"
        >
          <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
            También participan especialistas de cumplimiento, riesgos, atención
            al inversionista y tecnología.
          </p>
          <Link
            href="/contacto"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-primary hover:underline"
          >
            Conoce todas las áreas y responsables
            <ArrowUpRight className="size-4" aria-hidden />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
