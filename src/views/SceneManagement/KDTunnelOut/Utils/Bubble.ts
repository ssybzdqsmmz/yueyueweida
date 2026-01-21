import * as $ from 'jquery';
import { Event } from 'Cesium';
import Cesium from 'Cesium';

interface BubbleOptions {
  viewer: Cesium.Viewer; // 替换为更具体的类型，例如Cesium.Viewer
}

class Bubble {
  container: HTMLElement;
  scenePosition: Cesium.Cartesian3; // 替换为更具体的类型，例如Cesium.Cartesian3
  closeEvt: Event;

  constructor(options: BubbleOptions) {
    const html = `
        <div id="bubble" class="bubble" style="bottom:0;left:82%;display:none;" >
            <div id="tools" style="text-align : right; overflow:hidden;">
                <span  style="color: rgb(95, 74, 121);padding: 5px;float:left;">对象属性</span>
                <span title="关闭" id="close" style="color:darkgrey;cursor:pointer;font-size:20px;float:right;">×</span>
            </div>
            <div style="overflow-y:scroll;height:150px" id="tableContainer"><table id="tab"></table></div>
        </div>
        `;
    $(document.body).append(html);

    $('#close').click(() => {
      // 关闭气泡
      this.scenePosition = undefined;
      this.closeEvt.raiseEvent();
      $('#bubble').hide();
    });

    this.container = document.getElementById('bubble') as HTMLElement;

    this.scenePosition = undefined;

    options.viewer.scene.postRender.addEventListener(() => {
      // 每一帧都去计算气泡的正确位置
      if (!this.scenePosition) {
        $('#bubble').hide();
        return;
      }
      $('#bubble').show();
      const scene = options.viewer.scene;
      const canvasHeight = scene.canvas.height;
      const windowPosition = new Cesium.Cartesian2();
      Cesium.SceneTransforms.wgs84ToWindowCoordinates(scene, this.scenePosition, windowPosition);
      this.container.style.bottom = canvasHeight - windowPosition.y + 45 + 'px';
      this.container.style.left = windowPosition.x - 70 + 'px';
    });

    this.closeEvt = new Event();
  }

  setPosition(pos: Cesium.Cartesian3): void {
    // 替换any为更具体的类型，例如Cesium.Cartesian3
    this.scenePosition = pos;
  }

  setContent(properties: { [key: string]: any }): void {
    const table = document.getElementById('tab') as HTMLTableElement;
    for (let i = table.rows.length - 1; i > -1; i--) {
      table.deleteRow(i);
    }
    for (const index in properties) {
      const newRow = table.insertRow();
      const cell1 = newRow.insertCell();
      const cell2 = newRow.insertCell();
      cell1.innerHTML = index;
      cell2.innerHTML = properties[index];
    }
  }
}

export default Bubble;
