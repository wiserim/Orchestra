export default {
    install (Vue) {
        Vue.prototype.$users = {
            createUser: (options = {}) => {
                let user = {
                    id: (options.id !== undefined ? options.id : ''),
                    username: (options.name !== undefined ? options.name : ''),
                    stream: null,
                    audioSrc: null,
                    mediaElement: null,
                    volume: new Tone.Gain(),
                    output: new Tone.Gain(),
                    effects: [],
                    muted: false,
                    updateStream(stream) {
                        this.stream = stream;
                        //create stream media element (webkit bug workaround)
                        this.mediaElement = new Audio();
                        this.mediaElement.muted = true;
                        this.mediaElement.srcObject = stream;
                        this.audioSrc = Tone.context.createMediaStreamSource(stream);
                        Tone.connect(this.audioSrc, this.volume);
                    },
                    toggleMute() {
                        if(this.muted) {
                            this.output.gain.value = 1;
                            this.muted = false;
                        }
                        else {
                            this.output.gain.value = 0;
                            this.muted = true;
                        }
                    },
                    destroy() {
                        if(this.stream) {
                            this.audioSrc.disconnect();
                        }
                        this.volume.disconnect();
                        this.output.disconnect();
                        for(let effect of this.effects) {
                            effect.destroy();
                        }
                        for(let property in this) {
                            delete this[property];
                        }

                        for(let property in this) {
                            delete this[property];
                        }
                    }
                };

                user.volume.connect(user.output);
                //if stream available connect stream 
                if(options.stream) {
                    user.stream = options.stream;
                    //create stream media element (webkit bug workaround)
                    user.mediaElement = new Audio();
                    user.mediaElement.muted = true;
                    user.mediaElement.srcObject = options.stream;
                    user.audioSrc = Tone.context.createMediaStreamSource(options.stream);
                }

                if(user.stream) {
                    Tone.connect(user.audioSrc, user.volume);
                }

                if(options.output) {
                    user.output.connect(options.output)
                }
                if(options.toMaster) {
                    user.output.toMaster();
                }

                return user;
            }
        }
    }
}
