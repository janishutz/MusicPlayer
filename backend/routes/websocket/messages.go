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

func derefOrDefault[T any](value *T, default_value T) T {
	if value != nil {
		return *value
	} else {
		return default_value
	}
}

func broadcast(roomId string, message []byte) {
	rooms.Clients.Lock.RLock()
	defer rooms.Clients.Lock.RUnlock()

	data := UpdateMessage{}
	if err := json.Unmarshal(message, &data); err == nil {
		if data.Playing != nil {
			rooms.UpdateState(roomId, derefOrDefault(data.Playing, false), derefOrDefault(data.Index, -1), derefOrDefault(data.Start, -1), derefOrDefault(data.Offset, 0))
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
