<template>
    <div class="effects-container">
        <b-row>
          <b-col cols="2">
            <b-dropdown variant="primary" text="Add" class="mb-1 d-block">
              <b-dropdown-item v-for="(name, type) in typeNames" @click="add(type)">{{ name }}</b-dropdown-item>
            </b-dropdown>
            <b-nav vertical pills>
              <b-nav-item v-for="(effect, index) in effects" @click="edit(index)" :active="index === effectIndex">{{ effect.name }}</b-nav-item>
            </b-nav>
          </b-col>
          <b-col>
            <div v-if="currentEffect">
              <b-row>
                <b-col>
                  <h3>{{ typeNames[currentEffect.type] }}</h3>
                </b-col>
                <b-col class="text-right">
                  <b-button variant="danger" @click="showRemoveModal"><i class="fas fa-trash-alt"></i> Remove</b-button>
                </b-col>
              </b-row>
              <filter-edit v-if="currentEffect.type == 'filter'" v-model="currentEffect"></filter-edit>
              <panner-edit v-if="currentEffect.type == 'panner'" v-model="currentEffect"></panner-edit>
              <distortion-edit v-if="currentEffect.type == 'distortion'" v-model="currentEffect"></distortion-edit>
              <pitch-shift-edit v-if="currentEffect.type == 'pitchShift'" v-model="currentEffect"></pitch-shift-edit>
              <tremolo-edit v-if="currentEffect.type == 'tremolo'" v-model="currentEffect"></tremolo-edit>
              <vibrato-edit v-if="currentEffect.type == 'vibrato'" v-model="currentEffect"></vibrato-edit>
            </div>
          </b-col>
        </b-row>

        <!--remove effect modal-->
        <b-modal ref="remove-effect" title="Remove effect">
            <p>Are you sure?</p>

            <div slot="modal-footer">
                <b-button variant="danger" class="mr-1" @click="remove(effectIndex)">Remove</b-button>
                <b-button @click="hideRemoveModal">Cancel</b-button>
            </div>
        </b-modal>
        <!--remove effect modal end-->
    </div>
</template>

<script>
import FilterEdit from '@/components/effects/FilterEdit.vue'
import PannerEdit from '@/components/effects/PannerEdit.vue'
import DistortionEdit from '@/components/effects/DistortionEdit.vue'
import PitchShiftEdit from '@/components/effects/PitchShiftEdit.vue'
import TremoloEdit from '@/components/effects/TremoloEdit.vue'
import VibratoEdit from '@/components/effects/VibratoEdit.vue'

export default {
  name: 'Effects',
  components: {
    FilterEdit,
    PannerEdit,
    DistortionEdit,
    PitchShiftEdit,
    TremoloEdit,
    VibratoEdit
  },
  props: {
    effects: Array,
    input: Object,
    output: Object
  },
  data: function() {
    return {
        effectIndex: 0,
        typeNames: {
          filter: 'Filter',
          panner: 'Panner',
          distortion: 'Distortion',
          pitchShift: 'Pitch shift',
          tremolo: 'Tremolo',
          vibrato: 'Vibrato'
        }
    }
  },
  computed: {
    currentEffect() {
      if(this.effects[this.effectIndex])
        return this.effects[this.effectIndex];
      else
        return false;
    }
  },
  methods: {
    add(type) {
      switch(type) {
        case 'filter':
          this.effects.push(this.$effects.createFilter({
            name: this.typeNames[type]
          }));
          break;
        case 'panner':
          this.effects.push(this.$effects.createPanner({
            name: this.typeNames[type]
          }));
          break;
        case 'distortion':
          this.effects.push(this.$effects.createDistortion({
            name: this.typeNames[type]
          }));
          break;
        case 'pitchShift':
          this.effects.push(this.$effects.createPitchShift({
            name: this.typeNames[type]
          }));
          break;
        case 'tremolo':
          this.effects.push(this.$effects.createTremolo({
            name: this.typeNames[type]
          }));
          break;
        case 'vibrato':
          this.effects.push(this.$effects.createVibrato({
            name: this.typeNames[type]
          }));
          break;
      }
      
      this.updateEffectsConnections();
    },
    edit(index) {
      this.effectIndex = index;
    },
    remove(index) {
      this.hideRemoveModal();

      let effect = this.effects.splice(index, 1);
      if(effect.length === 0)
        return;

      effect[0].destroy();

      if(this.effectIndex >= this.effects.length)
        this.effectIndex = (this.effects.length - 1);
      
      this.updateEffectsConnections();
    },
    //update effects connections
    updateEffectsConnections() {
        this.input.disconnect();
        let connectionChain = [];

        for(let effect of this.effects) {
            effect.effectObj.disconnect();
            connectionChain.push(effect.effectObj);
        }
        connectionChain.push(this.output);

        this.input.chain.apply(this.input, connectionChain);
    },
    showRemoveModal() {
      this.$refs['remove-effect'].show()
    },
    hideRemoveModal() {
      this.$refs['remove-effect'].hide();
    }
  },
  mounted() {
    this.updateEffectsConnections();
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
