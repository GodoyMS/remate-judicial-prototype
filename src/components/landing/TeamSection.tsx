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
  photo?: string;
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
        "group grid overflow-hidden rounded-3xl border border-border/70 bg-card shadow-sm sm:grid-cols-[minmax(0,0.42fr)_minmax(0,1fr)]",
        "transition-all duration-300 hover:border-primary/25 hover:shadow-md"
      )}
    >
      <div className="relative min-h-56 overflow-hidden bg-muted sm:min-h-full">
        {member.photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={member.photo}
            alt={`Retrato de ${member.name}`}
            className="absolute inset-0 size-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <span
            className="absolute inset-0 flex items-center justify-center text-3xl font-bold text-primary"
            aria-hidden
          >
            {member.initials}
          </span>
        )}
      </div>

      <div className="flex flex-col justify-center p-5 sm:p-6">
        <p className="text-lg font-bold tracking-tight text-foreground">
          {member.name}
        </p>
        <p className="mt-1 text-sm font-medium text-primary">{member.area}</p>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          {member.summary}
        </p>
        <a
          href={member.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex w-fit items-center gap-1 text-sm font-semibold text-primary hover:underline"
          aria-label={`${member.profileLabel ?? "Ver perfil profesional"} de ${member.name}`}
        >
          {member.profileLabel ?? "LinkedIn"}
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
      className="relative overflow-hidden bg-background py-16 sm:py-20 lg:py-24"
    >
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

        <ul className="mt-12 grid gap-4 sm:mt-14">
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
