<template>
  <div class="sampler-edit-container">
    <b-row>
        <!--name-->
        <b-col cols="6">
            <b-form-group label="Name" label-for="sampler-name" :invalid-feedback="errors.name">
                <b-form-input id="sampler-name" v-model="value.name" :state="!errors.name ? '' : false" placeholder="Enter instrument name"></b-form-input>
            </b-form-group>
        </b-col>
        <!--length-->
        <b-col>
          <b-form-group label="Duration" label-for="sampler-duration" :invalid-feedback="errors.duration">
            <b-input-group append="s" :class="!errors.duration ? '' : 'is-invalid'">
              <b-input-group-prepend is-text>
                <b-form-checkbox switch class="mr-n2" v-model="ignoreDurationCheckbox">
                  <span class="sr-only">Toggle between finite and infinite duration</span>
                </b-form-checkbox>
              </b-input-group-prepend>
              <b-form-input id="sampler-duration" type="number" min="0" step="0.01" v-model="value.duration" :state="!errors.duration ? '' : false" :disabled="value.ignoreDuration" placeholder="Enter instrument duration time"></b-form-input>
            </b-input-group>
          </b-form-group>
        </b-col>
        <!--volume-->
        <b-col cols="6">
            <b-form-group :invalid-feedback="errors.volume">
                <label for="sampler-volume">Volume: {{ value.volume.gain.value | percentage }}</label>
                <b-form-input id="sampler-volume" type="range" min="0" max="1" step="0.01" v-model="value.volume.gain.value" :state="!errors.volume ? '' : false"></b-form-input>
            </b-form-group>
        </b-col>
    </b-row>
    <!--envelope-->
    <dropdown-card title="Envelope">
      <b-row>
          <!--attack-->
          <b-col cols="6">
              <b-form-group>
                  <label for="sampler-envelope-attack">Attack: {{ envelopeAttack }}s</label>
                  <b-form-input id="sampler-envelope-attack" type="range" min="0" max="10" step="0.01" v-model="envelopeAttack"></b-form-input>
              </b-form-group>
          </b-col>
          <!--release-->
          <b-col cols="6">
            <b-form-group>
                <label for="sampler-envelope-release">Release: {{ envelopeRelease }}s</label>
                <b-form-input id="sampler-envelope-release" type="range" min="0" max="10" step="0.01" v-model="envelopeRelease"></b-form-input>
            </b-form-group>
        </b-col>
          <!--curve-->
          <b-col cols="6">
              <b-form-group label="Curve" label-for="sampler-envelope-curve">
                  <b-form-select id="sampler-envelope-curve" v-model="envelopeCurve" :options="envelopeCurves"></b-form-select>
              </b-form-group>
          </b-col>
      </b-row>
    </dropdown-card>
    <!--samples-->
    <dropdown-card title="Samples">
      <b-row>
        <b-col cols="4">
          <p><strong>Select octave</strong></p>
          <b-form-select v-model="octave">
            <option v-for="i in 11" :value="i-1">{{ i-1 }}</option>
          </b-form-select>
        </b-col>
      </b-row>
      <div class="mt-3 sampler-edit-notes">
        <b-form-group v-for="note in notes">
            <b-input-group :prepend="note.note">
              <b-form-file :ref="'sampler-file-input-' + note.note" accept="audio/wav, audio/mp3, audio/ogg, audio/opus, audio/vorbis" @input="setNote($event, note.note)" :placeholder="note.filename ? note.filename : 'Choose sample file or drop it here...'" drop-placeholder="Drop file here..."></b-form-file>
              <b-input-group-append>
                <b-button :variant="note.filename ? 'primary' : 'secondary'" @click="!note.loading ? playNote(note.note) : false"><i v-if="!note.loading" class="fas fa-play"></i><b-spinner v-else small label="Loading"></b-spinner></b-button>
              </b-input-group-append>
            </b-input-group>
          </b-form-group>
      </div>
    </dropdown-card>
    <!--effects-->
    <dropdown-card title="Effects">
      <effects :effects="value.effects" :input="value.volume" :output="value.output"></effects>
    </dropdown-card>
  </div>
</template>

<script>
import DropdownCard from '@/components/utils/DropdownCard.vue'
import Effects from '@/components/audioComponents/Effects.vue'

export default {
  name: 'SamplerEdit',
  components: {
    DropdownCard,
    Effects
  },
  props: {
    value: Object
  },
  data() {
    return {
      octave: 0,
      envelopeCurves: [
        { value: 'linear', text: 'Linear' },
        { value: 'exponential', text: 'Exponential' }
      ],
      loadingNotes: [],
    }
  },
  computed: {
    errors() {
      let val = this.value;
      let errors = {
        'name': '',
        'duration': '',
        'volume': '',
      };
      //name
      if(val.name === '') {
        errors.name = 'Field cannot be empty.';
      }
      //duration
      if(!this.isNumber(val.duration) || val.duration < 0) {
        errors.duration = 'Value must be higher than 0.';
      }
      //volume
      if(!this.isNumber(val.volume.gain.value) || val.volume.gain.value < 0 || val.volume.gain.value > 1) {
        errors.volume = 'Value between 0 to 1 is required.';
      }

      return errors;
    },
    ignoreDurationCheckbox: {
      set(value) {
        this.value.ignoreDuration = !value;
      },
      get() {
        return !this.value.ignoreDuration;
      },
    },
    envelopeAttack: {
      set(value) {
        this.value.audioSrc.attack = value;
      },
      get() {
        return this.value.audioSrc.attack;
      }
    },
    envelopeRelease: {
      set(value) {
        this.value.audioSrc.release = value;
      },
      get() {
        return this.value.audioSrc.release;
      }
    },
    envelopeCurve: {
      set(value) {
        this.value.audioSrc.curve = value;
      },
      get() {
        return this.value.audioSrc.curve;
      }
    },
    notes() {
      let notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
      let currentNotes = [];
      for(let note of notes) {
        currentNotes.push({
          note: note + this.octave,
          filename: (this.value.filenames[note + this.octave] !== undefined ? this.value.filenames[note + this.octave] : ''),
          loading: (this.loadingNotes.indexOf(note + this.octave) > -1 ? true : false)
        });
      }

      return currentNotes;
    }
  },
  methods: {
    isNumber(value) {
      return this.$options.filters.isNumber(value);
    },
    setNote(event, note) {
      if(event === null) {
        return;
      }

      let filename = event.name;
      let fileUrl = window.URL.createObjectURL(event);

      this.loadingNotes.push(note);
      //add file to note and cleanup
      this.value.audioSrc.add(note, fileUrl, function() {
        this.value.filenames[note] = filename;
        window.URL.revokeObjectURL(fileUrl);  //remove blob reference
        //remove note from loading notes array
        let loadingNoteIndex = this.loadingNotes.indexOf(note);
        if(loadingNoteIndex > -1) {
          this.loadingNotes.splice(loadingNoteIndex, 1);
        }
        //reset file inputs
        let refInputs = this.$refs['sampler-file-input-' + note];
        for(let refInput of refInputs) {
          refInput.reset();
        }
      }.bind(this));
    },
    playNote(note) {
      if(this.value.ignoreDuration) {
        this.value.triggerAttack(note);
      }
      else {
        this.value.triggerAttack(note, this.value.duration);
      }
    }
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .sampler-edit-notes .input-group-prepend .input-group-text {width:60px;}
</style>
