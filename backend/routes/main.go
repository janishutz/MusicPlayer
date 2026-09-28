package routes

import (
	"musicplayer/config"
	"musicplayer/routes/rooms"
	"musicplayer/routes/sse"
	"musicplayer/routes/websocket"
	"musicplayer/util"

	"github.com/gin-gonic/gin"
	"github.com/janishutz/oidclogin"
)

var conf config.Config

func AddRoutes(r *gin.Engine, configuration config.Config) {
	initializeDevTokenGenerator(configuration)
	rooms.Init()
	websocket.Init(configuration)

	// Get the apple music token
	r.GET("/dev-token", oidclogin.EnsureLogin(false), util.SessionOwnershipCheck, devTokenHandler(configuration))

	// Get the user's playlists
	r.GET("/user/playlists", oidclogin.EnsureLogin(false), playlistGetHandler)

	// Update the user's playlists
	r.POST("/user/playlists", oidclogin.EnsureLogin(false), util.SessionOwnershipCheck, playlistPostHandler)

	// Create a room
	r.POST("/room/create", oidclogin.EnsureLogin(false), util.SessionOwnershipCheck, createRoomHandler)

	// Connect to the websocket here
	r.GET("/room/:id/ws", websocket.Handler)

	// Admin websocket
	r.GET("/room/:id/ws/admin", oidclogin.EnsureLogin(false), websocket.AdminHandler)

	// Get updates by calling this endpoint with a time offset.
	r.GET("/room/:id/poll", pollHandler)

	// Initialize SSE if enabled in config
	if configuration.ClientMode == "sse" {
		sse.Init(r)
	}

	conf = configuration
}
