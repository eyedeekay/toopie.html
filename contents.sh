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

for f in $(find-ids $1); do echo  -n "contentUpdateById(\"$f\", \""; lowercase $(capitalize $f | tr -d '-'); echo "\");"; done