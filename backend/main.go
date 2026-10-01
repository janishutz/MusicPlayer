package main

import (
	"log"
	"os"
	"time"

	"musicplayer/config"
	"musicplayer/routes"
	"musicplayer/util"

	"github.com/gin-contrib/cors"
	"github.com/gin-contrib/sessions"
	"github.com/gin-contrib/sessions/memstore"
	"github.com/gin-gonic/gin"
	"github.com/janishutz/oidclogin"
)

func main() {
	r := gin.Default()

	conf := config.LoadConfig()

	// Load templates
	r.LoadHTMLGlob("templates/*.tmpl")

	// Security configuration
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{conf.Urls.FrontendURL},
		AllowMethods:     []string{"GET", "POST", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))
	r.Use(util.DefaultHeaders)
	r.Use(util.RateLimiter())
	r.SetTrustedProxies(conf.Urls.TrustedProxies)

	// Session management
	secret, ok := os.LookupEnv("MUSICPLAYER_SESSION_SECRET")
	if !ok {
		log.Println("[WARN] Missing secret (MUSICPLAYER_SESSION_SECRET is unset), using unsafe default")
		secret = "secret"
	}
	store := memstore.NewStore([]byte(secret))
	r.Use(sessions.Sessions("jhid", store))

	routes.AddRoutes(r, conf)

	// Set up SDKs for login and store
	oidclogin.Configure(r, conf.Urls.BackendURL, conf.Urls.DefaultRedirect, true, util.OwnershipCheck, os.Getenv("PROD") == "true")
	util.Init(conf)

	// Healthcheck
	r.GET("/healthz", func(c *gin.Context) { c.JSON(200, gin.H{"status": true}) })

	r.Run()
}
