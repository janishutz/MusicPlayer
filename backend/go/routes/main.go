package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/janishutz/oidclogin"
	"musicplayer/config"
)

var conf config.Config

func AddRoutes(r *gin.Engine, configuration config.Config) {
	// Get the apple music token
	r.GET("/dev-token", oidclogin.EnsureLogin(false), devTokenHandler)

	// Get the user's playlists
	r.GET("/user/playlists", oidclogin.EnsureLogin(false), playlistGetHandler)

	// Update the user's playlists
	r.POST("/user/playlists", oidclogin.EnsureLogin(false), playlistPostHandler)

	// Create a room
	r.GET("/room/create", oidclogin.EnsureLogin(false))

	// Connect to the websocket here
	r.GET("/room/:id/ws")

	// Get updates by calling this endpoint with a time offset.
	r.GET("/room/:id/poll")

	conf = configuration
}
