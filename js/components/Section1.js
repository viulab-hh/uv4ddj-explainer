/* ══════════════════════════════════════════════════════════════
    SECTION 1 — Hero Parallax
══════════════════════════════════════════════════════════════ */

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

  // Background zoom: scale 1.0 → 1.08 over full scroll
  const bgScale = 1 + progress * 0.08;

  // Text box 1: fade out and translate up in first 30% of scroll
  const t1Opacity = Math.max(0, 1 - progress * 3.5);
  const t1Y = progress * -80;

  // Text box 2: fade in from 45% scroll onward
  const t2Raw = (progress - 0.45) * 6;
  const t2Opacity = Math.min(1, Math.max(0, t2Raw));
  const t2Y = Math.max(0, (1 - t2Raw) * 50);

  return html`
    <section ref=${sectionRef} class="relative h-[220vh]">
      <div
        class="sticky top-0 h-screen overflow-hidden grid place-items-center"
      >
        <div
          class="absolute inset-0 bg-cover bg-center will-change-transform"
          style=${{
            backgroundImage: "url(files/uncertainty4ddj_1.png)",
            transform: `scale(${bgScale})`,
          }}
        ></div>

        <div class="absolute inset-0 bg-white/45"></div>

        <div
          class="relative z-10 w-full max-w-[92vw] sm:max-w-2xl lg:max-w-3xl px-4 sm:px-8 text-center text-black will-change-transform"
          style=${{
            opacity: t1Opacity,
            transform: `translateY(${t1Y}px)`,
          }}
        >
          <h1
            class="m-0 mb-5 sm:mb-6 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight"
          >
            <em>uncertainty4ddj</em>: Visualizing Uncertainty for Data
            Journalism
          </h1>
          <p class="m-0 text-sm sm:text-base md:text-lg leading-7 sm:leading-8">
            Data is a central part of journalistic work, yet one crucial element
            often remains invisible: the uncertainty of the data. It is
            essential for interpreting facts and creating convincing narratives.
            <br /><br />
            At viu:lab (HAW Hamburg), we examine the role of uncertainty
            visualization in data-driven news coverage through the ${" "}
            <em>uncertainty4ddj</em> project.
          </p>
        </div>

        <div
          class="absolute left-1/2 bottom-[12%] sm:bottom-[14%] md:bottom-[18%] z-[11] w-full max-w-[92vw] sm:max-w-xl md:max-w-2xl px-4 sm:px-8 text-center text-black will-change-transform"
          style=${{
            opacity: t2Opacity,
            transform: `translate(-50%, ${t2Y}px)`,
          }}
        >
          <p
            class="m-0 text-lg sm:text-2xl md:text-[1.65rem] font-bold leading-snug sm:leading-[1.45]"
          >
            But why is it important to be informed about the uncertainty in
            data?
          </p>
        </div>
      </div>
    </section>
  `;
}
