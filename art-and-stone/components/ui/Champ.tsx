import { useId, type ComponentProps, type ReactNode } from "react";

const CLASSE =
  "block w-full rounded-sm border bg-blanc px-3.5 py-3 text-base text-anthracite placeholder:text-taupe-fonce/70 focus:border-anthracite";

type Commun = { label: string; erreur?: string; aide?: ReactNode; facultatif?: boolean };

function Libelle({ id, label, facultatif }: { id: string; label: string; facultatif?: boolean }) {
  return (
    <label htmlFor={id} className="mb-1.5 block text-sm font-medium">
      {label}
      {facultatif && <span className="font-normal text-taupe-fonce"> (facultatif)</span>}
    </label>
  );
}

function Messages({
  idAide,
  idErreur,
  aide,
  erreur,
}: {
  idAide: string;
  idErreur: string;
  aide?: ReactNode;
  erreur?: string;
}) {
  return (
    <>
      {aide && (
        <p id={idAide} className="mt-1.5 text-sm text-taupe-fonce">
          {aide}
        </p>
      )}
      {erreur && (
        <p id={idErreur} className="mt-1.5 text-sm font-medium text-erreur">
          {erreur}
        </p>
      )}
    </>
  );
}

function decrit(idAide: string, idErreur: string, aide?: ReactNode, erreur?: string) {
  return [aide ? idAide : null, erreur ? idErreur : null].filter(Boolean).join(" ") || undefined;
}

export function Champ({ label, erreur, aide, facultatif, className = "", ...props }: Commun & ComponentProps<"input">) {
  const id = useId();
  const idAide = `${id}-aide`;
  const idErreur = `${id}-erreur`;
  return (
    <div className={className}>
      <Libelle id={id} label={label} facultatif={facultatif} />
      <input
        id={id}
        aria-invalid={erreur ? true : undefined}
        aria-describedby={decrit(idAide, idErreur, aide, erreur)}
        required={!facultatif}
        className={`${CLASSE} ${erreur ? "border-erreur" : "border-taupe"}`}
        {...props}
      />
      <Messages idAide={idAide} idErreur={idErreur} aide={aide} erreur={erreur} />
    </div>
  );
}

export function ChampTexte({
  label,
  erreur,
  aide,
  facultatif,
  className = "",
  ...props
}: Commun & ComponentProps<"textarea">) {
  const id = useId();
  const idAide = `${id}-aide`;
  const idErreur = `${id}-erreur`;
  return (
    <div className={className}>
      <Libelle id={id} label={label} facultatif={facultatif} />
      <textarea
        id={id}
        aria-invalid={erreur ? true : undefined}
        aria-describedby={decrit(idAide, idErreur, aide, erreur)}
        required={!facultatif}
        className={`${CLASSE} min-h-32 ${erreur ? "border-erreur" : "border-taupe"}`}
        {...props}
      />
      <Messages idAide={idAide} idErreur={idErreur} aide={aide} erreur={erreur} />
    </div>
  );
}

export function ChampListe({
  label,
  erreur,
  aide,
  facultatif,
  className = "",
  children,
  ...props
}: Commun & ComponentProps<"select">) {
  const id = useId();
  const idAide = `${id}-aide`;
  const idErreur = `${id}-erreur`;
  return (
    <div className={className}>
      <Libelle id={id} label={label} facultatif={facultatif} />
      <select
        id={id}
        aria-invalid={erreur ? true : undefined}
        aria-describedby={decrit(idAide, idErreur, aide, erreur)}
        required={!facultatif}
        className={`${CLASSE} appearance-auto ${erreur ? "border-erreur" : "border-taupe"}`}
        {...props}
      >
        {children}
      </select>
      <Messages idAide={idAide} idErreur={idErreur} aide={aide} erreur={erreur} />
    </div>
  );
}

/** Champ piège anti-robots, invisible pour les humains et les lecteurs d'écran */
export function ChampPiege({ valeur, onChange }: { valeur: string; onChange: (v: string) => void }) {
  return (
    <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
      <label>
        Ne pas remplir ce champ
        <input type="text" tabIndex={-1} autoComplete="off" value={valeur} onChange={(e) => onChange(e.target.value)} />
      </label>
    </div>
  );
}
