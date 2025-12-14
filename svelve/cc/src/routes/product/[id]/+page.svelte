<script lang="ts">
  import { onMount } from 'svelte';
  import PriceChart from '$lib/components/PriceChart.svelte';
  import StorePriceCard from '$lib/components/StorePriceCard.svelte';

  let { data } = $props();

  const formatPrice = (p: number) => {
    // Price is in kroner as decimal (e.g., 2.5, 11.5, 125.99)
    const whole = Math.floor(p);
    const fraction = Math.round((p - whole) * 100);
    return `${whole},${String(fraction).padStart(2, '0')}`;
  };

  const savings = $derived(
    data.highestPrice && data.lowestPrice
      ? data.highestPrice - data.lowestPrice
      : 0
  );

  const savingsPercent = $derived(
    data.highestPrice ? Math.round((savings / data.highestPrice) * 100) : 0
  );

  let selectedImage = $state(0);
  let selectedTimeRange = $state<'30' | '90' | '365'>('30');
  let imageLoaded = $state(false);
  let showShareMenu = $state(false);
  let isFavorite = $state(false);
  let scrollY = $state(0);
  let showStickyBar = $state(false);
  let pageVisible = $state(false);

  // Animate price on load
  let displayPrice = $state(0);
  $effect(() => {
    if (data.lowestPrice) {
      const targetPrice = data.lowestPrice;
      const duration = 800;
      const startTime = performance.now();

      function animate(currentTime: number) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeOutExpo = 1 - Math.pow(2, -10 * progress);
        displayPrice = Math.round(targetPrice * easeOutExpo);

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      }

      requestAnimationFrame(animate);
    }
  });

  onMount(() => {
    pageVisible = true;

    const handleScroll = () => {
      scrollY = window.scrollY;
      showStickyBar = scrollY > 400;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  });

  function handleShare() {
    if (navigator.share) {
      navigator.share({
        title: data.product?.name,
        text: `Se priser for ${data.product?.name} - fra ${formatPrice(data.lowestPrice || 0)} kr`,
        url: window.location.href
      });
    } else {
      showShareMenu = !showShareMenu;
    }
  }

  function copyLink() {
    navigator.clipboard.writeText(window.location.href);
    showShareMenu = false;
  }

  function toggleFavorite() {
    isFavorite = !isFavorite;
  }
</script>

<svelte:head>
  <title>{data.product?.name || 'Produkt'} - PrisJagt</title>
  <meta name="description" content={data.product?.description || `Se priser for ${data.product?.name}`} />
</svelte:head>

{#if data.product}
  <div class="product-page" class:visible={pageVisible}>
    <!-- Sticky Price Bar -->
    <div class="sticky-bar" class:visible={showStickyBar}>
      <div class="container sticky-bar-content">
        <div class="sticky-product">
          {#if data.product.images?.[0]}
            <img src={data.product.images[0]} alt="" class="sticky-image" />
          {/if}
          <span class="sticky-name">{data.product.name}</span>
        </div>
        <div class="sticky-price">
          <span class="sticky-price-value">{formatPrice(data.lowestPrice || 0)} kr</span>
          <span class="sticky-store-count">{data.prices.length} butikker</span>
        </div>
      </div>
    </div>

    <!-- Hero background -->
    <div class="hero-bg">
      <div class="hero-gradient-1"></div>
      <div class="hero-gradient-2"></div>
    </div>

    <div class="container">
      <!-- Breadcrumb -->
      <nav class="breadcrumb animate-item" style="--delay: 0ms">
        <a href="/" class="back-btn">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span>Tilbage</span>
        </a>
        <div class="breadcrumb-trail">
          <a href="/">Hjem</a>
          <span class="sep">/</span>
          {#if data.product.categories?.level1}
            <a href="/?category={encodeURIComponent(data.product.categories.level1)}">{data.product.categories.level1}</a>
            <span class="sep">/</span>
          {/if}
          <span class="current">{data.product.name}</span>
        </div>
      </nav>

      <!-- Main Layout -->
      <div class="product-layout">
        <!-- Gallery -->
        <div class="gallery animate-item" style="--delay: 100ms">
          <div class="main-image-container">
            <div class="main-image" class:loaded={imageLoaded}>
              {#if data.product.images?.length > 0}
                <img
                  src={data.product.images[selectedImage]}
                  alt={data.product.name}
                  onload={() => imageLoaded = true}
                  class:visible={imageLoaded}
                />
                {#if !imageLoaded}
                  <div class="image-skeleton"></div>
                {/if}
              {:else}
                <div class="no-image">
                  <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                    <rect x="10" y="10" width="60" height="60" rx="12" stroke="currentColor" stroke-width="2"/>
                    <circle cx="30" cy="30" r="6" stroke="currentColor" stroke-width="2"/>
                    <path d="M10 55L30 35L50 55L70 35" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  </svg>
                  <span>Intet billede</span>
                </div>
              {/if}
            </div>

            {#if data.product.images?.length > 0}
              <div class="image-actions">
                <button class="image-action" title="Zoom">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <circle cx="8" cy="8" r="5" stroke="currentColor" stroke-width="1.5"/>
                    <path d="M12 12L16 16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                    <path d="M6 8H10M8 6V10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                  </svg>
                </button>
              </div>
            {/if}
          </div>

          {#if data.product.images?.length > 1}
            <div class="thumbnails">
              {#each data.product.images.slice(0, 5) as image, i}
                <button
                  class="thumb"
                  class:active={selectedImage === i}
                  onclick={() => { selectedImage = i; imageLoaded = false; }}
                >
                  <img src={image} alt="" loading="lazy" />
                </button>
              {/each}
              {#if data.product.images.length > 5}
                <span class="thumb-more">+{data.product.images.length - 5}</span>
              {/if}
            </div>
          {/if}
        </div>

        <!-- Product Info -->
        <div class="product-info">
          <div class="info-header animate-item" style="--delay: 150ms">
            {#if data.product.brand}
              <span class="brand">{data.product.brand}</span>
            {/if}
            <div class="actions">
              <button
                class="action-btn"
                class:active={isFavorite}
                onclick={toggleFavorite}
                title="Gem som favorit"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill={isFavorite ? "currentColor" : "none"}>
                  <path d="M10 17.5L8.79167 16.3917C4.5 12.5083 1.66667 9.93333 1.66667 6.79167C1.66667 4.21667 3.68333 2.2 6.25 2.2C7.7 2.2 9.09167 2.86667 10 3.925C10.9083 2.86667 12.3 2.2 13.75 2.2C16.3167 2.2 18.3333 4.21667 18.3333 6.79167C18.3333 9.93333 15.5 12.5083 11.2083 16.4L10 17.5Z" stroke="currentColor" stroke-width="1.5"/>
                </svg>
              </button>
              <div class="share-container">
                <button class="action-btn" onclick={handleShare} title="Del">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M15 6.67C16.38 6.67 17.5 5.55 17.5 4.17C17.5 2.79 16.38 1.67 15 1.67C13.62 1.67 12.5 2.79 12.5 4.17C12.5 5.55 13.62 6.67 15 6.67Z" stroke="currentColor" stroke-width="1.5"/>
                    <path d="M5 12.5C6.38 12.5 7.5 11.38 7.5 10C7.5 8.62 6.38 7.5 5 7.5C3.62 7.5 2.5 8.62 2.5 10C2.5 11.38 3.62 12.5 5 12.5Z" stroke="currentColor" stroke-width="1.5"/>
                    <path d="M15 18.33C16.38 18.33 17.5 17.21 17.5 15.83C17.5 14.45 16.38 13.33 15 13.33C13.62 13.33 12.5 14.45 12.5 15.83C12.5 17.21 13.62 18.33 15 18.33Z" stroke="currentColor" stroke-width="1.5"/>
                    <path d="M7.16 11.26L12.85 14.58M12.84 5.43L7.16 8.74" stroke="currentColor" stroke-width="1.5"/>
                  </svg>
                </button>
                {#if showShareMenu}
                  <div class="share-dropdown">
                    <button onclick={copyLink}>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <rect x="5" y="5" width="8" height="8" rx="1.5" stroke="currentColor" stroke-width="1.5"/>
                        <path d="M3 11V3H11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                      </svg>
                      Kopier link
                    </button>
                  </div>
                {/if}
              </div>
            </div>
          </div>

          <h1 class="product-name animate-item" style="--delay: 200ms">{data.product.name}</h1>

          <!-- Price Card -->
          {#if data.lowestPrice}
            <div class="price-card animate-item" style="--delay: 250ms">
              <div class="price-card-header">
                <div class="best-price-tag">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M6 8L7.33 9.33L10 6.67" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    <circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="1.5"/>
                  </svg>
                  Bedste pris nu
                </div>
                {#if savings > 0}
                  <div class="savings-pill">
                    Spar {savingsPercent}%
                  </div>
                {/if}
              </div>

              <div class="price-main">
                <span class="price-integer">{formatPrice(displayPrice).split(',')[0]}</span>
                <span class="price-decimal">,{formatPrice(displayPrice).split(',')[1]}</span>
                <span class="price-currency">kr</span>
              </div>

              {#if savings > 0}
                <div class="price-comparison">
                  <div class="comparison-item lowest">
                    <span class="comparison-label">Laveste</span>
                    <span class="comparison-value">{formatPrice(data.lowestPrice)} kr</span>
                  </div>
                  <div class="comparison-bar">
                    <div class="bar-track">
                      <div class="bar-fill" style="width: {Math.min(30 + savingsPercent, 100)}%"></div>
                      <div class="bar-indicator"></div>
                    </div>
                  </div>
                  <div class="comparison-item highest">
                    <span class="comparison-label">Højeste</span>
                    <span class="comparison-value">{formatPrice(data.highestPrice || data.lowestPrice)} kr</span>
                  </div>
                </div>
              {/if}

              <div class="store-count-row">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M2 4H14M4 8H12M6 12H10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                </svg>
                Tilgængelig i <strong>{data.prices.length}</strong> butikker
              </div>
            </div>
          {/if}

          <!-- Description -->
          {#if data.product.description}
            <div class="description animate-item" style="--delay: 300ms">
              <h3>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M3 4.5H15M3 9H12M3 13.5H9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                </svg>
                Beskrivelse
              </h3>
              <p>{data.product.description}</p>
            </div>
          {/if}

          <!-- Meta Info -->
          <div class="meta-grid animate-item" style="--delay: 350ms">
            {#if data.product.gtin}
              <div class="meta-chip">
                <span class="chip-label">GTIN</span>
                <span class="chip-value">{data.product.gtin}</span>
              </div>
            {/if}
            {#if data.product.article}
              <div class="meta-chip">
                <span class="chip-label">Artikel</span>
                <span class="chip-value">{data.product.article}</span>
              </div>
            {/if}
            {#if data.product.categories?.level1}
              <div class="meta-chip">
                <span class="chip-label">Kategori</span>
                <span class="chip-value">{data.product.categories.level1}</span>
              </div>
            {/if}
          </div>
        </div>
      </div>

      <!-- Store Prices Section -->
      <section class="section animate-section" style="--delay: 400ms">
        <div class="section-header">
          <div class="section-title">
            <div class="section-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M3 9H21M7 15H9M15 15H17M5 19H19C20.1 19 21 18.1 21 17V7C21 5.9 20.1 5 19 5H5C3.9 5 3 5.9 3 7V17C3 18.1 3.9 19 5 19Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
            </div>
            <h2>Sammenlign priser</h2>
          </div>
          <span class="section-count">{data.prices.length} butikker</span>
        </div>

        {#if data.prices.length > 0}
          <div class="store-list">
            {#each data.prices as priceData, index}
              <StorePriceCard
                store={priceData.store}
                price={priceData.price}
                originalPrice={priceData.originalPrice}
                inStock={priceData.inStock}
                isLowest={priceData.isLowest}
                {index}
              />
            {/each}
          </div>
        {:else}
          <div class="empty-card">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <circle cx="24" cy="24" r="18" stroke="currentColor" stroke-width="2"/>
              <path d="M24 14V26M24 34H24.02" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            <p>Ingen prisoplysninger</p>
          </div>
        {/if}
      </section>

      <!-- Price History Section -->
      <section class="section animate-section" style="--delay: 500ms">
        <div class="section-header">
          <div class="section-title">
            <div class="section-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M3 20L8 15L13 18L21 10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                <path d="M17 10H21V14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
            </div>
            <h2>Prishistorik</h2>
          </div>
          <div class="time-pills">
            <button
              class="time-pill"
              class:active={selectedTimeRange === '30'}
              onclick={() => selectedTimeRange = '30'}
            >30 dage</button>
            <button
              class="time-pill"
              class:active={selectedTimeRange === '90'}
              onclick={() => selectedTimeRange = '90'}
            >90 dage</button>
            <button
              class="time-pill"
              class:active={selectedTimeRange === '365'}
              onclick={() => selectedTimeRange = '365'}
            >1 år</button>
          </div>
        </div>

        <div class="chart-wrapper">
          <PriceChart data={data.priceHistory} height={320} />
        </div>

        <div class="stats-row">
          <div class="stat-item low">
            <div class="stat-icon-wrap">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M9 4V14M9 14L5 10M9 14L13 10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
            </div>
            <div class="stat-text">
              <span class="stat-label">Laveste</span>
              <span class="stat-num">{formatPrice(Math.min(...data.priceHistory.map(p => p.price)))} kr</span>
            </div>
          </div>

          <div class="stat-item high">
            <div class="stat-icon-wrap">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M9 14V4M9 4L5 8M9 4L13 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
            </div>
            <div class="stat-text">
              <span class="stat-label">Højeste</span>
              <span class="stat-num">{formatPrice(Math.max(...data.priceHistory.map(p => p.price)))} kr</span>
            </div>
          </div>

          <div class="stat-item avg">
            <div class="stat-icon-wrap">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M3 9H15M6 6L3 9L6 12M12 6L15 9L12 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
            </div>
            <div class="stat-text">
              <span class="stat-label">Gennemsnit</span>
              <span class="stat-num">{formatPrice(Math.round(data.priceHistory.reduce((a, b) => a + b.price, 0) / data.priceHistory.length))} kr</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Alert CTA -->
      <section class="alert-cta animate-section" style="--delay: 600ms">
        <div class="alert-visual">
          <div class="alert-icon-bg">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <path d="M16 6V16L22 22" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
              <circle cx="16" cy="16" r="12" stroke="currentColor" stroke-width="2.5"/>
            </svg>
          </div>
          <div class="alert-rings">
            <div class="ring"></div>
            <div class="ring"></div>
          </div>
        </div>
        <div class="alert-text">
          <h3>Vil du have besked når prisen falder?</h3>
          <p>Opret en prisalarm og bliv den første til at vide det</p>
        </div>
        <button class="alert-button">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 2.5C6.5 2.5 4.17 5.83 4.17 8.33C4.17 10.83 3.33 12.5 2.5 13.33H17.5C16.67 12.5 15.83 10.83 15.83 8.33C15.83 5.83 13.5 2.5 10 2.5Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            <path d="M8.33 13.33V14.17C8.33 15.08 9.08 15.83 10 15.83C10.92 15.83 11.67 15.08 11.67 14.17V13.33" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
          <span>Opret prisalarm</span>
        </button>
      </section>
    </div>
  </div>
{:else}
  <div class="not-found-page">
    <div class="container">
      <div class="not-found-content">
        <div class="not-found-icon">
          <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
            <circle cx="40" cy="40" r="30" stroke="currentColor" stroke-width="2"/>
            <path d="M30 30L50 50M50 30L30 50" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </div>
        <h1>Produkt ikke fundet</h1>
        <p>Det valgte produkt kunne desværre ikke findes.</p>
        <a href="/" class="home-btn">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
          Tilbage til forsiden
        </a>
      </div>
    </div>
  </div>
{/if}

<style>
  /* ===== PAGE SETUP ===== */
  .product-page {
    position: relative;
    padding-bottom: var(--space-24);
  }

  .product-page.visible .animate-item {
    animation: revealUp 0.6s var(--ease-out-expo) var(--delay) backwards;
  }

  .product-page.visible .animate-section {
    animation: revealUp 0.7s var(--ease-out-expo) var(--delay) backwards;
  }

  @keyframes revealUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
  }

  /* ===== STICKY BAR ===== */
  .sticky-bar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: var(--z-sticky);
    background: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border-bottom: 1px solid var(--color-border);
    transform: translateY(-100%);
    transition: transform 0.3s var(--ease-out-expo);
  }

  :global(.dark) .sticky-bar {
    background: rgba(20, 20, 20, 0.85);
  }

  .sticky-bar.visible {
    transform: translateY(0);
  }

  .sticky-bar-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--space-3) var(--space-6);
    height: 60px;
  }

  .sticky-product {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    min-width: 0;
  }

  .sticky-image {
    width: 40px;
    height: 40px;
    object-fit: contain;
    border-radius: var(--radius-md);
    background: var(--color-surface);
    flex-shrink: 0;
  }

  .sticky-name {
    font-weight: 600;
    font-size: var(--text-sm);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .sticky-price {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    flex-shrink: 0;
  }

  .sticky-price-value {
    font-size: var(--text-lg);
    font-weight: 700;
    background: var(--gradient-accent);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .sticky-store-count {
    font-size: var(--text-xs);
    color: var(--color-text-tertiary);
  }

  /* ===== HERO BACKGROUND ===== */
  .hero-bg {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 500px;
    overflow: hidden;
    z-index: -1;
  }

  .hero-gradient-1 {
    position: absolute;
    top: -50%;
    left: 50%;
    transform: translateX(-50%);
    width: 150%;
    height: 100%;
    background: radial-gradient(ellipse at center, rgba(0, 200, 83, 0.08) 0%, transparent 60%);
  }

  .hero-gradient-2 {
    position: absolute;
    top: 0;
    right: -20%;
    width: 60%;
    height: 80%;
    background: radial-gradient(ellipse at center, rgba(0, 191, 165, 0.06) 0%, transparent 60%);
  }

  /* ===== BREADCRUMB ===== */
  .breadcrumb {
    display: flex;
    align-items: center;
    gap: var(--space-4);
    padding: var(--space-6) 0;
    margin-bottom: var(--space-4);
  }

  .back-btn {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    padding: var(--space-2) var(--space-4);
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-full);
    font-size: var(--text-sm);
    font-weight: 500;
    color: var(--color-text-secondary);
    transition: all 0.2s ease;
  }

  .back-btn:hover {
    background: var(--color-text);
    border-color: var(--color-text);
    color: var(--color-bg);
  }

  .breadcrumb-trail {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    font-size: var(--text-sm);
    color: var(--color-text-tertiary);
  }

  .breadcrumb-trail a {
    color: var(--color-text-secondary);
    transition: color 0.2s ease;
  }

  .breadcrumb-trail a:hover {
    color: var(--color-accent);
  }

  .breadcrumb-trail .sep {
    opacity: 0.4;
  }

  .breadcrumb-trail .current {
    color: var(--color-text);
    font-weight: 500;
    max-width: 200px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  /* ===== PRODUCT LAYOUT ===== */
  .product-layout {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--space-12);
    margin-bottom: var(--space-16);
  }

  /* ===== GALLERY ===== */
  .gallery {
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
  }

  .main-image-container {
    position: relative;
  }

  .main-image {
    aspect-ratio: 1;
    background: var(--color-surface);
    border-radius: var(--radius-2xl);
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: var(--shadow-lg);
    transition: all 0.4s var(--ease-out-expo);
    border: 1px solid var(--color-border);
  }

  :global(.dark) .main-image {
    border-color: transparent;
  }

  .main-image:hover {
    box-shadow: var(--shadow-xl);
    transform: scale(1.01);
  }

  .main-image img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    padding: var(--space-8);
    opacity: 0;
    transform: scale(1.02);
    transition: all 0.4s ease;
  }

  .main-image img.visible {
    opacity: 1;
    transform: scale(1);
  }

  .image-skeleton {
    position: absolute;
    inset: var(--space-8);
    background: linear-gradient(90deg, var(--color-border) 25%, var(--color-surface) 50%, var(--color-border) 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
    border-radius: var(--radius-lg);
  }

  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }

  .no-image {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-3);
    color: var(--color-text-tertiary);
    font-size: var(--text-sm);
  }

  .image-actions {
    position: absolute;
    bottom: var(--space-4);
    right: var(--space-4);
    display: flex;
    gap: var(--space-2);
  }

  .image-action {
    width: 40px;
    height: 40px;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(12px);
    border-radius: var(--radius-full);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    opacity: 0;
    transform: scale(0.9);
    transition: all 0.2s ease;
  }

  .main-image:hover .image-action {
    opacity: 1;
    transform: scale(1);
  }

  .image-action:hover {
    background: rgba(0, 0, 0, 0.8);
  }

  .thumbnails {
    display: flex;
    gap: var(--space-3);
  }

  .thumb {
    width: 72px;
    height: 72px;
    background: var(--color-surface);
    border: 2px solid transparent;
    border-radius: var(--radius-lg);
    overflow: hidden;
    padding: var(--space-2);
    transition: all 0.2s ease;
  }

  .thumb:hover {
    border-color: var(--color-border-strong);
  }

  .thumb.active {
    border-color: var(--color-accent);
    box-shadow: 0 0 0 3px rgba(0, 200, 83, 0.15);
  }

  .thumb img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  .thumb-more {
    width: 72px;
    height: 72px;
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: var(--text-sm);
    font-weight: 600;
    color: var(--color-text-secondary);
  }

  :global(.dark) .thumb-more {
    border-color: transparent;
  }

  :global(.dark) .thumb {
    background: var(--color-surface);
    border-color: transparent;
  }

  :global(.dark) .thumb:hover {
    border-color: var(--color-border-strong);
  }

  :global(.dark) .thumb.active {
    border-color: var(--color-accent);
  }

  /* ===== PRODUCT INFO ===== */
  .product-info {
    display: flex;
    flex-direction: column;
    gap: var(--space-5);
  }

  .info-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .brand {
    font-size: var(--text-sm);
    font-weight: 600;
    color: var(--color-text-tertiary);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .actions {
    display: flex;
    gap: var(--space-2);
  }

  .action-btn {
    width: 44px;
    height: 44px;
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-full);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--color-text-secondary);
    transition: all 0.2s ease;
  }

  .action-btn:hover {
    background: var(--color-surface-hover);
    color: var(--color-text);
    transform: scale(1.05);
  }

  .action-btn.active {
    background: rgba(255, 59, 48, 0.1);
    border-color: rgba(255, 59, 48, 0.3);
    color: var(--color-danger);
  }

  .share-container {
    position: relative;
  }

  .share-dropdown {
    position: absolute;
    top: calc(100% + var(--space-2));
    right: 0;
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-xl);
    padding: var(--space-2);
    min-width: 160px;
    z-index: 10;
    animation: dropIn 0.2s ease;
  }

  @keyframes dropIn {
    from {
      opacity: 0;
      transform: translateY(-8px);
    }
  }

  .share-dropdown button {
    width: 100%;
    display: flex;
    align-items: center;
    gap: var(--space-3);
    padding: var(--space-3) var(--space-4);
    border-radius: var(--radius-md);
    font-size: var(--text-sm);
    color: var(--color-text-secondary);
    transition: all 0.2s ease;
  }

  .share-dropdown button:hover {
    background: var(--color-surface-hover);
    color: var(--color-text);
  }

  .product-name {
    font-size: clamp(1.75rem, 4vw, var(--text-3xl));
    font-weight: 700;
    line-height: 1.2;
    letter-spacing: -0.02em;
  }

  /* ===== PRICE CARD ===== */
  .price-card {
    background: linear-gradient(135deg, rgba(0, 200, 83, 0.06) 0%, rgba(0, 191, 165, 0.04) 100%);
    border: 1px solid rgba(0, 200, 83, 0.15);
    border-radius: var(--radius-2xl);
    padding: var(--space-6);
  }

  .price-card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: var(--space-4);
  }

  .best-price-tag {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    font-size: var(--text-sm);
    font-weight: 600;
    color: var(--color-success);
  }

  .savings-pill {
    background: var(--color-success);
    color: white;
    font-size: var(--text-xs);
    font-weight: 700;
    padding: var(--space-1) var(--space-3);
    border-radius: var(--radius-full);
  }

  .price-main {
    display: flex;
    align-items: baseline;
    margin-bottom: var(--space-4);
  }

  .price-integer {
    font-size: clamp(3rem, 8vw, var(--text-5xl));
    font-weight: 700;
    letter-spacing: -0.03em;
    background: var(--gradient-accent);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    line-height: 1;
  }

  .price-decimal {
    font-size: var(--text-2xl);
    font-weight: 700;
    background: var(--gradient-accent);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .price-currency {
    font-size: var(--text-xl);
    font-weight: 600;
    color: var(--color-text-secondary);
    margin-left: var(--space-2);
  }

  .price-comparison {
    display: flex;
    align-items: center;
    gap: var(--space-4);
    padding: var(--space-4) 0;
    border-top: 1px solid rgba(0, 200, 83, 0.1);
    border-bottom: 1px solid rgba(0, 200, 83, 0.1);
    margin-bottom: var(--space-4);
  }

  .comparison-item {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .comparison-label {
    font-size: var(--text-xs);
    color: var(--color-text-tertiary);
  }

  .comparison-value {
    font-size: var(--text-sm);
    font-weight: 600;
  }

  .comparison-item.lowest .comparison-value {
    color: var(--color-success);
  }

  .comparison-bar {
    flex: 1;
  }

  .bar-track {
    height: 4px;
    background: rgba(0, 0, 0, 0.1);
    border-radius: var(--radius-full);
    position: relative;
  }

  .bar-fill {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    background: var(--gradient-accent);
    border-radius: var(--radius-full);
  }

  .bar-indicator {
    position: absolute;
    left: 0;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 10px;
    height: 10px;
    background: var(--color-success);
    border: 2px solid white;
    border-radius: 50%;
    box-shadow: var(--shadow-md);
  }

  .store-count-row {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    font-size: var(--text-sm);
    color: var(--color-text-secondary);
  }

  .store-count-row strong {
    color: var(--color-text);
  }

  /* ===== DESCRIPTION ===== */
  .description {
    background: var(--color-surface);
    border-radius: var(--radius-xl);
    padding: var(--space-5);
    border: 1px solid var(--color-border);
  }

  :global(.dark) .description {
    border-color: transparent;
  }

  .description h3 {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    font-size: var(--text-sm);
    font-weight: 600;
    margin-bottom: var(--space-3);
  }

  .description h3 svg {
    color: var(--color-text-secondary);
  }

  .description p {
    font-size: var(--text-sm);
    color: var(--color-text-secondary);
    line-height: 1.7;
  }

  /* ===== META GRID ===== */
  .meta-grid {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-3);
  }

  .meta-chip {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    padding: var(--space-2) var(--space-4);
    background: var(--color-surface);
    border-radius: var(--radius-full);
    font-size: var(--text-sm);
    border: 1px solid var(--color-border);
  }

  :global(.dark) .meta-chip {
    border-color: transparent;
  }

  .chip-label {
    color: var(--color-text-tertiary);
    font-weight: 500;
  }

  .chip-value {
    font-family: var(--font-mono);
    color: var(--color-text-secondary);
  }

  /* ===== SECTIONS ===== */
  .section {
    margin-bottom: var(--space-16);
  }

  .section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: var(--space-6);
    flex-wrap: wrap;
    gap: var(--space-4);
  }

  .section-title {
    display: flex;
    align-items: center;
    gap: var(--space-3);
  }

  .section-icon {
    width: 44px;
    height: 44px;
    background: linear-gradient(135deg, rgba(0, 200, 83, 0.1), rgba(0, 191, 165, 0.1));
    border-radius: var(--radius-lg);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--color-accent);
  }

  .section-title h2 {
    font-size: var(--text-xl);
    font-weight: 600;
  }

  .section-count {
    font-size: var(--text-sm);
    font-weight: 500;
    color: var(--color-text-tertiary);
    background: var(--color-surface);
    padding: var(--space-2) var(--space-4);
    border-radius: var(--radius-full);
    border: 1px solid var(--color-border);
  }

  :global(.dark) .section-count {
    border-color: transparent;
  }

  .store-list {
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
  }

  .empty-card {
    text-align: center;
    padding: var(--space-12);
    background: var(--color-surface);
    border-radius: var(--radius-xl);
    color: var(--color-text-tertiary);
    border: 1px solid var(--color-border);
  }

  :global(.dark) .empty-card {
    border-color: transparent;
  }

  .empty-card svg {
    margin-bottom: var(--space-4);
  }

  /* ===== TIME PILLS ===== */
  .time-pills {
    display: flex;
    background: var(--color-surface);
    padding: 4px;
    border-radius: var(--radius-lg);
    border: 1px solid var(--color-border);
  }

  :global(.dark) .time-pills {
    border-color: transparent;
  }

  .time-pill {
    padding: var(--space-2) var(--space-4);
    font-size: var(--text-sm);
    font-weight: 500;
    border-radius: var(--radius-md);
    color: var(--color-text-secondary);
    transition: all 0.2s ease;
  }

  .time-pill:hover {
    color: var(--color-text);
  }

  .time-pill.active {
    background: var(--color-text);
    color: var(--color-bg);
  }

  .chart-wrapper {
    margin-bottom: var(--space-6);
  }

  /* ===== STATS ROW ===== */
  .stats-row {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--space-4);
  }

  .stat-item {
    display: flex;
    align-items: center;
    gap: var(--space-4);
    background: var(--color-surface);
    border-radius: var(--radius-xl);
    padding: var(--space-5);
    border: 1px solid var(--color-border);
  }

  :global(.dark) .stat-item {
    border-color: transparent;
  }

  .stat-icon-wrap {
    width: 44px;
    height: 44px;
    border-radius: var(--radius-lg);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .stat-item.low .stat-icon-wrap {
    background: rgba(0, 200, 83, 0.1);
    color: var(--color-success);
  }

  .stat-item.high .stat-icon-wrap {
    background: rgba(255, 59, 48, 0.1);
    color: var(--color-danger);
  }

  .stat-item.avg .stat-icon-wrap {
    background: rgba(0, 122, 255, 0.1);
    color: #007AFF;
  }

  .stat-text {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .stat-label {
    font-size: var(--text-xs);
    color: var(--color-text-secondary);
  }

  .stat-num {
    font-size: var(--text-lg);
    font-weight: 700;
  }

  .stat-item.low .stat-num {
    color: var(--color-success);
  }

  .stat-item.high .stat-num {
    color: var(--color-danger);
  }

  /* ===== ALERT CTA ===== */
  .alert-cta {
    display: flex;
    align-items: center;
    gap: var(--space-8);
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-2xl);
    padding: var(--space-8);
  }

  :global(.dark) .alert-cta {
    border-color: transparent;
  }

  .alert-visual {
    position: relative;
    flex-shrink: 0;
  }

  .alert-icon-bg {
    width: 72px;
    height: 72px;
    background: var(--gradient-accent);
    border-radius: var(--radius-xl);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    position: relative;
    z-index: 1;
  }

  .alert-rings {
    position: absolute;
    inset: -8px;
  }

  .ring {
    position: absolute;
    inset: 0;
    border: 2px solid var(--color-accent);
    border-radius: var(--radius-2xl);
    opacity: 0;
    animation: ringPulse 2s ease-out infinite;
  }

  .ring:nth-child(2) {
    animation-delay: 1s;
  }

  @keyframes ringPulse {
    0% {
      opacity: 0.5;
      transform: scale(0.8);
    }
    100% {
      opacity: 0;
      transform: scale(1.5);
    }
  }

  .alert-text {
    flex: 1;
  }

  .alert-text h3 {
    font-size: var(--text-lg);
    font-weight: 600;
    margin-bottom: var(--space-1);
  }

  .alert-text p {
    font-size: var(--text-sm);
    color: var(--color-text-secondary);
  }

  .alert-button {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    padding: var(--space-4) var(--space-6);
    background: var(--gradient-accent);
    color: white;
    font-weight: 600;
    border-radius: var(--radius-full);
    box-shadow: var(--shadow-accent);
    transition: all 0.2s ease;
    flex-shrink: 0;
  }

  .alert-button:hover {
    transform: scale(1.05);
    box-shadow: 0 8px 24px rgba(0, 200, 83, 0.4);
  }

  /* ===== NOT FOUND ===== */
  .not-found-page {
    min-height: 60vh;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .not-found-content {
    text-align: center;
    max-width: 400px;
  }

  .not-found-icon {
    color: var(--color-text-tertiary);
    margin-bottom: var(--space-6);
  }

  .not-found-content h1 {
    font-size: var(--text-2xl);
    font-weight: 600;
    margin-bottom: var(--space-3);
  }

  .not-found-content p {
    color: var(--color-text-secondary);
    margin-bottom: var(--space-8);
  }

  .home-btn {
    display: inline-flex;
    align-items: center;
    gap: var(--space-2);
    padding: var(--space-4) var(--space-6);
    background: var(--gradient-accent);
    color: white;
    font-weight: 600;
    border-radius: var(--radius-full);
    transition: all 0.2s ease;
  }

  .home-btn:hover {
    transform: scale(1.05);
  }

  /* ===== RESPONSIVE ===== */
  @media (max-width: 968px) {
    .product-layout {
      grid-template-columns: 1fr;
      gap: var(--space-8);
    }

    .stats-row {
      grid-template-columns: 1fr;
    }

    .alert-cta {
      flex-direction: column;
      text-align: center;
    }

    .breadcrumb-trail {
      display: none;
    }
  }

  @media (max-width: 640px) {
    .sticky-bar-content {
      padding: var(--space-2) var(--space-4);
    }

    .sticky-name {
      max-width: 120px;
    }

    .section-header {
      flex-direction: column;
      align-items: flex-start;
    }

    .time-pills {
      width: 100%;
    }

    .time-pill {
      flex: 1;
      text-align: center;
    }

    .stat-item {
      padding: var(--space-4);
    }

    .alert-button span {
      display: none;
    }

    .alert-button {
      padding: var(--space-4);
      border-radius: var(--radius-full);
    }
  }
</style>
