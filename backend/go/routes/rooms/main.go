package rooms

import (
	"log"
	"regexp"
)

var regex *regexp.Regexp

func Init() {
	r, err := regexp.Compile("[a-zA-Z0-9-]{3,}")
	if err != nil {
		log.Fatal("[Rooms] Regex compile failed")
	}
	rooms = roomsList{}

	regex = r
	roomNames = map[string]bool{}
	Clients = RoomClientList{
		Rooms: map[string]roomClient{},
	}
}
