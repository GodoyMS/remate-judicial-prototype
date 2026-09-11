import type { TeamMember } from "@/components/landing/TeamSection";
import { LANDING_PHOTOS } from "@/lib/landing/media";

/** Leadership shown on /nosotros — max three profiles. */
export const teamMembers: TeamMember[] = [
  {
    name: "Mariana Solís Ugarte",
    area: "Dirección general",
    summary:
      "12+ años en inversión inmobiliaria y estructuración de proyectos en Perú.",
    linkedin: "https://www.linkedin.com/company/rematto/",
    initials: "MS",
    photo: LANDING_PHOTOS.teamMariana,
    profileLabel: "Ver perfil en LinkedIn",
  },
  {
    name: "Diego Arrieta Peña",
    area: "Área legal e inmobiliaria",
    summary:
      "15 años en litigio civil y procesos de remate en juzgados de Lima y Callao.",
    linkedin: "https://www.linkedin.com/company/rematto/",
    initials: "DA",
    photo: LANDING_PHOTOS.teamDiego,
    profileLabel: "Ver perfil en LinkedIn",
  },
  {
    name: "Renzo Camargo Ley",
    area: "Operaciones y gestión de inmuebles",
    summary:
      "11 años en productos financieros digitales, cumplimiento y operaciones.",
    linkedin: "https://www.linkedin.com/company/rematto/",
    initials: "RC",
    photo: LANDING_PHOTOS.teamRenzo,
    profileLabel: "Ver perfil en LinkedIn",
  },
];
