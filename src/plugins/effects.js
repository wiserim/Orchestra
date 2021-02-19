export default {
    install (Vue) {
        // Add $plugin instance method directly to Vue components
        Vue.prototype.$effects = {
            createFilter: (options = {}) => {
                options.type = 'filter';
                options.effectObj = new Tone.Filter();
                
                let effect = createEffect(options);
                return effect;
            },
            createPanner: (options = {}) => {
                options.type = 'panner';
                options.effectObj = new Tone.Panner();
                
                let effect = createEffect(options);
                return effect;
            },
            createDistortion: (options = {}) => {
                options.type = 'distortion';
                options.effectObj = new Tone.Distortion();
                
                let effect = createEffect(options);
                return effect;
            },
            createPitchShift: (options = {}) => {
                options.type = 'pitchShift';
                options.effectObj = new Tone.PitchShift();
                
                let effect = createEffect(options);
                return effect;
            },
            createTremolo: (options = {}) => {
                options.type = 'tremolo';
                options.effectObj = new Tone.Tremolo().start();
                
                let effect = createEffect(options);
                return effect;
            },
            createVibrato: (options = {}) => {
                options.type = 'vibrato';
                options.effectObj = new Tone.Vibrato();
                
                let effect = createEffect(options);
                return effect;
            }
        }
    }
}

const createEffect = (options = {}) => {
    let effect = {
        name: (options.name !== undefined ? options.name : ''),
        type: (options.type !== undefined ? options.type : ''),
        effectObj: (options.effectObj !== undefined ? options.effectObj : null),
        destroy() {
            this.effectObj.disconnect();
            for(let property in this) {
                delete this[property];
            }
        }
    };

    if(options.input) {
        options.input.connect(effect.effectObj);
    }

    if(options.output) {
        effect.effectObj.connect(options.output);
    }

    return effect;
}
