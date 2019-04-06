/**
 * # Want to try it out?
 * git clone https://github.com/blex41/demo-ssh2-tunnel.git
 * npm install
 * npm start
 */
const Client = require("ssh2").Client; // To communicate with Serveo
const Socket = require("net").Socket; // To accept forwarded connections (native module)

// Create an SSH client
const conn = new Client();

const config = {
  remoteHost: "",
  remotePort: 59000,
  localHost: "localhost",
  localPort: 3000
};

conn
  .on("ready", () => {
    // When the connection is ready
    console.log("Connection ready");
    // Start an interactive shell session
    conn.shell((err, stream) => {
      if (err) throw err;
      // And display the shell output (so I can see how Serveo responds)
      stream.on("data", data => {
        console.log("SHELL OUTPUT: " + data);
      });
    });
    // Request port forwarding from the remote server
    conn.forwardIn(config.remoteHost, config.remotePort, (err, port) => {
      if (err) throw err;
      conn.emit("forward-in", port);
    });
  })
  // ===== Note: this part is irrelevant to my problem, but here for the demo to work
  .on("tcp connection", (info, accept, reject) => {
    console.log("Incoming TCP connection", JSON.stringify(info));
    let remote;
    const srcSocket = new Socket();
    srcSocket
      .on("error", err => {
        if (remote === undefined) reject();
        else remote.end();
      })
      .connect(config.localPort, config.localPort, () => {
        remote = accept()
          .on("close", () => {
            console.log("TCP :: CLOSED");
          })
          .on("data", data => {
            console.log(
              "TCP :: DATA: " +
                data
                  .toString()
                  .split(/\n/g)
                  .slice(0, 2)
                  .join("\n")
            );
          });
        console.log("Accept remote connection");
        srcSocket.pipe(remote).pipe(srcSocket);
      });
  })
  // ===== End Note
  // Connect to Serveo
  .connect({
    host: "serveo.net",
    username: "johndoe",
    tryKeyboard: true
  });

// Just for the demo, create a server listening on port 3000
// Accessible both on:
// http://localhost:3000
// https://serveo.net:59000
const http = require("http"); // native module
http
  .createServer((req, res) => {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.write("Hello world!");
    res.end();
  })
  .listen(config.localPort);
