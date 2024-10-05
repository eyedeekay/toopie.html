#! /usr/bin/env bash
echo "function contentUpdateById(id, message) {
  let infoTitle = document.getElementById(id);
  let messageContent = chrome.i18n.getMessage(message);
  if (infoTitle === null) {
    console.log(\"content error\", id, messageContent);
    return;
  }
  infoTitle.textContent = messageContent;
}"

for f in $@; do
    for i in $(find-ids $f); do
        echo $i | grep '#' && continue
        echo  -n "contentUpdateById(\"$i\", \""
        lowercase $(capitalize $i | tr -d '-')
        echo "\"); // $f"
    done
done