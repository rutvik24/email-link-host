import { existsSync, readFileSync } from "node:fs";
import { isAbsolute, join } from "node:path";

export type SiteTheme = {
  background: string;
  backgroundAccent: string;
  foreground: string;
  muted: string;
  accent: string;
  accentForeground: string;
  surface: string;
  border: string;
  glow: string;
};

export type SiteFileConfig = {
  brand: string;
  headline: string;
  tagline: string;
  footer: string;
  androidStoreLabel: string;
  iosStoreLabel: string;
  theme: SiteTheme;
};

export type SiteConfig = SiteFileConfig & {
  androidStoreUrl: string | null;
  iosStoreUrl: string | null;
};

const DEFAULT_CONFIG_RELATIVE_PATH = "config/site.json";

const DEFAULT_THEME: SiteTheme = {
  background: "#071512",
  backgroundAccent: "#12352E",
  foreground: "#F3F7F5",
  muted: "#9BB5AC",
  accent: "#D2F26B",
  accentForeground: "#0A1612",
  surface: "rgba(255,255,255,0.07)",
  border: "rgba(255,255,255,0.14)",
  glow: "rgba(210,242,107,0.22)",
};

function env(name: string): string | undefined {
  const value = process.env[name]?.trim();
  return value ? value : undefined;
}

function resolveConfigFilePath(): string {
  const custom =
    env("SITE_CONFIG_PATH") ?? env("NEXT_PUBLIC_SITE_CONFIG_PATH");

  if (custom) {
    return isAbsolute(custom) ? custom : join(process.cwd(), custom);
  }

  return join(process.cwd(), DEFAULT_CONFIG_RELATIVE_PATH);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function requireString(
  record: Record<string, unknown>,
  key: string,
  source: string,
): string {
  const value = record[key];
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`Site config "${source}" is missing string field "${key}".`);
  }
  return value;
}

function parseTheme(raw: unknown, source: string): SiteTheme {
  if (!isRecord(raw)) {
    throw new Error(`Site config "${source}" is missing object field "theme".`);
  }

  return {
    background:
      typeof raw.background === "string" ? raw.background : DEFAULT_THEME.background,
    backgroundAccent:
      typeof raw.backgroundAccent === "string"
        ? raw.backgroundAccent
        : DEFAULT_THEME.backgroundAccent,
    foreground:
      typeof raw.foreground === "string" ? raw.foreground : DEFAULT_THEME.foreground,
    muted: typeof raw.muted === "string" ? raw.muted : DEFAULT_THEME.muted,
    accent: typeof raw.accent === "string" ? raw.accent : DEFAULT_THEME.accent,
    accentForeground:
      typeof raw.accentForeground === "string"
        ? raw.accentForeground
        : DEFAULT_THEME.accentForeground,
    surface: typeof raw.surface === "string" ? raw.surface : DEFAULT_THEME.surface,
    border: typeof raw.border === "string" ? raw.border : DEFAULT_THEME.border,
    glow: typeof raw.glow === "string" ? raw.glow : DEFAULT_THEME.glow,
  };
}

function parseSiteFileConfig(raw: unknown, source: string): SiteFileConfig {
  if (!isRecord(raw)) {
    throw new Error(`Site config "${source}" must be a JSON object.`);
  }

  return {
    brand: requireString(raw, "brand", source),
    headline: requireString(raw, "headline", source),
    tagline: requireString(raw, "tagline", source),
    footer: requireString(raw, "footer", source),
    androidStoreLabel: requireString(raw, "androidStoreLabel", source),
    iosStoreLabel: requireString(raw, "iosStoreLabel", source),
    theme: parseTheme(raw.theme, source),
  };
}

function loadSiteFileConfig(): SiteFileConfig {
  const filePath = resolveConfigFilePath();

  if (!existsSync(filePath)) {
    throw new Error(
      `Site config file not found: ${filePath}. Set SITE_CONFIG_PATH or add ${DEFAULT_CONFIG_RELATIVE_PATH}.`,
    );
  }

  try {
    const parsed: unknown = JSON.parse(readFileSync(filePath, "utf8"));
    return parseSiteFileConfig(parsed, filePath);
  } catch (error) {
    if (error instanceof Error && error.message.startsWith("Site config")) {
      throw error;
    }
    throw new Error(
      `Failed to read site config at ${filePath}: ${
        error instanceof Error ? error.message : String(error)
      }`,
    );
  }
}

function mergeTheme(base: SiteTheme): SiteTheme {
  return {
    background: env("NEXT_PUBLIC_THEME_BACKGROUND") ?? base.background,
    backgroundAccent:
      env("NEXT_PUBLIC_THEME_BACKGROUND_ACCENT") ?? base.backgroundAccent,
    foreground: env("NEXT_PUBLIC_THEME_FOREGROUND") ?? base.foreground,
    muted: env("NEXT_PUBLIC_THEME_MUTED") ?? base.muted,
    accent: env("NEXT_PUBLIC_THEME_ACCENT") ?? base.accent,
    accentForeground:
      env("NEXT_PUBLIC_THEME_ACCENT_FOREGROUND") ?? base.accentForeground,
    surface: env("NEXT_PUBLIC_THEME_SURFACE") ?? base.surface,
    border: env("NEXT_PUBLIC_THEME_BORDER") ?? base.border,
    glow: env("NEXT_PUBLIC_THEME_GLOW") ?? base.glow,
  };
}

/**
 * Site content + theme from JSON (`config/site.json` or `SITE_CONFIG_PATH`),
 * then optional per-field env overrides.
 */
export function getSiteConfig(): SiteConfig {
  const siteJson = loadSiteFileConfig();

  return {
    brand: env("NEXT_PUBLIC_SITE_BRAND") ?? siteJson.brand,
    headline: env("NEXT_PUBLIC_SITE_HEADLINE") ?? siteJson.headline,
    tagline: env("NEXT_PUBLIC_SITE_TAGLINE") ?? siteJson.tagline,
    footer: env("NEXT_PUBLIC_SITE_FOOTER") ?? siteJson.footer,
    androidStoreLabel:
      env("NEXT_PUBLIC_ANDROID_STORE_LABEL") ?? siteJson.androidStoreLabel,
    iosStoreLabel:
      env("NEXT_PUBLIC_IOS_STORE_LABEL") ?? siteJson.iosStoreLabel,
    androidStoreUrl: env("NEXT_PUBLIC_ANDROID_STORE_URL") ?? null,
    iosStoreUrl: env("NEXT_PUBLIC_IOS_STORE_URL") ?? null,
    theme: mergeTheme(siteJson.theme),
  };
}

export function themeToCssVars(theme: SiteTheme): Record<string, string> {
  return {
    "--site-bg": theme.background,
    "--site-bg-accent": theme.backgroundAccent,
    "--site-fg": theme.foreground,
    "--site-muted": theme.muted,
    "--site-accent": theme.accent,
    "--site-accent-fg": theme.accentForeground,
    "--site-surface": theme.surface,
    "--site-border": theme.border,
    "--site-glow": theme.glow,
  };
}
