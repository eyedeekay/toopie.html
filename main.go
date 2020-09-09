//go:generate go run -tags generate gen.go

package main

import (
  "flag"
  
	"github.com/eyedeekay/toopie.html/lib"
)

var (
  port := flag.String("port", "0", "Port to run the web interface on, default is randomly assigned.")
)

func main() {
  flag.Parse()
	toopie.Launch(*port)
}
