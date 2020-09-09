package toopie

import (
	"bufio"
	"bytes"
	"fmt"
	"github.com/aybabtme/iocontrol"
	"github.com/dustin/go-humanize"
	"github.com/justinas/nosurf"
	"golang.org/x/net/context"
	"io"
	"log"
	"net"
	"net/http"
	"runtime"
	"strings"
	"time"
)

const timeout = time.Second * 5

var (
	connIDs  = make(chan uint64)
	connDone = make(chan uint64)
)

type fileServer struct {
	*fs
	port string
}

func (serv fileServer) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	if len(r.URL.Path) < 2 {
		r.URL.Path = "/index.html"
	}
	fi, err := serv.fs.Open(r.URL.Path)
	if err != nil {
		log.Println("error1", err)
		fi, err = serv.fs.Open("index.html")
		if err != nil {
			return
		}
	}
	buf := bytes.NewBuffer(nil)
	_, err = io.Copy(buf, fi)
	if err != nil {
		return
	}
	fi.Close()
	if strings.Contains(r.URL.Path, ".css") {
		w.Header().Add("Content-Type", "text/css")
	}
	if strings.Contains(r.URL.Path, ".js") {
		w.Header().Add("Content-Type", "text/javascript")
	}
	if strings.Contains(r.URL.Path, ".svg") {
		w.Header().Add("Content-Type", "image/svg+xml")
	}
	w.Write([]byte(strings.Replace(string(buf.Bytes()), "7657", serv.port, -1)))
}

func FileServer(files *fs, port int) *fileServer {
	var fis fileServer
	fis.fs = files
	fis.port = fmt.Sprintf("%d", port)
	return &fis
}

func Listen(port string, pport int) net.Listener {
	ln, err := net.Listen("tcp", "127.0.0.1:"+port)
	if err != nil {
		log.Fatal(err)
	}
	log.Println(fmt.Sprintf("http://%s", ln.Addr()))
	go http.Serve(ln, nosurf.New(FileServer(FS, pport)))
	go proxy(fmt.Sprintf("http://%s", ln.Addr()), fmt.Sprintf("localhost:7657"), pport)
	return ln
}

func proxy(localAddr, remoteAddr string, proxyPort int) string {
	var (
		lPort   = proxyPort
		verbose = false
	)

	log.SetFlags(0)
	log.SetPrefix("portproxy: ")

	if remoteAddr == "" {
		log.Fatal("need to define a remote address")
	}

	l, err := net.Listen("tcp", fmt.Sprintf(":%d", lPort))
	if err != nil {
		log.Fatalf("couldn't setup listener for proxy: %v", err)
	}
	defer l.Close()

	runtime.GOMAXPROCS(runtime.NumCPU())

	ctx, cancel := context.WithCancel(context.Background())

	log.Printf("now proxying port %d to %q", lPort, remoteAddr)
	go func() {
		i := uint64(1)
		var inflight int
		for {
			select {
			case <-ctx.Done():
				return
			case connIDs <- i:
				i++
				inflight++
				if verbose {
					log.SetPrefix(fmt.Sprintf("portproxy: %d conns ", inflight))
					log.Printf("[%d] new connection", i)
				}
			case id := <-connDone:
				inflight--
				if verbose {
					log.SetPrefix(fmt.Sprintf("portproxy: %d conns ", inflight))
					log.Printf("[%d] connection done", id)
				}
			}
		}
	}()

	for {
		conn, err := l.Accept()
		if err != nil {
			cancel()
			log.Fatalf("failed to accept: %v", err)
		}

		go func(conn net.Conn) {
			buf := bytes.NewBuffer(nil)
			brd := bufio.NewReader(io.TeeReader(conn, buf))
			if req, err := http.ReadRequest(brd); err == nil {
				req.RemoteAddr = remoteAddr
				proxyHTTP(ctx, conn, req, localAddr)
			} else {
				//				proxyConn(ctx, conn, buf, remoteAddr)
			}
		}(conn)

	}
}

func proxyHTTP(parent context.Context, lconn net.Conn, req *http.Request, localaddr string) {
	defer lconn.Close()
	verbose := false

	start := time.Now()
	id := <-connIDs
	defer func() { connDone <- id }()

	rconn, err := net.DialTimeout("tcp", req.RemoteAddr, timeout)
	if err != nil {
		log.Printf("[%d] couldn't dial remote address: %v", id, err)
		return
	}
	defer rconn.Close()

	mrd := iocontrol.NewMeasuredReader(rconn)
	mwr := iocontrol.NewMeasuredWriter(rconn)
	ctx, cancel := context.WithCancel(parent)
	defer cancel()

	go func() {
		tick := time.NewTicker(time.Second)
		for {
			select {
			case <-ctx.Done():
				dur := time.Since(start)
				if verbose {
					log.Printf("[%d] %s\tHTTP\ttx:%s @ %sps\t\trx:%s @ %sps",
						id,
						dur,
						humanize.IBytes(uint64(mwr.Total())),
						humanize.IBytes(uint64(mwr.BytesPerSec())),
						humanize.IBytes(uint64(mrd.Total())),
						humanize.IBytes(uint64(mrd.BytesPerSec())),
					)
				}
				return
			case <-tick.C:
			}

			dur := time.Since(start)
			if verbose {
				log.Printf("[%d] %s\tHTTP\ttx:%s @ %sps\t\trx:%s @ %sps",
					id,
					dur,
					humanize.IBytes(uint64(mwr.Total())),
					humanize.IBytes(uint64(mwr.BytesPerSec())),
					humanize.IBytes(uint64(mrd.Total())),
					humanize.IBytes(uint64(mrd.BytesPerSec())),
				)
			}
		}
	}()

	if err := req.Write(mwr); err != nil {
		log.Printf("[%d] couldn't write HTTP request: %v", id, err)
		return
	}

	resp, err := http.ReadResponse(bufio.NewReader(mrd), req)
	if err != nil {
		log.Printf("[%d] couldn't read HTTP response: %v", id, err)
		return
	}

	if _, ok := req.Header["Origin"]; ok {
		//		resp.Header.Set("Access-Control-Allow-Origin", "*")
		resp.Header.Set("Access-Control-Allow-Origin", localaddr)
	}
	if _, ok := req.Header["Origin"]; ok {
		resp.Header.Set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
	}

	if err := resp.Write(lconn); err != nil {
		log.Printf("[%d] couldn't write HTTP response back to client: %v", id, err)
		return
	}
}

func isNormalTerminationError(err error) bool {
	if err == nil {
		return false
	}
	if err == io.EOF {
		return true
	}
	e, ok := err.(*net.OpError)
	if ok && e.Timeout() {
		return true
	}

	for _, cause := range []string{
		"use of closed network connection",
		"broken pipe",
		"connection reset by peer",
	} {
		if strings.Contains(err.Error(), cause) {
			return true
		}
	}

	return false
}
