package rooms

import (
	"log"

	"github.com/gorilla/websocket"
)

// ┌                                               ┐
// │             Management functions              │
// └                                               ┘

// Add a WebSocket client
func AddClient(roomId string, conn *websocket.Conn) {
	log.Print("[WS] Connecting for room: ", roomId, " (as normal client)")
	Clients.Lock.Lock()
	defer Clients.Lock.Unlock()

	Clients.Rooms[roomId].Members[conn] = true
}

// Remove a websocket client
func RemoveClient(roomId string, conn *websocket.Conn) {
	log.Print("[WS] Ending connection for room: ", roomId, " (as normal client)")
	Clients.Lock.Lock()
	defer Clients.Lock.Unlock()
	delete(Clients.Rooms[roomId].Members, conn)
	conn.Close()
}

// Add a websocket admin client (this is the only allowed client to send updates)
func AddAdminClient(roomId string, conn *websocket.Conn) {
	log.Print("[WS] Connecting for room: ", roomId, " (as admin)")
	Clients.Lock.Lock()
	defer Clients.Lock.Unlock()

	Clients.Rooms[roomId].Admins[conn] = true
}

// Remove a websocket admin client
func RemoveAdminClient(roomId string, conn *websocket.Conn) {
	log.Print("[WS] Ending connection for room: ", roomId, " (as admin)")
	Clients.Lock.Lock()
	defer Clients.Lock.Unlock()
	delete(Clients.Rooms[roomId].Admins, conn)
	conn.Close()
}
