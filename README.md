# demo-ssh2-tunnel

This is a demo for a [Stackoverflow question](https://stackoverflow.com/questions/55547703/nodejs-reverse-ssh-tunnel-unable-to-bind-to-serveo-net80).

## How to run

Clone this repository:

```
git clone https://github.com/blex41/demo-ssh2-tunnel.git
```

Go into the directory:

```
cd demo-ssh2-tunnel
```

Install the dependencies:

```
npm install
```

Run the demo:

```
npm start
```

> This will start an app on port 3000, and instanciate a reverse tunnel to Serveo. Your app should be accessible at both these addresses:

```
http://localhost:3000   # on your local machine
http://serveo.net:59000 # on the Internet
```
