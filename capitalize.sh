#! /usr/bin/env bash
capitalize()
{
        echo -n $* | sed -e "s/\b\(.\)/\u\1/g"

}
capitalize $1

