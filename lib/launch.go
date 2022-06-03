//go:generate go run -tags generate gen.go

package toopie

import (
	"fmt"
	"github.com/jchv/go-webview-selector"
	"net"
)

func Launch(port string, pport int, width, height int) (ln net.Listener, w webview.WebView) {
	ln = Listen(port, pport)
	//	defer ln.Close()
	debug := true
	w = webview.New(debug)
	//	defer w.Destroy()
	w.SetTitle("toopie.html")
	w.SetSize(width, height, webview.HintFixed)
	w.Navigate(fmt.Sprintf("http://%s", ln.Addr()))
	w.Run()
	return
}
