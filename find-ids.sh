for f in $@; do
    echo "# $f"
    grep -Eoih id\=\"[^\"]*\" $f | sed -e 's/"//g' -e 's/id=//g' | tr " " "\n" | sort -u
done