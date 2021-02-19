<template>
  <div class="midi-input-edit-container">
    <b-row>
        <!--name-->
        <b-col cols="6">
            <b-form-group label="Name" label-for="audio-input-name" :invalid-feedback="errors.name">
                <b-form-input id="audio-input-name" v-model="value.name" :state="!errors.name ? '' : false" placeholder="Enter audio input name"></b-form-input>
            </b-form-group>
        </b-col>
    </b-row>
  </div>
</template>

<script>
export default {
  name: 'MidiInputEdit',
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
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
