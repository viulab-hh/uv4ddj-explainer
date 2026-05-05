/* ══════════════════════════════════════════════════════════════
    SECTION 3 — White background, elements scroll in
══════════════════════════════════════════════════════════════ */

import { html, useEffect, useRef, useState } from "../lib.js";

function FadeInUp({ children, delay }) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  const d = delay || 0;

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVis(true);
          obs.disconnect();
        }
      },
      { threshold: 0.12 },
    );

    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return html`
    <div
      ref=${ref}
      class="transition-all duration-700 ease-out"
      style=${{
        opacity: vis ? 1 : 0,
        transform: vis ? "translateY(0)" : "translateY(40px)",
        transitionDelay: `${d}ms`,
      }}
    >
      ${children}
    </div>
  `;
}

const COLUMNS = [
  {
    headline: "Sampling",
    image: "files/spiegel_cut.png",
    text1: "election polls",
    text2: '(e.g. from "Der Spiegel")',
  },
  {
    headline: "Spatial",
    image: "files/NYT_cut.png",
    text1: "conflict mapping",
    text2: '(e.g. from "New York Times")',
  },
  {
    headline: "Forecast",
    image: "files/SWR_cut.png",
    text1: "climate projections",
    text2: '(e.g. from "SWR")',
  },
];

export default function Section3() {
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

  const remap = (p, inStart, inEnd) =>
    Math.min(1, Math.max(0, (p - inStart) / (inEnd - inStart)));

  // Closing text: fades in after all 3 columns are fully visible (last column done at ~0.84)
  const closingIn = remap(progress, 0.84, 0.96);
  const closingOpacity = closingIn;
  const closingY = (1 - closingIn) * 30;

  return html`
    <section id="section-3" ref=${sectionRef} class="relative h-[260vh]">
      <div
        class="sticky top-0 bg-red-0 text-black py-4 px-4 sm:px-8 h-screen flex items-center"
      >
        <div class="max-w-6xl mx-auto">
          <${FadeInUp} delay=${0}>
            <h2
              class="m-0 mb-12 sm:mb-14 lg:mb-16 text-center leading-tight text-3xl sm:text-4xl lg:text-4xl"
            >
              Uncertainty appears in many forms:
            </h2>
          <//>

          <div
            class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 mb-14 sm:mb-16 lg:mb-20"
          >
            ${COLUMNS.map((col, i) => {
              const colIn = remap(progress, 0.14 + i * 0.23, 0.38 + i * 0.23);
              const colOpacity = colIn;
              const colY = (1 - colIn) * 30;

              return html`
                <article
                  key=${i}
                  class="flex flex-col items-center text-center transition-all duration-500 ease-out"
                  style=${{
                    opacity: colOpacity,
                    transform: `translateY(${colY}px)`,
                  }}
                >
                  <h3
                    class="m-0 mb-4 font-bold text-xl sm:text-2xl leading-snug text-uv4ddj-green"
                  >
                    ${col.headline}
                  </h3>

                  <p class="m-0 text-base sm:text-lg leading-relaxed">
                    ${col.text1}
                  </p>
                  <p class="m-0 text-sm sm:text-base leading-relaxed  mb-4">
                    ${col.text2}
                  </p>
                  <img
                    src=${col.image}
                    alt=${col.headline}
                    class="w-full h-full object-cover shadow-[0_2px_14px_rgba(0,0,0,0.13)] border-2 border-uv4ddj-green"
                  />
                </article>
              `;
            })}
          </div>

          <p
            class="m-0 text-center font-bold leading-tight text-3xl sm:text-4xl lg:text-5xl text-balance"
            style=${{
              opacity: closingOpacity,
              transform: `translateY(${closingY}px)`,
            }}
          >
            Uncertainty demands better communication.
          </p>
        </div>
      </div>
    </section>
  `;
}
