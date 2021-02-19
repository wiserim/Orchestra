<template>
    <div class="instruments-container">
        <b-row>
          <b-col cols="2">
            <b-dropdown variant="primary" text="Add" class="mb-1 d-block">
              <b-dropdown-item v-for="(name, type) in typeNames" @click="add(type)">{{ name }}</b-dropdown-item>
            </b-dropdown>
            <b-nav vertical pills>
              <b-nav-item v-for="(instrument, index) in instruments" @click="edit(index)" :active="index === instrumentIndex">{{ instrument.name }}</b-nav-item>
            </b-nav>
          </b-col>
          <b-col>
            <div v-if="currentInstrument">
              <b-row>
                <b-col>
                  <h3>{{ typeNames[currentInstrument.type] }}</h3>
                </b-col>
                <b-col class="text-right">
                  <b-button variant="danger" @click="showRemoveModal"><i class="fas fa-trash-alt"></i> Remove</b-button>
                </b-col>
              </b-row>
              <sampler-edit v-if="currentInstrument.type == 'sampler'" v-model="currentInstrument"></sampler-edit>
              <synth-edit v-if="currentInstrument.type == 'synth'" v-model="currentInstrument"></synth-edit>
              <fm-synth-edit v-if="currentInstrument.type == 'fmSynth'" v-model="currentInstrument"></fm-synth-edit>
              <am-synth-edit v-if="currentInstrument.type == 'amSynth'" v-model="currentInstrument"></am-synth-edit>
              <fat-synth-edit v-if="currentInstrument.type == 'fatSynth'" v-model="currentInstrument"></fat-synth-edit>
            </div>
          </b-col>
        </b-row>

        <!--remove instrument modal-->
        <b-modal ref="remove-instrument" title="Remove instrument">
            <p>Are you sure?</p>

            <div slot="modal-footer">
                <b-button variant="danger" class="mr-1" @click="remove(instrumentIndex)">Remove</b-button>
                <b-button @click="hideRemoveModal">Cancel</b-button>
            </div>
        </b-modal>
        <!--remove instrument modal end-->
    </div>
</template>

<script>
import SamplerEdit from '@/components/instruments/SamplerEdit.vue'
import SynthEdit from '@/components/instruments/SynthEdit.vue'
import FmSynthEdit from '@/components/instruments/FmSynthEdit.vue'
import AmSynthEdit from '@/components/instruments/AmSynthEdit.vue'
import FatSynthEdit from '@/components/instruments/FatSynthEdit.vue'

export default {
  name: 'Instruments',
  components: {
    SamplerEdit,
    SynthEdit,
    FmSynthEdit,
    AmSynthEdit,
    FatSynthEdit
  },
  props: {
    instruments: Array,
    output: Object
  },
  data: function() {
    return {
        instrumentIndex: 0,
        typeNames: {
          sampler: 'Sampler',
          synth: 'Synth',
          fmSynth: 'FM synth',
          amSynth: 'AM synth',
          fatSynth: 'Fat synth'
        }
    }
  },
  computed: {
    currentInstrument() {
      if(this.instruments[this.instrumentIndex])
        return this.instruments[this.instrumentIndex];
      else
        return false;
    }
  },
  methods: {
    add(type) {
      switch(type) {
        case 'sampler':
          this.instruments.push(this.$instruments.createSampler({
            name: this.typeNames[type],
            duration: 0.75,
            output: this.output
          }));
          break;
        case 'synth':
          this.instruments.push(this.$instruments.createSynth({
            name: this.typeNames[type],
            duration: 0.75,
            output: this.output
          }));
          break;
        case 'fmSynth':
          this.instruments.push(this.$instruments.createFMSynth({
            name: this.typeNames[type],
            duration: 0.75,
            output: this.output
          }));
          break;
        case 'amSynth':
          this.instruments.push(this.$instruments.createAMSynth({
            name: this.typeNames[type],
            duration: 0.75,
            output: this.output
          }));
          break;
        case 'fatSynth':
          this.instruments.push(this.$instruments.createFatSynth({
            name: this.typeNames[type],
            duration: 0.75,
            output: this.output
          }));
          break;
        default:
          this.instruments.push(this.$instruments.createSynth({
            name: this.typeNames[type],
            duration: 0.75,
            output: this.output
          }));
      }
    },
    edit(index) {
      this.instrumentIndex = index;
    },
    remove(index) {
      this.hideRemoveModal();

      let instrument = this.instruments.splice(index, 1);
      if(instrument.length === 0)
        return;

      instrument[0].destroy();

      if(this.instrumentIndex >= this.instruments.length)
        this.instrumentIndex = (this.instruments.length - 1);
    },
    showRemoveModal() {
      this.$refs['remove-instrument'].show()
    },
    hideRemoveModal() {
      this.$refs['remove-instrument'].hide();
    }

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
