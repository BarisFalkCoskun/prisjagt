<script lang="ts">
  import { goto } from '$app/navigation';

  interface Props {
    value?: string;
    placeholder?: string;
  }

  let { value = $bindable(''), placeholder = 'Søg efter produkter...' }: Props = $props();
  let inputElement: HTMLInputElement;

  function handleSubmit(e: Event) {
    e.preventDefault();
    if (value.trim()) {
      goto(`/?q=${encodeURIComponent(value.trim())}`);
    }
  }

  function handleClear() {
    value = '';
    inputElement?.focus();
    goto('/');
  }
</script>

<form class="search-bar" onsubmit={handleSubmit}>
  <div class="search-icon">
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M17.5 17.5L13.875 13.875M15.8333 9.16667C15.8333 12.8486 12.8486 15.8333 9.16667 15.8333C5.48477 15.8333 2.5 12.8486 2.5 9.16667C2.5 5.48477 5.48477 2.5 9.16667 2.5C12.8486 2.5 15.8333 5.48477 15.8333 9.16667Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  </div>
  <input
    bind:this={inputElement}
    bind:value
    type="search"
    {placeholder}
    class="search-input"
  />
  {#if value}
    <button type="button" class="clear-button" onclick={handleClear} aria-label="Ryd søgning">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>
  {/if}
</form>

<style>
  .search-bar {
    position: relative;
    display: flex;
    align-items: center;
    background: var(--color-surface);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-md);
    transition: box-shadow var(--transition-fast);
    overflow: hidden;
  }

  .search-bar:focus-within {
    box-shadow: var(--shadow-lg), 0 0 0 3px rgba(0, 200, 83, 0.15);
  }

  .search-icon {
    position: absolute;
    left: var(--space-lg);
    color: var(--color-text-secondary);
    display: flex;
    pointer-events: none;
  }

  .search-input {
    width: 100%;
    height: 56px;
    padding: 0 var(--space-xl) 0 calc(var(--space-lg) + 28px);
    border: none;
    background: transparent;
    font-size: 1rem;
    color: var(--color-text);
    outline: none;
  }

  .search-input::placeholder {
    color: var(--color-text-secondary);
  }

  .search-input::-webkit-search-cancel-button {
    display: none;
  }

  .clear-button {
    position: absolute;
    right: var(--space-md);
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: var(--radius-sm);
    color: var(--color-text-secondary);
    transition: all var(--transition-fast);
  }

  .clear-button:hover {
    background: rgba(0, 0, 0, 0.05);
    color: var(--color-text);
  }
</style>
