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
    image: "files/SPIEGEL4.png",
    text: "election polls DER SPIEGEL",
  },
  {
    headline: "Spatial",
    image: "files/NYT7.png",
    text: "conflict mapping NEW YORK TIMES",
  },
  {
    headline: "Forecast",
    image: "files/SWR1.png",
    text: "climate projections SWR",
  },
];

export default function Section3() {
  return html`
    <section class="bg-white text-black py-20 sm:py-24 lg:py-28 px-4 sm:px-8">
      <div class="max-w-6xl mx-auto">
        <${FadeInUp} delay=${0}>
          <h2
            class="m-0 mb-12 sm:mb-14 lg:mb-16 text-center font-bold leading-tight text-3xl sm:text-4xl lg:text-5xl"
          >
            Uncertainty appears in many forms:
          </h2>
        <//>

        <div
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 mb-14 sm:mb-16 lg:mb-20"
        >
          ${COLUMNS.map(
            (col, i) => html`
              <${FadeInUp} key=${i} delay=${i * 180}>
                <article class="flex flex-col items-center text-center">
                  <h3
                    class="m-0 mb-4 font-bold text-xl sm:text-2xl leading-snug"
                  >
                    ${col.headline}
                  </h3>

                  <img
                    src=${col.image}
                    alt=${col.headline}
                    class="w-full aspect-[4/3] object-cover mb-4 shadow-[0_2px_14px_rgba(0,0,0,0.13)]"
                  />

                  <p class="m-0 text-sm sm:text-base leading-relaxed">
                    ${col.text}
                  </p>
                </article>
              <//>
            `,
          )}
        </div>

        <${FadeInUp} delay=${0}>
          <p
            class="m-0 text-center font-bold leading-tight text-3xl sm:text-4xl lg:text-5xl"
          >
            Uncertainty demands better communication.
          </p>
        <//>
      </div>
    </section>
  `;
}
