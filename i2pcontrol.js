var password = "itoopie";
var hello = "hello i2pcontrol";

function makeid(length) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

function send(message) {
  async function postData(url = "", data = {}) {
    // Default options are marked with *
    console.log("(i2pcontrol)");
    let requestBody = JSON.stringify(data);
    let opts = {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      mode: "cors", // no-cors, *cors, same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      credentials: "same-origin", // include, *same-origin, omit
      headers: {
        "Content-Type": "application/json"
      },
      redirect: "follow", // manual, *follow, error
      referrerPolicy: "no-referrer", // no-referrer, *client
      body: requestBody // body data type must match "Content-Type" header
    };
    const response = await fetch(url, opts);
    return await response.json(); // parses JSON response into native JavaScript objects
  }

  return postData("http://127.0.0.1:7657/jsonrpc/", message);
}

function authenticate(password) {
  var json = {
    id: makeid(6),
    jsonrpc: "2.0",
    method: "Authenticate",
    params: {
      API: 1,
      Password: password
    }
  };
  return send(json);
}

async function GetToken(password) {
  let me = authenticate(password);
  return await me.then(gettoken);
}

function gettoken(authtoken) {
  return authtoken.result.Token;
}

function Done(output) {
  console.log("(i2pcontrol) I2PControl connection tested,", output);
  return output;
}

function Echo(message) {
  function echo(token) {
    let json = {
      id: makeid(6),
      jsonrpc: "2.0",
      method: "Echo",
      params: {
        Token: token,
        Echo: message
      }
    };
    return send(json);
  }
  let token = GetToken(password);
  let done = token.then(echo);
  return done;
}

function UpdateEchoElementByID(Query, ID) {
  function updateelement(update) {
    console.log("(i2pcontrol)", update);
    document.getElementById(ID).innerText = update;
  }
  let net = Echo(Query);
  net.then(updateleement);
}

function GetRate(Query) {
  function getrate(token) {
    var json = new Object();
    json["id"] = makeid(6);
    json["jsonrpc"] = "2.0";
    json["method"] = "I2PControl";
    json["params"] = new Object();
    json["params"]["Token"] = token;
    json["params"]["Stat"] = Query;
    json["params"]["Period"] = 2000;
    return send(json);
  }
  let token = GetToken(password);
  let done = token.then(getrate);
  return done;
}

function UpdateGetRateElementByID(Query, ID) {
  function updateelement(update) {
    console.log("(i2pcontrol)", update);
    document.getElementById(ID).innerText = update;
  }
  let net = GetRate(Query);
  net.then(updateleement);
}

function I2PControl(Query) {
  function i2pcontrol(token) {
    var json = new Object();
    json["id"] = makeid(6);
    json["jsonrpc"] = "2.0";
    json["method"] = "I2PControl";
    json["params"] = new Object();
    json["params"]["Token"] = token;
    json["params"][Query] = null;
    return send(json);
  }
  let token = GetToken(password);
  let done = token.then(i2pcontrol);
  return done;
}

function UpdateI2PControlElementByID(Query, ID) {
  function updateelement(update) {
    console.log("(i2pcontrol)", update);
    document.getElementById(ID).innerText = update;
  }
  let net = I2PControl(Query);
  net.then(updateleement);
}

function RouterInfo(Query) {
  function routerinfo(token) {
    var json = new Object();
    json["id"] = makeid(6);
    json["jsonrpc"] = "2.0";
    json["method"] = "RouterInfo";
    json["params"] = new Object();
    json["params"]["Token"] = token;
    json["params"][Query] = null;
    return send(json);
  }
  let token = GetToken(password);
  let done = token.then(routerinfo);
  return done;
}

function UpdateRouterInfoElementByID(Query, ID) {
  function updateelement(update) {
    console.log(
      "(i2pcontrol)",
      update.result[Query],
      ID,
      document.getElementById(ID)
    );
    document.getElementById(ID).innerText = update.result[Query];
  }
  let net = RouterInfo(Query);
  net.then(updateelement);
}

function RouterManager(Query) {
  function routermanager(token) {
    var json = new Object();
    json["id"] = makeid(6);
    json["jsonrpc"] = "2.0";
    json["method"] = "RouterManager";
    json["params"] = new Object();
    json["params"]["Token"] = token;
    json["params"][Query] = null;
    return send(json);
  }
  let token = GetToken(password);
  let done = token.then(routermanager);
  return done;
}

function UpdateRouterManagerElementByID(Query, ID) {
  function updateelement(update) {
    console.log("(i2pcontrol)", update);
    document.getElementById(ID).innerText = update;
  }
  let net = RouterManage(Query);
  net.then(updateleement);
}

function NetworkSetting(Query) {
  function networksetting(token) {
    var json = new Object();
    json["id"] = makeid(6);
    json["jsonrpc"] = "2.0";
    json["method"] = "NetworkSetting";
    json["params"] = new Object();
    json["params"]["Token"] = token;
    json["params"][Query] = null;
    return send(json);
  }
  let token = GetToken(password);
  let done = token.then(networksetting);
  return done;
}

function UpdateNetworkSettingElementByID(Query, ID) {
  function updateelement(update) {
    console.log("(i2pcontrol)", update);
    document.getElementById(ID).innerText = update;
  }
  let net = NetworkSetting(Query);
  net.then(updateleement);
}

function UpdateContents() {
  UpdateRouterInfoElementByID("i2p.router.status", "router-status");
  UpdateRouterInfoElementByID("i2p.router.uptime", "router-uptime");
  UpdateRouterInfoElementByID("i2p.router.version", "router-version");
  UpdateRouterInfoElementByID(
    "i2p.router.net.bw.inbound.1s",
    "router-net-bw-inbound-1s"
  );
  UpdateRouterInfoElementByID(
    "i2p.router.net.bw.inbound.15s",
    "router-net-bw-inbound-15s"
  );
  UpdateRouterInfoElementByID(
    "i2p.router.net.bw.outbound.1s",
    "router-net-bw-outbound-1s"
  );
  UpdateRouterInfoElementByID(
    "i2p.router.net.bw.outbound.15s",
    "router-net-bw-outbound-15s"
  );
  UpdateRouterInfoElementByID("i2p.router.net.status", "router-net-status");
  UpdateRouterInfoElementByID(
    "i2p.router.net.tunnels.participating",
    "router-net-tunnels-participating"
  );
  UpdateRouterInfoElementByID(
    "i2p.router.netdb.activepeers",
    "router-netdb-activepeers"
  );
  UpdateRouterInfoElementByID(
    "i2p.router.netdb.fastpeers",
    "router-netdb-fastpeers"
  );
  UpdateRouterInfoElementByID(
    "i2p.router.netdb.highcapacitypeers",
    "router-netdb-highcapacitypeers"
  );
  UpdateRouterInfoElementByID(
    "i2p.router.netdb.isreseeding",
    "router-netdb-isreseeding"
  );
  UpdateRouterInfoElementByID(
    "i2p.router.netdb.knownpeers",
    "router-netdb-knownpeers"
  );
}

UpdateContents();

/*setInterval(function() {
    UpdateContents();
}, 750);*/
//var done = Echo(hello);
//done.then(Done);
