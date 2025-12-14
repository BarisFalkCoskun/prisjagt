import "clsx";
import { U as attr, V as ensure_array_like, W as attr_class, X as bind_props, Y as attr_style, Z as store_get, _ as stringify, $ as unsubscribe_stores } from "../../chunks/index2.js";
import { g as getContext, e as escape_html } from "../../chunks/context.js";
import "@sveltejs/kit/internal";
import "../../chunks/exports.js";
import "../../chunks/utils.js";
import "@sveltejs/kit/internal/server";
import "../../chunks/state.svelte.js";
const getStores = () => {
  const stores$1 = getContext("__svelte__");
  return {
    /** @type {typeof page} */
    page: {
      subscribe: stores$1.page.subscribe
    },
    /** @type {typeof navigating} */
    navigating: {
      subscribe: stores$1.navigating.subscribe
    },
    /** @type {typeof updated} */
    updated: stores$1.updated
  };
};
const page = {
  subscribe(fn) {
    const store = getStores().page;
    return store.subscribe(fn);
  }
};
function SpotlightSearch($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { open = false, onClose } = $$props;
    let query = "";
    let results = [];
    let selectedIndex = 0;
    const recentSearches = ["Mælk", "Bananer", "Brød", "Æg"];
    function formatPrice(p) {
      const whole = Math.floor(p);
      const fraction = Math.round((p - whole) * 100);
      return `${whole},${String(fraction).padStart(2, "0")} kr`;
    }
    if (open) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="spotlight-overlay svelte-kcwhog"><div class="spotlight-container animate-scale-in svelte-kcwhog"><div class="search-header svelte-kcwhog"><div class="search-icon svelte-kcwhog"><svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M17.5 17.5L13.875 13.875M15.8333 9.16667C15.8333 12.8486 12.8486 15.8333 9.16667 15.8333C5.48477 15.8333 2.5 12.8486 2.5 9.16667C2.5 5.48477 5.48477 2.5 9.16667 2.5C12.8486 2.5 15.8333 5.48477 15.8333 9.16667Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg></div> <input${attr("value", query)} type="text" placeholder="Søg efter produkter..." class="search-input svelte-kcwhog"/> `);
      {
        $$renderer2.push("<!--[!-->");
        $$renderer2.push(`<kbd class="keyboard-shortcut svelte-kcwhog">ESC</kbd>`);
      }
      $$renderer2.push(`<!--]--></div> <div class="search-body svelte-kcwhog">`);
      if (results.length > 0) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<div class="results-section"><div class="section-label svelte-kcwhog">Produkter</div> <div class="results-list svelte-kcwhog"><!--[-->`);
        const each_array = ensure_array_like(results);
        for (let index = 0, $$length = each_array.length; index < $$length; index++) {
          let product = each_array[index];
          $$renderer2.push(`<button${attr_class("result-item svelte-kcwhog", void 0, { "selected": index === selectedIndex })}><div class="result-image svelte-kcwhog">`);
          if (product.images?.[0]) {
            $$renderer2.push("<!--[-->");
            $$renderer2.push(`<img${attr("src", product.images[0])} alt="" class="svelte-kcwhog"/>`);
          } else {
            $$renderer2.push("<!--[!-->");
            $$renderer2.push(`<div class="image-placeholder svelte-kcwhog"><svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="2" y="2" width="16" height="16" rx="2" stroke="currentColor" stroke-width="1.5"></rect><circle cx="7" cy="7" r="1.5" stroke="currentColor" stroke-width="1.5"></circle><path d="M2 14L7 9L11 13L18 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg></div>`);
          }
          $$renderer2.push(`<!--]--></div> <div class="result-info svelte-kcwhog"><span class="result-name svelte-kcwhog">${escape_html(product.name)}</span> `);
          if (product.brand) {
            $$renderer2.push("<!--[-->");
            $$renderer2.push(`<span class="result-brand svelte-kcwhog">${escape_html(product.brand)}</span>`);
          } else {
            $$renderer2.push("<!--[!-->");
          }
          $$renderer2.push(`<!--]--></div> <div class="result-price svelte-kcwhog">${escape_html(formatPrice(product.price || 0))}</div> <div class="result-arrow svelte-kcwhog"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 12L10 8L6 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg></div></button>`);
        }
        $$renderer2.push(`<!--]--></div></div>`);
      } else {
        $$renderer2.push("<!--[!-->");
        if (query.length >= 2 && true) {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<div class="empty-results svelte-kcwhog"><div class="empty-icon svelte-kcwhog"><svg width="48" height="48" viewBox="0 0 48 48" fill="none"><circle cx="22" cy="22" r="14" stroke="currentColor" stroke-width="2"></circle><path d="M32 32L42 42" stroke="currentColor" stroke-width="2" stroke-linecap="round"></path><path d="M16 22H28" stroke="currentColor" stroke-width="2" stroke-linecap="round"></path></svg></div> <p>Ingen produkter fundet for "${escape_html(query)}"</p></div>`);
        } else {
          $$renderer2.push("<!--[!-->");
          $$renderer2.push(`<div class="suggestions"><div class="section-label svelte-kcwhog">Seneste søgninger</div> <div class="suggestions-list svelte-kcwhog"><!--[-->`);
          const each_array_1 = ensure_array_like(recentSearches);
          for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
            let search = each_array_1[$$index_1];
            $$renderer2.push(`<button class="suggestion-item svelte-kcwhog"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 14C11.3137 14 14 11.3137 14 8C14 4.68629 11.3137 2 8 2C4.68629 2 2 4.68629 2 8C2 11.3137 4.68629 14 8 14Z" stroke="currentColor" stroke-width="1.5"></path><path d="M8 5V8L10 10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"></path></svg> <span>${escape_html(search)}</span></button>`);
          }
          $$renderer2.push(`<!--]--></div> <div class="section-label svelte-kcwhog" style="margin-top: var(--space-4)">Populære kategorier</div> <div class="category-pills svelte-kcwhog"><a href="/?category=Frugt%20%26%20gr%C3%B8nt" class="category-pill svelte-kcwhog"><span class="pill-icon svelte-kcwhog">🥬</span> <span>Frugt &amp; grønt</span></a> <a href="/?category=Mejeri%20%26%20k%C3%B8l" class="category-pill svelte-kcwhog"><span class="pill-icon svelte-kcwhog">🥛</span> <span>Mejeri &amp; køl</span></a> <a href="/?category=Frost" class="category-pill svelte-kcwhog"><span class="pill-icon svelte-kcwhog">❄️</span> <span>Frost</span></a></div></div>`);
        }
        $$renderer2.push(`<!--]-->`);
      }
      $$renderer2.push(`<!--]--></div> <div class="search-footer svelte-kcwhog"><div class="footer-hint svelte-kcwhog"><kbd class="svelte-kcwhog">↑</kbd><kbd class="svelte-kcwhog">↓</kbd> navigér</div> <div class="footer-hint svelte-kcwhog"><kbd class="svelte-kcwhog">↵</kbd> vælg</div> <div class="footer-hint svelte-kcwhog"><kbd class="svelte-kcwhog">esc</kbd> luk</div></div></div></div>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]-->`);
    bind_props($$props, { open });
  });
}
function Header($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let scrollY = 0;
    let scrolled = false;
    let mobileMenuOpen = false;
    let spotlightOpen = false;
    const navLinks = [
      { href: "/", label: "Produkter", icon: "home" },
      { href: "/stores", label: "Butikker", icon: "store" },
      { href: "/savings", label: "Besparelser", icon: "savings" }
    ];
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      $$renderer3.push(`<header${attr_class("header svelte-1elxaub", void 0, { "scrolled": scrolled, "hidden": false })}${attr_style(`--scroll-progress: ${stringify(Math.min(scrollY / 100, 1))}`)}><div class="header-blur svelte-1elxaub"></div> <div class="header-content container svelte-1elxaub"><a href="/" class="logo svelte-1elxaub"><div class="logo-icon svelte-1elxaub"><svg width="32" height="32" viewBox="0 0 32 32" fill="none"><rect width="32" height="32" rx="8" fill="url(#logo-grad)"></rect><path d="M9 16L14 21L23 11" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"></path><defs><linearGradient id="logo-grad" x1="0" y1="0" x2="32" y2="32"><stop stop-color="#00C853"></stop><stop offset="1" stop-color="#00BFA5"></stop></linearGradient></defs></svg></div> <span class="logo-text svelte-1elxaub">PrisJagt</span></a> <nav class="nav svelte-1elxaub"><div class="nav-track svelte-1elxaub"><!--[-->`);
      const each_array = ensure_array_like(navLinks);
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let link = each_array[$$index];
        $$renderer3.push(`<a${attr("href", link.href)}${attr_class("nav-link svelte-1elxaub", void 0, {
          "active": store_get($$store_subs ??= {}, "$page", page).url.pathname === link.href
        })}>${escape_html(link.label)}</a>`);
      }
      $$renderer3.push(`<!--]--> <div class="nav-indicator svelte-1elxaub"${attr_style(`--index: ${stringify(navLinks.findIndex((l) => l.href === store_get($$store_subs ??= {}, "$page", page).url.pathname))}`)}></div></div></nav> <div class="header-actions svelte-1elxaub"><button class="search-trigger svelte-1elxaub" aria-label="Søg (⌘K)"><div class="search-icon svelte-1elxaub"><svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="8" cy="8" r="5.5" stroke="currentColor" stroke-width="1.5"></circle><path d="M12.5 12.5L16 16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"></path></svg></div> <span class="search-label svelte-1elxaub">Søg</span> <kbd class="search-kbd svelte-1elxaub">⌘K</kbd></button> <button class="theme-toggle svelte-1elxaub"${attr("aria-label", "Skift til mørk tilstand")}>`);
      {
        $$renderer3.push("<!--[!-->");
        $$renderer3.push(`<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>`);
      }
      $$renderer3.push(`<!--]--></button> <button${attr_class("menu-toggle svelte-1elxaub", void 0, { "open": mobileMenuOpen })}${attr("aria-label", "Åbn menu")}><span class="menu-line svelte-1elxaub"></span> <span class="menu-line svelte-1elxaub"></span></button></div></div></header> `);
      {
        $$renderer3.push("<!--[!-->");
      }
      $$renderer3.push(`<!--]--> `);
      SpotlightSearch($$renderer3, {
        get open() {
          return spotlightOpen;
        },
        set open($$value) {
          spotlightOpen = $$value;
          $$settled = false;
        }
      });
      $$renderer3.push(`<!---->`);
    }
    do {
      $$settled = true;
      $$inner_renderer = $$renderer2.copy();
      $$render_inner($$inner_renderer);
    } while (!$$settled);
    $$renderer2.subsume($$inner_renderer);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
function Footer($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    const currentYear = (/* @__PURE__ */ new Date()).getFullYear();
    let isVisible = false;
    const stores = [
      { name: "Rema 1000", href: "/?store=rema1000" },
      { name: "Netto", href: "/?store=netto" },
      { name: "Meny", href: "/?store=meny" },
      { name: "Spar", href: "/?store=spar" },
      { name: "Bilka To Go", href: "/?store=bilkatogo" },
      { name: "Føtex+", href: "/?store=foetexplus" },
      { name: "Min Købmand", href: "/?store=minkobmand" },
      { name: "Dagrofa", href: "/?store=dagrofa" }
    ];
    const categories = [
      {
        name: "Frugt & grønt",
        href: "/?category=Frugt%20%26%20gr%C3%B8nt"
      },
      {
        name: "Mejeri & køl",
        href: "/?category=Mejeri%20%26%20k%C3%B8l"
      },
      { name: "Frost", href: "/?category=Frost" },
      { name: "Drikkevarer", href: "/?category=Drikkevarer" },
      { name: "Kolonial", href: "/?category=Kolonial" }
    ];
    const aboutLinks = [
      { name: "Om PrisJagt", href: "/about" },
      { name: "Privatlivspolitik", href: "/privacy" },
      { name: "Betingelser", href: "/terms" },
      { name: "Kontakt", href: "/contact" }
    ];
    const socialLinks = [
      { name: "Twitter", icon: "twitter", href: "#" },
      { name: "Facebook", icon: "facebook", href: "#" },
      { name: "Instagram", icon: "instagram", href: "#" }
    ];
    $$renderer2.push(`<footer${attr_class("footer svelte-jz8lnl", void 0, { "visible": isVisible })}><div class="footer-gradient-line svelte-jz8lnl"></div> <div class="footer-content container svelte-jz8lnl"><div class="footer-main svelte-jz8lnl"><div class="footer-brand svelte-jz8lnl" style="--delay: 0ms"><a href="/" class="footer-logo svelte-jz8lnl"><div class="logo-icon svelte-jz8lnl"><svg width="36" height="36" viewBox="0 0 36 36" fill="none" class="svelte-jz8lnl"><rect width="36" height="36" rx="10" fill="url(#footer-logo-gradient)" class="svelte-jz8lnl"></rect><path d="M10 18L15.5 23.5L26 13" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="svelte-jz8lnl"></path><defs class="svelte-jz8lnl"><linearGradient id="footer-logo-gradient" x1="0" y1="0" x2="36" y2="36" class="svelte-jz8lnl"><stop stop-color="#00C853" class="svelte-jz8lnl"></stop><stop offset="1" stop-color="#00BFA5" class="svelte-jz8lnl"></stop></linearGradient></defs></svg></div> <span class="logo-text svelte-jz8lnl">PrisJagt</span></a> <p class="footer-tagline svelte-jz8lnl">Find de bedste priser på dagligvarer fra alle dine foretrukne butikker. Spar tid og penge med smart prissammenligning.</p> <div class="social-links svelte-jz8lnl"><!--[-->`);
    const each_array = ensure_array_like(socialLinks);
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let social = each_array[$$index];
      $$renderer2.push(`<a${attr("href", social.href)} class="social-link svelte-jz8lnl"${attr("aria-label", social.name)}>`);
      if (social.icon === "twitter") {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="svelte-jz8lnl"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" class="svelte-jz8lnl"></path></svg>`);
      } else {
        $$renderer2.push("<!--[!-->");
        if (social.icon === "facebook") {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="svelte-jz8lnl"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" class="svelte-jz8lnl"></path></svg>`);
        } else {
          $$renderer2.push("<!--[!-->");
          if (social.icon === "instagram") {
            $$renderer2.push("<!--[-->");
            $$renderer2.push(`<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="svelte-jz8lnl"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" class="svelte-jz8lnl"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" class="svelte-jz8lnl"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" class="svelte-jz8lnl"></line></svg>`);
          } else {
            $$renderer2.push("<!--[!-->");
          }
          $$renderer2.push(`<!--]-->`);
        }
        $$renderer2.push(`<!--]-->`);
      }
      $$renderer2.push(`<!--]--></a>`);
    }
    $$renderer2.push(`<!--]--></div></div> <div class="footer-links svelte-jz8lnl"><div class="footer-column svelte-jz8lnl" style="--delay: 50ms"><h4 class="column-title svelte-jz8lnl"><span class="title-text svelte-jz8lnl">Butikker</span> <span class="title-count svelte-jz8lnl">${escape_html(stores.length)}</span></h4> <ul class="link-list svelte-jz8lnl"><!--[-->`);
    const each_array_1 = ensure_array_like(stores);
    for (let i = 0, $$length = each_array_1.length; i < $$length; i++) {
      let store = each_array_1[i];
      $$renderer2.push(`<li${attr_style(`--item-delay: ${stringify(i * 30)}ms`)} class="svelte-jz8lnl"><a${attr("href", store.href)} class="footer-link svelte-jz8lnl"><span class="link-text svelte-jz8lnl">${escape_html(store.name)}</span> <svg class="link-arrow svelte-jz8lnl" width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2.5 6H9.5M9.5 6L6 2.5M9.5 6L6 9.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="svelte-jz8lnl"></path></svg></a></li>`);
    }
    $$renderer2.push(`<!--]--></ul></div> <div class="footer-column svelte-jz8lnl" style="--delay: 100ms"><h4 class="column-title svelte-jz8lnl"><span class="title-text svelte-jz8lnl">Kategorier</span> <span class="title-count svelte-jz8lnl">${escape_html(categories.length)}</span></h4> <ul class="link-list svelte-jz8lnl"><!--[-->`);
    const each_array_2 = ensure_array_like(categories);
    for (let i = 0, $$length = each_array_2.length; i < $$length; i++) {
      let category = each_array_2[i];
      $$renderer2.push(`<li${attr_style(`--item-delay: ${stringify(i * 30)}ms`)} class="svelte-jz8lnl"><a${attr("href", category.href)} class="footer-link svelte-jz8lnl"><span class="link-text svelte-jz8lnl">${escape_html(category.name)}</span> <svg class="link-arrow svelte-jz8lnl" width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2.5 6H9.5M9.5 6L6 2.5M9.5 6L6 9.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="svelte-jz8lnl"></path></svg></a></li>`);
    }
    $$renderer2.push(`<!--]--></ul></div> <div class="footer-column svelte-jz8lnl" style="--delay: 150ms"><h4 class="column-title svelte-jz8lnl"><span class="title-text svelte-jz8lnl">Om os</span></h4> <ul class="link-list svelte-jz8lnl"><!--[-->`);
    const each_array_3 = ensure_array_like(aboutLinks);
    for (let i = 0, $$length = each_array_3.length; i < $$length; i++) {
      let link = each_array_3[i];
      $$renderer2.push(`<li${attr_style(`--item-delay: ${stringify(i * 30)}ms`)} class="svelte-jz8lnl"><a${attr("href", link.href)} class="footer-link svelte-jz8lnl"><span class="link-text svelte-jz8lnl">${escape_html(link.name)}</span> <svg class="link-arrow svelte-jz8lnl" width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2.5 6H9.5M9.5 6L6 2.5M9.5 6L6 9.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="svelte-jz8lnl"></path></svg></a></li>`);
    }
    $$renderer2.push(`<!--]--></ul></div></div></div> <div class="newsletter-section svelte-jz8lnl" style="--delay: 200ms"><div class="newsletter-content svelte-jz8lnl"><div class="newsletter-text svelte-jz8lnl"><h4 class="svelte-jz8lnl">Få prisalarmer direkte i din indbakke</h4> <p class="svelte-jz8lnl">Tilmeld dig vores nyhedsbrev og bliv den første til at vide, når dine yndlingsprodukter er på tilbud.</p></div> <form class="newsletter-form svelte-jz8lnl"><div class="input-wrapper svelte-jz8lnl"><svg class="input-icon svelte-jz8lnl" width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M2.25 4.5L9 9.75L15.75 4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="svelte-jz8lnl"></path><rect x="2.25" y="3" width="13.5" height="12" rx="2" stroke="currentColor" stroke-width="1.5" class="svelte-jz8lnl"></rect></svg> <input type="email" placeholder="Din e-mail adresse" class="newsletter-input svelte-jz8lnl"/></div> <button type="submit" class="newsletter-btn svelte-jz8lnl"><span class="svelte-jz8lnl">Tilmeld</span> <svg width="16" height="16" viewBox="0 0 16 16" fill="none" class="svelte-jz8lnl"><path d="M3 8H13M13 8L8 3M13 8L8 13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="svelte-jz8lnl"></path></svg></button></form></div></div> <div class="footer-bottom svelte-jz8lnl"><div class="bottom-left svelte-jz8lnl"><p class="copyright svelte-jz8lnl">© ${escape_html(currentYear)} PrisJagt. Alle rettigheder forbeholdes.</p> <div class="legal-links svelte-jz8lnl"><a href="/privacy" class="svelte-jz8lnl">Privatliv</a> <span class="dot svelte-jz8lnl"></span> <a href="/terms" class="svelte-jz8lnl">Vilkår</a> <span class="dot svelte-jz8lnl"></span> <a href="/cookies" class="svelte-jz8lnl">Cookies</a></div></div> <div class="bottom-right svelte-jz8lnl"><div class="status-indicator svelte-jz8lnl"><span class="status-dot svelte-jz8lnl"></span> <span class="status-text svelte-jz8lnl">Alle systemer kører</span></div> <span class="version svelte-jz8lnl">v2.0</span></div></div></div> <div class="footer-bg svelte-jz8lnl"><div class="bg-orb bg-orb-1 svelte-jz8lnl"></div> <div class="bg-orb bg-orb-2 svelte-jz8lnl"></div></div></footer>`);
  });
}
function _layout($$renderer, $$props) {
  let { children } = $$props;
  $$renderer.push(`<div class="app svelte-12qhfyh">`);
  Header($$renderer);
  $$renderer.push(`<!----> <main class="main svelte-12qhfyh">`);
  children($$renderer);
  $$renderer.push(`<!----></main> `);
  Footer($$renderer);
  $$renderer.push(`<!----></div>`);
}
export {
  _layout as default
};
