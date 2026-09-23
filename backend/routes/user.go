package routes

import (
	"encoding/json"
	"log"
	"musicplayer/routes/types"
	"os"

	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
)

func playlistGetHandler(c *gin.Context) {
	session := sessions.Default(c)
	c.File(conf.Datadir + session.Get("jhid_uid").(string) + ".json")
}

func playlistPostHandler(c *gin.Context) {
	var data types.File
	err := c.BindJSON(&data)
	if err == nil {
		session := sessions.Default(c)
		raw, err := json.Marshal(data)
		if err != nil {
			log.Println("[WARN] Failed to marshal playlists for user")
			c.AbortWithStatus(500)
		}
		os.WriteFile(conf.Datadir + session.Get("jhid_uid").(string) + ".json", raw, 0644)
	} else {
		log.Println("[WARN] Parsing JSON data failed with error", err)
		c.AbortWithStatus(400)
	}
}
