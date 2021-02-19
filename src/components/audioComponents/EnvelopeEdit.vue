<template>
  <div class="envelope-edit-container">
    <!--attack-->
    <b-row>
        <b-col cols="6">
            <b-form-group>
                <label for="envelope-attack">Attack: {{ envelope.attack }}s</label>
                <b-form-input id="envelope-attack" type="range" min="0" max="10" step="0.01" :value="envelope.attack" @input="set('attack', $event)"></b-form-input>
            </b-form-group>
        </b-col>
        <b-col cols="6">
            <b-form-group label="Attack curve" label-for="envelope-attack-curve">
                <b-form-select id="envelope-attack-curve" :value="envelope.attackCurve" @input="set('attackCurve', $event)" :options="attackCurves"></b-form-select>
            </b-form-group>
        </b-col>
    </b-row>
    <!--decay-->
    <b-row>
        <b-col cols="6">
            <b-form-group>
                <label for="envelope-decay">Decay: {{ envelope.decay }}s</label>
                <b-form-input id="envelope-decay" type="range" min="0" max="10" step="0.01" :value="envelope.decay" @input="set('decay', $event)"></b-form-input>
            </b-form-group>
        </b-col>
        <b-col cols="6">
            <b-form-group label="Decay curve" label-for="envelope-decay-curve">
                <b-form-select :value="envelope.decayCurve" @input="set('decayCurve', $event)" :options="decayCurves"></b-form-select>
            </b-form-group>
        </b-col>
    </b-row>
    <!--sustain-->
    <b-row>
        <b-col cols="6">
            <b-form-group>
                <label for="envelope-sustain">Sustain: {{ envelope.sustain | percentage }}</label>
                <b-form-input id="envelope-sustain" type="range" min="0.01" max="1" step="0.01" :value="envelope.sustain" @input="set('sustain', $event)"></b-form-input>
            </b-form-group>
        </b-col>
    </b-row>
    <!--release-->
    <b-row>
        <b-col cols="6">
            <b-form-group>
                <label for="envelope-release">Release: {{ envelope.release }}s</label>
                <b-form-input id="envelope-release" type="range" min="0" max="10" step="0.01" :value="envelope.release" @input="set('release', $event)"></b-form-input>
            </b-form-group>
        </b-col>
        <b-col cols="6">
            <b-form-group label="Release curve" label-for="envelope-release-curve">
                <b-form-select :value="envelope.releaseCurve" @input="set('releaseCurve', $event)" :options="releaseCurves"></b-form-select>
            </b-form-group>
        </b-col>
    </b-row>
  </div>
</template>

<script>
export default {
  name: 'EnvelopeEdit',
  props: {
    value: Object,
    target: {
      type: String,
      default: 'envelope'
    }
  },
  data: function() {
    return {
      attackCurves: [
        { value: 'linear', text: 'Linear' },
        { value: 'exponential', text: 'Exponential' },
        { value: 'bounce', text: 'Bounce' },
        { value: 'ripple', text: 'Ripple' },
        { value: 'step', text: 'Step' },
        { value: 'cosine', text: 'Cosine' },        
        { value: 'sine', text: 'Sine' },
      ],
      decayCurves: [
        { value: 'linear', text: 'Linear' },
        { value: 'exponential', text: 'Exponential' }
      ],
      releaseCurves: [
        { value: 'linear', text: 'Linear' },
        { value: 'exponential', text: 'Exponential' },
        { value: 'bounce', text: 'Bounce' },
        { value: 'ripple', text: 'Ripple' },
        { value: 'step', text: 'Step' },
        { value: 'cosine', text: 'Cosine' },        
        { value: 'sine', text: 'Sine' },
      ],
    };
  },
  computed: {
    envelope() {
        if(this.target == 'envelope') {
            return this.value.get('envelope').envelope;
        }
        else {
            let voices = this.value.voices;
            if(voices.length == 0)
                return null;

            return voices[0].get()[this.target];
        }
    }
  },
  methods: {
    isNumber(value) {
      return this.$options.filters.isNumber(value);
    },
    set(param, value) {
        if(this.target == 'envelope') {
            this.value.set('envelope.'+param, value);
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
