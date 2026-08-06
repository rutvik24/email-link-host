import { Show } from "@/components/show";
import type { SiteConfig } from "@/lib/site-config";

function GooglePlayIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
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

type HomePageProps = {
  config: SiteConfig;
};

export function HomePage({ config }: HomePageProps) {
  const hasStores = Boolean(config.androidStoreUrl || config.iosStoreUrl);

  return (
    <main className="relative flex min-h-full flex-1 flex-col overflow-hidden">
      <div className="site-atmosphere" aria-hidden="true" />
      <div className="site-grid" aria-hidden="true" />

      <div className="relative z-10 mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center px-6 py-16 sm:px-10">
        <div className="site-rise space-y-8">
          <p className="site-brand font-display text-4xl font-semibold tracking-tight text-[var(--site-fg)] sm:text-6xl">
            {config.brand}
          </p>

          <div className="site-rise-delay max-w-xl space-y-4">
            <h1 className="font-display text-2xl font-medium tracking-tight text-[var(--site-fg)] sm:text-3xl">
              {config.headline}
            </h1>
            <p className="text-base leading-7 text-[var(--site-muted)] sm:text-lg sm:leading-8">
              {config.tagline}
            </p>
          </div>

          <Show condition={hasStores}>
            <div className="site-rise-delay-2 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Show condition={config.androidStoreUrl !== null}>
                <a
                  href={config.androidStoreUrl ?? undefined}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="site-store-btn site-store-btn-android inline-flex items-center justify-center gap-3 rounded-2xl px-5 py-3.5 text-sm font-semibold tracking-wide transition"
                >
                  <GooglePlayIcon className="site-play-icon h-6 w-6" />
                  {config.androidStoreLabel}
                </a>
              </Show>

              <Show condition={config.iosStoreUrl !== null}>
                <a
                  href={config.iosStoreUrl ?? undefined}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="site-store-btn site-store-btn-ios inline-flex items-center justify-center gap-3 rounded-2xl px-5 py-3.5 text-sm font-semibold tracking-wide transition"
                >
                  <AppleIcon className="h-5 w-5 shrink-0" />
                  {config.iosStoreLabel}
                </a>
              </Show>
            </div>
          </Show>

          <Show condition={!hasStores}>
            <p className="site-rise-delay-2 max-w-md rounded-2xl border border-[var(--site-border)] bg-[var(--site-surface)] px-4 py-3 text-sm leading-6 text-[var(--site-muted)]">
              Store buttons appear when{" "}
              <code className="font-mono text-[var(--site-fg)]">
                ANDROID_STORE_URL
              </code>{" "}
              /{" "}
              <code className="font-mono text-[var(--site-fg)]">
                NEXT_PUBLIC_ANDROID_STORE_URL
              </code>{" "}
              and/or{" "}
              <code className="font-mono text-[var(--site-fg)]">
                IOS_STORE_URL
              </code>{" "}
              /{" "}
              <code className="font-mono text-[var(--site-fg)]">
                NEXT_PUBLIC_IOS_STORE_URL
              </code>{" "}
              are set.
            </p>
          </Show>
        </div>

        <p className="site-rise-delay-3 relative z-10 mt-auto pt-16 text-xs leading-5 tracking-wide text-[var(--site-muted)]">
          {config.footer}
        </p>
      </div>
    </main>
  );
}
