"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { ImageProduit } from "@/data/produits";
import { Icone } from "@/components/ui/Icone";
import { BadgePhotoReelle } from "./Badges";

const ZOOM_SURVOL = 2;
const ZOOM_MAX = 4;

function MentionIA() {
  return (
    <p className="mt-2 flex items-center gap-1.5 text-xs text-taupe-fonce">
      <Icone nom="info" className="size-4" />
      Visuel d&apos;ambiance généré par IA, non contractuel
    </p>
  );
}

type Vue = { echelle: number; x: number; y: number };
const VUE_INITIALE: Vue = { echelle: 1, x: 0, y: 0 };

/**
 * Image plein écran avec zoom :
 * pincement à deux doigts et double-tap sur mobile, molette ou clic sur ordinateur,
 * glisser pour se déplacer dans l'image zoomée.
 */
function ImageZoomable({ image }: { image: ImageProduit }) {
  const [vue, setVue] = useState<Vue>(VUE_INITIALE);
  const zoneRef = useRef<HTMLDivElement>(null);
  const pointeurs = useRef(new Map<number, { x: number; y: number }>());
  const geste = useRef<{ distance: number; echelle: number; x: number; y: number; mx: number; my: number } | null>(
    null,
  );
  const dernierTap = useRef(0);
  const aBouge = useRef(false);

  function borner(v: Vue): Vue {
    const zone = zoneRef.current;
    if (!zone || v.echelle <= 1) return VUE_INITIALE;
    const maxX = ((v.echelle - 1) * zone.clientWidth) / 2;
    const maxY = ((v.echelle - 1) * zone.clientHeight) / 2;
    return {
      echelle: Math.min(ZOOM_MAX, v.echelle),
      x: Math.max(-maxX, Math.min(maxX, v.x)),
      y: Math.max(-maxY, Math.min(maxY, v.y)),
    };
  }

  function debutGeste() {
    const pts = [...pointeurs.current.values()];
    if (pts.length === 2) {
      geste.current = {
        distance: Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y),
        echelle: vue.echelle,
        x: vue.x,
        y: vue.y,
        mx: (pts[0].x + pts[1].x) / 2,
        my: (pts[0].y + pts[1].y) / 2,
      };
    } else if (pts.length === 1) {
      geste.current = { distance: 0, echelle: vue.echelle, x: vue.x, y: vue.y, mx: pts[0].x, my: pts[0].y };
    }
  }

  // Zoom à la molette (ordinateur) : écouteur non passif pour bloquer le défilement.
  useEffect(() => {
    const zone = zoneRef.current;
    if (!zone) return;
    const surMolette = (e: WheelEvent) => {
      e.preventDefault();
      setVue((v) => {
        const echelle = Math.max(1, Math.min(ZOOM_MAX, v.echelle * (e.deltaY < 0 ? 1.15 : 1 / 1.15)));
        const maxX = ((echelle - 1) * zone.clientWidth) / 2;
        const maxY = ((echelle - 1) * zone.clientHeight) / 2;
        return echelle <= 1
          ? VUE_INITIALE
          : { echelle, x: Math.max(-maxX, Math.min(maxX, v.x)), y: Math.max(-maxY, Math.min(maxY, v.y)) };
      });
    };
    zone.addEventListener("wheel", surMolette, { passive: false });
    return () => zone.removeEventListener("wheel", surMolette);
  }, []);

  return (
    <div
      ref={zoneRef}
      className={`relative h-full w-full touch-none overflow-hidden select-none ${vue.echelle > 1 ? "cursor-grab active:cursor-grabbing" : "cursor-zoom-in"}`}
      onPointerDown={(e) => {
        e.currentTarget.setPointerCapture(e.pointerId);
        pointeurs.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
        aBouge.current = false;
        debutGeste();
      }}
      onPointerMove={(e) => {
        if (!pointeurs.current.has(e.pointerId) || !geste.current) return;
        pointeurs.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
        const pts = [...pointeurs.current.values()];
        const g = geste.current;
        if (pts.length === 2 && g.distance > 0) {
          aBouge.current = true;
          const distance = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
          const mx = (pts[0].x + pts[1].x) / 2;
          const my = (pts[0].y + pts[1].y) / 2;
          setVue(borner({ echelle: Math.max(1, g.echelle * (distance / g.distance)), x: g.x + mx - g.mx, y: g.y + my - g.my }));
        } else if (pts.length === 1 && vue.echelle > 1) {
          const dx = pts[0].x - g.mx;
          const dy = pts[0].y - g.my;
          if (Math.abs(dx) + Math.abs(dy) > 4) aBouge.current = true;
          setVue(borner({ echelle: vue.echelle, x: g.x + dx, y: g.y + dy }));
        }
      }}
      onPointerUp={(e) => {
        pointeurs.current.delete(e.pointerId);
        if (pointeurs.current.size > 0) {
          debutGeste();
          return;
        }
        geste.current = null;
        if (aBouge.current) return;
        // Tap / clic sans glisser : double-tap sur mobile, simple clic à la souris.
        const maintenant = e.timeStamp;
        const doubleTap = e.pointerType !== "mouse" && maintenant - dernierTap.current < 300;
        dernierTap.current = maintenant;
        if (e.pointerType === "mouse" || doubleTap) {
          if (vue.echelle > 1) {
            setVue(VUE_INITIALE);
          } else {
            const zone = zoneRef.current;
            if (!zone) return;
            const r = zone.getBoundingClientRect();
            const echelle = 2.5;
            setVue(
              borner({
                echelle,
                x: (r.width / 2 - (e.clientX - r.left)) * (echelle - 1),
                y: (r.height / 2 - (e.clientY - r.top)) * (echelle - 1),
              }),
            );
          }
        }
      }}
      onPointerCancel={(e) => {
        pointeurs.current.delete(e.pointerId);
        geste.current = null;
      }}
    >
      <div
        className="absolute inset-0 transition-transform duration-150 ease-out"
        style={{ transform: `translate3d(${vue.x}px, ${vue.y}px, 0) scale(${vue.echelle})` }}
      >
        <Image src={image.url} alt={image.alt} fill sizes="100vw" className="object-contain" draggable={false} />
      </div>
    </div>
  );
}

export function GalerieProduit({ images, nom }: { images: ImageProduit[]; nom: string }) {
  const [index, setIndex] = useState(0);
  const [pleinEcran, setPleinEcran] = useState(false);
  const [origineZoom, setOrigineZoom] = useState<string | null>(null);
  const dialogueRef = useRef<HTMLDialogElement>(null);
  const image = images[index];

  useEffect(() => {
    const dialogue = dialogueRef.current;
    if (!dialogue) return;
    if (pleinEcran && !dialogue.open) dialogue.showModal();
    if (!pleinEcran && dialogue.open) dialogue.close();
    document.body.style.overflow = pleinEcran ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [pleinEcran]);

  if (!image) {
    return <div className="aspect-[4/3] rounded-sm bg-greige/40" aria-hidden="true" />;
  }

  const plusieurs = images.length > 1;
  const precedente = () => setIndex((i) => (i - 1 + images.length) % images.length);
  const suivante = () => setIndex((i) => (i + 1) % images.length);

  return (
    <div>
      <div className="relative">
        <button
          type="button"
          className="group relative block aspect-[4/3] w-full cursor-zoom-in overflow-hidden rounded-sm bg-greige/40"
          aria-label={`Agrandir la photo : ${image.alt}`}
          onClick={() => setPleinEcran(true)}
          onPointerMove={(e) => {
            if (e.pointerType !== "mouse") return;
            const r = e.currentTarget.getBoundingClientRect();
            setOrigineZoom(`${((e.clientX - r.left) / r.width) * 100}% ${((e.clientY - r.top) / r.height) * 100}%`);
          }}
          onPointerLeave={() => setOrigineZoom(null)}
        >
          <Image
            src={image.url}
            alt=""
            fill
            preload={index === 0}
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover transition-transform duration-200 ease-out"
            style={
              origineZoom ? { transform: `scale(${ZOOM_SURVOL})`, transformOrigin: origineZoom } : undefined
            }
          />
          <span className="absolute right-3 bottom-3 inline-flex items-center gap-1.5 rounded-full bg-creme/90 px-3 py-1.5 text-xs font-medium text-anthracite shadow-sm">
            <Icone nom="agrandir" className="size-4" />
            <span className="hidden sm:inline">Survolez pour zoomer · cliquez pour agrandir</span>
            <span className="sm:hidden">Toucher pour agrandir</span>
          </span>
        </button>
        {image.photoReelle && <BadgePhotoReelle className="pointer-events-none absolute top-3 left-3" />}
      </div>
      {image.generationIA && <MentionIA />}

      {plusieurs && (
        <ul className="mt-3 flex gap-2 overflow-x-auto pb-1" aria-label={`Photos de ${nom}`}>
          {images.map((img, i) => (
            <li key={img.url} className="shrink-0">
              <button
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Voir la photo ${i + 1} : ${img.alt}`}
                aria-current={i === index ? "true" : undefined}
                className={`relative block size-20 overflow-hidden rounded-sm border-2 ${i === index ? "border-anthracite" : "border-transparent opacity-80 hover:opacity-100"}`}
              >
                <Image src={img.url} alt="" fill sizes="80px" className="bg-greige/40 object-cover" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <dialog
        ref={dialogueRef}
        aria-label={`Photo agrandie : ${image.alt}`}
        onClose={() => setPleinEcran(false)}
        onKeyDown={(e) => {
          if (!plusieurs) return;
          if (e.key === "ArrowLeft") precedente();
          if (e.key === "ArrowRight") suivante();
        }}
        className="fixed inset-0 m-0 h-dvh max-h-none w-full max-w-none bg-anthracite p-0 text-creme backdrop:bg-anthracite"
      >
        {pleinEcran && (
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between gap-4 px-4 py-3">
              <p className="truncate text-sm">
                {nom}
                {plusieurs && (
                  <span className="text-creme/70">
                    {" "}
                    — {index + 1}/{images.length}
                  </span>
                )}
              </p>
              <button
                type="button"
                onClick={() => setPleinEcran(false)}
                className="inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-creme/10 hover:bg-creme/20"
                aria-label="Fermer la photo agrandie"
              >
                <Icone nom="fermer" className="size-6" />
              </button>
            </div>
            <div className="relative min-h-0 flex-1">
              <ImageZoomable key={image.url} image={image} />
              {image.photoReelle && <BadgePhotoReelle className="pointer-events-none absolute top-3 left-3" />}
              {plusieurs && (
                <>
                  <button
                    type="button"
                    onClick={precedente}
                    className="absolute top-1/2 left-2 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-anthracite/70 hover:bg-anthracite"
                    aria-label="Photo précédente"
                  >
                    <Icone nom="chevronGauche" className="size-6" />
                  </button>
                  <button
                    type="button"
                    onClick={suivante}
                    className="absolute top-1/2 right-2 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-anthracite/70 hover:bg-anthracite"
                    aria-label="Photo suivante"
                  >
                    <Icone nom="chevronDroite" className="size-6" />
                  </button>
                </>
              )}
            </div>
            <div className="px-4 py-3 text-center text-xs text-creme/80">
              {image.generationIA ? (
                <p>Visuel d&apos;ambiance généré par IA, non contractuel</p>
              ) : (
                <p>
                  <span className="sm:hidden">Pincez ou touchez deux fois pour zoomer</span>
                  <span className="hidden sm:inline">Cliquez ou utilisez la molette pour zoomer</span>
                </p>
              )}
            </div>
          </div>
        )}
      </dialog>
    </div>
  );
}
