/* ══════════════════════════════════════════════════════════════
   SECTION 2 — Sticky Newspaper + Scrollama
══════════════════════════════════════════════════════════════ */

import { html, useEffect, useRef, useState, scrollama } from "../lib.js";

// Annotation rectangles use normalized coordinates (0..1) relative to image box.
const MOBILE_BREAKPOINT = 640;
const toPercent = (value) => `${(value * 100).toFixed(2)}%`;
const LABEL_POSITION_STYLES = {
  "bottom-left": { top: "100%", left: 0, marginTop: "6px" },
  "bottom-right": { top: "100%", right: 0, marginTop: "6px" },
  "top-left": { bottom: "100%", left: 0, marginBottom: "6px" },
  "top-right": { bottom: "100%", right: 0, marginBottom: "6px" },
};

const ANNOTATION_DEFS = {
  1: {
    x: 0.71,
    y: 0.52,
    w: 0.16,
    h: 0.065,
    mobileAdjust: { dx: 0.01, dy: 0.01, dw: 0.03, dh: 0 },
    label:
      "This poll suggests that the conservative party has gained 1.8 percentage points since the beginning of the year.",
    labelPosition: "top-right",
    color: "#34A480",
  },
  2: {
    x: 0.578,
    y: 0.088,
    w: 0.235,
    h: 0.085,
    mobileAdjust: { dx: 0.01, dy: 0.005, dw: 0.02, dh: 0 },
    label: "The headline frames this as a trend.",
    labelPosition: "top-left",
    color: "#34A480",
  },
  3: {
    x: 0.25,
    y: 0.92,
    w: 0.38,
    h: 0.06,
    mobileAdjust: { dx: 0.01, dy: 0.01, dw: 0.02, dh: 0 },
    label:
      "But given the margin of error, this “change” could simply reflect normal sampling variation.",
    labelPosition: "top-left",
    color: "#34A480",
  },
  5: {
    x: 0.25,
    y: 0.54,
    w: 0.44,
    h: 0.07,
    mobileAdjust: { dx: -0.01, dy: 0.01, dw: 0.02, dh: 0 },
    label:
      "Reading between the lines requires an understanding of uncertainty.",
    color: "#34A480",
  },
};

function resolveAnnotationRect(def, isMobile) {
  const adjust = isMobile ? def.mobileAdjust || {} : {};
  return {
    top: toPercent(def.y + (adjust.dy || 0)),
    left: toPercent(def.x + (adjust.dx || 0)),
    width: toPercent(def.w + (adjust.dw || 0)),
    height: toPercent(def.h + (adjust.dh || 0)),
  };
}

function getLabelPositionStyle(labelPosition = "bottom-left") {
  return (
    LABEL_POSITION_STYLES[labelPosition] || LABEL_POSITION_STYLES["bottom-left"]
  );
}

function AnnotationBox({ def, rect, visible }) {
  const labelPositionStyle = getLabelPositionStyle(def.labelPosition);

  return html`
    <div
      class="absolute pointer-events-none z-[5] transition-all duration-500 ease-out"
      style=${{
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
        border: `3px solid ${def.color}`,
        backgroundColor: `${def.color}2F`,
        opacity: visible ? 1 : 0,
        transform: visible ? "scale(1)" : "scale(0.97)",
      }}
    >
      <div
        class="absolute text-black text-base leading-[1.45] px-[10px] py-[6px] max-w-[300px]"
        style=${{ backgroundColor: def.color, ...labelPositionStyle }}
      >
        ${def.label}
      </div>
    </div>
  `;
}

export default function Section2() {
  const [activeStep, setActiveStep] = useState(-1);
  const [step5Progress, setStep5Progress] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const scrollerRef = useRef(null);

  const remap = (p, inStart, inEnd) =>
    Math.min(1, Math.max(0, (p - inStart) / (inEnd - inStart)));

  useEffect(() => {
    scrollerRef.current = scrollama();
    scrollerRef.current
      .setup({ step: ".s2-step", offset: 0.5, progress: true })
      .onStepEnter(({ index }) => setActiveStep(index))
      .onStepExit(({ index, direction }) => {
        if (direction === "up" && index === 0) setActiveStep(-1);
        if (index === 5) {
          setStep5Progress(direction === "down" ? 1 : 0);
        }
      })
      .onStepProgress(({ index, progress }) => {
        if (index === 5) {
          setStep5Progress(progress);
        }
      });

    return () => scrollerRef.current && scrollerRef.current.destroy();
  }, []);

  useEffect(() => {
    const updateIsMobile = () =>
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    updateIsMobile();
    window.addEventListener("resize", updateIsMobile);
    return () => window.removeEventListener("resize", updateIsMobile);
  }, []);

  const showGreen = activeStep >= 4;
  const showIntro = activeStep === -1;
  const imageOpacity = activeStep >= 0 ? 1 : 0;
  const step5In = remap(step5Progress, 0, 0.35);
  const step5Opacity = activeStep >= 5 ? step5In : 0;
  const step5Y = (1 - step5In) * 28;
  const step4Opacity =
    activeStep === 4
      ? 1
      : activeStep >= 5
        ? Math.max(0, 1 - remap(step5Progress, 0, 0.28))
        : 0;

  return html`
    <section class="relative" id="section-2">
      <div
        class="sticky top-0 bottom-0 h-screen px-2 md:max-w-[1200px] mx-auto overflow-visible z-[1] flex items-center"
      >
        <div class="relative w-full">
          <img
            src="files/newspaper-article-image-cut.png"
            alt="Newspaper article"
            class="block w-full h-auto object-contain transition-opacity duration-700 ease-out"
            style=${{ opacity: imageOpacity }}
          />

          ${[1, 2, 3].map(
            (i) => html`
              <${AnnotationBox}
                key=${i}
                def=${ANNOTATION_DEFS[i]}
                rect=${resolveAnnotationRect(ANNOTATION_DEFS[i], isMobile)}
                visible=${activeStep >= i}
              />
            `,
          )}
          <${AnnotationBox}
            def=${ANNOTATION_DEFS[5]}
            rect=${resolveAnnotationRect(ANNOTATION_DEFS[5], isMobile)}
            visible=${activeStep >= 5}
          />

          <div
            class="absolute inset-0 flex items-center px-4 sm:px-8 lg:px-14 pointer-events-none transition-opacity duration-500 ease-out"
            style=${{ opacity: showIntro ? 1 : 0 }}
          >
            <div
              class="pointer-events-auto bg-uv4ddj-green/95 backdrop-blur-sm p-6 sm:p-8 max-w-[92vw] sm:max-w-[600px] mx-auto shadow-[0_4px_20px_rgba(0,0,0,0.15)]"
            >
              <h2
                class="m-0 mb-4 text-xl sm:text-3xl font-bold leading-tight text-balance text-center"
              >
                But why is it important to know about the uncertainty in data?
              </h2>
              <br />
              <p
                class="m-0 text-sm sm:text-lg leading-7 sm:leading-8 text-balance text-center"
              >
                Let's review this striking example of a ${" "}
                <span style="white-space: nowrap;">pre-election</span> survey
                reported in the media:
              </p>
            </div>
          </div>
        </div>

        <div
          class="absolute top-0 left-1/2 -translate-x-1/2 w-screen h-screen bg-uv4ddj-green/95 transition-opacity duration-700 ease-out flex items-center justify-center z-20 pointer-events-none"
          style=${{ opacity: showGreen ? 1 : 0 }}
        >
          <div
            class="relative w-full flex items-center justify-center px-6 sm:px-8"
          >
            <p
              class="absolute m-0 text-black font-normal text-center leading-[1.35] max-w-[92vw] sm:max-w-xl md:max-w-2xl text-xl sm:text-2xl md:text-3xl transition-opacity duration-500 ease-out"
              style=${{ opacity: step4Opacity }}
            >
              Even experts often misinterpret changes that fall within the
              margin of error.
            </p>
            <p
              class="absolute m-0 text-black font-normal text-center leading-[1.35] max-w-[92vw] sm:max-w-xl md:max-w-2xl text-xl sm:text-2xl md:text-3xl transition-all duration-300 ease-out"
              style=${{
                opacity: step5Opacity,
                transform: `translateY(${step5Y}px)`,
              }}
            >
              Reading between the lines requires an understanding of
              uncertainty.
            </p>
          </div>
        </div>
      </div>

      <div class="relative z-30 -mt-screen">
        <div class="min-h-screen" aria-hidden="true"></div>

        ${[0, 1, 2, 3, 4, 5].map(
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
