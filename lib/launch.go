//go:generate go run -tags generate gen.go

package toopie

import (
	"fmt"
	"github.com/webview/webview"
)

func Launch(port string, pport int) {
	ln := Listen(port, pport)
	defer ln.Close()
	debug := true
	w := webview.New(debug)
	defer w.Destroy()
	w.SetTitle("toopie.html")
	w.SetSize(500, 800, webview.HintFixed)
	w.Navigate(fmt.Sprintf("http://%s", ln.Addr()))
	w.Run()
}
