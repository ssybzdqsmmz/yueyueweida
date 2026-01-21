<template>
  <div class="header">
		<span>
			多尺度隧道地质环境
		</span>
    <div class="title-btns">
      <div class="title-btn" v-for="item in ToolBtnConfig" :key="item" @click="titleClick(item)">
        <span class="title-btn-name" :style="{ color: isActive === item.name ? '#19FFEC' : '' }">{{ item.name }}</span>
        <div class="line"></div>
      </div>
    </div>
    <div class="title-tool">
      <!-- <div v-for="item in weather" :key="item.type">
        <div class="tool-weather">
          <div class="tool-weather-top">
            <span class="tool-weather-top-du">{{ item.type }}</span>
          </div>
          <div class="tool-weather-down">
            <span class="tool-date-down-week">{{ item.data }}</span>
          </div>
        </div>
      </div> -->
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
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import './Tools/datePrototype.js';
import WEventBus from './Tools/WEventBus';
import ToolBtnConfig from './Config/ToolButton.json';

let eventBus = new WEventBus();
ToolBtnConfig.forEach((item) => {
  eventBus.addExcludeFilter(item.topic); // 不能调用清除
});

// const weather = [
//   {
//     type: '海拔',
//     data: '3710m',
//   },
//   {
//     type: '高温',
//     data: '',
//   },
//   {
//     type: '低温',
//     data: '',
//   },
// ];
const sdate = reactive({ year: '', time: '10:42:30', week: '' });
const isActive = ref('');

/**
 * @description: 定时刷新日期
 * @return {void}
 */
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
      let date = new Date();
      let year = new Date().Format('yyyy.MM.dd');
      let week = date.getWeekDate();
      // date = { year: year, week: week, time: '' };
      updateDate(year, week, time);
    }
    sdate.time = time;
  }, 1000);
}

// /**
//  * @description: 获取天气
//  * @return {void}
//  */
// function getWeather() {
//   let _this = this;
//   let weatherPromise = Resource.fetchJson({
//     url: 'http://wthrcdn.etouch.cn/weather_mini?city=甘孜',
//   });
//   weatherPromise.then((data) => {
//     let today = data['data']['forecast'][0];
//     _this.weather[1].data = today['high'].split(' ')[1];
//     _this.weather[2].data = today['low'].split(' ')[1];
//   });
// }

getDate();
// getWeather();

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
      // preClicked
      emitSignal(preItem);
    }

    emitSignal(item);
    isActive.value = item.name;
    preItem = item;
  };
})();
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
  white-space: nowrap;
  background-color:#09423d7e;
  background-size: cover;
	text-align: center;
	justify-content: center; /* 水平居中 */
  align-items: center;     /* 垂直居中 */
	.header span {
  font-size: 34px;         /* 大号字体 */
  color: white;            /* 白色文字 */
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5); /* 立体感阴影 */
  font-weight: bold;       /* 加粗 */
}

  @media screen and (max-width: 1281px) {
    .title-tool {
      display: none;
    }

    .title-btns {
      display: none;
			width: 100px;
    }
  }

  .title-btns {
    position: relative;
    margin-top: 97px;
    margin-right: 38%;
		width: 100px;

    .title-btn {
      display: inline-block;
      height: 19px;
      font-family: TRENDS;
      font-size: 18px;
      cursor: pointer;

      &-name {
        float: left;
        color: #d1e0dd;
        font-size: 20px;
        font-weight: 400;
      }
    }

    .select-btn {
      margin-left: 5px;
      margin-top: -9px;
    }
  }

  .title-tool {
    display: flex;
    height: 57px;
    margin-left: auto;
    margin-top: 4px;
    color: #ffffff;
    transform: translateX(-30px);

    .tool-weather {
      margin-right: 10px;
      font-weight: 400;

      .tool-weather-top {
        font-size: 24px;
        font-family: DIN;
        letter-spacing: 5px;

        &-du {
          font-size: 17px;
        }
      }

      .tool-weather-down {
        margin-top: 1px;
        color: #b8d1d3;
        font-family: 'PingFang SC';
        font-size: 12px;
        font-weight: bold;
      }
    }

    .tool-line {
      width: 0;
      height: 38px;
      margin: 0 10px;
      margin-top: 7px;
      border: 1px solid #a9d5d8;
      opacity: 0.1;
    }

    .tool-date {
      margin-right: 33px;
      font-weight: 400;

      .tool-date-top {
        width: 106px;
        height: 29px;
        line-height: 29px;
        font-family: DIN;
        font-size: 24px;
        letter-spacing: 4px;
      }

      .tool-date-down {
        display: flex;
        width: 110px;
        height: 15px;
        margin-top: 3px;
        justify-content: space-between;
        color: #b8d1d3;
        font-family: DIN-Regular;
        font-size: 12px;

        &-week {
          font-family: 'PingFang SC';
        }

        .line {
          margin: 0 8px;
        }
      }
    }
  }
}

.checked {
  color: #19ffec;
}

.line {
  float: left;
  width: 0;
  height: 20px;
  margin: 0 16px;
  margin-top: 2px;
  border: 0.1px solid #a9d5d8;
  opacity: 0.2;
}
</style>
