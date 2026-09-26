package rooms

import (
	"musicplayer/routes/types"
	"sync"
	"time"

	"github.com/gorilla/websocket"
)

// ┌                                               ┐
// │                     State                     │
// └                                               ┘
var (
	rooms     roomsList
	roomNames map[string]bool
	Clients   RoomClientList
)

type playlistState struct {
	LastUpdate int
	Playlist   types.Songs
}

type state struct {
	Index      int     `json:"index"`
	Start      int     `json:"start"`
	Playing    bool    `json:"playing"`
	LastUpdate int     `json:"lastUpdate"`
	Offset     float64 `json:"offset"`
}

type room struct {
	uid        string
	state      state
	playlist   playlistState
	antiTamper bool
}

type roomsList map[string]*room

// Web Sockets management
type clientList map[*websocket.Conn]bool

type RoomClientList struct {
	Lock  sync.RWMutex
	Rooms map[string]roomClient
}

type roomClient struct {
	Members clientList
	Admins  clientList
}

type StateUpdate struct {
	Playlist   *types.Songs `json:"playlist"`
	State      state        `json:"state"`
	AntiTamper bool         `json:"AT"`
	Mode       bool         `json:"SSE"`
}

func GetState(roomId string, lastUpdate int, sse bool) *StateUpdate {
	if roomNames[roomId] {
		room := rooms[roomId]
		if room.playlist.LastUpdate > lastUpdate {
			return &StateUpdate{
				Playlist:   &room.playlist.Playlist,
				State:      room.state,
				AntiTamper: room.antiTamper,
				Mode: sse,
			}
		} else {
			return &StateUpdate{
				Playlist:   nil,
				State:      room.state,
				AntiTamper: room.antiTamper,
				Mode: sse,
			}
		}
	}
	return nil
}

func UpdateState(roomId string, playing bool, index int, start int, offset float64) bool {
	if roomNames[roomId] {
		rooms[roomId].state.LastUpdate = int(time.Now().Unix())
		rooms[roomId].state.Index = index
		rooms[roomId].state.Start = start
		rooms[roomId].state.Playing = playing
		rooms[roomId].state.Offset = offset
		return true
	}
	return false
}

func UpdatePlaylist(roomId string, playlist types.Songs) bool {
	if roomNames[roomId] {
		rooms[roomId].playlist.LastUpdate = int(time.Now().Unix())
		rooms[roomId].playlist.Playlist = playlist
		return true
	}
	return false
}
