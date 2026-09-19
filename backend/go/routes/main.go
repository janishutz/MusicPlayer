package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/janishutz/oidclogin"
)

func AddRoutes(r *gin.Engine) {
	// Get the apple music token
	r.GET("/apple-music-token", oidclogin.EnsureLogin(false))

	// Get the user's playlists
	r.GET("/user/playlists", oidclogin.EnsureLogin(false))

	// Update the user's playlists
	r.POST("/user/playlists", oidclogin.EnsureLogin(false))

	// Create a room
	r.GET("/room/create", oidclogin.EnsureLogin(false))

	// Connect to the websocket here
	r.GET("/room/:id/ws")

	// Get updates by calling this endpoint with a time offset.
	r.GET("/room/:id/poll")
}
