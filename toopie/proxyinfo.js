document.addEventListener("DOMContentLoaded", proxyStatus, false);

function proxyStatus() {
  console.log("(proxyinfo) checking proxy status");
  fetch("http://proxy.i2p", { cache: "no-store" }).then(
    proxyStatusSuccess,
    proxyStatusError
  );
}

function proxyStatusSuccess(myJson) {
  console.warn("(proxyinfo)", myJson);
  contentUpdateById("proxy-check", "proxySuccessStatus");
}

function proxyStatusError(error) {
  console.error("(proxyinfo)", error);
  contentUpdateById("proxy-check", "proxyFailedStatus");
}
