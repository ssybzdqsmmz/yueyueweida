/*
 * @Author: 枫林残忆 2997534654@qq.com
 * @Date: 2024-03-31 09:27:23
 * @LastEditors: 枫林残忆 2997534654@qq.com
 * @LastEditTime: 2024-03-31 13:57:27
 * @FilePath: \Geology-V3\src\views\SceneManagement\Tests\Primitives\VoxelPrimitive.ts
 * @Description: 
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved. 
 * 
 */

import Cesium from "Cesium";
import { PropertyCollection } from './VoxelPrimitive.d'



export default class VoxelPrimitive {
	//! 记住，DrawCommand一定不要有什么异步函数，异步操作一定是外面完成的
	constructor(center: Cesium.BoundingSphere, modelMatrix: Cesium.Matrix4,
		vs: string, fs: string,
		sliceImage: HTMLImageElement, gradientImage: HTMLImageElement, properties: PropertyCollection) {
		this.sliceImage = sliceImage;
		this.gradientImage = gradientImage;
		this.properties = properties;
		this.center = center;
		this.vs = vs;
		this.fs = fs;
		this.modelMatrix = modelMatrix;
	}


	/**
	 * @description: 下面这个函数是Cesium调用绘制的函数
	 * @param {any} frameState 
	 */
	//@ts-ignore
	init(frameState: Cesium.FrameState) {
		frameState.multiSample = 8;


		let vao = this.createVAO([0.0, 0.0, 0.0], this.boxSize, frameState);
		let sliceTexture = this.createTexture(this.sliceImage, frameState);

		let gradientTexture = this.createGradientTexture(this.gradientImage, frameState);

		let uniformMap = this.createUniformMap(sliceTexture, gradientTexture)
		this.createShaderProgram(frameState)


		//@ts-ignore
		this.drawCommand = new Cesium.DrawCommand({
			boundingVolume: this.center,
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
			uniformMap: uniformMap,
		});
	}

	/**
	 * @description: 下面这个函数是Cesium调用更新回调函数
	 * @param {any} frameState 
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
	 * @return {void}
	 */
	destroy() {
		if (Cesium.defined(this.drawCommand)) {
			this.drawCommand.shaderProgram =
				this.shaderProgram && this.shaderProgram.destroy();
		}
	}

	/**
	 * @description: 
	 * @param {number} min 立方体的左下角
	 * @param {number} max 立方体的右上角
	 * @param {Cesium.FrameState} frameState 帧状态（可以理解为webglcontext）
	 * @return {Cesium.VertexArray} vao
	 */
	//@ts-ignore
	private createVAO(min: number[], max: number[], frameState: Cesium.FrameState) {
		let vertices = new Float32Array([
			min[0], min[1], max[2], //
			min[0], max[1], max[2], //
			max[0], max[1], max[2], //
			max[0], min[1], max[2], //
			min[0], min[1], min[2], //
			min[0], max[1], min[2], //
			max[0], max[1], min[2], //
			max[0], min[1], min[2], //
		]);
		let indices = new Uint16Array([
			3, 2, 1,
			1, 0, 3,
			7, 6, 2,
			2, 3, 7,
			6, 5, 1,
			1, 2, 6,
			4, 5, 1,
			1, 0, 4,
			4, 0, 3,
			3, 7, 4,
			7, 6, 5,
			5, 4, 7,
		]);
		//!生成顶点数组
		//@ts-ignore
		const positionBuffer = Cesium.Buffer.createVertexBuffer({
			//@ts-ignore
			usage: Cesium.BufferUsage.STATIC_DRAW,
			typedArray: vertices, //@ts-ignore
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
			indexDatatype: Cesium.ComponentDatatype.fromTypedArray(indices), //@ts-ignore
			context: frameState.context,
		});

		//!生成VAO
		//@ts-ignore
		return new Cesium.VertexArray({ //@ts-ignore
			context: frameState.context,
			attributes: [positionAttribute],
			indexBuffer: indexBuffer,
		});
	}

	/**
	 * @description: 创建用于采样的 2D 切片纹理
	 * @return {*}
	 */
	//@ts-ignore
	private createTexture(image: HTMLImageElement, frameState: Cesium.FrameState) {
		//@ts-ignore
		return new Cesium.Texture({
			context: frameState.context,
			pixelFormat: Cesium.PixelFormat.LUMINANCE,
			pixelDataType: Cesium.ComponentDatatype.UNSIGNED_BYTE,
			source: image,
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
	 * @description: 创建用于体素颜色变换的 Transfer Function Source
	 * @return {*}
	 */
	//@ts-ignore
	private createGradientTexture(gradientImage: HTMLImageElement, frameState: Cesium.FrameState) {	//@ts-ignore
		return new Cesium.Texture({
			context: frameState.context,
			pixelFormat: Cesium.PixelFormat.RGBA,
			pixelDataType: Cesium.ComponentDatatype.UNSIGNED_BYTE,
			source: gradientImage,
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

	//@ts-ignore
	private createUniformMap(sliceTexture: Cesium.Texture, gradientTexture: Cesium.Texture) {
		let that = this;
		return {
			//! 下面是直接体渲染相关的属性
			uVolume() {
				return sliceTexture;
			},
			uTransferFunction() {
				return gradientTexture;
			},
			uSamples() {
				return that.properties.samples;
			},
			//用于求交的边界点->左下角
			uBBMin() {
				return {
					x: that.properties.xmin,
					y: that.properties.ymin,
					z: that.properties.zmin,
				};
			},
			// 长、宽、高
			uResolution() {
				return {
					x: that.properties.resolution[0],
					y: that.properties.resolution[1],
					z: that.properties.resolution[2],
				};
			},
			//用于求交的边界点->右上角
			uBBMax() {
				return {
					x: that.properties.xmax,
					y: that.properties.ymax,
					z: that.properties.zmax,
				};
			},
			uDensityFactor() {
				return that.properties.density;
			},
			uDenMinMax() {
				return {
					x: that.properties.mindensity,
					y: that.properties.maxdensity,
				};
			},
			uRange() {
				return {
					x: 0.0,
					y: 1.0,
				};
			},
			uFilter() {
				return that.properties.tricubicFilter;
			},
			uPower() {
				return that.properties.power;
			},
			//! 发射-吸收光学模型
			uSaturation() {
				return that.properties.saturation;
			},
			uContrast() {
				return that.properties.contrast;
			},
			uBrightness() {
				return that.properties.brightness;
			},
			//! 下面是间接体渲染 - MarchingCubes 等值面重建的属性
			// 等值面的颜色
			uIsoColour() {
				return {
					x: that.properties.colour[0],
					y: that.properties.colour[1],
					z: that.properties.colour[2],
					w: that.properties.isoalpha,
				};
			},
			// 等值面的平滑度
			uIsoSmooth() {
				return that.properties.isosmooth;
			},
			uIsoValue() {
				return that.properties.isovalue;
			},
			uIsoWalls() {
				return that.properties.isowalls;
			},
			//! 下面是控制相关的属性
			uEnableFilterAlpha() {
				return that.properties.filterAlpha;
			},
			uEnableColour() {
				return that.properties.usecolourmap;
			},

		}
	}

	//@ts-ignore
	private createShaderProgram(frameState: Cesium.FrameState) {
		let attributeLocations = {
			position: 0,
		}
		// 增加一些宏定义
		this.fs = `#extension GL_EXT_frag_depth: enable
		//Defined dynamically before compile...
    const vec2 slices = vec2(${this.properties.slices[0]},${this.properties.slices[1]});
    const int maxSamples = ${this.properties.maxSamples};` + this.fs;

		//@ts-ignore
		this.shaderProgram = new Cesium.ShaderProgram.fromCache({
			context: frameState.context,
			vertexShaderSource: this.vs,
			fragmentShaderSource: this.fs,
			attributeLocations: attributeLocations,
		});
	}


	sliceImage: HTMLImageElement;
	gradientImage: HTMLImageElement;


	boxSize = [1.0, 1.0, 1.0]
	center: Cesium.BoundingSphere;
	modelMatrix: Cesium.Matrix4;

	show: boolean = true; // 用于像原生primitive一样调用 primitive.show = false
	//@ts-ignore
	drawCommand: Cesium.DrawCommand; // 实际的绘制命令
	//@ts-ignore
	shaderProgram: Cesium.ShaderProgram; // 这个是顶点和片段着色器程序
	vs: string; // shaderProgram对应的shader source
	fs: string;

	properties: PropertyCollection; // 用于控制体素显示的属性
}