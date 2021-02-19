<template>
  <b-card no-body class="mb-1" role="tablist">
    <b-button variant="primary" block role="tab" class="dropdown-card-toggle" :class="expanded ? null : 'collapsed'" :aria-expanded="expanded ? 'true' : 'false'" :aria-controls="'dropdown-card-' + id" @click="expanded = !expanded">{{ title }}</b-button>
      <b-collapse :id="'dorpdown-card' + id" v-model="expanded" role="tabpanel">
        <b-card-body>
          <slot></slot>
        </b-card-body>
      </b-collapse>
  </b-card>
</template>

<script>
export default {
  name: 'DropdownCard',
  props: {
    title: String
  },
  data: function() {
    return {
        id: '',
        expanded: false
    }
  },
  mounted() {
    this.id = this._uid;
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .dropdown-card-toggle {padding-left:1.5rem; padding-right:1.5rem; position:relative;}
    .dropdown-card-toggle:after {content:'\f077';  display:block; font-family:'Font Awesome 5 Free'; font-weight:bold; position:absolute; top:50%; right:0.75rem; transform:translateY(-50%);}
    .dropdown-card-toggle.collapsed:after {content: '\f078';}
</style>
