//go:generate go run -tags generate gen.go

package main

import (
	"flag"
	"github.com/eyedeekay/toopie.html/import"
	"log"
)

var (
	port   = flag.String("port", "0", "Port to run the web interface on, default is randomly assigned.")
	pport  = flag.Int("proxy-port", 7677, "Port to use to proxy requests to i2p-control")
	ribbon = flag.Bool("ribbon", false, "use a horizontal ribbon instead of a vertical panel")
)

func update(){
  err := toopiexec.Run()
  if err != nil {
    log.Fatal(err.Error())
  }
}

func main() {
	flag.Parse()
  go update()
}
