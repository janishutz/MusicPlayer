package sse

import (
	"log"
	"musicplayer/routes/rooms"

	"github.com/gin-gonic/gin"
)

// From https://github.com/gin-gonic/examples/blob/master/server-sent-event/main.go
// with quite a few adaptions for the specific multi-channel architecture of MusicPlayer

// It keeps a list of clients those are currently attached
// and broadcasting events to those clients.
type sseEvent struct {
	// Events are pushed to this channel by everyone
	Message chan message

	// New client connections
	NewClients chan clientConfig

	// Closed client connections
	ClosedClients chan clientConfig

	// Total client connections
	TotalClients map[string]clientsMap
}

type clientsMap map[chan string]bool

type clientConfig struct {
	Channel chan string
	Room    string
}

type message struct {
	Room    string
	Message string
}

// New event messages are broadcast to all registered client connection channels
type clientChan chan string

// ───────────────────────────────────────────────────────────────────

// Initialize event and Start processing requests
func newServer() (event *sseEvent) {
	event = &sseEvent{
		Message:       make(chan message),
		NewClients:    make(chan clientConfig),
		ClosedClients: make(chan clientConfig),
		TotalClients:  make(map[string]clientsMap),
	}

	go event.listen()

	return
}

// It Listens all incoming requests from clients.
// Handles addition and removal of clients and broadcast messages to clients.
func (stream *sseEvent) listen() {
	for {
		select {
		// Add new available client
		case client := <-stream.NewClients:
			stream.TotalClients[client.Room][client.Channel] = true
			log.Printf("Client added. %d registered clients", len(stream.TotalClients))

		// Remove closed client
		case client := <-stream.ClosedClients:
			delete(stream.TotalClients[client.Room], client.Channel)
			close(client.Channel)
			log.Printf("Removed client. %d registered clients", len(stream.TotalClients))

		// Broadcast message to client
		case eventMsg := <-stream.Message:
			room := stream.TotalClients[eventMsg.Room]
			for clientChan := range room {
				select {
				case clientChan <- eventMsg.Message:
					// Message sent successfully
				default:
					// Failed to send, dropping message
				}
			}
		}
	}
}

// Middleware for configuring SSE
func (stream *sseEvent) serveHTTP() gin.HandlerFunc {
	return func(c *gin.Context) {
		// Initialize client channel
		clientChan := make(clientChan)
		room := c.Params.ByName("id")
		exists, _, _ := rooms.Exists(room, "")
		if !exists {
			c.AbortWithStatus(404)
			return
		}

		// Send new connection to event server
		stream.NewClients <- clientConfig{
			Channel: clientChan,
			Room:    room,
		}

		go func() {
			<-c.Writer.CloseNotify()

			// Send closed connection to event server
			stream.ClosedClients <- clientConfig{
				Channel: clientChan,
				Room:    room,
			}
		}()

		c.Set("clientChan", clientChan)

		c.Next()
	}
}
