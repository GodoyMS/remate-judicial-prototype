import Link from "next/link";
import { Gavel } from "lucide-react";

const columns = [
  {
    title: "Plataforma",
    links: [
      { label: "Cómo funciona", href: "#como-funciona" },
      { label: "Propiedades", href: "#propiedades" },
      { label: "Invertir", href: "/register" },
      { label: "Tarifas", href: "#" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Términos de uso", href: "/terminos-de-uso" },
      { label: "Política de privacidad", href: "/politica-de-privacidad" },
      { label: "Cumplimiento regulatorio", href: "/cumplimiento-regulatorio" },
      { label: "Libro de reclamaciones", href: "/libro-de-reclamaciones" },
    ],
  },
  {
    title: "Soporte",
    links: [
      { label: "Preguntas frecuentes", href: "/preguntas-frecuentes" },
      { label: "Libro de reclamaciones", href: "/libro-de-reclamaciones" },
      { label: "Contacto", href: "mailto:soporte@remata.pe" },
      { label: "Cumplimiento AML & KYC", href: "/cumplimiento-regulatorio" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="bg-foreground text-background">
      <div className="mx-auto max-w-7xl section-padding py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex size-8 items-center justify-center rounded-lg bg-accent">
                <Gavel className="size-4 text-accent-foreground" />
              </div>
              <span className="text-lg font-bold tracking-tight text-background">
                remata
              </span>
            </Link>
            <p className="text-sm text-background/60 leading-relaxed max-w-xs">
              La plataforma líder de inversión en remates judiciales inmobiliarios en Perú.
              Supervisada y regulada.
            </p>
            <div className="flex items-center gap-2 mt-2">
              <div className="size-2 rounded-full bg-accent animate-pulse" />
              <span className="text-xs text-background/50">Regulado por la SBS • Lima, Perú</span>
            </div>
          </div>

          {/* Columns */}
          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-xs font-semibold uppercase tracking-widest text-background/40 mb-5">
                {col.title}
              </h4>
              <ul className="flex flex-col gap-3">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-sm text-background/70 hover:text-background transition-colors"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 pt-8 border-t border-background/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-background/40">
            © {new Date().getFullYear()} Remata S.A.C. Todos los derechos reservados.
          </p>
          <p className="text-xs text-background/40">
            Las inversiones en remates judiciales conllevan riesgos. Lea nuestra política de riesgos.
          </p>
        </div>
      </div>
    </footer>
  );
}
