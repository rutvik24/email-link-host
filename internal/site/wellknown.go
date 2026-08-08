package site

import (
	"encoding/json"
	"strings"
)

// iosAuthLinksPath is the Firebase email-link continue URL path pattern.
// Query params are not part of classic AASA path matching and remain available
// whenever this path matches (e.g. /__/auth/links?link=...).
const iosAuthLinksPath = "/__/auth/links*"

func splitList(value string) []string {
	if strings.TrimSpace(value) == "" {
		return nil
	}
	parts := strings.Split(value, ",")
	out := make([]string, 0, len(parts))
	for _, part := range parts {
		part = strings.TrimSpace(part)
		if part != "" {
			out = append(out, part)
		}
	}
	return out
}

func isEnvDisabled(value string) bool {
	switch strings.ToLower(strings.TrimSpace(value)) {
	case "0", "false", "no", "off":
		return true
	default:
		return false
	}
}

func hasAuthLinksPath(paths []string) bool {
	for _, path := range paths {
		trimmed := strings.TrimSpace(path)
		switch trimmed {
		case "/__/auth/links", "/__/auth/links*", "NOT /__/auth/links", "NOT /__/auth/links*":
			return true
		}
	}
	return false
}

func resolveIOSPaths(configured []string, includeAuthLinks bool) []string {
	paths := configured
	if len(paths) == 0 {
		paths = []string{"NOT /_/*", "/*"}
	}
	if !includeAuthLinks || hasAuthLinksPath(paths) {
		return paths
	}
	// Prepend so this allow wins over a later `NOT /_/*` exclusion.
	return append([]string{iosAuthLinksPath}, paths...)
}

// AssetLinksJSON builds Android Digital Asset Links payload from env.
func AssetLinksJSON() ([]byte, error) {
	packageName := envDual("ANDROID_PACKAGE_NAME")
	fingerprints := splitList(envDual("ANDROID_SHA256_CERT_FINGERPRINTS"))

	payload := []any{}
	if packageName != "" && len(fingerprints) > 0 {
		payload = append(payload, map[string]any{
			"relation": []string{"delegate_permission/common.handle_all_urls"},
			"target": map[string]any{
				"namespace":                "android_app",
				"package_name":             packageName,
				"sha256_cert_fingerprints": fingerprints,
			},
		})
	}
	return json.MarshalIndent(payload, "", "  ")
}

// AppleAppSiteAssociationJSON builds iOS AASA payload from env.
func AppleAppSiteAssociationJSON() ([]byte, error) {
	teamID := envDual("IOS_TEAM_ID")
	bundleID := envDual("IOS_BUNDLE_ID")
	paths := resolveIOSPaths(
		splitList(envDual("IOS_APP_PATHS")),
		!isEnvDisabled(envDual("IOS_INCLUDE_AUTH_LINKS")),
	)

	details := []any{}
	if teamID != "" && bundleID != "" {
		details = append(details, map[string]any{
			"appID": teamID + "." + bundleID,
			"paths": paths,
		})
	}

	payload := map[string]any{
		"applinks": map[string]any{
			"apps":    []any{},
			"details": details,
		},
	}
	return json.MarshalIndent(payload, "", "  ")
}
