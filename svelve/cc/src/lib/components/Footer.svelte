<script lang="ts">
  import { onMount } from 'svelte';

  const currentYear = new Date().getFullYear();
  let isVisible = $state(false);

  const stores = [
    { name: 'Rema 1000', href: '/?store=rema1000' },
    { name: 'Netto', href: '/?store=netto' },
    { name: 'Meny', href: '/?store=meny' },
    { name: 'Spar', href: '/?store=spar' },
    { name: 'Bilka To Go', href: '/?store=bilkatogo' },
    { name: 'Føtex+', href: '/?store=foetexplus' },
    { name: 'Min Købmand', href: '/?store=minkobmand' },
    { name: 'Dagrofa', href: '/?store=dagrofa' },
  ];

  const categories = [
    { name: 'Frugt & grønt', href: '/?category=Frugt%20%26%20gr%C3%B8nt' },
    { name: 'Mejeri & køl', href: '/?category=Mejeri%20%26%20k%C3%B8l' },
    { name: 'Frost', href: '/?category=Frost' },
    { name: 'Drikkevarer', href: '/?category=Drikkevarer' },
    { name: 'Kolonial', href: '/?category=Kolonial' },
  ];

  const aboutLinks = [
    { name: 'Om PrisJagt', href: '/about' },
    { name: 'Privatlivspolitik', href: '/privacy' },
    { name: 'Betingelser', href: '/terms' },
    { name: 'Kontakt', href: '/contact' },
  ];

  const socialLinks = [
    { name: 'Twitter', icon: 'twitter', href: '#' },
    { name: 'Facebook', icon: 'facebook', href: '#' },
    { name: 'Instagram', icon: 'instagram', href: '#' },
  ];

  onMount(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            isVisible = true;
          }
        });
      },
      { threshold: 0.1 }
    );

    const footer = document.querySelector('.footer');
    if (footer) observer.observe(footer);

    return () => observer.disconnect();
  });
</script>

<footer class="footer" class:visible={isVisible}>
  <!-- Decorative top gradient line -->
  <div class="footer-gradient-line"></div>

  <div class="footer-content container">
    <!-- Main footer grid -->
    <div class="footer-main">
      <!-- Brand column -->
      <div class="footer-brand" style="--delay: 0ms">
        <a href="/" class="footer-logo">
          <div class="logo-icon">
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
              <rect width="36" height="36" rx="10" fill="url(#footer-logo-gradient)"/>
              <path d="M10 18L15.5 23.5L26 13" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
              <defs>
                <linearGradient id="footer-logo-gradient" x1="0" y1="0" x2="36" y2="36">
                  <stop stop-color="#00C853"/>
                  <stop offset="1" stop-color="#00BFA5"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          <span class="logo-text">PrisJagt</span>
        </a>
        <p class="footer-tagline">
          Find de bedste priser på dagligvarer fra alle dine foretrukne butikker. Spar tid og penge med smart prissammenligning.
        </p>

        <!-- Social links -->
        <div class="social-links">
          {#each socialLinks as social}
            <a href={social.href} class="social-link" aria-label={social.name}>
              {#if social.icon === 'twitter'}
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
                </svg>
              {:else if social.icon === 'facebook'}
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                </svg>
              {:else if social.icon === 'instagram'}
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                </svg>
              {/if}
            </a>
          {/each}
        </div>
      </div>

      <!-- Links columns -->
      <div class="footer-links">
        <div class="footer-column" style="--delay: 50ms">
          <h4 class="column-title">
            <span class="title-text">Butikker</span>
            <span class="title-count">{stores.length}</span>
          </h4>
          <ul class="link-list">
            {#each stores as store, i}
              <li style="--item-delay: {i * 30}ms">
                <a href={store.href} class="footer-link">
                  <span class="link-text">{store.name}</span>
                  <svg class="link-arrow" width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2.5 6H9.5M9.5 6L6 2.5M9.5 6L6 9.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </a>
              </li>
            {/each}
          </ul>
        </div>

        <div class="footer-column" style="--delay: 100ms">
          <h4 class="column-title">
            <span class="title-text">Kategorier</span>
            <span class="title-count">{categories.length}</span>
          </h4>
          <ul class="link-list">
            {#each categories as category, i}
              <li style="--item-delay: {i * 30}ms">
                <a href={category.href} class="footer-link">
                  <span class="link-text">{category.name}</span>
                  <svg class="link-arrow" width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2.5 6H9.5M9.5 6L6 2.5M9.5 6L6 9.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </a>
              </li>
            {/each}
          </ul>
        </div>

        <div class="footer-column" style="--delay: 150ms">
          <h4 class="column-title">
            <span class="title-text">Om os</span>
          </h4>
          <ul class="link-list">
            {#each aboutLinks as link, i}
              <li style="--item-delay: {i * 30}ms">
                <a href={link.href} class="footer-link">
                  <span class="link-text">{link.name}</span>
                  <svg class="link-arrow" width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2.5 6H9.5M9.5 6L6 2.5M9.5 6L6 9.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </a>
              </li>
            {/each}
          </ul>
        </div>
      </div>
    </div>

    <!-- Newsletter signup -->
    <div class="newsletter-section" style="--delay: 200ms">
      <div class="newsletter-content">
        <div class="newsletter-text">
          <h4>Få prisalarmer direkte i din indbakke</h4>
          <p>Tilmeld dig vores nyhedsbrev og bliv den første til at vide, når dine yndlingsprodukter er på tilbud.</p>
        </div>
        <form class="newsletter-form" onsubmit={(e) => e.preventDefault()}>
          <div class="input-wrapper">
            <svg class="input-icon" width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M2.25 4.5L9 9.75L15.75 4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <rect x="2.25" y="3" width="13.5" height="12" rx="2" stroke="currentColor" stroke-width="1.5"/>
            </svg>
            <input type="email" placeholder="Din e-mail adresse" class="newsletter-input" />
          </div>
          <button type="submit" class="newsletter-btn">
            <span>Tilmeld</span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8H13M13 8L8 3M13 8L8 13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </form>
      </div>
    </div>

    <!-- Bottom bar -->
    <div class="footer-bottom">
      <div class="bottom-left">
        <p class="copyright">&copy; {currentYear} PrisJagt. Alle rettigheder forbeholdes.</p>
        <div class="legal-links">
          <a href="/privacy">Privatliv</a>
          <span class="dot"></span>
          <a href="/terms">Vilkår</a>
          <span class="dot"></span>
          <a href="/cookies">Cookies</a>
        </div>
      </div>

      <div class="bottom-right">
        <div class="status-indicator">
          <span class="status-dot"></span>
          <span class="status-text">Alle systemer kører</span>
        </div>
        <span class="version">v2.0</span>
      </div>
    </div>
  </div>

  <!-- Background decoration -->
  <div class="footer-bg">
    <div class="bg-orb bg-orb-1"></div>
    <div class="bg-orb bg-orb-2"></div>
  </div>
</footer>

<style>
  .footer {
    position: relative;
    background: var(--color-surface);
    margin-top: auto;
    overflow: hidden;
  }

  .footer-gradient-line {
    height: 1px;
    background: linear-gradient(90deg, transparent 0%, rgba(0, 200, 83, 0.5) 50%, transparent 100%);
  }

  .footer-content {
    position: relative;
    z-index: 1;
    padding: var(--space-16) var(--space-6) var(--space-8);
  }

  /* Background decoration */
  .footer-bg {
    position: absolute;
    inset: 0;
    pointer-events: none;
    overflow: hidden;
  }

  .bg-orb {
    position: absolute;
    border-radius: 50%;
    filter: blur(100px);
    opacity: 0.04;
  }

  .bg-orb-1 {
    top: -50%;
    right: -20%;
    width: 600px;
    height: 600px;
    background: var(--color-accent);
  }

  .bg-orb-2 {
    bottom: -30%;
    left: -10%;
    width: 400px;
    height: 400px;
    background: #00BFA5;
  }

  /* Main grid */
  .footer-main {
    display: grid;
    grid-template-columns: 1.2fr 2fr;
    gap: var(--space-16);
    margin-bottom: var(--space-12);
  }

  /* Brand section */
  .footer-brand {
    opacity: 0;
    transform: translateY(20px);
  }

  .footer.visible .footer-brand {
    animation: footerFadeUp 0.6s var(--ease-out-expo) var(--delay) forwards;
  }

  @keyframes footerFadeUp {
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .footer-logo {
    display: inline-flex;
    align-items: center;
    gap: var(--space-3);
    margin-bottom: var(--space-5);
    transition: transform 0.3s ease;
  }

  .footer-logo:hover {
    transform: scale(1.02);
  }

  .logo-icon {
    transition: transform 0.3s ease;
  }

  .footer-logo:hover .logo-icon {
    transform: rotate(-5deg) scale(1.05);
  }

  .logo-text {
    font-size: var(--text-xl);
    font-weight: 700;
    background: var(--gradient-accent);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .footer-tagline {
    font-size: var(--text-sm);
    color: var(--color-text-secondary);
    line-height: 1.7;
    max-width: 280px;
    margin-bottom: var(--space-6);
  }

  /* Social links */
  .social-links {
    display: flex;
    gap: var(--space-2);
  }

  .social-link {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--color-bg);
    border-radius: var(--radius-lg);
    color: var(--color-text-secondary);
    transition: all 0.25s var(--ease-out-expo);
  }

  .social-link:hover {
    background: var(--gradient-accent);
    color: white;
    transform: translateY(-3px);
    box-shadow: 0 8px 20px rgba(0, 200, 83, 0.25);
  }

  /* Links section */
  .footer-links {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--space-8);
  }

  .footer-column {
    opacity: 0;
    transform: translateY(20px);
  }

  .footer.visible .footer-column {
    animation: footerFadeUp 0.6s var(--ease-out-expo) var(--delay) forwards;
  }

  .column-title {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    margin-bottom: var(--space-5);
  }

  .title-text {
    font-size: var(--text-xs);
    font-weight: 600;
    color: var(--color-text-tertiary);
    text-transform: uppercase;
    letter-spacing: 0.8px;
  }

  .title-count {
    font-size: 10px;
    font-weight: 700;
    color: var(--color-accent);
    background: rgba(0, 200, 83, 0.1);
    padding: 2px 6px;
    border-radius: var(--radius-full);
  }

  .link-list {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
  }

  .link-list li {
    opacity: 0;
    transform: translateX(-10px);
  }

  .footer.visible .link-list li {
    animation: linkSlideIn 0.4s var(--ease-out-expo) calc(var(--delay) + var(--item-delay)) forwards;
  }

  @keyframes linkSlideIn {
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  .footer-link {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--space-2) 0;
    font-size: var(--text-sm);
    color: var(--color-text-secondary);
    transition: all 0.2s ease;
    border-radius: var(--radius-sm);
  }

  .footer-link:hover {
    color: var(--color-text);
    padding-left: var(--space-2);
  }

  .link-arrow {
    opacity: 0;
    transform: translateX(-8px);
    transition: all 0.2s ease;
  }

  .footer-link:hover .link-arrow {
    opacity: 1;
    transform: translateX(0);
  }

  /* Newsletter section */
  .newsletter-section {
    padding: var(--space-8);
    background: linear-gradient(135deg, rgba(0, 200, 83, 0.05), rgba(0, 191, 165, 0.05));
    border: 1px solid rgba(0, 200, 83, 0.1);
    border-radius: var(--radius-2xl);
    margin-bottom: var(--space-12);
    opacity: 0;
    transform: translateY(20px);
  }

  .footer.visible .newsletter-section {
    animation: footerFadeUp 0.6s var(--ease-out-expo) var(--delay) forwards;
  }

  .newsletter-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-8);
  }

  .newsletter-text h4 {
    font-size: var(--text-lg);
    font-weight: 600;
    margin-bottom: var(--space-2);
  }

  .newsletter-text p {
    font-size: var(--text-sm);
    color: var(--color-text-secondary);
    max-width: 400px;
  }

  .newsletter-form {
    display: flex;
    gap: var(--space-3);
    flex-shrink: 0;
  }

  .input-wrapper {
    position: relative;
    display: flex;
    align-items: center;
  }

  .input-icon {
    position: absolute;
    left: var(--space-4);
    color: var(--color-text-tertiary);
    pointer-events: none;
  }

  .newsletter-input {
    width: 260px;
    padding: var(--space-3) var(--space-4) var(--space-3) var(--space-12);
    background: var(--color-bg);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-xl);
    font-size: var(--text-sm);
    transition: all 0.2s ease;
  }

  .newsletter-input:focus {
    outline: none;
    border-color: var(--color-accent);
    box-shadow: 0 0 0 3px rgba(0, 200, 83, 0.1);
  }

  .newsletter-btn {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    padding: var(--space-3) var(--space-5);
    background: var(--gradient-accent);
    color: white;
    font-weight: 600;
    font-size: var(--text-sm);
    border-radius: var(--radius-xl);
    transition: all 0.2s ease;
  }

  .newsletter-btn:hover {
    transform: scale(1.02);
    box-shadow: var(--shadow-accent);
  }

  .newsletter-btn svg {
    transition: transform 0.2s ease;
  }

  .newsletter-btn:hover svg {
    transform: translateX(2px);
  }

  /* Bottom bar */
  .footer-bottom {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-top: var(--space-8);
    border-top: 1px solid var(--color-border);
  }

  .bottom-left {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
  }

  .copyright {
    font-size: var(--text-sm);
    color: var(--color-text-tertiary);
  }

  .legal-links {
    display: flex;
    align-items: center;
    gap: var(--space-3);
  }

  .legal-links a {
    font-size: var(--text-xs);
    color: var(--color-text-tertiary);
    transition: color 0.2s ease;
  }

  .legal-links a:hover {
    color: var(--color-text);
  }

  .dot {
    width: 3px;
    height: 3px;
    background: var(--color-text-tertiary);
    border-radius: 50%;
    opacity: 0.5;
  }

  .bottom-right {
    display: flex;
    align-items: center;
    gap: var(--space-4);
  }

  .status-indicator {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    padding: var(--space-2) var(--space-3);
    background: rgba(0, 200, 83, 0.08);
    border-radius: var(--radius-full);
  }

  .status-dot {
    width: 6px;
    height: 6px;
    background: var(--color-success);
    border-radius: 50%;
    animation: statusPulse 2s ease-in-out infinite;
  }

  @keyframes statusPulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }

  .status-text {
    font-size: var(--text-xs);
    color: var(--color-success);
    font-weight: 500;
  }

  .version {
    font-size: var(--text-xs);
    color: var(--color-text-tertiary);
    padding: var(--space-1) var(--space-2);
    background: var(--color-bg);
    border-radius: var(--radius-sm);
    font-family: monospace;
  }

  /* Responsive */
  @media (max-width: 968px) {
    .footer-main {
      grid-template-columns: 1fr;
      gap: var(--space-10);
    }

    .footer-brand {
      max-width: none;
    }

    .footer-tagline {
      max-width: 400px;
    }

    .newsletter-content {
      flex-direction: column;
      align-items: flex-start;
    }

    .newsletter-form {
      width: 100%;
    }

    .input-wrapper {
      flex: 1;
    }

    .newsletter-input {
      width: 100%;
    }
  }

  @media (max-width: 640px) {
    .footer-content {
      padding: var(--space-10) var(--space-4) var(--space-6);
    }

    .footer-links {
      grid-template-columns: repeat(2, 1fr);
      gap: var(--space-6);
    }

    .footer-links .footer-column:last-child {
      grid-column: 1 / -1;
    }

    .newsletter-section {
      padding: var(--space-6);
    }

    .newsletter-form {
      flex-direction: column;
    }

    .newsletter-btn {
      justify-content: center;
    }

    .footer-bottom {
      flex-direction: column;
      gap: var(--space-4);
      text-align: center;
    }

    .bottom-left {
      align-items: center;
    }

    .bottom-right {
      flex-wrap: wrap;
      justify-content: center;
    }
  }

  @media (max-width: 400px) {
    .footer-links {
      grid-template-columns: 1fr;
    }
  }
</style>
