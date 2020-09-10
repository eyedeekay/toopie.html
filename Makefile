
build: fmt gen
	go build --tags=netgo

run: fmt gen
	go run ./ -port 9001 -ribbon true

fmt:
	gofmt -w -s *.go */*.go

clean:
	rm i2pcontrol.js

i2pcontrol.js:
	wget "https://raw.githubusercontent.com/eyedeekay/I2P-in-Private-Browsing-Mode-Firefox/i2pcontrol/i2pcontrol/i2pcontrol.js"

gen:
	go run --tags=generate gen.go
