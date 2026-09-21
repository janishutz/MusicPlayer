package routes

import (
	"log"
	"regexp"
	// "github.com/gorilla/websocket"
)

var (
	rooms     map[string]room
	roomNames map[string]bool
	regex     *regexp.Regexp
)

func Init() {
	r, err := regexp.Compile("[a-zA-Z0-9-]{3,}")
	if err != nil {
		log.Fatal("[Rooms] Regex compile failed")
	}

	regex = r
	rooms = map[string]room{}
	roomNames = map[string]bool{}
}

// Createa a new room, with `uid` being the owner and `name` being the name for the room.
// Returns true if successful, false if room exists already or the room name is invalid
func createRoom(uid string, name string) bool {
	if !regex.MatchString(name) {
		return false
	}

	if roomNames[name] {
		return false
	} else {
		roomNames[name] = true
		rooms[name] = room{
			uid:   uid,
			state: state{},
			playlist: playlistState{
				lastUpdate: 0,
				playlist:   Songs{},
			},
			members: clientList{},
		}

		return true
	}
}

// Close a given room. Returns false if either no such room exists, or not the owner issued the command
func closeRoom(uid string, name string) bool {
	if roomNames[name] {
		if rooms[name].uid != uid {
			return false
		}
		// TODO: Broadcast to all members of this room, then close websockets
		delete(roomNames, name)
		delete(rooms, name)
		return true
	}
	return false
}
