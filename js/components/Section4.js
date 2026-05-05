/* ══════════════════════════════════════════════════════════════
    SECTION 4 — Sticky methods steps
══════════════════════════════════════════════════════════════ */

import { html, useEffect, useRef, useState } from "../lib.js";

const STEPS = [
  {
    text: "We develop the uncertainty4ddj toolkit, designed to support data journalistic practice.",
    icon: "files/icon_toolkit.svg",
    alt: "Toolkit icon",
    cta: {
      label: "Try it out",
      href: "https://www.google.com",
    },
  },
  {
    text: "We conduct empirical research to understand how data journalists visualize uncertainty and what they need in newsroom settings.",
    icon: "files/icon_studies.svg",
    alt: "Studies icon",
  },
  {
    text: "We collaborate with practitioners, in workshops and beyond, to bridge the gap between scientific knowledge and practical needs.",
    icon: "files/icon_workshop.svg",
    alt: "Workshop icon",
  },
];

const STEP_WINDOWS = [
  { start: 0.18, end: 0.44 },
  { start: 0.44, end: 0.7 },
  { start: 0.7, end: 0.96 },
];

const remap = (p, inStart, inEnd) =>
  Math.min(1, Math.max(0, (p - inStart) / (inEnd - inStart)));

export default function Section4() {
  const sectionRef = useRef(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const el = sectionRef.current;
      if (!el) return;
      const top = el.getBoundingClientRect().top;
      const height = el.offsetHeight - window.innerHeight;
      const p = height > 0 ? Math.max(0, Math.min(1, -top / height)) : 0;
      setProgress(p);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const stepProgress = STEP_WINDOWS.map((range) =>
    remap(progress, range.start, range.start + 0.14),
  );

  const finalIn = remap(progress, 0.9, 0.98);
  const introOut = 1 - remap(progress, 0.86, 0.94);
  const finalY = (1 - finalIn) * 28;
  const overlayOpacity = 0.8 + 0.05 * finalIn;

  return html`
    <section
      id="section-4"
      ref=${sectionRef}
      class="relative h-[420vh] bg-[#fff] border-t-4 border-uv4ddj-green"
    >
      <div
        class="sticky top-0 h-screen overflow-hidden px-4 sm:px-8 py-8 sm:py-12 flex items-center justify-center "
      >
        <div
          class="absolute inset-0 bg-cover bg-center"
          style=${{ backgroundImage: "url(files/uncertainty4ddj_1.png)" }}
        ></div>
        <div
          class="absolute inset-0 bg-white"
          style=${{ opacity: overlayOpacity }}
        ></div>

        <div
          class="relative z-10 max-w-6xl mx-auto w-full h-full flex items-center justify-center"
        >
          <div class="w-full" style=${{ opacity: introOut }}>
            <h2
              class="m-0 text-center text-xl sm:text-2xl lg:text-3xl leading-tight text-black mb-8 text-balance"
            >
              In the ${" "}
              <em class="font-bold text-uv4ddj-green">uncertainty4ddj</em>${" "}
              project, we support data journalists in visualizing uncertainty,
              grounded in the current state of scientific knowledge:
            </h2>

            <div class="flex justify-center">
              <div class="w-full max-w-5xl flex flex-col gap-4 sm:gap-5">
                ${STEPS.map((step, i) => {
                  const inProgress = stepProgress[i];

                  return html`
                    <article
                      key=${i}
                      class="w-full transition-all duration-500 ease-out"
                      style=${{
                        opacity: inProgress,
                        transform: `translateY(${(1 - inProgress) * 26}px)`,
                      }}
                    >
                      <div
                        class="grid grid-cols-[auto_1fr] items-center gap-5 sm:gap-8 bg-white/95 border border-uv4ddj-green shadow-[0_10px_30px_rgba(0,0,0,0.08)] p-5 sm:p-8 lg:p-10"
                      >
                        <img
                          src=${step.icon}
                          alt=${step.alt}
                          class="w-16 h-16 sm:w-20 sm:h-20 object-contain"
                        />
                        <div>
                          <p
                            class="m-0 text-black text-lg sm:text-2xl leading-snug sm:leading-[1.45]"
                          >
                            <span class="font-bold">${i + 1}.</span>
                            ${" "}${step.text}
                          </p>
                          ${step.cta
                            ? html`
                                <a
                                  href=${step.cta.href}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  class="inline-flex mt-4 px-4 py-2 bg-uv4ddj-green text-black font-normal border border-uv4ddj-green hover:opacity-90 transition-opacity"
                                >
                                  ${step.cta.label}
                                </a>
                              `
                            : ""}
                        </div>
                      </div>
                    </article>
                  `;
                })}
              </div>
            </div>
          </div>

          <div
            class="absolute inset-0 flex items-center justify-center"
            style=${{
              opacity: finalIn,
              transform: `translateY(${finalY}px)`,
            }}
          >
            <div class="text-center px-4 sm:px-8">
              <h2
                class="m-0 text-black text-3xl sm:text-4xl lg:text-6xl leading-relaxed text-balance"
              >
                <em class="font-bold text-uv4ddj-green">uncertainty4ddj</em>:
                Visualizing Uncertainty for Data Journalism
              </h2>
              <a
                href="mailto:contact@example.com"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex mt-8 px-6 sm:px-8 py-3 bg-uv4ddj-green text-black font-normal text-lg border border-uv4ddj-green hover:opacity-90 transition-opacity"
              >
                Get in touch
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}
