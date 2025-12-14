import { Y as attr_style, _ as stringify, W as attr_class, U as attr, a0 as head, V as ensure_array_like } from "../../../../chunks/index2.js";
import { e as escape_html } from "../../../../chunks/context.js";
function PriceChart($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { data, height = 300 } = $$props;
    $$renderer2.push(`<div class="chart-container svelte-afumdx"${attr_style(`height: ${stringify(height)}px`)}>`);
    if (data.length > 0) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<canvas class="svelte-afumdx"></canvas>`);
    } else {
      $$renderer2.push("<!--[!-->");
      $$renderer2.push(`<div class="empty-chart svelte-afumdx"><svg width="48" height="48" viewBox="0 0 48 48" fill="none"><path d="M6 36L18 24L26 32L42 16" stroke="#86868b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path><path d="M30 16H42V28" stroke="#86868b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg> <p class="svelte-afumdx">Ingen prishistorik tilgængelig endnu</p></div>`);
    }
    $$renderer2.push(`<!--]--></div>`);
  });
}
function StorePriceCard($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let {
      store,
      price,
      originalPrice,
      inStock = true,
      isLowest = false,
      index = 0
    } = $$props;
    const hasDiscount = originalPrice && originalPrice > price;
    const discountPercent = hasDiscount && originalPrice ? Math.round((1 - price / originalPrice) * 100) : 0;
    const formatPrice = (p) => {
      const whole = Math.floor(p);
      const fraction = Math.round((p - whole) * 100);
      return `${whole},${String(fraction).padStart(2, "0")}`;
    };
    const storeColors = {
      netto: "#FFD700",
      bilkatogo: "#004B93",
      foetexplus: "#00457C",
      fillop: "#E31937",
      rema1000: "#003366",
      meny: "#D4002A",
      spar: "#00843D",
      minkobmand: "#1E3A5F",
      dagrofa: "#FF6B00"
    };
    const storeColor = storeColors[store.id] || "#888888";
    let isHovered = false;
    $$renderer2.push(`<div${attr_class("store-card svelte-jiiozs", void 0, { "lowest": isLowest, "unavailable": !inStock })}${attr_style(`--store-color: ${stringify(storeColor)}; --index: ${stringify(index)}`)} role="article">`);
    if (isLowest) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="card-glow svelte-jiiozs"></div>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> <div class="card-content svelte-jiiozs"><div class="rank svelte-jiiozs"><span class="rank-number svelte-jiiozs">${escape_html(index + 1)}</span></div> <div class="store-brand svelte-jiiozs"><div class="store-avatar svelte-jiiozs"><span class="avatar-letter svelte-jiiozs">${escape_html(store.name.charAt(0))}</span> `);
    if (isLowest) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="crown-badge svelte-jiiozs"><svg width="12" height="12" viewBox="0 0 12 12" fill="none" class="svelte-jiiozs"><path d="M2 8.5L3.5 4L6 6L8.5 4L10 8.5H2Z" fill="currentColor" class="svelte-jiiozs"></path><path d="M2 9.5H10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" class="svelte-jiiozs"></path></svg></div>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--></div> <div class="store-meta svelte-jiiozs"><span class="store-name svelte-jiiozs">${escape_html(store.name)}</span> <div class="availability svelte-jiiozs"><span${attr_class("status-indicator svelte-jiiozs", void 0, { "available": inStock })}></span> <span class="status-text svelte-jiiozs">${escape_html(inStock ? "På lager" : "Ikke tilgængelig")}</span></div></div></div> <div class="price-area svelte-jiiozs">`);
    if (hasDiscount) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="savings-tag svelte-jiiozs"><svg width="10" height="10" viewBox="0 0 10 10" fill="none" class="svelte-jiiozs"><path d="M5 8V2M5 2L2 5M5 2L8 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="svelte-jiiozs"></path></svg> <span class="svelte-jiiozs">${escape_html(discountPercent)}%</span></div>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> <div class="price-row svelte-jiiozs"><span class="price-whole svelte-jiiozs">${escape_html(formatPrice(price).split(",")[0])}</span> <span class="price-fraction svelte-jiiozs">,${escape_html(formatPrice(price).split(",")[1])}</span> <span class="price-unit svelte-jiiozs">kr</span></div> `);
    if (hasDiscount && originalPrice) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<span class="was-price svelte-jiiozs">Før ${escape_html(formatPrice(originalPrice))} kr</span>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--></div> <button${attr_class("action-btn svelte-jiiozs", void 0, { "active": isHovered })}${attr("disabled", !inStock, true)}><span class="btn-text svelte-jiiozs">Gå til butik</span> <span class="btn-icon svelte-jiiozs"><svg width="16" height="16" viewBox="0 0 16 16" fill="none" class="svelte-jiiozs"><path d="M4 12L12 4M12 4H6M12 4V10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="svelte-jiiozs"></path></svg></span></button></div> `);
    if (isLowest) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="lowest-label svelte-jiiozs"><svg width="14" height="14" viewBox="0 0 14 14" fill="none" class="svelte-jiiozs"><path d="M3 7L6 10L11 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="svelte-jiiozs"></path></svg> <span class="svelte-jiiozs">Bedste pris</span></div>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--></div>`);
  });
}
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { data } = $$props;
    const formatPrice = (p) => {
      const whole = Math.floor(p);
      const fraction = Math.round((p - whole) * 100);
      return `${whole},${String(fraction).padStart(2, "0")}`;
    };
    const savings = data.highestPrice && data.lowestPrice ? data.highestPrice - data.lowestPrice : 0;
    const savingsPercent = data.highestPrice ? Math.round(savings / data.highestPrice * 100) : 0;
    let selectedImage = 0;
    let selectedTimeRange = "30";
    let imageLoaded = false;
    let isFavorite = false;
    let showStickyBar = false;
    let pageVisible = false;
    let displayPrice = 0;
    head("uk8mco", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>${escape_html(data.product?.name || "Produkt")} - PrisJagt</title>`);
      });
      $$renderer3.push(`<meta name="description"${attr("content", data.product?.description || `Se priser for ${data.product?.name}`)} class="svelte-uk8mco"/>`);
    });
    if (data.product) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div${attr_class("product-page svelte-uk8mco", void 0, { "visible": pageVisible })}><div${attr_class("sticky-bar svelte-uk8mco", void 0, { "visible": showStickyBar })}><div class="container sticky-bar-content svelte-uk8mco"><div class="sticky-product svelte-uk8mco">`);
      if (data.product.images?.[0]) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<img${attr("src", data.product.images[0])} alt="" class="sticky-image svelte-uk8mco"/>`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--> <span class="sticky-name svelte-uk8mco">${escape_html(data.product.name)}</span></div> <div class="sticky-price svelte-uk8mco"><span class="sticky-price-value svelte-uk8mco">${escape_html(formatPrice(data.lowestPrice || 0))} kr</span> <span class="sticky-store-count svelte-uk8mco">${escape_html(data.prices.length)} butikker</span></div></div></div> <div class="hero-bg svelte-uk8mco"><div class="hero-gradient-1 svelte-uk8mco"></div> <div class="hero-gradient-2 svelte-uk8mco"></div></div> <div class="container svelte-uk8mco"><nav class="breadcrumb animate-item svelte-uk8mco" style="--delay: 0ms"><a href="/" class="back-btn svelte-uk8mco"><svg width="20" height="20" viewBox="0 0 20 20" fill="none" class="svelte-uk8mco"><path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="svelte-uk8mco"></path></svg> <span class="svelte-uk8mco">Tilbage</span></a> <div class="breadcrumb-trail svelte-uk8mco"><a href="/" class="svelte-uk8mco">Hjem</a> <span class="sep svelte-uk8mco">/</span> `);
      if (data.product.categories?.level1) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<a${attr("href", `/?category=${stringify(encodeURIComponent(data.product.categories.level1))}`)} class="svelte-uk8mco">${escape_html(data.product.categories.level1)}</a> <span class="sep svelte-uk8mco">/</span>`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--> <span class="current svelte-uk8mco">${escape_html(data.product.name)}</span></div></nav> <div class="product-layout svelte-uk8mco"><div class="gallery animate-item svelte-uk8mco" style="--delay: 100ms"><div class="main-image-container svelte-uk8mco"><div${attr_class("main-image svelte-uk8mco", void 0, { "loaded": imageLoaded })}>`);
      if (data.product.images?.length > 0) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<img${attr("src", data.product.images[selectedImage])}${attr("alt", data.product.name)}${attr_class("svelte-uk8mco", void 0, { "visible": imageLoaded })} onload="this.__e=event"/> `);
        {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<div class="image-skeleton svelte-uk8mco"></div>`);
        }
        $$renderer2.push(`<!--]-->`);
      } else {
        $$renderer2.push("<!--[!-->");
        $$renderer2.push(`<div class="no-image svelte-uk8mco"><svg width="80" height="80" viewBox="0 0 80 80" fill="none" class="svelte-uk8mco"><rect x="10" y="10" width="60" height="60" rx="12" stroke="currentColor" stroke-width="2" class="svelte-uk8mco"></rect><circle cx="30" cy="30" r="6" stroke="currentColor" stroke-width="2" class="svelte-uk8mco"></circle><path d="M10 55L30 35L50 55L70 35" stroke="currentColor" stroke-width="2" stroke-linecap="round" class="svelte-uk8mco"></path></svg> <span class="svelte-uk8mco">Intet billede</span></div>`);
      }
      $$renderer2.push(`<!--]--></div> `);
      if (data.product.images?.length > 0) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<div class="image-actions svelte-uk8mco"><button class="image-action svelte-uk8mco" title="Zoom"><svg width="18" height="18" viewBox="0 0 18 18" fill="none" class="svelte-uk8mco"><circle cx="8" cy="8" r="5" stroke="currentColor" stroke-width="1.5" class="svelte-uk8mco"></circle><path d="M12 12L16 16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" class="svelte-uk8mco"></path><path d="M6 8H10M8 6V10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" class="svelte-uk8mco"></path></svg></button></div>`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--></div> `);
      if (data.product.images?.length > 1) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<div class="thumbnails svelte-uk8mco"><!--[-->`);
        const each_array = ensure_array_like(data.product.images.slice(0, 5));
        for (let i = 0, $$length = each_array.length; i < $$length; i++) {
          let image = each_array[i];
          $$renderer2.push(`<button${attr_class("thumb svelte-uk8mco", void 0, { "active": selectedImage === i })}><img${attr("src", image)} alt="" loading="lazy" class="svelte-uk8mco"/></button>`);
        }
        $$renderer2.push(`<!--]--> `);
        if (data.product.images.length > 5) {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<span class="thumb-more svelte-uk8mco">+${escape_html(data.product.images.length - 5)}</span>`);
        } else {
          $$renderer2.push("<!--[!-->");
        }
        $$renderer2.push(`<!--]--></div>`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--></div> <div class="product-info svelte-uk8mco"><div class="info-header animate-item svelte-uk8mco" style="--delay: 150ms">`);
      if (data.product.brand) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<span class="brand svelte-uk8mco">${escape_html(data.product.brand)}</span>`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--> <div class="actions svelte-uk8mco"><button${attr_class("action-btn svelte-uk8mco", void 0, { "active": isFavorite })} title="Gem som favorit"><svg width="20" height="20" viewBox="0 0 20 20"${attr("fill", "none")} class="svelte-uk8mco"><path d="M10 17.5L8.79167 16.3917C4.5 12.5083 1.66667 9.93333 1.66667 6.79167C1.66667 4.21667 3.68333 2.2 6.25 2.2C7.7 2.2 9.09167 2.86667 10 3.925C10.9083 2.86667 12.3 2.2 13.75 2.2C16.3167 2.2 18.3333 4.21667 18.3333 6.79167C18.3333 9.93333 15.5 12.5083 11.2083 16.4L10 17.5Z" stroke="currentColor" stroke-width="1.5" class="svelte-uk8mco"></path></svg></button> <div class="share-container svelte-uk8mco"><button class="action-btn svelte-uk8mco" title="Del"><svg width="20" height="20" viewBox="0 0 20 20" fill="none" class="svelte-uk8mco"><path d="M15 6.67C16.38 6.67 17.5 5.55 17.5 4.17C17.5 2.79 16.38 1.67 15 1.67C13.62 1.67 12.5 2.79 12.5 4.17C12.5 5.55 13.62 6.67 15 6.67Z" stroke="currentColor" stroke-width="1.5" class="svelte-uk8mco"></path><path d="M5 12.5C6.38 12.5 7.5 11.38 7.5 10C7.5 8.62 6.38 7.5 5 7.5C3.62 7.5 2.5 8.62 2.5 10C2.5 11.38 3.62 12.5 5 12.5Z" stroke="currentColor" stroke-width="1.5" class="svelte-uk8mco"></path><path d="M15 18.33C16.38 18.33 17.5 17.21 17.5 15.83C17.5 14.45 16.38 13.33 15 13.33C13.62 13.33 12.5 14.45 12.5 15.83C12.5 17.21 13.62 18.33 15 18.33Z" stroke="currentColor" stroke-width="1.5" class="svelte-uk8mco"></path><path d="M7.16 11.26L12.85 14.58M12.84 5.43L7.16 8.74" stroke="currentColor" stroke-width="1.5" class="svelte-uk8mco"></path></svg></button> `);
      {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--></div></div></div> <h1 class="product-name animate-item svelte-uk8mco" style="--delay: 200ms">${escape_html(data.product.name)}</h1> `);
      if (data.lowestPrice) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<div class="price-card animate-item svelte-uk8mco" style="--delay: 250ms"><div class="price-card-header svelte-uk8mco"><div class="best-price-tag svelte-uk8mco"><svg width="16" height="16" viewBox="0 0 16 16" fill="none" class="svelte-uk8mco"><path d="M6 8L7.33 9.33L10 6.67" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="svelte-uk8mco"></path><circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="1.5" class="svelte-uk8mco"></circle></svg> Bedste pris nu</div> `);
        if (savings > 0) {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<div class="savings-pill svelte-uk8mco">Spar ${escape_html(savingsPercent)}%</div>`);
        } else {
          $$renderer2.push("<!--[!-->");
        }
        $$renderer2.push(`<!--]--></div> <div class="price-main svelte-uk8mco"><span class="price-integer svelte-uk8mco">${escape_html(formatPrice(displayPrice).split(",")[0])}</span> <span class="price-decimal svelte-uk8mco">,${escape_html(formatPrice(displayPrice).split(",")[1])}</span> <span class="price-currency svelte-uk8mco">kr</span></div> `);
        if (savings > 0) {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<div class="price-comparison svelte-uk8mco"><div class="comparison-item lowest svelte-uk8mco"><span class="comparison-label svelte-uk8mco">Laveste</span> <span class="comparison-value svelte-uk8mco">${escape_html(formatPrice(data.lowestPrice))} kr</span></div> <div class="comparison-bar svelte-uk8mco"><div class="bar-track svelte-uk8mco"><div class="bar-fill svelte-uk8mco"${attr_style(`width: ${stringify(Math.min(30 + savingsPercent, 100))}%`)}></div> <div class="bar-indicator svelte-uk8mco"></div></div></div> <div class="comparison-item highest svelte-uk8mco"><span class="comparison-label svelte-uk8mco">Højeste</span> <span class="comparison-value svelte-uk8mco">${escape_html(formatPrice(data.highestPrice || data.lowestPrice))} kr</span></div></div>`);
        } else {
          $$renderer2.push("<!--[!-->");
        }
        $$renderer2.push(`<!--]--> <div class="store-count-row svelte-uk8mco"><svg width="16" height="16" viewBox="0 0 16 16" fill="none" class="svelte-uk8mco"><path d="M2 4H14M4 8H12M6 12H10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" class="svelte-uk8mco"></path></svg> Tilgængelig i <strong class="svelte-uk8mco">${escape_html(data.prices.length)}</strong> butikker</div></div>`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--> `);
      if (data.product.description) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<div class="description animate-item svelte-uk8mco" style="--delay: 300ms"><h3 class="svelte-uk8mco"><svg width="18" height="18" viewBox="0 0 18 18" fill="none" class="svelte-uk8mco"><path d="M3 4.5H15M3 9H12M3 13.5H9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" class="svelte-uk8mco"></path></svg> Beskrivelse</h3> <p class="svelte-uk8mco">${escape_html(data.product.description)}</p></div>`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--> <div class="meta-grid animate-item svelte-uk8mco" style="--delay: 350ms">`);
      if (data.product.gtin) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<div class="meta-chip svelte-uk8mco"><span class="chip-label svelte-uk8mco">GTIN</span> <span class="chip-value svelte-uk8mco">${escape_html(data.product.gtin)}</span></div>`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--> `);
      if (data.product.article) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<div class="meta-chip svelte-uk8mco"><span class="chip-label svelte-uk8mco">Artikel</span> <span class="chip-value svelte-uk8mco">${escape_html(data.product.article)}</span></div>`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--> `);
      if (data.product.categories?.level1) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<div class="meta-chip svelte-uk8mco"><span class="chip-label svelte-uk8mco">Kategori</span> <span class="chip-value svelte-uk8mco">${escape_html(data.product.categories.level1)}</span></div>`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--></div></div></div> <section class="section animate-section svelte-uk8mco" style="--delay: 400ms"><div class="section-header svelte-uk8mco"><div class="section-title svelte-uk8mco"><div class="section-icon svelte-uk8mco"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" class="svelte-uk8mco"><path d="M3 9H21M7 15H9M15 15H17M5 19H19C20.1 19 21 18.1 21 17V7C21 5.9 20.1 5 19 5H5C3.9 5 3 5.9 3 7V17C3 18.1 3.9 19 5 19Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" class="svelte-uk8mco"></path></svg></div> <h2 class="svelte-uk8mco">Sammenlign priser</h2></div> <span class="section-count svelte-uk8mco">${escape_html(data.prices.length)} butikker</span></div> `);
      if (data.prices.length > 0) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<div class="store-list svelte-uk8mco"><!--[-->`);
        const each_array_1 = ensure_array_like(data.prices);
        for (let index = 0, $$length = each_array_1.length; index < $$length; index++) {
          let priceData = each_array_1[index];
          StorePriceCard($$renderer2, {
            store: priceData.store,
            price: priceData.price,
            originalPrice: priceData.originalPrice,
            inStock: priceData.inStock,
            isLowest: priceData.isLowest,
            index
          });
        }
        $$renderer2.push(`<!--]--></div>`);
      } else {
        $$renderer2.push("<!--[!-->");
        $$renderer2.push(`<div class="empty-card svelte-uk8mco"><svg width="48" height="48" viewBox="0 0 48 48" fill="none" class="svelte-uk8mco"><circle cx="24" cy="24" r="18" stroke="currentColor" stroke-width="2" class="svelte-uk8mco"></circle><path d="M24 14V26M24 34H24.02" stroke="currentColor" stroke-width="2" stroke-linecap="round" class="svelte-uk8mco"></path></svg> <p class="svelte-uk8mco">Ingen prisoplysninger</p></div>`);
      }
      $$renderer2.push(`<!--]--></section> <section class="section animate-section svelte-uk8mco" style="--delay: 500ms"><div class="section-header svelte-uk8mco"><div class="section-title svelte-uk8mco"><div class="section-icon svelte-uk8mco"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" class="svelte-uk8mco"><path d="M3 20L8 15L13 18L21 10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" class="svelte-uk8mco"></path><path d="M17 10H21V14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" class="svelte-uk8mco"></path></svg></div> <h2 class="svelte-uk8mco">Prishistorik</h2></div> <div class="time-pills svelte-uk8mco"><button${attr_class("time-pill svelte-uk8mco", void 0, { "active": selectedTimeRange === "30" })}>30 dage</button> <button${attr_class("time-pill svelte-uk8mco", void 0, { "active": selectedTimeRange === "90" })}>90 dage</button> <button${attr_class("time-pill svelte-uk8mco", void 0, { "active": selectedTimeRange === "365" })}>1 år</button></div></div> <div class="chart-wrapper svelte-uk8mco">`);
      PriceChart($$renderer2, { data: data.priceHistory, height: 320 });
      $$renderer2.push(`<!----></div> <div class="stats-row svelte-uk8mco"><div class="stat-item low svelte-uk8mco"><div class="stat-icon-wrap svelte-uk8mco"><svg width="18" height="18" viewBox="0 0 18 18" fill="none" class="svelte-uk8mco"><path d="M9 4V14M9 14L5 10M9 14L13 10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" class="svelte-uk8mco"></path></svg></div> <div class="stat-text svelte-uk8mco"><span class="stat-label svelte-uk8mco">Laveste</span> <span class="stat-num svelte-uk8mco">${escape_html(formatPrice(Math.min(...data.priceHistory.map((p) => p.price))))} kr</span></div></div> <div class="stat-item high svelte-uk8mco"><div class="stat-icon-wrap svelte-uk8mco"><svg width="18" height="18" viewBox="0 0 18 18" fill="none" class="svelte-uk8mco"><path d="M9 14V4M9 4L5 8M9 4L13 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" class="svelte-uk8mco"></path></svg></div> <div class="stat-text svelte-uk8mco"><span class="stat-label svelte-uk8mco">Højeste</span> <span class="stat-num svelte-uk8mco">${escape_html(formatPrice(Math.max(...data.priceHistory.map((p) => p.price))))} kr</span></div></div> <div class="stat-item avg svelte-uk8mco"><div class="stat-icon-wrap svelte-uk8mco"><svg width="18" height="18" viewBox="0 0 18 18" fill="none" class="svelte-uk8mco"><path d="M3 9H15M6 6L3 9L6 12M12 6L15 9L12 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" class="svelte-uk8mco"></path></svg></div> <div class="stat-text svelte-uk8mco"><span class="stat-label svelte-uk8mco">Gennemsnit</span> <span class="stat-num svelte-uk8mco">${escape_html(formatPrice(Math.round(data.priceHistory.reduce((a, b) => a + b.price, 0) / data.priceHistory.length)))} kr</span></div></div></div></section> <section class="alert-cta animate-section svelte-uk8mco" style="--delay: 600ms"><div class="alert-visual svelte-uk8mco"><div class="alert-icon-bg svelte-uk8mco"><svg width="32" height="32" viewBox="0 0 32 32" fill="none" class="svelte-uk8mco"><path d="M16 6V16L22 22" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" class="svelte-uk8mco"></path><circle cx="16" cy="16" r="12" stroke="currentColor" stroke-width="2.5" class="svelte-uk8mco"></circle></svg></div> <div class="alert-rings svelte-uk8mco"><div class="ring svelte-uk8mco"></div> <div class="ring svelte-uk8mco"></div></div></div> <div class="alert-text svelte-uk8mco"><h3 class="svelte-uk8mco">Vil du have besked når prisen falder?</h3> <p class="svelte-uk8mco">Opret en prisalarm og bliv den første til at vide det</p></div> <button class="alert-button svelte-uk8mco"><svg width="20" height="20" viewBox="0 0 20 20" fill="none" class="svelte-uk8mco"><path d="M10 2.5C6.5 2.5 4.17 5.83 4.17 8.33C4.17 10.83 3.33 12.5 2.5 13.33H17.5C16.67 12.5 15.83 10.83 15.83 8.33C15.83 5.83 13.5 2.5 10 2.5Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" class="svelte-uk8mco"></path><path d="M8.33 13.33V14.17C8.33 15.08 9.08 15.83 10 15.83C10.92 15.83 11.67 15.08 11.67 14.17V13.33" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" class="svelte-uk8mco"></path></svg> <span class="svelte-uk8mco">Opret prisalarm</span></button></section></div></div>`);
    } else {
      $$renderer2.push("<!--[!-->");
      $$renderer2.push(`<div class="not-found-page svelte-uk8mco"><div class="container svelte-uk8mco"><div class="not-found-content svelte-uk8mco"><div class="not-found-icon svelte-uk8mco"><svg width="80" height="80" viewBox="0 0 80 80" fill="none" class="svelte-uk8mco"><circle cx="40" cy="40" r="30" stroke="currentColor" stroke-width="2" class="svelte-uk8mco"></circle><path d="M30 30L50 50M50 30L30 50" stroke="currentColor" stroke-width="2" stroke-linecap="round" class="svelte-uk8mco"></path></svg></div> <h1 class="svelte-uk8mco">Produkt ikke fundet</h1> <p class="svelte-uk8mco">Det valgte produkt kunne desværre ikke findes.</p> <a href="/" class="home-btn svelte-uk8mco"><svg width="20" height="20" viewBox="0 0 20 20" fill="none" class="svelte-uk8mco"><path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" class="svelte-uk8mco"></path></svg> Tilbage til forsiden</a></div></div></div>`);
    }
    $$renderer2.push(`<!--]-->`);
  });
}
export {
  _page as default
};
