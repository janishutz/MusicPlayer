package websocket

import (
	"log"
	"musicplayer/routes/rooms"
	"time"

	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
)

func AdminHandler(c *gin.Context) {
	// Check if should even connect (i.e. room exists, and: is using anti-tamper or is admin)
	roomID, found := c.Params.Get("id")
	if !found || roomID == "" {
		c.AbortWithStatus(400)
		return
	}
	session := sessions.Default(c)
	uid := session.Get("jhid_uid")
	exists, isAdmin, _ := rooms.Exists(roomID, uid.(string))
	if !exists {
		log.Print("Room does not exist")
		c.AbortWithStatus(404)
		return
	} else if exists && !isAdmin {
		c.AbortWithStatus(403)
		return
	}

	// Setup (upgrade, etc)
	conn, err := upgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		log.Printf("WebSocket upgrade error: %v", err)
		return
	}

	// Add client and add cleanup function
	rooms.AddAdminClient(roomID, conn)
	defer rooms.RemoveAdminClient(roomID, conn)

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

	// Read messages and relay (different depending on if admin or not)
	for {
		_, message, err := conn.ReadMessage()
		if err != nil {
			log.Printf("Read error: %v", err)
			break
		}
		broadcast(roomID, message)
		if string(message) == "close-room" {
			rooms.Close(uid.(string), roomID)
		}
	}
}
