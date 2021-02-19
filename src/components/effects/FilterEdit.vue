<template>
  <div class="effect-filter-edit-container">
    <b-row>
        <!--name-->
        <b-col cols="6">
            <b-form-group label="Name" label-for="effect-name" :invalid-feedback="errors.name">
                <b-form-input id="effect-name" v-model="value.name" :state="!errors.name ? '' : false" placeholder="Enter effect name"></b-form-input>
            </b-form-group>
        </b-col>
        <!--type-->
        <b-col cols="6">
          <b-form-group label="Type" label-for="effect-filter-type">
              <b-form-select id="effect-filter-type" v-model="value.effectObj.type" :options="filterTypes"></b-form-select>
          </b-form-group>
        </b-col>
        <!--frequency - filter's cutoff frequency-->
        <b-col cols="6">
          <b-form-group label="Cutoff frequency" label-for="effect-filter-frequency" :invalid-feedback="errors.frequency">
            <b-input-group append="Hz" :class="!errors.frequency ? '' : 'is-invalid'">
              <b-form-input id="effect-filter-frequency" type="number" min="0" v-model="value.effectObj.frequency.value" :state="!errors.frequency ? '' : false" placeholder="Enter cutoff frequency"></b-form-input>
            </b-input-group>
          </b-form-group>
        </b-col>
        <!--Q - filter quality-->
        <b-col cols="6">
            <b-form-group>
                <label for="efect-filter-q">Q: {{ value.effectObj.Q.value }}</label>
                <b-form-input id="oscillator-partial-count" type="range" min="0" max="10" step="0.1" v-model="value.effectObj.Q.value"></b-form-input>
            </b-form-group>
        </b-col>
        <!--rolloff - drop in db/octave-->
        <b-col cols="6">
          <b-form-group label="Rolloff" label-for="effect-filter-rolloff">
              <b-form-select id="effect-filter-rolloff" v-model="value.effectObj.rolloff" :options="filterRolloffs"></b-form-select>
          </b-form-group>
        </b-col>
    </b-row>
  </div>
</template>

<script>
export default {
  name: 'FilterEdit',
  props: {
    value: Object
  },
  data() {
    return {
      filterTypes: [
        {value: 'lowpass', text: 'Lowpass'},
        {value: 'highpass', text: 'Highpass'},
        {value: 'bandpass', text: 'Bandpass'},
        {value: 'lowshelf', text: 'Lowshelf'},
        {value: 'highshelf', text: 'Highshelf'},
        {value: 'notch', text: 'Notch'},
        {value: 'allpass', text: 'Allpass'},
        {value: 'peaking', text: 'Peaking'}
      ],
      filterRolloffs: [-12, -24, -48, -96]
    };
  },
  computed: {
    errors() {
      let val = this.value;
      let errors = {
        'name': ''
      };
      //name
      if(val.name === '') {
        errors.name = 'Field cannot be empty.';
      }
      //frequency
      if(!this.isNumber(val.effectObj.frequency.value) || val.effectObj.frequency.value < 0) {
        errors.frequency = 'Value must be equal or higher than 0.';
      }

      return errors;
    }    
  },
  methods: {
    isNumber(value) {
      return this.$options.filters.isNumber(value);
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
