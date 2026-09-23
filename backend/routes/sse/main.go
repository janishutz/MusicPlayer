package sse

import (
	"io"
	"log"
	"musicplayer/config"

	"github.com/gin-gonic/gin"
)

func Init(r *gin.Engine, configuration config.Config) {
	// Get updates faster via SSE (but at higher server cost)
	if configuration.ClientMode == "sse" {
		log.Println("SSE enabled")
		r.GET("/room/:id/sse", headersMiddleware(), handler)
	}
}

func headersMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Content-Type", "text/event-stream")
		c.Writer.Header().Set("Cache-Control", "no-cache")
		c.Writer.Header().Set("Connection", "keep-alive")
		c.Writer.Header().Set("Transfer-Encoding", "chunked")
		c.Next()
	}
}

func handler(c *gin.Context) {
	v, ok := c.Get("clientChan")
	if !ok {
		return
	}
	clientChan, ok := v.(ClientChan)
	if !ok {
		return
	}
	c.Stream(func(w io.Writer) bool {
		if msg, ok := <-clientChan; ok {
			c.SSEvent("message", msg)
			return true
		}
		return false
	})
}
