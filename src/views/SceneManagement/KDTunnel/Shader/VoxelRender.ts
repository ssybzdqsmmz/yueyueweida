import * as Cesium from 'Cesium';
import axios, { AxiosProgressEvent } from 'axios';
import Property from './Property';
export default class VoxelRender {
	/**
	 * @description:
	 * @param {string} volumeImgUrl 体素的源代码
	 * @return {void}
	 */
	constructor(volumeImgUrl: string) {
		this.imgUrl = volumeImgUrl;
	}

	// addGUI(gui: dat.GUI) {
	//   let f = gui.addFolder('Volume');

	//   f.add(this.property, 'density', 0, 50.0);
	//   f.add(this.property, 'isovalue', 0.0, 1.0);
	//   f.add(this.property, 'usecolourmap');
	//   f.add(this.property, 'mindensity', 0.0, 1.0);
	//   f.add(this.property, 'maxdensity', 0.0, 1.0);
	//   f.add(this.property, 'filterAlpha');
	//   f.add(this.property, 'samples', 200, 1024); // 定义采样步长
	// }

	init(frameState: any) {
		frameState.multiSample = 8;
		//!vao初始化 @ts-ignore
		let vao = this.box([0.0, 0.0, 0.0], this.boxSize, frameState);
		//!切片纹理加载
		let sliceTexture = this.generateTexture(frameState);
		//@ts-ignore
		this.generateGradientTexture(frameState);

		let that = this;
		//!uniform变量初始化
		this.uniformMap = {
			uVolume() {
				return sliceTexture;
			},
			uSamples() {
				return that.property.samples;
			},
			//用于求交的边界点->左下角
			uBBMin() {
				return {
					x: that.property.xmin,
					y: that.property.ymin,
					z: that.property.zmin,
				};
			},
			//用于求交的边界点->右上角
			uBBMax() {
				return {
					x: that.property.xmax,
					y: that.property.ymax,
					z: that.property.zmax,
				};
			},
			uIsoColour() {
				return {
					x: that.property.colour[0],
					y: that.property.colour[1],
					z: that.property.colour[2],
					w: that.property.isoalpha,
				};
			},
			uResolution() {
				return {
					x: that.property.resolution[0],
					y: that.property.resolution[1],
					z: that.property.resolution[2],
				};
			},
			uIsoSmooth() {
				return that.property.isosmooth;
			},
			uIsoValue() {
				return that.property.isovalue;
			},
			uIsoWalls() {
				return that.property.isowalls;
			},
			uDensityFactor() {
				return that.property.density;
			},
			uDenMinMax() {
				return {
					x: that.property.mindensity,
					y: that.property.maxdensity,
				};
			},
			uRange() {
				return {
					x: 0.0,
					y: 1.0,
				};
			},
			uFilter() {
				return that.property.tricubicFilter;
			},
			uPower() {
				return that.property.power;
			},
			uSaturation() {
				return that.property.saturation;
			},
			uContrast() {
				return that.property.contrast;
			},
			uBrightness() {
				return that.property.brightness;
			},
			// 控制是否显示立方体
			uEnableFilterAlpha() {
				return that.property.filterAlpha;
			},
			uEnableColour() {
				return that.property.usecolourmap;
			},
			uTransferFunction() {
				return that.gradientTexture;
			},
		};

		let volumeFSShader = this.fs;

		let volumeVSShader = this.vs;

		//@ts-ignore
		this.shaderProgram = new Cesium.ShaderProgram.fromCache({
			context: frameState.context,
			vertexShaderSource: volumeVSShader,
			fragmentShaderSource: volumeFSShader,
			attributeLocations: this.attributeLocations,
		});

		//@ts-ignore
		this.drawCommand = new Cesium.DrawCommand({
			boundingVolume: this.boundingSphere,
			modelMatrix: this.modelMatrix,
			//@ts-ignore
			pass: Cesium.Pass.OPAQUE,
			shaderProgram: this.shaderProgram, //@ts-ignore
			renderState: Cesium.RenderState.fromCache({
				depthTest: {
					enabled: true,
					func: Cesium.WebGLConstants.LEQUAL,
				},
				blending: {
					enabled: true,
					color: new Cesium.Color(0, 0, 0, 0),
				},
				cull: {
					enabled: false,
				},
			}),
			vertexArray: vao,
			primitiveType: Cesium.PrimitiveType.TRIANGLES,
			uniformMap: this.uniformMap,
		});
	}

	generateGradientTexture(frameState: any) {
		//@ts-ignore
		this.gradientTexture = new Cesium.Texture({
			context: frameState.context,
			pixelFormat: Cesium.PixelFormat.RGBA,
			pixelDataType: Cesium.ComponentDatatype.UNSIGNED_BYTE,
			source: this.gradientImage,
			flipY: false, //@ts-ignore
			sampler: new Cesium.Sampler({
				minificationFilter: Cesium.TextureMinificationFilter.NEAREST, // 替换为其他过滤器
				magnificationFilter: Cesium.TextureMagnificationFilter.NEAREST, // 替换为其他过滤器
				//@ts-ignore
				wrapS: Cesium.TextureWrap.CLAMP_TO_EDGE, // 替换为其他纹理环绕方式
				//@ts-ignore
				wrapT: Cesium.TextureWrap.CLAMP_TO_EDGE, // 替换为其他纹理环绕方式
			}),
		});
	}

	/**
	 * @description: 生成模型的包围盒 + 顶点数组
	 * @param {number} min
	 * @param {number} max
	 * @return {*}
	 */
	//@ts-ignore
	box(min: number[], max: number[], frameState: Cesium.FrameState) {
		let vertices = new Float32Array([
			min[0], //
			min[1],
			max[2],
			min[0], //
			max[1],
			max[2],
			max[0], //
			max[1],
			max[2],
			max[0], //
			min[1],
			max[2],
			min[0], //
			min[1],
			min[2],
			min[0], //
			max[1],
			min[2],
			max[0], //
			max[1],
			min[2],
			max[0], //
			min[1],
			min[2],
		]);
		let indices = new Uint16Array([3, 2, 1, 1, 0, 3, 7, 6, 2, 2, 3, 7, 6, 5, 1, 1, 2, 6, 4, 5, 1, 1, 0, 4, 4, 0, 3, 3, 7, 4, 7, 6, 5, 5, 4, 7]);

		// let vertices = new Float32Array([0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 1.0, 1.0]);

		//!生成顶点数组
		//@ts-ignore
		const positionBuffer = Cesium.Buffer.createVertexBuffer({
			//@ts-ignore
			usage: Cesium.BufferUsage.STATIC_DRAW,
			typedArray: vertices,
			context: frameState.context, //@ts-ignore
		});
		//!顶点数组对应的 attribute
		const positionAttribute = {
			index: 0,
			vertexBuffer: positionBuffer,
			componentsPerAttribute: 3, //!这个代表每个点的长度
			//@ts-ignore
			componentDatatype: Cesium.ComponentDatatype.fromTypedArray(vertices),
		};

		//!生成顶点索引
		//@ts-ignore
		const indexBuffer = Cesium.Buffer.createIndexBuffer({
			//@ts-ignore
			usage: Cesium.BufferUsage.STATIC_DRAW,
			typedArray: indices, //@ts-ignore
			indexDatatype: Cesium.ComponentDatatype.fromTypedArray(indices),
			context: frameState.context,
		});

		//!生成VAO
		//@ts-ignore
		return new Cesium.VertexArray({
			context: frameState.context,
			attributes: [positionAttribute],
			indexBuffer: indexBuffer,
		});
	}

	/**
	 * @description: 加载体渲染绘制的纹理
	 * @return {*}
	 */
	async loadTexture() {
		let response = await axios({
			method: 'GET',
			url: this.imgUrl,
			responseType: 'blob',
			withCredentials: false,
			onDownloadProgress: function (progressEvent: AxiosProgressEvent) {
				let progress = Math.round(
					//@ts-ignore
					(progressEvent.loaded * 100) / progressEvent.total
				);
			},
		});
		//@ts-ignore
		let blob: Blob = response.data;
		let image = new Image();
		image.src = window.URL.createObjectURL(blob);

		return new Promise((resolve, reject) => {
			image.onload = () => {
				resolve(image);
			};
			image.onerror = (error) => reject(error);
		});
	}

	/**
	 * @description: 加载切片影像
	 * @return {*}
	 */

	//@ts-ignore
	generateTexture(frameState: Cesium.FrameState) {
		//@ts-ignore
		return new Cesium.Texture({
			context: frameState.context,
			pixelFormat: Cesium.PixelFormat.LUMINANCE,
			pixelDataType: Cesium.ComponentDatatype.UNSIGNED_BYTE,
			source: this.image,
			flipY: false, //@ts-ignore
			sampler: new Cesium.Sampler({
				minificationFilter: Cesium.TextureMinificationFilter.NEAREST, // 替换为其他过滤器
				magnificationFilter: Cesium.TextureMagnificationFilter.NEAREST, // 替换为其他过滤器
				//@ts-ignore
				wrapS: Cesium.TextureWrap.CLAMP_TO_EDGE, // 替换为其他纹理环绕方式
				//@ts-ignore
				wrapT: Cesium.TextureWrap.CLAMP_TO_EDGE, // 替换为其他纹理环绕方式
			}),
		});
	}

	/**
	 * @description: 启用
	 * @param {any} colours gradient编辑器
	 * @param {string} jsonConfig
	 * @return {*}
	 */

	async generateWebGLConfig(colours: any, jsonConfig: string) {
		this.attributeLocations = {
			position: 0,
		};

		let image = await this.loadTexture(); // 初始化纹理
		this.image = image;

		this.property = await Property.initFromFile(
			jsonConfig, // 读取配置文件中的内容
			image
		);

		colours.read(this.property.colours);
		this.gradientImage = new Image();
		this.gradientImage.src = colours.canvas.toDataURL(); // 这个是直接赋值，只能一个

		//@ts-ignore
		this.fs = await Cesium.Resource.fetchText({
			url: 'shaders/testCesium.frag.glsl',
		});
		this.fs =
			`#extension GL_EXT_frag_depth: enable
		//Defined dynamically before compile...
    const vec2 slices = vec2(${this.property.slices[0]},${this.property.slices[1]});
    const int maxSamples = ${this.property.maxSamples};` + this.fs;
		console.warn(this.fs)
		//@ts-ignore
		this.vs = await Cesium.Resource.fetchText({
			url: 'shaders/testCesium.vert.glsl',
		});

		this.boundingSphere = new Cesium.BoundingSphere(this.property.getCenter(), 100);
		this.modelMatrix = this.property.getScaleRotateENUMat();
	}

	/**
	 * @description: 绘制Primitive的方法
	 * @return {*}
	 */
	//@ts-ignore
	update(frameState: Cesium.FrameState) {
		if (!this.show) {
			return;
		}
		if (!Cesium.defined(this.drawCommand)) {
			this.init(frameState);
		}

		frameState.commandList.push(this.drawCommand);
	}

	/**
	 * @description: 调用destroy方法
	 * @return {*}
	 */

	destroy() {
		if (Cesium.defined(this.drawCommand)) {
			this.drawCommand.shaderProgram = this.shaderProgram && this.shaderProgram.destroy();
		}
	}

	show: boolean = true;
	boxSize: number[] = [1, 1, 1];
	imgUrl: string; // 体渲染的切片影像
	//@ts-ignore
	image: Image; //@ts-ignore
	property: Property; // 体渲染相关的参数

	gradientTexture: any;
	gradientImage: any;
	//@ts-ignore
	uniformMap: any;
	attributeLocations: any; //@ts-ignore
	modelMatrix: Cesium.Matrix4; //@ts-ignore
	shaderProgram: Cesium.ShaderProgram; //@ts-ignore
	boundingSphere: Cesium.BoundingSphere;

	//@ts-ignore
	drawCommand: Cesium.DrawCommand;
	//@ts-ignore
	fs: string; //@ts-ignore
	vs: string;
}
