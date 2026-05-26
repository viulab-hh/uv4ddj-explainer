/* ══════════════════════════════════════════════════════════════
    SECTION 1 — Hero Parallax
══════════════════════════════════════════════════════════════ */

//

import { html, useEffect, useRef, useState } from "../lib.js";

export default function Section1() {
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

  // Background zoom: scale 1.0 → 1.25 over full scroll
  const bgScale = 1 + progress * 0.25;

  // White overlay: fade in from start opacity to end opacity over full scroll
  const overlayStartOpacity = 0.95;
  const overlayEndOpacity = 0.6;
  const overlayOpacity =
    overlayStartOpacity + (overlayEndOpacity - overlayStartOpacity) * progress;

  // Helper: remap progress from [inStart, inEnd] → [0,1] (clamped)
  const remap = (p, inStart, inEnd) =>
    Math.min(1, Math.max(0, (p - inStart) / (inEnd - inStart)));

  // Text box 1: visible at start, fades out 25%→38%
  const t1In = 1;
  const t1Out = Math.max(0, 1 - remap(progress, 0.25, 0.38));
  const t1Opacity = t1In * t1Out;
  const t1Y = progress * -60;

  // Text box 2: fades in 30%→42%, fades out 55%→67%
  const t2Opacity =
    remap(progress, 0.3, 0.42) * Math.max(0, 1 - remap(progress, 0.55, 0.67));
  const t2Y = Math.max(0, (1 - remap(progress, 0.3, 0.42)) * 50);

  // Text box 3: fades in 62%→74%, stays visible
  const t3Opacity = remap(progress, 0.62, 0.74);
  const t3Y = Math.max(0, (1 - remap(progress, 0.62, 0.74)) * 50);

  return html`
    <section ref=${sectionRef} class="relative h-[380vh]" id="section-1">
      <div
        class="sticky top-0 h-screen overflow-hidden grid place-items-center border-b-4 border-uv4ddj-green"
      >
        <div
          class="absolute inset-0 bg-cover bg-center will-change-transform"
          style=${{
            backgroundImage: "url(files/uncertainty4ddj_1.png)",
            transform: `scale(${bgScale})`,
          }}
        ></div>

        <div
          class="absolute inset-0 bg-white will-change-[opacity]"
          style=${{ opacity: overlayOpacity }}
        ></div>

        <!-- Text Box 1 -->
        <div
          class="absolute inset-0 grid place-items-center px-4 sm:px-8 will-change-transform"
          style=${{
            opacity: t1Opacity,
            transform: `translateY(${t1Y}px)`,
          }}
        >
          <h1
            class="m-0 max-w-[92vw] sm:max-w-2xl lg:max-w-3xl text-center text-black font-normal  text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-balance"
          >
            <span class="leading-[150%]">
              <em style="color: #34A480;">uncertainty4ddj</em>
            </span>
            <span class="leading-[110%]">
              <br />Visualizing Uncertainty <br />in Data Journalism
            </span>
          </h1>
        </div>

        <!-- Text Box 2 -->
        <div
          class="absolute inset-0 grid place-items-center px-4 sm:px-8 will-change-transform"
          style=${{
            opacity: t2Opacity,
            transform: `translateY(${t2Y}px)`,
          }}
        >
          <p
            class="m-0 max-w-[92vw] sm:max-w-2xl lg:max-w-3xl text-center text-black text-base sm:text-lg md:text-xl lg:text-2xl leading-6 sm:leading-8 md:leading-9 text-balance font-extralight"
          >
            Data is a central part of journalistic work, yet one crucial element
            often remains invisible: the uncertainty of the data. It is
            essential for interpreting facts and creating convincing narratives.
          </p>
        </div>

        <!-- Text Box 3 -->
        <div
          class="absolute inset-0 grid place-items-center px-4 sm:px-8 will-change-transform"
          style=${{
            opacity: t3Opacity,
            transform: `translateY(${t3Y}px)`,
          }}
        >
          <p
            class="m-0 max-w-[92vw] sm:max-w-2xl lg:max-w-3xl text-center text-black text-base sm:text-lg md:text-xl lg:text-2xl leading-6 sm:leading-8 md:leading-9 text-balance font-extralight"
          >
            At viu:lab (HAW Hamburg), we examine the role of uncertainty
            visualization in data-driven news coverage through the${" "}
            <em>uncertainty4ddj</em> project.
          </p>
        </div>
      </div>
    </section>
  `;
}
