const express = require('express');
const path = require('path');
const app = express();

var config = {
    webRTCServer: {
      socketURL: '/',
      dirPath: '',
      homePage: '/',
      socketMessageEvent: 'RTCMultiConnection-Message',
      socketCustomEvent: 'RTCMultiConnection-Custom-Message',
      port: 80,
      enableLogs: true,
      isUseHTTPs: false,
      enableAdmin: false
    },
    stunServer: {
      type: 'udp4'
    },
    turnServer: {
      authMech: 'long-term',
      credentials: {
        //username: password
        user: 'password'
      },
      listeningIps: [
        //IP TURN server will listen
        'xxx.xxx.xxx.xxx'
      ]
    }
};

var RTCMultiConnectionServer = require('rtcmulticonnection-server');
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var Turn = require('node-turn');
var Stun = require('stun');

//STUN server
var stunServer = Stun.createServer(config.stunServer);

//TURN server
var turnServer = new Turn(config.turnServer);
turnServer.start();

//managing connection
io.on('connection', function(socket){
    //WebRTC server
    RTCMultiConnectionServer.addSocket(socket, config);

    const params = socket.handshake.query;
    if (!params.socketCustomEvent) {
        params.socketCustomEvent = 'custom-message';
    }

    socket.on(params.socketCustomEvent, function(message) {
        socket.broadcast.emit(params.socketCustomEvent, message);
    });
});

//listening to port 80
http.listen(80, function(){
    console.log('listening on *:80');
});

//static resources path
app.use(express.static(__dirname + '/dist'));

//routing
app.get('/',function(req,res) {
    res.sendFile(path.join(__dirname+'/dist/index.html'));
});
app.get('/room',function(req,res) {
    res.sendFile(path.join(__dirname+'/dist/index.html'));
});
