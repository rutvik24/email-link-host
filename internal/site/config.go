package site

import (
	_ "embed"
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"strings"
)

//go:embed default_site.json
var defaultSiteJSON []byte

type Theme struct {
	Background       string `json:"background"`
	BackgroundAccent string `json:"backgroundAccent"`
	Foreground       string `json:"foreground"`
	Muted            string `json:"muted"`
	Accent           string `json:"accent"`
	AccentForeground string `json:"accentForeground"`
	Surface          string `json:"surface"`
	Border           string `json:"border"`
	Glow             string `json:"glow"`
}

type Config struct {
	Brand             string `json:"brand"`
	Headline          string `json:"headline"`
	Tagline           string `json:"tagline"`
	Footer            string `json:"footer"`
	AndroidStoreLabel string `json:"androidStoreLabel"`
	IOSStoreLabel     string `json:"iosStoreLabel"`
	AndroidStoreURL   string `json:"-"`
	IOSStoreURL       string `json:"-"`
	Theme             Theme  `json:"theme"`
}

// envLookup returns the first non-empty value among names (after trim).
func envLookup(names ...string) string {
	for _, name := range names {
		if value := strings.TrimSpace(os.Getenv(name)); value != "" {
			return value
		}
	}
	return ""
}

// envDual accepts both unprefixed and NEXT_PUBLIC_ names.
// Precedence: unprefixed first, then NEXT_PUBLIC_*.
func envDual(base string) string {
	return envLookup(base, "NEXT_PUBLIC_"+base)
}

func envDualOr(base, fallback string) string {
	if value := envDual(base); value != "" {
		return value
	}
	return fallback
}

func LoadConfig() (Config, error) {
	raw, source, err := readConfigJSON()
	if err != nil {
		return Config{}, err
	}

	var cfg Config
	if err := json.Unmarshal(raw, &cfg); err != nil {
		return Config{}, fmt.Errorf("parse site config %s: %w", source, err)
	}
	if err := cfg.validate(source); err != nil {
		return Config{}, err
	}

	cfg.Brand = envDualOr("SITE_BRAND", cfg.Brand)
	cfg.Headline = envDualOr("SITE_HEADLINE", cfg.Headline)
	cfg.Tagline = envDualOr("SITE_TAGLINE", cfg.Tagline)
	cfg.Footer = envDualOr("SITE_FOOTER", cfg.Footer)
	cfg.AndroidStoreLabel = envDualOr("ANDROID_STORE_LABEL", cfg.AndroidStoreLabel)
	cfg.IOSStoreLabel = envDualOr("IOS_STORE_LABEL", cfg.IOSStoreLabel)
	cfg.AndroidStoreURL = envDual("ANDROID_STORE_URL")
	cfg.IOSStoreURL = envDual("IOS_STORE_URL")

	cfg.Theme.Background = envDualOr("THEME_BACKGROUND", cfg.Theme.Background)
	cfg.Theme.BackgroundAccent = envDualOr("THEME_BACKGROUND_ACCENT", cfg.Theme.BackgroundAccent)
	cfg.Theme.Foreground = envDualOr("THEME_FOREGROUND", cfg.Theme.Foreground)
	cfg.Theme.Muted = envDualOr("THEME_MUTED", cfg.Theme.Muted)
	cfg.Theme.Accent = envDualOr("THEME_ACCENT", cfg.Theme.Accent)
	cfg.Theme.AccentForeground = envDualOr("THEME_ACCENT_FOREGROUND", cfg.Theme.AccentForeground)
	cfg.Theme.Surface = envDualOr("THEME_SURFACE", cfg.Theme.Surface)
	cfg.Theme.Border = envDualOr("THEME_BORDER", cfg.Theme.Border)
	cfg.Theme.Glow = envDualOr("THEME_GLOW", cfg.Theme.Glow)

	return cfg, nil
}

func readConfigJSON() ([]byte, string, error) {
	custom := envDual("SITE_CONFIG_PATH")
	if custom == "" {
		return defaultSiteJSON, "embedded:default_site.json", nil
	}

	path := custom
	if !filepath.IsAbs(path) {
		wd, err := os.Getwd()
		if err != nil {
			return nil, custom, err
		}
		path = filepath.Join(wd, path)
	}

	data, err := os.ReadFile(path)
	if err != nil {
		return nil, path, fmt.Errorf("read SITE_CONFIG_PATH %s: %w", path, err)
	}
	return data, path, nil
}

func (c Config) validate(source string) error {
	required := map[string]string{
		"brand":             c.Brand,
		"headline":          c.Headline,
		"tagline":           c.Tagline,
		"footer":            c.Footer,
		"androidStoreLabel": c.AndroidStoreLabel,
		"iosStoreLabel":     c.IOSStoreLabel,
	}
	for key, value := range required {
		if strings.TrimSpace(value) == "" {
			return fmt.Errorf("site config %s missing %q", source, key)
		}
	}
	return nil
}

func (c Config) HasAndroidStore() bool { return c.AndroidStoreURL != "" }
func (c Config) HasIOSStore() bool     { return c.IOSStoreURL != "" }
func (c Config) HasStores() bool       { return c.HasAndroidStore() || c.HasIOSStore() }
