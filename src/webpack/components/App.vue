<docs>
  # App.vue Component document

  *src\webpack\components\App.vue*
</docs>

<template lang="pug">
  section#app
    h1 {{ LocalDefaultMessage }}
    button(
      @click="globalIncrement"
    ) click here
    p {{ number }} / 2 = {{ HALF_OF_NUMBER }}
</template>

<script>
  import { mapMutations } from 'vuex';
  import { mapState } from 'vuex';
  import { mapGetters } from 'vuex';

  export default {
    name: 'App',
    data () {
      return {
        LocalDefaultMessage: 'Hello Vue.js'
      }
    },
    computed: {
      ...mapState([
        'number'
      ]),
      ...mapGetters([
        'HALF_OF_NUMBER'
    ])
    },
    methods: {
      globalIncrement () {
        this.$store.commit({
          type: 'INCREMENT',
          amount: 10
        })
      }
    }
  }
</script>

<style lang="scss">
  @import "~globalSass";

  #app {
    text-align: center;
    text-shadow: 2px 2px 2px #000;
    color: #ffffff;

    @include vertical-rythme(40px);
    @include container-center(960px);
  }
</style>
