package site

import (
	"bytes"
	"fmt"
	"html/template"
)

type homeView struct {
	Config
	CSSBackground       template.CSS
	CSSBackgroundAccent template.CSS
	CSSForeground       template.CSS
	CSSMuted            template.CSS
	CSSAccent           template.CSS
	CSSAccentForeground template.CSS
	CSSSurface          template.CSS
	CSSBorder           template.CSS
	CSSGlow             template.CSS
}

// Markup + CSS mirrored from components/home-page.tsx and app/globals.css.
const homeTemplate = `<!DOCTYPE html>
<html lang="en" class="h-full">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>{{.Brand}}</title>
  <meta name="description" content="{{.Tagline}}" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Syne:wght@500;600;700&display=swap" rel="stylesheet" />
  <style>
    :root {
      --site-bg: {{.CSSBackground}};
      --site-bg-accent: {{.CSSBackgroundAccent}};
      --site-fg: {{.CSSForeground}};
      --site-muted: {{.CSSMuted}};
      --site-accent: {{.CSSAccent}};
      --site-accent-fg: {{.CSSAccentForeground}};
      --site-surface: {{.CSSSurface}};
      --site-border: {{.CSSBorder}};
      --site-glow: {{.CSSGlow}};
      --font-body: "DM Sans", ui-sans-serif, system-ui, sans-serif;
      --font-display: Syne, ui-sans-serif, system-ui, sans-serif;
    }

    * { box-sizing: border-box; }
    html, body { height: 100%; margin: 0; }
    body {
      display: flex;
      min-height: 100%;
      flex-direction: column;
      background: var(--site-bg);
      color: var(--site-fg);
      font-family: var(--font-body);
      -webkit-font-smoothing: antialiased;
    }

    .font-display { font-family: var(--font-display); }

    .site-atmosphere {
      pointer-events: none;
      position: absolute;
      inset: 0;
      background:
        radial-gradient(
          90% 70% at 12% 8%,
          var(--site-glow),
          transparent 55%
        ),
        radial-gradient(
          70% 60% at 88% 18%,
          color-mix(in srgb, var(--site-bg-accent) 80%, transparent),
          transparent 50%
        ),
        linear-gradient(
          165deg,
          var(--site-bg) 0%,
          var(--site-bg-accent) 48%,
          var(--site-bg) 100%
        );
      animation: site-atmosphere-shift 14s ease-in-out infinite alternate;
    }

    .site-grid {
      pointer-events: none;
      position: absolute;
      inset: 0;
      opacity: 0.22;
      background-image:
        linear-gradient(to right, color-mix(in srgb, var(--site-fg) 12%, transparent) 1px, transparent 1px),
        linear-gradient(to bottom, color-mix(in srgb, var(--site-fg) 12%, transparent) 1px, transparent 1px);
      background-size: 48px 48px;
      -webkit-mask-image: radial-gradient(ellipse 70% 60% at 50% 30%, black, transparent);
      mask-image: radial-gradient(ellipse 70% 60% at 50% 30%, black, transparent);
    }

    .site-brand { text-wrap: balance; }

    .site-rise { animation: site-rise 0.8s ease-out both; }
    .site-rise-delay { animation: site-rise 0.8s ease-out 0.12s both; }
    .site-rise-delay-2 { animation: site-rise 0.8s ease-out 0.24s both; }
    .site-rise-delay-3 { animation: site-rise 0.8s ease-out 0.36s both; }

    .site-store-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
      border-radius: 1rem;
      padding: 0.875rem 1.25rem;
      font-size: 0.875rem;
      font-weight: 600;
      letter-spacing: 0.025em;
      text-decoration: none;
      transition: transform 0.15s ease, background 0.15s ease, border-color 0.15s ease, filter 0.15s ease;
    }

    .site-store-btn-android {
      background: #111111;
      color: #f5f5f5;
      border: 1px solid rgba(255, 255, 255, 0.14);
      box-shadow: 0 14px 36px rgba(0, 0, 0, 0.38);
    }
    .site-store-btn-android:hover {
      transform: translateY(-2px);
      background: #1a1a1a;
      border-color: rgba(255, 255, 255, 0.22);
    }
    .site-store-btn-android .site-play-icon {
      flex-shrink: 0;
      width: 1.5rem;
      height: 1.5rem;
      filter: drop-shadow(0 1px 1px rgba(0, 0, 0, 0.35));
    }

    .site-store-btn-ios {
      background: var(--site-surface);
      color: var(--site-fg);
      border: 1px solid var(--site-border);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
    }
    .site-store-btn-ios:hover {
      transform: translateY(-2px);
      background: color-mix(in srgb, var(--site-surface) 70%, white);
    }
    .site-store-btn-ios svg {
      flex-shrink: 0;
      width: 1.25rem;
      height: 1.25rem;
    }

    @keyframes site-rise {
      from { opacity: 0; transform: translateY(16px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes site-atmosphere-shift {
      from { filter: hue-rotate(0deg) saturate(1); }
      to { filter: hue-rotate(8deg) saturate(1.08); }
    }
    @media (prefers-reduced-motion: reduce) {
      .site-atmosphere,
      .site-rise,
      .site-rise-delay,
      .site-rise-delay-2,
      .site-rise-delay-3,
      .site-store-btn-android,
      .site-store-btn-ios {
        animation: none !important;
        transition: none !important;
      }
    }

    /* Layout utilities matching the Next.js Tailwind classes */
    .page-shell { display: flex; min-height: 100%; flex: 1; flex-direction: column; }
    .main {
      position: relative;
      display: flex;
      min-height: 100%;
      flex: 1;
      flex-direction: column;
      overflow: hidden;
    }
    .content {
      position: relative;
      z-index: 10;
      margin: 0 auto;
      display: flex;
      width: 100%;
      max-width: 48rem;
      flex: 1;
      flex-direction: column;
      justify-content: center;
      padding: 4rem 1.5rem;
    }
    @media (min-width: 640px) {
      .content { padding-left: 2.5rem; padding-right: 2.5rem; }
    }
    .stack { display: flex; flex-direction: column; gap: 2rem; }
    .brand {
      margin: 0;
      font-size: 2.25rem;
      font-weight: 600;
      letter-spacing: -0.025em;
      color: var(--site-fg);
    }
    @media (min-width: 640px) {
      .brand { font-size: 3.75rem; }
    }
    .copy { max-width: 36rem; display: flex; flex-direction: column; gap: 1rem; }
    .headline {
      margin: 0;
      font-size: 1.5rem;
      font-weight: 500;
      letter-spacing: -0.025em;
      color: var(--site-fg);
    }
    @media (min-width: 640px) {
      .headline { font-size: 1.875rem; }
    }
    .tagline {
      margin: 0;
      font-size: 1rem;
      line-height: 1.75rem;
      color: var(--site-muted);
    }
    @media (min-width: 640px) {
      .tagline { font-size: 1.125rem; line-height: 2rem; }
    }
    .actions {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
    @media (min-width: 640px) {
      .actions { flex-direction: row; flex-wrap: wrap; }
    }
    .hint {
      margin: 0;
      max-width: 28rem;
      border-radius: 1rem;
      border: 1px solid var(--site-border);
      background: var(--site-surface);
      padding: 0.75rem 1rem;
      font-size: 0.875rem;
      line-height: 1.5rem;
      color: var(--site-muted);
    }
    .hint code {
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      color: var(--site-fg);
      font-size: 0.85em;
    }
    .footer {
      position: relative;
      z-index: 10;
      margin: auto 0 0;
      padding-top: 4rem;
      font-size: 0.75rem;
      line-height: 1.25rem;
      letter-spacing: 0.025em;
      color: var(--site-muted);
    }
  </style>
</head>
<body>
  <div class="page-shell">
    <main class="main">
      <div class="site-atmosphere" aria-hidden="true"></div>
      <div class="site-grid" aria-hidden="true"></div>

      <div class="content">
        <div class="site-rise stack">
          <p class="site-brand font-display brand">{{.Brand}}</p>

          <div class="site-rise-delay copy">
            <h1 class="font-display headline">{{.Headline}}</h1>
            <p class="tagline">{{.Tagline}}</p>
          </div>

          {{if .HasStores}}
          <div class="site-rise-delay-2 actions">
            {{if .HasAndroidStore}}
            <a
              href="{{.AndroidStoreURL}}"
              target="_blank"
              rel="noopener noreferrer"
              class="site-store-btn site-store-btn-android"
            >
              <svg class="site-play-icon" viewBox="0 0 24 24" aria-hidden="true">
                <path fill="#00A0FF" d="M3.609 1.814 13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92Z"/>
                <path fill="#FFCE00" d="m14.5 12.707 2.302 2.302-10.938 6.333 8.636-8.635Z"/>
                <path fill="#FF3A44" d="m17.699 9.509 2.807 1.626a1 1 0 0 1 0 1.73l-2.808 1.626L15.206 12l2.493-2.491Z"/>
                <path fill="#00A85A" d="M5.864 2.658 16.802 8.99l-2.302 2.302-8.636-8.634Z"/>
              </svg>
              {{.AndroidStoreLabel}}
            </a>
            {{end}}
            {{if .HasIOSStore}}
            <a
              href="{{.IOSStoreURL}}"
              target="_blank"
              rel="noopener noreferrer"
              class="site-store-btn site-store-btn-ios"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
                <path d="M16.7 12.6c0-2.1 1.7-3.1 1.8-3.2-1-1.4-2.5-1.6-3-1.7-1.3-.1-2.5.8-3.1.8-.7 0-1.7-.7-2.8-.7-1.4 0-2.8.9-3.5 2.2-1.5 2.6-.4 6.5 1.1 8.6.7 1 1.6 2.2 2.7 2.1 1.1 0 1.5-.7 2.8-.7s1.6.7 2.8.7c1.2 0 1.9-1 2.6-2 .8-1.2 1.1-2.3 1.1-2.4-.1 0-2.2-.8-2.2-3.7zM14.4 6.5c.6-.7 1-1.7.9-2.7-.9.1-1.9.6-2.5 1.3-.6.6-1.1 1.6-.9 2.6 1 .1 1.9-.5 2.5-1.2z"/>
              </svg>
              {{.IOSStoreLabel}}
            </a>
            {{end}}
          </div>
          {{else}}
          <p class="site-rise-delay-2 hint">
            Store buttons appear when
            <code>ANDROID_STORE_URL</code>
            /
            <code>NEXT_PUBLIC_ANDROID_STORE_URL</code>
            and/or
            <code>IOS_STORE_URL</code>
            /
            <code>NEXT_PUBLIC_IOS_STORE_URL</code>
            are set.
          </p>
          {{end}}
        </div>

        <p class="site-rise-delay-3 footer">{{.Footer}}</p>
      </div>
    </main>
  </div>
</body>
</html>`

func RenderHome(cfg Config) ([]byte, error) {
	tmpl, err := template.New("home").Parse(homeTemplate)
	if err != nil {
		return nil, err
	}

	view := homeView{
		Config:              cfg,
		CSSBackground:       template.CSS(cfg.Theme.Background),
		CSSBackgroundAccent: template.CSS(cfg.Theme.BackgroundAccent),
		CSSForeground:       template.CSS(cfg.Theme.Foreground),
		CSSMuted:            template.CSS(cfg.Theme.Muted),
		CSSAccent:           template.CSS(cfg.Theme.Accent),
		CSSAccentForeground: template.CSS(cfg.Theme.AccentForeground),
		CSSSurface:          template.CSS(cfg.Theme.Surface),
		CSSBorder:           template.CSS(cfg.Theme.Border),
		CSSGlow:             template.CSS(cfg.Theme.Glow),
	}

	var buf bytes.Buffer
	if err := tmpl.Execute(&buf, view); err != nil {
		return nil, fmt.Errorf("execute home template: %w", err)
	}
	return buf.Bytes(), nil
}
