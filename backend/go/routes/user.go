package routes

import "github.com/gin-gonic/gin"

func playlistGetHandler(c *gin.Context) {
	c.File(conf.Datapath + "" + ".json")
}

func playlistPostHandler(c *gin.Context) {
	var json File
	if c.BindJSON(&json) == nil {

	} else {
	}
}
