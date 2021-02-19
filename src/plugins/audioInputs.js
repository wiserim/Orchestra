export default {
    install (Vue) {
        Vue.prototype.$audioInputs = {
            createAudioInput: (options = {}) => {
                let audioInput = {
                    name: (options.name !== undefined ? options.name : ''),
                    active: (options.active !== undefined ? options.active : false),
                    audioSrc: new Tone.UserMedia(),
                    volume: new Tone.Gain(),
                    output: new Tone.Gain(),
                    effects: [],
                    open(deviceId, callback) {
                        this.audioSrc.open(deviceId).then(callback);
                    },
                    destroy() {
                        this.audioSrc.disconnect();
                        this.volume.disconnect();
                        this.output.disconnect();
                        this.audioSrc.close();
                        for(let effect of this.effects) {
                            effect.destroy();
                        }
                        for(let property in this) {
                            delete this[property];
                        }
                    }
                };

                audioInput.audioSrc.connect(audioInput.volume);
                audioInput.volume.connect(audioInput.output);

                if(options.output) {
                    audioInput.output.connect(options.output)
                }

                return audioInput;
            },

            getAudioInputs: (callback) => {
                Tone.UserMedia.enumerateDevices().then(callback);
            }
        }
    }
}
