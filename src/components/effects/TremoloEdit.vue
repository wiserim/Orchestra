<template>
  <div class="effect-tremolo-edit-container">
    <b-row>
        <!--name-->
        <b-col cols="6">
            <b-form-group label="Name" label-for="effect-name" :invalid-feedback="errors.name">
                <b-form-input id="effect-name" v-model="value.name" :state="!errors.name ? '' : false" placeholder="Enter effect name"></b-form-input>
            </b-form-group>
        </b-col>
        <!--type-->
        <b-col cols="6">
          <b-form-group label="Type" label-for="effect-tremolo-type">
              <b-form-select id="effect-tremolo-type" v-model="value.effectObj.type" :options="tremoloTypes"></b-form-select>
          </b-form-group>
        </b-col>
        <!--frequency-->
        <b-col cols="6">
          <b-form-group label="Frequency" label-for="effect-tremolo-frequency" :invalid-feedback="errors.frequency">
            <b-input-group append="Hz" :class="!errors.frequency ? '' : 'is-invalid'">
              <b-form-input id="effect-tremolo-frequency" type="number" min="0" v-model="value.effectObj.frequency.value" :state="!errors.frequency ? '' : false" placeholder="Enter frequency"></b-form-input>
            </b-input-group>
          </b-form-group>
        </b-col>
        <!--depths-->
        <b-col cols="6">
            <b-form-group>
                <label for="effect-tremolo-depth">Depth: {{ value.effectObj.depth.value | percentage }}</label>
                <b-form-input id="effect-tremolo-depth" type="range" min="0" max="1" step="0.01" v-model="value.effectObj.depth.value"></b-form-input>
            </b-form-group>
        </b-col>
        <!--spread-->
        <b-col cols="6">
          <b-form-group>
            <label for="effect-tremolo-spread">Stereo spread: {{ value.effectObj.spread | round }}&deg;</label>
            <b-form-input id="effect-tremolo-spread" type="range" min="0" max="180" v-model="value.effectObj.spread"></b-form-input>
          </b-form-group>
        </b-col>
        <!--wet - how strong is effect-->
        <b-col cols="6">
            <b-form-group>
                <label for="effect-tremolo-wet">Effect strength (wettness): {{ value.effectObj.wet.value | percentage }}</label>
                <b-form-input id="effect-tremolo-wet" type="range" min="0" max="1" step="0.01" v-model="value.effectObj.wet.value"></b-form-input>
            </b-form-group>
        </b-col>
    </b-row>
  </div>
</template>

<script>
export default {
  name: 'TremoloEdit',
  props: {
    value: Object
  },
  data() {
    return {
      tremoloTypes: [
        { value: 'sine', text: 'Sine' },
        { value: 'square', text: 'Square' },
        { value: 'sawtooth', text: 'Sawtooth' },
        { value: 'triangle', text: 'Triangle' }
      ]
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
