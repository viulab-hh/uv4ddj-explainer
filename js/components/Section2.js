/* ══════════════════════════════════════════════════════════════
   SECTION 2 — Sticky Newspaper + Scrollama
══════════════════════════════════════════════════════════════ */

import { html, useEffect, useRef, useState, scrollama } from "../lib.js";

// Annotation rectangles positioned over the newspaper SVG (% of container).
const ANNOTATION_DEFS = {
  1: {
    top: "8%",
    left: "7%",
    width: "62%",
    height: "8%",
    label:
      "This poll suggests that the conservative party has gained 1.8 percentage points since the beginning of the year.",
    color: "#FACC15",
  },
  2: {
    top: "18%",
    left: "7%",
    width: "52%",
    height: "7%",
    label: "The headline frames this as a trend.",
    color: "#FACC15",
  },
  3: {
    top: "30%",
    left: "7%",
    width: "58%",
    height: "8%",
    label:
      "But given the margin of error, this “change” could simply reflect normal sampling variation.",
    color: "#FACC15",
  },
  5: {
    top: "54%",
    left: "25%",
    width: "44%",
    height: "7%",
    label:
      "Reading between the lines requires an understanding of uncertainty.",
    color: "#86EFAC",
  },
};

function AnnotationBox({ def, visible }) {
  return html`
    <div
      class="absolute pointer-events-none z-[5] transition-all duration-500 ease-out"
      style=${{
        top: def.top,
        left: def.left,
        width: def.width,
        height: def.height,
        border: `3px solid ${def.color}`,
        backgroundColor: `${def.color}1F`,
        opacity: visible ? 1 : 0,
        transform: visible ? "scale(1)" : "scale(0.97)",
      }}
    >
      <div
        class="absolute top-full left-0 mt-1.5 text-black text-[0.68rem] leading-[1.45] px-[10px] py-[6px] max-w-[300px]"
        style=${{ backgroundColor: def.color }}
      >
        ${def.label}
      </div>
    </div>
  `;
}

export default function Section2() {
  const [activeStep, setActiveStep] = useState(-1);
  const scrollerRef = useRef(null);

  useEffect(() => {
    scrollerRef.current = scrollama();
    scrollerRef.current
      .setup({ step: ".s2-step", offset: 0.5 })
      .onStepEnter(({ index }) => setActiveStep(index))
      .onStepExit(({ index, direction }) => {
        if (direction === "up" && index === 0) setActiveStep(-1);
      });

    return () => scrollerRef.current && scrollerRef.current.destroy();
  }, []);

  const showGreen = activeStep >= 4;

  return html`
    <section class="relative bg-[#f5f0e8]">
      <div class="sticky top-0 h-screen overflow-hidden bg-white z-[1]">
        <img
          src="../../files/newspaper-article.svg"
          alt="Newspaper article"
          class="block w-full h-full object-contain"
        />

        ${[1, 2, 3].map(
          (i) => html`
            <${AnnotationBox}
              key=${i}
              def=${ANNOTATION_DEFS[i]}
              visible=${activeStep >= i}
            />
          `,
        )}
        <${AnnotationBox}
          def=${ANNOTATION_DEFS[5]}
          visible=${activeStep >= 5}
        />

        <div
          class="absolute inset-0 bg-uv4ddj-green/95 transition-opacity duration-700 ease-out flex items-center justify-center z-20 pointer-events-none"
          style=${{ opacity: showGreen ? 1 : 0 }}
        >
          <p
            class="m-0 text-black font-bold text-center leading-[1.35] px-6 sm:px-8 max-w-[92vw] sm:max-w-xl md:max-w-2xl text-xl sm:text-2xl md:text-3xl"
          >
            ${activeStep === 4
              ? "Even experts often misinterpret changes that fall within the margin of error"
              : activeStep >= 5
                ? "Reading between the lines requires an understanding of uncertainty."
                : ""}
          </p>
        </div>
      </div>

      <div class="relative z-30 -mt-screen">
        <div
          class="s2-step min-h-screen flex items-center px-4 sm:px-8 lg:px-14 pointer-events-none"
        >
          <div
            class="pointer-events-auto bg-white/95 backdrop-blur-sm p-6 sm:p-8 max-w-[92vw] sm:max-w-[340px] border-l-[5px] border-black shadow-[0_4px_20px_rgba(0,0,0,0.15)]"
          >
            <p class="m-0 text-sm sm:text-base leading-7 sm:leading-8">
              A striking example is how pre-election surveys are reported in the
              media:
            </p>
          </div>
        </div>

        ${[1, 2, 3, 4, 5].map(
          (i) => html`
            <div
              key=${i}
              class="s2-step min-h-screen pointer-events-none"
            ></div>
          `,
        )}
      </div>
    </section>
  `;
}
