package main

import (
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/janishutz/oidclogin"
	"musicplayer/routes"
)

func main() {
	r := gin.Default()

	// TODO: Security stuff (and auto-config frontend and load config, parse that, etc, etc)
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"https://music.example.com"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	oidclogin.Configure(r, "https://api.music.example.com", "https://music.example.com", true)

	routes.AddRoutes(r)

	r.Run()
}
