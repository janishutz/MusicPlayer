package routes

type Playlist struct{}

// Represents the current state of the player
type State struct{}

var rooms map[string]struct {
	uid       string
	state     State
	playlist  Playlist
	timestamp int64
	members []string // TODO: How to best do this?
}

func createRoom(name string) {

}

func closeRoom(name string) {
	// TODO: Broadcast to all members of this room
}
