<script lang="ts">
  import { STORES } from '$lib/db';
</script>

<svelte:head>
  <title>Butikker - PrisJagt</title>
</svelte:head>

<div class="stores-page">
  <div class="container">
    <header class="page-header">
      <h1 class="page-title animate-fade-in">Butikker</h1>
      <p class="page-subtitle animate-fade-in">
        Vi sammenligner priser fra de største dagligvarebutikker i Danmark
      </p>
    </header>

    <div class="stores-grid">
      {#each STORES as store, index}
        <div
          class="store-card animate-slide-up"
          style="animation-delay: {index * 100}ms"
        >
          <div class="store-logo" style="background-color: {store.color}15">
            <span class="logo-letter" style="color: {store.color}">{store.name.charAt(0)}</span>
          </div>
          <div class="store-info">
            <h2 class="store-name">{store.name}</h2>
            <div class="store-stats">
              <span class="stat">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 1L10.163 5.279L15 6.031L11.5 9.418L12.326 14.279L8 12.011L3.674 14.279L4.5 9.418L1 6.031L5.837 5.279L8 1Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                Populær
              </span>
              <span class="stat">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M14 5L6 13L2 9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                Opdateret dagligt
              </span>
            </div>
          </div>
          <div class="store-action">
            <span class="product-count">1000+ produkter</span>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
        </div>
      {/each}
    </div>

    <section class="info-section">
      <h2>Hvordan virker det?</h2>
      <div class="info-cards">
        <div class="info-card">
          <div class="info-icon">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <path d="M26.667 9.333L13.333 22.667L5.333 14.667" stroke="url(#check-gradient)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
              <defs>
                <linearGradient id="check-gradient" x1="5.333" y1="9.333" x2="26.667" y2="22.667">
                  <stop stop-color="#00C853"/>
                  <stop offset="1" stop-color="#00BFA5"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          <h3>Automatisk prisindsamling</h3>
          <p>Vi scanner priserne fra alle butikker dagligt, så du altid har de nyeste priser.</p>
        </div>
        <div class="info-card">
          <div class="info-icon">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <path d="M16 28C22.627 28 28 22.627 28 16C28 9.373 22.627 4 16 4C9.373 4 4 9.373 4 16C4 22.627 9.373 28 16 28Z" stroke="url(#circle-gradient)" stroke-width="2.5"/>
              <path d="M16 10V16L20 20" stroke="url(#circle-gradient)" stroke-width="2.5" stroke-linecap="round"/>
              <defs>
                <linearGradient id="circle-gradient" x1="4" y1="4" x2="28" y2="28">
                  <stop stop-color="#00C853"/>
                  <stop offset="1" stop-color="#00BFA5"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          <h3>Prishistorik</h3>
          <p>Se hvordan priserne har udviklet sig over tid og find det bedste tidspunkt at købe.</p>
        </div>
        <div class="info-card">
          <div class="info-icon">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <path d="M4 12H28M4 20H28M12 4V28M20 4V28" stroke="url(#grid-gradient)" stroke-width="2.5" stroke-linecap="round"/>
              <defs>
                <linearGradient id="grid-gradient" x1="4" y1="4" x2="28" y2="28">
                  <stop stop-color="#00C853"/>
                  <stop offset="1" stop-color="#00BFA5"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          <h3>Nem sammenligning</h3>
          <p>Sammenlign priser på tværs af butikker med et enkelt klik.</p>
        </div>
      </div>
    </section>
  </div>
</div>

<style>
  .stores-page {
    padding-bottom: var(--space-3xl);
  }

  .page-header {
    text-align: center;
    margin-bottom: var(--space-3xl);
    padding-top: var(--space-xl);
  }

  .page-title {
    font-size: clamp(2rem, 4vw, 3rem);
    font-weight: 700;
    margin-bottom: var(--space-sm);
    letter-spacing: -0.02em;
  }

  .page-subtitle {
    font-size: 1.125rem;
    color: var(--color-text-secondary);
    max-width: 500px;
    margin: 0 auto;
  }

  .stores-grid {
    display: flex;
    flex-direction: column;
    gap: var(--space-md);
    margin-bottom: var(--space-3xl);
  }

  .store-card {
    display: flex;
    align-items: center;
    gap: var(--space-lg);
    padding: var(--space-lg) var(--space-xl);
    background: var(--color-surface);
    border-radius: var(--radius-xl);
    box-shadow: var(--shadow-sm);
    transition: all var(--transition-normal);
    cursor: pointer;
    opacity: 0;
    animation-fill-mode: forwards;
  }

  .store-card:hover {
    box-shadow: var(--shadow-lg);
    transform: translateY(-2px);
  }

  .store-logo {
    width: 64px;
    height: 64px;
    border-radius: var(--radius-lg);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .logo-letter {
    font-size: 1.75rem;
    font-weight: 700;
  }

  .store-info {
    flex: 1;
  }

  .store-name {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: var(--space-xs);
  }

  .store-stats {
    display: flex;
    gap: var(--space-md);
  }

  .stat {
    display: flex;
    align-items: center;
    gap: var(--space-xs);
    font-size: 0.8125rem;
    color: var(--color-text-secondary);
  }

  .store-action {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    color: var(--color-text-secondary);
  }

  .product-count {
    font-size: 0.875rem;
    font-weight: 500;
  }

  .info-section {
    text-align: center;
  }

  .info-section h2 {
    font-size: 1.75rem;
    font-weight: 600;
    margin-bottom: var(--space-xl);
  }

  .info-cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: var(--space-lg);
  }

  .info-card {
    background: var(--color-surface);
    border-radius: var(--radius-xl);
    padding: var(--space-xl);
    text-align: left;
    box-shadow: var(--shadow-sm);
  }

  .info-icon {
    width: 56px;
    height: 56px;
    background: linear-gradient(135deg, rgba(0, 200, 83, 0.1), rgba(0, 191, 165, 0.1));
    border-radius: var(--radius-md);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: var(--space-md);
  }

  .info-card h3 {
    font-size: 1.125rem;
    font-weight: 600;
    margin-bottom: var(--space-sm);
  }

  .info-card p {
    font-size: 0.9375rem;
    color: var(--color-text-secondary);
    line-height: 1.6;
  }

  @media (max-width: 768px) {
    .store-card {
      flex-wrap: wrap;
    }

    .store-action {
      width: 100%;
      justify-content: flex-end;
      padding-top: var(--space-sm);
      border-top: 1px solid var(--color-border);
    }
  }
</style>
