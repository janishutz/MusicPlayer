package config

import (
	"log"
	"os"

	"github.com/goccy/go-yaml"
)

// MusicPlayer Configuration. See the configuration file for more information
type Config struct {
	Datadir        string              `json:"dataDir"`
	OwnershipCheck OwnershipCheck      `json:"ownershipCheck"`
	AppleMusicApi  AppleMusicApiConfig `json:"appleMusicApi"`
	Urls           ApplicationURLs     `json:"urls"`
	ClientMode     string              `json:"clientMode"`
}

type OwnershipCheck struct {
	Enabled       bool     `json:"enabled"`
	BackendURL    string   `json:"backendURL"`
	BypassingUIDs []string `json:"bypassingUIDs"`
}

// Configuration for Apple Music. Manadatory for MusicPlayer to work.
// The KeyPath is used to specify the path to the private key.
type AppleMusicApiConfig struct {
	TeamID     string `json:"teamID"`
	KeyID      string `json:"keyID"`
	KeyPath    string `json:"keyPath"`
	Storefront string `json:"storefront"`
}

type ApplicationURLs struct {
	FrontendURL     string `json:"frontendURL"`
	DefaultRedirect string `json:"defaultRedirect"`
	BackendURL      string `json:"backendURL"`
}

func LoadConfig() Config {
	// Default Config
	var conf Config

	// Load config
	contents, err := os.ReadDir("./")
	fname := "config.yml"
	for _, file := range contents {
		if file.Name() == "config.secret.yml" {
			fname = "config.secret.yml"
		}
	}
	data, err := os.ReadFile(fname)
	if err != nil {
		log.Fatal("[FATAL] Failed to load configuration")
	}
	yaml.Unmarshal(data, &conf)

	// Validate config and input defaults where not set
	if conf.ClientMode != "ws" && conf.ClientMode != "poll" {
		conf.ClientMode = "poll"
	}
	if conf.Datadir == "" {
		conf.Datadir = "./data/"
	}
	if conf.Datadir[len(conf.Datadir)-1] != '/' {
		conf.Datadir += "/"
	}
	if conf.AppleMusicApi.KeyPath == "" {
		conf.AppleMusicApi.KeyPath = "./apple_private_key.p8"
	}
	if conf.AppleMusicApi.KeyID == "" || conf.AppleMusicApi.Storefront == "" || conf.AppleMusicApi.TeamID == "" {
		log.Fatal("[FATAL] Missing Apple Music API configuration")
	}
	if conf.Urls.BackendURL == "" {
		log.Print("[WARN] Backend URL was not configured, falling back to localhost")
		conf.Urls.BackendURL = "http://localhost:8080"
	}
	if conf.Urls.FrontendURL == "" {
		log.Print("[WARN] Frontend URL URL was not configured, falling back to localhost")
		conf.Urls.BackendURL = "http://localhost:8081"
	}
	if conf.Urls.DefaultRedirect == "" {
		log.Print("[WARN] DefaultRedirect was not configured, falling back to default")
		conf.Urls.BackendURL = conf.Urls.FrontendURL + "/app"
	}

	log.Print("Configuration loaded and validated successfully")

	return conf
}
