import { termsSections } from "@/data/terms-of-service";
import { refundSections } from "@/data/refund-policy";

export function TermsPolicyContent() {
  return (
    <div className="flex flex-col gap-6">
      {termsSections.map((section) => (
        <section key={section.title}>
          <h3 className="mb-3 text-sm font-black uppercase italic tracking-tighter text-purple-300">
            {section.title}
          </h3>

          {section.paragraphs?.map((paragraph) => (
            <p
              key={paragraph.slice(0, 40)}
              className="mb-3 text-[11px] leading-relaxed text-white/60 last:mb-0"
            >
              {paragraph}
            </p>
          ))}

          {section.items?.map(({ term, definition }) => (
            <p
              key={term}
              className="mb-2 text-[11px] leading-relaxed text-white/60 last:mb-0"
            >
              <span className="font-bold text-white/80">{term}:</span>{" "}
              {definition}
            </p>
          ))}

          {section.subsections?.map((sub) => (
            <div key={sub.heading} className="mb-4 last:mb-0">
              <h4 className="mb-2 text-[10px] font-black uppercase tracking-widest text-white/70">
                {sub.heading}
              </h4>
              <ul className="space-y-1.5">
                {sub.bullets.map((bullet) => (
                  <li
                    key={bullet}
                    className="flex gap-2.5 text-[11px] leading-relaxed text-white/55"
                  >
                    <span
                      className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-purple-500"
                      aria-hidden
                    />
                    {bullet}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      ))}
    </div>
  );
}

export function RefundPolicyContent() {
  return (
    <div className="flex flex-col gap-6">
      {refundSections.map((section) => (
        <section key={section.title}>
          <h3 className="mb-3 text-sm font-black uppercase italic tracking-tighter text-purple-300">
            {section.title}
          </h3>

          {section.intro && (
            <p className="mb-3 text-[11px] leading-relaxed text-white/60">
              {section.intro}
            </p>
          )}

          {section.paragraphs?.map((paragraph) => (
            <p
              key={paragraph.slice(0, 40)}
              className="mb-3 text-[11px] leading-relaxed text-white/60 last:mb-0"
            >
              {paragraph}
            </p>
          ))}

          {section.bullets && (
            <ul className="space-y-1.5">
              {section.bullets.map((bullet) => (
                <li
                  key={bullet}
                  className="flex gap-2.5 text-[11px] leading-relaxed text-white/55"
                >
                  <span
                    className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-purple-500"
                    aria-hidden
                  />
                  {bullet}
                </li>
              ))}
            </ul>
          )}

          {section.contact && (
            <a
              href={section.contact.href}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-block text-[11px] font-bold text-purple-300 transition-colors hover:text-white"
            >
              {section.contact.label} →
            </a>
          )}
        </section>
      ))}
    </div>
  );
}
