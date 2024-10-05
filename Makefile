
build: fmt gen
	go build --tags=netgo

run: fmt gen
	go run ./ -port 9001 #-ribbon true

test:
	cd import && go test

fmt:
	gofmt -w -s *.go */*.go

clean:
	rm i2pcontrol.js

i2pcontrol.js:
	wget "https://raw.githubusercontent.com/eyedeekay/I2P-in-Private-Browsing-Mode-Firefox/i2pcontrol/i2pcontrol/i2pcontrol.js"

gen:
	go run --tags=generate gen.go

install-helpers:
	install -m755 capitalize.sh /usr/local/bin/capitalize
	install -m755 contents.sh /usr/local/bin/contents
	install -m755 find-ids.sh /usr/local/bin/find-ids
	install -m755 lowercase.sh /usr/local/bin/lowercase