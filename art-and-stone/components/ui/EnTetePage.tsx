import type { ReactNode } from "react";
import { FilAriane, type Etape } from "./FilAriane";

export function EnTetePage({
  titre,
  surtitre,
  intro,
  fil,
  children,
}: {
  titre: string;
  surtitre?: string;
  intro?: ReactNode;
  fil: Etape[];
  children?: ReactNode;
}) {
  return (
    <section className="border-b border-greige/60 bg-sable">
      <div className="conteneur py-8 sm:py-12">
        <FilAriane etapes={fil} />
        {surtitre && <p className="surtitre mt-6">{surtitre}</p>}
        <h1 className={`${surtitre ? "mt-2" : "mt-6"} max-w-3xl text-4xl sm:text-5xl`}>{titre}</h1>
        {intro && <div className="mt-4 max-w-2xl text-base leading-relaxed text-anthracite/90 sm:text-lg">{intro}</div>}
        {children}
      </div>
    </section>
  );
}
