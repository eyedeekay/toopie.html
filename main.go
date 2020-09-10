//go:generate go run -tags generate gen.go

package main

import (
	"flag"
	"github.com/eyedeekay/toopie.html/lib"
)

var (
	port   = flag.String("port", "0", "Port to run the web interface on, default is randomly assigned.")
	pport  = flag.Int("proxy-port", 7677, "Port to use to proxy requests to i2p-control")
	ribbon = flag.Bool("ribbon", false, "use a horizontal ribbon instead of a vertical panel")
)

func main() {
	flag.Parse()
	if *ribbon {
		l, v := toopie.Launch(*port, *pport, 1200, 200)
		defer v.Destroy()
		defer l.Close()
	} else {
		l, v := toopie.Launch(*port, *pport, 500, 800)
		defer v.Destroy()
		defer l.Close()
	}

}
