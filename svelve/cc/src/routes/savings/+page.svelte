<script lang="ts">
  const mockSavings = [
    { month: 'Jan', amount: 127 },
    { month: 'Feb', amount: 89 },
    { month: 'Mar', amount: 156 },
    { month: 'Apr', amount: 203 },
    { month: 'Maj', amount: 178 },
    { month: 'Jun', amount: 234 }
  ];

  const totalSavings = mockSavings.reduce((sum, m) => sum + m.amount, 0);
  const maxSavings = Math.max(...mockSavings.map(m => m.amount));
</script>

<svelte:head>
  <title>Besparelser - PrisJagt</title>
</svelte:head>

<div class="savings-page">
  <div class="container">
    <header class="page-header">
      <h1 class="page-title">Dine besparelser</h1>
      <p class="page-subtitle">
        Se hvor meget du kan spare ved at sammenligne priser
      </p>
    </header>

    <div class="savings-overview">
      <div class="savings-card main">
        <span class="label">Potentielle besparelser</span>
        <span class="value">{totalSavings} kr</span>
        <span class="period">Sidste 6 måneder</span>
      </div>
      <div class="savings-card">
        <span class="label">Denne måned</span>
        <span class="value">{mockSavings[mockSavings.length - 1].amount} kr</span>
      </div>
      <div class="savings-card">
        <span class="label">Gennemsnit pr. måned</span>
        <span class="value">{Math.round(totalSavings / mockSavings.length)} kr</span>
      </div>
    </div>

    <section class="chart-section">
      <h2>Besparelser over tid</h2>
      <div class="bar-chart">
        {#each mockSavings as month, index}
          <div class="bar-item" style="--delay: {index * 100}ms">
            <div class="bar-container">
              <div
                class="bar"
                style="height: {(month.amount / maxSavings) * 100}%"
              >
                <span class="bar-value">{month.amount} kr</span>
              </div>
            </div>
            <span class="bar-label">{month.month}</span>
          </div>
        {/each}
      </div>
    </section>

    <section class="tips-section">
      <h2>Spartips</h2>
      <div class="tips-grid">
        <div class="tip-card">
          <div class="tip-number">1</div>
          <h3>Sammenlign før du køber</h3>
          <p>Tjek altid priserne på flere butikker inden du handler. Prisforskellen kan være op til 30%.</p>
        </div>
        <div class="tip-card">
          <div class="tip-number">2</div>
          <h3>Køb på tilbud</h3>
          <p>Hold øje med tilbud og udsalg. Mange varer kommer på tilbud med faste intervaller.</p>
        </div>
        <div class="tip-card">
          <div class="tip-number">3</div>
          <h3>Tjek prishistorikken</h3>
          <p>Se om prisen er god sammenlignet med historikken, før du slår til på et "tilbud".</p>
        </div>
      </div>
    </section>
  </div>
</div>

<style>
  .savings-page {
    padding: calc(var(--header-height) + var(--space-8)) 0 var(--space-16);
  }

  .page-header {
    text-align: center;
    margin-bottom: var(--space-10);
  }

  .page-title {
    font-size: clamp(2rem, 4vw, 2.5rem);
    font-weight: 700;
    margin-bottom: var(--space-3);
    letter-spacing: -0.02em;
  }

  .page-subtitle {
    font-size: var(--text-md);
    color: var(--color-text-secondary);
    max-width: 500px;
    margin: 0 auto;
  }

  .savings-overview {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr;
    gap: var(--space-4);
    margin-bottom: var(--space-10);
  }

  .savings-card {
    background: var(--color-surface);
    border-radius: var(--radius-2xl);
    padding: var(--space-6);
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
    border: 1px solid var(--color-border);
  }

  .savings-card.main {
    background: linear-gradient(135deg, #00C853, #00BFA5);
    color: white;
    border: none;
  }

  .savings-card .label {
    font-size: var(--text-sm);
    opacity: 0.8;
  }

  .savings-card .value {
    font-size: clamp(2rem, 5vw, 2.5rem);
    font-weight: 700;
    line-height: 1;
    letter-spacing: -0.02em;
  }

  .savings-card.main .value {
    font-size: clamp(2.5rem, 6vw, 3.5rem);
  }

  .savings-card .period {
    font-size: var(--text-xs);
    opacity: 0.7;
    margin-top: var(--space-2);
  }

  .chart-section {
    margin-bottom: var(--space-10);
  }

  .chart-section h2 {
    font-size: var(--text-xl);
    font-weight: 600;
    margin-bottom: var(--space-5);
  }

  .bar-chart {
    display: flex;
    align-items: flex-end;
    gap: var(--space-4);
    height: 280px;
    background: var(--color-surface);
    border-radius: var(--radius-2xl);
    padding: var(--space-6);
    border: 1px solid var(--color-border);
  }

  .bar-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100%;
  }

  .bar-container {
    flex: 1;
    width: 100%;
    display: flex;
    align-items: flex-end;
    justify-content: center;
  }

  .bar {
    width: 100%;
    max-width: 60px;
    background: linear-gradient(180deg, #00C853, #00BFA5);
    border-radius: var(--radius-lg) var(--radius-lg) 0 0;
    position: relative;
    min-height: 20px;
    transition: height 0.6s ease-out;
  }

  .bar-value {
    position: absolute;
    top: -28px;
    left: 50%;
    transform: translateX(-50%);
    font-size: var(--text-xs);
    font-weight: 600;
    color: var(--color-text);
    white-space: nowrap;
  }

  .bar-label {
    margin-top: var(--space-3);
    font-size: var(--text-sm);
    color: var(--color-text-secondary);
    font-weight: 500;
  }

  .tips-section h2 {
    font-size: var(--text-xl);
    font-weight: 600;
    margin-bottom: var(--space-5);
  }

  .tips-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--space-4);
  }

  .tip-card {
    background: var(--color-surface);
    border-radius: var(--radius-2xl);
    padding: var(--space-6);
    border: 1px solid var(--color-border);
  }

  .tip-number {
    width: 36px;
    height: 36px;
    background: linear-gradient(135deg, rgba(0, 200, 83, 0.15), rgba(0, 191, 165, 0.15));
    color: #00C853;
    border-radius: var(--radius-lg);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: var(--text-md);
    font-weight: 700;
    margin-bottom: var(--space-4);
  }

  .tip-card h3 {
    font-size: var(--text-md);
    font-weight: 600;
    margin-bottom: var(--space-2);
  }

  .tip-card p {
    font-size: var(--text-sm);
    color: var(--color-text-secondary);
    line-height: 1.6;
  }

  @media (max-width: 968px) {
    .savings-overview {
      grid-template-columns: 1fr;
    }

    .tips-grid {
      grid-template-columns: 1fr;
    }

    .bar-chart {
      height: 240px;
      gap: var(--space-2);
    }
  }
</style>
