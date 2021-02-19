<template>
  <div class="effect-panner-edit-container">
    <b-row>
        <!--name-->
        <b-col cols="6">
            <b-form-group label="Name" label-for="effect-name" :invalid-feedback="errors.name">
                <b-form-input id="effect-name" v-model="value.name" :state="!errors.name ? '' : false" placeholder="Enter effect name"></b-form-input>
            </b-form-group>
        </b-col>
        <!--pan l/R-->
        <b-col cols="6">
          <b-form-group :label="'Pan L/R ' + pan" label-for="effect-panner-pan">
            <b-input-group prepend="Left" append="Right">
              <b-form-input id="effect-panner-pan" type="range" min="-1" max="1" step="0.01" :value="value.effectObj.pan.value" @input="setPan($event)"></b-form-input>
            </b-input-group>
          </b-form-group>
        </b-col>
    </b-row>
  </div>
</template>

<script>
export default {
  name: 'PannerEdit',
  props: {
    value: Object
  },
  data() {
    return {
      pan: this.$options.filters.percentage(this.value.effectObj.pan.value)
    }
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
    },  
  },
  methods: {
    isNumber(value) {
      return this.$options.filters.isNumber(value);
    },
    setPan(value) {
      this.value.effectObj.pan.value = value;
      this.pan = this.$options.filters.percentage(this.value.effectObj.pan.value);
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
