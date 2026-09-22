package routes

import (
	"log"

	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
)

func playlistGetHandler(c *gin.Context) {
	session := sessions.Default(c)
	log.Println(session.Get("jhid_uid"))
	c.File(conf.Datadir + session.Get("jhid_uid").(string) + ".json")
}

func playlistPostHandler(c *gin.Context) {
	var json File
	if c.BindJSON(&json) == nil {

	} else {
	}
}
