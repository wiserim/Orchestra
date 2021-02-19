import WebMidi from 'webmidi'

export default {
    install (Vue) {
        Vue.prototype.$midi = {
            createMidiInput: (options = {}) => {
                let midi = {
                    name: (options.name !== undefined ? options.name : ''),
                    input: options.input,
                    noteOn: (options.noteOn !== undefined ? options.noteOn : null),
                    noteOff: (options.noteOff !== undefined ? options.noteOff : null),
                    destroy() {
                        this.input.removeListener();
                        for(let property in this) {
                            delete this[property];
                        }
                    }
                }

                midi.input.addListener('noteon', 'all', function(e) {
                    if(this.noteOn) {
                        this.noteOn(e);
                    }
                }.bind(midi));

                midi.input.addListener('noteoff', 'all', function(e) {
                    if(this.noteOff) {
                        this.noteOff(e);
                    }
                }.bind(midi));

                return midi;
            },
            checkMidiSupport(success, failure) {
                WebMidi.enable(function (err) {
                    if (err) {
                        failure(err);
                    } else {
                        success();
                    }
                });
            },
            getMidiInputs: () => {
                return WebMidi.inputs;
            }
        }
    }
}