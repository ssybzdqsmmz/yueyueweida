<template>
  <div class="header">
    <div class="academic-badge">
      <div class="badge-circle">
        <span class="badge-text">GEO</span>
      </div>
      <div class="badge-line"></div>
    </div>

    <div class="header-title">
      <span class="title-main">隧道地质环境原型系统</span>
      <span class="title-sub">Multi-scale Tunnel Geological Environment Prototype System</span>
    </div>

    <div class="academic-ornament left-ornament">
      <div class="ornament-line"></div>
      <div class="ornament-dots">
        <div class="dot" v-for="n in 5" :key="n"></div>
      </div>
    </div>

    <div class="title-btns">
      <div class="title-btn" v-for="item in ToolBtnConfig" :key="item" @click="titleClick(item)">
        <span class="title-btn-name" :style="{ color: isActive === item.name ? '#19FFEC' : '' }">{{ item.name }}</span>
        <div class="line"></div>
      </div>
    </div>

    <div class="academic-ornament right-ornament">
      <div class="ornament-dots">
        <div class="dot" v-for="n in 5" :key="n"></div>
      </div>
      <div class="ornament-line"></div>
    </div>

    <div class="title-tool">
      <div class="tool-line"></div>
      <div class="tool-date">
        <div class="tool-date-top">
          <span>{{ sdate.time }}</span>
        </div>
        <div class="tool-date-down">
          <span>{{ sdate.year }}</span>
          <div class="line"></div>
          <span class="tool-date-down-week">{{ sdate.week }}</span>
        </div>
      </div>
    </div>

    <!-- 动态学术装饰背景 -->
    <div class="academic-bg">
      <div class="bg-grid"></div>
      <div class="bg-waves">
        <div class="wave" v-for="n in 3" :key="n"></div>
      </div>
      <div class="bg-particles">
        <div class="particle" v-for="n in 8" :key="n"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue';
import './Tools/datePrototype.js';
import WEventBus from './Tools/WEventBus';
import ToolBtnConfig from './Config/ToolButton.json';

let eventBus = new WEventBus();
ToolBtnConfig.forEach((item) => {
  eventBus.addExcludeFilter(item.topic);
});

const sdate = reactive({ year: '', time: '10:42:30', week: '' });
const isActive = ref('');

function getDate() {
  const updateDate = (year, week, time) => {
    sdate.time = time;
    sdate.week = week;
    sdate.year = year;
  };

  let time = '';
  let year = new Date().Format('yyyy.MM.dd');
  let week = new Date().getWeekDate();
  updateDate(year, week, time);

  setInterval(() => {
    let time = new Date().Format('hh:mm:ss');
    if (time.indexOf('%') !== -1) {
      time = time.substring(time.indexOf('%') + 3, time.length);
    }
    if (time == '23:59:59' || time == '00:00:00') {
      let year = new Date().Format('yyyy.MM.dd');
      let week = new Date().getWeekDate();
      updateDate(year, week, time);
    }
    sdate.time = time;
  }, 1000);
}

getDate();

const titleClick = (() => {
  let preItem;

  function emitSignal(item) {
    eventBus.emit(item.topic);
  }

  return (item) => {
    if (item == preItem) {
      emitSignal(preItem);
      isActive.value = '';
      preItem = undefined;
      return;
    }

    if (preItem) {
      emitSignal(preItem);
    }

    emitSignal(item);
    isActive.value = item.name;
    preItem = item;
  };
})();

// 粒子动画
onMounted(() => {
  const particles = document.querySelectorAll('.particle');
  particles.forEach((particle, index) => {
    particle.style.setProperty('--delay', `${index * 0.5}s`);
  });
});
</script>

<style lang="scss" scoped>
.header {
  display: flex;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 10;
  width: 100%;
  height: 70px;
  border-bottom: 1px solid rgb(59 130 130 / 30%);
  justify-content: center;
  align-items: center;
  text-align: center;
  white-space: nowrap;
  background: linear-gradient(135deg, 
    rgb(6 36 40 / 95%) 0%,
    rgb(9 66 61 / 90%) 30%,
    rgb(13 85 92 / 85%) 70%,
    rgb(6 36 40 / 95%) 100%
  );
  box-shadow: 0 4px 20px rgb(0 0 0 / 30%),
    0 0 0 1px rgb(25 255 236 / 10%) inset,
    0 0 30px rgb(25 255 236 / 5%) inset;
  backdrop-filter: blur(10px);

  /* 学术徽章 */
  .academic-badge {
    display: flex;
    position: absolute;
    left: 20px;
    align-items: center;
    gap: 12px;

    .badge-circle {
      display: flex;
      width: 45px;
      height: 45px;
      border: 1px solid rgb(59 130 130 / 50%);
      border-radius: 50%;
      justify-content: center;
      align-items: center;
      background: linear-gradient(135deg, 
        rgb(25 255 236 / 10%) 0%,
        rgb(59 130 130 / 20%) 100%
      );
      box-shadow: 0 0 15px rgb(25 255 236 / 10%),
        inset 0 0 20px rgb(0 0 0 / 20%);

      .badge-text {
        color: #19FFEC;
        font-size: 14px;
        font-weight: bold;
        letter-spacing: 1px;
        text-shadow: 0 0 10px rgb(25 255 236 / 50%);
      }
    }

    .badge-line {
      width: 40px;
      height: 1px;
      background: linear-gradient(90deg, 
        transparent 0%,
        rgb(59 130 130 / 80%) 50%,
        transparent 100%
      );
    }
  }

  .header-title {
    display: flex;
    margin-left: 100px;
    flex-direction: column;
    align-items: center;
    gap: 2px;

.title-main {
  color: #FFFFFF;
  font-size: 30px;
  font-weight: 600;
  letter-spacing: 1px;
  text-shadow: 0 1px 2px rgb(0 0 0 / 80%),
    0 0 10px rgb(25 255 236 / 30%);

  /* 移除下面的渐变背景设置 */

  background: linear-gradient(135deg, #FFFFFF 0%, #19FFEC 100%);
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

    .title-sub {
      color: rgb(184 209 211 / 70%);
      font-size: 11px;
      font-weight: 300;
      letter-spacing: 0.5px;
      text-transform: uppercase;
    }
  }

  /* 学术装饰 */
  .academic-ornament {
    display: flex;
    position: absolute;
    align-items: center;
    gap: 15px;

    &.left-ornament {
      left: 120px;
    }

    &.right-ornament {
      right: 120px;
    }

    .ornament-line {
      width: 60px;
      height: 1px;
      background: linear-gradient(90deg, 
        transparent 0%,
        rgb(59 130 130 / 60%) 50%,
        transparent 100%
      );
    }

    .ornament-dots {
      display: flex;
      gap: 3px;

      .dot {
        width: 4px;
        height: 4px;
        border-radius: 50%;
        background: rgb(59 130 130 / 50%);
        animation: pulse 2s infinite ease-in-out;

        @for $i from 1 through 5 {
          &:nth-child(#{$i}) {
            animation-delay: $i * 0.2s;
          }
        }
      }
    }
  }

  .title-btns {
    display: flex;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    gap: 20px;

    .title-btn {
      position: relative;
      padding: 5px 0;
      cursor: pointer;
      transition: all 0.3s ease;

      &-name {
        color: #d1e0dd;
        font-size: 16px;
        font-weight: 400;
        letter-spacing: 0.5px;
        transition: all 0.3s ease;
      }

      &:hover {
        .title-btn-name {
          color: #19FFEC;
          text-shadow: 0 0 10px rgb(25 255 236 / 50%);
        }

        &::after {
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 100%;
          height: 1px;
          background: linear-gradient(90deg, 
            transparent 0%,
            #19FFEC 50%,
            transparent 100%
          );
          content: '';
          animation: lineFlow 2s infinite linear;
        }
      }

      .line {
        float: left;
        width: 0;
        height: 20px;
        margin: 0 16px;
        margin-top: 2px;
        border-left: 1px solid rgb(169 213 216 / 20%);
      }
    }
  }

  .title-tool {
    display: flex;
    position: absolute;
    right: 20px;
    height: 57px;
    align-items: center;
    color: #ffffff;

    .tool-line {
      width: 0;
      height: 38px;
      margin: 0 15px;
      border-left: 1px solid rgb(169 213 216 / 20%);
    }

    .tool-date {
      .tool-date-top {
        width: 106px;
        height: 29px;
        line-height: 29px;
        color: #19FFEC;
        font-family: DIN;
        font-size: 22px;
        text-shadow: 0 0 10px rgb(25 255 236 / 30%);
        letter-spacing: 3px;
      }

      .tool-date-down {
        display: flex;
        width: 110px;
        height: 15px;
        margin-top: 3px;
        justify-content: space-between;
        color: rgb(184 209 211 / 80%);
        font-family: DIN-Regular;
        font-size: 11px;

        &-week {
          font-family: 'PingFang SC';
        }

        .line {
          margin: 0 8px;
          border-left: 1px solid rgb(169 213 216 / 20%);
        }
      }
    }
  }

  /* 学术背景装饰 */
  .academic-bg {
    position: absolute;
    top: 0;
    left: 0;
    z-index: -1;
    width: 100%;
    height: 100%;
    overflow: hidden;
    pointer-events: none;

    .bg-grid {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-image: linear-gradient(rgb(59 130 130 / 5%) 1px, transparent 1px),
        linear-gradient(90deg, rgb(59 130 130 / 5%) 1px, transparent 1px);
      background-size: 30px 30px;
      mask-image: linear-gradient(to bottom, transparent 10%, black 40%, black 60%, transparent 90%);
    }

    .bg-waves {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 5px;

      .wave {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 1px;
        background: linear-gradient(90deg, 
          transparent 0%,
          rgb(25 255 236 / 30%) 50%,
          transparent 100%
        );
        opacity: 0.3;

        &:nth-child(1) {
          animation: waveMove 4s infinite linear;
        }

        &:nth-child(2) {
          bottom: 2px;
          animation: waveMove 3s infinite linear reverse;
          opacity: 0.2;
        }

        &:nth-child(3) {
          bottom: 4px;
          animation: waveMove 5s infinite linear;
          opacity: 0.1;
        }
      }
    }

    .bg-particles {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;

      .particle {
        position: absolute;
        width: 2px;
        height: 2px;
        border-radius: 50%;
        background: rgb(25 255 236 / 20%);
        animation: float 8s infinite ease-in-out;
        animation-delay: var(--delay);

        @for $i from 1 through 8 {
          &:nth-child(#{$i}) {
            top: random(70) + px;
            left: random(100) + vw;
          }
        }
      }
    }
  }

  @media screen and (max-width: 1281px) {
    .academic-badge,
    .academic-ornament,
    .header-title .title-sub {
      display: none;
    }

    .header-title .title-main {
      margin-left: 0;
      font-size: 18px;
    }

    .title-tool {
      display: none;
    }

    .title-btns {
      position: absolute;
      right: 20px;
      left: auto;
      transform: none;
    }
  }
}

/* 动画定义 */
@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 0.5;
  }

  50% {
    transform: scale(1.2);
    opacity: 0.8;
  }
}

@keyframes lineFlow {
  0% {
    background-position: -100% 0;
  }

  100% {
    background-position: 200% 0;
  }
}

@keyframes waveMove {
  0% {
    transform: translateX(-100%);
  }

  100% {
    transform: translateX(100%);
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0) translateX(0);
    opacity: 0.2;
  }

  25% {
    transform: translateY(-10px) translateX(5px);
    opacity: 0.4;
  }

  50% {
    transform: translateY(-5px) translateX(10px);
    opacity: 0.3;
  }

  75% {
    transform: translateY(-15px) translateX(-5px);
    opacity: 0.5;
  }
}

.checked {
  color: #19ffec !important;
  text-shadow: 0 0 10px rgb(25 255 236 / 50%) !important;
}
</style>