<template>
  <GeologyMap />
</template>

<script setup lang="ts">
import GeologyMap from '../GeologyModel/Component/GeologyMap.vue';
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@300;400;500;700&display=swap');
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body, html {
  height: 100%;
  overflow: hidden;
  font-family: 'Noto Sans SC', sans-serif;
}

#app {
  height: 100vh;
  width: 100vw;
}
</style>