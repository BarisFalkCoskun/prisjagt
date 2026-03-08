<script lang="ts">
  import { onMount } from 'svelte';

  interface Category {
    id: string;
    name: string;
    icon?: string;
  }

  interface Props {
    categories: Category[];
    selected?: string;
    onSelect?: (id: string) => void;
  }

  let { categories, selected = $bindable(''), onSelect }: Props = $props();

  let containerRef: HTMLDivElement;
  let pillRefs: HTMLButtonElement[] = [];
  let indicatorStyle = $state('');
  let isInitialized = $state(false);

  function updateIndicator() {
    const activeIndex = selected ? categories.findIndex(c => c.id === selected) + 1 : 0;
    const activeEl = pillRefs[activeIndex];

    if (activeEl && containerRef) {
      const containerRect = containerRef.getBoundingClientRect();
      const pillRect = activeEl.getBoundingClientRect();

      indicatorStyle = `
        --indicator-left: ${pillRect.left - containerRect.left + containerRef.scrollLeft}px;
        --indicator-width: ${pillRect.width}px;
      `;
    }
  }

  $effect(() => {
    selected;
    if (isInitialized) {
      updateIndicator();
    }
  });

  onMount(() => {
    // Small delay to ensure DOM is ready
    requestAnimationFrame(() => {
      isInitialized = true;
      updateIndicator();
    });

    const resizeObserver = new ResizeObserver(() => updateIndicator());
    resizeObserver.observe(containerRef);

    return () => resizeObserver.disconnect();
  });

  function handleSelect(id: string) {
    selected = selected === id ? '' : id;
    onSelect?.(selected);
  }
</script>

<div
  class="category-container"
  bind:this={containerRef}
>
  <!-- Fade edges -->
  <div class="fade-left"></div>
  <div class="fade-right"></div>

  <div class="category-pills hide-scrollbar" style={indicatorStyle}>
    <!-- Sliding indicator -->
    <div class="pill-indicator" class:visible={isInitialized}></div>

    <button
      class="pill all-pill"
      class:active={!selected}
      onclick={() => handleSelect('')}
      bind:this={pillRefs[0]}
    >
      <span class="pill-content">
        <svg class="pill-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
          <rect x="2" y="2" width="5" height="5" rx="1.5" stroke="currentColor" stroke-width="1.5"/>
          <rect x="9" y="2" width="5" height="5" rx="1.5" stroke="currentColor" stroke-width="1.5"/>
          <rect x="2" y="9" width="5" height="5" rx="1.5" stroke="currentColor" stroke-width="1.5"/>
          <rect x="9" y="9" width="5" height="5" rx="1.5" stroke="currentColor" stroke-width="1.5"/>
        </svg>
        <span class="pill-text">Alle</span>
      </span>
    </button>

    {#each categories as category, i}
      <button
        class="pill"
        class:active={selected === category.id}
        onclick={() => handleSelect(category.id)}
        bind:this={pillRefs[i + 1]}
      >
        <span class="pill-content">
          {#if category.icon}
            <span class="emoji-icon">{category.icon}</span>
          {/if}
          <span class="pill-text">{category.name}</span>
        </span>
      </button>
    {/each}
  </div>
</div>

<style>
  .category-container {
    position: relative;
    margin: 0 calc(var(--space-4) * -1);
  }

  /* Fade edges for scroll indication */
  .fade-left,
  .fade-right {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 40px;
    pointer-events: none;
    z-index: 2;
    opacity: 0;
    transition: opacity 0.2s ease;
  }

  .fade-left {
    left: 0;
    background: linear-gradient(to right, var(--color-surface) 30%, transparent);
  }

  .fade-right {
    right: 0;
    background: linear-gradient(to left, var(--color-surface) 30%, transparent);
  }

  .category-container:hover .fade-left,
  .category-container:hover .fade-right {
    opacity: 1;
  }

  .category-pills {
    position: relative;
    display: flex;
    gap: var(--space-2);
    overflow-x: auto;
    padding: var(--space-2) var(--space-4);
    scroll-behavior: smooth;
    -webkit-overflow-scrolling: touch;
  }

  /* Sliding indicator - hidden, using direct styling instead */
  .pill-indicator {
    display: none;
  }

  .pill {
    position: relative;
    z-index: 1;
    display: flex;
    align-items: center;
    padding: 0;
    background: transparent;
    border: none;
    border-radius: var(--radius-full);
    font-size: var(--text-sm);
    font-weight: 500;
    color: var(--color-text-secondary);
    white-space: nowrap;
    flex-shrink: 0;
    transition: color 0.25s ease;
    cursor: pointer;
  }

  .pill-content {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    padding: var(--space-2) var(--space-4);
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-full);
    transition: all 0.25s var(--ease-out-expo);
    box-shadow: var(--shadow-xs);
  }

  .pill:hover .pill-content {
    background: var(--color-surface);
    border-color: var(--color-border-strong);
    color: var(--color-text);
    box-shadow: var(--shadow-sm);
  }

  .pill.active .pill-content {
    background: var(--gradient-accent);
    border-color: transparent;
    color: white;
    box-shadow: 0 4px 12px rgba(0, 200, 83, 0.25);
  }

  .pill.active:hover .pill-content {
    background: var(--gradient-accent);
    border-color: transparent;
  }

  .all-pill .pill-content {
    padding-left: var(--space-3);
  }

  .pill-icon {
    flex-shrink: 0;
    transition: transform 0.2s ease;
  }

  .pill.active .pill-icon {
    transform: scale(1.1);
  }

  .emoji-icon {
    font-size: 1rem;
    line-height: 1;
    transition: transform 0.3s var(--ease-out-expo);
  }

  .pill:hover .emoji-icon {
    transform: scale(1.15);
  }

  .pill.active .emoji-icon {
    transform: scale(1.2);
  }

  .pill-text {
    font-weight: 500;
    letter-spacing: -0.01em;
    transition: letter-spacing 0.2s ease;
  }

  .pill.active .pill-text {
    font-weight: 600;
    letter-spacing: 0;
  }

  /* Ripple effect on click */
  .pill::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: var(--radius-full);
    background: rgba(0, 200, 83, 0.15);
    opacity: 0;
    transform: scale(0.8);
    transition: all 0.3s ease;
  }

  .pill:active::after {
    opacity: 1;
    transform: scale(1);
    transition: all 0.1s ease;
  }

  @media (min-width: 768px) {
    .category-container {
      margin: 0;
    }

    .category-pills {
      padding-left: 0;
      padding-right: 0;
      justify-content: center;
      flex-wrap: wrap;
    }

    .fade-left,
    .fade-right {
      display: none;
    }
  }

  /* Touch devices - larger targets */
  @media (pointer: coarse) {
    .pill-content {
      padding: var(--space-3) var(--space-5);
    }

    .all-pill .pill-content {
      padding-left: var(--space-4);
    }

    .pill-indicator {
      height: 44px;
    }
  }
</style>
