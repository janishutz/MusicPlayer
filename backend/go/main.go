package main

import (
	"net/http"
	"musicplayer/routes"
)

// TODO:
// https://github.com/alexedwards/scs for session handling
// My own SDK for login (that uses OIDC)
// This should replace the Node.js backend (or maybe have feature parity between the two)
func main() {
	routes.Add()
	http.ListenAndServe(":8080", nil)
}
