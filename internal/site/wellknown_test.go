package site

import (
	"encoding/json"
	"os"
	"testing"
)

func TestResolveIOSPathsIncludesAuthLinksByDefault(t *testing.T) {
	paths := resolveIOSPaths(nil, true)
	if len(paths) < 1 || paths[0] != iosAuthLinksPath {
		t.Fatalf("expected %q first, got %#v", iosAuthLinksPath, paths)
	}
}

func TestResolveIOSPathsCanDisableAuthLinks(t *testing.T) {
	paths := resolveIOSPaths(nil, false)
	if len(paths) == 0 || paths[0] == iosAuthLinksPath {
		t.Fatalf("expected default without auth links, got %#v", paths)
	}
}

func TestAppleAppSiteAssociationJSON(t *testing.T) {
	t.Setenv("IOS_TEAM_ID", "TEAM")
	t.Setenv("IOS_BUNDLE_ID", "com.example.app")
	os.Unsetenv("IOS_APP_PATHS")
	os.Unsetenv("NEXT_PUBLIC_IOS_APP_PATHS")
	os.Unsetenv("IOS_INCLUDE_AUTH_LINKS")
	os.Unsetenv("NEXT_PUBLIC_IOS_INCLUDE_AUTH_LINKS")

	raw, err := AppleAppSiteAssociationJSON()
	if err != nil {
		t.Fatal(err)
	}

	var payload struct {
		Applinks struct {
			Details []struct {
				Paths []string `json:"paths"`
			} `json:"details"`
		} `json:"applinks"`
	}
	if err := json.Unmarshal(raw, &payload); err != nil {
		t.Fatal(err)
	}
	if len(payload.Applinks.Details) != 1 {
		t.Fatalf("details: %#v", payload.Applinks.Details)
	}
	paths := payload.Applinks.Details[0].Paths
	if paths[0] != iosAuthLinksPath {
		t.Fatalf("paths: %#v", paths)
	}

	t.Setenv("IOS_INCLUDE_AUTH_LINKS", "false")
	raw, err = AppleAppSiteAssociationJSON()
	if err != nil {
		t.Fatal(err)
	}
	if err := json.Unmarshal(raw, &payload); err != nil {
		t.Fatal(err)
	}
	paths = payload.Applinks.Details[0].Paths
	if paths[0] == iosAuthLinksPath {
		t.Fatalf("expected auth links omitted, got %#v", paths)
	}
}
