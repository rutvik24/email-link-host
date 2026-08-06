package site

import (
	"encoding/json"
	"strings"
)

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
	paths := splitList(envDual("IOS_APP_PATHS"))
	if len(paths) == 0 {
		paths = []string{"NOT /_/*", "/*"}
	}

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
