import { Y as attr_style, W as attr_class, V as ensure_array_like, X as bind_props, U as attr, _ as stringify, a0 as head } from "../../chunks/index2.js";
import { g as goto } from "../../chunks/client.js";
import { e as escape_html } from "../../chunks/context.js";
function CategoryPills($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { categories, selected = "", onSelect } = $$props;
    let indicatorStyle = "";
    let isInitialized = false;
    $$renderer2.push(`<div class="category-container svelte-13fbkwk"><div class="fade-left svelte-13fbkwk"></div> <div class="fade-right svelte-13fbkwk"></div> <div class="category-pills hide-scrollbar svelte-13fbkwk"${attr_style(indicatorStyle)}><div${attr_class("pill-indicator svelte-13fbkwk", void 0, { "visible": isInitialized })}></div> <button${attr_class("pill all-pill svelte-13fbkwk", void 0, { "active": !selected })}><span class="pill-content svelte-13fbkwk"><svg class="pill-icon svelte-13fbkwk" width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="2" y="2" width="5" height="5" rx="1.5" stroke="currentColor" stroke-width="1.5"></rect><rect x="9" y="2" width="5" height="5" rx="1.5" stroke="currentColor" stroke-width="1.5"></rect><rect x="2" y="9" width="5" height="5" rx="1.5" stroke="currentColor" stroke-width="1.5"></rect><rect x="9" y="9" width="5" height="5" rx="1.5" stroke="currentColor" stroke-width="1.5"></rect></svg> <span class="pill-text svelte-13fbkwk">Alle</span></span></button> <!--[-->`);
    const each_array = ensure_array_like(categories);
    for (let i = 0, $$length = each_array.length; i < $$length; i++) {
      let category = each_array[i];
      $$renderer2.push(`<button${attr_class("pill svelte-13fbkwk", void 0, { "active": selected === category.id })}><span class="pill-content svelte-13fbkwk">`);
      if (category.icon) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<span class="emoji-icon svelte-13fbkwk">${escape_html(category.icon)}</span>`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--> <span class="pill-text svelte-13fbkwk">${escape_html(category.name)}</span></span></button>`);
    }
    $$renderer2.push(`<!--]--></div></div>`);
    bind_props($$props, { selected });
  });
}
function ProductCard($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { product, index = 0 } = $$props;
    const hasDiscount = product.originalPrice && product.originalPrice > product.price;
    const discountPercent = hasDiscount ? Math.round((1 - product.price / product.originalPrice) * 100) : 0;
    const imageUrl = product.image_primary || product.images?.[0] || "";
    const formatPrice = (p) => {
      const whole = Math.floor(p);
      const fraction = Math.round((p - whole) * 100);
      return { whole, fraction: String(fraction).padStart(2, "0") };
    };
    const priceFormatted = formatPrice(product.price);
    let imageLoaded = false;
    $$renderer2.push(`<a${attr("href", `/product/${stringify(product._id)}`)} class="product-card svelte-11ja2cl"${attr_style(`--delay: ${stringify(index * 30)}ms; --store-color: ${stringify(product.storeColor)}`)}><div class="store-indicator svelte-11ja2cl"></div> <div class="image-section svelte-11ja2cl">`);
    if (imageUrl && true) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<img${attr("src", imageUrl)}${attr("alt", product.name)} loading="lazy"${attr_class("svelte-11ja2cl", void 0, { "loaded": imageLoaded })} onload="this.__e=event" onerror="this.__e=event"/>`);
    } else {
      $$renderer2.push("<!--[!-->");
      $$renderer2.push(`<div class="image-placeholder svelte-11ja2cl"><svg width="32" height="32" viewBox="0 0 32 32" fill="none"><rect x="4" y="4" width="24" height="24" rx="4" stroke="currentColor" stroke-width="1.5"></rect><circle cx="11" cy="11" r="2.5" stroke="currentColor" stroke-width="1.5"></circle><path d="M4 22L12 14L20 22L28 14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"></path></svg></div>`);
    }
    $$renderer2.push(`<!--]--> `);
    if (hasDiscount) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="discount-tag svelte-11ja2cl">-${escape_html(discountPercent)}%</div>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--></div> <div class="content svelte-11ja2cl"><div class="store-name svelte-11ja2cl">${escape_html(product.storeName)}</div> <h3 class="product-name svelte-11ja2cl">${escape_html(product.name)}</h3> <div class="price-row svelte-11ja2cl"><div class="price svelte-11ja2cl"><span class="price-whole svelte-11ja2cl">${escape_html(priceFormatted.whole)}</span> <span class="price-fraction svelte-11ja2cl">,${escape_html(priceFormatted.fraction)}</span> <span class="price-currency svelte-11ja2cl">kr</span></div> `);
    if (hasDiscount) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<span class="original-price svelte-11ja2cl">${escape_html(formatPrice(product.originalPrice).whole)},${escape_html(formatPrice(product.originalPrice).fraction)} kr</span>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--></div></div></a>`);
  });
}
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { data } = $$props;
    let searchValue = "";
    let heroVisible = false;
    function handleCategorySelect(categoryId) {
      const params = new URLSearchParams();
      if (categoryId) params.set("category", categoryId);
      params.toString();
      goto();
    }
    const stores = [
      { id: "rema1000", name: "Rema 1000", color: "#003366" },
      { id: "netto", name: "Netto", color: "#FFD700" },
      { id: "foetexplus", name: "Føtex+", color: "#00457C" },
      { id: "bilkatogo", name: "Bilka", color: "#004B93" },
      { id: "meny", name: "Meny", color: "#D4002A" },
      { id: "spar", name: "Spar", color: "#00843D" }
    ];
    head("1uha8ag", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>PrisJagt - Sammenlign priser på dagligvarer</title>`);
      });
      $$renderer3.push(`<meta name="description" content="Find de bedste priser på dagligvarer. Sammenlign priser fra Netto, Bilka, Føtex, Rema 1000 og mange flere."/>`);
    });
    $$renderer2.push(`<div class="page svelte-1uha8ag"><section${attr_class("hero svelte-1uha8ag", void 0, { "visible": heroVisible })}><div class="hero-bg svelte-1uha8ag"><div class="hero-gradient svelte-1uha8ag"></div></div> <div class="container hero-content svelte-1uha8ag"><h1 class="hero-title svelte-1uha8ag"><span class="title-line svelte-1uha8ag">Find de</span> <span class="title-line title-highlight svelte-1uha8ag">bedste priser</span> <span class="title-line svelte-1uha8ag">på dagligvarer</span></h1> <p class="hero-subtitle svelte-1uha8ag">Sammenlign priser fra 6 supermarkeder</p> <form class="hero-search svelte-1uha8ag"><div class="search-wrapper svelte-1uha8ag"><svg class="search-icon svelte-1uha8ag" width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="9" cy="9" r="6" stroke="currentColor" stroke-width="2"></circle><path d="M14 14L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"></path></svg> <input type="search"${attr("value", searchValue)} placeholder="Søg efter produkter..." class="search-input svelte-1uha8ag"/> <button type="submit" class="search-button svelte-1uha8ag">Søg</button></div></form></div></section> <section class="stores-section svelte-1uha8ag"><div class="container"><div class="stores-header svelte-1uha8ag"><span class="stores-label svelte-1uha8ag">${escape_html(data.selectedStore ? "Filtreret efter butik" : "Filtrer efter butik")}</span></div> <div class="stores-track svelte-1uha8ag"><!--[-->`);
    const each_array = ensure_array_like(stores);
    for (let i = 0, $$length = each_array.length; i < $$length; i++) {
      let store = each_array[i];
      $$renderer2.push(`<a${attr("href", data.selectedStore === store.id ? "/" : `/?store=${store.id}`)}${attr_class("store-badge svelte-1uha8ag", void 0, { "active": data.selectedStore === store.id })}${attr_style(`--delay: ${stringify(i * 50)}ms; --store-color: ${stringify(store.color)}`)}><span class="store-initial svelte-1uha8ag">${escape_html(store.name.charAt(0))}</span> <span class="store-name svelte-1uha8ag">${escape_html(store.name)}</span> `);
      if (data.selectedStore === store.id) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<span class="store-check svelte-1uha8ag">✓</span>`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--></a>`);
    }
    $$renderer2.push(`<!--]--> `);
    if (data.selectedStore) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<a href="/" class="stores-clear svelte-1uha8ag"><svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M10.5 3.5L3.5 10.5M3.5 3.5L10.5 10.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"></path></svg> <span>Vis alle</span></a>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--></div></div></section> <section class="categories-section svelte-1uha8ag"><div class="container">`);
    CategoryPills($$renderer2, {
      categories: data.categories,
      selected: data.selectedCategory,
      onSelect: handleCategorySelect
    });
    $$renderer2.push(`<!----></div></section> <section class="products-section svelte-1uha8ag"><div class="container"><div class="section-header svelte-1uha8ag"><div class="section-title-group svelte-1uha8ag"><h2 class="section-title svelte-1uha8ag">`);
    if (data.query) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`Resultater for "${escape_html(data.query)}"`);
    } else {
      $$renderer2.push("<!--[!-->");
      if (data.selectedStore) {
        $$renderer2.push("<!--[-->");
        const store = stores.find((s) => s.id === data.selectedStore);
        $$renderer2.push(`Produkter fra ${escape_html(store?.name || data.selectedStore)}`);
      } else {
        $$renderer2.push("<!--[!-->");
        if (data.selectedCategory) {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`${escape_html(data.selectedCategory)}`);
        } else {
          $$renderer2.push("<!--[!-->");
          $$renderer2.push(`Alle produkter`);
        }
        $$renderer2.push(`<!--]-->`);
      }
      $$renderer2.push(`<!--]-->`);
    }
    $$renderer2.push(`<!--]--></h2> <div class="product-count-badge svelte-1uha8ag"><span class="count-number svelte-1uha8ag">${escape_html(data.total.toLocaleString("da-DK"))}</span> <span class="count-label svelte-1uha8ag">produkter</span></div></div> `);
    if (data.query || data.selectedCategory || data.selectedStore) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<a href="/" class="clear-filters svelte-1uha8ag"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M12 4L4 12M4 4L12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"></path></svg> <span>Ryd filtre</span></a>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--></div> `);
    if (data.products.length > 0) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="products-grid svelte-1uha8ag"><!--[-->`);
      const each_array_1 = ensure_array_like(data.products);
      for (let index = 0, $$length = each_array_1.length; index < $$length; index++) {
        let product = each_array_1[index];
        ProductCard($$renderer2, { product, index });
      }
      $$renderer2.push(`<!--]--></div> `);
      if (data.total > data.products.length) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<div class="load-more svelte-1uha8ag"><button class="load-more-btn svelte-1uha8ag"><span>Vis flere produkter</span> <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 3V13M8 13L3 8M8 13L13 8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg></button></div>`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]-->`);
    } else {
      $$renderer2.push("<!--[!-->");
      $$renderer2.push(`<div class="empty-state svelte-1uha8ag"><div class="empty-icon svelte-1uha8ag"><svg width="80" height="80" viewBox="0 0 80 80" fill="none"><circle cx="35" cy="35" r="20" stroke="currentColor" stroke-width="3"></circle><path d="M50 50L65 65" stroke="currentColor" stroke-width="3" stroke-linecap="round"></path><path d="M28 35H42" stroke="currentColor" stroke-width="3" stroke-linecap="round"></path></svg></div> <h3 class="svelte-1uha8ag">Ingen produkter fundet</h3> <p class="svelte-1uha8ag">Prøv at søge efter noget andet eller fjern dine filtre</p> <a href="/" class="btn-primary svelte-1uha8ag"><span>Se alle produkter</span> <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8H13M13 8L8 3M13 8L8 13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg></a></div>`);
    }
    $$renderer2.push(`<!--]--></div></section></div>`);
  });
}
export {
  _page as default
};
