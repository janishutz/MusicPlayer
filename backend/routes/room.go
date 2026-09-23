package routes

import (
	"log"
	"musicplayer/routes/rooms"
	"strconv"

	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
)

// Here:
// Polling the backend for updates (clients will use these endpoints once a minute (or so))
// The idea for polling is that websockets use quite a lot of memory and resources and these simple,
// unauthenticated requests can be served VERY quickly and at large scale.
// The live displays can switch to WS-based solution, because that's only few clients and they benefit from this

func pollHandler(c *gin.Context) {
	i, err := strconv.Atoi(c.Query("lastUpdate"))
	if err != nil {
		i = 0
	}
	room := rooms.GetState(c.Params.ByName("id"), i/1000, conf.ClientMode == "sse")
	if room != nil {
		c.JSON(200, room)
	} else {
		c.AbortWithStatus(404)
	}
}

type roomCreateRequestBody struct {
	RoomId     string `json:"roomId"`
	AntiTamper bool   `json:"antiTamper"`
}

func createRoomHandler(c *gin.Context) {
	body := roomCreateRequestBody{}
	if err := c.BindJSON(&body); err != nil {
		log.Print("Error for JSON binding, ", err)
		c.AbortWithStatus(400)
		return
	}
	if len(body.RoomId) > 20 || len(body.RoomId) < 3 {
		log.Print("Room ID violates constraints")
		c.AbortWithStatus(400)
		return
	}
	session := sessions.Default(c)
	uid := session.Get("jhid_uid")
	rooms.Create(uid.(string), body.RoomId, body.AntiTamper)
}
