package rooms

import "musicplayer/routes/types"

// Createa a new room, with `uid` being the owner and `name` being the name for the room.
// Returns true if successful, false if room exists already or the room name is invalid
func Create(uid string, name string, antiTamper bool) bool {
	if !regex.MatchString(name) {
		return false
	}

	if roomNames[name] {
		return false
	} else {
		roomNames[name] = true
		rooms[name] = &room{
			uid:   uid,
			state: state{},
			playlist: playlistState{
				LastUpdate: 0,
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
		return true, rooms[name].uid == uid, rooms[name].antiTamper
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
		delete(Clients.Rooms, name)
		return true
	}
	return false
}
