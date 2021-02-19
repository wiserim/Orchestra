import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    config: {
      connection: {
        socketURL: '/',
        publicRoomIdentifier: 'orchestra-room',
        iceServers: [
          //STUN server
          {
            urls: 'stun:stun-server-url.com'
          },
          //TURN server
          {
              urls: 'turn:turn-server-url.com',
              credential: 'password',
              username: 'user'
          }
        ],
        autoCloseEntireSession: true,   //keep room opened even if owner leaves
        maxParticipants: 1000, //max participants allowed
        chunkSize: 16000, //sended chunk size
        enableFileSharing: false, //enable file sharing
        session: {
          audio: false,
          video: false,
          data: true
        },
        sdpConstraints: {
          OfferToReceiveAudio: false,
          OfferToReceiveVideo: false
        },
        autoCreateMediaElement: false,
        enableLogs: false
      }
    },
    //room config
    room: {
      roomId: '',
      username: '',
      description: '',
      setPassword: false,
      password: '',
      owner: false,
      socketMessageEvent: 'room',
      events: {
        openConnection: [],
        closeConnection: [],
        message: [],
        stream: [],
        streamEnded: [],
      }
    }
  },
  mutations: {
    setRoom(state, data) {
      if(data === undefined)
        return;
      if(data.roomId !== undefined)
        state.room.roomId = data.roomId;
      if(data.username !== undefined)
        state.room.username = data.username;
      if(data.description !== undefined)
        state.room.description = data.description;
      if(data.setPassword !== undefined)
        state.room.setPassword = (data.setPassword == true);
      if(data.password !== undefined)
        state.room.password = data.password;
      if(data.owner !== undefined)
        state.room.owner = (data.owner == true);
    },
    resetRoom(state) {
      state.room.roomId = '';
      state.room.username = '';
      state.room.description = '';
      state.room.setPassword = false;
      state.room.password = '';
      state.room.owner = false;
    },
    addListener(state, data) {
      if(state.room.events[data.event] !== undefined) {
        state.room.events[data.event].push(data.listener);
      }
    }
  }
})
