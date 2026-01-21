/*eslint-disable*/
/**
 * WebGL interface object
 * standard utilities for WebGL
 * Shader & matrix utilities for 3d & 2d
 * functions for 2d rendering / image processing
 * (c) Owen Kaluza 2012
 */
// import hello, { mat4 } from './gl-matrix';
import { mat4 } from 'gl-matrix';

/**
 * @constructor
 */
export function Viewport(x, y, width, height) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
}

/**
 * @constructor
 */
export default function WebGL(canvas, options) {
  this.program = null;
  this.modelView = new ViewMatrix();
  this.perspective = new ViewMatrix();
  this.textures = [];
  this.timer = null;

  if (!window.WebGLRenderingContext) throw 'No browser WebGL support';

  // Try to grab the standard context. If it fails, fallback to experimental.
  try {
    this.gl = canvas.getContext('webgl', options) || canvas.getContext('experimental-webgl', options);
  } catch (e) {
    throw 'No context';
  }
  this.viewport = new Viewport(0, 0, canvas.width, canvas.height);
  if (!this.gl) throw 'Failed to get context';
}

WebGL.prototype.setMatrices = function () {
  //Model view matrix
  this.gl.uniformMatrix4fv(this.program.mvMatrixUniform, false, this.modelView.matrix);
  //Perspective matrix
  this.gl.uniformMatrix4fv(this.program.pMatrixUniform, false, this.perspective.matrix);
  //Normal matrix
  if (this.program.nMatrixUniform) {
    var nMatrix = mat4.create(this.modelView.matrix);
    mat4.inverse(nMatrix);
    mat4.transpose(nMatrix);
    this.gl.uniformMatrix4fv(this.program.nMatrixUniform, false, nMatrix);
  }
};

WebGL.prototype.initDraw2d = function () {
  this.gl.viewport(this.viewport.x, this.viewport.y, this.viewport.width, this.viewport.height);

  this.gl.enableVertexAttribArray(this.program.attributes['aVertexPosition']);
  this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexPositionBuffer);
  this.gl.vertexAttribPointer(this.program.attributes['aVertexPosition'], this.vertexPositionBuffer.itemSize, this.gl.FLOAT, false, 0, 0);

  if (this.program.attributes['aTextureCoord']) {
    this.gl.enableVertexAttribArray(this.program.attributes['aTextureCoord']);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.textureCoordBuffer);
    this.gl.vertexAttribPointer(this.program.attributes['aTextureCoord'], this.textureCoordBuffer.itemSize, this.gl.FLOAT, false, 0, 0);
  }

  this.setMatrices();
};

WebGL.prototype.updateTexture = function (texture, image, unit) {
  //Set default texture unit if not provided
  if (unit == undefined) unit = this.gl.TEXTURE0;
  this.gl.activeTexture(unit);
  this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
  this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, image);
  this.gl.bindTexture(this.gl.TEXTURE_2D, null);
};

WebGL.prototype.init2dBuffers = function (unit) {
  //Set default texture unit if not provided
  if (unit == undefined) unit = this.gl.TEXTURE0;
  //All output drawn onto a single 2x2 quad
  this.vertexPositionBuffer = this.gl.createBuffer();
  this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexPositionBuffer);
  var vertexPositions = [1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, -1.0];
  this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(vertexPositions), this.gl.STATIC_DRAW);
  this.vertexPositionBuffer.itemSize = 2;
  this.vertexPositionBuffer.numItems = 4;

  //Gradient texture
  this.gl.activeTexture(unit);
  this.gradientTexture = this.gl.createTexture();
  this.gl.bindTexture(this.gl.TEXTURE_2D, this.gradientTexture);

  this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);
  this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST);

  //Texture coords
  this.textureCoordBuffer = this.gl.createBuffer();
  this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.textureCoordBuffer);
  var textureCoords = [1.0, 1.0, 0.0, 1.0, 1.0, 0.0, 0.0, 0.0];
  this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(textureCoords), this.gl.STATIC_DRAW);
  this.textureCoordBuffer.itemSize = 2;
  this.textureCoordBuffer.numItems = 4;
};

WebGL.prototype.loadTexture = function (image, filter) {
  if (filter == undefined) filter = this.gl.NEAREST;
  this.texid = this.textures.length;
  this.textures.push(this.gl.createTexture());
  this.gl.bindTexture(this.gl.TEXTURE_2D, this.textures[this.texid]);
  //this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, true);
  //(Ability to set texture type?)
  this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.LUMINANCE, this.gl.LUMINANCE, this.gl.UNSIGNED_BYTE, image);
  //this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, image);
  this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, filter);
  this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, filter);
  this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
  this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
  this.gl.bindTexture(this.gl.TEXTURE_2D, null);
  return this.textures[this.texid];
};

WebGL.prototype.setPerspective = function (fovy, aspect, znear, zfar) {
  this.perspective.matrix = mat4.perspective(fovy, aspect, znear, zfar);
};

WebGL.prototype.use = function (program) {
  this.program = program;
  if (this.program.program) this.gl.useProgram(this.program.program);
};

/**
 * @constructor
 */
//Program object
export function WebGLProgram(gl, vs, fs) {
  //Can be passed source directly or script tag
  this.program = null;
  // if (vs.indexOf("main") < 0) vs = getSourceFromElement(vs);
  // if (fs.indexOf("main") < 0) fs = getSourceFromElement(fs);
  //Pass in vertex shader, fragment shaders...
  this.gl = gl;
  if (this.program && this.gl.isProgram(this.program)) {
    //Clean up previous shader set
    if (this.gl.isShader(this.vshader)) {
      this.gl.detachShader(this.program, this.vshader);
      this.gl.deleteShader(this.vshader);
    }
    if (this.gl.isShader(this.fshader)) {
      this.gl.detachShader(this.program, this.fshader);
      this.gl.deleteShader(this.fshader);
    }
    this.gl.deleteProgram(this.program); //Required for chrome, doesn't like re-using this.program object
  }

  this.program = this.gl.createProgram();

  this.vshader = this.compileShader(vs, this.gl.VERTEX_SHADER);
  this.fshader = this.compileShader(fs, this.gl.FRAGMENT_SHADER);

  this.gl.attachShader(this.program, this.vshader);
  this.gl.attachShader(this.program, this.fshader);

  this.gl.linkProgram(this.program);

  if (!this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS)) {
    throw 'Could not initialise shaders: ' + this.gl.getProgramInfoLog(this.program);
  }
}

WebGLProgram.prototype.compileShader = function (source, type) {
  //alert("Compiling " + type + " Source == " + source);
  var shader = this.gl.createShader(type);
  this.gl.shaderSource(shader, source);
  this.gl.compileShader(shader);
  if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) throw this.gl.getShaderInfoLog(shader);
  return shader;
};

//Setup and load uniforms
WebGLProgram.prototype.setup = function (attributes, uniforms, noenable) {
  if (!this.program) return;
  if (attributes == undefined) attributes = ['aVertexPosition', 'aTextureCoord'];
  this.attributes = {};
  var i;
  for (i in attributes) {
    this.attributes[attributes[i]] = this.gl.getAttribLocation(this.program, attributes[i]);
    if (!noenable) this.gl.enableVertexAttribArray(this.attributes[attributes[i]]);
  }

  this.uniforms = {};
  for (i in uniforms) this.uniforms[uniforms[i]] = this.gl.getUniformLocation(this.program, uniforms[i]);
  this.mvMatrixUniform = this.gl.getUniformLocation(this.program, 'uMVMatrix');
  this.pMatrixUniform = this.gl.getUniformLocation(this.program, 'uPMatrix');
  this.nMatrixUniform = this.gl.getUniformLocation(this.program, 'uNMatrix');
};

/**
 * @constructor
 */
function ViewMatrix() {
  this.matrix = mat4.create();
  mat4.identity(this.matrix);
  this.stack = [];
}

ViewMatrix.prototype.toString = function () {
  return JSON.stringify(this.toArray());
};

ViewMatrix.prototype.toArray = function () {
  return JSON.parse(mat4.str(this.matrix));
};

ViewMatrix.prototype.push = function (m) {
  if (m) {
    this.stack.push(mat4.create(m));
    this.matrix = mat4.create(m);
  } else {
    this.stack.push(mat4.create(this.matrix));
  }
};

ViewMatrix.prototype.pop = function () {
  if (this.stack.length == 0) {
    throw 'Matrix stack underflow';
  }
  this.matrix = this.stack.pop();
  return this.matrix;
};

ViewMatrix.prototype.mult = function (m) {
  mat4.multiply(this.matrix, m);
};

ViewMatrix.prototype.identity = function () {
  mat4.identity(this.matrix);
};

ViewMatrix.prototype.scale = function (v) {
  mat4.scale(this.matrix, v);
};

ViewMatrix.prototype.translate = function (v) {
  mat4.translate(this.matrix, v);
};

ViewMatrix.prototype.rotate = function (angle, v) {
  var arad = (angle * Math.PI) / 180.0;
  mat4.rotate(this.matrix, arad, v);
};

//!  存储单个颜色信息
/**
 * @constructor
 */
export function Colour(colour) {
  //Construct... stores colour as r,g,b,a values
  //Can pass in html colour string, HSV object, Colour object or integer rgba
  if (typeof colour == 'undefined') this.set('#ffffff');
  else if (typeof colour == 'string') this.set(colour);
  else if (typeof colour == 'object') {
    //Determine passed type, Colour, RGBA or HSV
    if (typeof colour.H != 'undefined')
      //HSV
      this.setHSV(colour);
    else if (typeof colour.red != 'undefined') {
      //Another Colour object
      this.red = colour.red;
      this.green = colour.green;
      this.blue = colour.blue;
      this.alpha = colour.alpha;
    } else if (colour.R) {
      //RGBA
      this.red = colour.R;
      this.green = colour.G;
      this.blue = colour.B;
      this.alpha = typeof colour.A == 'undefined' ? 1.0 : colour.A;
    } else {
      //Assume array
      this.red = colour[0];
      this.green = colour[1];
      this.blue = colour[2];
      //Convert float components to [0-255]
      //NOTE: This was commented, not sure where the problem was
      //Needed for parsing JSON array [0,1] colours
      if (this.red <= 1.0 && this.green <= 1.0 && this.blue <= 1.0) {
        this.red = Math.round(this.red * 255);
        this.green = Math.round(this.green * 255);
        this.blue = Math.round(this.blue * 255);
      }
      this.alpha = typeof colour[3] == 'undefined' ? 1.0 : colour[3];
    }
  } else {
    //Convert from integer AABBGGRR
    this.fromInt(colour);
  }
}

Colour.prototype.set = function (val) {
  if (!val) val = '#ffffff'; //alert("No Value provided!");
  var re = /^rgba?\((\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,?\s*(\d\.?\d*)?\)$/;
  var bits = re.exec(val);
  if (bits) {
    this.red = parseInt(bits[1]);
    this.green = parseInt(bits[2]);
    this.blue = parseInt(bits[3]);
    this.alpha = typeof bits[4] == 'undefined' ? 1.0 : parseFloat(bits[4]);
  } else if (val.charAt(0) == '#') {
    var hex = val.substring(1, 7);
    this.alpha = 1.0;
    this.red = parseInt(hex.substring(0, 2), 16);
    this.green = parseInt(hex.substring(2, 4), 16);
    this.blue = parseInt(hex.substring(4, 6), 16);
  } else {
    //Attempt to parse as integer
    this.fromInt(parseInt(val));
  }
};

Colour.prototype.fromInt = function (intcolour) {
  //Convert from integer AABBGGRR
  this.red = intcolour & 0x000000ff;
  this.green = (intcolour & 0x0000ff00) >>> 8;
  this.blue = (intcolour & 0x00ff0000) >>> 16;
  this.alpha = ((intcolour & 0xff000000) >>> 24) / 255.0;
};

Colour.prototype.toInt = function () {
  //Convert to integer AABBGGRR
  var result = this.red;
  result += this.green << 8;
  result += this.blue << 16;
  result += Math.round(this.alpha * 255) << 24;
  return result;
};

Colour.prototype.toString = function () {
  return this.html();
};

Colour.prototype.html = function () {
  return 'rgba(' + this.red + ',' + this.green + ',' + this.blue + ',' + this.alpha.toFixed(2) + ')';
};

Colour.prototype.rgbaGL = function () {
  var arr = [this.red / 255.0, this.green / 255.0, this.blue / 255.0, this.alpha];
  return new Float32Array(arr);
};

Colour.prototype.rgbaGLSL = function () {
  var c = this.rgbaGL();
  return 'rgba(' + c[0].toFixed(4) + ',' + c[1].toFixed(4) + ',' + c[2].toFixed(4) + ',' + c[3].toFixed(4) + ')';
};

Colour.prototype.rgba = function () {
  var rgba = [this.red / 255.0, this.green / 255.0, this.blue / 255.0, this.alpha];
  return rgba;
};

Colour.prototype.rgbaObj = function () {
  //OK.debug('R:' + this.red + ' G:' + this.green + ' B:' + this.blue + ' A:' + this.alpha);
  return { R: this.red, G: this.green, B: this.blue, A: this.alpha };
};

Colour.prototype.print = function () {
  OK.debug(this.printString(true));
};

Colour.prototype.printString = function (alpha) {
  return 'R:' + this.red + ' G:' + this.green + ' B:' + this.blue + (alpha ? ' A:' + this.alpha : '');
};

Colour.prototype.HEX = function (o) {
  o = Math.round(Math.min(Math.max(0, o), 255));
  return '0123456789ABCDEF'.charAt((o - (o % 16)) / 16) + '0123456789ABCDEF'.charAt(o % 16);
};

Colour.prototype.htmlHex = function (o) {
  return '#' + this.HEX(this.red) + this.HEX(this.green) + this.HEX(this.blue);
};

Colour.prototype.hex = function (o) {
  //hex RGBA in expected order
  return this.HEX(this.red) + this.HEX(this.green) + this.HEX(this.blue) + this.HEX(this.alpha * 255);
};

Colour.prototype.hexGL = function (o) {
  //RGBA for openGL (stored ABGR internally on little endian)
  return this.HEX(this.alpha * 255) + this.HEX(this.blue) + this.HEX(this.green) + this.HEX(this.red);
};

Colour.prototype.setHSV = function (o) {
  var R,
    G,
    A,
    B,
    C,
    S = o.S / 100,
    V = o.V / 100,
    H = o.H / 360;

  if (S > 0) {
    if (H >= 1) H = 0;

    H = 6 * H;
    F = H - Math.floor(H);
    A = Math.round(255 * V * (1 - S));
    B = Math.round(255 * V * (1 - S * F));
    C = Math.round(255 * V * (1 - S * (1 - F)));
    V = Math.round(255 * V);

    switch (Math.floor(H)) {
      case 0:
        R = V;
        G = C;
        B = A;
        break;
      case 1:
        R = B;
        G = V;
        B = A;
        break;
      case 2:
        R = A;
        G = V;
        B = C;
        break;
      case 3:
        R = A;
        G = B;
        B = V;
        break;
      case 4:
        R = C;
        G = A;
        B = V;
        break;
      case 5:
        R = V;
        G = A;
        B = B;
        break;
    }

    this.red = R ? R : 0;
    this.green = G ? G : 0;
    this.blue = B ? B : 0;
  } else {
    this.red = V = Math.round(V * 255);
    this.green = V;
    this.blue = V;
  }
  this.alpha = typeof o.A == 'undefined' ? 1.0 : o.A;
};

Colour.prototype.HSV = function () {
  var r = this.red / 255.0; //RGB values = 0 ÷ 255
  var g = this.green / 255.0;
  var b = this.blue / 255.0;

  var min = Math.min(r, g, b); //Min. value of RGB
  var max = Math.max(r, g, b); //Max. value of RGB
  let deltaMax = max - min; //Delta RGB value

  var v = max;
  var s, h;
  var deltaRed, deltaGreen, deltaBlue;

  if (deltaMax == 0) {
    //This is a gray, no chroma...
    h = 0; //HSV results = 0 ÷ 1
    s = 0;
  } //Chromatic data...
  else {
    s = deltaMax / max;

    deltaRed = ((max - r) / 6 + deltaMax / 2) / deltaMax;
    deltaGreen = ((max - g) / 6 + deltaMax / 2) / deltaMax;
    deltaBlue = ((max - b) / 6 + deltaMax / 2) / deltaMax;

    if (r == max) h = deltaBlue - deltaGreen;
    else if (g == max) h = 1 / 3 + deltaRed - deltaBlue;
    else if (b == max) h = 2 / 3 + deltaGreen - deltaRed;

    if (h < 0) h += 1;
    if (h > 1) h -= 1;
  }

  return { H: 360 * h, S: 100 * s, V: v * 100 };
};

Colour.prototype.HSVA = function () {
  var hsva = this.HSV();
  hsva.A = this.alpha;
  return hsva;
};

Colour.prototype.interpolate = function (other, lambda) {
  //Interpolate between this colour and another by lambda
  this.red = Math.round(this.red + lambda * (other.red - this.red));
  this.green = Math.round(this.green + lambda * (other.green - this.green));
  this.blue = Math.round(this.blue + lambda * (other.blue - this.blue));
  this.alpha = Math.round(this.alpha + lambda * (other.alpha - this.alpha));
};

Colour.prototype.blend = function (src) {
  //Blend this colour with another and return result (uses src alpha from other colour)
  return new Colour([
    Math.round((1.0 - src.alpha) * this.red + src.alpha * src.red),
    Math.round((1.0 - src.alpha) * this.green + src.alpha * src.green),
    Math.round((1.0 - src.alpha) * this.blue + src.alpha * src.blue),
    (1.0 - src.alpha) * this.alpha + src.alpha * src.alpha,
  ]);
};

//!  作为存储序列的结构
/**
 * @constructor
 */
function ColourPos(colour, pos) {
  //Stores colour as rgba and position as real [0,1]
  if (pos == undefined) this.position = 0.0;
  else this.position = parseFloat(pos);
  //Detect out of range...
  if (this.position >= 0 && this.position <= 1) {
    if (colour) {
      if (typeof colour == 'object') this.colour = colour;
      else this.colour = new Colour(colour);
    } else {
      this.colour = new Colour('#000000');
    }
  } else {
    throw 'Invalid Colour Position: ' + pos;
  }
}

/**
 * @constructor
 */
function Palette(source, premultiply) {
  this.premultiply = premultiply;
  //Default transparent black background
  this.background = new Colour('rgba(0,0,0,0)');
  //Colour palette array
  this.colours = [];
  this.slider = new Image();
  this.slider.src =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAPCAYAAAA2yOUNAAAAj0lEQVQokWNIjHT8/+zZs//Pnj37/+TJk/9XLp/+f+bEwf9HDm79v2Prqv9aKrz/GUYVEaeoMDMQryJXayWIoi0bFmFV1NWS+z/E1/Q/AwMDA0NVcez/LRsWoSia2luOUAADVcWx/xfO6/1/5fLp/1N7y//HhlmhKoCBgoyA/w3Vyf8jgyyxK4CBUF8zDAUAAJRXY0G1eRgAAAAASUVORK5CYII=';

  if (!source) {
    //Default greyscale
    this.colours.push(new ColourPos('rgba(255,255,255,1)', 0));
    this.colours.push(new ColourPos('rgba(0,0,0,1)', 1.0));
    return;
  }

  var calcPositions = false;

  if (typeof source == 'string') {
    //Palette string data parser
    var lines = source.split(/[\n;]/); // split on newlines and/or semi-colons
    var position;
    for (var i = 0; i < lines.length; i++) {
      var line = lines[i].trim();
      if (!line) continue;

      //Palette: parse into attrib=value pairs
      var pair = line.split('=');
      if (pair[0] == 'Background') this.background = new Colour(pair[1]);
      else if (pair[0][0] == 'P')
        //Very old format: PositionX=
        position = parseFloat(pair[1]);
      else if (pair[0][0] == 'C') {
        //Very old format: ColourX=
        //Colour constructor handles html format colours, if no # or rgb/rgba assumes integer format
        this.colours.push(new ColourPos(pair[1], position));
        //Some old palettes had extra colours at end which screws things up so check end position
        if (position == 1.0) break;
      } else if (pair.length == 2) {
        //New style: position=value
        this.colours.push(new ColourPos(pair[1], pair[0]));
      } else {
        //Interpret as colour only, calculate positions
        calcPositions = true;
        this.colours.push(new ColourPos(line));
      }
    }
  } else {
    //JSON colour/position list data
    for (var j = 0; j < source.length; j++) {
      //Calculate default positions if none provided
      if (source[j].position == undefined) calcPositions = true;
      //Create the entry
      this.colours.push(new ColourPos(source[j].colour, source[j].position));
    }
    //Use background if included
    if (source.background) this.background = new Colour(source.background);
  }

  //Calculate default positions
  if (calcPositions) {
    for (var j = 0; j < this.colours.length; j++) this.colours[j].position = j * (1.0 / (this.colours.length - 1));
  }

  //Sort by position (fix out of order entries in old palettes)
  this.sort();

  //Check for all-transparent palette and fix
  var opaque = false;
  for (var c = 0; c < this.colours.length; c++) {
    if (this.colours[c].colour.alpha > 0) opaque = true;
    //Fix alpha=255
    if (this.colours[c].colour.alpha > 1.0) this.colours[c].colour.alpha = 1.0;
  }
  if (!opaque) {
    for (var c = 0; c < this.colours.length; c++) this.colours[c].colour.alpha = 1.0;
  }
}

Palette.prototype.sort = function () {
  this.colours.sort(function (a, b) {
    return a.position - b.position;
  });
};

Palette.prototype.newColour = function (position, colour) {
  var col = new ColourPos(colour, position);
  this.colours.push(col);
  this.sort();
  for (var i = 1; i < this.colours.length - 1; i++) if (this.colours[i].position == position) return i;
  return -1;
};

Palette.prototype.inRange = function (pos, range, length) {
  for (var i = 0; i < this.colours.length; i++) {
    var x = this.colours[i].position * length;
    if (pos == x || (range > 1 && pos >= x - range / 2 && pos <= x + range / 2)) return i;
  }
  return -1;
};

Palette.prototype.inDragRange = function (pos, range, length) {
  for (var i = 1; i < this.colours.length - 1; i++) {
    var x = this.colours[i].position * length;
    if (pos == x || (range > 1 && pos >= x - range / 2 && pos <= x + range / 2)) return i;
  }
  return 0;
};

Palette.prototype.remove = function (i) {
  this.colours.splice(i, 1);
};

Palette.prototype.toString = function () {
  var paletteData = 'Background=' + this.background.html();
  for (var i = 0; i < this.colours.length; i++) paletteData += '\n' + this.colours[i].position.toFixed(6) + '=' + this.colours[i].colour.html();
  return paletteData;
};

Palette.prototype.get = function () {
  var obj = {};
  obj.background = this.background.html();
  obj.colours = [];
  for (var i = 0; i < this.colours.length; i++) obj.colours.push({ position: this.colours[i].position, colour: this.colours[i].colour.html() });
  return obj;
};

Palette.prototype.toJSON = function () {
  return JSON.stringify(this.get());
};

//Palette draw to canvas
Palette.prototype.draw = function (canvas, ui) {
  //Slider image not yet loaded?
  if (!this.slider.width && ui) {
    var _this = this;
    setTimeout(function () {
      _this.draw(canvas, ui);
    }, 150);
    return;
  }

  // Figure out if a webkit browser is being used
  if (!canvas) {
    alert('Invalid canvas!');
    return;
  }
  var webkit = /webkit/.test(navigator.userAgent.toLowerCase());

  if (this.colours.length == 0) {
    this.background = new Colour('#ffffff');
    this.colours.push(new ColourPos('#000000', 0));
    this.colours.push(new ColourPos('#ffffff', 1));
  }

  //Colours might be out of order (especially during editing)
  //so save a (shallow) copy and sort it
  let list = this.colours.slice(0);
  list.sort(function (a, b) {
    return a.position - b.position;
  });

  if (canvas.getContext) {
    //Draw the gradient(s)
    var width = canvas.width;
    var height = canvas.height;
    var context = canvas.getContext('2d');
    context.clearRect(0, 0, width, height);

    if (webkit) {
      //Split up into sections or webkit draws a fucking awful gradient with banding
      var x0 = 0;
      for (var i = 1; i < list.length; i++) {
        var x1 = Math.round(width * list[i].position);
        context.fillStyle = context.createLinearGradient(x0, 0, x1, 0);
        var colour1 = list[i - 1].colour;
        var colour2 = list[i].colour;
        //Pre-blend with background unless in UI mode
        if (this.premultiply && !ui) {
          colour1 = this.background.blend(colour1);
          colour2 = this.background.blend(colour2);
        }
        context.fillStyle.addColorStop(0.0, colour1.html());
        context.fillStyle.addColorStop(1.0, colour2.html());
        context.fillRect(x0, 0, x1 - x0, height);
        x0 = x1;
      }
    } else {
      //Single gradient
      context.fillStyle = context.createLinearGradient(0, 0, width, 0);
      for (var i = 0; i < list.length; i++) {
        var colour = list[i].colour;
        //Pre-blend with background unless in UI mode
        if (this.premultiply && !ui) colour = this.background.blend(colour);
        context.fillStyle.addColorStop(list[i].position, colour.html());
      }
      context.fillRect(0, 0, width, height);
    }

    /* Posterise mode (no gradients)
    var x0 = 0;
    for (var i = 1; i < list.length; i++) {
      var x1 = Math.round(width * list[i].position);
      //Pre-blend with background unless in UI mode
      var colour2 = ui ? list[i].colour : this.background.blend(list[i].colour);
      context.fillStyle = colour2.html();
      context.fillRect(x0, 0, x1-x0, height);
      x0 = x1;
    }
    */

    //Background colour
    var bg = document.getElementById('backgroundCUR');
    if (bg) bg.style.background = this.background.html();

    //User interface controls
    if (!ui) return; //Skip drawing slider interface
    for (var i = 1; i < list.length - 1; i++) {
      var x = Math.floor(width * list[i].position) + 0.5;
      var HSV = list[i].colour.HSV();
      if (HSV.V > 50) context.strokeStyle = 'black';
      else context.strokeStyle = 'white';
      context.beginPath();
      context.moveTo(x, 0);
      context.lineTo(x, canvas.height);
      context.closePath();
      context.stroke();
      x -= this.slider.width / 2;
      context.drawImage(this.slider, x, 0);
    }
  } else alert('getContext failed!');
};

/**
 * @constructor
 */
export function GradientEditor(canvas, callback, premultiply, nopicker, scrollable) {
  this.canvas = canvas;
  this.callback = callback;
  this.premultiply = premultiply;
  this.changed = true;
  this.inserting = false;
  this.editing = null;
  this.element = null;
  this.spin = 0;
  this.scrollable = scrollable;
  var self = this;
  function saveColour(val) {
    self.save(val);
  }
  function abortColour() {
    self.cancel();
  }
  // if (!nopicker)
  //   this.picker = new ColourPicker(this.save.bind(this), this.cancel.bind(this));

  //Create default palette object (enable premultiply if required)
  this.palette = new Palette(null, premultiply);
  //Event handling for palette
  // this.canvas.mouse = new Mouse(this.canvas, this);
  this.canvas.oncontextmenu = 'return false;';
  this.canvas.oncontextmenu = function () {
    return false;
  };

  //this.update();
}

//Palette management
GradientEditor.prototype.read = function (source) {
  //Read a new palette from source data
  this.palette = new Palette(source, this.premultiply);
  this.reset();
  this.update(true);
};

GradientEditor.prototype.update = function (nocallback) {
  //Redraw and flag change
  this.changed = true;
  this.palette.draw(this.canvas, true);
  //Trigger callback if any
  if (!nocallback && this.callback) this.callback(this);
};

//Draw gradient to passed canvas if data has changed
//If no changes, return false
GradientEditor.prototype.get = function (canvas, cache) {
  if (cache && !this.changed) return false;
  this.changed = false;
  //Update passed canvas
  this.palette.draw(canvas, false);
  return true;
};

GradientEditor.prototype.insert = function (position, x, y) {
  //Flag unsaved new colour
  this.inserting = true;
  var col = new Colour();
  this.editing = this.palette.newColour(position, col);
  this.update();
  //Edit new colour
  this.picker.pick(col, x, y);
};

GradientEditor.prototype.editBackground = function (element) {
  this.editing = -1;
  var offset = findElementPos(element); //From mouse.js
  this.element = element;
  this.picker.pick(this.palette.background, offset[0] + 32, offset[1] + 32);
};

GradientEditor.prototype.edit = function (val, x, y) {
  if (typeof val == 'number') {
    this.editing = val;
    this.picker.pick(this.palette.colours[val].colour, x, y);
  } else if (typeof val == 'object') {
    //Edit element
    this.cancel(); //Abort any current edit first
    this.element = val;
    var col = new Colour(val.style.backgroundColor);
    var offset = findElementPos(val); //From mouse.js
    this.picker.pick(col, offset[0] + 32, offset[1] + 32);
  }
  this.update();
};

GradientEditor.prototype.save = function (val) {
  if (this.editing != null) {
    if (this.editing >= 0)
      //Update colour with selected
      this.palette.colours[this.editing].colour.setHSV(val);
    //Update background colour with selected
    else this.palette.background.setHSV(val);
  }
  if (this.element) {
    var col = new Colour(0);
    col.setHSV(val);
    this.element.style.backgroundColor = col.html();
    if (this.element.onchange) this.element.onchange(); //Call change function
  }
  this.reset();
  this.update();
};

GradientEditor.prototype.cancel = function () {
  //If aborting a new colour add, delete it
  if (this.editing >= 0 && this.inserting) this.palette.remove(this.editing);
  this.reset();
  this.update();
};

GradientEditor.prototype.reset = function () {
  //Reset editing data
  this.inserting = false;
  this.editing = null;
  this.element = null;
};

//Mouse event handling
GradientEditor.prototype.click = function (event, mouse) {
  //this.changed = true;
  if (event.ctrlKey) {
    //Flip
    for (var i = 0; i < this.palette.colours.length; i++) this.palette.colours[i].position = 1.0 - this.palette.colours[i].position;
    this.update();
    return false;
  }

  //Use non-scrolling position
  if (!this.scrollable) mouse.x = mouse.clientx;

  if (mouse.slider != null) {
    //Slider moved, update texture
    mouse.slider = null;
    this.palette.sort(); //Fix any out of order colours
    this.update();
    return false;
  }
  var pal = this.canvas;
  if (pal.getContext) {
    this.cancel(); //Abort any current edit first
    var context = pal.getContext('2d');
    var ypos = findElementPos(pal)[1] + 30;

    //Get selected colour
    //In range of a colour pos +/- 0.5*slider width?
    var i = this.palette.inRange(mouse.x, this.palette.slider.width, pal.width);
    if (i >= 0) {
      if (event.button == 0) {
        //Edit colour on left click
        this.edit(i, event.clientX - 128, ypos);
      } else if (event.button == 2) {
        //Delete on right click
        this.palette.remove(i);
        this.update();
      }
    } else {
      //Clicked elsewhere, add new colour
      this.insert(mouse.x / pal.width, event.clientX - 128, ypos);
    }
  }
  return false;
};

GradientEditor.prototype.down = function (event, mouse) {
  return false;
};

GradientEditor.prototype.move = function (event, mouse) {
  if (!mouse.isdown) return true;

  //Use non-scrolling position
  if (!this.scrollable) mouse.x = mouse.clientx;

  if (mouse.slider == null) {
    //Colour slider dragged on?
    var i = this.palette.inDragRange(mouse.x, this.palette.slider.width, this.canvas.width);
    if (i > 0) mouse.slider = i;
  }

  if (mouse.slider == null) mouse.isdown = false; //Abort action if not on slider
  else {
    if (mouse.x < 1) mouse.x = 1;
    if (mouse.x > this.canvas.width - 1) mouse.x = this.canvas.width - 1;
    //Move to adjusted position and redraw
    this.palette.colours[mouse.slider].position = mouse.x / this.canvas.width;
    this.update(true);
  }
};

GradientEditor.prototype.wheel = function (event, mouse) {
  if (this.timer) clearTimeout(this.timer);
  else this.canvas.style.cursor = 'wait';
  this.spin += 0.01 * event.spin;
  //this.cycle(0.01 * event.spin);
  var this_ = this;
  this.timer = setTimeout(function () {
    this_.cycle(this_.spin);
    this_.spin = 0;
  }, 150);
};

GradientEditor.prototype.leave = function (event, mouse) {};

GradientEditor.prototype.cycle = function (inc) {
  this.canvas.style.cursor = 'default';
  this.timer = null;
  //Shift all colours cyclically
  for (var i = 1; i < this.palette.colours.length - 1; i++) {
    var x = this.palette.colours[i].position;
    x += inc;
    if (x <= 0) x += 1.0;
    if (x >= 1.0) x -= 1.0;
    this.palette.colours[i].position = x;
  }
  this.palette.sort(); //Fix any out of order colours
  this.update();
};
