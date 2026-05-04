import { html, render } from "./lib.js";

import Section1 from "./components/Section1.js";
import Section2 from "./components/Section2.js";
import Section3 from "./components/Section3.js";

function App() {
  return html`
    <div>
      <${Section1} />
      <${Section2} />
      <${Section3} />
    </div>
  `;
}

render(html`<${App} />`, document.getElementById("app"));
