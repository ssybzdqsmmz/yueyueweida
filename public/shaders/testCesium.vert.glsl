precision highp float;
attribute vec3 position;
void main() {
    gl_Position = czm_modelViewProjection * vec4(position, 1.0); // 裁剪坐标系
}