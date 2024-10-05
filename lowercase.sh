#! /usr/bin/env bash
capitalize()
{
        echo -n $* | sed -e "s/\b\(.\)/\l\1/g"

}
capitalize $1

