<template>
    <div class="users-container">
        <b-row>
          <b-col cols="2">
            <b-nav vertical pills>
              <b-nav-item v-for="(user, index) in users" @click="edit(index)" :active="index === userIndex">{{ user.username }}</b-nav-item>
            </b-nav>
          </b-col>
          <b-col>
            <div v-if="currentUser">
              <b-row>
                <b-col>
                  <h3>User {{ currentUser.username }}</h3>
                </b-col>
              </b-row>
              <user-edit v-model="currentUser"></user-edit>
            </div>
          </b-col>
        </b-row>
    </div>
</template>

<script>
import UserEdit from '@/components/users/UserEdit.vue'

export default {
  name: 'Users',
  components: {
    UserEdit,
  },
  props: {
    users: Array
  },
  data: function() {
    return {
      userIndex: 0,
    }
  },
  computed: {
    currentUser() {
      if(this.users[this.userIndex])
        return this.users[this.userIndex];
      else
        return false;
    }
  },
  methods: {
    edit(index) {
      this.userIndex = index;
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
