package musicplayer

import (
	"fmt"
	"net/http"
)

// TODO:
// https://github.com/alexedwards/scs for session handling
// My own SDK for login (that uses OIDC)
// This should replace the Node.js backend (or maybe have feature parity between the two)
func main() {
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintf(w, "Hello World at %s", r.URL.Path[1:])
	})
	http.ListenAndServe(":8080", nil)
}
