package main

import (
	"log"
	"net/http"
	"os"
	"strings"

	"email-link-host/internal/site"
	"email-link-host/internal/version"
)

func main() {
	cfg, err := site.LoadConfig()
	if err != nil {
		log.Fatalf("config: %v", err)
	}

	homeHTML, err := site.RenderHome(cfg)
	if err != nil {
		log.Fatalf("render home: %v", err)
	}

	assetLinks, err := site.AssetLinksJSON()
	if err != nil {
		log.Fatalf("assetlinks: %v", err)
	}
	aasa, err := site.AppleAppSiteAssociationJSON()
	if err != nil {
		log.Fatalf("aasa: %v", err)
	}

	mux := http.NewServeMux()
	mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path != "/" {
			http.NotFound(w, r)
			return
		}
		w.Header().Set("Content-Type", "text/html; charset=utf-8")
		w.Header().Set("Cache-Control", "public, max-age=60")
		_, _ = w.Write(homeHTML)
	})
	mux.HandleFunc("/.well-known/assetlinks.json", jsonInlineHandler(assetLinks))
	mux.HandleFunc("/.well-known/apple-app-site-association", jsonInlineHandler(aasa))
	mux.HandleFunc("/version", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "text/plain; charset=utf-8")
		w.Header().Set("Cache-Control", "no-store")
		_, _ = w.Write([]byte(version.Version + "\n"))
	})

	addr := listenAddr()
	log.Printf("email-link-host %s listening on http://localhost%s", version.Version, addr)
	log.Printf("brand=%q androidStore=%v iosStore=%v", cfg.Brand, cfg.HasAndroidStore(), cfg.HasIOSStore())
	if err := http.ListenAndServe(addr, mux); err != nil {
		log.Fatal(err)
	}
}

func jsonInlineHandler(body []byte) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json; charset=utf-8")
		w.Header().Set("Content-Disposition", "inline")
		w.Header().Set("X-Content-Type-Options", "nosniff")
		w.Header().Set("Cache-Control", "public, max-age=300")
		_, _ = w.Write(append(body, '\n'))
	}
}

func listenAddr() string {
	if addr := strings.TrimSpace(os.Getenv("ADDR")); addr != "" {
		return addr
	}
	if port := strings.TrimSpace(os.Getenv("PORT")); port != "" {
		if strings.HasPrefix(port, ":") {
			return port
		}
		return ":" + port
	}
	if addr := strings.TrimSpace(os.Getenv("NEXT_PUBLIC_ADDR")); addr != "" {
		return addr
	}
	return ":8080"
}
