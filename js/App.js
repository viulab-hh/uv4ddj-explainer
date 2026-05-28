import { html, render, useState, useEffect } from "./lib.js";

import Section1 from "./components/Section1.js";
import Section2 from "./components/Section2.js";
import Section3 from "./components/Section3.js";
import Section4 from "./components/Section4.js";

function App() {
  const [showLogo, setShowLogo] = useState(true);

  useEffect(() => {
    const onScroll = () => {
      const s1 = document.getElementById("section-1");
      const s4 = document.getElementById("section-4");

      let inSection1 = false;
      let inSection4Final = false;

      if (s1) {
        const rect = s1.getBoundingClientRect();
        inSection1 = rect.top < window.innerHeight && rect.bottom > 0;
      }

      if (s4) {
        const top = s4.getBoundingClientRect().top;
        const height = s4.offsetHeight - window.innerHeight;
        const p = height > 0 ? Math.max(0, Math.min(1, -top / height)) : 0;
        inSection4Final = p >= 0.86;
      }

      setShowLogo(inSection1 || inSection4Final);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return html`
    <div>
      <a
        href="https://viulab.haw-hamburg.de/"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Open VIU Lab website"
        class="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-white/90 rounded-[0.5rem] px-3 py-2 transition-opacity duration-400"
        style=${{
          opacity: showLogo ? 1 : 0,
          pointerEvents: showLogo ? "auto" : "none",
        }}
      >
        <img
          src="files/VIU_Logo_serif.svg"
          alt="VIU logo"
          class="w-[80px] sm:w-[140px] h-auto"
        />
      </a>

      <${Section1} />
      <${Section2} />
      <${Section3} />
      <${Section4} />
    </div>
  `;
}

render(html`<${App} />`, document.getElementById("app"));
