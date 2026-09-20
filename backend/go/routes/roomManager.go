package routes

import (
	"log"
	"regexp"
	"sync"

	"github.com/gorilla/websocket"
)

type Playlist struct{}

// Represents the current state of the player
type State struct{}

type clientList map[*websocket.Conn]bool

type room struct {
	uid       string
	state     State
	playlist  Playlist
	timestamp int64
	members   clientList
	lock      sync.RWMutex
}

var (
	rooms     map[string]room
	roomNames map[string]bool
	regex     *regexp.Regexp
)

func Init() {
	r, err := regexp.Compile("[a-zA-Z0-9-]+")
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
			uid:       uid,
			state:     State{},
			playlist:  Playlist{},
			timestamp: 0,
			members:   clientList{},
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
