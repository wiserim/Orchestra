<template>
    <b-tabs nav-class="border-bottom-0 z-index-1" content-class="flex-grow-1 d-flex">
        <b-tab title="Keyboard" active>
            <div class="flex-grow-1 border rounded-bottom rounded-right p-3">
                <keyboard :volume="audio.volume" :instruments="audio.instruments" @keyDown="playNote" @keyUp="endNote"></keyboard>
            </div>
        </b-tab>
        <b-tab title="Instruments">
            <div class="flex-grow-1 border rounded p-3">
                <instruments :instruments="audio.instruments" :output="audio.volume"></instruments>
            </div>
        </b-tab>
        <b-tab title="Inputs">
            <div class="flex-grow-1 border rounded p-3">
                <audio-inputs :audioInputs="audio.inputs" :output="audio.volume"></audio-inputs>
            </div>
        </b-tab>
        <b-tab title="Effects">
            <div class="flex-grow-1 border rounded p-3">
                <effects :effects="audio.effects" :input="audio.volume" :output="audio.output"></effects>
            </div>
        </b-tab>
        <b-tab title="Users streams">
            <div class="flex-grow-1 border rounded p-3">
                <users :users="users"></users>
            </div>
        </b-tab>
        <b-tab title="Recorder">
            <div class="flex-grow-1 border rounded p-3">
                <recorder :input="audio.recorderInput"></recorder>
            </div>
        </b-tab>
        <b-tab title="MIDI">
            <div class="flex-grow-1 border rounded p-3">
                <midi :midiInputs="audio.midi" @keyDown="playNote" @keyUp="endNote"></midi>
            </div>
        </b-tab>
    </b-tabs>
</template>

<script>
import Keyboard from '@/components/Keyboard.vue'
import Instruments from '@/components/Instruments.vue'
import AudioInputs from '@/components/AudioInputs.vue'
import Effects from '@/components/audioComponents/Effects.vue'
import Users from '@/components/Users.vue'
import Recorder from '@/components/Recorder.vue'
import Midi from '@/components/Midi.vue'

export default {
  name: 'AudioEdit',
  components: {
    Keyboard,
    Instruments,
    AudioInputs,
    Effects,
    Users,
    Recorder,
    Midi
  },
  props: {
    stream: Object,
    users: Array
  },
  data: function() {
    return {
        audio: {
            volume: new Tone.Gain(),
            output: new Tone.Gain(),
            recorderInput: Tone.context.createGain(),
            instruments: [],
            inputs: [],
            effects: [],
            midi: []
        }
    }
  },
  methods: {
    //setup audio
    audioSetup() {
        this.audio.output.toMaster();
        this.audio.volume.connect(this.audio.output);
        this.audio.output.connect(this.stream);
        this.audio.output.connect(this.audio.recorderInput);

        //create default instruments

        //https://freepats.zenvoid.org/Piano/acoustic-grand-piano.html
        let baseUrl = './assets/samples/salamander/';
        let samplerSamples = {
            'A0' : baseUrl + 'A0.[mp3|ogg]',
            'C1' : baseUrl + 'C1.[mp3|ogg]',
            'D#1' : baseUrl + 'Ds1.[mp3|ogg]',
            'F#1' : baseUrl + 'Fs1.[mp3|ogg]',
            'A1' : baseUrl + 'A1.[mp3|ogg]',
            'C2' : baseUrl + 'C2.[mp3|ogg]',
            'D#2' : baseUrl + 'Ds2.[mp3|ogg]',
            'F#2' : baseUrl + 'Fs2.[mp3|ogg]',
            'A2' : baseUrl + 'A2.[mp3|ogg]',
            'C3' : baseUrl + 'C3.[mp3|ogg]',
            'D#3' : baseUrl + 'Ds3.[mp3|ogg]',
            'F#3' : baseUrl + 'Fs3.[mp3|ogg]',
            'A3' : baseUrl + 'A3.[mp3|ogg]',
            'C4' : baseUrl + 'C4.[mp3|ogg]',
            'D#4' : baseUrl + 'Ds4.[mp3|ogg]',
            'F#4' : baseUrl + 'Fs4.[mp3|ogg]',
            'A4' : baseUrl + 'A4.[mp3|ogg]',
            'C5' : baseUrl + 'C5.[mp3|ogg]',
            'D#5' : baseUrl + 'Ds5.[mp3|ogg]',
            'F#5' : baseUrl + 'Fs5.[mp3|ogg]',
            'A5' : baseUrl + 'A5.[mp3|ogg]',
            'C6' : baseUrl + 'C6.[mp3|ogg]',
            'D#6' : baseUrl + 'Ds6.[mp3|ogg]',
            'F#6' : baseUrl + 'Fs6.[mp3|ogg]',
            'A6' : baseUrl + 'A6.[mp3|ogg]',
            'C7' : baseUrl + 'C7.[mp3|ogg]',
            'D#7' : baseUrl + 'Ds7.[mp3|ogg]',
            'F#7' : baseUrl + 'Fs7.[mp3|ogg]',
            'A7' : baseUrl + 'A7.[mp3|ogg]',
            'C8' : baseUrl + 'C8.[mp3|ogg]'
        };
        let samplerSamplesFilenames = {};
        for(let note in samplerSamples) {
            samplerSamplesFilenames[note] = 'Salamander Grand Piano - ' + note;
        }

        this.audio.instruments.push(this.$instruments.createSampler({
            name: 'Sampler',
            active: true,
            ignoreDuration: false,
            duration: 3,
            output: this.audio.volume,
            samples: samplerSamples,
            filenames: samplerSamplesFilenames
        }));

        this.audio.instruments.push(this.$instruments.createSynth({
            name: 'Synth',
            duration: 0.75,
            output: this.audio.volume
        }));

        this.audio.instruments.push(this.$instruments.createFMSynth({
            name: 'FM synth',
            duration: 0.75,
            output: this.audio.volume
        }));

        this.audio.instruments.push(this.$instruments.createAMSynth({
            name: 'AM synth',
            duration: 0.75,
            output: this.audio.volume
        }));

        this.audio.instruments.push(this.$instruments.createFatSynth({
            name: 'Fat synth',
            duration: 0.75,
            output: this.audio.volume
        }));

        this.audio.instruments.push(this.$instruments.createFatSynth({
            name: 'Fat synth',
            duration: 0.75,
            output: this.audio.volume
        }));
    },
    closeAudio() {
        
        //removing instruments
        for(let instrument of this.audio.instruments) {
            instrument.destroy();
        }
        this.audio.instruments = [];
        //removing audio inputs
        for(let input of this.audio.inputs) {
            input.destroy();
        }
        this.audio.inputs = [];
        //removing effects
        for(let effect of this.audio.effects) {
            effect.destroy();
        }
        this.audio.effects = [];

        //diconnecting nodes
        this.audio.volume.disconnect();
        this.audio.output.disconnect();
        this.audio.recorderInput.disconnect();
    },
    //play note on keyDown
    playNote(note) {

        for(let instrument of this.audio.instruments) {
            if(instrument.active) {
                if(instrument.ignoreDuration)
                    instrument.triggerAttack(note.note+note.octave);
                else
                    instrument.triggerAttack(note.note+note.octave, instrument.duration);
            }
        }
    },
    //end note on keyUp
    endNote(note) {
        for(let instrument of this.audio.instruments) {
            if(instrument.ignoreDuration)
                instrument.triggerRelease(note.note+note.octave);
        }
    },
  },
  mounted() {
    this.audioSetup();
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
