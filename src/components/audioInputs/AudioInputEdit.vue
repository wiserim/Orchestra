<template>
  <div class="audio-input-edit-container">
    <b-row>
        <!--name-->
        <b-col cols="6">
            <b-form-group label="Name" label-for="audio-input-name" :invalid-feedback="errors.name">
                <b-form-input id="audio-input-name" v-model="value.name" :state="!errors.name ? '' : false" placeholder="Enter audio input name"></b-form-input>
            </b-form-group>
        </b-col>
        <!--volume-->
        <b-col cols="6">
            <b-form-group :invalid-feedback="errors.volume">
                <label for="audio-input-volume">Volume: {{ value.volume.gain.value | percentage }}</label>
                <b-form-input id="audio-input-volume" type="range" min="0" max="1" step="0.01" v-model="value.volume.gain.value" :state="!errors.volume ? '' : false"></b-form-input>
            </b-form-group>
        </b-col>
    </b-row>
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
  name: 'AudioInputEdit',
  components: {
    DropdownCard,
    Effects
  },
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

      return errors;
    }
  },
  methods: {
    isNumber(value) {
      return this.$options.filters.isNumber(value);
    }
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
