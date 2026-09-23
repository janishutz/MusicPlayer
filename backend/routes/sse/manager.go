package sse

import (
	"log"

	"github.com/gin-gonic/gin"
)

// From https://github.com/gin-gonic/examples/blob/master/server-sent-event/main.go
// with quite a few adaptions for the specific multi-channel architecture of MusicPlayer

// It keeps a list of clients those are currently attached
// and broadcasting events to those clients.
type Event struct {
	// Events are pushed to this channel by everyone
	Message chan Message

	// New client connections
	NewClients chan ClientConfig

	// Closed client connections
	ClosedClients chan ClientConfig

	// Total client connections
	TotalClients map[string]clientsMap
}

type clientsMap map[chan string]bool

type ClientConfig struct {
	Channel chan string
	Room    string
}

type Message struct {
	Room    string
	Message string
}

// New event messages are broadcast to all registered client connection channels
type ClientChan chan string

// Initialize event and Start processing requests
func NewServer() (event *Event) {
	event = &Event{
		Message:       make(chan Message),
		NewClients:    make(chan ClientConfig),
		ClosedClients: make(chan ClientConfig),
		TotalClients:  make(map[string]clientsMap),
	}

	go event.listen()

	return
}

// It Listens all incoming requests from clients.
// Handles addition and removal of clients and broadcast messages to clients.
func (stream *Event) listen() {
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

func (stream *Event) serveHTTP() gin.HandlerFunc {
	return func(c *gin.Context) {
		// Initialize client channel
		clientChan := make(ClientChan)
		room := "" // TODO: Get room

		// Send new connection to event server
		stream.NewClients <- ClientConfig{
			Channel: clientChan,
			Room:    room,
		}

		go func() {
			<-c.Writer.CloseNotify()

			// Send closed connection to event server
			stream.ClosedClients <- ClientConfig{
				Channel: clientChan,
				Room:    room,
			}
		}()

		c.Set("clientChan", clientChan)

		c.Next()
	}
}
