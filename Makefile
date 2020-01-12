
run:
	go run ./

clean:
	rm i2pcontrol.js

i2pcontrol.js:
	wget "https://raw.githubusercontent.com/eyedeekay/I2P-in-Private-Browsing-Mode-Firefox/i2pcontrol/i2pcontrol/i2pcontrol.js"