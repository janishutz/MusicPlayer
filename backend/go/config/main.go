package config

import (
	"io/fs"
	"log"
	"os"

	"github.com/goccy/go-yaml"
)

// MusicPlayer Configuration. See the configuration file for more information
type Config struct {
	Datadir        string              `json:"dataDir"`
	OwnershipCheck OwnershipCheck      `json:"ownershiptCheck"`
	AppleMusicApi  AppleMusicApiConfig `json:"appleMusicApi"`
	Urls           ApplicationURLs     `json:"urls"`
	ClientMode     string              `json:"clientMode"`
}

type OwnershipCheck struct {
	Enabled       bool     `json:"enabled"`
	BackendURL    bool     `json:"backendURL"`
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
	// TODO: First try to load config.secret.yml, then config.yml
	// Using https://github.com/goccy/go-yaml for yaml
	var conf Config
	curdir, err := os.Getwd()
	if err != nil {
		log.Fatal("Failed to read current directory")
	}

	dir := os.DirFS(curdir)
	contents, err := fs.ReadDir(dir, "")
	fname := "config.yml"
	for _, file := range contents {
		if file.Name() == "config.secret.yml" {
			fname = "config.secret.yml"
		}
	}
	data, err := fs.ReadFile(dir, fname)
	if err != nil {
		log.Fatal("Failed to load configuration")
	}

	yaml.Unmarshal(data, &conf)

	// TODO: Verify using schema (such as via https://github.com/google/jsonschema-go)

	return conf
}
