<template>
  <div v-if="loadingWidgetVisible">
    <div v-if="loadingAnimate" class="lds-roller">
      <div v-for="n in 8" :key="n"></div>
    </div>
    <div class="status">
      状态：{{ loadingText }}
      <span class="loader"></span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import WEventBus from '../Tools/WEventBus';
import { loadingEvents } from './events';
import { ref } from 'vue';

let eventBus = new WEventBus();

const loadingWidgetVisible = ref(false);
const loadingText = ref('');
const loadingAnimate = ref(true);

eventBus.on(loadingEvents.changeLoadingWidget, (status) => {
  loadingWidgetVisible.value = status;
});
eventBus.on(loadingEvents.changeLoadingAnimate, (status) => {
  loadingAnimate.value = status;
});
eventBus.on(loadingEvents.changeLoadingText, (text) => {
  loadingText.value = text;
});
</script>

<style lang="scss">
.lds-roller {
  position: absolute;
  top: 50%;
  left: 50%;
  z-index: 3;
  width: 80px;
  height: 80px;
  transform: translate(-50%, -50%);
}

.lds-roller div {
  animation: lds-roller 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
  transform-origin: 40px 40px;
}

.lds-roller div::after {
  display: block;
  position: absolute;
  width: 7px;
  height: 7px;
  margin: -4px 0 0 -4px;
  border-radius: 50%;
  background: #fff;
  content: ' ';
}

.lds-roller div:nth-child(1) {
  animation-delay: -0.036s;
}

.lds-roller div:nth-child(1)::after {
  top: 63px;
  left: 63px;
}

.lds-roller div:nth-child(2) {
  animation-delay: -0.072s;
}

.lds-roller div:nth-child(2)::after {
  top: 68px;
  left: 56px;
}

.lds-roller div:nth-child(3) {
  animation-delay: -0.108s;
}

.lds-roller div:nth-child(3)::after {
  top: 71px;
  left: 48px;
}

.lds-roller div:nth-child(4) {
  animation-delay: -0.144s;
}

.lds-roller div:nth-child(4)::after {
  top: 72px;
  left: 40px;
}

.lds-roller div:nth-child(5) {
  animation-delay: -0.18s;
}

.lds-roller div:nth-child(5)::after {
  top: 71px;
  left: 32px;
}

.lds-roller div:nth-child(6) {
  animation-delay: -0.216s;
}

.lds-roller div:nth-child(6)::after {
  top: 68px;
  left: 24px;
}

.lds-roller div:nth-child(7) {
  animation-delay: -0.252s;
}

.lds-roller div:nth-child(7)::after {
  top: 63px;
  left: 17px;
}

.lds-roller div:nth-child(8) {
  animation-delay: -0.288s;
}

.lds-roller div:nth-child(8)::after {
  top: 56px;
  left: 12px;
}

@keyframes lds-roller {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

.status {
  position: absolute;
  right: 0;
  bottom: 5px;
  width: 220px;
}

.loader {
  display: inline-block;
  position: relative;
  color: #fff;
  font-family: Arial, Helvetica, sans-serif;
}

.loader::before {
  content: '';
  animation: 1s print linear alternate infinite;
}

// .loader:after {
//   content: "";
//   position: absolute;
//   right: -4px;
//   top: 50%;
//   transform: translatey(-45%);
//   width: 2px;
//   height: 1.3em;
//   background: currentColor;
//   opacity: 0.8;
//   animation: 1s blink steps(2) infinite;
// }

@keyframes blink {
  0% {
    visibility: hidden;
  }

  100% {
    visibility: visible;
  }
}

@keyframes print {
  0% {
    content: '';
  }

  30% {
    content: '.';
  }

  60% {
    content: '..';
  }

  100% {
    content: '...';
  }
}
</style>
