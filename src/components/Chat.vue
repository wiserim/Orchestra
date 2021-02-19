<template>
    <div class="chat-container">
        <div class="chat">
            <div class="chat-messages-container border rounded">
                <div class="chat-messages" ref="chat-messages">
                    <div class="chat-message p-2" v-for="message in messages">
                        <strong>{{ message.username }}</strong> - {{ message.date }}<br/>{{ message.message }}
                    </div>
                </div>
            </div>
            <div class="chat-input pt-3 pb-3">
                <div class="form-group">
                    <b-form-textarea v-model="message" @keyup.enter="sendMessage" placeholder="Enter message"></b-form-textarea>
                </div>
                <b-button variant="primary" @click="sendMessage">Send</b-button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
  name: 'Chat',
  props: {
    connection: Object,
  },
  data: function() {
    return {
        messages: [],
        message: '',
        chatBoxScrollBottom: true
    }
  },
  computed: {
    userId() {
        return this.connection.userid;
    },
    username() {
        return this.connection.extra.username;
    },
    events() {
        return this.$store.state.events;
    }
  },
  methods: {
      sendMessage() {
        let msg = {
            userId: this.userId,
            timestamp: new Date().getTime(),
            username: this.username,
            message: this.message
        };

        this.chatBoxScrollBottom = true;

        this.connection.send({
            userId: this.connection.userid,
            type: 'chatMessage',
            data: msg
        });

        msg.date = this.formatTime(msg.timestamp);
        this.messages.push(msg);

        this.message = '';
      },

      receiveMessage(event) {
        if(event.data.type !== 'chatMessage') {
            return;
        }
        let msg = event.data.data;
        msg.date = this.formatTime(msg.timestamp);
        this.messages.push(msg);        
      },

      formatTime(timestamp) {
          let date = new Date(timestamp);
          return date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2) + ' ' + ('0' + date.getHours()).slice(-2) + ':' + ('0' + date.getMinutes()).slice(-2) + ':' + ('0' + date.getSeconds()).slice(-2);
      }
  },
  mounted: function() {
    //on receiving a message
    this.$store.commit('addListener', {
        event: 'message',
        listener: function(event){this.receiveMessage(event)}.bind(this)
    });

    //chat box scroll check
    let chatMessages = this.$refs['chat-messages'];
    chatMessages.addEventListener('scroll', function(e){
        let element = e.target;
        if(Math.floor(element.scrollHeight - element.scrollTop) <= element.clientHeight) {
            this.chatBoxScrollBottom = true;
        }
        else {
            this.chatBoxScrollBottom = false;
        }
    }.bind(this));
  },
  updated: function() {

    if(this.chatBoxScrollBottom) {
        let chatMessages = this.$refs['chat-messages'];
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .chat-container {display:flex;}
    .chat {display:flex; flex-direction:column; flex-grow:1; max-width:100%;}
    .chat-messages-container {min-height: 150px; flex-grow: 1; position:relative;}
    .chat-messages {position:absolute; top:0; bottom:0; left:0; right:0; overflow:auto;}
    .chat-message {border-bottom: 1px solid rgb(206, 212, 218);}
    .chat-message:last-of-type {border-bottom:none;}
    .chat-input {}
</style>
