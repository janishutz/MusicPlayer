package types

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
