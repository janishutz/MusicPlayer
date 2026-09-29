package util

import (
	"encoding/json"
	"musicplayer/config"
	"musicplayer/routes/types"
	"os"

	"github.com/janishutz/oidclogin"
)

func SetupUser(conf config.Config) oidclogin.UserFunc {
	return func(uid string, name string, email string) {
		// If file doesn't exist, create it, else skip
		_, err := os.Stat(conf.Datadir + uid + ".json")
		if err != nil {
			raw, _ := json.Marshal(types.File{Version: "1", Playlists: types.Playlists{}})
			os.WriteFile(conf.Datadir+uid+".json", raw, 0644)
		}
	}
}
