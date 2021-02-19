<template>
  <b-button block variant="primary" class="text-left user-button" @click="toggleMute">{{ user.username }}<i class="fas" :class="[ user.muted ? 'fa-volume-mute' : 'fa-volume-up' ]"></i></b-button>
</template>

<script>
export default {
  name: 'UserButton',
  props: {
    user: Object
  },
  methods: {
    toggleMute() {
      this.user.toggleMute();
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .user-button {padding-right:40px; position:relative;}
    .user-button i {position:absolute; top:50%; right:12px; transform:translateY(-50%);}
</style>
