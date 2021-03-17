# Orchestra

Orchestra is a web based application for collaborative music generation.
Project was part of master thesis: *System for generating, editing and transmitting multi-source audio streams using Web Audio API, Web RTC and Web MIDI*.

### Abstract
> The object of this thesis is design and implementation of aplication that allows generation, edition and transmission of multi-sourced audio streams with the use of Web Audio API, WebRTC and Web MIDI technologies. Thesis consists of two parts. First one describe with details technical specification, architecture and components of individual technologies. The second part describes design, implementation and tests of demo web application. The application allows to generate, play, modify and record audio streams. Additionally, it enables transmission of generated audio stream to other users via WebRTC.

**Key words**: Web Audio API, WebRTC, Web MIDI, sound synthesis, sound processing, peerto-peer communication

## Features:
* audio editing:
  * note based interface,
  * support for various audio sources (audio samples, synths, audio microphones),
  * audio recording and export (WAV, OGG, MP3),
  * MIDI controls (if supported by browser),
* room management,
* group chat,
* self hosted STUN adn TURN servers.

## Project setup

```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```
