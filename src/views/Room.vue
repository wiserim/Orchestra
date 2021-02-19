<template>
    <div class="min-vh-100 d-flex flex-column">
        <b-navbar type="dark" variant="dark">
            <b-navbar-brand href="#">Orchestra</b-navbar-brand>

            <span class="navbar-text ml-1">Room id: {{ roomConfig.roomId }}</span>
            <span class="navbar-text ml-1">Username: {{ roomConfig.username }}</span>

            <b-navbar-nav class="ml-auto">
                <b-button v-if="roomConfig.owner" variant="primary" @click="leaveRoom">Close room</b-button>
                <b-button v-else variant="primary" @click="leaveRoom">Leave room</b-button>
            </b-navbar-nav>   
        </b-navbar>

        <b-container fluid class="d-flex flex-grow-1 pt-3 pb-3">
            <b-row class="flex-grow-1">
                <b-col cols="3" class="d-flex">
                    <div class="flex-grow-1 d-flex flex-column">
                        <div class="d-flex pb-3">
                            <div class="flex-grow-1 border rounded p-3">
                                <user-button v-for="user in users" :user="user"></user-button>
                                <p v-if="!users.length">No other users.</p>
                            </div>
                        </div>
                        <div class="d-flex flex-grow-1">
                            <chat :connection="connection" class="flex-grow-1"></chat>
                        </div>
                    </div>
                </b-col>
                <b-col cols="9" class="d-flex">
                    <audio-edit ref="audio-edit" :stream="audioStream" :users="users"></audio-edit>
                </b-col>
            </b-row>
        </b-container>

        <!--room error modal-->
        <b-modal id="error-modal" ref="error-modal" :title="errorModal.title" no-close-on-esc no-close-on-backdrop hide-header-close>
            <p>{{ errorModal.message }}</p>

            <div slot="modal-footer">
                <b-button v-if="errorModal.allowContinue" variant="primary" class="mr-1" @click="$bvModal.hide('error-modal')">Continue anyway</b-button>
                <b-button @click="leaveRoom">Leave room</b-button>
            </div>
        </b-modal>
        <!--room error modal end-->
        <!--room password modal-->
        <b-modal ref="password-modal" title="Invalid password" no-close-on-esc no-close-on-backdrop hide-header-close>
            <p>Please enter room password.</p>
            <b-form-group label="Password" label-for="room-password" :invalid-feedback="passwordModal.error">
                <b-form-input type="password" id="room-password" v-model="passwordModal.password" :state="passwordModal.error ? false : ''" placeholder="Enter password"></b-form-input>
            </b-form-group>
            <div slot="modal-footer">
                <b-button variant="primary" @click="enterPassword" class="mr-1">Confirm</b-button>
                <b-button @click="leaveRoom">Leave room</b-button>
            </div>
        </b-modal>
        <!--room password modal end-->
        <!--leave room modal-->
        <b-modal ref="leave-room-modal" title="Leave room">
            <p>Are you sure?</p>

            <div slot="modal-footer">
                <b-button v-if="roomConfig.owner" variant="danger" @click="leaveRoom">Close room</b-button>
                <b-button v-else variant="danger" @click="leaveRoom">Leave room</b-button>
                <b-button @click="hideLeaveRoomModal">Cancel</b-button>
            </div>
        </b-modal>
        <!--leave room modal end-->
    </div>
</template>

<script>
import * as io from 'socket.io-client'
window.io = io
import RTCMultiConnection from 'rtcmulticonnection'
import * as Tone from 'tone'
window.Tone = Tone

import Chat from '@/components/Chat.vue'
import UserButton from '@/components/utils/UserButton.vue'
import AudioEdit from '@/components/AudioEdit.vue'

export default {
    name: 'room',
    components: {
        Chat,
        UserButton,
        AudioEdit
    },
    data: function() {
        return {
            connection: null,
            users: [],
            audioStream: false,//Tone.context.createMediaStreamDestination(),
            errorModal: {
                title: '',
                message: '',
                allowContinue: false
            },
            passwordModal: {
                error: false,
                password: ''
            }
        }
    },
    computed: {
        connectionConfig() {
            return this.$store.state.config.connection;
        },
        roomConfig() {
            return this.$store.state.room;
        },
        events() {
            return this.$store.state.room.events;
        }
    },
    methods: {
        //setup connection
        connectionSetup() {
            this.connection = new RTCMultiConnection();
            //setup connection
            this.connection.socketURL = this.connectionConfig.socketURL; //server socket url
            this.connection.iceServers = this.connectionConfig.iceServers;//stun/turn servers
            this.connection.extra.username = this.roomConfig.username; //user name
            this.connection.publicRoomIdentifier = this.connectionConfig.publicRoomIdentifier; //make room public
            this.connection.autoCloseEntireSession = this.connectionConfig.autoCloseEntireSession; //keep room opened even if owner leaves
            this.connection.maxParticipantsAllowed = this.connectionConfig.maxParticipantsAllowed; //max participants allowed
            this.connection.socketMessageEvent = this.roomConfig.socketMessageEvent;
            this.connection.chunkSize = this.connectionConfig.chunkSize; //file chunk size
            this.connection.enableFileSharing = this.connectionConfig.enableFileSharing;
            this.connection.session = this.connectionConfig.session; //session settings
            this.connection.sdpConstraints.mandatory = this.connectionConfig.sdpConstraints;
            this.connection.autoCreateMediaElement = this.connectionConfig.autoCreateMediaElement; //create media element attached to stream

            //attach stream
            this.audioStream.stream.isAudioStream = true;
            this.audioStream.stream.streamid = this.roomConfig.username;
            this.audioStream.stream.type = 'local';
            this.connection.attachStreams.push(this.audioStream.stream);

            this.connection.enableLogs = this.connectionConfig.enableLogs;

            //setup connection events
            //on opening connection
            this.connection.onopen = function(event) {
                this.updateUsers();
                if(this.events.openConnection === undefined)
                    return;
                for(let listener of this.events.openConnection) {
                    listener(event);
                }
            }.bind(this);
            //on closing connection/error/leave
            this.connection.onclose = this.connection.onerror = this.connection.onleave = function(event) {
                //if room owner closed connection
                if(event.extra.roomOwner) {
                    this.errorModal = {
                        title: 'Room closed',
                        message: 'Room has been closed by owner.',
                        allowContinue: false
                    }
                    this.$refs['error-modal'].show();
                }

                if(this.events.closeConnection === undefined)
                    return;
                for(let listener of this.events.closeConnection) {
                    listener(event);
                }
            }.bind(this);
            //on receiving message
            this.connection.onmessage = function(event) {
                if(this.events.message === undefined)
                    return;
                for(let listener of this.events.message) {
                    listener(event);
                }
            }.bind(this);
            //on stream
            this.connection.onstream = function(event) {
                if(this.events.stream === undefined)
                    return;
                for(let listener of this.events.stream) {
                    listener(event);
                }

                this.updateUsers();
            }.bind(this);
            //on stream end
            this.connection.onstreamended = function(event) {
                this.updateUsers();
                if(this.events.streamEnded === undefined)
                    return;
                for(let listener of this.events.streamEnded) {
                    listener(event);
                }
            }.bind(this);
        },
        //create new room
        createRoom() {
            this.connectionSetup();
            this.connection.extra.roomOwner = true;
            this.connection.extra.description = this.roomConfig.description;

            //set password
            if(this.roomConfig.setPassword) {
                this.connection.password = this.roomConfig.password;
            }

            //open connection
            this.connection.open(this.roomConfig.roomId, function(isRoomOpened, roomId, error) {
                if(error) {
                    if(error === this.connection.errors.ROOM_NOT_AVAILABLE) {
                        this.errorModal = {
                            title: 'Room already exist',
                            message: 'Someone already created this room. Please either join or create a separate room.'
                        }
                        this.$refs['error-modal'].show();
                        return;
                    }

                    this.errorModal = {
                        title: 'Room error',
                        message: error
                    }
                    this.$refs['error-modal'].show();
                }
                //reload page on disconnect
                this.connection.socket.on('disconnect', function() {
                    //this.createRoom();
                }.bind(this));
            }.bind(this));
        },
        //join existing room
        joinRoom() {
            this.connectionSetup();
            this.connection.extra.roomOwner = false;
            //set password
            this.connection.password = this.roomConfig.password;

            //join connection
            this.connection.join(this.roomConfig.roomId, function(isRoomJoined, roomId, error) {
                if(error) {
                    if(error === this.connection.errors.ROOM_NOT_AVAILABLE) {
                        this.errorModal = {
                            title: 'Room does not exist',
                            message: 'This room does not exist. Please either create it or wait for moderator to enter in the room.',
                            allowContinue: false
                        }
                        this.$refs['error-modal'].show();
                        return;
                    }
                    if(error === this.connection.errors.ROOM_FULL) {
                        this.errorModal = {
                            title: 'Room is full',
                            message: 'This room reach it\'s full capacity.',
                            allowContinue: false
                        }
                        this.$refs['error-modal'].show();
                        return;
                    }
                    if(error === this.connection.errors.INVALID_PASSWORD) {
                        this.$refs['password-modal'].show();
                        return;

                        this.connection.join(this.roomConfig.roomId, function(isRoomJoined, roomId, error) {
                            if(error) {
                                this.errorModal = {
                                    title: 'Room error',
                                    message: error,
                                    allowContinue: false
                                }
                                this.$refs['error-modal'].show();
                            }
                        });
                        return;
                    }

                    this.errorModal = {
                        title: 'Room error',
                        message: error,
                        allowContinue: false
                    }
                    this.$refs['error-modal'].show();
                }
                //rejoin on disconnect
                this.connection.socket.on('disconnect', function() {
                    //this.createRoom();
                }.bind(this));
            }.bind(this));
        },
        enterPassword() {
            if(this.passwordModal.password === '') {
                this.passwordModal.error = 'Field required';
                return;
            }
            
            this.$refs['password-modal'].hide();
            this.$store.commit('setRoom', {
                password: this.passwordModal.password
            });
            this.passwordModal = {
                error: '',
                password: ''
            };
            this.joinRoom();
        },
        leaveRoom() {
            this.hideLeaveModal();
            //disconnect with all users
            let users = this.connection.getAllParticipants()
            for(let user of users) {
                this.connection.disconnectWith(user);
            };
            //close connection
            this.connection.close();
            this.connection.closeSocket();
            //close audio
            this.$refs['audio-edit'].closeAudio();

            this.$router.push('/');
        },
        //update users list
        updateUsers() {
            let users = [];
            let userIds = [];
            let participants = this.connection.getAllParticipants();
            for(let userId of participants) {
                userIds.push(userId);
                let userData = this.connection.peers[userId];
                //if user is new create its object
                let user = this.users.find(item => item.id === userId);
                if(user === undefined) {
                    user = this.$users.createUser({
                        id: userId,
                        name: userData.extra.username,
                        stream: (userData.streams.length > 0 ? userData.streams[0] : null),
                        output: this.$refs['audio-edit'].audio.recorderInput,
                        toMaster: true
                    });
                }

                if(user.audioSrc === null && userData.streams.length > 0) {
                    user.updateStream(userData.streams[0]);
                }

                users.push(user);
            };
            
            //destroying unused user objects
            for(let user of this.users) {
                if(userIds.indexOf(user.id) === -1) {
                    user.destroy();
                }
            }

            this.users = users;
        },
        showLeaveModal() {
          this.$refs['leave-room-modal'].show()
        },
        hideLeaveModal() {
          this.$refs['leave-room-modal'].hide();
        }
    },
    created: function() {
        let self = this;
        try {
            this.audioStream = Tone.context.createMediaStreamDestination();
        }
        catch(e) {
            this.errorModal = {
                title: 'Browser support error',
                message: 'Your Browser does not support features, which allow sending your audio to other users.',
                allowContinue: true
            }
        }
        
    },
    mounted: function() {
        if(this.errorModal.title)
            this.$refs['error-modal'].show();

        if(this.$store.state.room.owner) {
            this.createRoom();
        }
        else {
            this.joinRoom();
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>    
</style>
