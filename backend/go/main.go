package main

import (
	"time"

	"musicplayer/config"
	"musicplayer/routes"

	"github.com/gin-contrib/cors"
	"github.com/gin-contrib/sessions"
	"github.com/gin-contrib/sessions/memstore"
	"github.com/gin-gonic/gin"
	"github.com/janishutz/oidclogin"
)

func main() {
	r := gin.Default()

	conf := config.LoadConfig()

	// TODO: Security stuff (and auto-config frontend and load config, parse that, etc, etc)
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:8081"},
		AllowMethods:     []string{"GET", "POST", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	// FIXME: Choose session store (probably best to support both redis and memstore or memcache)
	// TODO: Secret via env var as well
	store := memstore.NewStore([]byte("secret"))
	r.Use(sessions.Sessions("jhid", store))

	oidclogin.Configure(r, "https://api.music.example.com", "https://music.example.com", true)

	routes.AddRoutes(r, conf)

	// Healthcheck
	r.GET("/healthz", func(c *gin.Context) { c.JSON(200, gin.H{"status": true}) })

	r.Run()
}
