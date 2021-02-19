export default {
    install (Vue) {
        // Add $plugin instance method directly to Vue components
        Vue.prototype.$instruments = {
            createSampler: (options = {}) => {
                options.type = 'sampler';

                let samplerOptions = {};
                if(options.baseUrl) {
                    samplerOptions.baseUrl = options.baseUrl;
                }

                if(options.samples) {
                    options.audioSrc = new Tone.Sampler(options.samples, samplerOptions);
                }
                else {
                    options.audioSrc = new Tone.Sampler({});
                }
                
                let instrument = createInstrument(options, samplerOptions);

                if(options.filenames) {
                    instrument.filenames = options.filenames;
                }
                else {
                    instrument.filenames = {};
                }

                //overriding default trigger methods
                instrument.triggerAttack = function(note, duration) {
                    if(this.audioSrc === undefined || Object.keys(this.audioSrc._buffers._buffers).length === 0) {
                        return;
                    }

                    if(duration === undefined) {
                        this.audioSrc.triggerAttack(note);
                    }
                    else {
                        this.audioSrc.triggerAttackRelease(note, duration);
                    }
                };
                instrument.triggerRelease = function(note) {
                    if(this.audioSrc === undefined || Object.keys(this.audioSrc._buffers._buffers).length === 0) {
                        return;
                    }
                    this.audioSrc.triggerRelease(note);
                };

                return instrument;
            },

            createSynth: (options = {}) => {
                options.type = 'synth';
                options.audioSrc = new Tone.PolySynth(8);
                
                let instrument = createInstrument(options);
                return instrument;
            },

            createFMSynth: (options = {}) => {
                options.type = 'fmSynth';
                options.audioSrc = new Tone.PolySynth(8, Tone.FMSynth);
                
                let instrument = createInstrument(options);
                return instrument;
            },

            createAMSynth: (options = {}) => {
                options.type = 'amSynth';
                options.audioSrc = new Tone.PolySynth(8, Tone.AMSynth);
                
                let instrument = createInstrument(options);
                return instrument;
            },

            createFatSynth: (options = {}) => {
                options.type = 'fatSynth';
                options.audioSrc = new Tone.PolySynth(8, Tone.Synth, {
                    oscillator: {
                        type: 'fatsawtooth'
                    }
                });
                
                let instrument = createInstrument(options);
                return instrument;
            }
        }
    }
}

const createInstrument = (options = {}) => {
    let instrument = {
        name: (options.name !== undefined ? options.name : ''),
        type: (options.type !== undefined ? options.type : ''),
        active: (options.active !== undefined ? options.active : false),
        ignoreDuration: (options.ignoreDuration !== undefined ? options.ignoreDuration : (options.duration !== undefined && options.duration > 0 ? false : true)),
        duration: (options.duration !== undefined ? options.duration : 0),
        audioSrc: (options.audioSrc !== undefined ? options.audioSrc : null),
        volume: new Tone.Gain(),
        output: new Tone.Gain(),
        effects: [],
        triggerAttack(note, duration) {
            if(this.audioSrc === undefined) {
                return;
            }

            if(duration === undefined) {
                this.audioSrc.triggerAttack(note);
            }
            else {
                this.audioSrc.triggerAttackRelease(note, duration);
            }
        },
        triggerRelease(note) {
            if(this.audioSrc === undefined) {
                return;
            }
            this.audioSrc.triggerRelease(note);
        },
        destroy() {
            this.audioSrc.disconnect();
            this.volume.disconnect();
            this.output.disconnect();
            for(let effect of this.effects) {
                effect.destroy();
            }
            for(let property in this) {
                delete this[property];
            }
        }
    };  

    if(instrument.audioSrc) {
        instrument.audioSrc.connect(instrument.volume);
    }

    instrument.volume.connect(instrument.output);

    if(options.output) {
        instrument.output.connect(options.output)
    }

    return instrument;
}
