package rooms

import (
	"log"
	"musicplayer/routes/sse"
	"musicplayer/routes/types"
	"time"
)

const ROOM_RETENTION_PERIOD = 3600 * 4

// Createa a new room, with `uid` being the owner and `name` being the name for the room.
// Returns true if successful, false if room exists already or the room name is invalid
func Create(uid string, name string, antiTamper bool) bool {
	if !regex.MatchString(name) {
		return false
	}

	if roomNames[name] {
		// Recover rooms that are owned by current uid (or that have not been active in > retention period)
		if rooms[name].uid != uid {
			now := time.Now().Unix()
			cutOffTime := now - ROOM_RETENTION_PERIOD
			if rooms[name].state.LastUpdate > cutOffTime {
				return false
			} else {
				rooms[name].uid = uid
				rooms[name].state = state{
					LastUpdate: now,
				}
				rooms[name].playlist = playlistState{
					LastUpdate: now,
					Playlist:   types.Songs{},
				}
				rooms[name].antiTamper = antiTamper
				return true
			}
		} else {
			return true
		}
	} else {
		roomNames[name] = true
		rooms[name] = &room{
			uid: uid,
			state: state{
				LastUpdate: time.Now().Unix(),
			},
			playlist: playlistState{
				LastUpdate: time.Now().Unix(),
				Playlist:   types.Songs{},
			},
			antiTamper: antiTamper,
		}
		Clients.Rooms[name] = roomClient{
			Members: clientList{},
			Admins:  clientList{},
		}

		return true
	}
}

// Check if a room exists and the specified user is the admin
func Exists(name string, uid string) (exists bool, owned bool, antiTamper bool) {
	if roomNames[name] {
		cutOffTime := time.Now().Unix() - ROOM_RETENTION_PERIOD
		if rooms[name].state.LastUpdate > cutOffTime {
			return true, rooms[name].uid == uid, rooms[name].antiTamper
		} else {
			Close(rooms[name].uid, name)
			return false, false, false
		}
	} else {
		return false, false, false
	}
}

// Close a given room. Returns false if either no such room exists, or not the owner issued the command
func Close(uid string, name string) bool {
	Clients.Lock.Lock()
	defer Clients.Lock.Unlock()
	if roomNames[name] {
		if rooms[name].uid != uid {
			return false
		}
		delete(roomNames, name)
		delete(rooms, name)
		// Close all websockets for this room
		for c, _ := range Clients.Rooms[name].Admins {
			c.Close()
		}
		for c, _ := range Clients.Rooms[name].Members {
			c.Close()
		}

		// Close all SSE connections
		sse.CloseAllSSEForRoom(name)

		delete(Clients.Rooms, name)
		log.Println("Room ", name, " closed successfully")

		return true
	}
	return false
}
