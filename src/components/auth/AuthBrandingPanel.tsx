import Link from "next/link";
import { CheckCircle2, Gavel } from "lucide-react";

const benefits = [
  "Inversión desde S/ 500",
  "Retornos de hasta 22% anual",
  "Propiedades verificadas legalmente",
  "Sin comisiones de apertura",
];

export function AuthBrandingPanel() {
  return (
    <div className="hidden lg:flex flex-col justify-between w-[44%] bg-secondary p-12 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -right-20 size-[400px] rounded-full bg-accent/20 blur-3xl" />
        <div className="absolute -bottom-40 -left-20 size-[300px] rounded-full bg-white/5 blur-3xl" />
      </div>

      <Link href="/" className="relative flex items-center gap-2.5">
        <div className="size-9 rounded-lg bg-accent flex items-center justify-center">
          <Gavel className="size-4 text-accent-foreground" />
        </div>
        <span className="text-xl font-bold tracking-tight text-primary">remata</span>
      </Link>

      <div className="relative flex flex-col gap-8">
        <div>
          <h2 className="text-4xl font-bold text-secondary-foreground leading-tight mb-4">
            Invierte en el
            <br />
            sector inmobiliario
            <br />
            como los expertos.
          </h2>
          <p className="text-muted leading-relaxed">
            Accede a subastas judiciales que antes solo estaban disponibles
            para grandes inversores.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {benefits.map((b) => (
            <div key={b} className="flex items-center gap-3">
              <div className="size-5 rounded-full bg-accent/20 flex items-center justify-center shrink-0">
                <CheckCircle2 className="size-3.5 text-accent" />
              </div>
              <span className="text-sm text-muted">{b}</span>
            </div>
          ))}
        </div>

        <div className="rounded-2xl bg-white/10 backdrop-blur-sm p-5 border border-white/10">
          <p className="text-sm text-muted/70 leading-relaxed mb-4">
            &ldquo;Remata me permitió diversificar mi portafolio con propiedades reales.
            Mi primera inversión de S/ 2,000 generó S/ 420 en 4 meses.&rdquo;
          </p>
          <div className="flex items-center gap-3">
            <div className="size-8 rounded-full bg-accent flex items-center justify-center text-xs font-bold text-accent-foreground">
              JM
            </div>
            <div>
              <p className="text-xs font-semibold text-secondary-foreground">Jorge Mendoza</p>
              <p className="text-xs text-muted">Inversor desde 2024</p>
            </div>
          </div>
        </div>
      </div>

      <p className="relative text-xs text-muted/70">
        © {new Date().getFullYear()} Remata S.A.C. Regulado por la SBS.
      </p>
    </div>
  );
}
