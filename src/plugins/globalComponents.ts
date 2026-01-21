
import SvgIcon from '@/components/SvgIcon/index.vue'
import type { App, Component } from "vue";

const components = [SvgIcon]

export function useGlobalComponents(app: App) {
	// 全局注册组件
	components.forEach((component: Component) => {
		console.log(component.name)
		app.component(component.name, component);
	});
}