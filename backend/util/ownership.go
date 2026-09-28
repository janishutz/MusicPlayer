package util

import (
	"musicplayer/config"
	"os"

	storesdk "git.janishutz.com/janishutz-store/go-sdk"
	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
)

var cache map[string]bool

func Init(conf config.Config) {
	storesdk.Init(storesdk.Configuration{
		Secret:        os.Getenv("STORE_SERVICE_SECRET"),
		ServiceId:     os.Getenv("STORE_SERVICE_ID"),
		BackendUrl:    conf.OwnershipCheck.BackendURL,
		BypassingUids: conf.OwnershipCheck.BypassingUIDs,
		UseStubs:      !conf.OwnershipCheck.Enabled,
		StubsDefault:  !conf.OwnershipCheck.Enabled,
	})
	cache = make(map[string]bool)
}

func GetOwned(uid string, force bool) bool {
	if !force {
		if val, ok := cache[uid]; ok {
			return val
		}
	}
	cache[uid] = storesdk.CheckOwned(uid, "com.janishutz.MusicPlayer.subscription", "subscription") ||
		storesdk.CheckOwned(uid, "com.janishutz.MusicPlayer.subscription-month", "subscription")
	return cache[uid]
}

func OwnershipCheck(c *gin.Context) {
	session := sessions.Default(c)
	owned := false
	if c.Query("force") == "true" {
		owned = GetOwned(session.Get("jhid_uid").(string), true)
	} else {
		owned = GetOwned(session.Get("jhid_uid").(string), true)
	}
	session.Set("owned", owned)
	session.Save()
	if !owned {
		c.AbortWithStatus(402)
	} else {
		c.Next()
	}
}

// Check of ownership via session
func SessionOwnershipCheck(c *gin.Context) {
	session := sessions.Default(c)
	ownedRaw := session.Get("owned")
	if ownedRaw != nil {
		if ownedRaw.(bool) {
			c.Next()
		} else {
			c.AbortWithStatus(402)
		}
	} else {
		c.AbortWithStatus(500)
	}
}
