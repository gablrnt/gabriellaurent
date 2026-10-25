import type { QuestionReponse } from "@/data/faq";
import { Icone } from "@/components/ui/Icone";
import { JsonLd } from "@/components/ui/JsonLd";

/** FAQ en accordéon natif (<details>) : accessible au clavier, sans JavaScript */
export function Faq({ questions }: { questions: QuestionReponse[] }) {
  return (
    <>
      <div className="divide-y divide-greige border-y border-greige">
        {questions.map((q) => (
          <details key={q.question} className="group">
            <summary className="flex items-center justify-between gap-4 py-5 text-left font-serif text-xl leading-snug sm:text-2xl">
              {q.question}
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-greige transition-transform group-open:rotate-45">
                <Icone nom="plus" className="size-4" />
              </span>
            </summary>
            <p className="max-w-3xl pb-6 leading-relaxed text-anthracite/90">{q.reponse}</p>
          </details>
        ))}
      </div>
      <JsonLd
        donnees={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: questions.map((q) => ({
            "@type": "Question",
            name: q.question,
            acceptedAnswer: { "@type": "Answer", text: q.reponse },
          })),
        }}
      />
    </>
  );
}
