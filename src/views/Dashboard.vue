<template>
    <div class="min-vh-100 d-flex flex-column">
        <b-navbar type="dark" variant="dark">
            <b-navbar-brand href="#">Orchestra</b-navbar-brand>

            <span class="navbar-text ml-1">Active rooms: {{ rooms.length }}</span>

            <b-navbar-nav class="ml-auto">
                <b-button variant="primary" class="mr-1" @click="showCreateRoomModal">Create new room</b-button>
                <b-button @click="showJoinRoomModal">Join room</b-button>
            </b-navbar-nav>   
        </b-navbar>

        <b-container fluid class="d-flex flex-grow-1 pt-3 pb-3">
            <!--rooms list-->
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Room&nbsp;ID</th>
                        <th>Room&nbsp;owner</th>
                        <th width="99%">Description</th>
                        <th>Participants</th>
                        <th>Join</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-if="rooms == []"><td colspan=8>No active room found for this demo.</td></tr>
                    <tr v-for="(room, index) in rooms">
                        <td class="text-right text-nowrap"><i v-if="room.isPasswordProtected" class="fas fa-lock"></i> {{ index+1 }}.</td>
                        <td>{{ room.sessionid }}</td>
                        <td>{{ room.extra.username }}</td>
                        <td>{{ room.extra.description }}</td>
                        <td>{{ room.participants.length }}</td>  
                        <td>
                            <span v-if="room.isRoomFull" class="text-danger">Room&nbsp;is&nbsp;full</span>
                            <b-button v-else @click="showJoinRoomModal(room.sessionid, room.isPasswordProtected)">Join&nbsp;room</b-button>
                        </td>
                    </tr>
                </tbody>
            </table>
            <!--rooms list end-->
        </b-container>

        <!--create room modal-->
        <b-modal ref="create-room-modal" title="Create a new room">
            <b-form-group label="Room Id" label-for="cr-roomid" :invalid-feedback="errors.createRoom.roomId">
                <b-form-input id="cr-roomid" v-model="room.roomId" :state="!errors.createRoom.roomId ? '' : false" placeholder="Enter room id"></b-form-input>
            </b-form-group>

            <b-form-group label="Username" label-for="cr-username" :invalid-feedback="errors.createRoom.username">
                <b-form-input id="cr-username" v-model="room.username" :state="!errors.createRoom.username ? '' : false" placeholder="Enter your username"></b-form-input>
            </b-form-group>

            <p><b-button variant="link" class="p-0" :class="room.moreOptions ? 'd-none' : ''" @click="room.moreOptions = true">More options</b-button></p>
            
            <b-form-group :class="{ 'd-none' : !room.moreOptions }">
                <b-form-checkbox id="cr-setPassword" v-model="room.setPassword" value="1">Set password</b-form-checkbox>
            </b-form-group>

            <b-form-group label="Password" label-for="cr-password" :invalid-feedback="errors.createRoom.password" :class="{ 'd-none' : !room.setPassword }">
                <b-form-input id="cr-password" v-model="room.password" :state="!errors.createRoom.password ? '' : false" placeholder="Enter room password"></b-form-input>
            </b-form-group>

            <b-form-group label="Description" label-for="cr-description">
                <b-form-textarea id="cr-desctiption" v-model="room.description" placeholder="Enter room description"></b-form-textarea>
            </b-form-group>

            <div slot="modal-footer">
                <b-button class="mr-1" @click="hideCreateRoomModal">Close</b-button>
                <b-button variant="primary" @click="createRoom">Create room</b-button>
            </div>
        </b-modal>
        <!--create room modal end-->
        <!--join room modal-->
        <b-modal ref="join-room-modal" title="Join room">
            <b-form-group label="Room Id" label-for="jr-roomid" :invalid-feedback="errors.joinRoom.roomId">
                <b-form-input id="jr-roomid" v-model="room.roomId" :state="!errors.joinRoom.roomId ? '' : false" placeholder="Enter room id"></b-form-input>
            </b-form-group>

            <b-form-group label="Username" label-for="jr-username" :invalid-feedback="errors.joinRoom.username">
                <b-form-input id="jr-username" v-model="room.username" :state="!errors.joinRoom.username ? '' : false" placeholder="Enter your username"></b-form-input>
            </b-form-group>

            <b-form-group label="Password" label-for="jr-password" :invalid-feedback="errors.joinRoom.password" :class="(room.setPassword ? '' : 'd-none')">
                <b-form-input id="jr-password" v-model="room.password" :state="!errors.joinRoom.password ? '' : false" placeholder="Enter room password"></b-form-input>
            </b-form-group>

            <div slot="modal-footer">
                <b-button class="mr-1" @click="hideJoinRoomModal">Close</b-button>
                <b-button variant="primary" @click="joinRoom">Join room</b-button>
            </div>
        </b-modal>
        <!--join room modal end-->
    </div>
</template>

<script>
import * as io from 'socket.io-client'
window.io = io
import RTCMultiConnection from 'rtcmulticonnection'

export default {
    name: 'dashboard',
    components: {},
    data: function() {
        return {
            //create / join room settings
            room: {
                roomId: '',
                username: '',
                description: '',
                setPassword: false,
                password: '',
                moreOptions: false,
            },
            rooms: [],  //rooms list
            connection: new RTCMultiConnection(),
            loadRoomsListInterval: null,    //rooms list refresh interval function
            //modals error fields
            errors: {
                createRoom: {
                    roomId: '',
                    username: '',
                    password: ''
                },
                joinRoom: {
                    roomId: '',
                    username: '',
                    password: ''
                }
            }
        }
    },
    computed: {
        //rtcMultiConnection config 
        connectionConfig() {
            return this.$store.state.config.connection;
        }
    },
    methods: {
        showCreateRoomModal() {
            this.$refs['create-room-modal'].show()
        },
        hideCreateRoomModal() {
            this.$refs['create-room-modal'].hide();
            //reset fields
            this.room.roomId = '';
            this.room.username = '';
            this.room.password = '';
            this.room.setPassword = false;
            this.room.moreOptions = false;
            this.errors.createRoom = {
                roomId: '',
                username: '',
                password: ''
            }
        },
        showJoinRoomModal(roomId, setPassword = true) {
            if(typeof roomId === 'string') {
                this.room.roomId = roomId;
            }
            this.room.setPassword = setPassword;
            this.$refs['join-room-modal'].show()
        },
        hideJoinRoomModal() {
            this.$refs['join-room-modal'].hide();
            //reset fields
            this.room.roomId = '';
            this.room.username = '';
            this.room.setPassword = false;
            this.room.password = '';
            this.errors.joinRoom = {
                roomId: '',
                username: '',
                password: ''
            }
        },
        loadRoomsList() {
            this.connection.socket.emit('get-public-rooms', this.connectionConfig.publicRoomIdentifier, function(rooms) {
                this.rooms = rooms;
            }.bind(this));
        },
        validateCreateRoom() {
            let errors = {
                roomId: '',
                username: '',
                password: ''
            };
            let hasErrors = false;
            //roomId
            if(this.room.roomId == '') {
                errors.roomId = 'Field required.';
                hasErrors = true;
            }
            else if(this.rooms.find( function(room) {
                return room.sessionid == this.room.roomId;
            }.bind(this) )) {
                errors.roomId = 'Room with this id already exist.';
                hasErrors = true;
            }
            //username
            if(this.room.username == '') {
                errors.username = 'Field required.';
                hasErrors = true;
            }
            //password
            if(this.room.setPassword && this.room.password == '') {
                errors.password = 'Field required.';
                hasErrors = true;
            }

            this.errors.createRoom = errors;
            return !hasErrors;
        },
        createRoom() {
            if(!this.validateCreateRoom()) {
                return;
            }
            
            let room = this.room;
            room.owner = true;
            this.$store.commit('setRoom', room);
            this.$router.push('/room');
        },
        validateJoinRoom() {
            let errors = {
                roomId: '',
                username: '',
                password: ''
            };
            let hasErrors = false;
            //roomId
            if(this.room.roomId == '') {
                errors.roomId = 'Field required.';
                hasErrors = true;
            }
            //username
            if(this.room.username == '') {
                errors.username = 'Field required.';
                hasErrors = true;
            }

            this.errors.joinRoom = errors;
            return !hasErrors;
        },
        joinRoom() {
            if(!this.validateJoinRoom()) {
                return;
            }

            let room = this.room;
            room.owner = false;
            this.$store.commit('setRoom', room);
            this.$router.push('/room');
        }
    },
    mounted() {
        //server connection setup
        this.connection.socketURL = this.connectionConfig.socketURL;
        this.connection.publicRoomIdentifier = this.connectionConfig.publicRoomIdentifier;
        this.connection.socketMessageEvent = this.connectionConfig.publicRoomIdentifier;
        this.connection.autoCloseEntireSession = this.connectionConfig.autoCloseEntireSession;
        //connect to server
        this.connection.connectSocket(function(socket) {
            this.loadRoomsList();
            //room list refresh interval function
            this.loadRoomsListInterval = setInterval(function() {
                this.loadRoomsList();
            }.bind(this), 3000);
        
            socket.on('disconnect', function() {
                console.log('disconnected');
            }.bind(this));
        }.bind(this));
    },
    beforeDestroy() {
        clearInterval(this.loadRoomsListInterval);
    }
}
</script>
