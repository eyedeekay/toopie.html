//+build generate

package main

import (
	"github.com/zserge/lorca"

	"log"
	"os/exec"
)

func main() {
	// You can also run "npm build" or webpack here, or compress assets, or
	// generate manifests, or do other preparations for your assets.
	lorca.Embed("toopie", "lib/assets.go", "www")
	err := exec.Command("go", "build", "-tags", "netgo", "-o", "bin/toopie").Run()
	if err != nil {
		log.Fatalf(err.Error())
	}
	lorca.Embed("toopiexec", "import/assets.go", "bin/")
}
