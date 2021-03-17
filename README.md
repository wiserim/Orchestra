# Orchestra

Orchestra is a web based application for simultaneous, collaborative music generation by multiple users.
Project was part of thesis: *System for generating, editing and transmitting multi-source audio streams using Web Audio API, Web RTC and Web MIDI*.

### Abstract
> The object of this thesis is design and implementation of aplication that allows generation, edition and transmission of multi-sourced audio streams with the use of Web Audio API, WebRTC and Web MIDI technologies. Thesis consists of two parts. First one describe with details technical specification, architecture and components of individual technologies. The second part describes design, implementation and tests of demo web application. The application allows to generate, play, modify and record audio streams. Additionally, it enables transmission of generated audio stream to other users via WebRTC.

**Key words**: Web Audio API, WebRTC, Web MIDI, sound synthesis, sound processing, peerto-peer communication

<p align="center">
  <img src="/public_files/assets/readme/screenshot-1.png" alt="Screenshot">
</p>

## Features:
* audio editing:
  * note based interface,
  * support for various audio sources (audio samples, synths, audio inputs, other users audio streams),
  * various audio effects,
  * audio recording and export to audio file (WAV, OGG, MP3),
  * MIDI controls (if supported by browser),
* room management,
* group chat,
* self hosted STUN adn TURN servers.

## Project setup
I. Install npm packages.
```
npm install
```
II. Configure TURN server in *app.js*
```javascript
turnServer: {
  authMech: 'long-term',
  credentials: {
    //user: password
    TurnServerExampleUsername: 'TurnServerExamplePassword'
  },
  listeningIps: [
    '127.0.0.1' //TURN server ip (host ip)
  ]
}
```
III. Configure STUN and TURN servers data in *src/store.js*
```javascript
iceServers: [
  //STUN server
  {
    urls: 'stun:stun-server-url.com'
  },
  //TURN server
  {
    urls: 'turn:turn-server-url.com',
    credential: 'TurnServerExamplePassword',
    username: 'TurnServerExampleUsername'
  }
]
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```
