import {
	Setting
} from "../object/th.setting.js"
import {
	Definition_Manager
} from "../object/th.definition_manager.js"
import {
	Texture_Manager
} from "../object/th.texture_manager.js"
import {
	GameMap
} from "./th.map.js"

import {
	Position
} from "./th.vector.js"

export class Scene {
	constructor(args = {}) {
		this.three = new THREE.Scene();
		this.gameMaps = new Map(); // 储存GameMap实例
		this.nowGameMapId = null; // 现在的GameMap

		// 调试辅助
		let grid = new THREE.GridHelper(16, 16);
		this.three.add(grid);
		let axes = new THREE.AxesHelper(10);
		this.three.add(axes);
		const color = 0xFFFFFF;
		const intensity1 = 0.6;
		const light1 = new THREE.DirectionalLight(color, intensity1);
		light1.position.set(0, 0, 10);
		light1.target.position.set(0, 0, 0);
		light1.castShadow = true;
		this.three.add(light1);
		this.three.add(light1.target);
		const intensity2 = 1.2;
		const light2 = new THREE.DirectionalLight(color, intensity2);
		light2.position.set(0, 10, 0);
		light2.target.position.set(0, 0, 0);
		light2.castShadow = true;
		this.three.add(light2);
		this.three.add(light2.target);
		let al = new THREE.AmbientLight(0xffffff, 0.2);
		this.three.add(al);
	}
	
	update(){
		if (this.nowGameMap) {
			this.nowGameMap.update(); // 更新地图
		}
	}

	loadGameMap(mapId) {
		let mapData = Definition_Manager.get("map", mapId);
		// 创建GameMap实例
		const gameMap = new GameMap(mapData);
		gameMap.sendEvent("createMap")
		const mapGroup = gameMap.three.group;
		mapGroup.name = `map_${mapId}`;

		// 保存引用
		this.gameMaps.set(mapId, gameMap);

		// 添加到场景
		this.three.add(mapGroup);
		mapGroup.visible = false; // 初始不可见
		return gameMap;
	}

	switchGameMap(id) {
		if (this.nowGameMap) this.nowGameMap.three.group.visible = false;
		let map = this.gameMaps.get(id); // 获取map
		this.nowGameMapId = id;
		this.nowGameMap.three.group.visible = true;
	}
	
	get nowGameMap() {
		return this.gameMaps.get(this.nowGameMapId);
	}
}