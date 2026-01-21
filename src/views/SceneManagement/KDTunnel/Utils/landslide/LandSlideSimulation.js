/*
 * @Descripttion: 滑坡模拟类
 * @version:
 * @Author: JinYiGao
 * @Date: 2021-04-12 21:06:21
 * @LastEditors: anganao
 * @LastEditTime: 2024-02-28 17:18:47
 */

import { request } from './Request.js';
import store from '@/store/index';
import * as Cesium from 'Cesium';

function LandslideSimulation(option) {
  this.viewer = option.viewer;
  this.url = option.url; //文件路径
  this.loop = option.loop || false; //是否循环

  this.frameNum = 0; //滑坡总帧数
  this.maxS = 0.0;
  this.minS = 0.0; //滑坡流体最大最小速度
  this.frameDataTin = []; //每帧滑坡数据 tin形式
  this.frameData = []; //每帧滑坡数据 单个point形式
  this.primitives = []; //每一帧primitive
  this.index = 0; //当前即将显示的primitive索引
  this.intervalID = undefined;
  this.speed = 200; //每帧播放间隔
  this.pause = false; //是否暂停
  this.colorArray = []; //分级色彩
  this.finish = false; //是否已经结束模拟
}

//当前绘制的线段索引
LandslideSimulation.prototype = {
  get index() {
    return store.state.simulation.disasterFrame;
  },
  set index(num) {
    store.commit('simulation/setDisasterFrame', num);
  },
};

//读取数据
LandslideSimulation.prototype.getData = function () {
  let _this = this;
  return new Promise(function (resolve) {
    request({
      url: _this.url,
      withCredentials: false,
    }).then((data) => {
      let points = data.data.data;
      _this.maxS = data.data.maxS;
      _this.frameNum = points.length;
      resolve(points);
    });
  });
};

//读取新的数据格式
LandslideSimulation.prototype.getDataNew = function () {
  let _this = this;
  return new Promise((resolve) => {
    request({
      url: _this.url,
      withCredentials: false,
    }).then((data) => {
      let points = data.data;
      _this.maxS = data.maxS;
      _this.frameNum = points[0].s.length;
      resolve(points);
    });
  });
};

//根据每帧数据点直接绘制点云
LandslideSimulation.prototype.addPrimitives = async function () {
  let data = await this.getData();
  //获得每一帧数据
  for (let i = 0; i < data.length; i++) {
    this.frameData.push(data[i]);
    let framedata = data[i];
    let points = new Cesium.PointPrimitiveCollection();
    //读取每一帧的点坐标
    for (let j = 0; j < framedata.length; j++) {
      let color = this.getColor(framedata[j].s, this.maxS);
      points.add({
        position: new Cesium.Cartesian3.fromDegrees(framedata[j].x, framedata[j].y, framedata[j].z + 10),
        pixelSize: 5,
        distanceDisplayCondition: {
          far: 50000,
          near: 100,
        },
        color: color,
        show: false,
      });
    }
    //每一帧点云数据存入
    this.primitives.push(points);
    this.viewer.scene.primitives.add(points); //全部添加进scene.primitives但不显示
  }
};

//依次显示primitive
LandslideSimulation.prototype.showPrimitive = function () {
  let _this = this;
  this.intervalID = setInterval(() => {
    //先看是否暂停
    if (!_this.pause) {
      //先判断上一帧是否需要隐藏
      let preindex = (_this.index - 1 + _this.frameNum) % _this.frameNum;
      let prepointCollection = _this.primitives[preindex];
      if (prepointCollection.get(0).show) {
        for (let i = 0; i < prepointCollection.length; i++) {
          let p = prepointCollection.get(i);
          p.show = !p.show;
        }
      }

      let pointCollection = _this.primitives[_this.index];
      for (let i = 0; i < pointCollection.length; i++) {
        let p = pointCollection.get(i);
        p.show = !p.show;
      }

      _this.index = (_this.index + 1) % _this.frameNum;
    }
  }, _this.speed);
};

//-----------------------------------------------------方法二-----------------------------------------------------------
//新的数据格式组织 s存储每一帧的点的状态 -1 为不显示
LandslideSimulation.prototype.addPrimitivesByS = async function () {
  let points = await this.getDataNew();
  //获得所有点数据
  let pointsCollection = new Cesium.PointPrimitiveCollection();
  for (let i = 0; i < points.length; i++) {
    this.frameData.push(points[i]);
    let point = points[i];
    let color = this.getColor(point.s[0], this.maxS);
    pointsCollection.add({
      position: new Cesium.Cartesian3.fromDegrees(point.x, point.y, point.z),
      pixelSize: 5,
      distanceDisplayCondition: {
        far: 50000,
        near: 100,
      },
      color: color,
      show: false,
    });
  }
  this.primitives.push(pointsCollection);
  this.viewer.scene.primitives.add(pointsCollection); //全部添加进scene.primitives但不显示
};

//依次更新每个点的显示状态以及颜色
LandslideSimulation.prototype.showPrimitiveByS = function () {
  let _this = this;
  this.intervalID = setInterval(() => {
    //先看是否暂停
    if (!_this.pause) {
      //得到所有点集合
      let pointCollection = _this.primitives[0];
      //更新所有点显示以及颜色状态
      for (let i = 0; i < pointCollection.length; i++) {
        let p = pointCollection.get(i);
        // p.show = !p.show;
        // p.color = _this.getColor(_this.frameData[i].s[_this.index], _this.maxS);
        //s为-1则不显示改点
        if (_this.frameData[i].s[_this.index] == -1) {
          p.show = false;
        } else {
          p.show = true;
          p.color = _this.getColor(_this.frameData[i].s[_this.index], _this.maxS);
        }
      }
      if (_this.index === _this.frameNum - 2) {
        if (!_this.loop) {
          _this.pause = true;
          _this.finish = true;
          store.commit('simulation/setSimulationPause', true);
        }
      }
      _this.index = (_this.index + 1) % _this.frameNum;
    }
  }, _this.speed);
};

//展示指定帧数据
LandslideSimulation.prototype.showFrameByS = async function (frame) {
  let _this = this;
  _this.index = frame;
  //更新所有点显示以及颜色状态
  let pointCollection = _this.primitives[0];
  for (let i = 0; i < pointCollection.length; i++) {
    let p = pointCollection.get(i);
    // p.show = !p.show;
    //s为-1则不显示改点
    if (_this.frameData[i].s[_this.index] == -1) {
      p.show = false;
    } else {
      p.show = true;
      p.color = _this.getColor(_this.frameData[i].s[_this.index], _this.maxS);
    }
  }
};
//----------------------------------------------------------------------------------------------------------------------

//暂停模拟
LandslideSimulation.prototype.pauseSimulation = function () {
  this.pause = true;
};

//继续模拟
LandslideSimulation.prototype.goonSimulation = function () {
  this.pause = false;
};

//清除所有模拟数据
LandslideSimulation.prototype.clearAll = function () {
  clearInterval(this.intervalID);
  for (let i = 0; i < this.primitives.length; i++) {
    this.viewer.scene.primitives.remove(this.primitives[i]);
  }
};

//展示指定帧数模拟数据
LandslideSimulation.prototype.showFrame = function (frame) {
  let preindex = (this.index - 1 + this.frameNum) % this.frameNum;
  let prepointCollection = this.primitives[preindex];
  if (prepointCollection.get(0).show) {
    for (let i = 0; i < prepointCollection.length; i++) {
      let p = prepointCollection.get(i);
      p.show = !p.show;
    }
  }

  let pointCollection = this.primitives[frame];
  for (let i = 0; i < pointCollection.length; i++) {
    let p = pointCollection.get(i);
    p.show = !p.show;
  }

  this.index = (frame + 1) % this.frameNum; //在指定显示帧后 讲道理下一帧应该是frame后一帧
};

//根据流体速度s设置顶点颜色
LandslideSimulation.prototype.getColor = function (value, maxS) {
  if (value === -1) {
    return Cesium.Color.fromRandom({
      red: 0.0,
      green: 0.0,
      blue: 0.0,
      alpha: 0.0,
    });
  }
  let frag = value / maxS;
  //若色带没颜色 则生成
  if (this.colorArray.length == 0) {
    for (let r = 0; r < 256; r++) {
      this.colorArray.push(
        Cesium.Color.fromRandom({
          red: 0,
          green: r / 255.0,
          blue: 1.0,
          alpha: 1.0,
        })
      );
    }
    for (let b = 0; b < 256; b++) {
      this.colorArray.push(
        Cesium.Color.fromRandom({
          red: 0,
          green: 1.0,
          blue: 1.0 - b / 255.0,
          alpha: 1.0,
        })
      );
    }
    for (let r = 0; r < 256; r++) {
      this.colorArray.push(
        Cesium.Color.fromRandom({
          red: r / 255.0,
          green: 1.0,
          blue: 0,
          alpha: 1.0,
        })
      );
    }
    for (let g = 0; g < 256; g++) {
      this.colorArray.push(
        Cesium.Color.fromRandom({
          red: 1.0,
          green: 1.0 - g / 255.0,
          blue: 0,
          alpha: 1.0,
        })
      );
    }
  }
  let section = 1 / parseFloat(this.colorArray.length - 1); //每段长度
  let index = parseInt(frag / section);
  return this.colorArray[index];
};

export default LandslideSimulation;
