package util

import (
	"musicplayer/config"
	"os"

	storesdk "git.janishutz.com/janishutz-store/go-sdk"
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
}

func GetOwned(uid string) bool {
	if val, ok := cache[uid]; ok {
		return val
	}
	cache[uid] = storesdk.CheckOwned(uid, "com.janishutz.MusicPlayer.subscription", "subscription") ||
		storesdk.CheckOwned(uid, "com.janishutz.MusicPlayer.subscription-month", "subscription")
	return cache[uid]
}
