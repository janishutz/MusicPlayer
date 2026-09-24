package sse

import (
	"io"
	"log"
	"github.com/gin-gonic/gin"
)

// Get updates faster via SSE (but at higher server cost)
func Init(r *gin.Engine) {
	controller := newServer()
	log.Println("[SSE] Enabled by configuration, clients will default to using it")
	r.GET("/room/:id/sse", headersMiddleware(), controller.serveHTTP(), handler)
}

// This is mostly from https://github.com/gin-gonic/examples/blob/master/server-sent-event/main.go
// with some adaptions, especially in the manager.go file
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
	clientChan, ok := v.(clientChan)
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
