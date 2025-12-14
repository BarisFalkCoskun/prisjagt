<script lang="ts">
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import SpotlightSearch from './SpotlightSearch.svelte';

  let scrollY = $state(0);
  let scrolled = $state(false);
  let mobileMenuOpen = $state(false);
  let spotlightOpen = $state(false);
  let headerVisible = $state(true);
  let lastScrollY = 0;
  let isDark = $state(false);

  onMount(() => {
    // Check initial dark mode preference
    isDark = document.documentElement.classList.contains('dark') ||
      (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);

    if (isDark) {
      document.documentElement.classList.add('dark');
    }

    const handleScroll = () => {
      scrollY = window.scrollY;
      scrolled = scrollY > 20;

      // Hide/show header on scroll direction
      if (scrollY > 100) {
        headerVisible = scrollY < lastScrollY || scrollY < 200;
      } else {
        headerVisible = true;
      }
      lastScrollY = scrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  });

  function toggleDarkMode() {
    isDark = !isDark;
    document.documentElement.classList.toggle('dark', isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }

  // Close mobile menu on route change
  $effect(() => {
    $page.url.pathname;
    mobileMenuOpen = false;
    document.body.classList.remove('modal-open');
  });

  function toggleMobileMenu() {
    mobileMenuOpen = !mobileMenuOpen;
    if (mobileMenuOpen) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
  }

  function closeMobileMenu() {
    mobileMenuOpen = false;
    document.body.classList.remove('modal-open');
  }

  const navLinks = [
    { href: '/', label: 'Produkter', icon: 'home' },
    { href: '/stores', label: 'Butikker', icon: 'store' },
    { href: '/savings', label: 'Besparelser', icon: 'savings' },
  ];
</script>

<header
  class="header"
  class:scrolled
  class:hidden={!headerVisible && scrolled}
  style="--scroll-progress: {Math.min(scrollY / 100, 1)}"
>
  <div class="header-blur"></div>
  <div class="header-content container">
    <a href="/" class="logo">
      <div class="logo-icon">
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
          <rect width="32" height="32" rx="8" fill="url(#logo-grad)"/>
          <path d="M9 16L14 21L23 11" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
          <defs>
            <linearGradient id="logo-grad" x1="0" y1="0" x2="32" y2="32">
              <stop stop-color="#00C853"/>
              <stop offset="1" stop-color="#00BFA5"/>
            </linearGradient>
          </defs>
        </svg>
      </div>
      <span class="logo-text">PrisJagt</span>
    </a>

    <nav class="nav">
      <div class="nav-track">
        {#each navLinks as link}
          <a
            href={link.href}
            class="nav-link"
            class:active={$page.url.pathname === link.href}
          >
            {link.label}
          </a>
        {/each}
        <div
          class="nav-indicator"
          style="--index: {navLinks.findIndex(l => l.href === $page.url.pathname)}"
        ></div>
      </div>
    </nav>

    <div class="header-actions">
      <button
        class="search-trigger"
        onclick={() => spotlightOpen = true}
        aria-label="Søg (⌘K)"
      >
        <div class="search-icon">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <circle cx="8" cy="8" r="5.5" stroke="currentColor" stroke-width="1.5"/>
            <path d="M12.5 12.5L16 16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
        </div>
        <span class="search-label">Søg</span>
        <kbd class="search-kbd">⌘K</kbd>
      </button>

      <button
        class="theme-toggle"
        onclick={toggleDarkMode}
        aria-label={isDark ? 'Skift til lys tilstand' : 'Skift til mørk tilstand'}
      >
        {#if isDark}
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <circle cx="10" cy="10" r="4" stroke="currentColor" stroke-width="1.5"/>
            <path d="M10 2V4M10 16V18M18 10H16M4 10H2M15.66 4.34L14.24 5.76M5.76 14.24L4.34 15.66M15.66 15.66L14.24 14.24M5.76 5.76L4.34 4.34" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
        {:else}
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        {/if}
      </button>

      <button
        class="menu-toggle"
        onclick={toggleMobileMenu}
        aria-label={mobileMenuOpen ? 'Luk menu' : 'Åbn menu'}
        class:open={mobileMenuOpen}
      >
        <span class="menu-line"></span>
        <span class="menu-line"></span>
      </button>
    </div>
  </div>
</header>

<!-- Mobile Menu -->
{#if mobileMenuOpen}
  <div class="mobile-overlay" role="presentation">
    <button class="overlay-close" onclick={closeMobileMenu} aria-label="Luk menu"></button>
    <nav class="mobile-nav">
      <div class="mobile-nav-header">
        <span class="mobile-nav-title">Menu</span>
        <button class="mobile-close-btn" onclick={closeMobileMenu}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
      </div>

      <div class="mobile-nav-links">
        {#each navLinks as link, i}
          <a
            href={link.href}
            class="mobile-link"
            class:active={$page.url.pathname === link.href}
            onclick={closeMobileMenu}
            style="--delay: {i * 50}ms"
          >
            <div class="mobile-link-icon">
              {#if link.icon === 'home'}
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                  <path d="M3 11L11 3L19 11M5 9V18C5 18.5523 5.44772 19 6 19H9V14C9 13.4477 9.44772 13 10 13H12C12.5523 13 13 13.4477 13 14V19H16C16.5523 19 17 18.5523 17 18V9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              {:else if link.icon === 'store'}
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                  <path d="M3 8L5 4H17L19 8M3 8V18C3 18.5523 3.44772 19 4 19H18C18.5523 19 19 18.5523 19 18V8M3 8H19M8 12H14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              {:else}
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                  <path d="M11 7V15M8 12L11 15L14 12M4 4H18C18.5523 4 19 4.44772 19 5V17C19 17.5523 18.5523 18 18 18H4C3.44772 18 3 17.5523 3 17V5C3 4.44772 3.44772 4 4 4Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              {/if}
            </div>
            <span class="mobile-link-text">{link.label}</span>
            <svg class="mobile-link-arrow" width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M7.5 5L12.5 10L7.5 15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </a>
        {/each}
      </div>

      <div class="mobile-nav-footer">
        <button class="mobile-search" onclick={() => { closeMobileMenu(); spotlightOpen = true; }}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <circle cx="9" cy="9" r="6" stroke="currentColor" stroke-width="1.5"/>
            <path d="M14 14L18 18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
          <span>Søg efter produkter</span>
        </button>
      </div>
    </nav>
  </div>
{/if}

<SpotlightSearch bind:open={spotlightOpen} />

<style>
  .header {
    position: sticky;
    top: 0;
    z-index: var(--z-sticky);
    height: var(--header-height);
    transition: transform 0.3s var(--ease-out-expo), height 0.3s ease;
  }

  .header.hidden {
    transform: translateY(-100%);
  }

  .header-blur {
    position: absolute;
    inset: 0;
    background: rgba(255, 255, 255, 0.72);
    backdrop-filter: saturate(180%) blur(20px);
    -webkit-backdrop-filter: saturate(180%) blur(20px);
    border-bottom: 1px solid transparent;
    transition: all 0.3s ease;
  }

  :global(.dark) .header-blur {
    background: rgba(20, 20, 20, 0.72);
  }

  .header.scrolled .header-blur {
    background: rgba(255, 255, 255, 0.85);
    border-bottom-color: rgba(0, 0, 0, 0.08);
  }

  :global(.dark) .header.scrolled .header-blur {
    background: rgba(20, 20, 20, 0.85);
    border-bottom-color: rgba(255, 255, 255, 0.08);
  }

  .header-content {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 100%;
    gap: var(--space-6);
  }

  /* Logo */
  .logo {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    flex-shrink: 0;
    transition: transform 0.2s ease;
  }

  .logo:hover {
    transform: scale(0.98);
  }

  .logo:active {
    transform: scale(0.95);
  }

  .logo-icon {
    display: flex;
    border-radius: var(--radius-lg);
    box-shadow: 0 2px 8px rgba(0, 200, 83, 0.25);
    transition: all 0.3s ease;
  }

  .logo:hover .logo-icon {
    box-shadow: 0 4px 16px rgba(0, 200, 83, 0.35);
    transform: rotate(-3deg);
  }

  .logo-text {
    font-size: var(--text-lg);
    font-weight: 700;
    letter-spacing: -0.02em;
    background: var(--gradient-accent);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  /* Navigation */
  .nav {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
  }

  .nav-track {
    position: relative;
    display: flex;
    gap: var(--space-2);
    padding: 6px;
    background: rgba(0, 0, 0, 0.04);
    border-radius: var(--radius-full);
  }

  :global(.dark) .nav-track {
    background: rgba(255, 255, 255, 0.06);
  }

  .nav-link {
    position: relative;
    padding: var(--space-2-5) var(--space-6);
    font-size: var(--text-sm);
    font-weight: 500;
    color: var(--color-text-secondary);
    border-radius: var(--radius-full);
    transition: color 0.2s ease;
    z-index: 1;
  }

  .nav-link:hover {
    color: var(--color-text);
  }

  .nav-link.active {
    color: var(--color-text);
  }

  .nav-indicator {
    position: absolute;
    top: 6px;
    bottom: 6px;
    left: 6px;
    width: calc((100% - 12px) / 3);
    background: var(--color-surface);
    border-radius: var(--radius-full);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.06);
    transform: translateX(calc(var(--index, 0) * 100%));
    transition: transform 0.3s var(--ease-out-expo);
    z-index: 0;
  }

  /* Header Actions */
  .header-actions {
    display: flex;
    align-items: center;
    gap: var(--space-4);
  }

  .search-trigger {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    height: 44px;
    padding: 0 var(--space-5);
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-full);
    color: var(--color-text-secondary);
    transition: all 0.2s ease;
  }

  .search-trigger:hover {
    border-color: var(--color-accent);
    box-shadow: 0 0 0 3px rgba(0, 200, 83, 0.1);
  }

  .search-trigger:active {
    transform: scale(0.97);
  }

  .search-icon {
    display: flex;
    transition: transform 0.2s ease;
  }

  .search-trigger:hover .search-icon {
    transform: scale(1.1);
  }

  .search-label {
    font-size: var(--text-sm);
    font-weight: 500;
  }

  .search-kbd {
    padding: 4px 10px;
    background: var(--color-bg);
    border-radius: var(--radius-sm);
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--color-text-tertiary);
  }

  /* Theme Toggle */
  .theme-toggle {
    width: 44px;
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: var(--radius-full);
    color: var(--color-text-secondary);
    transition: all 0.2s ease;
  }

  .theme-toggle:hover {
    background: var(--color-surface-hover);
    color: var(--color-text);
  }

  /* Menu Toggle */
  .menu-toggle {
    display: none;
    width: 44px;
    height: 44px;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    gap: 6px;
    border-radius: var(--radius-lg);
    transition: background 0.2s ease;
  }

  .menu-toggle:hover {
    background: rgba(0, 0, 0, 0.05);
  }

  :global(.dark) .menu-toggle:hover {
    background: rgba(255, 255, 255, 0.05);
  }

  .menu-line {
    width: 20px;
    height: 2px;
    background: var(--color-text);
    border-radius: 2px;
    transition: all 0.3s var(--ease-out-expo);
  }

  .menu-toggle.open .menu-line:first-child {
    transform: translateY(4px) rotate(45deg);
  }

  .menu-toggle.open .menu-line:last-child {
    transform: translateY(-4px) rotate(-45deg);
  }

  /* Mobile Overlay */
  .mobile-overlay {
    position: fixed;
    inset: 0;
    z-index: calc(var(--z-modal) - 1);
    display: flex;
    flex-direction: column;
    animation: overlayIn 0.3s ease forwards;
  }

  @keyframes overlayIn {
    from {
      opacity: 0;
    }
  }

  .overlay-close {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.3);
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
  }

  .mobile-nav {
    position: relative;
    margin: var(--header-height) var(--space-4) var(--space-4);
    background: var(--color-surface);
    border-radius: var(--radius-2xl);
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    overflow: hidden;
    animation: navSlide 0.4s var(--ease-out-expo) forwards;
  }

  @keyframes navSlide {
    from {
      opacity: 0;
      transform: translateY(-20px) scale(0.95);
    }
  }

  .mobile-nav-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--space-4) var(--space-5);
    border-bottom: 1px solid var(--color-border);
  }

  .mobile-nav-title {
    font-size: var(--text-sm);
    font-weight: 600;
    color: var(--color-text-tertiary);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .mobile-close-btn {
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: var(--radius-full);
    color: var(--color-text-secondary);
    transition: all 0.2s ease;
  }

  .mobile-close-btn:hover {
    background: var(--color-surface-hover);
    color: var(--color-text);
  }

  .mobile-nav-links {
    padding: var(--space-3);
  }

  .mobile-link {
    display: flex;
    align-items: center;
    gap: var(--space-4);
    padding: var(--space-4);
    border-radius: var(--radius-xl);
    color: var(--color-text);
    transition: all 0.2s ease;
    opacity: 0;
    transform: translateX(-10px);
    animation: linkIn 0.4s var(--ease-out-expo) var(--delay) forwards;
  }

  @keyframes linkIn {
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  .mobile-link:hover {
    background: var(--color-surface-hover);
  }

  .mobile-link:active {
    transform: scale(0.98);
  }

  .mobile-link.active {
    background: linear-gradient(135deg, rgba(0, 200, 83, 0.1), rgba(0, 191, 165, 0.1));
  }

  .mobile-link.active .mobile-link-icon {
    color: var(--color-accent);
  }

  .mobile-link-icon {
    width: 44px;
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--color-bg);
    border-radius: var(--radius-lg);
    color: var(--color-text-secondary);
    transition: all 0.2s ease;
  }

  .mobile-link:hover .mobile-link-icon {
    background: var(--color-surface);
  }

  .mobile-link-text {
    flex: 1;
    font-size: var(--text-md);
    font-weight: 500;
  }

  .mobile-link-arrow {
    color: var(--color-text-tertiary);
    transition: transform 0.2s ease;
  }

  .mobile-link:hover .mobile-link-arrow {
    transform: translateX(4px);
  }

  .mobile-nav-footer {
    padding: var(--space-3);
    border-top: 1px solid var(--color-border);
  }

  .mobile-search {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-3);
    width: 100%;
    padding: var(--space-4);
    background: var(--gradient-accent);
    border-radius: var(--radius-xl);
    color: white;
    font-size: var(--text-md);
    font-weight: 600;
    transition: all 0.2s ease;
  }

  .mobile-search:hover {
    transform: scale(1.02);
    box-shadow: var(--shadow-accent);
  }

  .mobile-search:active {
    transform: scale(0.98);
  }

  /* Responsive */
  @media (max-width: 768px) {
    .nav {
      display: none;
    }

    .search-label,
    .search-kbd {
      display: none;
    }

    .search-trigger {
      width: 48px;
      height: 48px;
      padding: 0;
      justify-content: center;
    }

    .menu-toggle {
      display: flex;
    }
  }

  @media (max-width: 480px) {
    .logo-text {
      display: none;
    }
  }
</style>
