package routes

import (
	"fmt"
	"musicplayer/routes/handlers"
	"net/http"
)

func default_handler(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "Hello World at %s", r.URL.Path[1:])
}

func Add() {
	// TODO: May need to use Gin instead (due to websockets)
	http.HandleFunc("/room/[a-z-]+/connect", default_handler)
	http.HandleFunc("/room/[a-z-]+/poll", default_handler)
	http.HandleFunc("/room/[a-z-]+/close", default_handler)
	http.HandleFunc("/room/[a-z-]+/update/playlist", default_handler)
	http.HandleFunc("/room/[a-z-]+/update/state", default_handler)
	http.HandleFunc("/room/create", default_handler)
	http.HandleFunc("/user/playlists", default_handler)
	http.HandleFunc("/user/owned", default_handler)
	handlers.Login()
}
