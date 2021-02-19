<template>
  <div class="user-edit-container">
    <b-row>
        <!--volume-->
        <b-col cols="6">
            <b-form-group>
                <label for="user-volume">Volume: {{ value.volume.gain.value | percentage }}</label>
                <b-form-input id="user-volume" type="range" min="0" max="1" step="0.01" v-model="value.volume.gain.value"></b-form-input>
            </b-form-group>
        </b-col>
        <!--muted-->
        <b-col cols="6">
            <b-form-group>
                <label>&nbsp;</label>
                <b-form-checkbox switch :checked="value.muted" @input="toggleMute">Mute</b-form-checkbox>
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
  methods: {
    isNumber(value) {
      return this.$options.filters.isNumber(value);
    },
    toggleMute() {
      this.value.toggleMute();
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
