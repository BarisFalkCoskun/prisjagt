<script lang="ts">
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  import type { Product } from '$lib/types';

  interface Props {
    open?: boolean;
    onClose?: () => void;
  }

  let { open = $bindable(false), onClose }: Props = $props();

  let query = $state('');
  let results = $state<Product[]>([]);
  let loading = $state(false);
  let selectedIndex = $state(0);
  let inputElement: HTMLInputElement;
  let debounceTimer: ReturnType<typeof setTimeout>;

  const recentSearches = $state(['Mælk', 'Bananer', 'Brød', 'Æg']);

  $effect(() => {
    if (open) {
      document.body.classList.add('modal-open');
      setTimeout(() => inputElement?.focus(), 100);
    } else {
      document.body.classList.remove('modal-open');
      query = '';
      results = [];
      selectedIndex = 0;
    }
  });

  $effect(() => {
    if (query.length >= 2) {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => searchProducts(query), 200);
    } else {
      results = [];
    }
  });

  async function searchProducts(q: string) {
    loading = true;
    try {
      const res = await fetch(`/api/products?q=${encodeURIComponent(q)}&limit=8`);
      const data = await res.json();
      results = data.products || [];
      selectedIndex = 0;
    } catch (error) {
      console.error('Search failed:', error);
      results = [];
    } finally {
      loading = false;
    }
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      close();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      selectedIndex = Math.min(selectedIndex + 1, results.length - 1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      selectedIndex = Math.max(selectedIndex - 1, 0);
    } else if (e.key === 'Enter' && results[selectedIndex]) {
      e.preventDefault();
      navigateToProduct(results[selectedIndex]);
    }
  }

  function close() {
    open = false;
    onClose?.();
  }

  function navigateToProduct(product: Product) {
    close();
    goto(`/product/${product._id}`);
  }

  function handleBackdropClick(e: MouseEvent) {
    if (e.target === e.currentTarget) {
      close();
    }
  }

  function formatPrice(p: number) {
    // Price is in kroner as decimal (e.g., 2.5, 11.5, 125.99)
    const whole = Math.floor(p);
    const fraction = Math.round((p - whole) * 100);
    return `${whole},${String(fraction).padStart(2, '0')} kr`;
  }

  // Global keyboard shortcut
  onMount(() => {
    function handleGlobalKeydown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        open = !open;
      }
    }
    window.addEventListener('keydown', handleGlobalKeydown);
    return () => window.removeEventListener('keydown', handleGlobalKeydown);
  });
</script>

{#if open}
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div class="spotlight-overlay" onclick={handleBackdropClick}>
    <div class="spotlight-container animate-scale-in">
      <div class="search-header">
        <div class="search-icon">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M17.5 17.5L13.875 13.875M15.8333 9.16667C15.8333 12.8486 12.8486 15.8333 9.16667 15.8333C5.48477 15.8333 2.5 12.8486 2.5 9.16667C2.5 5.48477 5.48477 2.5 9.16667 2.5C12.8486 2.5 15.8333 5.48477 15.8333 9.16667Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <input
          bind:this={inputElement}
          bind:value={query}
          type="text"
          placeholder="Søg efter produkter..."
          class="search-input"
          onkeydown={handleKeydown}
        />
        {#if loading}
          <div class="spinner"></div>
        {:else}
          <kbd class="keyboard-shortcut">ESC</kbd>
        {/if}
      </div>

      <div class="search-body">
        {#if results.length > 0}
          <div class="results-section">
            <div class="section-label">Produkter</div>
            <div class="results-list">
              {#each results as product, index}
                <button
                  class="result-item"
                  class:selected={index === selectedIndex}
                  onclick={() => navigateToProduct(product)}
                  onmouseenter={() => selectedIndex = index}
                >
                  <div class="result-image">
                    {#if product.images?.[0]}
                      <img src={product.images[0]} alt="" />
                    {:else}
                      <div class="image-placeholder">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                          <rect x="2" y="2" width="16" height="16" rx="2" stroke="currentColor" stroke-width="1.5"/>
                          <circle cx="7" cy="7" r="1.5" stroke="currentColor" stroke-width="1.5"/>
                          <path d="M2 14L7 9L11 13L18 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                      </div>
                    {/if}
                  </div>
                  <div class="result-info">
                    <span class="result-name">{product.name}</span>
                    {#if product.brand}
                      <span class="result-brand">{product.brand}</span>
                    {/if}
                  </div>
                  <div class="result-price">
                    {formatPrice(product.price || 0)}
                  </div>
                  <div class="result-arrow">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M6 12L10 8L6 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </div>
                </button>
              {/each}
            </div>
          </div>
        {:else if query.length >= 2 && !loading}
          <div class="empty-results">
            <div class="empty-icon">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <circle cx="22" cy="22" r="14" stroke="currentColor" stroke-width="2"/>
                <path d="M32 32L42 42" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                <path d="M16 22H28" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </div>
            <p>Ingen produkter fundet for "{query}"</p>
          </div>
        {:else}
          <div class="suggestions">
            <div class="section-label">Seneste søgninger</div>
            <div class="suggestions-list">
              {#each recentSearches as search}
                <button class="suggestion-item" onclick={() => query = search}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M8 14C11.3137 14 14 11.3137 14 8C14 4.68629 11.3137 2 8 2C4.68629 2 2 4.68629 2 8C2 11.3137 4.68629 14 8 14Z" stroke="currentColor" stroke-width="1.5"/>
                    <path d="M8 5V8L10 10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                  </svg>
                  <span>{search}</span>
                </button>
              {/each}
            </div>

            <div class="section-label" style="margin-top: var(--space-4)">Populære kategorier</div>
            <div class="category-pills">
              <a href="/?category=Frugt%20%26%20gr%C3%B8nt" class="category-pill" onclick={close}>
                <span class="pill-icon">🥬</span>
                <span>Frugt & grønt</span>
              </a>
              <a href="/?category=Mejeri%20%26%20k%C3%B8l" class="category-pill" onclick={close}>
                <span class="pill-icon">🥛</span>
                <span>Mejeri & køl</span>
              </a>
              <a href="/?category=Frost" class="category-pill" onclick={close}>
                <span class="pill-icon">❄️</span>
                <span>Frost</span>
              </a>
            </div>
          </div>
        {/if}
      </div>

      <div class="search-footer">
        <div class="footer-hint">
          <kbd>↑</kbd><kbd>↓</kbd> navigér
        </div>
        <div class="footer-hint">
          <kbd>↵</kbd> vælg
        </div>
        <div class="footer-hint">
          <kbd>esc</kbd> luk
        </div>
      </div>
    </div>
  </div>
{/if}

<style>
  .spotlight-overlay {
    position: fixed;
    inset: 0;
    background: var(--color-overlay);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    z-index: var(--z-spotlight);
    display: flex;
    align-items: flex-start;
    justify-content: center;
    padding: 10vh var(--space-4);
  }

  .spotlight-container {
    width: 100%;
    max-width: 640px;
    background: var(--color-surface);
    border-radius: var(--radius-2xl);
    box-shadow: var(--shadow-2xl);
    overflow: hidden;
    display: flex;
    flex-direction: column;
    max-height: 70vh;
  }

  .search-header {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    padding: var(--space-4) var(--space-5);
    border-bottom: 1px solid var(--color-border);
  }

  .search-icon {
    color: var(--color-text-secondary);
    flex-shrink: 0;
  }

  .search-input {
    flex: 1;
    border: none;
    background: transparent;
    font-size: var(--text-md);
    outline: none;
  }

  .search-input::placeholder {
    color: var(--color-text-tertiary);
  }

  .keyboard-shortcut {
    padding: var(--space-1) var(--space-2);
    background: var(--color-border);
    border-radius: var(--radius-xs);
    font-family: var(--font-mono);
    font-size: var(--text-xs);
    color: var(--color-text-secondary);
  }

  .search-body {
    flex: 1;
    overflow-y: auto;
    padding: var(--space-3);
  }

  .section-label {
    font-size: var(--text-xs);
    font-weight: 600;
    color: var(--color-text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    padding: var(--space-2) var(--space-3);
  }

  .results-list {
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
  }

  .result-item {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    padding: var(--space-3);
    border-radius: var(--radius-md);
    transition: background var(--transition-fast);
    text-align: left;
    width: 100%;
  }

  .result-item:hover,
  .result-item.selected {
    background: var(--color-surface-hover);
  }

  .result-image {
    width: 48px;
    height: 48px;
    border-radius: var(--radius-sm);
    overflow: hidden;
    background: var(--color-bg);
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .result-image img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    padding: 4px;
  }

  .image-placeholder {
    color: var(--color-text-tertiary);
  }

  .result-info {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .result-name {
    font-weight: 500;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .result-brand {
    font-size: var(--text-xs);
    color: var(--color-text-secondary);
  }

  .result-price {
    font-weight: 600;
    color: var(--color-accent);
    flex-shrink: 0;
  }

  .result-arrow {
    color: var(--color-text-tertiary);
    opacity: 0;
    transition: opacity var(--transition-fast);
  }

  .result-item:hover .result-arrow,
  .result-item.selected .result-arrow {
    opacity: 1;
  }

  .empty-results {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: var(--space-12) var(--space-4);
    text-align: center;
    color: var(--color-text-secondary);
  }

  .empty-icon {
    color: var(--color-text-tertiary);
    margin-bottom: var(--space-4);
  }

  .suggestions-list {
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
  }

  .suggestion-item {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    padding: var(--space-3);
    border-radius: var(--radius-md);
    color: var(--color-text-secondary);
    transition: all var(--transition-fast);
    width: 100%;
    text-align: left;
  }

  .suggestion-item:hover {
    background: var(--color-surface-hover);
    color: var(--color-text);
  }

  .category-pills {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-2);
    padding: var(--space-2) var(--space-3);
  }

  .category-pill {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    padding: var(--space-2) var(--space-4);
    background: var(--color-bg);
    border-radius: var(--radius-full);
    font-size: var(--text-sm);
    font-weight: 500;
    transition: all var(--transition-fast);
  }

  .category-pill:hover {
    background: var(--gradient-accent);
    color: white;
  }

  .pill-icon {
    font-size: 1rem;
  }

  .search-footer {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-6);
    padding: var(--space-3) var(--space-5);
    border-top: 1px solid var(--color-border);
    background: var(--color-bg);
  }

  .footer-hint {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    font-size: var(--text-xs);
    color: var(--color-text-tertiary);
  }

  .footer-hint kbd {
    padding: 2px 6px;
    background: var(--color-surface);
    border-radius: var(--radius-xs);
    font-family: var(--font-mono);
    border: 1px solid var(--color-border);
  }

  @media (max-width: 640px) {
    .spotlight-overlay {
      padding: var(--space-4);
      align-items: stretch;
    }

    .spotlight-container {
      max-height: none;
      height: 100%;
      border-radius: var(--radius-xl);
    }

    .search-footer {
      display: none;
    }
  }
</style>
