package routes

import (
	"sync"

	"github.com/gorilla/websocket"
)

type File struct {
	Version   string    `json:"version"`
	Playlists Playlists `json:"playlists"`
}

type Playlists []Playlist
type Playlist struct {
	Name  string `json:"name"`
	Songs Songs  `json:"songs"`
}

type Songs []Song

type Song struct {
	Source               string `json:"source"`
	Identifier           string `json:"identifier"`
	AdditionalIdentifier string `json:"additional-identifier"`
	AdditionalInfo       string `json:"additional-info"`
	Artist               string `json:"artist"`
	Name                 string `json:"name"`
	Artwork              string `json:"artwork"`
	Duration             int    `json:"duration"`
}

// ┌                                               ┐
// │                     State                     │
// └                                               ┘

type playlistState struct {
	lastUpdate int
	playlist   Songs
}

type state struct {
	Index      int  `json:"index"`
	Start      int  `json:"start"`
	Playing    bool `json:"playing"`
	LastUpdate int  `json:"lastUpdate"`
	Offset     int  `json:"offset"`
}

type clientList map[*websocket.Conn]bool

type room struct {
	uid      string
	state    state
	playlist playlistState
	members  clientList
	lock     sync.RWMutex
}
