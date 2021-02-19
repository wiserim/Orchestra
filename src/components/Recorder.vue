<template>
  <div class="user-edit-container">
    <b-button variant="primary" v-if="!recording" @click="startRecording" class="mr-1">Start recording</b-button>
    <b-button variant="primary" v-if="recording" @click="stopRecording" class="mr-1">Stop recording</b-button>
    <b-button variant="danger" v-if="recording" @click="cancelRecording" class="mr-1">Cancel recording</b-button>
    <b-button variant="primary" v-if="!recording && blob" :href="blobUrl" :download="blobFilename">Download</b-button>
    <!--recording player-->
    <player class="my-3" :url="blobUrl" :class="blobUrl ? '' : 'd-none'"></player>
    <!--encoding progress-->
    <div v-if="encodingNow" class="my-3 text-center">
      <b-progress max="1" animated>
        <b-progress-bar :value="encodingProgress" :label="`${((encodingProgress / 1) * 100).toFixed(2)}%`"></b-progress-bar>
      </b-progress>
      <b-button variant="danger mt-3" @click="cancelEncoding">Cancel</b-button>
    </div>
    <!--encoding progress end-->
    <b-row>
      <!--time limit-->
      <b-col cols="6">
        <b-form-group label="Recording time limit" label-for="recorder-time-limit" :invalid-feedback="errors.timeLimit">
          <b-input-group append="s" :class="!errors.timeLimit ? '' : 'is-invalid'">
            <b-form-input id="recorder-time-limit" type="number" min="0" v-model="timeLimit" :disabled="recording" :state="!errors.timeLimit ? '' : false" placeholder="Enter recording time limit"></b-form-input>
          </b-input-group>
        </b-form-group>
      </b-col>
      <!--encode after record-->
      <b-col cols="6">
        <b-form-group label="Encode" label-for="recorder-encode">
          <b-form-select id="recorder-encode" v-model="encodeAfterRecord" :options="encodeAfterOptions" :disabled="recording" :disabled="recording"></b-form-select>
        </b-form-group>
      </b-col>
      <!--encoding-->
      <b-col cols="6">
        <b-form-group label="Encoding" label-for="recorder-encoding">
          <b-form-select id="recorder-encoding" v-model="encoding" :options="encodingOptions" :disabled="recording"></b-form-select>
        </b-form-group>
      </b-col>
      <!--mp3 bit rate-->
      <b-col v-if="encoding === 'mp3'" cols="6">
        <b-form-group label="MP3 bit rate" label-for="recorder-mp3-bit-rate">
          <b-form-select id="recorder-mp3-bit-rate" v-model="mp3BitRate" :options="mp3BitRateOptions" :disabled="recording"></b-form-select>
        </b-form-group>
      </b-col>
      <!--ogg quality-->
      <b-col v-if="encoding === 'ogg'" cols="6">
        <b-form-group>
          <label for="recorder-ogg-quality">Ogg Vorbis quality: {{ oggQuality | percentage }}</label>
          <b-form-input id="recorder-ogg-quality" type="range" min="0" max="1" step="0.01" v-model="oggQuality"></b-form-input>
        </b-form-group>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import Player from '@/components/utils/Player.vue'

export default {
  name: 'Recorder',
  components: {
    Player,
  },
  props: {
    input: Object
  },
  data() {
    return {
      recorder: new WebAudioRecorder(this.input, {
        workerDir: 'js/web-audio-recorder-js/',
        progressInterval: 200
      }),
      recording: false,
      blob: null,
      blobUrl: '',
      blobFilename: '',
      encodingNow: false,
      encodingProgress: 0,
      encodingOptions: [
        { value: 'wav', text: 'Waveform Audio' },
        { value: 'ogg', text: 'Ogg Vorbis' },
        { value: 'mp3', text: 'MP3' }
      ],
      encodeAfterOptions: [
        { value: false, text: 'During recording' },
        { value: true, text: 'After recording' },
      ],
      mp3BitRateOptions: [
        { value: 8, text: '8 kbps' },
        { value: 16, text: '16 kbps' },
        { value: 24, text: '24 kbps' },
        { value: 32, text: '32 kbps' },
        { value: 40, text: '40 kbps' },
        { value: 48, text: '48 kbps' },
        { value: 56, text: '56 kbps' },
        { value: 64, text: '64 kbps' },
        { value: 80, text: '80 kbps' },
        { value: 96, text: '96 kbps' },
        { value: 112, text: '112 kbps' },
        { value: 128, text: '128 kbps' },
        { value: 160, text: '160 kbps' },
        { value: 192, text: '192 kbps' },
        { value: 224, text: '224 kbps' },
        { value: 256, text: '256 kbps' },
        { value: 320, text: '320 kbps' },
      ]
    }
  },
  computed: {
    errors() {
      let errors = {
        'timeLimit': '',
      };

      //time limit
      if(!this.isNumber(this.timeLimit) || this.timeLimit <= 0) {
        errors.timeLimit = 'Value must be higher than 0.';
      }

      return errors;
    },
    //recording encoding
    encoding: {
      get() {
        return this.recorder.encoding;
      },
      set(value) {
        this.recorder.setEncoding(value);
      }
    },
    //recording time limit
    timeLimit: {
      get() {
        return this.recorder.options.timeLimit;
      },
      set(value) {
        this.recorder.setOptions({
          timeLimit: value
        });
      },
    },
    //encoding after or during recording
    encodeAfterRecord: {
      get() {
        return this.recorder.options.encodeAfterRecord;
      },
      set(value) {
        this.recorder.setOptions({
          encodeAfterRecord: (value == true ? true : false)
        });
      }
    },
    //Ogg Vorbis quality (-0.1 - 1)
    oggQuality: {
      get() {
        return this.recorder.options.ogg.quality;
      },
      set(value) {
        this.recorder.setOptions({
          ogg: {
            quality: value
          }
        });
      }
    },
    //MP3 bit rate
    mp3BitRate: {
      get() {
        return this.recorder.options.mp3.bitRate;
      },
      set(value) {
        this.recorder.setOptions({
          mp3: {
            bitRate: value
          }
        });
      }
    },
  },
  methods: {
    isNumber(value) {
      return this.$options.filters.isNumber(value);
    },
    startRecording() {
      this.recording = true;
      this.encodingProgress = 0;
      this.recorder.startRecording();
    },
    stopRecording() {
      this.recorder.finishRecording();
      if(this.encodeAfterRecord) {
        this.encodingNow = true;
      }
    },
    cancelRecording() {
      this.recorder.cancelRecording();
      this.recording = false;
    },
    cancelEncoding() {
      this.recorder.cancelEncoding();
      this.recording = false;
      this.encodingNow = false;
    }
  },
  mounted() {
    //event handlers
    this.recorder.onTimeout = (recorder) => {
      recorder.finishRecording();
    };
    this.recorder.onEncodingProgress = (recorder, progress) => {
      this.encodingProgress = progress;
    };
    this.recorder.onEncodingCanceled = (recorder) => {
      this.recording = false;
    };
    this.recorder.onComplete = (recorder, blob) => {
      this.recording = false;
      this.encodingNow = false;
      this.blob = blob;
      this.blobUrl = URL.createObjectURL(this.blob);
      this.blobFilename = 'recording.' + this.encoding;
    };
    this.recorder.onError = (recorder, message) => {
      console.log('onError', message);
      this.recording = false;
    };
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
