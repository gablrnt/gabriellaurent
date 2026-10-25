import Link from "next/link";
import { FINITIONS, type Produit } from "@/data/produits";
import { ImagePierre } from "@/components/ui/ImagePierre";
import { BadgePhotoReelle } from "./Badges";
import { Prix } from "./Prix";

export function CarteProduit({ produit, titreNiveau = 3 }: { produit: Produit; titreNiveau?: 2 | 3 }) {
  const image = produit.images[0];
  const Titre = titreNiveau === 2 ? "h2" : "h3";
  const packshot = produit.categorie === "entretien";
  return (
    <article className="group relative flex flex-col">
      <div className={`relative aspect-[4/5] overflow-hidden rounded-sm ${packshot ? "bg-white" : "bg-greige/40"}`}>
        {image && (
          <ImagePierre
            src={image.url}
            alt={image.alt}
            fill
            sizes="(min-width: 1280px) 400px, (min-width: 768px) 33vw, 50vw"
            className={`transition-transform duration-700 ease-out group-hover:scale-[1.04] ${packshot ? "object-contain p-4" : ""}`}
          />
        )}
        {image?.photoReelle && <BadgePhotoReelle className="absolute top-2 left-2" />}
      </div>
      <div className="mt-3 flex flex-1 flex-col gap-1.5">
        <Titre className="font-serif text-lg leading-snug sm:text-xl">
          <Link
            href={`/produit/${produit.slug}`}
            className="after:absolute after:inset-0 after:content-[''] hover:text-terre-fonce"
          >
            {produit.nom}
          </Link>
        </Titre>
        {produit.finition && (
          <p className="text-sm text-taupe-fonce">Finition {FINITIONS[produit.finition].label.toLowerCase()}</p>
        )}
        <div className="mt-auto pt-1">
          <Prix produit={produit} />
        </div>
      </div>
    </article>
  );
}
