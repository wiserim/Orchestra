<template>
  <div class="player-container">
      <b-row class="align-items-center">
        <b-col cols="auto">
          <b-button-group>
            <b-button variant="primary" @click="playPause">
              <i v-if="audio.paused" class="fas fa-play"></i>
              <i v-else class="fas fa-pause"></i>
            </b-button>
            <b-button variant="primary" @click="stop">
              <i class="fas fa-stop"></i>
            </b-button>
          </b-button-group>
          </b-col>
          <b-col cols="auto">
            <span>{{ currentTime | time }} / {{ duration | time }}</span>
          </b-col>
          <b-col>
            <b-form-input :value="currentTime" @input="setCurrentTime($event)" type="range" min="0" :max="duration" step="0.01"></b-form-input>
          </b-col>
      </b-row>
  </div>
</template>

<script>
export default {
  name: 'Player',
  props: {
    url: String
  },
  data: function() {
    return {
        audio: new Audio(),
        paused: true,
        duration: 0,
        currentTime: 0
    }
  },
  watch: {
    url: function(newVal, oldVal) {
      this.audio.src = newVal;
      this.audio.load();
    }
  },
  methods: {
    playPause() {
      if(this.audio.paused) {
        this.audio.play();
      }
      else {
        this.audio.pause();
      }
    },
    stop() {
      this.audio.pause();
      this.audio.currentTime = 0;
    },
    setCurrentTime(value) {
      this.audio.currentTime = value;
    }
  },
  mounted() {
    this.audio.addEventListener('durationchange', () => {
      this.duration = this.audio.duration;
    });
    this.audio.addEventListener('timeupdate', () => {
      this.currentTime = this.audio.currentTime;
    });
    this.audio.addEventListener('play', () => {
      this.paused = false;
    });
    this.audio.addEventListener('pause', () => {
      this.paused = true;
    });
    this.audio.addEventListener('ended', () => {
      this.paused = true;
      this.currentTime = 0;
    });
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .dropdown-card-toggle {padding-left:1.5rem; padding-right:1.5rem; position:relative;}
    .dropdown-card-toggle:after {content:'\f077';  display:block; font-family:'Font Awesome 5 Free'; font-weight:bold; position:absolute; top:50%; right:0.75rem; transform:translateY(-50%);}
    .dropdown-card-toggle.collapsed:after {content: '\f078';}
</style>
