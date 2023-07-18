<template>
  <v-alert elevation="8" transition="fade-transition" :type="alertOptions.type" dismissible
           v-model="alertOptions.isShow">
    {{ alertOptions.content }}
  </v-alert>
</template>

<script>
export default {
  name: 'alert-default',
  props: {
    state: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {}
  },
  watch: {},
  computed: {
    alertOptions() {
      return this.$store.state.alert
    }
  },
  mounted() {
    console.log(this.alertOptions)
  }
}
</script>
