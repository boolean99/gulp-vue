<template lang="pug">
  #other
    h1  Other component
</template>

<script>
  export default {
    name: 'OhterComponent'
  }
</script>

<style lang="scss">
  @import "~globalSass";

  #other {
    h1 {
      @extend %fl;
    }
  }
</style>
