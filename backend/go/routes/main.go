package routes

import (
	"fmt"
	"net/http"
	"musicplayer/routes/handlers"
)

func Add() {
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintf(w, "Hello World at %s", r.URL.Path[1:])
	})
	handlers.Login()
}
