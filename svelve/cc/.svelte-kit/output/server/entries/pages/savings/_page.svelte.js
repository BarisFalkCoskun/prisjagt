import { a0 as head, V as ensure_array_like, Y as attr_style, _ as stringify } from "../../../chunks/index2.js";
import { e as escape_html } from "../../../chunks/context.js";
function _page($$renderer) {
  const mockSavings = [
    { month: "Jan", amount: 127 },
    { month: "Feb", amount: 89 },
    { month: "Mar", amount: 156 },
    { month: "Apr", amount: 203 },
    { month: "Maj", amount: 178 },
    { month: "Jun", amount: 234 }
  ];
  const totalSavings = mockSavings.reduce((sum, m) => sum + m.amount, 0);
  const maxSavings = Math.max(...mockSavings.map((m) => m.amount));
  head("8g9zo0", $$renderer, ($$renderer2) => {
    $$renderer2.title(($$renderer3) => {
      $$renderer3.push(`<title>Besparelser - PrisJagt</title>`);
    });
  });
  $$renderer.push(`<div class="savings-page svelte-8g9zo0"><div class="container"><header class="page-header svelte-8g9zo0"><h1 class="page-title svelte-8g9zo0">Dine besparelser</h1> <p class="page-subtitle svelte-8g9zo0">Se hvor meget du kan spare ved at sammenligne priser</p></header> <div class="savings-overview svelte-8g9zo0"><div class="savings-card main svelte-8g9zo0"><span class="label svelte-8g9zo0">Potentielle besparelser</span> <span class="value svelte-8g9zo0">${escape_html(totalSavings)} kr</span> <span class="period svelte-8g9zo0">Sidste 6 måneder</span></div> <div class="savings-card svelte-8g9zo0"><span class="label svelte-8g9zo0">Denne måned</span> <span class="value svelte-8g9zo0">${escape_html(mockSavings[mockSavings.length - 1].amount)} kr</span></div> <div class="savings-card svelte-8g9zo0"><span class="label svelte-8g9zo0">Gennemsnit pr. måned</span> <span class="value svelte-8g9zo0">${escape_html(Math.round(totalSavings / mockSavings.length))} kr</span></div></div> <section class="chart-section svelte-8g9zo0"><h2 class="svelte-8g9zo0">Besparelser over tid</h2> <div class="bar-chart svelte-8g9zo0"><!--[-->`);
  const each_array = ensure_array_like(mockSavings);
  for (let index = 0, $$length = each_array.length; index < $$length; index++) {
    let month = each_array[index];
    $$renderer.push(`<div class="bar-item svelte-8g9zo0"${attr_style(`--delay: ${stringify(index * 100)}ms`)}><div class="bar-container svelte-8g9zo0"><div class="bar svelte-8g9zo0"${attr_style(`height: ${stringify(month.amount / maxSavings * 100)}%`)}><span class="bar-value svelte-8g9zo0">${escape_html(month.amount)} kr</span></div></div> <span class="bar-label svelte-8g9zo0">${escape_html(month.month)}</span></div>`);
  }
  $$renderer.push(`<!--]--></div></section> <section class="tips-section svelte-8g9zo0"><h2 class="svelte-8g9zo0">Spartips</h2> <div class="tips-grid svelte-8g9zo0"><div class="tip-card svelte-8g9zo0"><div class="tip-number svelte-8g9zo0">1</div> <h3 class="svelte-8g9zo0">Sammenlign før du køber</h3> <p class="svelte-8g9zo0">Tjek altid priserne på flere butikker inden du handler. Prisforskellen kan være op til 30%.</p></div> <div class="tip-card svelte-8g9zo0"><div class="tip-number svelte-8g9zo0">2</div> <h3 class="svelte-8g9zo0">Køb på tilbud</h3> <p class="svelte-8g9zo0">Hold øje med tilbud og udsalg. Mange varer kommer på tilbud med faste intervaller.</p></div> <div class="tip-card svelte-8g9zo0"><div class="tip-number svelte-8g9zo0">3</div> <h3 class="svelte-8g9zo0">Tjek prishistorikken</h3> <p class="svelte-8g9zo0">Se om prisen er god sammenlignet med historikken, før du slår til på et "tilbud".</p></div></div></section></div></div>`);
}
export {
  _page as default
};
