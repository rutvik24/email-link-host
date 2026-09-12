"use client";

import { useState } from "react";
import { Show } from "@/components/show";
import type { SiteConfig } from "@/lib/site-config";

function GooglePlayIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#00A0FF"
        d="M3.609 1.814 13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92Z"
      />
      <path
        fill="#FFCE00"
        d="m14.5 12.707 2.302 2.302-10.938 6.333 8.636-8.635Z"
      />
      <path
        fill="#FF3A44"
        d="m17.699 9.509 2.807 1.626a1 1 0 0 1 0 1.73l-2.808 1.626L15.206 12l2.493-2.491Z"
      />
      <path
        fill="#00A85A"
        d="M5.864 2.658 16.802 8.99l-2.302 2.302-8.636-8.634Z"
      />
    </svg>
  );
}

function AppleIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill="currentColor"
    >
      <path d="M16.7 12.6c0-2.1 1.7-3.1 1.8-3.2-1-1.4-2.5-1.6-3-1.7-1.3-.1-2.5.8-3.1.8-.7 0-1.7-.7-2.8-.7-1.4 0-2.8.9-3.5 2.2-1.5 2.6-.4 6.5 1.1 8.6.7 1 1.6 2.2 2.7 2.1 1.1 0 1.5-.7 2.8-.7s1.6.7 2.8.7c1.2 0 1.9-1 2.6-2 .8-1.2 1.1-2.3 1.1-2.4-.1 0-2.2-.8-2.2-3.7zM14.4 6.5c.6-.7 1-1.7.9-2.7-.9.1-1.9.6-2.5 1.3-.6.6-1.1 1.6-.9 2.6 1 .1 1.9-.5 2.5-1.2z" />
    </svg>
  );
}

function ShieldCheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      <path d="m9 12 2 2 4-4"/>
    </svg>
  );
}

function CopyIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6 9 17l-5-5"/>
    </svg>
  );
}

function TerminalIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="4 17 10 11 4 5"/>
      <line x1="12" x2="20" y1="19" y2="19"/>
    </svg>
  );
}

function ExternalLinkIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
      <polyline points="15 3 21 3 21 9"/>
      <line x1="10" x2="21" y1="14" y2="3"/>
    </svg>
  );
}

type HomePageProps = {
  config: SiteConfig;
};

const ENDPOINTS = [
  {
    id: "android",
    label: ".well-known/assetlinks.json",
    description: "Android App Links verification manifest specifying SHA-256 fingerprints.",
    code: `[
  {
    "relation": ["delegate_permission/common.handle_all_urls"],
    "target": {
      "namespace": "android_app",
      "package_name": "com.example.app",
      "sha256_cert_fingerprints": [
        "14:6D:E9:7C:15:35:10:97:5C:30:17:80:C6:67:E6:AA:E1:98:C8"
      ]
    }
  }
]`
  },
  {
    id: "ios",
    label: ".well-known/apple-app-site-association",
    description: "Apple Universal Links manifest specifying Team ID and App ID matching rules.",
    code: `{
  "applinks": {
    "apps": [],
    "details": [
      {
        "appID": "ABCDE12345.com.example.app",
        "paths": ["/finishSignUp", "/link/*", "NOT /help/*"]
      }
    ]
  }
}`
  },
  {
    id: "docker",
    label: "Docker One-Liner",
    description: "Instant launch using prebuilt lightweight image with embedded verification handler.",
    code: `docker run -d -p 8080:8080 \\
  -e ANDROID_PACKAGE_NAME="com.example.app" \\
  -e ANDROID_SHA256="14:6D:E9:7C:15:35:10:97..." \\
  -e IOS_TEAM_ID="ABCDE12345" \\
  -e IOS_BUNDLE_ID="com.example.app" \\
  rutviknabhoya/email-link-host:latest`
  }
];

export function HomePage({ config }: HomePageProps) {
  const hasStores = Boolean(config.androidStoreUrl || config.iosStoreUrl);
  const [activeTab, setActiveTab] = useState(0);
  const [copied, setCopied] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-[#060811] text-[#f8fafc]">
      {/* Background Effects */}
      <div className="site-atmosphere" aria-hidden="true" />
      <div className="site-grid" aria-hidden="true" />

      {/* Top Header Bar */}
      <header className="relative z-20 border-b border-cyan-500/10 bg-[#060811]/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-indigo-600 shadow-lg shadow-cyan-500/20">
              <ShieldCheckIcon className="h-6 w-6 text-black" />
            </div>
            <div>
              <span className="font-display text-lg font-bold tracking-tight text-white">
                {config.brand}
              </span>
              <span className="ml-2 hidden rounded-full bg-cyan-500/10 px-2.5 py-0.5 text-xs font-medium text-cyan-400 border border-cyan-500/20 sm:inline-block">
                v1.2.0
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm font-medium">
            <a
              href="https://rutvik24.github.io/email-link-host/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden items-center gap-1.5 text-slate-300 transition hover:text-cyan-400 sm:flex"
            >
              Docs <ExternalLinkIcon className="h-3.5 w-3.5" />
            </a>
            <a
              href="https://rutvik24.github.io/app-universal-links-helper/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden items-center gap-1.5 text-slate-300 transition hover:text-cyan-400 md:flex"
            >
              Links Helper <ExternalLinkIcon className="h-3.5 w-3.5" />
            </a>
            <a
              href="https://github.com/rutvik24/email-link-host"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-cyan-500/20 bg-slate-900/60 px-3.5 py-1.5 text-xs font-semibold text-white transition hover:border-cyan-400/40 hover:bg-cyan-500/10"
            >
              GitHub
            </a>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col px-6 py-12 lg:py-16">

        {/* Hero Section */}
        <section className="site-rise mx-auto flex max-w-4xl flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-950/40 px-4 py-1.5 text-xs font-semibold tracking-wide text-cyan-300 shadow-inner">
            <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
            Branded Auth Links Infrastructure
          </div>

          <h1 className="mt-6 font-display text-4xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl">
            {config.headline.includes("app") ? (
              <>
                Continue securely in <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent">your App</span>
              </>
            ) : (
              config.headline
            )}
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-xl sm:leading-8">
            {config.tagline}
          </p>

          {/* Store Buttons */}
          <Show condition={hasStores}>
            <div className="site-rise-delay-1 mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Show condition={config.androidStoreUrl !== null}>
                <a
                  href={config.androidStoreUrl ?? undefined}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="site-store-btn-android inline-flex items-center justify-center gap-3 rounded-2xl px-6 py-4 text-sm font-bold tracking-wide transition"
                >
                  <GooglePlayIcon className="h-6 w-6 shrink-0" />
                  <span>{config.androidStoreLabel}</span>
                </a>
              </Show>

              <Show condition={config.iosStoreUrl !== null}>
                <a
                  href={config.iosStoreUrl ?? undefined}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="site-store-btn-ios inline-flex items-center justify-center gap-3 rounded-2xl px-6 py-4 text-sm font-bold tracking-wide transition"
                >
                  <AppleIcon className="h-6 w-6 shrink-0" />
                  <span>{config.iosStoreLabel}</span>
                </a>
              </Show>
            </div>
          </Show>

          <Show condition={!hasStores}>
            <div className="site-rise-delay-1 mt-8 max-w-lg rounded-xl border border-cyan-500/20 bg-slate-900/60 p-4 text-left backdrop-blur-md">
              <div className="flex items-start gap-3">
                <ShieldCheckIcon className="mt-0.5 h-5 w-5 shrink-0 text-cyan-400" />
                <p className="text-xs leading-relaxed text-slate-300">
                  Store download buttons will appear dynamically when{" "}
                  <code className="rounded bg-slate-800 px-1.5 py-0.5 font-mono text-cyan-300">
                    ANDROID_STORE_URL
                  </code>{" "}
                  or{" "}
                  <code className="rounded bg-slate-800 px-1.5 py-0.5 font-mono text-cyan-300">
                    IOS_STORE_URL
                  </code>{" "}
                  environment variables are configured.
                </p>
              </div>
            </div>
          </Show>
        </section>

        {/* Authentication Link Flow Visualizer */}
        <section className="site-rise-delay-2 mt-16 lg:mt-24">
          <div className="text-center">
            <h2 className="font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
              How Deep-Link Auth Works
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              Seamlessly bridge email magic links into native mobile app authentication handlers.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {/* Step 1 */}
            <div className="glass-card relative overflow-hidden rounded-2xl p-6">
              <div className="absolute -right-4 -top-4 text-6xl font-black text-cyan-500/10">01</div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400 font-bold border border-cyan-500/20">
                1
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold text-white">Email Link Dispatch</h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-400">
                Firebase sends a custom sign-in link with the token on your custom domain (<code className="text-cyan-300">auth.yourdomain.com</code>).
              </p>
              <div className="mt-4 rounded-lg bg-slate-950/80 p-3 font-mono text-[11px] text-cyan-300 border border-slate-800 break-all">
                https://auth.app.com/finishSignUp?oobCode=XYZ...
              </div>
            </div>

            {/* Step 2 */}
            <div className="glass-card relative overflow-hidden rounded-2xl p-6">
              <div className="absolute -right-4 -top-4 text-6xl font-black text-indigo-500/10">02</div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400 font-bold border border-indigo-500/20">
                2
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold text-white">Domain Verification</h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-400">
                Mobile OS verifies domain ownership automatically via hosted <code className="text-indigo-300">.well-known</code> manifests.
              </p>
              <div className="mt-4 rounded-lg bg-slate-950/80 p-3 font-mono text-[11px] text-indigo-300 border border-slate-800 break-all">
                GET /.well-known/assetlinks.json → 200 OK
              </div>
            </div>

            {/* Step 3 */}
            <div className="glass-card relative overflow-hidden rounded-2xl p-6">
              <div className="absolute -right-4 -top-4 text-6xl font-black text-purple-500/10">03</div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400 font-bold border border-purple-500/20">
                3
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold text-white">Native App Launch</h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-400">
                The mobile OS intercepts the HTTPS URL and routes the payload directly to your native app listener.
              </p>
              <div className="mt-4 rounded-lg bg-slate-950/80 p-3 font-mono text-[11px] text-purple-300 border border-slate-800">
                Intent: ACTION_VIEW (com.example.app)
              </div>
            </div>
          </div>
        </section>

        {/* Live Endpoint Inspector */}
        <section className="site-rise-delay-3 mt-16 lg:mt-24">
          <div className="rounded-2xl border border-cyan-500/20 bg-slate-950/90 shadow-2xl backdrop-blur-xl overflow-hidden">
            <div className="flex flex-wrap items-center justify-between border-b border-cyan-500/10 bg-slate-900/80 px-6 py-4 gap-4">
              <div className="flex items-center gap-3">
                <TerminalIcon className="h-5 w-5 text-cyan-400" />
                <span className="font-display font-semibold text-white text-sm">
                  Hosted Endpoints & Configuration Inspector
                </span>
              </div>

              {/* Tabs */}
              <div className="flex flex-wrap gap-2">
                {ENDPOINTS.map((ep, idx) => (
                  <button
                    key={ep.id}
                    onClick={() => setActiveTab(idx)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                      activeTab === idx
                        ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                        : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                    }`}
                  >
                    {ep.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-6">
              <div className="flex items-center justify-between pb-3 text-xs text-slate-400">
                <span>{ENDPOINTS[activeTab].description}</span>
                <button
                  onClick={() => handleCopy(ENDPOINTS[activeTab].code)}
                  className="inline-flex items-center gap-1.5 rounded-md bg-slate-800/80 px-2.5 py-1 text-xs font-medium text-slate-300 hover:bg-slate-700 hover:text-white transition"
                >
                  {copied ? (
                    <>
                      <CheckIcon className="h-3.5 w-3.5 text-emerald-400" /> Copied!
                    </>
                  ) : (
                    <>
                      <CopyIcon className="h-3.5 w-3.5" /> Copy
                    </>
                  )}
                </button>
              </div>

              <pre className="overflow-x-auto rounded-xl bg-[#04060c] p-4 font-mono text-xs text-cyan-300 border border-cyan-500/10 leading-relaxed">
                <code>{ENDPOINTS[activeTab].code}</code>
              </pre>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-cyan-500/10 bg-[#04060c] py-8 text-center text-xs text-slate-400">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 sm:flex-row">
          <p>{config.footer}</p>
          <div className="flex gap-6">
            <a href="https://github.com/rutvik24/email-link-host" className="hover:text-cyan-400 transition">
              GitHub
            </a>
            <a href="https://rutvik24.github.io/email-link-host/" className="hover:text-cyan-400 transition">
              Docs
            </a>
            <a href="https://hub.docker.com/r/rutviknabhoya/email-link-host" className="hover:text-cyan-400 transition">
              Docker Hub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
