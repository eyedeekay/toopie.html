
function handleProxyRequest(requestInfo) {
  console.log(`Proxying: ${requestInfo.url}`);
  return { type: "http", host: "127.0.0.1", port: 4444 };
}

browser.proxy.onRequest.addListener(handleProxyRequest, {
  urls: ["http://proxy.i2p/*", "https://proxy.i2p/*"],
});

function proxy_scheme() {
  console.info("(config)Got i2p:", getFuncName());
  return getFromStorageProxyScheme();
}
function proxy_host() {
  console.info("(config)Got i2p:", getFuncName());
  return getFromStorageHost();
}
function proxy_port() {
  console.info("(config)Got i2p:", getFuncName());
  return getFromStoragePort();
}

function control_host() {
  console.info("(config)Got i2p:", getFuncName());
  return getFromStorageControlHost();
}
function control_port() {
  console.info("(config)Got i2p:", getFuncName());
  return getFromStorageControlPort();
}

function rpc_host() {
  console.info("(config)Got i2p:", getFuncName());
  return getFromStorageRPCHost();
}
function rpc_port() {
  console.info("(config)Got i2p:", getFuncName());
  return getFromStorageRPCPort();
}
function rpc_path() {
  console.info("(config)Got i2p:", getFuncName());
  getFromStorageRPCPath();
}
function rpc_pass() {
  console.info("(config)Got i2p:", getFuncName());
  return getFromStorageRPCPass();
}

function getFuncName() {
  return getFuncName.caller.name;
}
