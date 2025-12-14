<script lang="ts">
  interface Product {
    _id: string;
    name: string;
    description?: string;
    brand?: string;
    images?: string[];
    image_primary?: string | null;
    category?: string;
    price: number;
    originalPrice?: number;
    inStock?: boolean;
    storeId: string;
    storeName: string;
    storeColor: string;
  }

  interface Props {
    product: Product;
    index?: number;
  }

  let { product, index = 0 }: Props = $props();

  const hasDiscount = $derived(product.originalPrice && product.originalPrice > product.price);
  const discountPercent = $derived(
    hasDiscount
      ? Math.round((1 - product.price / product.originalPrice!) * 100)
      : 0
  );

  const imageUrl = $derived(
    product.image_primary ||
    product.images?.[0] ||
    ''
  );

  const formatPrice = (p: number) => {
    const whole = Math.floor(p);
    const fraction = Math.round((p - whole) * 100);
    return { whole, fraction: String(fraction).padStart(2, '0') };
  };

  const priceFormatted = $derived(formatPrice(product.price));

  let imageLoaded = $state(false);
  let imageError = $state(false);
</script>

<a
  href="/product/{product._id}"
  class="product-card"
  style="--delay: {index * 30}ms; --store-color: {product.storeColor}"
>
  <!-- Store indicator line -->
  <div class="store-indicator"></div>

  <div class="image-section">
    {#if imageUrl && !imageError}
      <img
        src={imageUrl}
        alt={product.name}
        loading="lazy"
        class:loaded={imageLoaded}
        onload={() => imageLoaded = true}
        onerror={() => imageError = true}
      />
    {:else}
      <div class="image-placeholder">
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
          <rect x="4" y="4" width="24" height="24" rx="4" stroke="currentColor" stroke-width="1.5"/>
          <circle cx="11" cy="11" r="2.5" stroke="currentColor" stroke-width="1.5"/>
          <path d="M4 22L12 14L20 22L28 14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
      </div>
    {/if}

    {#if hasDiscount}
      <div class="discount-tag">-{discountPercent}%</div>
    {/if}
  </div>

  <div class="content">
    <div class="store-name">{product.storeName}</div>

    <h3 class="product-name">{product.name}</h3>

    <div class="price-row">
      <div class="price">
        <span class="price-whole">{priceFormatted.whole}</span>
        <span class="price-fraction">,{priceFormatted.fraction}</span>
        <span class="price-currency">kr</span>
      </div>
      {#if hasDiscount}
        <span class="original-price">{formatPrice(product.originalPrice!).whole},{formatPrice(product.originalPrice!).fraction} kr</span>
      {/if}
    </div>
  </div>
</a>

<style>
  .product-card {
    position: relative;
    display: flex;
    flex-direction: column;
    background: var(--color-surface);
    border-radius: 16px;
    overflow: hidden;
    opacity: 0;
    transform: translateY(16px);
    animation: cardIn 0.4s ease var(--delay) forwards;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    border: 1px solid var(--color-border);
    box-shadow: var(--shadow-sm);
  }

  :global(.dark) .product-card {
    border-color: transparent;
  }

  @keyframes cardIn {
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .product-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
    border-color: var(--color-border-strong);
  }

  :global(.dark) .product-card:hover {
    border-color: transparent;
  }

  /* Store indicator - subtle colored line at top */
  .store-indicator {
    height: 3px;
    background: var(--store-color);
  }

  /* Image Section */
  .image-section {
    position: relative;
    aspect-ratio: 1;
    background: #f8f8f8;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }

  :global(.dark) .image-section {
    background: #1a1a1a;
  }

  .image-section img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    padding: 24px;
    opacity: 0;
    transform: scale(0.95);
    transition: all 0.4s ease;
  }

  .image-section img.loaded {
    opacity: 1;
    transform: scale(1);
  }

  .product-card:hover .image-section img.loaded {
    transform: scale(1.05);
  }

  .image-placeholder {
    color: #ccc;
  }

  :global(.dark) .image-placeholder {
    color: #444;
  }

  /* Discount Tag */
  .discount-tag {
    position: absolute;
    top: 12px;
    right: 12px;
    padding: 4px 10px;
    background: #ff3b30;
    color: white;
    font-size: 12px;
    font-weight: 600;
    border-radius: 6px;
  }

  /* Content */
  .content {
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .store-name {
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: var(--store-color);
  }

  .product-name {
    font-size: 14px;
    font-weight: 500;
    color: var(--color-text);
    line-height: 1.4;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    min-height: 2.8em;
  }

  .price-row {
    display: flex;
    align-items: baseline;
    gap: 8px;
    margin-top: 4px;
  }

  .price {
    display: flex;
    align-items: baseline;
  }

  .price-whole {
    font-size: 22px;
    font-weight: 700;
    letter-spacing: -0.02em;
    color: var(--color-text);
  }

  .price-fraction {
    font-size: 14px;
    font-weight: 600;
    color: var(--color-text);
  }

  .price-currency {
    font-size: 13px;
    font-weight: 500;
    color: var(--color-text-secondary);
    margin-left: 2px;
  }

  .original-price {
    font-size: 13px;
    color: var(--color-text-tertiary);
    text-decoration: line-through;
  }

  /* Responsive */
  @media (max-width: 640px) {
    .image-section img {
      padding: 16px;
    }

    .content {
      padding: 12px;
    }

    .product-name {
      font-size: 13px;
    }

    .price-whole {
      font-size: 18px;
    }

    .price-fraction {
      font-size: 12px;
    }
  }

  /* Reduced Motion */
  @media (prefers-reduced-motion: reduce) {
    .product-card {
      animation: none;
      opacity: 1;
      transform: none;
    }

    .product-card:hover {
      transform: none;
    }
  }
</style>
