<!--
 * @Author: 杨语涵 861896230@qq.com
 * @Date: 2023-04-23 15:38:10
 * @LastEditors: anganao 1928882425@qq.com
 * @LastEditTime: 2024-04-17 23:43:16
 * @FilePath: \Geology-v3\src\views\SceneManagement\KDTunnel\Components\Legend_flow.vue
 * @Description: 
 * 
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved. 
-->
<template>
  <div class="middleTitle">泥石流轨迹速度</div>
  <div class="middleIcon">
    <canvas id="myCanvas"> 您的浏览器不支持 HTML5 canvas 标签。 </canvas>
  </div>
</template>

<script lang="ts">
let canvas;
let ctx;
let imgdata;
export default {
  data() {
    return {};
  },
  mounted() {
    this.initCanvas();
    window.onresize = () => {
      this.initCanvas();
    };
  },
  methods: {
    initCanvas() {
      canvas = document.getElementById('myCanvas');
      if (!canvas) {
        return;
      }
      ctx = canvas.getContext('2d');
      //绘制图例
      imgdata = ctx.getImageData(0, 0, 40, 120);
      this.drawCanvas();
    },
    drawCanvas() {
      let mindata = 0;
      let maxdata = 174.64;
      let pixels = imgdata.data;
      let i = 0; //200为图例长度，40为图例宽度，40为间隔,141为改变差值
      let high = 120;
      let weigh = 40;
      let change = 30;
      for (let y = 0; y < high; y++) {
        for (let x = 0; x < weigh; x++) {
          if (Math.floor(y / change) == 0) {
            pixels[i++] = 204;
            pixels[i++] = 63 + (y / change) * 141;
            pixels[i++] = 63;
            pixels[i++] = 255;
            continue;
          }
          if (Math.floor(y / change) == 1) {
            pixels[i++] = 204 - ((y - change) / change) * 141;
            pixels[i++] = 204;
            pixels[i++] = 63;
            pixels[i++] = 255;
            continue;
          }
          if (Math.floor(y / change) == 2) {
            pixels[i++] = 63;
            pixels[i++] = 204;
            pixels[i++] = 63 + ((y - change * 2) / change) * 141;
            pixels[i++] = 255;
            continue;
          }
          if (Math.floor(y / change) == 3) {
            pixels[i++] = 63;
            pixels[i++] = 204 - ((y - change * 3) / change) * 141;
            pixels[i++] = 204;
            pixels[i++] = 255;
            continue;
          } else {
            pixels[i++] = 0;
            pixels[i++] = 0;
            pixels[i++] = 0;
            pixels[i++] = 255;
          }
        }
      }
      ctx.putImageData(imgdata, 10, 15);
      //绘制标题
      ctx.font = '15px bold 黑体'; // 设置字体、颜色
      ctx.textAlign = 'center';
      ctx.fillStyle = 'white';
      //ctx.fillText("Total kinetic energy", 75, 15)
      //ctx.fillText("(KJ)", 75, 35)
      ctx.font = '15px 黑体'; // 设置字体、颜色
      ctx.fillStyle = 'rgba(204,51,51,1)';
      ctx.fillText('High', 30, 10);
      ctx.fillStyle = 'rgba(51,51,204,1)';
      ctx.fillText('Low', 30, 150);
      //画直线
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(204,51,51,1)';
      ctx.moveTo(0, 15);
      ctx.lineTo(60, 15);
      ctx.stroke();
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(204,204,51,1)';
      ctx.moveTo(0, 45);
      ctx.lineTo(60, 45);
      ctx.stroke();
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(51,204,51,1)';
      ctx.moveTo(0, 75);
      ctx.lineTo(60, 75);
      ctx.stroke();
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(51,204,204,1)';
      ctx.moveTo(0, 105);
      ctx.lineTo(60, 105);
      ctx.stroke();
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(51,51,204,1)';
      ctx.moveTo(0, 135);
      ctx.lineTo(60, 135);
      ctx.stroke();
      //绘制文字
      ctx.textAlign = 'left'; // 设置水平对齐方式
      ctx.textBaseline = 'left'; // 设置垂直对齐方式
      ctx.fillStyle = 'rgba(204,51,51,1)';
      ctx.fillText(maxdata.toFixed(3), 65, 20); // 绘制文字（参数：要写的字，x坐标，y坐标）
      ctx.fillStyle = 'rgba(204,204,51,1)';
      ctx.fillText((maxdata - (maxdata - mindata) * 0.25).toFixed(3), 65, 50);
      ctx.fillStyle = 'rgba(51,204,51,1)';
      ctx.fillText((maxdata - (maxdata - mindata) * 0.5).toFixed(3), 65, 80);
      ctx.fillStyle = 'rgba(51,204,204,1)';
      ctx.fillText((maxdata - (maxdata - mindata) * 0.75).toFixed(3), 65, 110);
      ctx.fillStyle = 'rgba(51,51,204,1)';
      ctx.fillText(mindata.toFixed(3), 65, 140);
    },
  },
};
</script>

<style lang="scss" scoped>
.main {
  position: absolute;
  top: 803px;
  right: 18px;
  width: 556px;
  height: 253px;
  background-color: rgb(238 238 238 / 100%);
  opacity: 0.9;

  .title {
    width: 546px;
    height: 49px;
    margin-left: 10px;
    line-height: 49px;
    color: #000000;
    font-size: 18px;
    text-align: left;
  }

  .left {
    position: absolute;
    top: 49px;
    height: 204px;
    width: 220px;

    .leftTitle {
      width: 180px;
      height: 28px;
      margin: 6px 20px 5px;
      line-height: 28px;
      color: #000000;
      font-size: 16px;
      text-align: left;
    }

    .leftIcon {
      display: grid;
      width: 180px;
      height: 165px;
      margin: 0 20px;
      grid-template-rows: repeat(5, 1fr);

      .leftRow {
        display: grid;
        grid-template-columns: 61px 119px;

        .leftHead {
          margin: 3px;
          background-color: rgb(218 222 173 / 100%);
        }

        .leftCell {
          margin: 3px;
          line-height: 27px;
          color: #000000;
          font-size: 16px;
          text-align: left;
        }

        .modifier1 {
          background-color: rgb(217 0 27 / 77.6%);
        }

        .modifier2 {
          background-color: rgb(252 153 4 / 77.6%);
        }

        .modifier3 {
          background-color: rgb(13 104 18 / 77.6%);
        }

        .modifier4 {
          background-color: rgb(238 238 238 / 100%);
          background-image: url('@/assets/images/地灾监测/u2522.svg');
        }
      }
    }
  }

  .middle {
    position: absolute;
    top: 49px;
    left: 220px;
    height: 204px;
    width: 163px;

    .middleTitle {
      width: 128px;
      height: 28px;
      margin: 6px 17.5px 5px;
      line-height: 28px;
      color: #000000;
      font-size: 16px;
      text-align: left;
    }

    .middleIcon {
      display: flex;
      width: 123px;
      height: 165px;
      margin: 0 20px;
    }
  }

  .right {
    position: absolute;
    top: 49px;
    left: 383px;
    height: 204px;
    width: 163px;

    .rightTitle {
      width: 106px;
      height: 28px;
      margin: 6px 28.5px 5px;
      line-height: 28px;
      color: #000000;
      font-size: 16px;
      text-align: left;
    }

    .rightIcon {
      display: grid;
      width: 118px;
      height: 37px;
      margin: 0 22.5px;
      grid-template-columns: 32px 86px;

      .rightHead {
        margin: 3px;
        background-image: url('@/assets/images/地灾监测/u255.svg');
      }

      .rightCell {
        margin: 3px;
        line-height: 31px;
        color: #000000;
        font-size: 16px;
        text-align: left;
      }
    }
  }
}
</style>
