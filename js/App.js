import { html, render } from "./lib.js";

import Section1 from "./components/Section1.js";
import Section2 from "./components/Section2.js";
import Section3 from "./components/Section3.js";
import Section4 from "./components/Section4.js";

function App() {
  return html`
    <div>
      <div
        class="fixed top-4 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
      >
        <img
          src="files/VIU_Logo_serif.svg"
          alt="VIU logo"
          class="w-[140px] h-auto"
        />
      </div>

      <${Section1} />
      <${Section2} />
      <${Section3} />
      <${Section4} />
    </div>
  `;
}

render(html`<${App} />`, document.getElementById("app"));
