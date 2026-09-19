package routes

import (
	"net/http"

	"github.com/gorilla/websocket"
)

// https://gin-gonic.com/en/docs/server-config/websocket/
var upgrader = websocket.Upgrader{
	// TODO: CORS
  CheckOrigin: func(r *http.Request) bool {
    return true
  },
}
