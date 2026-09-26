package websocket

import (
	"encoding/json"
	"log"
	"musicplayer/routes/rooms"
	"musicplayer/routes/sse"
	"musicplayer/routes/types"

	"github.com/gorilla/websocket"
)

type UpdateMessage struct {
	Playing  *bool        `json:"playing"`
	Index    *int         `json:"index"`
	Start    *int         `json:"start"`
	Offset   *float64     `json:"offset"`
	Playlist *types.Songs `json:"playlist"`
}

func broadcast(roomId string, message []byte) {
	rooms.Clients.Lock.RLock()
	defer rooms.Clients.Lock.RUnlock()

	data := UpdateMessage{}
	if err := json.Unmarshal(message, &data); err != nil {
		log.Print("Failed to unmarshal: ", err)
	} else {
		if data.Playing != nil {
			rooms.UpdateState(roomId, *data.Playing, *data.Index, *data.Start, *data.Offset)
		} else if data.Playlist != nil {
			rooms.UpdatePlaylist(roomId, *data.Playlist)
		}
	}
	for conn := range rooms.Clients.Rooms[roomId].Members {
		if err := conn.WriteMessage(websocket.TextMessage, message); err != nil {
			log.Println("Broadcast for room ", roomId, " failed with error ", err)
		}
	}

	sse.SendUpdate(string(message), roomId)
}

func adminMessage(roomId string, message []byte) {
	rooms.Clients.Lock.RLock()
	defer rooms.Clients.Lock.RUnlock()
	for conn := range rooms.Clients.Rooms[roomId].Admins {
		if err := conn.WriteMessage(websocket.TextMessage, message); err != nil {
			log.Println("Admin message broadcast for room ", roomId, " failed with error ", err)
		}
	}
}
