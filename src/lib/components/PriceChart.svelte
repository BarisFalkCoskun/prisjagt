<script lang="ts">
  import { onMount } from 'svelte';
  import type { PriceHistory } from '$lib/types';

  interface Props {
    data: PriceHistory[];
    height?: number;
  }

  let { data, height = 300 }: Props = $props();

  let canvas: HTMLCanvasElement;
  let chart: any;
  let isDark = $state(false);

  const formatPrice = (p: number) => {
    // Price is in kroner as decimal (e.g., 2.5, 11.5, 125.99)
    const whole = Math.floor(p);
    const fraction = Math.round((p - whole) * 100);
    return `${whole},${String(fraction).padStart(2, '0')} kr`;
  };

  onMount(async () => {
    const Chart = (await import('chart.js/auto')).default;

    // Check for dark mode using the .dark class
    isDark = document.documentElement.classList.contains('dark');

    // Listen for theme changes via mutation observer
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          isDark = document.documentElement.classList.contains('dark');
          updateChartColors();
        }
      });
    });
    observer.observe(document.documentElement, { attributes: true });

    // Process data for chart
    const sortedData = [...data].sort((a, b) => a.date.localeCompare(b.date));
    const labels = sortedData.map(d => d.date);
    const prices = sortedData.map(d => d.price); // Already in kroner

    const gradient = canvas.getContext('2d')?.createLinearGradient(0, 0, 0, height);
    gradient?.addColorStop(0, 'rgba(0, 200, 83, 0.25)');
    gradient?.addColorStop(1, 'rgba(0, 200, 83, 0)');

    chart = new Chart(canvas, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: 'Pris',
          data: prices,
          borderColor: '#00C853',
          backgroundColor: gradient,
          borderWidth: 2.5,
          fill: true,
          tension: 0.4,
          pointRadius: 0,
          pointHoverRadius: 8,
          pointHoverBackgroundColor: '#00C853',
          pointHoverBorderColor: isDark ? '#1d1d1f' : '#ffffff',
          pointHoverBorderWidth: 3
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          intersect: false,
          mode: 'index'
        },
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            backgroundColor: isDark ? 'rgba(40, 40, 40, 0.95)' : 'rgba(255, 255, 255, 0.95)',
            titleColor: isDark ? '#f5f5f7' : '#1d1d1f',
            bodyColor: isDark ? '#f5f5f7' : '#1d1d1f',
            borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
            borderWidth: 1,
            padding: 14,
            cornerRadius: 12,
            boxPadding: 8,
            displayColors: false,
            titleFont: {
              size: 12,
              weight: '500'
            },
            bodyFont: {
              size: 18,
              weight: '700'
            },
            callbacks: {
              title: (items: any[]) => items[0]?.label || '',
              label: (context: any) => `${context.parsed.y.toFixed(2).replace('.', ',')} kr`
            }
          }
        },
        scales: {
          x: {
            grid: {
              display: false
            },
            border: {
              display: false
            },
            ticks: {
              color: isDark ? '#86868b' : '#86868b',
              font: {
                size: 11,
                weight: '500'
              },
              maxTicksLimit: 6,
              padding: 8
            }
          },
          y: {
            grid: {
              color: isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.06)',
              drawTicks: false
            },
            border: {
              display: false
            },
            ticks: {
              color: isDark ? '#86868b' : '#86868b',
              font: {
                size: 11,
                weight: '500'
              },
              padding: 12,
              callback: (value: any) => `${value} kr`
            }
          }
        },
        animation: {
          duration: 800,
          easing: 'easeOutQuart'
        }
      }
    });

    function updateChartColors() {
      if (!chart) return;

      // Update tooltip colors
      chart.options.plugins.tooltip.backgroundColor = isDark ? 'rgba(40, 40, 40, 0.95)' : 'rgba(255, 255, 255, 0.95)';
      chart.options.plugins.tooltip.titleColor = isDark ? '#f5f5f7' : '#1d1d1f';
      chart.options.plugins.tooltip.bodyColor = isDark ? '#f5f5f7' : '#1d1d1f';
      chart.options.plugins.tooltip.borderColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';

      // Update grid colors
      chart.options.scales.y.grid.color = isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.06)';

      // Update point hover border
      chart.data.datasets[0].pointHoverBorderColor = isDark ? '#1d1d1f' : '#ffffff';

      chart.update('none');
    }

    return () => {
      observer.disconnect();
      chart?.destroy();
    };
  });

  $effect(() => {
    if (chart && data) {
      const sortedData = [...data].sort((a, b) => a.date.localeCompare(b.date));
      chart.data.labels = sortedData.map((d: PriceHistory) => d.date);
      chart.data.datasets[0].data = sortedData.map((d: PriceHistory) => d.price); // Already in kroner
      chart.update();
    }
  });
</script>

<div class="chart-container" style="height: {height}px">
  {#if data.length > 0}
    <canvas bind:this={canvas}></canvas>
  {:else}
    <div class="empty-chart">
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        <path d="M6 36L18 24L26 32L42 16" stroke="#86868b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M30 16H42V28" stroke="#86868b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <p>Ingen prishistorik tilgængelig endnu</p>
    </div>
  {/if}
</div>

<style>
  .chart-container {
    position: relative;
    width: 100%;
    background: var(--color-surface);
    border-radius: var(--radius-lg);
    padding: var(--space-lg);
    border: 1px solid var(--color-border);
  }

  :global(.dark) .chart-container {
    border-color: transparent;
  }

  canvas {
    width: 100% !important;
    height: 100% !important;
  }

  .empty-chart {
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--space-md);
    color: var(--color-text-secondary);
  }

  .empty-chart p {
    font-size: 0.875rem;
  }
</style>
