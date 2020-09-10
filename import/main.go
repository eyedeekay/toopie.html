package toopiexec

import (
	"io/ioutil"
	"bytes"
	"io"
	"os"
	"fmt"
	"os/exec"
	"path/filepath"
)

func Run() error {
	dir, err := filepath.Abs(filepath.Dir(os.Args[0]))
	if err != nil {
		return fmt.Errorf("Path detection error %s", err)
	}
	filelist, err := FS.Readdir(-1)
	for index, file := range filelist{
	  fmt.Println(index, file.Name())
	}
	toopie, err := FS.Open("toopie")
	if err != nil {
		return fmt.Errorf("Toopie open error %s", err)
	}
	sys := bytes.NewBuffer(nil)
	if _, err := io.Copy(sys, toopie); err != nil {
		return fmt.Errorf("File copy error %s", err)
	}
	exepath := filepath.Join(dir, "toopie")
	err = ioutil.WriteFile(exepath, sys.Bytes(), 0755)
	if err != nil {
		return fmt.Errorf("File write error %s %s", err, exepath)
	}
	err = exec.Command(exepath).Run()
	if err != nil {
		return fmt.Errorf("Runtime error %s", err)
	}
	return nil
}
