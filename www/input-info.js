
document.addEventListener("click", clickEvent => {
  if (clickEvent.target.id === "window-create-help-panel") {
    let createData = {
      type: "panel",
      incognito: true
    };
    let creating = browser.tabs.create(createData);
    creating.then(() => {
      console.log("The help panel has been created");
    });
  } else if (clickEvent.target.id === "window-create-news-panel") {
    let createData = {
      type: "panel",
      incognito: true
    };
    let creating = browser.tabs.create(createData);
    creating.then(() => {
      console.log("The news panel has been created");
    });
  } else if (clickEvent.target.id === "generate-fresh-tunnel") {
    function refreshIdentity() {
      console.log("Generating new identity");
      const Http = new XMLHttpRequest();
      const url = "http://" + controlHost + ":" + controlPort;
      Http.open("GET", url);
      Http.send();
      Http.onreadystatechange = event => {
        console.log(Http.responseText);
      };
    }
    refreshIdentity();
  } else if (clickEvent.target.id === "label-router-restart") {
    console.log("attempting to initiate graceful restart");
    RouterManager("RestartGraceful");
  } else if (clickEvent.target.id === "label-router-shutdown") {
    console.log("attempting to initiate graceful shutdown");
    RouterManager("ShutdownGraceful");
  } else if (clickEvent.target.id === "label-router-status") {
    if (document.getElementById("label-status-list").style.display !== "none"){
      console.log("hiding label-status-list");
      document.getElementById("label-status-list").style.display = "none"
    }else{
      console.log("showing label-status-list");
      document.getElementById("label-status-list").style.display = "block"
    }
  } else if (clickEvent.target.id === "label-router-peers") {
    if (document.getElementById("label-peers-list").style.display !== "none"){
      console.log("hiding label-peers-list");
      document.getElementById("label-peers-list").style.display = "none"
    }else{
      console.log("showing label-peers-list");
      document.getElementById("label-peers-list").style.display = "block"
    }
  } else if (clickEvent.target.id === "label-router-bandwidth") {
    if (document.getElementById("label-bandwidth-list").style.display !== "none"){
      console.log("hiding label-bandwidth-list");
      document.getElementById("label-bandwidth-list").style.display = "none"
    }else{
      console.log("showing label-bandwidth-list");
      document.getElementById("label-bandwidth-list").style.display = "block"
    }
  } else if (clickEvent.target.id === "search-submit") {
    console.log("attempting to create search tab");
    goSearch();
  } else if (clickEvent.target.id === "browser-action") {
    console.log("showing a browser action");
    showBrowsing();
  } else if (clickEvent.target.id === "torrent-action") {
    console.log("showing a torrent action");
    showTorrentsMenu();
  } else if (clickEvent.target.id === "window-preface-title") {
    console.log("attempting to create homepage tab");
    goHome();
  } else if (clickEvent.target.id === "window-visit-index") {
    console.log("attempting to create index tab");
    goIndex();
  } else if (clickEvent.target.id === "window-visit-homepage") {
    console.log("attempting to create homepage tab");
    goHome();
  } else if (clickEvent.target.id === "window-visit-toopie") {
    console.log("attempting to create toopie tab");
    goToopie();
  } else if (clickEvent.target.id === "window-visit-i2ptunnel") {
    console.log("attempting to create i2ptunnel tab");
    goTunnel();
  } else if (clickEvent.target.id === "window-visit-susimail") {
    console.log("attempting to create susimail tab");
    goMail();
  } else if (clickEvent.target.id === "window-visit-snark") {
    console.log("attempting to create snark tab");
    goSnark();
  } else if (clickEvent.target.id === "clear-browser-data") {
    forgetBrowsingData();
  } else if (clickEvent.target.id === "check-i2p-control") {
    //echo("I2P Router Detected", "panel-section-i2pcontrol-check");
  } else if (clickEvent.target.id === "enable-web-rtc") {
    if (clickEvent.target.checked) {
      browser.runtime.sendMessage({ rtc: "enableWebRTC" });
    } else {
      browser.runtime.sendMessage({ rtc: "disableWebRTC" });
    }
    checkPeerConnection();
    return;
  } else if (clickEvent.target.id === "disable-history") {
    if (clickEvent.target.checked) {
      browser.runtime.sendMessage({ history: "disableHistory" });
    } else {
      browser.runtime.sendMessage({ history: "enableHistory" });
    }
    return;
  }

  clickEvent.preventDefault();
});

window.onload = function(e){ 
  document.getElementById("label-peers-list").style.display = "none"
  document.getElementById("label-bandwidth-list").style.display = "none"
}

if (UpdateContents !== undefined) UpdateContents();

const minutes = 0.2;
const interval = minutes * 60 * 1000;

setInterval(function() {
  if (UpdateContents !== undefined) UpdateContents();
}, interval);
