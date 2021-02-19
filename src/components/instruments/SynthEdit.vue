<template>
  <div class="synth-edit-container">
    <b-row>
        <!--name-->
        <b-col cols="6">
            <b-form-group label="Name" label-for="synth-name" :invalid-feedback="errors.name">
                <b-form-input id="synth-name" v-model="value.name" :state="!errors.name ? '' : false" placeholder="Enter instrument name"></b-form-input>
            </b-form-group>
        </b-col>
        <!--length-->
        <b-col>
          <b-form-group label="Duration" label-for="synth-duration" :invalid-feedback="errors.duration">
            <b-input-group append="s" :class="!errors.duration ? '' : 'is-invalid'">
              <b-input-group-prepend is-text>
                <b-form-checkbox switch class="mr-n2" v-model="ignoreDurationCheckbox">
                  <span class="sr-only">Toggle between finite and infinite duration</span>
                </b-form-checkbox>
              </b-input-group-prepend>
              <b-form-input id="synth-duration" type="number" min="0" step="0.01" v-model="value.duration" :state="!errors.duration ? '' : false" :disabled="value.ignoreDuration" placeholder="Enter instrument duration time"></b-form-input>
            </b-input-group>
          </b-form-group>
        </b-col>
        <!--volume-->
        <b-col cols="6">
            <b-form-group :invalid-feedback="errors.volume">
                <label for="synth-volume">Volume: {{ value.volume.gain.value | percentage }}</label>
                <b-form-input id="synth-volume" type="range" min="0" max="1" step="0.01" v-model="value.volume.gain.value" :state="!errors.volume ? '' : false"></b-form-input>
            </b-form-group>
        </b-col>
        <!--portamento-->
        <b-col cols="6">
            <b-form-group :invalid-feedback="errors.portamento">
                <label for="synth-portamento">Portamento: {{ portamento }}s</label>
                <b-form-input id="synth-portamento" type="range" min="0" max="10" step="0.01" v-model="portamento" :state="!errors.portamento ? '' : false"></b-form-input>
            </b-form-group>
        </b-col>
    </b-row>
    <!--envelope-->
    <dropdown-card title="Envelope">
      <envelope-edit v-model="value.audioSrc"></envelope-edit>
    </dropdown-card>
    <!--oscillator-->
    <dropdown-card title="Oscillator">
      <oscillator-edit v-model="value.audioSrc"></oscillator-edit>
    </dropdown-card>
    <!--effects-->
    <dropdown-card title="Effects">
      <effects :effects="value.effects" :input="value.volume" :output="value.output"></effects>
    </dropdown-card>
  </div>
</template>

<script>
import DropdownCard from '@/components/utils/DropdownCard.vue'
import EnvelopeEdit from '@/components/audioComponents/EnvelopeEdit.vue'
import OscillatorEdit from '@/components/audioComponents/OscillatorEdit.vue'
import Effects from '@/components/audioComponents/Effects.vue'

export default {
  name: 'SynthEdit',
  components: {
    DropdownCard,
    EnvelopeEdit,
    OscillatorEdit,
    Effects
  },
  props: {
    value: Object
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
      //portamento
      if(!this.isNumber(this.portamento) || this.portamento < 0) {
        errors.portamento = 'Value must be 0 or higher.';
      }

      return errors;
    },
    portamento: {
      set(value) {
        this.value.audioSrc.set('portamento', value);
      },
      get() {
        return this.value.audioSrc.get('portamento').portamento;
      },
    },
    ignoreDurationCheckbox: {
      set(value) {
        this.value.ignoreDuration = !value;
      },
      get() {
        return !this.value.ignoreDuration;
      },
    },
    synthValues() {
      let voices = this.value.audioSrc.voices;
      if(voices.length == 0)
        return null;

      return voices[0].get();
    }
  },
  methods: {
    isNumber(value) {
      return this.$options.filters.isNumber(value);
    },
    setSynthValue(param, value) {
      let voices = this.value.audioSrc.voices;
      if(voices.length == 0)
        return null;

      for(let voice of voices) {
        voice.set(param, value);
      }
    }
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
