<script lang="ts">
  interface Props {
    count?: number;
  }

  let { count = 1 }: Props = $props();
</script>

{#each Array(count) as _, i}
  <div class="skeleton-card" style="animation-delay: {i * 100}ms">
    <div class="skeleton-image skeleton"></div>
    <div class="skeleton-content">
      <div class="skeleton-brand skeleton"></div>
      <div class="skeleton-name skeleton"></div>
      <div class="skeleton-name-2 skeleton"></div>
      <div class="skeleton-price skeleton"></div>
    </div>
  </div>
{/each}

<style>
  .skeleton-card {
    background: var(--color-surface);
    border-radius: var(--radius-xl);
    overflow: hidden;
    box-shadow: var(--shadow-sm);
    opacity: 0;
    animation: fadeIn 0.3s var(--ease-out-expo) forwards;
  }

  .skeleton-image {
    aspect-ratio: 1;
    width: 100%;
  }

  .skeleton-content {
    padding: var(--space-4) var(--space-5) var(--space-5);
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
  }

  .skeleton-brand {
    width: 60px;
    height: 12px;
  }

  .skeleton-name {
    width: 100%;
    height: 16px;
  }

  .skeleton-name-2 {
    width: 70%;
    height: 16px;
  }

  .skeleton-price {
    width: 80px;
    height: 24px;
    margin-top: var(--space-2);
  }
</style>
