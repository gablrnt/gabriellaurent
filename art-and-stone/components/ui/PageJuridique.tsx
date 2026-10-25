import type { ReactNode } from "react";
import { AvertissementJuridique } from "./AvertissementJuridique";
import { EnTetePage } from "./EnTetePage";

export function PageJuridique({ titre, children }: { titre: string; children: ReactNode }) {
  return (
    <>
      <EnTetePage titre={titre} surtitre="Informations légales" fil={[{ label: titre }]} />
      <section className="conteneur py-12 sm:py-16">
        <AvertissementJuridique />
        <div className="prose-pierre">{children}</div>
      </section>
    </>
  );
}
