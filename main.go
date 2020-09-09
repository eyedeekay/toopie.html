//go:generate go run -tags generate gen.go

package main

import (
	"flag"

	"github.com/eyedeekay/toopie.html/lib"
)

var (
	port  = flag.String("port", "0", "Port to run the web interface on, default is randomly assigned.")
	pport = flag.Int("proxy-port", 7677, "Port to use to proxy requests to i2p-control")
)

func main() {
	flag.Parse()
	toopie.Launch(*port, *pport)
}
