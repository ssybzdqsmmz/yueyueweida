import { singleTon } from '../utils/DesignMode'
interface UIInterface {
	layerPanel: boolean; // 左侧面板
	header: boolean; // header面板
}

class UIConfig {
	async loadConfig(jsonPath: string): Promise<void> {
		let data = await fetch(jsonPath).then(response => {
			return response.json();
		})
		this.uiConfig = data;
	}

	getConfig() {
		return this.uiConfig;
	}

	uiConfig: UIInterface;
}

export default singleTon(UIConfig)