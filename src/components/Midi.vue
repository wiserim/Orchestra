<template>
    <div class="midi-container">
        <div v-if="midiSupported === 'checking'" class="my-3 text-center">
          <b-spinner variant="primary" label="Checking MIDI support" class="mb-3"></b-spinner>
          <p>Checking MIDI support...</p>
        </div>

        <b-row v-if="midiSupported === true">
          <b-col cols="2">
            <b-dropdown variant="primary" text="Add" class="mb-1 d-block" @show="refreshAvailableMidiInputs">
              <b-dropdown-item v-if="availableMidiInputs.loaded" v-for="device in availableMidiInputs.devices" @click="add(device)">{{ device.name ? device.name : 'Unnamed device' }}</b-dropdown-item>
              <div v-if="!availableMidiInputs.loaded" class="text-center">
                <b-spinner small variant="primary" label="Loading"></b-spinner>
              </div>
            </b-dropdown>
            <b-nav vertical pills>
              <b-nav-item v-for="(midiInput, index) in midiInputs" @click="edit(index)" :active="index === midiInputIndex">{{ midiInput.name }}</b-nav-item>
            </b-nav>
          </b-col>
          <b-col>
            <div v-if="currentMidiInput">
              <b-row>
                <b-col>
                  <h3>MIDI input</h3>
                </b-col>
                <b-col class="text-right">
                  <b-button variant="danger" @click="showRemoveModal"><i class="fas fa-trash-alt"></i> Remove</b-button>
                </b-col>
              </b-row>
              <midi-input-edit v-model="currentMidiInput"></midi-input-edit>
            </div>
          </b-col>
        </b-row>

        <div v-if="midiSupported === false" class="my-3">
          <b-alert variant="danger" show>Your browser does not support Web MIDI API.</b-alert>
        </div>

        <!--remove midi input modal-->
        <b-modal ref="remove-midi-input" title="Remove MIDI input">
            <p>Are you sure?</p>

            <div slot="modal-footer">
                <b-button variant="danger" class="mr-1" @click="remove(midiInputIndex)">Remove</b-button>
                <b-button @click="hideRemoveModal">Cancel</b-button>
            </div>
        </b-modal>
        <!--remove midi input modal end-->
    </div>
</template>

<script>
import MidiInputEdit from '@/components/midi/MidiInputEdit.vue'

export default {
  name: 'Midi',
  components: {
    MidiInputEdit,
  },
  props: {
    midiInputs: Array
  },
  data: function() {
    return {
        midiSupported: 'checking',
        midiInputIndex: 0,
        midiInputs: [],
        availableMidiInputs: {
          devices: [],
          loaded: true
        },
    }
  },
  computed: {
    currentMidiInput() {
      if(this.midiInputs[this.midiInputIndex])
        return this.midiInputs[this.midiInputIndex];
      else
        return false;
    }
  },
  methods: {
    checkMidiSupport() {
      this.$midi.checkMidiSupport(function() {
        this.midiSupported = true;
      }.bind(this),
      function(err) {
        this.midiSupported = false;
      }.bind(this));
    },
    refreshAvailableMidiInputs() {
      this.availableMidiInputs.devices = this.$midi.getMidiInputs();
    },
    add(device) {
      let midiInput = this.$midi.createMidiInput({
        name: (device.name ? device.name : 'MIDI input'),
        input: device,
        noteOn: function(e) {
          this.$emit('keyDown', {
            note: e.note.name,
            octave: e.note.octave
          });
        }.bind(this),
        noteOff: function(e) {
          this.$emit('keyUp', {
            note: e.note.name,
            octave: e.note.octave
          });
        }.bind(this)
      });

      this.midiInputs.push(midiInput);
    },
    edit(index) {
      this.midiInputIndex = index;
    },
    remove(index) {
      this.hideRemoveModal();

      let midiInput = this.midiInputs.splice(index, 1);
      if(midiInput.length === 0)
        return;

      midiInput[0].destroy();

      if(this.midiInputIndex >= this.midiInputs.length)
        this.midiInputIndex = (this.midiInputs.length - 1);
    },
    showRemoveModal() {
      this.$refs['remove-midi-input'].show()
    },
    hideRemoveModal() {
      this.$refs['remove-midi-input'].hide();
    }
  },
  mounted() {
    this.checkMidiSupport();
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
