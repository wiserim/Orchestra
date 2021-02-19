<template>
  <div class="effect-distortion-edit-container">
    <b-row>
        <!--name-->
        <b-col cols="6">
            <b-form-group label="Name" label-for="effect-name" :invalid-feedback="errors.name">
                <b-form-input id="effect-name" v-model="value.name" :state="!errors.name ? '' : false" placeholder="Enter effect name"></b-form-input>
            </b-form-group>
        </b-col>
        <!--oversample-->
        <b-col cols="6">
          <b-form-group label="Oversample" label-for="effect-distortion-oversample">
              <b-form-select id="effect-distoriotn-oversample" v-model="value.effectObj.oversample" :options="distortionOversamples"></b-form-select>
          </b-form-group>
        </b-col>
        <!--distortion-->
        <b-col cols="6">
            <b-form-group>
                <label for="effect-distoriotn-distortion">Distortion level: {{ value.effectObj.distortion }}</label>
                <b-form-input id="effect-distoriotn-distortion" type="range" min="0" max="1" step="0.01" v-model="value.effectObj.distortion"></b-form-input>
            </b-form-group>
        </b-col>
        <!--wet - how strong is effect-->
        <b-col cols="6">
            <b-form-group>
                <label for="effect-distortion-wet">Effect strength (wettness): {{ value.effectObj.wet.value | percentage }}</label>
                <b-form-input id="effect-distortion-wet" type="range" min="0" max="1" step="0.01" v-model="value.effectObj.wet.value"></b-form-input>
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
      distortionOversamples: [
        {value: 'none', text: 'None'},
        {value: '2x', text: '2x'},
        {value: '4x', text: '4x'}
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
