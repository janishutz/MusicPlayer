package routes

import "github.com/gin-gonic/gin"

// Here:
// Polling the backend for updates (clients will use these endpoints once a minute (or so))
// The idea for polling is that websockets use quite a lot of memory and resources and these simple,
// unauthenticated requests can be served VERY quickly and at large scale.
// The live displays can switch to WS-based solution, because that's only few clients and they benefit from this

func pollHandler(c *gin.Context) {}
