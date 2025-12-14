<script lang="ts">
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  import CategoryPills from '$lib/components/CategoryPills.svelte';
  import ProductCard from '$lib/components/ProductCard.svelte';

  let { data } = $props();

  let searchValue = $state('');
  let heroVisible = $state(false);

  $effect(() => {
    searchValue = data.query || '';
  });

  onMount(() => {
    heroVisible = true;
  });

  function handleCategorySelect(categoryId: string) {
    const params = new URLSearchParams();
    if (searchValue) params.set('q', searchValue);
    if (categoryId) params.set('category', categoryId);
    const queryString = params.toString();
    goto(queryString ? `/?${queryString}` : '/');
  }

  function handleSearch(e: Event) {
    e.preventDefault();
    if (searchValue.trim()) {
      goto(`/?q=${encodeURIComponent(searchValue.trim())}`);
    }
  }

  const stores = [
    { id: 'rema1000', name: 'Rema 1000', color: '#003366' },
    { id: 'netto', name: 'Netto', color: '#FFD700' },
    { id: 'foetexplus', name: 'Føtex+', color: '#00457C' },
    { id: 'bilkatogo', name: 'Bilka', color: '#004B93' },
    { id: 'meny', name: 'Meny', color: '#D4002A' },
    { id: 'spar', name: 'Spar', color: '#00843D' },
  ];
</script>

<svelte:head>
  <title>PrisJagt - Sammenlign priser på dagligvarer</title>
  <meta name="description" content="Find de bedste priser på dagligvarer. Sammenlign priser fra Netto, Bilka, Føtex, Rema 1000 og mange flere." />
</svelte:head>

<div class="page">
  <!-- Hero Section -->
  <section class="hero" class:visible={heroVisible}>
    <div class="hero-bg">
      <div class="hero-gradient"></div>
    </div>

    <div class="container hero-content">
      <h1 class="hero-title">
        <span class="title-line">Find de</span>
        <span class="title-line title-highlight">bedste priser</span>
        <span class="title-line">på dagligvarer</span>
      </h1>

      <p class="hero-subtitle">
        Sammenlign priser fra 6 supermarkeder
      </p>

      <form class="hero-search" onsubmit={handleSearch}>
        <div class="search-wrapper">
          <svg class="search-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
            <circle cx="9" cy="9" r="6" stroke="currentColor" stroke-width="2"/>
            <path d="M14 14L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
          <input
            type="search"
            bind:value={searchValue}
            placeholder="Søg efter produkter..."
            class="search-input"
          />
          <button type="submit" class="search-button">Søg</button>
        </div>
      </form>
    </div>
  </section>

  <!-- Store Logos Section -->
  <section class="stores-section">
    <div class="container">
      <div class="stores-header">
        <span class="stores-label">{data.selectedStore ? 'Filtreret efter butik' : 'Filtrer efter butik'}</span>
      </div>
      <div class="stores-track">
        {#each stores as store, i}
          <a
            href={data.selectedStore === store.id ? '/' : `/?store=${store.id}`}
            class="store-badge"
            class:active={data.selectedStore === store.id}
            style="--delay: {i * 50}ms; --store-color: {store.color}"
          >
            <span class="store-initial">{store.name.charAt(0)}</span>
            <span class="store-name">{store.name}</span>
            {#if data.selectedStore === store.id}
              <span class="store-check">✓</span>
            {/if}
          </a>
        {/each}
        {#if data.selectedStore}
          <a href="/" class="stores-clear">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M10.5 3.5L3.5 10.5M3.5 3.5L10.5 10.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            <span>Vis alle</span>
          </a>
        {/if}
      </div>
    </div>
  </section>

  <!-- Categories Section -->
  <section class="categories-section">
    <div class="container">
      <CategoryPills
        categories={data.categories}
        selected={data.selectedCategory}
        onSelect={handleCategorySelect}
      />
    </div>
  </section>

  <!-- Products Section -->
  <section class="products-section">
    <div class="container">
      <div class="section-header">
        <div class="section-title-group">
          <h2 class="section-title">
            {#if data.query}
              Resultater for "{data.query}"
            {:else if data.selectedStore}
              {@const store = stores.find(s => s.id === data.selectedStore)}
              Produkter fra {store?.name || data.selectedStore}
            {:else if data.selectedCategory}
              {data.selectedCategory}
            {:else}
              Alle produkter
            {/if}
          </h2>
          <div class="product-count-badge">
            <span class="count-number">{data.total.toLocaleString('da-DK')}</span>
            <span class="count-label">produkter</span>
          </div>
        </div>

        {#if data.query || data.selectedCategory || data.selectedStore}
          <a href="/" class="clear-filters">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            <span>Ryd filtre</span>
          </a>
        {/if}
      </div>

      {#if data.products.length > 0}
        <div class="products-grid">
          {#each data.products as product, index (product._id)}
            <ProductCard {product} {index} />
          {/each}
        </div>

        {#if data.total > data.products.length}
          <div class="load-more">
            <button class="load-more-btn">
              <span>Vis flere produkter</span>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 3V13M8 13L3 8M8 13L13 8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
          </div>
        {/if}
      {:else}
        <div class="empty-state">
          <div class="empty-icon">
            <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
              <circle cx="35" cy="35" r="20" stroke="currentColor" stroke-width="3"/>
              <path d="M50 50L65 65" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
              <path d="M28 35H42" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
            </svg>
          </div>
          <h3>Ingen produkter fundet</h3>
          <p>Prøv at søge efter noget andet eller fjern dine filtre</p>
          <a href="/" class="btn-primary">
            <span>Se alle produkter</span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8H13M13 8L8 3M13 8L8 13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </a>
        </div>
      {/if}
    </div>
  </section>

</div>

<style>
  .page {
    display: flex;
    flex-direction: column;
    overflow-x: hidden;
  }

  /* ===== HERO SECTION ===== */
  .hero {
    position: relative;
    padding: calc(var(--header-height) + 32px) 0 48px;
  }

  .hero-bg {
    position: absolute;
    inset: 0;
    z-index: -1;
    overflow: hidden;
  }

  .hero-gradient {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
    height: 100%;
    background: radial-gradient(ellipse 80% 60% at 50% 0%, rgba(0, 200, 83, 0.08) 0%, transparent 60%);
  }

  .hero-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .hero-title {
    font-size: clamp(2.5rem, 6vw, 4rem);
    font-weight: 700;
    line-height: 1.1;
    letter-spacing: -0.03em;
    margin-bottom: 16px;
  }

  .title-line {
    display: block;
    opacity: 0;
    transform: translateY(20px);
  }

  .hero.visible .title-line:nth-child(1) {
    animation: fadeIn 0.5s ease 0.1s forwards;
  }

  .hero.visible .title-line:nth-child(2) {
    animation: fadeIn 0.5s ease 0.2s forwards;
  }

  .hero.visible .title-line:nth-child(3) {
    animation: fadeIn 0.5s ease 0.3s forwards;
  }

  @keyframes fadeIn {
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .title-highlight {
    color: #00C853;
  }

  .hero-subtitle {
    font-size: 17px;
    color: var(--color-text-secondary);
    margin-bottom: 32px;
    opacity: 0;
  }

  .hero.visible .hero-subtitle {
    animation: fadeIn 0.5s ease 0.4s forwards;
  }

  /* Search */
  .hero-search {
    width: 100%;
    max-width: 480px;
    opacity: 0;
  }

  .hero.visible .hero-search {
    animation: fadeIn 0.5s ease 0.5s forwards;
  }

  .search-wrapper {
    display: flex;
    align-items: center;
    background: var(--color-surface);
    border-radius: 14px;
    border: 1px solid var(--color-border);
    padding: 6px;
    transition: all 0.2s ease;
  }

  .search-wrapper:focus-within {
    border-color: #00C853;
    box-shadow: 0 0 0 3px rgba(0, 200, 83, 0.1);
  }

  .search-icon {
    color: var(--color-text-tertiary);
    margin-left: 14px;
    flex-shrink: 0;
  }

  .search-input {
    flex: 1;
    padding: 12px 14px;
    border: none;
    background: transparent;
    font-size: 16px;
    outline: none;
    min-width: 0;
  }

  .search-input::placeholder {
    color: var(--color-text-tertiary);
  }

  .search-button {
    padding: 12px 24px;
    background: #00C853;
    color: white;
    font-weight: 600;
    font-size: 15px;
    border-radius: 10px;
    transition: all 0.2s ease;
    flex-shrink: 0;
  }

  .search-button:hover {
    background: #00b348;
  }

  /* ===== STORES SECTION ===== */
  .stores-section {
    padding: var(--space-8) 0;
    background: var(--color-bg-tertiary);
    border-bottom: 1px solid var(--color-border);
  }

  :global(.dark) .stores-section {
    background: var(--color-surface);
  }

  .stores-header {
    text-align: center;
    margin-bottom: var(--space-4);
  }

  .stores-label {
    font-size: var(--text-sm);
    font-weight: 500;
    color: var(--color-text-tertiary);
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  .stores-track {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-3);
    flex-wrap: wrap;
  }

  .store-badge {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    padding: var(--space-2) var(--space-4);
    background: var(--color-surface);
    border-radius: var(--radius-full);
    font-size: var(--text-sm);
    font-weight: 500;
    transition: all 0.2s ease;
    opacity: 0;
    animation: fadeIn 0.4s ease var(--delay) forwards;
    cursor: pointer;
    border: 1px solid var(--color-border);
    box-shadow: var(--shadow-sm);
  }

  .store-badge:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
    border-color: var(--store-color);
  }

  .store-badge.active {
    background: var(--store-color);
    color: white;
    border-color: var(--store-color);
    box-shadow: var(--shadow-md);
  }

  .store-badge.active .store-initial {
    background: rgba(255, 255, 255, 0.2);
    color: white;
  }

  .store-check {
    font-size: var(--text-xs);
    font-weight: 700;
  }

  .store-initial {
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: color-mix(in srgb, var(--store-color) 15%, transparent);
    color: var(--store-color);
    border-radius: var(--radius-sm);
    font-weight: 700;
    font-size: var(--text-xs);
  }

  .stores-clear {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    padding: var(--space-2) var(--space-4);
    background: rgba(255, 59, 48, 0.1);
    color: var(--color-danger);
    border-radius: var(--radius-full);
    font-size: var(--text-sm);
    font-weight: 500;
    transition: all 0.2s ease;
  }

  .stores-clear:hover {
    background: var(--color-danger);
    color: white;
  }

  /* ===== CATEGORIES SECTION ===== */
  .categories-section {
    padding: var(--space-4) 0;
    background: var(--color-bg-secondary);
    border-bottom: 1px solid var(--color-border);
    position: sticky;
    top: var(--header-height);
    z-index: calc(var(--z-sticky) - 1);
  }

  :global(.dark) .categories-section {
    background: var(--color-surface);
  }

  /* ===== PRODUCTS SECTION ===== */
  .products-section {
    padding: var(--space-16) 0;
  }

  .section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: var(--space-4);
    margin-bottom: var(--space-8);
  }

  .section-title-group {
    display: flex;
    align-items: center;
    gap: var(--space-4);
    flex-wrap: wrap;
  }

  .section-title {
    font-size: var(--text-2xl);
    font-weight: 700;
    letter-spacing: -0.02em;
  }

  .product-count-badge {
    display: flex;
    align-items: baseline;
    gap: var(--space-1);
    padding: var(--space-1) var(--space-3);
    background: var(--color-surface);
    border-radius: var(--radius-full);
    border: 1px solid var(--color-border);
  }

  .count-number {
    font-weight: 700;
    font-size: var(--text-sm);
  }

  .count-label {
    font-size: var(--text-xs);
    color: var(--color-text-tertiary);
  }

  .clear-filters {
    display: inline-flex;
    align-items: center;
    gap: var(--space-2);
    padding: var(--space-2) var(--space-4);
    font-size: var(--text-sm);
    font-weight: 500;
    color: var(--color-text-secondary);
    background: var(--color-surface);
    border-radius: var(--radius-full);
    border: 1px solid var(--color-border);
    transition: all 0.2s ease;
  }

  .clear-filters:hover {
    color: var(--color-danger);
    border-color: var(--color-danger);
    background: rgba(255, 59, 48, 0.05);
  }

  .products-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 20px;
  }

  .load-more {
    display: flex;
    justify-content: center;
    margin-top: var(--space-12);
  }

  .load-more-btn {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    padding: var(--space-4) var(--space-8);
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-xl);
    font-size: var(--text-md);
    font-weight: 600;
    transition: all 0.2s ease;
  }

  .load-more-btn:hover {
    border-color: var(--color-accent);
    color: var(--color-accent);
    box-shadow: var(--shadow-md);
  }

  /* Empty State */
  .empty-state {
    text-align: center;
    padding: var(--space-20) var(--space-4);
    background: var(--color-surface);
    border-radius: var(--radius-2xl);
  }

  .empty-icon {
    margin-bottom: var(--space-6);
    color: var(--color-text-tertiary);
    opacity: 0.5;
  }

  .empty-state h3 {
    font-size: var(--text-xl);
    font-weight: 600;
    margin-bottom: var(--space-2);
  }

  .empty-state p {
    color: var(--color-text-secondary);
    margin-bottom: var(--space-6);
  }

  .btn-primary {
    display: inline-flex;
    align-items: center;
    gap: var(--space-2);
    padding: var(--space-4) var(--space-6);
    background: var(--gradient-accent);
    color: white;
    font-weight: 600;
    border-radius: var(--radius-xl);
    transition: all 0.2s ease;
  }

  .btn-primary:hover {
    transform: scale(1.02);
    box-shadow: var(--shadow-accent);
  }

  /* ===== RESPONSIVE ===== */
  @media (max-width: 768px) {
    .hero {
      padding: calc(var(--header-height) + 24px) 0 32px;
    }

    .hero-title {
      font-size: clamp(2rem, 8vw, 3rem);
    }

    .products-grid {
      grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
      gap: 12px;
    }

    .search-button {
      padding: 10px 18px;
      font-size: 14px;
    }
  }

  @media (max-width: 480px) {
    .stores-track {
      gap: var(--space-2);
    }

    .store-name {
      display: none;
    }

    .store-badge {
      padding: var(--space-2);
    }
  }
</style>
