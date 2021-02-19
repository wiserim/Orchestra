<template>
    <div class="audio-inputs-container">
        <b-row>
          <b-col cols="2">
            <b-dropdown variant="primary" text="Add" class="mb-1 d-block" @show="refreshAvailableAudioInputs">
              <b-dropdown-item v-if="availableAudioInputs.loaded" v-for="device in availableAudioInputs.devices" @click="add(device)">{{ device.label ? device.label : 'Unnamed device' }}</b-dropdown-item>
              <div v-if="!availableAudioInputs.loaded" class="text-center">
                <b-spinner small variant="primary" label="Loading"></b-spinner>
              </div>
            </b-dropdown>
            <b-nav vertical pills>
              <b-nav-item v-for="(audioInput, index) in audioInputs" @click="edit(index)" :active="index === audioInputIndex">{{ audioInput.name }}</b-nav-item>
            </b-nav>
          </b-col>
          <b-col>
            <div v-if="currentAudioInput">
              <b-row>
                <b-col>
                  <h3>Audio input</h3>
                </b-col>
                <b-col class="text-right">
                  <b-button variant="danger" @click="showRemoveModal"><i class="fas fa-trash-alt"></i> Remove</b-button>
                </b-col>
              </b-row>
              <audio-input-edit v-model="currentAudioInput"></audio-input-edit>
            </div>
          </b-col>
        </b-row>

        <!--remove audio input modal-->
        <b-modal ref="remove-audio-input" title="Remove audio input">
            <p>Are you sure?</p>

            <div slot="modal-footer">
                <b-button variant="danger" class="mr-1" @click="remove(audioInputIndex)">Remove</b-button>
                <b-button @click="hideRemoveModal">Cancel</b-button>
            </div>
        </b-modal>
        <!--remove audio input modal end-->
    </div>
</template>

<script>
import AudioInputEdit from '@/components/audioInputs/AudioInputEdit.vue'

export default {
  name: 'AudioInputs',
  components: {
    AudioInputEdit,
  },
  props: {
    audioInputs: Array,
    output: Object
  },
  data: function() {
    return {
        audioInputIndex: 0,
        availableAudioInputs: {
          devices: [],
          loaded: true
        },
    }
  },
  computed: {
    currentAudioInput() {
      if(this.audioInputs[this.audioInputIndex])
        return this.audioInputs[this.audioInputIndex];
      else
        return false;
    }
  },
  methods: {
    refreshAvailableAudioInputs() {
      this.availableAudioInputs.loaded = false;
      this.$audioInputs.getAudioInputs(function(devices) {
        this.availableAudioInputs.devices = devices;
        this.availableAudioInputs.loaded = true;
      }.bind(this));
    },
    add(device) {
      console.log(device)
      let audioInput = this.$audioInputs.createAudioInput({
        name: (device.label ? device.label : 'Audio input'),
        output: this.output
      });

      audioInput.open(device.deviceId, function() {
        this.audioInputs.push(audioInput)
      }.bind(this));
    },
    edit(index) {
      this.audioInputIndex = index;
    },
    remove(index) {
      this.hideRemoveModal();

      let audioInput = this.audioInputs.splice(index, 1);
      if(audioInput.length === 0)
        return;

      audioInput[0].destroy();

      if(this.audioInputIndex >= this.audioInputs.length)
        this.audioInputIndex = (this.audioInputs.length - 1);
    },
    showRemoveModal() {
      this.$refs['remove-audio-input'].show()
    },
    hideRemoveModal() {
      this.$refs['remove-audio-input'].hide();
    }
  },
  mounted() {
    this.refreshAvailableAudioInputs();
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
