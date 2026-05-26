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
    text2: html`<p>
      (e.g. from${" "}"
      <a
        href="https://www.spiegel.de/politik/deutschland/sonntagsfrage-umfragen-zu-bundestagswahl-landtagswahl-europawahl-a-944816.html"
        target="_blank"
        rel="noopener noreferrer"
        class="underline"
        >Der Spiegel</a
      >")
    </p>`,
  },
  {
    headline: "Spatial",
    image: "files/NYT_cut.png",
    text1: "conflict mapping",
    text2: html`<p>
      (e.g. from${" "}"
      <a
        href="https://www.nytimes.com/article/axis-resistance-iran-militia.html"
        target="_blank"
        rel="noopener noreferrer"
        class="underline"
        >New York Times</a
      >")
    </p>`,
  },
  {
    headline: "Forecast",
    image: "files/SWR_cut.png",
    text1: "climate projections",
    text2: html`<p>
      (e.g. from${" "}"
      <a
        href="https://www.swr.de/swraktuell/baden-wuerttemberg/verpasste-ziele-warum-bw-beim-e-auto-anteil-hinterherfaehrt-100.html"
        target="_blank"
        rel="noopener noreferrer"
        class="underline"
        >SWR</a
      >")
    </p>`,
  },
];

function ColumnCard({ col, style = {}, className = "" }) {
  return html`
    <article
      class=${`flex flex-col items-center text-center transition-all duration-500 ease-out max-w-md mx-auto md:max-w-none ${className}`.trim()}
      style=${{ willChange: "transform, opacity", ...style }}
    >
      <h3
        class="m-0 font-normal text-xl sm:text-2xl leading-snug text-uv4ddj-green"
      >
        ${col.headline}
      </h3>

      <p class="m-0 text-base sm:text-lg leading-relaxed font-extralight">
        ${col.text1}
      </p>
      <p class="m-0 text-sm sm:text-base leading-relaxed mb-4 font-extralight">
        ${col.text2}
      </p>
      <img
        src=${col.image}
        alt=${col.headline}
        class="w-full h-auto object-cover shadow-[0_2px_14px_rgba(0,0,0,0.13)] border-2 border-uv4ddj-green rounded-[0.5rem]"
      />
    </article>
  `;
}

function StageMessage({ text, style = {}, className = "" }) {
  return html`
    <p
      class=${`m-0 text-center font-medium leading-tight text-3xl sm:text-4xl lg:text-5xl text-balance ${className}`.trim()}
      style=${style}
    >
      ${text}
    </p>
  `;
}

export default function Section3() {
  const sectionRef = useRef(null);
  const frameRef = useRef(0);
  const progressRef = useRef(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      frameRef.current = 0;

      const el = sectionRef.current;
      if (!el) return;

      const top = el.getBoundingClientRect().top;
      const height = el.offsetHeight - window.innerHeight;
      const p = height > 0 ? Math.max(0, Math.min(1, -top / height)) : 0;
      if (Math.abs(progressRef.current - p) < 0.001) return;

      progressRef.current = p;
      setProgress(p);
    };

    const onScroll = () => {
      if (frameRef.current) return;
      frameRef.current = window.requestAnimationFrame(updateProgress);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    updateProgress();
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frameRef.current) window.cancelAnimationFrame(frameRef.current);
    };
  }, []);

  const remap = (p, inStart, inEnd) =>
    Math.min(1, Math.max(0, (p - inStart) / (inEnd - inStart)));

  const stageStyle = (inStart, inEnd, outStart, outEnd) => {
    const fadeIn = remap(progress, inStart, inEnd);
    const fadeOut =
      outStart === undefined ? 1 : 1 - remap(progress, outStart, outEnd);
    const opacity = fadeIn * fadeOut;
    const yIn = (1 - fadeIn) * 30;
    const yOut =
      outStart === undefined ? 0 : remap(progress, outStart, outEnd) * -30;

    return {
      opacity,
      transform: `translate3d(0, ${yIn + yOut}px, 0)`,
      pointerEvents: opacity > 0.02 ? "auto" : "none",
    };
  };

  const mobileSamplingStyle = stageStyle(0.08, 0.2, 0.26, 0.34);
  const mobileSpatialStyle = stageStyle(0.34, 0.46, 0.52, 0.6);
  const mobileForecastStyle = stageStyle(0.6, 0.72, 0.78, 0.86);
  const mobileClosingStyle = stageStyle(0.86, 0.96);

  // Closing text: fades in after all 3 columns are fully visible (last column done at ~0.84)
  const closingIn = remap(progress, 0.84, 0.96);
  const closingOpacity = closingIn;
  const closingY = (1 - closingIn) * 30;

  return html`
    <section
      id="section-3"
      ref=${sectionRef}
      class="relative h-[500vh] md:h-[260vh]"
    >
      <div
        class="sticky top-0 bg-red-0 text-black h-screen py-6 px-4 sm:px-8 md:py-4 flex items-center"
      >
        <div class="max-w-6xl mx-auto w-full">
          <h2
            class="md:hidden m-0 mb-2 text-center leading-[100%] text-3xl sm:text-4xl lg:text-4xl font-extralight"
          >
            Uncertainty appears in many forms:
          </h2>

          <div class="hidden md:block">
            <${FadeInUp} delay=${0}>
              <h2
                class="m-0 mb-4 text-center leading-tight text-2xl sm:text-3xl font-extralight"
              >
                Uncertainty appears in many forms:
              </h2>
            <//>
          </div>

          <div class="md:hidden relative min-h-[440px] mb-4">
            <div class="absolute inset-0 flex items-center justify-center">
              <${ColumnCard} col=${COLUMNS[0]} style=${mobileSamplingStyle} />
            </div>
            <div class="absolute inset-0 flex items-center justify-center">
              <${ColumnCard} col=${COLUMNS[1]} style=${mobileSpatialStyle} />
            </div>
            <div class="absolute inset-0 flex items-center justify-center">
              <${ColumnCard} col=${COLUMNS[2]} style=${mobileForecastStyle} />
            </div>
            <div class="absolute inset-0 flex items-center justify-center px-2">
              <${StageMessage}
                text=${"Uncertainty demands better communication."}
                style=${mobileClosingStyle}
              />
            </div>
          </div>

          <div
            class="hidden md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-8 lg:gap-10 mb-4"
          >
            ${COLUMNS.map((col, i) => {
              const colIn = remap(progress, 0.14 + i * 0.23, 0.38 + i * 0.23);
              const colOpacity = colIn;
              const colY = (1 - colIn) * 30;

              return html`
                <${ColumnCard}
                  key=${i}
                  col=${col}
                  style=${{
                    opacity: colOpacity,
                    transform: `translate3d(0, ${colY}px, 0)`,
                  }}
                />
              `;
            })}
          </div>

          <p
            class="hidden md:block m-0 text-center font-normal leading-tight text-2xl sm:text-3xl text-balance"
            style=${{
              opacity: closingOpacity,
              transform: `translate3d(0, ${closingY}px, 0)`,
            }}
          >
            Uncertainty demands better communication.
          </p>
        </div>
      </div>
    </section>
  `;
}
