#! /usr/bin/env bash
for f in $(find-ids $1); do echo  -n "contentUpdateById(\"$f\", \""; lowercase $(capitalize $f | tr -d '-'); echo "\");"; done