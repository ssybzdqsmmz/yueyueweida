/*
 * @Descripttion: 滚石打击模拟类
 * @version:
 * @Author: JinYiGao
 * @Date: 2021-04-15 15:47:11
 * @LastEditors: anganao
 * @LastEditTime: 2023-12-11 14:43:38
 */
import * as Cesium from 'Cesium';
import { request } from '@/utils/Network/Request.ts';
import SimulationProcess from './SimulationProcess';

function StoneSimulation(options) {
  this.viewer = options.viewer;
  this.url = options.url;
  this.loop = options.loop || false; // 是否循环模拟
  this.maxEkin = 0.0;
  this.minEkin = 0.0; // 最大最小能量
  this.n = 80; // 合并n个点为一个polyline
  this.frameNum = 0; // 动态绘制帧数 ---相当于不断延展的线段数 或者 点数
  this.primitives = []; // 需要绘制的primitives ----每一条路径相当于一个primitive
  this.stones = []; // 滚石模型
  this.linesPosiiton = [];
  this.lastindex = 0;
  this.colorArray = []; // 分级色带
  this.speed = 200; // 滚石下落速度
  this.intervalID = undefined;
  this.primitive = undefined;
  this.isPause = false; // 指示是否暂停
  this.finish = false; // 是否已经结束模拟
  this.startTime = undefined;
  this.duration = 12.6;
  this.index = 1;

  this.raiseHeight = 5; // raise height relative to the true height

  this.processBar = undefined; // 进度条
}
// 当前绘制的线段索引
// StoneSimulation.prototype = {
//   get index() {
//     return store.getters.disasterFrame;
//   },
//   set index(num) {
//     store.commit('dtglobe_store/setDisasterFrame', num);
//   },
// };

// 进度条功能加载
StoneSimulation.prototype.addBar = function () {
  this.processBar = new SimulationProcess();
  this.processBar.setFrames(this.primitives.length);
  this.processBar.createPlayEvent();
  this.processBar.createAdvanceEvent();
  this.processBar.createRetreatEvent();
  this.listenPlay();
};
// 监听是否播放
StoneSimulation.prototype.listenPlay = function () {
  this.listener = setInterval(() => {
    if (this.processBar.pause) {
      this.showFrame(this.processBar.currentFrame);
    }
    if (this.processBar.pause === false) {
      if (this.intervalID === undefined) {
        this.updatePrimitivesByrows();
      }
    }
  }, 200);
};

/**
 * @description: 从网络中获取数据
 * @return {*}
 */
StoneSimulation.prototype.getData = function () {
  return new Promise((resolve) => {
    request({
      url: this.url,
      withCredentials: false,
    }).then((data) => {
      const lines = data.data;
      this.maxEkin = data.maxEkin;
      this.minEkin = data.minEkin;
      resolve(lines);
    });
  });
};

/**
 * @description: 绘制滚石和路径
 * @return {*}
 */
StoneSimulation.prototype.addPrimitivesByrows = async function () {
  const lines = await this.getData();
  const stoneUrl = 'http://localhost:9999/DTCZML/DDH/stone.gltf';

  // clock settings
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].length > this.frameNum) {
      this.frameNum = lines[i].length;
    }
  }
  const { viewer } = this;

  this.startTime = Cesium.JulianDate.fromDate(new Date());
  const stop = Cesium.JulianDate.addSeconds(this.startTime, this.duration, new Cesium.JulianDate());
  viewer.clock.startTime = this.startTime.clone();
  viewer.clock.stopTime = stop.clone();
  viewer.clock.currentTime = this.startTime.clone();
  viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP; // Loop at the end
  viewer.clock.multiplier = 1;
  viewer.clock.shouldAnimate = false;
  viewer.timeline.zoomTo(this.startTime, stop);

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const property = new Cesium.SampledPositionProperty();
    const step = this.duration / line.length;

    for (let j = 0; j < line.length; j++) {
      property.addSample(
        Cesium.JulianDate.addSeconds(this.startTime, step * j, new Cesium.JulianDate()),
        Cesium.Cartesian3.fromDegrees(line[j].x, line[j].y, line[j].z + this.raiseHeight)
      );
    }

    const entity = viewer.entities.add({
      // Use our computed positions
      position: property,
      // Automatically compute orientation based on position movement.
      orientation: new Cesium.VelocityOrientationProperty(property),
      model: {
        uri: stoneUrl,
        show: true,
        minimumPixelSize: 5,
        scale: 1,
      },
    });
    this.stones.push(entity.id);
  }

  const { n } = this; // 每条线每n个点合并为一个primitive
  let i = 0;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    if (n * i > this.frameNum) {
      break;
    }

    const instances = [];
    // 遍历每条路径
    for (let num = 0; num < lines.length; num++) {
      const line = lines[num];
      const positions = [];
      const colors = [];
      if (n * i < line.length) {
        // 遍历n个点
        for (let index = n * i; index < line.length; index++) {
          // 位置写入
          positions.push(line[index].x);
          positions.push(line[index].y);
          positions.push(line[index].z + this.raiseHeight);
          // 颜色写入
          colors.push(this.getColor(line[index].Ekin));

          if (index == n * (i + 1)) {
            break;
          }
        }
        const polyline = this.getPolylineGeometry(positions, colors);
        const instance = this.getGeometryInstance(polyline);
        instances.push(instance);
      }
    }
    const primitive = new Cesium.Primitive({
      geometryInstances: instances,
      appearance: new Cesium.PolylineColorAppearance({
        translucent: false,
      }),
      show: false,
    });
    this.viewer.scene.primitives.add(primitive);
    this.primitives.push(primitive);

    i += 1;
  }
  // 添加进度跳
  this.addBar();
};

// 按行更新primitive
StoneSimulation.prototype.updatePrimitivesByrows = function () {
  const _this = this;
  const total = this.primitives.length;
  this.intervalID = setInterval(() => {
    if (!_this.processBar.pause) {
      if (_this.processBar.currentFrame === 0) {
        this.viewer.clock.shouldAnimate = true;
      }
      _this.processBar.updateCurrent((_this.processBar.currentFrame %= total));
      for (let i = 0; i < _this.primitives.length; i++) {
        if (i <= _this.processBar.currentFrame) {
          _this.primitives[i].show = true;
        } else {
          _this.primitives[i].show = false;
        }
      }
      _this.processBar.updateCurrent((_this.processBar.currentFrame += 1));
      if (_this.processBar.currentFrame === total) {
        this.viewer.clock.currentTime = this.viewer.clock.stopTime;
        this.viewer.clock.shouldAnimate = false;
        // 不循环模拟
        if (!_this.loop) {
          _this.isPause = true;
          _this.finish = true;
        }
      }
    }
  }, _this.speed);
};
//--------------------------------------------------------------

// 暂停模拟
StoneSimulation.prototype.pauseSimulation = function () {
  this.isPause = true;
  this.viewer.clock.shouldAnimate = false;
};

// 继续模拟
StoneSimulation.prototype.goonSimulation = function () {
  this.isPause = false;
  this.viewer.clock.shouldAnimate = true;
};

// 查看指定帧数据
StoneSimulation.prototype.showFrame = function (frame) {
  // this.pauseSimulation(); // 先暂停模拟
  this.index = frame;
  const total = this.primitives.length;
  this.index %= total;
  this.viewer.clock.currentTime = Cesium.JulianDate.addSeconds(this.startTime, (this.duration / total) * frame, new Cesium.JulianDate());
  for (let i = 0; i < this.primitives.length; i++) {
    if (i <= this.index) {
      this.primitives[i].show = true;
    } else {
      this.primitives[i].show = false;
    }
  }
};

// 清除所有数据
StoneSimulation.prototype.clearAll = function () {
  // 清除定时器
  clearInterval(this.intervalID);
  clearInterval(this.listener);
  // 清除primitives
  for (let i = 0; i < this.primitives.length; i++) {
    this.viewer.scene.primitives.remove(this.primitives[i]);
  }
  // 清除滚石模型
  this.stones.forEach((stone) => {
    this.viewer.entities.removeById(stone);
  });
  // 删除进度条
  this.processBar.father.removeChild(this.processBar.backElm);
};
//------------------------------------------------------------------------

// 更新线段show属性
StoneSimulation.prototype.updatePrimitives = function (context, frameState, commandList) {
  const _this = this;
  this.intervalID = setInterval(() => {
    _this.index %= _this.frameNum; // 下一步需要绘制的线段索引
    // 遍历每一条线段primitive
    for (let i = 0; i < _this.primitives.length; i++) {
      const instances = _this.primitives[i].geometryInstances;
      // 更改每一条线段里polyline的show
      // 若当前需绘制线段索引大于改路径线段数 则跳过绘制
      for (let j = 0; j < instances.length; j++) {
        if (j <= _this.index) {
          instances[j].attributes.show = new Cesium.ShowGeometryInstanceAttribute(true);
        } else {
          instances[j].attributes.show = new Cesium.ShowGeometryInstanceAttribute(false);
        }
      }
      // _this.primitives[i].update(context, frameState, commandList);
    }
    _this.index += 30;
  }, _this.speed);
};
//--------------------------------------------------------------------------------------

// ----------下面的才是最终效果最好的----------emmmmm 我在放屁 也卡到爆
// 初始化加载primitive
StoneSimulation.prototype.init = async function () {
  // this.viewer.camera.flyTo({
  //   destination: Cesium.Cartesian3.fromDegrees(78.140787, 34.767127, 4763.77),
  // });
  const lines = await this.getData();

  // 遍历每一条路径 生成当前帧下的polyline
  const instances = [];
  for (let i = 0; i < lines.length; i++) {
    this.linesPosiiton.push(lines[i]);
    const line = lines[i];
    // 选取点数最多的路径上的线段数
    if (line.length > this.frameNum) {
      this.frameNum = line.length - 1;
    }

    let maxindex = 0; // 当前帧下应到的索引点位
    const positions = [];
    const colors = [];
    if (this.index < line.length - 1) {
      maxindex = this.index + 1;
    } else {
      maxindex = line.length - 1;
    }
    // 遍历当前帧下应显示的点 组装为polyline
    for (let index = 0; index <= maxindex; index++) {
      positions.push(line[index].x, line[index].y, line[index].z);
      colors.push(this.getColor(line[index].Ekin));
    }
    const polylin = this.getPolylineGeometry(positions, colors);
    const instance = this.getGeometryInstance(polylin);
    instances.push(instance);
  }
  const primitive = new Cesium.Primitive({
    geometryInstances: instances,
    releaseGeometryInstances: false,
    appearance: new Cesium.PolylineColorAppearance({
      translucent: false,
    }),
    asynchronous: false,
  });
  this.primitive = primitive;
};

// 回调 更新
StoneSimulation.prototype.update = function (context, frameState, commandList) {
  const _this = this;
  if (_this.lastindex != _this.index) {
    _this.lastindex = _this.index;
    _this.index %= _this.frameNum; // 下一步需要绘制的线段索引
    // 遍历每一条线段primitive
    for (let i = 0; i < _this.primitives.length; i++) {
      const instances = _this.primitives[i].geometryInstances;
      // 更改每一条线段里polyline的show
      // 若当前需绘制线段索引大于改路径线段数 则跳过绘制
      for (let j = 0; j < instances.length; j++) {
        if (j <= _this.index) {
          instances[j].attributes.show = new Cesium.ShowGeometryInstanceAttribute(true);
        } else {
          instances[j].attributes.show = new Cesium.ShowGeometryInstanceAttribute(false);
        }
      }
      _this.primitives[i].update(context, frameState, commandList);
    }
  }
};

// 更新index
StoneSimulation.prototype.updateindex = function () {
  const _this = this;
  this.intervalID = setInterval(() => {
    _this.index = (_this.index + 100) % _this.frameNum;
  }, _this.speed);
};
//-----------------------------------------------------------------------------------

// ------------------------------------------------一些辅助的函数-----------------
// 获取geometry图元
StoneSimulation.prototype.getPolylineGeometry = function (positions, colors) {
  const polyline = new Cesium.PolylineGeometry({
    positions: Cesium.Cartesian3.fromDegreesArrayHeights(positions),
    width: 1.0,
    colors,
    colorsPerVertex: true,
    vertexFormat: Cesium.PolylineColorAppearance.VERTEX_FORMAT,
  });

  return polyline;
};

// geometry图元生成geometryinstance
StoneSimulation.prototype.getGeometryInstance = function (geometry) {
  const instance = new Cesium.GeometryInstance({
    geometry,
    attributes: {
      show: new Cesium.ShowGeometryInstanceAttribute(true),
    },
  });
  return instance;
};

// 计算点位颜色
StoneSimulation.prototype.getColor = function (value) {
  const frag = (value - this.minEkin) / (this.maxEkin - this.minEkin);
  // 若色带没颜色 则生成
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
  const section = 1 / parseFloat(this.colorArray.length - 1); // 每段长度
  const index = parseInt(frag / section);
  return this.colorArray[index];
};

export default StoneSimulation;
