package websocket

import (
	"log"
	"musicplayer/routes/rooms"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
)

// From https://gin-gonic.com/en/docs/server-config/websocket/
const (
	pongWait   = 60 * time.Second
	pingPeriod = (pongWait * 9) / 10 // must be less than pongWait
)

var upgrader = websocket.Upgrader{
	// TODO: CORS
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

func Handler(c *gin.Context) {
	// Check if should even connect (i.e. room exists, and: is using anti-tamper or is admin)
	roomID, found := c.Params.Get("id")
	if !found || roomID == "" {
		c.AbortWithStatus(400)
		return
	}
	exists, _, hasAntiTamper := rooms.Exists(roomID, "")
	if !exists {
		log.Print("Room does not exist")
		c.AbortWithStatus(404)
		return
	} else if exists && !hasAntiTamper {
		log.Print("Room exists and anti-tamper not enabled. Not allowing WS connection")
		c.AbortWithStatus(418)
		return
	}

	// Setup (upgrade, etc)
	conn, err := upgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		log.Printf("WebSocket upgrade error: %v", err)
		return
	}

	// Add client and add cleanup function
	rooms.AddClient(roomID, conn)
	defer rooms.RemoveClient(roomID, conn)

	// Ping-Pong
	conn.SetReadDeadline(time.Now().Add(pongWait))
	conn.SetPongHandler(func(string) error {
		conn.SetReadDeadline(time.Now().Add(pongWait))
		return nil
	})
	go func() {
		ticker := time.NewTicker(pingPeriod)
		defer ticker.Stop()
		for range ticker.C {
			if err := conn.WriteMessage(websocket.PingMessage, nil); err != nil {
				return
			}
		}
	}()

	// Read messages and relay
	for {
		_, message, err := conn.ReadMessage()
		if err != nil {
			log.Printf("Read error: %v", err)
			break
		}
		adminMessage(roomID, message)
	}
}
