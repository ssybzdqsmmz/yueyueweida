/*
 * @Author: 枫林残忆 2997534654@qq.com
 * @Date: 2024-04-09 13:22:21
 * @LastEditors: Lincong-pro lincong_pro@163.com
 * @LastEditTime: 2024-05-07 14:49:54
 * @FilePath: \Geology-v3\types\index.d.ts
 * @Description:
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 *
 */
// 此文件跟同级目录的 global.d.ts 文件一样也是全局类型声明，只不过这里存放一些零散的全局类型，无需引入直接在 .vue 、.ts 、.tsx 文件使用即可获得类型提示

type RefType<T> = T | null;

type EmitType = (event: string, ...args: any[]) => void;

type TargetContext = '_self' | '_blank';

type ComponentRef<T extends HTMLElement = HTMLDivElement> = ComponentElRef<T> | null;

type ElRef<T extends HTMLElement = HTMLDivElement> = Nullable<T>;

type AnyFunction<T> = (...args: any[]) => T;

type Writable<T> = {
	-readonly [P in keyof T]: T[P];
};

type Nullable<T> = T | null;

type ReadonlyRecordable<T = any> = {
	readonly [key: string]: T;
};

type Indexable<T = any> = {
	[key: string]: T;
};

type DeepPartial<T> = {
	[P in keyof T]?: DeepPartial<T[P]>;
};

type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

type DTTerrainTransparent = {};

type Exclusive<T, U> = (Without<T, U> & U) | (Without<U, T> & T);

type TimeoutHandle = ReturnType<typeof setTimeout>;

type IntervalHandle = ReturnType<typeof setInterval>;

type Effect = 'light' | 'dark';

interface ChangeEvent extends Event {
	target: HTMLInputElement;
}

interface WheelEvent {
	path?: EventTarget[];
}

interface ImportMetaEnv extends ViteEnv {
	__: unknown;
}

interface Fn<T = any, R = T> {
	(...arg: T[]): R;
}

interface PromiseFn<T = any, R = T> {
	(...arg: T[]): Promise<R>;
}

interface ComponentElRef<T extends HTMLElement = HTMLDivElement> {
	$el: T;
}

// declare function parseInt(s: string | number, radix?: number): number;

// declare function parseFloat(string: string | number): number;
interface ViewPoint {
	ViewPoint: {
		Orientation: {
			heading: number;
			pitch: number;
			roll: number;
		};
		Position: {
			longitude: number;
			latitude: number;
			height: number;
		};
	};
	duration: number;
}

interface Stage {
	layers: string[];
	animationPoint: ViewPoint[];
	callback: () => void;
}
