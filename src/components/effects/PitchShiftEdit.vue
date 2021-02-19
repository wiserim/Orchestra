<template>
  <div class="effect-pitch-shift-edit-container">
    <b-row>
        <!--name-->
        <b-col cols="6">
            <b-form-group label="Name" label-for="effect-name" :invalid-feedback="errors.name">
                <b-form-input id="effect-name" v-model="value.name" :state="!errors.name ? '' : false" placeholder="Enter effect name"></b-form-input>
            </b-form-group>
        </b-col>
        <!--pitch in semi tones-->
        <b-col cols="6">
          <b-form-group label="Pitch change" label-for="effect-picth-shift-pitch" :invalid-feedback="errors.pitch">
            <b-input-group append="Semi-tones" :class="!errors.pitch ? '' : 'is-invalid'">
              <b-form-input id="effect-picth-shift-pitch" type="number" v-model="value.effectObj.pitch" :state="!errors.pitch ? '' : false" placeholder="Enter pitch change"></b-form-input>
            </b-input-group>
          </b-form-group>
        </b-col>
        <!--wet - how strong is effect-->
        <b-col cols="6">
            <b-form-group>
                <label for="effect-pitch-shift-wet">Effect strength (wettness): {{ value.effectObj.wet.value | percentage }}</label>
                <b-form-input id="effect-pitch-shift-wet" type="range" min="0" max="1" step="0.01" v-model="value.effectObj.wet.value"></b-form-input>
            </b-form-group>
        </b-col>
    </b-row>
  </div>
</template>

<script>
export default {
  name: 'PitchShiftEdit',
  props: {
    value: Object
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
      //pitch
      if(!this.isNumber(val.effectObj.pitch)) {
        errors.pitch = 'Value must be a number.';
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
