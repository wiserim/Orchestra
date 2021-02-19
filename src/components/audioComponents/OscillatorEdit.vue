<template>
  <div class="oscillator-edit-container">
    <b-row>
      <!--oscillator type-->
        <b-col cols="6">
            <b-form-group label="Type" label-for="oscillator-base-type">
                <b-form-select id="oscillator-base-type" :value="oscillator.baseType" @input="set('baseType', $event)" :options="baseTypes"></b-form-select>
            </b-form-group>
        </b-col>
        <!--partial counts-->
        <b-col cols="6">
            <b-form-group>
                <label for="oscillator-partial-count">Partial count: {{ oscillator.partialCount }}</label>
                <b-form-input id="oscillator-partial-count" type="range" min="0" max="32" :value="oscillator.partialCount" @input="set('partialCount', $event)"></b-form-input>
            </b-form-group>
        </b-col>
    </b-row>
  </div>
</template>

<script>
export default {
  name: 'OscillatorEdit',
  props: {
    value: Object,
    target: {
      type: String,
      default: 'oscillator'
    },
    sourceType: {
      type: String,
      default: ''
    }
  },
  data: function() {
    return {
      baseTypes: [
        { value: this.sourceType + 'sine', text: 'Sine' },
        { value: this.sourceType + 'square', text: 'Square' },
        { value: this.sourceType + 'sawtooth', text: 'Sawtooth' },
        { value: this.sourceType + 'triangle', text: 'Triangle' }
      ],
    };
  },
  computed: {
    oscillator() {
      let oscillator;
      if(this.target == 'oscillator') {
        oscillator = this.value.get('oscillator').oscillator;
      }
      else {
        let voices = this.value.voices;
        if(voices.length == 0)
          return null;

        oscillator = voices[0].get()[this.target];
      }

      let regex = new RegExp('([0-9]+)|([a-zA-Z]+)','g');
      let matches = oscillator.type.match(regex);
      oscillator.baseType = matches[0];
      oscillator.partialCount = (matches.length > 1 ? matches[1] : 0);
      
      return oscillator;
    }
  },
  methods: {
    isNumber(value) {
      return this.$options.filters.isNumber(value);
    },
    set(param, $event) {
      let value = $event;

      if(param === 'baseType') {
        param = 'type';
        value += (this.oscillator.partialCount > 0 ? this.oscillator.partialCount : '');
      }
      else if(param === 'partialCount') {
        param = 'type';
        value = this.oscillator.baseType + (value > 0 ? value : '');
      }

      if(this.target == 'oscillator') {
        this.value.set('oscillator.' + param, value)
      }
      else {
        let voices = this.value.voices;
        if(voices.length == 0)
          return null;

        for(let voice of voices) {
          voice.set(this.target + '.' + param, value);
        }
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
