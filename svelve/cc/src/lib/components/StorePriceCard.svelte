<script lang="ts">
  import type { Store } from '$lib/types';

  interface Props {
    store: Store;
    price: number;
    originalPrice?: number;
    inStock?: boolean;
    isLowest?: boolean;
    index?: number;
  }

  let { store, price, originalPrice, inStock = true, isLowest = false, index = 0 }: Props = $props();

  const hasDiscount = $derived(originalPrice && originalPrice > price);
  const discountPercent = $derived(
    hasDiscount && originalPrice ? Math.round((1 - price / originalPrice) * 100) : 0
  );

  const formatPrice = (p: number) => {
    // Price is in kroner as decimal (e.g., 2.5, 11.5, 125.99)
    const whole = Math.floor(p);
    const fraction = Math.round((p - whole) * 100);
    return `${whole},${String(fraction).padStart(2, '0')}`;
  };

  // Store colors mapping
  const storeColors: Record<string, string> = {
    netto: '#FFD700',
    bilkatogo: '#004B93',
    foetexplus: '#00457C',
    fillop: '#E31937',
    rema1000: '#003366',
    meny: '#D4002A',
    spar: '#00843D',
    minkobmand: '#1E3A5F',
    dagrofa: '#FF6B00',
  };

  const storeColor = $derived(storeColors[store.id] || '#888888');

  let isHovered = $state(false);
</script>

<div
  class="store-card"
  class:lowest={isLowest}
  class:unavailable={!inStock}
  style="--store-color: {storeColor}; --index: {index}"
  role="article"
  onmouseenter={() => isHovered = true}
  onmouseleave={() => isHovered = false}
>
  <!-- Glow effect for lowest price -->
  {#if isLowest}
    <div class="card-glow"></div>
  {/if}

  <div class="card-content">
    <!-- Rank badge -->
    <div class="rank">
      <span class="rank-number">{index + 1}</span>
    </div>

    <!-- Store branding -->
    <div class="store-brand">
      <div class="store-avatar">
        <span class="avatar-letter">{store.name.charAt(0)}</span>
        {#if isLowest}
          <div class="crown-badge">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2 8.5L3.5 4L6 6L8.5 4L10 8.5H2Z" fill="currentColor"/>
              <path d="M2 9.5H10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
          </div>
        {/if}
      </div>
      <div class="store-meta">
        <span class="store-name">{store.name}</span>
        <div class="availability">
          <span class="status-indicator" class:available={inStock}></span>
          <span class="status-text">{inStock ? 'På lager' : 'Ikke tilgængelig'}</span>
        </div>
      </div>
    </div>

    <!-- Price display -->
    <div class="price-area">
      {#if hasDiscount}
        <div class="savings-tag">
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M5 8V2M5 2L2 5M5 2L8 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span>{discountPercent}%</span>
        </div>
      {/if}
      <div class="price-row">
        <span class="price-whole">{formatPrice(price).split(',')[0]}</span>
        <span class="price-fraction">,{formatPrice(price).split(',')[1]}</span>
        <span class="price-unit">kr</span>
      </div>
      {#if hasDiscount && originalPrice}
        <span class="was-price">Før {formatPrice(originalPrice)} kr</span>
      {/if}
    </div>

    <!-- Action button -->
    <button class="action-btn" class:active={isHovered} disabled={!inStock}>
      <span class="btn-text">Gå til butik</span>
      <span class="btn-icon">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M4 12L12 4M12 4H6M12 4V10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </span>
    </button>
  </div>

  <!-- Lowest price label -->
  {#if isLowest}
    <div class="lowest-label">
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M3 7L6 10L11 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <span>Bedste pris</span>
    </div>
  {/if}
</div>

<style>
  .store-card {
    position: relative;
    opacity: 0;
    transform: translateY(20px);
    animation: cardIn 0.5s var(--ease-out-expo) calc(var(--index) * 80ms) forwards;
  }

  @keyframes cardIn {
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .card-glow {
    position: absolute;
    inset: -1px;
    background: var(--gradient-accent);
    border-radius: calc(var(--radius-2xl) + 1px);
    opacity: 0.15;
    filter: blur(8px);
    transition: opacity 0.3s ease;
  }

  .store-card:hover .card-glow {
    opacity: 0.25;
  }

  .card-content {
    position: relative;
    display: grid;
    grid-template-columns: auto 1fr auto auto;
    align-items: center;
    gap: var(--space-4);
    padding: var(--space-5) var(--space-6);
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-2xl);
    transition: all 0.3s var(--ease-out-expo);
  }

  .store-card:hover .card-content {
    border-color: var(--color-border-strong);
    transform: translateX(4px);
    box-shadow: var(--shadow-lg);
  }

  .store-card.lowest .card-content {
    background: linear-gradient(135deg, rgba(0, 200, 83, 0.04) 0%, var(--color-surface) 100%);
    border-color: rgba(0, 200, 83, 0.2);
  }

  .store-card.lowest:hover .card-content {
    border-color: rgba(0, 200, 83, 0.4);
  }

  .store-card.unavailable {
    opacity: 0.5;
    pointer-events: none;
  }

  /* Rank */
  .rank {
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--color-bg);
    border-radius: var(--radius-md);
  }

  .rank-number {
    font-size: var(--text-sm);
    font-weight: 700;
    color: var(--color-text-tertiary);
  }

  .store-card.lowest .rank {
    background: var(--gradient-accent);
  }

  .store-card.lowest .rank-number {
    color: white;
  }

  /* Store Brand */
  .store-brand {
    display: flex;
    align-items: center;
    gap: var(--space-4);
  }

  .store-avatar {
    position: relative;
    width: 52px;
    height: 52px;
    border-radius: var(--radius-xl);
    background: color-mix(in srgb, var(--store-color) 12%, var(--color-bg));
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.3s ease;
  }

  .store-card:hover .store-avatar {
    transform: scale(1.05);
  }

  .avatar-letter {
    font-size: var(--text-xl);
    font-weight: 800;
    color: var(--store-color);
  }

  .crown-badge {
    position: absolute;
    top: -6px;
    right: -6px;
    width: 22px;
    height: 22px;
    background: var(--gradient-accent);
    border-radius: var(--radius-full);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    box-shadow: 0 2px 8px rgba(0, 200, 83, 0.4);
    animation: crownBounce 0.5s var(--ease-out-expo) 0.3s backwards;
  }

  @keyframes crownBounce {
    from {
      transform: scale(0);
    }
    50% {
      transform: scale(1.2);
    }
  }

  .store-meta {
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
  }

  .store-name {
    font-size: var(--text-md);
    font-weight: 600;
    color: var(--color-text);
  }

  .availability {
    display: flex;
    align-items: center;
    gap: var(--space-2);
  }

  .status-indicator {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--color-text-tertiary);
  }

  .status-indicator.available {
    background: var(--color-success);
    box-shadow: 0 0 0 2px rgba(0, 200, 83, 0.2);
  }

  .status-text {
    font-size: var(--text-xs);
    color: var(--color-text-secondary);
  }

  /* Price Area */
  .price-area {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 2px;
  }

  .savings-tag {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 2px 8px;
    background: linear-gradient(135deg, rgba(0, 200, 83, 0.1), rgba(0, 191, 165, 0.1));
    color: var(--color-success);
    font-size: 11px;
    font-weight: 700;
    border-radius: var(--radius-full);
    margin-bottom: var(--space-1);
  }

  .price-row {
    display: flex;
    align-items: baseline;
  }

  .price-whole {
    font-size: var(--text-2xl);
    font-weight: 700;
    letter-spacing: -0.03em;
    color: var(--color-text);
  }

  .store-card.lowest .price-whole {
    background: var(--gradient-accent);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .price-fraction {
    font-size: var(--text-base);
    font-weight: 700;
    color: var(--color-text);
  }

  .store-card.lowest .price-fraction {
    background: var(--gradient-accent);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .price-unit {
    font-size: var(--text-sm);
    font-weight: 600;
    color: var(--color-text-secondary);
    margin-left: 4px;
  }

  .was-price {
    font-size: var(--text-xs);
    color: var(--color-text-tertiary);
    text-decoration: line-through;
  }

  /* Action Button */
  .action-btn {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    padding: var(--space-3) var(--space-5);
    background: var(--color-bg);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-xl);
    font-size: var(--text-sm);
    font-weight: 600;
    color: var(--color-text-secondary);
    transition: all 0.2s ease;
    overflow: hidden;
  }

  .action-btn:hover:not(:disabled) {
    background: var(--color-text);
    border-color: var(--color-text);
    color: var(--color-bg);
    transform: scale(1.02);
  }

  .action-btn:active:not(:disabled) {
    transform: scale(0.98);
  }

  .action-btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  .btn-icon {
    display: flex;
    transition: transform 0.2s ease;
  }

  .action-btn:hover .btn-icon {
    transform: translate(2px, -2px);
  }

  /* Lowest Label */
  .lowest-label {
    position: absolute;
    top: 0;
    left: var(--space-6);
    transform: translateY(-50%);
    display: flex;
    align-items: center;
    gap: var(--space-1);
    padding: var(--space-1) var(--space-4);
    background: var(--gradient-accent);
    color: white;
    font-size: var(--text-xs);
    font-weight: 700;
    border-radius: var(--radius-full);
    box-shadow: 0 4px 12px rgba(0, 200, 83, 0.35);
  }

  /* Responsive */
  @media (max-width: 768px) {
    .card-content {
      grid-template-columns: auto 1fr auto;
      grid-template-rows: auto auto;
      gap: var(--space-3);
      padding: var(--space-4);
    }

    .rank {
      grid-row: 1 / 3;
    }

    .store-brand {
      grid-column: 2;
    }

    .price-area {
      grid-column: 3;
      grid-row: 1 / 3;
    }

    .action-btn {
      grid-column: 2;
      justify-self: start;
    }

    .btn-text {
      display: none;
    }

    .action-btn {
      padding: var(--space-3);
    }
  }

  @media (max-width: 480px) {
    .card-content {
      grid-template-columns: 1fr auto;
    }

    .rank {
      display: none;
    }

    .store-avatar {
      width: 44px;
      height: 44px;
    }

    .avatar-letter {
      font-size: var(--text-lg);
    }

    .action-btn {
      grid-column: 2;
      grid-row: 1;
    }

    .price-area {
      grid-column: 1 / -1;
      align-items: flex-start;
      flex-direction: row;
      gap: var(--space-3);
    }
  }
</style>
